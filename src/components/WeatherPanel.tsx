import { SOURCES } from "../lib/api";
import { compass, formatDateTime, t } from "../lib/i18n";
import { useApp } from "../state/app-state";
import { Button, EmptyState, Metric, Note, Section, StatusBadge } from "./ui/primitives";

const OFFSETS = [0, 6, 12, 24, 36, 48];

export function WeatherPanel() {
  const { lang, snapshot, offsetHours, setOffsetHours, refresh } = useApp();

  const label = (h: number) => (h === 0 ? t(lang, "now") : `+${h} h`);

  return (
    <Section
      id="weather"
      index={3}
      title={t(lang, "secWeather")}
      status={
        snapshot ? (
          <StatusBadge
            status={snapshot.weatherStatus}
            lang={lang}
            at={snapshot.weatherResult.fetchedAt}
          />
        ) : null
      }
      actions={
        <Button onClick={refresh} ariaLabel={t(lang, "refresh")}>
          {t(lang, "refresh")}
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="label-xs">{t(lang, "forecastTime")}</span>
        <div role="group" aria-label={t(lang, "forecastTime")} className="flex flex-wrap gap-1">
          {OFFSETS.map((h) => (
            <Button key={h} onClick={() => setOffsetHours(h)} pressed={offsetHours === h}>
              {label(h)}
            </Button>
          ))}
        </div>
        {snapshot && (
          <span className="num ml-auto text-xs text-muted-foreground">
            {formatDateTime(snapshot.validTime, lang)}
          </span>
        )}
      </div>

      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-3 xl:grid-cols-6">
            <Metric
              label={t(lang, "wind")}
              value={snapshot.weather.windSpeed?.toFixed(0) ?? "—"}
              unit="km/h"
              sub={compass(snapshot.weather.windDirection, lang)}
            />
            <Metric
              label={t(lang, "gusts")}
              value={snapshot.weather.windGusts?.toFixed(0) ?? "—"}
              unit="km/h"
            />
            <Metric
              label={t(lang, "visibility")}
              value={
                snapshot.weather.visibility !== null
                  ? (snapshot.weather.visibility / 1000).toFixed(1)
                  : "—"
              }
              unit="km"
            />
            <Metric
              label={t(lang, "precipitation")}
              value={snapshot.weather.precipitationProbability?.toFixed(0) ?? "—"}
              unit="%"
              sub={`${snapshot.weather.precipitation?.toFixed(1) ?? "0.0"} mm`}
            />
            <Metric
              label={t(lang, "temperature")}
              value={snapshot.weather.temperature?.toFixed(1) ?? "—"}
              unit="°C"
            />
            <Metric
              label={t(lang, "windDirection")}
              value={snapshot.weather.windDirection?.toFixed(0) ?? "—"}
              unit="°"
              sub={compass(snapshot.weather.windDirection, lang)}
            />
          </div>
          <Note>
            {t(lang, "source")}: {SOURCES.weather}
            {snapshot.weatherStatus !== "live" ? ` — ${t(lang, "fallbackNotice")}` : ""}
          </Note>
        </>
      )}
    </Section>
  );
}
