import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";

import { t } from "../lib/i18n";
import { buildGeoSet, type LatLon } from "../lib/geodata";
import type { Lang } from "../lib/locations";
import { useApp } from "../state/app-state";
import { Note, Section, StatusBadge } from "./ui/primitives";

const MarineLeafletMap = lazy(() =>
  import("./MarineLeafletMap").then((module) => ({ default: module.MarineLeafletMap })),
);

interface Selected {
  name: string;
  detail: string;
  meta?: string | undefined;
}

export function MarineMap({
  routePoints,
  routeLabel,
}: {
  routePoints?: LatLon[] | null | undefined;
  routeLabel?: string | undefined;
}) {
  const { lang, location, snapshot } = useApp();
  const [selected, setSelected] = useState<Selected | null>(null);

  const geo = useMemo(() => buildGeoSet(location), [location]);

  useEffect(() => setSelected(null), [location.id]);

  const legend: { key: string; label: string; swatch: string; dashed?: boolean }[] = [
    { key: "port", label: t(lang, "mapPort"), swatch: "var(--color-foreground)" },
    { key: "pfz", label: t(lang, "mapPfz"), swatch: "var(--color-ok)" },
    { key: "restricted", label: t(lang, "mapRestricted"), swatch: "var(--color-destructive)" },
    { key: "protected", label: t(lang, "mapProtected"), swatch: "var(--color-primary)" },
    { key: "hazard", label: t(lang, "mapHazard"), swatch: "var(--color-warning)" },
    {
      key: "lane",
      label: t(lang, "mapLane"),
      swatch: "var(--color-muted-foreground)",
      dashed: true,
    },
    { key: "boundary", label: t(lang, "mapBoundary"), swatch: "var(--color-accent)", dashed: true },
    { key: "route", label: t(lang, "mapRoute"), swatch: "var(--color-primary)" },
  ];

  const langKey = lang as Lang;

  return (
    <Section
      id="map"
      index={2}
      title={t(lang, "secMap")}
      status={snapshot ? <StatusBadge status="demo" lang={lang} /> : null}
      meta={<span className="num text-xs text-muted-foreground">{location.name[langKey]}</span>}
    >
      <div className="overflow-hidden rounded-sm border border-border bg-sea">
        <ClientOnly fallback={<div className="h-[360px] animate-pulse bg-sea sm:h-[430px]" />}>
          <Suspense fallback={<div className="h-[360px] animate-pulse bg-sea sm:h-[430px]" />}>
            <MarineLeafletMap
              key={location.id}
              geo={geo}
              location={location}
              lang={langKey}
              routePoints={routePoints}
              onSelect={setSelected}
            />
          </Suspense>
        </ClientOnly>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h3 className="label-xs">{t(lang, "legend")}</h3>
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:grid-cols-3 lg:grid-cols-2">
            {legend.map((l) => (
              <li key={l.key} className="flex items-center gap-2 text-muted-foreground">
                <span
                  aria-hidden
                  className="inline-block h-0 w-4 border-t-2"
                  style={{ borderColor: l.swatch, borderStyle: l.dashed ? "dashed" : "solid" }}
                />
                {l.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="label-xs">{routeLabel ?? t(lang, "mapFeature")}</h3>
          {selected ? (
            <div className="mt-2 rounded-sm border border-border bg-surface-2 px-3 py-2">
              <div className="text-sm font-medium">{selected.name}</div>
              {selected.meta ? (
                <div className="num mt-0.5 text-xs text-muted-foreground">{selected.meta}</div>
              ) : null}
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {selected.detail}
              </p>
            </div>
          ) : (
            <p className="mt-2 rounded-sm border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
              {t(lang, "mapSelect")}
            </p>
          )}
        </div>
      </div>
      <Note>{t(lang, "mapGeometryNote")}</Note>
    </Section>
  );
}
