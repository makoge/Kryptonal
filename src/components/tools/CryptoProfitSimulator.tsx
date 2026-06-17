"use client";

import { useMemo, useState,  } from "react";

const COINS = [
  ["bitcoin", "Bitcoin"],
  ["ethereum", "Ethereum"],
  ["solana", "Solana"],
  ["binancecoin", "BNB"],
  ["ripple", "XRP"],
  ["cardano", "Cardano"],
  ["dogecoin", "Dogecoin"],
  ["shiba", "Shiba Inu"],
  ["pepe", "Pepe"],
  ["floki", "FLOKI"],
];

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400/50";

function usd(value: number) {
  if (!Number.isFinite(value)) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: Math.abs(value) >= 100000 ? "compact" : "standard",
    maximumFractionDigits: value < 1 ? 8 : 2,
  }).format(value);
}

function percent(value: number) {
  if (!Number.isFinite(value)) return "0%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function numberCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function cryptoAmount(value: number, symbol: string) {
  if (!Number.isFinite(value)) return `0 ${symbol}`;

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value < 1 ? 8 : 4,
  }).format(value)} ${symbol}`;
}

export default function CryptoProfitSimulator({ t }: { t: any }) {
  const copy = t.tools.cryptoRoiVision;

  
  const [coin, setCoin] = useState("bitcoin");
  const [date, setDate] = useState("2020-01-01");
  const [investment, setInvestment] = useState("1000");
  const [futurePrice, setFuturePrice] = useState("");
  const [targetPrice, setTargetPrice] = useState("1");
  const [mode, setMode] = useState("lumpSum");
  const [frequency, setFrequency] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set("coin", coin);
    p.set("date", date);
    p.set("investment", investment || "0");
    p.set("futurePrice", futurePrice || "0");
    p.set("targetPrice", targetPrice || "0");
    p.set("mode", mode);
    p.set("frequency", frequency);
    p.set("contribution", investment || "0");
    return p.toString();
  }, [coin, date, investment, futurePrice, targetPrice, mode, frequency]);

  async function calculate() {
    setLoading(true);

    try {
      const res = await fetch(`/api/tools/crypto-roi?${params}`, {
        cache: "no-store",
      });

      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  const investedAmount = data?.investedAmount || data?.investment || 0;
  const coinsAcquired = data?.coinsBought || 0;
  const averageBuyPrice =
    mode === "dca" ? data?.dca?.averageBuyPrice || 0 : data?.historicalPrice || 0;

  const shareText = data
    ? `${copy.shareIf} ${usd(investedAmount)} ${copy.shareIn} ${
        data.coin.name
      } ${copy.shareOn} ${data.date}, ${copy.shareWorth} ${usd(
        data.currentValue
      )} ${copy.shareToday}. ${copy.shareProfit}: ${percent(data.profitPct)}.`
    : "";

  const targetText = data
    ? `${data.coin.name} ${copy.targetExplainStart} ${usd(
        data.targetReality.targetPrice
      )}, ${copy.targetExplainNeeds} ${usd(
        data.targetReality.targetMarketCap
      )} ${copy.targetExplainMarketCap}. ${copy.targetExplainThatIs} ${data.targetReality.marketCapMultiple.toFixed(
        1
      )}x ${copy.targetExplainCurrent}.`
    : "";

  async function copyResult(text: string) {
    try {
      await navigator.clipboard.writeText(`${text}\n\nKryptonal.com`);
      alert(copy.copied);
    } catch {
      alert(copy.copyFailed);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 text-white sm:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            {copy.badge}
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            {copy.title}
          </h1>

          <p className="mt-5 leading-8 text-slate-300">{copy.description}</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
            <div className="grid gap-4">
              <Field label={copy.coin}>
                <select value={coin} onChange={(e) => setCoin(e.target.value)} className={inputClass}>
                  {COINS.map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={copy.mode}>
                <select value={mode} onChange={(e) => setMode(e.target.value)} className={inputClass}>
                  <option value="lumpSum">{copy.modes.lumpSum}</option>
                  <option value="dca">{copy.modes.dca}</option>
                </select>
              </Field>

              {mode === "dca" && (
                <Field label={copy.frequency}>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className={inputClass}
                  >
                    <option value="weekly">{copy.frequencies.weekly}</option>
                    <option value="monthly">{copy.frequencies.monthly}</option>
                  </select>
                </Field>
              )}

              <Field label={mode === "dca" ? copy.contribution : copy.investment}>
                <input
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  inputMode="decimal"
                  className={inputClass}
                />
              </Field>

              <Field label={copy.date}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label={copy.targetCoinPrice}>
                <input
                  value={futurePrice}
                  onChange={(e) => setFuturePrice(e.target.value)}
                  inputMode="decimal"
                  placeholder="150000"
                  className={inputClass}
                />
              </Field>

              <Field label={copy.targetPrice}>
                <input
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  inputMode="decimal"
                  placeholder="1"
                  className={inputClass}
                />
              </Field>

              <button
                onClick={calculate}
                disabled={loading}
                className="rounded-2xl bg-emerald-400 px-5 py-4 font-black text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
              >
                {loading ? copy.loading : copy.calculate}
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
            {!data ? (
              <div className="flex min-h-[420px] items-center justify-center text-center text-slate-400">
                {copy.emptyState}
              </div>
            ) : data.error ? (
              <div className="text-center text-amber-300">{copy.error}</div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Metric label={copy.portfolioValueToday} value={usd(data.currentValue)} />
                  <Metric
                    label={copy.portfolioProfit}
                    value={usd(data.profit)}
                    sub={percent(data.profitPct)}
                    positive={data.profit >= 0}
                  />
                  <Metric label={copy.multiplier} value={`${data.multiple.toFixed(2)}x`} />
                  <Metric label={copy.maxDrawdown} value={percent(data.maxDrawdown)} positive={false} />
                </div>

                <Panel title={copy.cryptoBoughtTitle}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <Mini label={copy.totalInvested} value={usd(investedAmount)} />
                    <Mini label={copy.averageBuyPrice} value={usd(averageBuyPrice)} />
                    <Mini
                      label={copy.cryptoAcquired}
                      value={cryptoAmount(coinsAcquired, data.coin.symbol)}
                    />
                    <Mini label={copy.currentCoinPrice} value={usd(data.currentPrice)} />
                  </div>
                </Panel>

                {mode === "dca" && (
                  <Panel title={copy.dcaTitle}>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <Mini label={copy.dcaBuyCount} value={String(data.dca.buyCount || 0)} />
                      <Mini label={copy.totalInvested} value={usd(data.dca.totalInvested)} />
                      <Mini label={copy.averageBuyPrice} value={usd(data.dca.averageBuyPrice)} />
                      <Mini label={copy.dcaValue} value={usd(data.dca.currentValue)} />
                    </div>
                  </Panel>
                )}

                <Panel title={copy.cashVsCrypto}>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Mini label={copy.cash} value={usd(data.comparison.cashValue)} />
                    <Mini label="BTC" value={usd(data.comparison.btcValue)} />
                    <Mini label={data.coin.symbol} value={usd(data.comparison.selectedCoinValue)} />
                  </div>
                </Panel>

                {data.futurePrice > 0 && (
                  <Panel title={copy.futureScenario}>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Mini label={copy.targetCoinPrice} value={usd(data.futurePrice)} />
                      <Mini label={copy.projectedPortfolioValue} value={usd(data.futureValue)} />
                      <Mini label={copy.projectedReturn} value={percent(data.futureProfitPct)} />
                    </div>
                  </Panel>
                )}

                <Panel title={copy.targetRealityTitle}>
                  <p className="leading-8 text-slate-300">{targetText}</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Mini
                      label={copy.supply}
                      value={numberCompact(data.targetReality.circulatingSupply)}
                    />
                    <Mini
                      label={copy.requiredMarketCap}
                      value={usd(data.targetReality.targetMarketCap)}
                    />
                    <Mini
                      label={copy.realityLevel}
                      value={copy.realityLevels[data.targetReality.realityLevel]}
                    />
                  </div>
                </Panel>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => copyResult(shareText)}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 font-bold text-emerald-300"
                  >
                    {copy.copyRoiCard}
                  </button>

                  <button
                    onClick={() => copyResult(targetText)}
                    className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-3 font-bold text-amber-300"
                  >
                    {copy.copyTargetCard}
                  </button>
                </div>

                <p className="text-sm leading-7 text-amber-200">
                  {copy.disclaimer}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      
    </main>
  );
}

function Field({ label, children }: any) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value, sub, positive }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`mt-2 text-2xl font-black ${
          positive === undefined
            ? "text-white"
            : positive
            ? "text-emerald-300"
            : "text-red-300"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
    </div>
  );
}

function Panel({ title, children }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
      <h3 className="text-xl font-black">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Mini({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 break-words font-black text-white">{value}</p>
    </div>
  );
}
