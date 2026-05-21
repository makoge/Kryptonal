// src/components/layout/Header.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { usePathname } from "next/navigation";

type HeaderProps = {
  locale: string;
  t: {
    brand: string;
    nav: {
      crypto: string;
      marketCap: string;
      analysis: string;
      blog: string;
      gamingCrypto: string;
      start: string;
    };
  };
};

export default function Header({ locale, t }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const links = [
    {href: `/${locale}/crypto-prices`, label: t.nav.crypto },
    { href: `/${locale}/market-cap`, label: t.nav.marketCap },
    { href: `/${locale}/analysis`, label: t.nav.analysis },
    { href: `/${locale}/blog`, label: t.nav.blog },
    { href: `/${locale}/gaming-crypto`, label: t.nav.gamingCrypto },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-5">
        <Link href={`/${locale}`} className="text-lg font-black text-emerald-400 sm:text-xl">
          {t.brand}
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-emerald-400">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} />
          <Link
            href={`/${locale}/analysis`}
            className="rounded-xl bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950"
          >
            {t.nav.start}
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-white/10 px-3 py-2 text-xl text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-5 lg:hidden">
          <nav className="flex flex-col gap-4 text-slate-300">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl bg-white/5 px-4 py-3 transition hover:text-emerald-400 ${
               pathname === link.href
               ? "text-emerald-400 border border-emerald-400/30"
               : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2">
              <LanguageSwitcher locale={locale} />
            </div>

            <Link
              href={`/${locale}/analysis`}
              onClick={() => setOpen(false)}
              className="rounded-xl bg-emerald-400 px-5 py-3 text-center font-bold text-slate-950"
            >
              {t.nav.start}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}