import en from "@/messages/en.json";
import es from "@/messages/es.json";
import pt from "@/messages/pt.json";
import fr from "@/messages/fr.json";
import de from "@/messages/de.json";
import tr from "@/messages/tr.json";

export const locales = ["en", "es", "pt", "fr", "de", "tr"] as const;
export type Locale = (typeof locales)[number];

const dictionaries = { en, es, pt, fr, de, tr };


export type Dictionary = typeof en;

export function getDictionary(locale: string): Dictionary {
  if (!locales.includes(locale as Locale)) {
    return dictionaries.en;
  }

  return dictionaries[locale as Locale];
}