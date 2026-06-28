"use client";

import { useState } from "react";

type TaxResult = {
  country: string;
  currency: string;
  taxRate: number;
  costBasis: number;
  proceeds: number;
  gainLoss: number;
  taxableGain: number;
  estimatedTax: number;
  profitAfterTax: number;
  holdingDays: number;
  holdingLabel: string;
  ruleNote: string;
};

const fallback = {
  badge: "Crypto Tax Tool",
  title: "Cryptocurrency Tax Calculator",
  descriptionLong:
    "Estimate crypto gains, losses, tax owed, and profit after tax by country. Educational purposes only.",
  country: "Country",
  currency: "Currency",
  transactionType: "Transaction Type",
  buyPrice: "Buy Price",
  sellPrice: "Sell Price",
  quantity: "Quantity",
  taxRate: "Tax Rate (%)",
  useCustomRate: "Use custom tax rate",
  buyDate: "Buy Date",
  sellDate: "Sell Date",
  button: "Calculate Tax",
  calculating: "Calculating...",
  resultTitle: "Estimated Crypto Tax Result",
  costBasis: "Cost Basis",
  proceeds: "Sale Proceeds",
  gainLoss: "Capital Gain / Loss",
  taxableGain: "Taxable Gain",
  estimatedTax: "Estimated Tax",
  profitAfterTax: "Profit After Tax",
  holdingPeriod: "Holding Period",
  ruleNote: "Country Rule Note",
  disclaimer:
    "Educational purposes only. This is not tax, legal, financial, or investment advice. Always verify local tax rules with a qualified tax professional.",
  error: "Unable to calculate. Please check your inputs.",
};

const countries = [
  "Estonia",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Portugal",
  "Turkey",
  "Canada",
  "Australia",
  "Other",
];

const currencies = ["USD", "EUR", "GBP", "TRY", "BRL"];

const transactionTypes = [
  "Sell crypto",
  "Crypto to crypto",
  "Staking reward",
  "Mining income",
  "Airdrop",
];

export default function CryptocurrencyTaxCalculator({ t }: { t: any }) {
  const copy = {
    ...fallback,
    ...(t?.tools?.cryptocurrencyTaxCalculator || {}),
  };

  const [country, setCountry] = useState("Estonia");
  const [currency, setCurrency] = useState("EUR");
  const [transactionType, setTransactionType] = useState("Sell crypto");
  const [buyPrice, setBuyPrice] = useState("1000");
  const [sellPrice, setSellPrice] = useState("1500");
  const [quantity, setQuantity] = useState("1");
  const [taxRate, setTaxRate] = useState("");
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [buyDate, setBuyDate] = useState("");
  const [sellDate, setSellDate] = useState("");
  const [result, setResult] = useState<TaxResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calculateTax() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/tools/cryptocurrency-tax-calculator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country,
          currency,
          transactionType,
          buyPrice,
          sellPrice,
          quantity,
          taxRate,
          useCustomRate,
          buyDate,
          sellDate,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error("Failed");

      setResult(json);
    } catch {
      setError(copy.error);
    } finally {
      setLoading(false);
    }
  }

  const symbol =
    result?.currency === "EUR"
      ? "€"
      : result?.currency === "GBP"
        ? "£"
        : result?.currency === "TRY"
          ? "₺"
          : result?.currency === "BRL"
            ? "R$"
            : "$";

  const formatMoney = (value: number) =>
    `${symbol}${value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur md:p-10">
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
            {copy.badge}
          </p>

          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
            {copy.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            {copy.descriptionLong}
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-semibold text-slate-300">
                  {copy.country}
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                >
                  {countries.map((item) => (
                    <option key={item} value={item} className="bg-slate-950">
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300">
                  {copy.currency}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                >
                  {currencies.map((item) => (
                    <option key={item} value={item} className="bg-slate-950">
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300">
                  {copy.transactionType}
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                >
                  {transactionTypes.map((item) => (
                    <option key={item} value={item} className="bg-slate-950">
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {[
                [copy.buyPrice, buyPrice, setBuyPrice],
                [copy.sellPrice, sellPrice, setSellPrice],
                [copy.quantity, quantity, setQuantity],
              ].map(([label, value, setter]: any) => (
                <div key={label}>
                  <label className="text-sm font-semibold text-slate-300">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-semibold text-slate-300">
                  {copy.buyDate}
                </label>
                <input
                  type="date"
                  value={buyDate}
                  onChange={(e) => setBuyDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-300">
                  {copy.sellDate}
                </label>
                <input
                  type="date"
                  value={sellDate}
                  onChange={(e) => setSellDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none focus:border-cyan-300/40"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={useCustomRate}
                    onChange={(e) => setUseCustomRate(e.target.checked)}
                  />
                  {copy.useCustomRate}
                </label>

                <input
                  type="number"
                  min="0"
                  value={taxRate}
                  disabled={!useCustomRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="20"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none disabled:opacity-40 focus:border-cyan-300/40"
                />
              </div>
            </div>

            <button
              onClick={calculateTax}
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-cyan-300 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50 md:w-auto"
            >
              {loading ? copy.calculating : copy.button}
            </button>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>

          {result && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <h2 className="text-2xl font-black text-white">
                {copy.resultTitle}
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  [copy.country, result.country],
                  [copy.taxRate, `${result.taxRate}%`],
                  [copy.costBasis, formatMoney(result.costBasis)],
                  [copy.proceeds, formatMoney(result.proceeds)],
                  [copy.gainLoss, formatMoney(result.gainLoss)],
                  [copy.taxableGain, formatMoney(result.taxableGain)],
                  [copy.estimatedTax, formatMoney(result.estimatedTax)],
                  [copy.profitAfterTax, formatMoney(result.profitAfterTax)],
                  [
                    copy.holdingPeriod,
                    `${result.holdingDays} days — ${result.holdingLabel}`,
                  ],
                ].map(([label, value]: any) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-white/10 bg-slate-950/60 p-5"
                  >
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="mt-2 text-xl font-black text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                <p className="text-sm text-cyan-100">{copy.ruleNote}</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {result.ruleNote}
                </p>
              </div>
            </div>
          )}

          <p className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            {copy.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
