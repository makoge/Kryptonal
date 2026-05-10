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

function deepMerge(target: any, source: any): any {
  // arrays should completely replace
  if (Array.isArray(target) || Array.isArray(source)) {
    return source;
  }

  const output = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      key in target
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

export function getDictionary(locale: string): Dictionary {
  const selectedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : "en";

  return deepMerge(dictionaries.en, dictionaries[selectedLocale]);
}