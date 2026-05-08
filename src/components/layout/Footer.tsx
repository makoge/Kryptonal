// src/components/layout/Footer.tsx

import Link from "next/link";

type FooterProps = {
  locale: string;
  t: {
    brand: string;
    footer: {
      description: string;
      platform: string;
      important: string;
      marketCap: string;
      analysis: string;
      blog: string;
      gamingCrypto: string;
      educationOnly: string;
      notFinancialAdvice: string;
      highRisk: string;
      translationNote: string;
    };
  };
};

export default function Footer({ locale, t }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-5 md:grid-cols-2 lg:grid-cols-4 lg:py-14">
        <div className="md:col-span-2">
          <h3 className="text-xl font-black text-emerald-400">{t.brand}</h3>
          <p className="mt-4 max-w-xl text-sm leading-7">{t.footer.description}</p>
        </div>

        <div>
          <h4 className="font-bold text-white">{t.footer.platform}</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href={`/${locale}/market-cap`} className="hover:text-emerald-400">{t.footer.marketCap}</Link></li>
            <li><Link href={`/${locale}/analysis`} className="hover:text-emerald-400">{t.footer.analysis}</Link></li>
            <li><Link href={`/${locale}/blog`} className="hover:text-emerald-400">{t.footer.blog}</Link></li>
            <li><Link href={`/${locale}/gaming-crypto`} className="hover:text-emerald-400">{t.footer.gamingCrypto}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white">{t.footer.important}</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>{t.footer.educationOnly}</li>
            <li>{t.footer.notFinancialAdvice}</li>
            <li>{t.footer.highRisk}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs leading-6 sm:px-5">
        <p>{t.footer.translationNote}</p>
        <p className="mt-3">© {new Date().getFullYear()} {t.brand}.</p>
      </div>
    </footer>
  );
}