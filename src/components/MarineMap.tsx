import { useMemo, useState } from "react";

import { t } from "../lib/i18n";
import { buildGeoSet, type LatLon } from "../lib/geodata";
import type { Lang } from "../lib/locations";
import { useApp } from "../state/app-state";
import { Note, Section, StatusBadge } from "./ui/primitives";

const W = 1000;
const H = 620;
const PAD = 40;

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

  const { project, radiusPx } = useMemo(() => {
    const pts: LatLon[] = [
      ...geo.coast.points,
      ...geo.boundary.points,
      ...geo.lane.points,
      ...geo.ports.map((p) => p.at),
      ...geo.circles.flatMap((c) => {
        const dLat = c.radiusKm / 111;
        const dLon = c.radiusKm / (111 * Math.cos((c.center.lat * Math.PI) / 180));
        return [
          { lat: c.center.lat + dLat, lon: c.center.lon + dLon },
          { lat: c.center.lat - dLat, lon: c.center.lon - dLon },
        ];
      }),
      ...(routePoints ?? []),
    ];
    const lats = pts.map((p) => p.lat);
    const lons = pts.map((p) => p.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const cosLat = Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180));
    const spanX = Math.max((maxLon - minLon) * cosLat, 0.01);
    const spanY = Math.max(maxLat - minLat, 0.01);
    const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
    const offX = (W - spanX * scale) / 2;
    const offY = (H - spanY * scale) / 2;

    return {
      project: (p: LatLon) => ({
        x: offX + (p.lon - minLon) * cosLat * scale,
        y: offY + (maxLat - p.lat) * scale,
      }),
      radiusPx: (km: number) => (km / 111) * scale,
    };
  }, [geo, routePoints]);

  const path = (pts: LatLon[]) =>
    pts
      .map((p, i) => {
        const { x, y } = project(p);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const landPath = useMemo(() => {
    const coast = geo.coast.points.map(project);
    const inland = geo.coast.points
      .slice()
      .reverse()
      .map((p) => project(p));
    const dir = location.coast === "west" ? 1 : -1;
    const far = inland.map((p) => ({ x: p.x + dir * W, y: p.y }));
    return (
      coast.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
      " " +
      far.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
      " Z"
    );
  }, [geo, project, location.coast]);

  const kindStyle: Record<string, { fill: string; stroke: string }> = {
    pfz: { fill: "var(--color-ok)", stroke: "var(--color-ok)" },
    restricted: { fill: "var(--color-destructive)", stroke: "var(--color-destructive)" },
    protected: { fill: "var(--color-primary)", stroke: "var(--color-primary)" },
    hazard: { fill: "var(--color-warning)", stroke: "var(--color-warning)" },
  };

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

  const pick = (name: string, detail: string, meta?: string) => () =>
    setSelected({ name, detail, meta });

  const langKey = lang as Lang;

  return (
    <Section
      id="map"
      index={2}
      title={t(lang, "secMap")}
      status={snapshot ? <StatusBadge status="demo" lang={lang} /> : null}
      meta={<span className="num text-xs text-muted-foreground">{location.name[langKey]}</span>}
    >
      <div className="overflow-hidden rounded-sm border border-border bg-sea-deep">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`${t(lang, "secMap")} — ${location.name[langKey]}`}
        >
          <rect width={W} height={H} fill="var(--color-sea-deep)" />
          <path d={landPath} fill="var(--color-land)" opacity={0.55} />
          <path
            d={path(geo.coast.points)}
            fill="none"
            stroke="var(--color-foreground)"
            strokeOpacity={0.5}
            strokeWidth={2}
          />
          <path
            d={path(geo.boundary.points)}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            strokeDasharray="10 8"
            opacity={0.8}
          />
          <path
            d={path(geo.lane.points)}
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth={6}
            strokeDasharray="22 14"
            opacity={0.45}
          />

          {geo.circles.map((c) => {
            const { x, y } = project(c.center);
            const r = radiusPx(c.radiusKm);
            const style = kindStyle[c.kind] ?? kindStyle["pfz"]!;
            return (
              <g key={c.id} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={style.fill}
                  fillOpacity={0.14}
                  stroke={style.stroke}
                  strokeOpacity={0.85}
                  strokeWidth={1.5}
                  strokeDasharray={
                    c.kind === "restricted" || c.kind === "protected" ? "6 5" : undefined
                  }
                  tabIndex={0}
                  role="button"
                  aria-label={c.name[langKey]}
                  onClick={pick(
                    c.name[langKey],
                    c.detail[langKey],
                    `${c.center.lat.toFixed(3)}, ${c.center.lon.toFixed(3)} · r ${c.radiusKm.toFixed(0)} km`,
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      pick(c.name[langKey], c.detail[langKey])();
                  }}
                />
                {c.kind === "pfz" || selected?.name === c.name[langKey] ? (
                  <text
                    x={x}
                    y={y - r - 6}
                    textAnchor="middle"
                    fontSize={13}
                    fill="var(--color-foreground)"
                    opacity={0.85}
                  >
                    {c.name[langKey]}
                  </text>
                ) : null}
              </g>
            );
          })}

          {routePoints && routePoints.length > 1 ? (
            <path d={path(routePoints)} fill="none" stroke="var(--color-primary)" strokeWidth={3} />
          ) : null}
          {routePoints && routePoints.length > 1
            ? [routePoints[0]!, routePoints[routePoints.length - 1]!].map((p, i) => {
                const { x, y } = project(p);
                return <circle key={i} cx={x} cy={y} r={5} fill="var(--color-primary)" />;
              })
            : null}

          {geo.ports.map((p) => {
            const { x, y } = project(p.at);
            return (
              <g key={p.id} className="cursor-pointer">
                <rect
                  x={x - 5}
                  y={y - 5}
                  width={10}
                  height={10}
                  fill="var(--color-foreground)"
                  tabIndex={0}
                  role="button"
                  aria-label={p.name[langKey]}
                  onClick={pick(
                    p.name[langKey],
                    p.detail[langKey],
                    `${p.at.lat.toFixed(3)}, ${p.at.lon.toFixed(3)}`,
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      pick(p.name[langKey], p.detail[langKey])();
                  }}
                />
                <text x={x + 10} y={y + 4} fontSize={14} fill="var(--color-foreground)">
                  {p.name[langKey]}
                </text>
              </g>
            );
          })}
        </svg>
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
