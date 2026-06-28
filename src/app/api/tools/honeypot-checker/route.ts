import { NextResponse } from "next/server";

export const revalidate = 300;

const CHAIN_NAMES: Record<string, string> = {
  "1": "Ethereum",
  "56": "BNB Chain",
  "8453": "Base",
  "137": "Polygon",
  "42161": "Arbitrum",
  "10": "Optimism",
  "43114": "Avalanche",
};

const HONEYPOT_SUPPORTED = new Set(["1", "56", "8453"]);

function isEvmAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function boolValue(value: any): boolean | null {
  if (value === "1" || value === 1 || value === true) return true;
  if (value === "0" || value === 0 || value === false) return false;
  return null;
}

function percentValue(value: any) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "Unknown";
  return `${num.toFixed(num > 10 ? 0 : 2)}%`;
}

function numeric(value: any) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function getLevel(score: number) {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

async function fetchHoneypot(tokenAddress: string, chainId: string) {
  if (!HONEYPOT_SUPPORTED.has(chainId)) return null;

  const url = `https://api.honeypot.is/v2/IsHoneypot?address=${tokenAddress}&chainID=${chainId}`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) return null;
  return res.json();
}

async function fetchGoPlus(tokenAddress: string, chainId: string) {
  const url = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${tokenAddress}`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const tokenAddress = String(body?.tokenAddress || "").trim();
    const chainId = String(body?.chainId || "1");

    if (!isEvmAddress(tokenAddress)) {
      return NextResponse.json(
        { error: "Invalid EVM token contract address" },
        { status: 400 },
      );
    }

    const [honeypotData, goPlusData] = await Promise.all([
      fetchHoneypot(tokenAddress, chainId),
      fetchGoPlus(tokenAddress, chainId),
    ]);

    const goToken =
      goPlusData?.result?.[tokenAddress.toLowerCase()] ||
      goPlusData?.result?.[tokenAddress] ||
      null;

    let riskScore = 15;
    const redFlags: string[] = [];
    const positiveSigns: string[] = [];
    const recommendations: string[] = [];

    const hpSummary = honeypotData?.summary || {};
    const hpSimulation = honeypotData?.simulationResult || {};
    const hpToken = honeypotData?.token || {};

    const isHoneypot =
      typeof honeypotData?.honeypotResult?.isHoneypot === "boolean"
        ? honeypotData.honeypotResult.isHoneypot
        : null;

    if (isHoneypot === true) {
      riskScore += 45;
      redFlags.push(
        "Honeypot simulation suggests this token may block selling.",
      );
    }

    if (isHoneypot === false) {
      riskScore -= 10;
      positiveSigns.push(
        "Honeypot simulation did not mark the token as a honeypot.",
      );
    }

    const buyTax =
      hpSimulation?.buyTax !== undefined
        ? numeric(hpSimulation.buyTax)
        : numeric(goToken?.buy_tax);

    const sellTax =
      hpSimulation?.sellTax !== undefined
        ? numeric(hpSimulation.sellTax)
        : numeric(goToken?.sell_tax);

    const transferTax = numeric(goToken?.transfer_pausable);

    if (buyTax >= 10) {
      riskScore += 10;
      redFlags.push("Buy tax appears high.");
    }

    if (sellTax >= 10) {
      riskScore += 15;
      redFlags.push("Sell tax appears high.");
    }

    if (sellTax >= 50) {
      riskScore += 25;
      redFlags.push("Sell tax is extremely high and may trap holders.");
    }

    const cannotSellAll = boolValue(goToken?.cannot_sell_all);
    const isBlacklist = boolValue(goToken?.is_blacklisted);
    const isWhitelist = boolValue(goToken?.is_whitelisted);
    const isMintable = boolValue(goToken?.is_mintable);
    const canTakeBackOwnership = boolValue(goToken?.can_take_back_ownership);
    const ownerChangeBalance = boolValue(goToken?.owner_change_balance);
    const hiddenOwner = boolValue(goToken?.hidden_owner);
    const selfdestruct = boolValue(goToken?.selfdestruct);
    const externalCall = boolValue(goToken?.external_call);
    const isProxy = boolValue(goToken?.is_proxy);

    if (cannotSellAll) {
      riskScore += 25;
      redFlags.push("Token may restrict holders from selling all tokens.");
    }

    if (isBlacklist) {
      riskScore += 20;
      redFlags.push("Blacklist function detected.");
    }

    if (isWhitelist) {
      riskScore += 15;
      redFlags.push("Whitelist restriction detected.");
    }

    if (isMintable) {
      riskScore += 15;
      redFlags.push("Mint function detected, meaning supply may be increased.");
    }

    if (canTakeBackOwnership) {
      riskScore += 15;
      redFlags.push("Owner may be able to take back ownership.");
    }

    if (ownerChangeBalance) {
      riskScore += 20;
      redFlags.push("Owner may be able to change holder balances.");
    }

    if (hiddenOwner) {
      riskScore += 20;
      redFlags.push("Hidden owner risk detected.");
    }

    if (selfdestruct) {
      riskScore += 15;
      redFlags.push("Self-destruct function risk detected.");
    }

    if (externalCall) {
      riskScore += 10;
      redFlags.push("External call risk detected.");
    }

    if (isProxy) {
      riskScore += 10;
      redFlags.push("Proxy contract detected, logic may be upgradeable.");
    }

    if (redFlags.length === 0) {
      positiveSigns.push(
        "No major GoPlus token security red flags were detected.",
      );
    }

    if (buyTax > 0 || sellTax > 0) {
      recommendations.push(
        "Review buy and sell taxes before trading this token.",
      );
    }

    recommendations.push(
      "Check liquidity depth and LP lock status before interacting.",
      "Verify the contract on the official block explorer.",
      "Avoid tokens with blacklist, hidden owner, or extreme sell tax risks.",
      "This tool is educational only and does not guarantee token safety.",
    );

    if (positiveSigns.length === 0) {
      positiveSigns.push("No strong positive security signals were detected.");
    }

    riskScore = Math.max(0, Math.min(100, riskScore));

    return NextResponse.json({
      tokenAddress,
      chainId,
      chainName: CHAIN_NAMES[chainId] || "Unknown Chain",
      riskScore,
      level: getLevel(riskScore),
      isHoneypot,
      sellable: isHoneypot === null ? null : !isHoneypot,
      buyTax: percentValue(buyTax),
      sellTax: percentValue(sellTax),
      transferTax: percentValue(transferTax),
      tokenName: hpToken?.name || goToken?.token_name || "",
      tokenSymbol: hpToken?.symbol || goToken?.token_symbol || "",
      redFlags,
      positiveSigns,
      recommendations,
      sourceNote: HONEYPOT_SUPPORTED.has(chainId)
        ? "Using Honeypot.is simulation and GoPlus token security where available."
        : "Using GoPlus token security. Honeypot.is simulation currently focuses on Ethereum, BNB Chain, and Base.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to check honeypot risk" },
      { status: 500 },
    );
  }
}
