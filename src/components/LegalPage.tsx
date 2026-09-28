import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { LANGUAGES, t } from "../lib/i18n";
import type { Lang } from "../lib/locations";
import { SiteFooter } from "./SiteFooter";

export interface LegalSection {
  heading: Record<Lang, string>;
  body: Record<Lang, string[]>;
}

export function LegalPage({
  titleKey,
  intro,
  sections,
}: {
  titleKey: "privacy" | "terms";
  intro: Record<Lang, string>;
  sections: LegalSection[];
}) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("orca.lang") as Lang | null;
      if (stored === "en" || stored === "hi" || stored === "gu") setLang(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const change = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("orca.lang", l);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-[0.18em] text-primary">
            ORCA
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← {t(lang, "backToDashboard")}
          </Link>
          <div className="ml-auto flex overflow-hidden rounded-sm border border-border">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => change(l.id)}
                aria-pressed={lang === l.id}
                className={`px-2.5 py-1.5 text-xs ${
                  lang === l.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-2 text-muted-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-xl font-semibold">{t(lang, titleKey)}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro[lang]}</p>
        <div className="mt-8 space-y-6">
          {sections.map((s) => (
            <section key={s.heading.en}>
              <h2 className="text-sm font-semibold">{s.heading[lang]}</h2>
              <ul className="mt-2 space-y-2">
                {s.body[lang].map((line, i) => (
                  <li
                    key={i}
                    className="border-l border-border pl-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
