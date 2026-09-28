import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, type ReactNode } from "react";

import { SOURCES } from "../lib/api";
import { compass, formatDateTime, t, type Lang } from "../lib/i18n";
import { bearingDeg } from "../lib/locations";
import { RISK_LABEL_KEY, type RiskLevel } from "../lib/risk";
import { buildSnapshot } from "../lib/snapshot";
import { useApp } from "../state/app-state";
import { EmptyState, StatusBadge } from "./ui/primitives";

export const RISK_TONE: Record<RiskLevel, string> = {
  low: "border-ok/40 bg-ok/10 text-ok",
  moderate: "border-caution/40 bg-caution/10 text-caution",
  high: "border-warning/40 bg-warning/10 text-warning",
  severe: "border-destructive/40 bg-destructive/10 text-destructive",
};

function Card({
  title,
  to,
  status,
  children,
  className = "",
}: {
  title: string;
  to?: string;
  status?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const { lang } = useApp();
  return (
    <section className={`panel flex min-w-0 flex-col ${className}`}>
      <header className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <h2 className="truncate text-sm font-semibold">{title}</h2>
        {status}
        {to ? (
          <Link
            to={to}
            className="ml-auto inline-flex shrink-0 items-center gap-1 text-xs text-primary hover:text-accent"
          >
            {t(lang, "viewDetails")}
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        ) : null}
      </header>
      <div className="min-w-0 flex-1 p-4">{children}</div>
    </section>
  );
}

function Kpi({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
}) {
  return (
    <div className="panel min-w-0 px-3 py-2.5">
      <div className="label-xs truncate">{label}</div>
      <div className="num mt-1 text-xl font-medium leading-tight">
        {value}
        {unit ? <span className="ml-1 text-xs text-muted-foreground">{unit}</span> : null}
      </div>
      {sub ? <div className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</div> : null}
    </div>
  );
}

const f = (n: number | null | undefined, d = 1) => (n == null ? "—" : n.toFixed(d));

/** Top KPI strip: risk, weather and ocean headline values for the selected port. */
export function KpiStrip() {
  const { lang, snapshot } = useApp();
  if (!snapshot) return <EmptyState text={t(lang, "loading")} />;
  const { weather: w, marine: m, risk } = snapshot;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
      <Link
        to="/route-risk"
        className={`col-span-2 flex min-w-0 flex-col justify-center rounded-md border px-3 py-2.5 ${RISK_TONE[risk.level]}`}
      >
        <span className="label-xs">{t(lang, "riskStatus")}</span>
        <span className="mt-1 text-xl font-semibold leading-tight">
          {t(lang, RISK_LABEL_KEY[risk.level])}
        </span>
        <span className="num text-xs opacity-80">
          {risk.score}/100 · {formatDateTime(snapshot.validTime, lang)}
        </span>
      </Link>
      <Kpi label={t(lang, "wind")} value={f(w.windSpeed, 0)} unit="km/h" sub={compass(w.windDirection, lang)} />
      <Kpi label={t(lang, "gusts")} value={f(w.windGusts, 0)} unit="km/h" />
      <Kpi label={t(lang, "waveHeight")} value={f(m.waveHeight)} unit="m" sub={`${f(m.wavePeriod)} s`} />
      <Kpi label={t(lang, "sst")} value={f(m.seaSurfaceTemperature)} unit="°C" />
      <Kpi
        label={t(lang, "visibility")}
        value={w.visibility == null ? "—" : (w.visibility / 1000).toFixed(1)}
        unit="km"
      />
      <Kpi label={t(lang, "precipitation")} value={f(w.precipitationProbability, 0)} unit="%" sub={`${f(w.temperature)} °C`} />
    </div>
  );
}

const HORIZONS = [0, 6, 12, 24, 36, 48];

