import type { Locale } from "./config";
import tr from "./locales/tr.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import de from "./locales/de.json";
import pl from "./locales/pl.json";
import nl from "./locales/nl.json";
import ro from "./locales/ro.json";
import uk from "./locales/uk.json";
import cs from "./locales/cs.json";
import lt from "./locales/lt.json";

const dictionaries: Record<string, Record<string, string>> = {
  tr, en, ru, de, pl, nl, ro, uk, cs, lt
};

export function t(locale: Locale, key: string, fallback?: string): string {
  const dict = dictionaries[locale] || dictionaries.tr;
  return dict[key] || dictionaries.en[key] || dictionaries.tr[key] || fallback || key;
}
