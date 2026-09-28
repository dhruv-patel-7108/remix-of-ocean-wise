import { SOURCES } from "../lib/api";
import { formatDateTime, t } from "../lib/i18n";
import { useApp } from "../state/app-state";
import { Button, EmptyState, Section, StatusBadge } from "./ui/primitives";

export function SystemPanel() {
  const { lang, snapshot, refresh, location } = useApp();

  if (!snapshot) {
    return (
      <Section id="system" index={9} title={t(lang, "secSystem")}>
        <EmptyState text={t(lang, "loading")} />
      </Section>
    );
  }

  const rows = [
    {
      name: SOURCES.weather,
      status: snapshot.weatherStatus,
      at: snapshot.weatherResult.fetchedAt,
      error: snapshot.weatherResult.error,
      points: snapshot.weatherResult.hourly.time.length,
    },
    {
      name: SOURCES.marine,
      status: snapshot.marineStatus,
      at: snapshot.marineResult.fetchedAt,
      error: snapshot.marineResult.error,
      points: snapshot.marineResult.hourly.time.length,
    },
  ];

  return (
    <Section
      id="system"
      index={9}
      title={t(lang, "secSystem")}
      actions={<Button onClick={refresh}>{t(lang, "refresh")}</Button>}
    >
      <ul className="divide-y divide-border border-y border-border">
        {rows.map((r) => (
          <li key={r.name} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
            <span className="text-sm font-medium">{r.name}</span>
            <StatusBadge status={r.status} lang={lang} />
            <span className="num ml-auto text-xs text-muted-foreground">
              {r.points} h · {formatDateTime(r.at, lang)}
            </span>
            {r.error ? (
              <span className="num w-full text-xs text-destructive">
                {t(lang, "apiError")}: {r.error}
              </span>
            ) : null}
          </li>
        ))}
        <li className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
          <span className="text-sm font-medium">{SOURCES.geo}</span>
          <StatusBadge status="demo" lang={lang} />
          <span className="num ml-auto text-xs text-muted-foreground">
            {location.name.en} · {location.lat.toFixed(3)}, {location.lon.toFixed(3)}
          </span>
        </li>
      </ul>
    </Section>
  );
}
