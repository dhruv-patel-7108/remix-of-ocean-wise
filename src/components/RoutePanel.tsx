import { useEffect, useState } from "react";

import type { LatLon } from "../lib/geodata";
import { t } from "../lib/i18n";
import { getLocation, LOCATIONS } from "../lib/locations";
import { formatDuration, planRoutes, type RouteCandidate } from "../lib/route";
import { useApp } from "../state/app-state";
import { Button, EmptyState, Note, Section, Select, StatusBadge } from "./ui/primitives";

const SPEEDS = [6, 9, 12, 16];

export function RoutePanel({
  onRouteChange,
}: {
  onRouteChange: (points: LatLon[] | null, label?: string) => void;
}) {
  const { lang, location } = useApp();
  const [originId, setOriginId] = useState(location.id);
  const [destinationId, setDestinationId] = useState(
    LOCATIONS.find((l) => l.id !== location.id)?.id ?? LOCATIONS[1]!.id,
  );
  const [avoidRestricted, setAvoidRestricted] = useState(true);
  const [avoidHazards, setAvoidHazards] = useState(true);
  const [speedKn, setSpeedKn] = useState(9);
  const [routes, setRoutes] = useState<RouteCandidate[] | null>(null);
  const [activeId, setActiveId] = useState<RouteCandidate["id"]>("clearance");
  const [error, setError] = useState<string | null>(null);

  // Selected location is the single source of truth for the default origin.
  useEffect(() => {
    setOriginId(location.id);
    setDestinationId((d) =>
      d === location.id ? (LOCATIONS.find((l) => l.id !== location.id)?.id ?? d) : d,
    );
    setRoutes(null);
    setError(null);
    onRouteChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.id]);

  const compute = () => {
    if (originId === destinationId) {
      setError(t(lang, "sameEndpoints"));
      setRoutes(null);
      onRouteChange(null);
      return;
    }
    setError(null);
    const result = planRoutes(getLocation(originId), getLocation(destinationId), {
      avoidRestricted,
      avoidHazards,
      speedKn,
    });
    setRoutes(result);
    const active = result.find((r) => r.id === activeId) ?? result[0]!;
    onRouteChange(active.points, t(lang, active.labelKey));
  };

  const selectRoute = (r: RouteCandidate) => {
    setActiveId(r.id);
    onRouteChange(r.points, t(lang, r.labelKey));
  };

  return (
    <Section
      id="route"
      index={6}
      title={t(lang, "secRoute")}
      status={<StatusBadge status="demo" lang={lang} />}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          id="route-origin"
          label={t(lang, "origin")}
          value={originId}
          onChange={setOriginId}
          options={LOCATIONS.map((l) => ({ value: l.id, label: l.name[lang] }))}
        />
        <Select
          id="route-destination"
          label={t(lang, "destination")}
          value={destinationId}
          onChange={setDestinationId}
          options={LOCATIONS.map((l) => ({ value: l.id, label: l.name[lang] }))}
        />
        <Select
          id="route-speed"
          label={t(lang, "vesselSpeed")}
          value={String(speedKn)}
          onChange={(v) => setSpeedKn(Number(v))}
          options={SPEEDS.map((s) => ({ value: String(s), label: `${s} kn` }))}
        />
        <div className="flex flex-col justify-end gap-2">
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={avoidRestricted}
              onChange={(e) => setAvoidRestricted(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--color-primary)]"
            />
            {t(lang, "avoidRestricted")}
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={avoidHazards}
              onChange={(e) => setAvoidHazards(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--color-primary)]"
            />
            {t(lang, "avoidHazards")}
          </label>
        </div>
      </div>

      <div className="mt-3">
        <Button variant="primary" onClick={compute}>
          {t(lang, "computeRoute")}
        </Button>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-sm border border-destructive/60 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-4">
        {!routes ? (
          <EmptyState text={t(lang, "routeEmpty")} />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {routes.map((r) => (
              <li
                key={r.id}
                className={`rounded-sm border bg-surface-2/60 p-3 ${activeId === r.id ? "border-primary" : "border-border"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{t(lang, r.labelKey)}</h3>
                  <Button onClick={() => selectRoute(r)} pressed={activeId === r.id}>
                    {t(lang, "mapRoute")}
                  </Button>
                </div>
                <dl className="num mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <dt className="label-xs">{t(lang, "distance")}</dt>
                    <dd className="text-foreground">{r.distanceKm.toFixed(0)} km</dd>
                  </div>
                  <div>
                    <dt className="label-xs">{t(lang, "eta")}</dt>
                    <dd className="text-foreground">{formatDuration(r.hours, lang)}</dd>
                  </div>
                  <div>
                    <dt className="label-xs">{t(lang, "waypoints")}</dt>
                    <dd className="text-foreground">{r.points.length}</dd>
                  </div>
                </dl>
                <h4 className="label-xs mt-3">{t(lang, "routeWarnings")}</h4>
                {r.warnings.length ? (
                  <ul className="mt-1 space-y-1">
                    {r.warnings.map((w) => (
                      <li
                        key={w.id}
                        className={`text-xs leading-relaxed ${w.severity === "danger" ? "text-destructive" : w.severity === "warn" ? "text-caution" : "text-muted-foreground"}`}
                      >
                        {w.text[lang]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">{t(lang, "routeClear")}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Note>{t(lang, "routeDisclaimer")}</Note>
    </Section>
  );
}
