import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { address, chain } = await request.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Valid contract address is required." },
        { status: 400 },
      );
    }

    const cleanAddress = address.trim().toLowerCase();

    // GoPlus API Chain IDs: Ethereum = 1, BSC = 56, Base = 8453, Arbitrum = 42161
    const chainMap: Record<string, string> = {
      ethereum: "1",
      bsc: "56",
      base: "8453",
      arbitrum: "42161",
    };

    const chainId = chainMap[chain] || "1";

    // Fetch live token security analysis from GoPlus Security API (Free, no key required)
    const res = await fetch(
      `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${cleanAddress}`,
    );
    const json = await res.json();

    const resultData = json?.result?.[cleanAddress];

    if (!resultData) {
      return NextResponse.json(
        {
          error:
            "Token data not found. Please verify contract address and network.",
        },
        { status: 404 },
      );
    }

    // Process real security flags
    const isHoneypot = resultData.is_honeypot === "1";
    const buyTax = Math.round(parseFloat(resultData.buy_tax || "0") * 100);
    const sellTax = Math.round(parseFloat(resultData.sell_tax || "0") * 100);
    const isLpLocked =
      resultData.lp_holder_count > 0 || resultData.is_in_dex === "1";

    // Calculate risk score
    let score = 10;
    const redFlags: string[] = [];
    const positiveSignals: string[] = [];

    if (isHoneypot) {
      score += 60;
      redFlags.push(
        "Honeypot detected: Token cannot be sold or charges 100% tax.",
      );
    }
    if (sellTax > 10) {
      score += 20;
      redFlags.push(`High sell tax detected: ${sellTax}%.`);
    }
    if (resultData.cannot_sell_all === "1") {
      score += 25;
      redFlags.push(
        "Cannot sell all tokens: Contract restricts full balance liquidations.",
      );
    }

    if (!isHoneypot && sellTax <= 5)
      positiveSignals.push(
        "Token can be sold freely with low transaction tax.",
      );
    if (resultData.is_open_source === "1")
      positiveSignals.push(
        "Smart contract source code is verified on block explorer.",
      );
    if (resultData.owner_change_balance === "0")
      positiveSignals.push(
        "Owner cannot arbitrarily modify user token balances.",
      );

    return NextResponse.json({
      success: true,
      data: {
        score: Math.min(score, 100),
        isHoneypot,
        buyTax,
        sellTax,
        bundledSupplyPct: Math.round(
          parseFloat(resultData.owner_percent || "0") * 100,
        ),
        lpBurnedOrLocked: isLpLocked,
        ownerRenounced:
          resultData.owner_address ===
          "0x0000000000000000000000000000000000000000",
        top10Concentration: Math.round(
          parseFloat(resultData.token_holder_count || "0"),
        ),
        redFlags,
        positiveSignals,
        tokenName: resultData.token_name || "Verified Token",
        tokenSymbol: resultData.token_symbol || "TOKEN",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to perform live security scan." },
      { status: 500 },
    );
  }
}
