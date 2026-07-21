import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Web3 from "web3";

export const dynamic = "force-dynamic";

const chainMap: Record<string, string> = {
  "0x1": "Ethereum",
  "0x38": "BNB Chain",
  "0x89": "Polygon",
  "0xa4b1": "Arbitrum",
  "0xa": "Optimism",
  "0x2105": "Base",
};

function analyzeWhaleMovement(
  fromLabel: string,
  toLabel: string,
  amount: number,
  symbol: string,
) {
  const safeFrom = (fromLabel || "").toLowerCase();
  const safeTo = (toLabel || "").toLowerCase();
  const isFromExchange =
    safeFrom.includes("exchange") || safeFrom.includes("binance");
  const isToExchange =
    safeTo.includes("exchange") || safeTo.includes("binance");

  if (isToExchange && !isFromExchange) {
    return {
      sentiment: "bearish",
      explanation: `A whale just moved ${amount.toLocaleString()} ${symbol} to an exchange. Large exchange inflows suggest an investor is preparing to sell, which may create downward price pressure.`,
    };
  }
  if (isFromExchange && !isToExchange) {
    return {
      sentiment: "bullish",
      explanation: `A whale withdrew ${amount.toLocaleString()} ${symbol} to a private wallet. This is usually a sign of accumulation, suggesting they plan to hold long-term.`,
    };
  }
  return {
    sentiment: "neutral",
    explanation: `Massive transfer of ${amount.toLocaleString()} ${symbol} between unknown private wallets, potentially indicating an OTC trade or cold storage balancing.`,
  };
}

// ==========================================
// 1. THE GET ROUTE (For your Frontend UI)
// ==========================================
// 1. THE GET ROUTE (For your Frontend UI)
// ==========================================
export async function GET() {
  try {
    const alerts = await prisma.whaleAlert.findMany({
      orderBy: {
        timestamp: "desc",
      },
      take: 15,
    });

    const uiFormattedResults = alerts.map((alert) => ({
      hash: alert.hash,
      asset: alert.asset,
      value: alert.valueDisplay,
      from: alert.fromLabel,
      to: alert.toLabel,
      sentiment: alert.sentiment,
      explanation: alert.explanation,
      network: alert.network,
      timestamp: alert.timestamp.toISOString(),
    }));

    return NextResponse.json({ result: uiFormattedResults });
  } catch (error) {
    console.error("Failed to fetch data via Prisma:", error);
    return NextResponse.json(
      { error: "Failed to fetch live whale data." },
      { status: 500 },
    );
  }
}

// ==========================================
// 2. THE POST ROUTE (For the Moralis Webhook)
// ==========================================
export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text();
    const signature = req.headers.get("x-signature");
    const MORALIS_SECRET = process.env.MORALIS_STREAMS_SECRET;

    if (!signature || !MORALIS_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const web3 = new Web3();
    const computedSignature = web3.utils.sha3(rawText + MORALIS_SECRET);
    if (computedSignature !== signature) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 403 });
    }

    const body = JSON.parse(rawText);
    const network = chainMap[body.chainId] || "Ethereum";

    // ==========================================
    // A. PROCESS ERC-20 TOKENS (USDT, USDC)
    // ==========================================
    const erc20Transfers = body.erc20Transfers || [];
    for (const tx of erc20Transfers) {
      const currentTx =
        body.txs.find((t: any) => t.hash === tx.transactionHash) || {};
      const tokenAmount = Number(tx.value) / 10 ** Number(tx.tokenDecimals);
      const fromLabel = currentTx.fromAddressLabel || tx.from;
      const toLabel = currentTx.toAddressLabel || tx.to;

      const analysis = analyzeWhaleMovement(
        fromLabel,
        toLabel,
        tokenAmount,
        tx.tokenSymbol,
      );
      const valueDisplay = tokenAmount.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      });

      await prisma.whaleAlert.upsert({
        where: { hash: tx.transactionHash },
        update: {},
        create: {
          hash: tx.transactionHash,
          asset: tx.tokenSymbol,
          amount: tokenAmount,
          valueDisplay: valueDisplay,
          fromLabel: fromLabel,
          toLabel: toLabel,
          sentiment: analysis.sentiment,
          explanation: analysis.explanation,
          network: network,
          timestamp: new Date(),
        },
      });
    }

    // ==========================================
    // B. PROCESS NATIVE TRANSFERS (ETH)
    // ==========================================
    const nativeTxs = body.txs || [];
    for (const tx of nativeTxs) {
      // Skip contract interactions that have a 0 ETH value
      if (!tx.value || tx.value === "0") continue;

      // Native ETH uses exactly 18 decimals (Wei)
      const tokenAmount = Number(tx.value) / 1e18;

      // Safety net: Only track if it's larger than 100 ETH (approx $300k+)
      if (tokenAmount < 100) continue;

      const fromLabel = tx.fromAddressLabel || tx.fromAddress;
      const toLabel = tx.toAddressLabel || tx.toAddress;

      // Dynamically name the coin based on the network (ETH, BNB, MATIC)
      const asset =
        network === "Polygon"
          ? "MATIC"
          : network === "BNB Chain"
            ? "BNB"
            : "Ethereum";

      const analysis = analyzeWhaleMovement(
        fromLabel,
        toLabel,
        tokenAmount,
        asset,
      );

      // Show 2 decimal places for ETH, unlike stablecoins which look better whole
      const valueDisplay = tokenAmount.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      });

      await prisma.whaleAlert.upsert({
        where: { hash: tx.hash }, // Native txs use 'hash' instead of 'transactionHash'
        update: {},
        create: {
          hash: tx.hash,
          asset: asset,
          amount: tokenAmount,
          valueDisplay: valueDisplay,
          fromLabel: fromLabel,
          toLabel: toLabel,
          sentiment: analysis.sentiment,
          explanation: analysis.explanation,
          network: network,
          timestamp: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Failed to process stream" },
      { status: 500 },
    );
  }
}
