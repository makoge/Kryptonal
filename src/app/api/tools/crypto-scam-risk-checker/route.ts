import { NextResponse } from "next/server";

export const revalidate = 300;

function getLevel(score: number) {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = String(body?.input || "").trim();

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const value = input.toLowerCase();

    let riskScore = 15;

    const redFlags: string[] = [];
    const positiveSigns: string[] = [];
    const recommendations: string[] = [];

    if (
      value.includes("guaranteed") ||
      value.includes("double your money") ||
      value.includes("100% profit") ||
      value.includes("risk free")
    ) {
      riskScore += 25;
      redFlags.push(
        "Input contains language linked to unrealistic profit promises.",
      );
    }

    if (
      value.includes("airdrop claim") ||
      value.includes("connect wallet") ||
      value.includes("seed phrase") ||
      value.includes("private key")
    ) {
      riskScore += 25;
      redFlags.push(
        "Input includes wallet-connection or private-key related risk terms.",
      );
    }

    if (
      value.includes("telegram") ||
      value.includes("whatsapp") ||
      value.includes("dm me")
    ) {
      riskScore += 10;
      redFlags.push(
        "Input references private messaging channels often used in scams.",
      );
    }

    if (value.startsWith("http://")) {
      riskScore += 15;
      redFlags.push("Website uses HTTP instead of HTTPS.");
    }

    if (
      value.includes(".xyz") ||
      value.includes(".top") ||
      value.includes(".click") ||
      value.includes(".live")
    ) {
      riskScore += 10;
      redFlags.push("Domain extension may require extra verification.");
    }

    if (/^0x[a-fA-F0-9]{40}$/.test(input)) {
      riskScore -= 5;
      positiveSigns.push(
        "Input appears to be a valid EVM wallet or token contract format.",
      );
      recommendations.push(
        "Check the address on Etherscan, BaseScan, BscScan, PolygonScan, or the relevant chain explorer.",
      );
    }

    if (value.startsWith("https://")) {
      riskScore -= 5;
      positiveSigns.push("Website uses HTTPS.");
    }

    if (
      value.includes("docs") ||
      value.includes("whitepaper") ||
      value.includes("audit") ||
      value.includes("github")
    ) {
      riskScore -= 10;
      positiveSigns.push(
        "Input mentions documentation, audit, or development transparency.",
      );
    }

    if (redFlags.length === 0) {
      redFlags.push(
        "No major text-based scam signals were detected from the input alone.",
      );
    }

    if (positiveSigns.length === 0) {
      positiveSigns.push(
        "No strong positive trust signals were detected from the input alone.",
      );
    }

    recommendations.push(
      "Never share your seed phrase or private key.",
      "Verify official links from multiple sources before connecting your wallet.",
      "Check liquidity, token holders, audits, and contract activity before trusting a project.",
      "This result is educational and should not be treated as financial advice.",
    );

    riskScore = Math.max(0, Math.min(100, riskScore));

    const level = getLevel(riskScore);

    return NextResponse.json({
      riskScore,
      level,
      redFlags,
      positiveSigns,
      recommendations,
      summary:
        level === "Critical"
          ? "This input shows several high-risk warning signs. Avoid interacting until fully verified."
          : level === "High"
            ? "This input shows multiple risk signals. Extra caution and manual verification are recommended."
            : level === "Medium"
              ? "Some risk signals may exist. Review the project carefully before taking action."
              : "No major scam signals were detected from this basic check, but manual verification is still required.",
    });
  } catch {
    return NextResponse.json({
      riskScore: 50,
      level: "High",
      redFlags: ["The checker could not fully analyze this input."],
      positiveSigns: [
        "No confirmed malicious activity was detected by this basic fallback.",
      ],
      recommendations: [
        "Verify the project manually before connecting a wallet or sending funds.",
        "Never share your seed phrase or private key.",
      ],
      summary:
        "The tool returned a safe fallback result because the request could not be processed fully.",
    });
  }
}
