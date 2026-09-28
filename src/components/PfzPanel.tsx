import { t } from "../lib/i18n";
import { bearingDeg } from "../lib/locations";
import { compass } from "../lib/i18n";
import { useApp } from "../state/app-state";
import { EmptyState, Note, Section, StatusBadge } from "./ui/primitives";

export function PfzPanel() {
  const { lang, snapshot, location } = useApp();

  return (
    <Section
      id="pfz"
      index={5}
      title={t(lang, "secPfz")}
      status={snapshot ? <StatusBadge status="demo" lang={lang} /> : null}
      meta={
        snapshot ? (
          <span className="text-xs text-muted-foreground">
            {t(lang, "bestZone")}:{" "}
            <span className="font-medium text-foreground">{snapshot.pfz[0]?.name[lang]}</span>
          </span>
        ) : null
      }
    >
      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : (
        <>
          <ul className="grid gap-3 md:grid-cols-2">
            {snapshot.pfz.map((z) => (
              <li key={z.id} className="rounded-sm border border-border bg-surface-2/60 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold">{z.name[lang]}</h3>
                  <span className="num text-sm text-primary">{z.score}/100</span>
                </div>
                <div
                  className="mt-2 h-1 w-full bg-surface"
                  role="meter"
                  aria-valuenow={z.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${z.name[lang]} ${t(lang, "suitability")}`}
                >
                  <div className="h-1 bg-primary" style={{ width: `${z.score}%` }} />
                </div>
                <dl className="num mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <div>
                    <dt className="inline">{t(lang, "distance")}: </dt>
                    <dd className="inline text-foreground">
                      {z.distanceKm.toFixed(0)} km {compass(bearingDeg(location, z.center), lang)}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline">{t(lang, "confidence")}: </dt>
                    <dd className="inline text-foreground">{z.confidence}%</dd>
                  </div>
                  <div>
                    <dt className="inline">{t(lang, "sst")}: </dt>
                    <dd className="inline text-foreground">{z.sst?.toFixed(1) ?? "—"} °C</dd>
                  </div>
                  <div>
                    <dt className="inline">{t(lang, "chlorophyll")}: </dt>
                    <dd className="inline text-foreground">{z.chlorophyll} mg/m³</dd>
                  </div>
                  <div>
                    <dt className="inline">{t(lang, "depth")}: </dt>
                    <dd className="inline text-foreground">{z.depthM} m</dd>
                  </div>
                  <div>
                    <dt className="inline">{t(lang, "coordinates")}: </dt>
                    <dd className="inline text-foreground">
                      {z.center.lat.toFixed(3)}, {z.center.lon.toFixed(3)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="label-xs">{t(lang, "explanation")}</span> {z.reasons[lang]}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="label-xs">{t(lang, "species")}</span> {z.species[lang]}
                </p>
              </li>
            ))}
          </ul>
          <Note>{t(lang, "pfzNote")}</Note>
        </>
      )}
    </Section>
  );
}
