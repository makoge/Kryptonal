import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "ethers";
import bs58 from "bs58";
import { bech32 } from "bech32";

export const dynamic = "force-dynamic";

type ChainStats = {
  txCount?: number;
  balanceLabel?: string;
  firstSeen?: string;
  lastSeen?: string;
  source?: string;
};

type Explorer = {
  name: string;
  url: string;
};

function levelFromScore(score: number) {
  if (score >= 85) return "Low Risk";
  if (score >= 65) return "Medium Risk";
  if (score >= 40) return "High Risk";
  return "Critical";
}

function daysAgo(timestamp?: number) {
  if (!timestamp) return undefined;
  const date = new Date(timestamp * 1000);
  return date.toISOString();
}

function detectAddress(address: string) {
  if (isAddress(address)) {
    return {
      valid: true,
      family: "EVM",
      network: "Ethereum / EVM",
      addressType: "EVM compatible wallet",
      confidence: "high",
      explorers: [
        { name: "Etherscan", url: `https://etherscan.io/address/${address}` },
        { name: "BaseScan", url: `https://basescan.org/address/${address}` },
        { name: "Arbiscan", url: `https://arbiscan.io/address/${address}` },
        { name: "BscScan", url: `https://bscscan.com/address/${address}` },
        {
          name: "PolygonScan",
          url: `https://polygonscan.com/address/${address}`,
        },
      ],
    };
  }

  try {
    const decoded = bs58.decode(address);
    if (decoded.length === 32) {
      return {
        valid: true,
        family: "Solana",
        network: "Solana",
        addressType: "Solana public key",
        confidence: "high",
        explorers: [
          { name: "Solscan", url: `https://solscan.io/account/${address}` },
        ],
      };
    }
  } catch {}

  try {
    const normalizedAddress = String(address).toLowerCase();
    const decoded = bech32.decode(normalizedAddress);
    if (decoded.prefix === "bc") {
      return {
        valid: true,
        family: "Bitcoin",
        network: "Bitcoin",
        addressType: "Bitcoin Bech32 address",
        confidence: "high",
        explorers: [
          { name: "Mempool", url: `https://mempool.space/address/${address}` },
        ],
      };
    }
  } catch {}

  if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)) {
    return {
      valid: true,
      family: "Bitcoin",
      network: "Bitcoin",
      addressType: "Bitcoin legacy address",
      confidence: "medium",
      explorers: [
        { name: "Mempool", url: `https://mempool.space/address/${address}` },
      ],
    };
  }

  if (/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) {
    return {
      valid: true,
      family: "Tron",
      network: "Tron",
      addressType: "TRC-20 compatible address",
      confidence: "medium",
      explorers: [
        { name: "TronScan", url: `https://tronscan.org/#/address/${address}` },
      ],
    };
  }

  if (/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)) {
    return {
      valid: true,
      family: "XRP",
      network: "XRP Ledger",
      addressType: "XRP address",
      confidence: "medium",
      explorers: [
        { name: "XRPScan", url: `https://xrpscan.com/account/${address}` },
      ],
    };
  }

  if (/^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(address)) {
    return {
      valid: true,
      family: "Dogecoin",
      network: "Dogecoin",
      addressType: "Dogecoin address",
      confidence: "medium",
      explorers: [
        { name: "Dogechain", url: `https://dogechain.info/address/${address}` },
      ],
    };
  }

  return null;
}

