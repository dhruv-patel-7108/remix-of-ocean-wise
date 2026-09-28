import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CloudSun,
  Database,
  Fish,
  LayoutDashboard,
  Map as MapIcon,
  Menu,
  Route as RouteIcon,
  Settings,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { LANGUAGES, t } from "../lib/i18n";
import { LOCATIONS } from "../lib/locations";
import { useApp } from "../state/app-state";
import { SiteFooter } from "./SiteFooter";
import { StatusBadge } from "./ui/primitives";

const NAV = [
  { to: "/", key: "navDashboard", icon: LayoutDashboard },
  { to: "/map", key: "navMap", icon: MapIcon },
  { to: "/forecast", key: "navForecast", icon: CloudSun },
  { to: "/fishing-zones", key: "navPfz", icon: Fish },
  { to: "/route-risk", key: "navRouteRisk", icon: RouteIcon },
  { to: "/alerts", key: "navAlerts", icon: Bell },
  { to: "/sources", key: "navSources", icon: Database },
  { to: "/settings", key: "navSettings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { lang } = useApp();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="ORCA" className="flex flex-col gap-0.5 px-2">
      {NAV.map((n) => {
        const active = path === n.to;
        const Icon = n.icon;
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-rail-active font-medium text-rail-foreground"
                : "text-rail-muted hover:bg-rail-active/60 hover:text-rail-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{t(lang, n.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  const { lang } = useApp();
  return (
    <div className="px-5 py-4">
      <div className="text-lg font-semibold tracking-[0.2em] text-rail-foreground">ORCA</div>
      <div className="mt-0.5 text-[11px] leading-snug text-rail-muted">{t(lang, "appTagline")}</div>
    </div>
  );
}

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const { lang, setLang, location, setLocationId, snapshot } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-rail-border bg-rail lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto border-t border-rail-border px-5 py-3 text-[11px] leading-snug text-rail-muted">
          {t(lang, "decisionSupport")}
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-rail">
            <div className="flex items-start justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="m-3 rounded-md p-1.5 text-rail-muted hover:text-rail-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-surface">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 lg:px-6">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t(lang, "menu")}
              className="rounded-md border border-border p-1.5 text-muted-foreground lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold">{title}</h1>
              <div className="num truncate text-[11px] text-muted-foreground">
                {location.name[lang]}, {location.region[lang]} · {location.lat.toFixed(3)}°N,{" "}
                {location.lon.toFixed(3)}°E
              </div>
            </div>
            <div className="hidden sm:block">
              {snapshot ? (
                <StatusBadge status={snapshot.overallStatus} lang={lang} />
              ) : (
                <span className="text-[11px] text-muted-foreground">{t(lang, "loading")}</span>
              )}
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <label htmlFor="location-select" className="sr-only">
                {t(lang, "location")}
              </label>
              <select
                id="location-select"
                value={location.id}
                onChange={(e) => setLocationId(e.target.value)}
                className="rounded-md border border-border bg-input px-2 py-1.5 text-sm"
              >
                {LOCATIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name[lang]} · {l.region[lang]}
                  </option>
                ))}
              </select>
              <div
                role="group"
                aria-label={t(lang, "language")}
                className="flex overflow-hidden rounded-md border border-border"
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLang(l.id)}
                    aria-pressed={lang === l.id}
                    className={`px-2.5 py-1.5 text-xs transition-colors ${
                      lang === l.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 space-y-4 px-4 py-4 lg:px-6">{children}</main>
        <SiteFooter lang={lang} />
      </div>
    </div>
  );
}
