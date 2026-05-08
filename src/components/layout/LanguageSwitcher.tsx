"use client";

import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "tr", label: "Türkçe" },
];

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(newLocale: string) {
    const parts = pathname.split("/");
    parts[1] = newLocale;
    router.push(parts.join("/"));
  }

  return (
    <select
      value={locale}
      onChange={(e) => changeLanguage(e.target.value)}
      className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
    >
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.label}
        </option>
      ))}
    </select>
  );
}