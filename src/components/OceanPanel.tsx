import { SOURCES } from "../lib/api";
import { compass, formatDateTime, t } from "../lib/i18n";
import { useApp } from "../state/app-state";
import { EmptyState, Metric, Note, Section, StatusBadge } from "./ui/primitives";

export function OceanPanel() {
  const { lang, snapshot } = useApp();

  return (
    <Section
      id="ocean"
      index={4}
      title={t(lang, "secOcean")}
      status={
        snapshot ? (
          <StatusBadge
            status={snapshot.marineStatus}
            lang={lang}
            at={snapshot.marineResult.fetchedAt}
          />
        ) : null
      }
      meta={
        snapshot ? (
          <span className="num text-xs text-muted-foreground">
            {formatDateTime(snapshot.validTime, lang)}
          </span>
        ) : null
      }
    >
      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-3 xl:grid-cols-6">
            <Metric
              label={t(lang, "waveHeight")}
              value={snapshot.marine.waveHeight?.toFixed(1) ?? "—"}
              unit="m"
              sub={compass(snapshot.marine.waveDirection, lang)}
            />
            <Metric
              label={t(lang, "wavePeriod")}
              value={snapshot.marine.wavePeriod?.toFixed(1) ?? "—"}
              unit="s"
            />
            <Metric
              label={t(lang, "swellHeight")}
              value={snapshot.marine.swellHeight?.toFixed(1) ?? "—"}
              unit="m"
            />
            <Metric
              label={t(lang, "swellPeriod")}
              value={snapshot.marine.swellPeriod?.toFixed(1) ?? "—"}
              unit="s"
            />
            <Metric
              label={t(lang, "sst")}
              value={snapshot.marine.seaSurfaceTemperature?.toFixed(1) ?? "—"}
              unit="°C"
            />
            <Metric
              label={t(lang, "current")}
              value={snapshot.marine.currentVelocity?.toFixed(2) ?? "—"}
              unit="m/s"
              sub={compass(snapshot.marine.currentDirection, lang)}
            />
          </div>
          <Note>
            {t(lang, "source")}: {SOURCES.marine}
            {snapshot.marineStatus !== "live" ? ` — ${t(lang, "fallbackNotice")}` : ""}
          </Note>
        </>
      )}
    </Section>
  );
}
