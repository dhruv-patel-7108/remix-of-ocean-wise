import { Link } from "@tanstack/react-router";

import { LANGUAGES, t } from "../lib/i18n";
import { LOCATIONS } from "../lib/locations";
import { useApp } from "../state/app-state";
import { StatusBadge } from "./ui/primitives";

export function TopBar() {
  const { lang, setLang, location, setLocationId, snapshot } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-[0.18em] text-primary">ORCA</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {t(lang, "appTagline")}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="label-xs hidden sm:inline">{t(lang, "systemStatus")}</span>
          {snapshot ? (
            <StatusBadge
              status={snapshot.overallStatus}
              lang={lang}
              at={snapshot.weatherResult.fetchedAt}
            />
          ) : (
            <span className="num text-[11px] text-muted-foreground">{t(lang, "loading")}</span>
          )}
        </div>

        <div className="ml-auto flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="lang-select" className="label-xs">
              {t(lang, "language")}
            </label>
            <div
              role="group"
              aria-label={t(lang, "language")}
              className="flex overflow-hidden rounded-sm border border-border"
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  id={l.id === "en" ? "lang-select" : undefined}
                  onClick={() => setLang(l.id)}
                  aria-pressed={lang === l.id}
                  className={`px-2.5 py-1.5 text-xs transition-colors ${
                    lang === l.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-w-[12rem] flex-col gap-1">
            <label htmlFor="location-select" className="label-xs">
              {t(lang, "location")}
            </label>
            <select
              id="location-select"
              value={location.id}
              onChange={(e) => setLocationId(e.target.value)}
              className="rounded-sm border border-border bg-input px-2 py-1.5 text-sm"
            >
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name[lang]} · {l.region[lang]}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden flex-col gap-1 lg:flex">
            <span className="label-xs">{t(lang, "operator")}</span>
            <span className="rounded-sm border border-border bg-surface-2 px-2 py-1.5 text-xs text-muted-foreground">
              {t(lang, "operatorGuest")}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-surface/60">
        <div className="num mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 text-[11px] text-muted-foreground">
          <span>
            {t(lang, "location")}: <span className="text-foreground">{location.name[lang]}</span>
          </span>
          <span>
            {t(lang, "coordinates")}: {location.lat.toFixed(3)}, {location.lon.toFixed(3)}
          </span>
          <span className="hidden md:inline">{t(lang, "disclaimerShort")}</span>
        </div>
      </div>
    </header>
  );
}