async function getBitcoinStats(address: string): Promise<ChainStats | null> {
  try {
    const res = await fetch(`https://blockstream.info/api/address/${address}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    const funded = Number(data.chain_stats?.funded_txo_sum || 0);
    const spent = Number(data.chain_stats?.spent_txo_sum || 0);
    const balance = (funded - spent) / 100_000_000;

    return {
      txCount:
        Number(data.chain_stats?.tx_count || 0) +
        Number(data.mempool_stats?.tx_count || 0),
      balanceLabel: `${balance.toFixed(8)} BTC`,
      source: "Blockstream",
    };
  } catch {
    return null;
  }
}

async function getSolanaStats(address: string): Promise<ChainStats | null> {
  try {
    const [balanceRes, txRes] = await Promise.all([
      fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
      }),
      fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getSignaturesForAddress",
          params: [address, { limit: 1000 }],
        }),
      }),
    ]);

    const balanceJson = await balanceRes.json();
    const txJson = await txRes.json();

    const lamports = Number(balanceJson.result?.value || 0);
    const signatures = Array.isArray(txJson.result) ? txJson.result : [];

    return {
      txCount: signatures.length,
      balanceLabel: `${(lamports / 1_000_000_000).toFixed(6)} SOL`,
      lastSeen: daysAgo(signatures[0]?.blockTime),
      source: "Solana RPC",
    };
  } catch {
    return null;
  }
}

function scoreReport({
  family,
  stats,
  address,
}: {
  family: string;
  stats: ChainStats | null;
  address: string;
}) {
  let score = 55;
  const strengths: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  strengths.push("Recognized wallet address format.");
  score += 10;

  if (stats?.txCount !== undefined) {
    if (stats.txCount === 0) {
      score -= 20;
      warnings.push(
        "No transaction activity found from the available free data source.",
      );
    } else if (stats.txCount < 5) {
      score -= 10;
      warnings.push(
        "Very low wallet activity. New wallets require extra caution.",
      );
    } else if (stats.txCount > 100) {
      score += 15;
      strengths.push("Strong transaction history detected.");
    } else {
      score += 8;
      strengths.push("Some wallet activity detected.");
    }
  } else {
    warnings.push(
      "Live transaction history is not available for this chain in the free version.",
    );
  }

  if (stats?.balanceLabel) {
    strengths.push(`Balance detected: ${stats.balanceLabel}.`);
  }

  if (family === "EVM") {
    recommendations.push(
      "Check token approvals using a revoke tool before trusting this wallet.",
    );
    recommendations.push(
      "Review activity on Etherscan, BaseScan, Arbiscan, BscScan and PolygonScan.",
    );
  }

  if (family === "Bitcoin") {
    recommendations.push(
      "Check whether the address has normal transaction history on Mempool.",
    );
  }

  if (family === "Solana") {
    recommendations.push(
      "Review token accounts, NFTs, and recent activity on Solscan.",
    );
  }

  if (family === "XRP") {
    recommendations.push("Check whether the transfer needs a destination tag.");
  }

  if (family === "Tron") {
    recommendations.push(
      "Verify TRC-20 token history on TronScan before sending funds.",
    );
  }

  if (address.toLowerCase().includes("dead")) {
    score -= 20;
    warnings.push(
      "Address contains 'dead', often used in burn or vanity addresses.",
    );
  }

  warnings.push("A good score does not prove the wallet owner is trustworthy.");
  warnings.push(
    "Never connect your wallet to unknown websites because of a wallet score.",
  );

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    level: levelFromScore(score),
    strengths,
    warnings,
    recommendations,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const address = String(body.address || "").trim();

  if (!address) {
    return NextResponse.json(
      { error: "Wallet address is required." },
      { status: 400 },
    );
  }

  const detected = detectAddress(address);

  if (!detected) {
    return NextResponse.json({
      address,
      valid: false,
      result: {
        score: 0,
        level: "Invalid",
        network: "Unknown",
        family: "Unknown",
        walletType: "Unsupported or invalid address",
        confidence: "low",
        stats: null,
        explorers: [],
        strengths: [],
        warnings: ["Kryptonal could not recognize this wallet address format."],
        recommendations: [
          "Do not send funds until you verify the address with an official wallet or explorer.",
        ],
      },
    });
  }

  let stats: ChainStats | null = null;

  if (detected.family === "Bitcoin") {
    stats = await getBitcoinStats(address);
  }

  if (detected.family === "Solana") {
    stats = await getSolanaStats(address);
  }

  const report = scoreReport({
    family: detected.family,
    stats,
    address,
  });

  return NextResponse.json({
    address,
    valid: true,
    result: {
      score: report.score,
      level: report.level,
      network: detected.network,
      family: detected.family,
      walletType: detected.addressType,
      confidence: detected.confidence,
      stats,
      explorers: detected.explorers,
      strengths: report.strengths,
      warnings: report.warnings,
      recommendations: report.recommendations,
    },
  });
}