/** Forecast summary built by re-running the existing snapshot pipeline at future hours. */
export function ForecastSummaryCard() {
  const { lang, snapshot, location } = useApp();
  const rows = useMemo(() => {
    if (!snapshot) return [];
    const base = new Date();
    base.setMinutes(0, 0, 0);
    return HORIZONS.map((h) => {
      const d = new Date(base.getTime() + h * 3600_000);
      return { h, s: buildSnapshot(location, d, snapshot.weatherResult, snapshot.marineResult) };
    });
  }, [snapshot, location]);

  return (
    <Card
      title={t(lang, "forecastSummary")}
      to="/forecast"
      status={snapshot ? <StatusBadge status={snapshot.weatherStatus} lang={lang} /> : null}
    >
      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : (
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="num w-full min-w-[26rem] text-xs">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-1 pr-2 font-normal">{t(lang, "hoursAhead")}</th>
                <th className="py-1 pr-2 font-normal">{t(lang, "wind")}</th>
                <th className="py-1 pr-2 font-normal">{t(lang, "gusts")}</th>
                <th className="py-1 pr-2 font-normal">{t(lang, "waveHeight")}</th>
                <th className="py-1 pr-2 font-normal">{t(lang, "precipitation")}</th>
                <th className="py-1 font-normal">{t(lang, "riskStatus")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border border-t border-border">
              {rows.map(({ h, s }) => (
                <tr key={h}>
                  <td className="py-1.5 pr-2">
                    {h === 0 ? t(lang, "now") : `+${h} h`}
                    <div className="text-[10px] text-muted-foreground">{formatDateTime(s.validTime, lang)}</div>
                  </td>
                  <td className="py-1.5 pr-2">
                    {f(s.weather.windSpeed, 0)} km/h {compass(s.weather.windDirection, lang)}
                  </td>
                  <td className="py-1.5 pr-2">{f(s.weather.windGusts, 0)}</td>
                  <td className="py-1.5 pr-2">{f(s.marine.waveHeight)} m</td>
                  <td className="py-1.5 pr-2">{f(s.weather.precipitationProbability, 0)}%</td>
                  <td className="py-1.5">
                    <span className={`rounded-sm border px-1.5 py-0.5 ${RISK_TONE[s.risk.level]}`}>
                      {t(lang, RISK_LABEL_KEY[s.risk.level])}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export function ZonesSummaryCard() {
  const { lang, snapshot, location } = useApp();
  const zones = snapshot ? [...snapshot.pfz].sort((a, b) => b.score - a.score).slice(0, 3) : [];
  return (
    <Card
      title={t(lang, "secPfz")}
      to="/fishing-zones"
      status={snapshot ? <StatusBadge status="demo" lang={lang} /> : null}
    >
      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : !zones.length ? (
        <EmptyState text={t(lang, "noZones")} />
      ) : (
        <ul className="space-y-2">
          {zones.map((z, i) => (
            <li
              key={z.id}
              className={`rounded-md border px-3 py-2 ${i === 0 ? "border-primary/40 bg-primary/5" : "border-border"}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {z.name[lang]}
                  {i === 0 ? (
                    <span className="ml-2 text-[11px] font-normal text-primary">{t(lang, "bestZone")}</span>
                  ) : null}
                </span>
                <span className="num shrink-0 text-sm">{z.score}/100</span>
              </div>
              <div className="num mt-0.5 text-[11px] text-muted-foreground">
                {z.distanceKm.toFixed(0)} km {compass(bearingDeg(location, z.center), lang)} · {t(lang, "confidence")} {z.confidence}% ·{" "}
                {t(lang, "sst")} {f(z.sst)} °C · {z.depthM} m
              </div>
              <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{z.species[lang]}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

const SEV_BAR = { info: "border-l-border-strong", warn: "border-l-caution", danger: "border-l-destructive" } as const;

export function AlertsSummaryCard() {
  const { lang, snapshot } = useApp();
  const items = snapshot ? [...snapshot.alerts.derived, ...snapshot.alerts.demo] : [];
  return (
    <Card title={t(lang, "secAlerts")} to="/alerts">
      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : (
        <>
          <ul className="space-y-1.5">
            {items.slice(0, 4).map((a) => (
              <li key={a.id} className={`border-l-2 bg-surface-2 px-3 py-1.5 ${SEV_BAR[a.severity]}`}>
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-sm">{a.title[lang]}</span>
                  <span className="ml-auto shrink-0">
                    <StatusBadge status={a.origin === "derived" ? snapshot.overallStatus : "demo"} lang={lang} />
                  </span>
                </div>
              </li>
            ))}
            {!items.length ? <EmptyState text={t(lang, "noDerivedAlerts")} /> : null}
          </ul>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{t(lang, "officialFeeds")}</span>
            <StatusBadge status="unavailable" lang={lang} />
          </div>
        </>
      )}
    </Card>
  );
}

export function SourcesSummaryCard() {
  const { lang, snapshot } = useApp();
  const rows: { name: string; status: "live" | "demo" | "unavailable"; at?: number }[] = snapshot
    ? [
        { name: SOURCES.weather, status: snapshot.weatherStatus, at: snapshot.weatherResult.fetchedAt },
        { name: SOURCES.marine, status: snapshot.marineStatus, at: snapshot.marineResult.fetchedAt },
        { name: t(lang, "geoDataset"), status: "demo" },
        { name: t(lang, "officialFeeds"), status: "unavailable" },
      ]
    : [];
  return (
    <Card title={t(lang, "navSources")} to="/sources">
      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center gap-2 py-1.5">
              <span className="min-w-0 flex-1 truncate text-sm">{r.name}</span>
              <StatusBadge status={r.status} lang={lang} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function RiskFactorsCard({ lang }: { lang: Lang }) {
  const { snapshot } = useApp();
  return (
    <Card title={t(lang, "secRisk")} to="/route-risk">
      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : (
        <ul className="divide-y divide-border">
          {snapshot.risk.factors.slice(0, 5).map((fct) => (
            <li key={fct.key} className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
              <span className="min-w-0 truncate">{fct.label[lang]}</span>
              {fct.value ? <span className="num shrink-0 text-xs text-muted-foreground">{fct.value}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
