// src/components/layout/Header.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

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
      tools: string;
      trending: string;
    };
  };
};

export default function Header({ locale, t }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auth.js session hook
  const { data: session, status } = useSession();

  const links = [
    { href: `/${locale}/tools`, label: t.nav.tools },
    { href: `/${locale}/crypto-prices`, label: t.nav.crypto },
    { href: `/${locale}/trending`, label: t.nav.trending },
    { href: `/${locale}/market-cap`, label: t.nav.marketCap },
    { href: `/${locale}/analysis`, label: t.nav.analysis },
    { href: `/${locale}/blog`, label: t.nav.blog },
    { href: `/${locale}/gaming-crypto`, label: t.nav.gamingCrypto },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-5">
        <Link
          href={`/${locale}`}
          className="text-lg font-black text-emerald-400 sm:text-xl"
        >
          {t.brand}
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-emerald-400 ${
                pathname === link.href ? "text-emerald-400 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher locale={locale} />

          {/* Authentication State */}
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-white/10" />
          ) : session?.user ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-3">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-slate-950">
                  {session.user.name?.[0] || session.user.email?.[0] || "U"}
                </div>
              )}
              <span className="max-w-[100px] truncate text-xs font-medium text-slate-200">
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="ml-1 text-xs text-rose-400 hover:text-rose-300 hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-400 hover:text-slate-950"
            >
              Sign In
            </button>
          )}

          <Link
            href={`/${locale}/analysis`}
            className="rounded-xl bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
          >
            {t.nav.start}
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-white/10 px-3 py-2 text-xl text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-5 lg:hidden">
          <nav className="flex flex-col gap-4 text-slate-300">
            {/* Mobile Auth Section */}
            {session?.user ? (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-3">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-slate-950">
                      {session.user.name?.[0] || session.user.email?.[0] || "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-200">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  signIn("google");
                }}
                className="w-full rounded-xl border border-emerald-400/30 bg-emerald-400/10 py-3 text-center text-sm font-semibold text-emerald-400"
              >
                Sign In
              </button>
            )}

            {/* Mobile Nav Links */}
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl bg-white/5 px-4 py-3 transition hover:text-emerald-400 ${
                  pathname === link.href
                    ? "border border-emerald-400/30 text-emerald-400"
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
