import { Link, createFileRoute } from "@tanstack/react-router";

import { AppShell } from "../components/AppShell";
import { Button, Note, Section } from "../components/ui/primitives";
import { LANGUAGES, formatDateTime, t } from "../lib/i18n";
import { LOCATIONS } from "../lib/locations";
import { useApp } from "../state/app-state";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ORCA" },
      { name: "description", content: "Choose ORCA's interface language and operating port." },
      { property: "og:title", content: "Settings — ORCA" },
      { property: "og:description", content: "Language and port preferences for ORCA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang, setLang, location, setLocationId, refresh, snapshot } = useApp();
  return (
    <AppShell title={t(lang, "navSettings")}>
      <p className="text-sm text-muted-foreground">{t(lang, "settingsIntro")}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <Section id="set-lang" title={t(lang, "language")}>
          <p className="mb-3 text-xs text-muted-foreground">{t(lang, "settingsLang")}</p>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                aria-pressed={lang === l.id}
                className={`rounded-md border px-3 py-2 text-sm ${
                  lang === l.id
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "border-border hover:border-border-strong"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Section>
        <Section id="set-loc" title={t(lang, "location")}>
          <p className="mb-3 text-xs text-muted-foreground">{t(lang, "settingsLoc")}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {LOCATIONS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLocationId(l.id)}
                aria-pressed={location.id === l.id}
                className={`rounded-md border px-2 py-1.5 text-left text-sm ${
                  location.id === l.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-border-strong"
                }`}
              >
                <div className="truncate font-medium">{l.name[lang]}</div>
                <div className="truncate text-[11px] text-muted-foreground">{l.region[lang]}</div>
              </button>
            ))}
          </div>
        </Section>
        <Section
          id="set-data"
          title={t(lang, "settingsData")}
          actions={<Button onClick={refresh}>{t(lang, "refresh")}</Button>}
        >
          <p className="text-xs text-muted-foreground">{t(lang, "settingsDataHelp")}</p>
          {snapshot ? (
            <p className="num mt-2 text-xs">
              {t(lang, "lastUpdated")}: {formatDateTime(snapshot.weatherResult.fetchedAt, lang)}
            </p>
          ) : null}
        </Section>
        <Section id="set-legal" title={t(lang, "legal")}>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className="text-primary hover:text-accent">
              {t(lang, "privacy")}
            </Link>
            <Link to="/terms" className="text-primary hover:text-accent">
              {t(lang, "terms")}
            </Link>
          </div>
          <Note>{t(lang, "disclaimerShort")}</Note>
        </Section>
      </div>
    </AppShell>
  );
}
