import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "ethers";

export const dynamic = "force-dynamic";

const CHAINS = [
  {
    name: "Ethereum",
    key: "ethereum",
    explorer: "https://etherscan.io/address/",
  },
  {
    name: "Base",
    key: "base",
    explorer: "https://basescan.org/address/",
  },
  {
    name: "Arbitrum",
    key: "arbitrum",
    explorer: "https://arbiscan.io/address/",
  },
  {
    name: "Optimism",
    key: "optimism",
    explorer: "https://optimistic.etherscan.io/address/",
  },
  {
    name: "Polygon",
    key: "polygon",
    explorer: "https://polygonscan.com/address/",
  },
  {
    name: "BNB Chain",
    key: "bsc",
    explorer: "https://bscscan.com/address/",
  },
];

function scoreWallet(address: string) {
  const lower = address.toLowerCase();

  let score = 70;
  const warnings: string[] = [];
  const strengths: string[] = [];

  const isBurn =
    lower === "0x0000000000000000000000000000000000000000" ||
    lower === "0x000000000000000000000000000000000000dead";

  if (isBurn) {
    return {
      score: 5,
      level: "Critical",
      warnings: [
        "This is a burn/null address. Do not send funds unless you fully understand the purpose.",
      ],
      strengths: [],
    };
  }

  if (lower.startsWith("0x0000")) {
    score -= 15;
    warnings.push("This address has an unusual vanity-style prefix.");
  }

  if (lower.endsWith("dead")) {
    score -= 25;
    warnings.push(
      "This address ends with 'dead', which is often used for burn or vanity addresses.",
    );
  }

  if (lower.length === 42) {
    score += 10;
    strengths.push("Valid EVM address format detected.");
  }

  score = Math.max(0, Math.min(100, score));

  const level =
    score >= 85
      ? "Low Risk"
      : score >= 65
        ? "Medium Risk"
        : score >= 35
          ? "High Risk"
          : "Critical";

  return { score, level, warnings, strengths };
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

  if (!isAddress(address)) {
    return NextResponse.json({
      address,
      valid: false,
      result: {
        score: 0,
        level: "Invalid",
        walletType: "Unsupported or invalid address",
        networks: [],
        warnings: ["This is not a valid EVM wallet address."],
        strengths: [],
        recommendations: [
          "Check the address again before interacting with it.",
        ],
      },
    });
  }

  const security = scoreWallet(address);

  return NextResponse.json({
    address,
    valid: true,
    result: {
      score: security.score,
      level: security.level,
      walletType: "EVM compatible wallet",
      networks: CHAINS.map((chain) => ({
        name: chain.name,
        explorerUrl: `${chain.explorer}${address}`,
      })),
      warnings: [
        ...security.warnings,
        "This tool checks wallet format and basic risk signals only. It does not prove the wallet is safe.",
        "Always review token approvals, contract interactions, and transaction history before trusting a wallet.",
      ],
      strengths: security.strengths,
      recommendations: [
        "Check the wallet on multiple explorers.",
        "Avoid interacting with unknown contracts linked to the wallet.",
        "Do not trust random tokens or NFTs sent to the wallet.",
        "Use revoke tools to review old token approvals.",
      ],
    },
  });
}
