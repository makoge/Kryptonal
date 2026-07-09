import { NextRequest, NextResponse } from "next/server";
import Web3 from "web3";
import { prisma } from "@/lib/prisma"; // Adjust this path to wherever your PrismaClient instance is exported

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
    const transfers = body.erc20Transfers || [];

    for (const tx of transfers) {
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
      const network = chainMap[body.chainId] || "Ethereum";

      // Prisma Upsert handles creation safely and avoids crash loops if Moralis retries the webhook
      await prisma.whaleAlert.upsert({
        where: { hash: tx.transactionHash },
        update: {}, // Do nothing if it already exists
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Failed to process stream" },
      { status: 500 },
    );
  }
}
