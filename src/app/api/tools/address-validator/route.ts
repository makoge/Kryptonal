import { NextRequest, NextResponse } from "next/server";
import { keccak_256 } from "js-sha3";
import bs58 from "bs58";

export const dynamic = "force-dynamic";

type Result = {
  valid: boolean;
  network: string;
  family: string;
  addressType: string;
  confidence: "high" | "medium" | "low";
  compatibleNetworks: string[];
  warnings: string[];
  explorerUrl?: string;
  checksum?: "valid" | "invalid" | "not_applicable" | "not_checked";
};

function isEthChecksumValid(address: string) {
  const clean = address.replace(/^0x/, "");
  const lower = clean.toLowerCase();
  const hash = keccak_256(lower);

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const hashChar = parseInt(hash[i], 16);

    if (hashChar >= 8 && char !== lower[i].toUpperCase()) return false;
    if (hashChar < 8 && char !== lower[i]) return false;
  }

  return true;
}

function validateEvm(address: string): Result | null {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return null;

  const clean = address.replace(/^0x/, "");
  const isLower = clean === clean.toLowerCase();
  const isUpper = clean === clean.toUpperCase();

  let checksum: Result["checksum"] = "not_checked";
  const warnings: string[] = [];

  if (isLower || isUpper) {
    checksum = "not_checked";
    warnings.push(
      "This EVM address is valid, but it does not use checksum casing.",
    );
  } else {
    const ok = isEthChecksumValid(address);
    checksum = ok ? "valid" : "invalid";
    if (!ok) {
      return {
        valid: false,
        network: "EVM",
        family: "EVM",
        addressType: "Invalid EIP-55 checksum",
        confidence: "high",
        compatibleNetworks: [],
        warnings: [
          "Address format is correct, but checksum casing is invalid.",
        ],
        checksum,
      };
    }
  }

  return {
    valid: true,
    network: "Ethereum / EVM",
    family: "EVM",
    addressType: "ERC-20 / EVM compatible address",
    confidence: "high",
    checksum,
    compatibleNetworks: [
      "Ethereum",
      "BNB Chain",
      "Base",
      "Arbitrum",
      "Optimism",
      "Polygon",
      "Avalanche C-Chain",
      "Fantom",
      "Linea",
      "Scroll",
    ],
    warnings: [
      ...warnings,
      "Many EVM chains share the same address format. Always choose the correct network before sending funds.",
    ],
    explorerUrl: `https://etherscan.io/address/${address}`,
  };
}

function validateSolana(address: string): Result | null {
  try {
    const decoded = bs58.decode(address);
    if (decoded.length !== 32) return null;

    return {
      valid: true,
      network: "Solana",
      family: "Solana",
      addressType: "Solana public key",
      confidence: "high",
      checksum: "not_applicable",
      compatibleNetworks: ["Solana"],
      warnings: [
        "Only send Solana assets to this address on the Solana network.",
      ],
      explorerUrl: `https://solscan.io/account/${address}`,
    };
  } catch {
    return null;
  }
}

function validateTron(address: string): Result | null {
  try {
    if (!address.startsWith("T")) return null;
    const decoded = bs58.decode(address);

    if (decoded.length !== 25 || decoded[0] !== 0x41) return null;

    return {
      valid: true,
      network: "Tron",
      family: "Tron",
      addressType: "TRC-20 compatible address",
      confidence: "high",
      checksum: "valid",
      compatibleNetworks: ["Tron"],
      warnings: ["Only send TRC-20 assets through the Tron network."],
      explorerUrl: `https://tronscan.org/#/address/${address}`,
    };
  } catch {
    return null;
  }
}

function validateByPattern(address: string): Result | null {
  const patterns: Result[] = [
    {
      valid: /^(bc1)[a-z0-9]{25,90}$/i.test(address),
      network: "Bitcoin",
      family: "Bitcoin",
      addressType: "Bech32 Bitcoin address",
      confidence: "medium",
      checksum: "not_checked",
      compatibleNetworks: ["Bitcoin"],
      warnings: [
        "This looks like a Bitcoin address. Verify it in your wallet before sending.",
      ],
      explorerUrl: `https://mempool.space/address/${address}`,
    },
    {
      valid: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address),
      network: "Bitcoin",
      family: "Bitcoin",
      addressType: "Legacy Bitcoin address",
      confidence: "medium",
      checksum: "not_checked",
      compatibleNetworks: ["Bitcoin"],
      warnings: [
        "Legacy Bitcoin address detected. Confirm wallet support before sending.",
      ],
      explorerUrl: `https://mempool.space/address/${address}`,
    },
    {
      valid: /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address),
      network: "XRP Ledger",
      family: "XRP",
      addressType: "XRP address",
      confidence: "medium",
      checksum: "not_checked",
      compatibleNetworks: ["XRP Ledger"],
      warnings: [
        "Some exchanges require an XRP destination tag. Check before sending.",
      ],
      explorerUrl: `https://xrpscan.com/account/${address}`,
    },
    {
      valid: /^addr1[0-9a-z]{40,120}$/i.test(address),
      network: "Cardano",
      family: "Cardano",
      addressType: "Cardano Shelley address",
      confidence: "medium",
      checksum: "not_checked",
      compatibleNetworks: ["Cardano"],
      warnings: ["Only send ADA/Cardano-native assets on Cardano."],
      explorerUrl: `https://cardanoscan.io/address/${address}`,
    },
    {
      valid: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/.test(address),
      network: "Litecoin",
      family: "Litecoin",
      addressType: "Litecoin address",
      confidence: "medium",
      checksum: "not_checked",
      compatibleNetworks: ["Litecoin"],
      warnings: [
        "Litecoin and Bitcoin-style addresses can look similar. Verify network carefully.",
      ],
    },
    {
      valid: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(address),
      network: "Dogecoin",
      family: "Dogecoin",
      addressType: "Dogecoin address",
      confidence: "medium",
      checksum: "not_checked",
      compatibleNetworks: ["Dogecoin"],
      warnings: ["Only send DOGE on the Dogecoin network."],
    },
  ];

  return patterns.find((item) => item.valid) || null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const address = String(body.address || "").trim();

  if (!address) {
    return NextResponse.json(
      { error: "Address is required." },
      { status: 400 },
    );
  }

  const result = validateEvm(address) ||
    validateSolana(address) ||
    validateTron(address) ||
    validateByPattern(address) || {
      valid: false,
      network: "Unknown",
      family: "Unknown",
      addressType: "Unsupported or invalid address",
      confidence: "low",
      checksum: "not_checked",
      compatibleNetworks: [],
      warnings: [
        "This address is not recognized by Kryptonal. Do not send funds until you verify it with the official wallet or explorer.",
      ],
    };

  return NextResponse.json({ address, result });
}
