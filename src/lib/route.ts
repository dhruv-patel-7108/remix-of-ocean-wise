import { buildGeoSet, offset, type CircleFeature, type LatLon } from "./geodata";
import { bearingDeg, haversineKm, type Lang, type MarineLocation } from "./locations";

export interface RouteWarning {
  id: string;
  text: Record<Lang, string>;
  severity: "info" | "warn" | "danger";
}

export interface RouteCandidate {
  id: "direct" | "clearance";
  labelKey: "routeDirect" | "routeSafe";
  points: LatLon[];
  distanceKm: number;
  hours: number;
  warnings: RouteWarning[];
}

function legLength(points: LatLon[]): number {
  let d = 0;
  for (let i = 1; i < points.length; i++) d += haversineKm(points[i - 1]!, points[i]!);
  return d;
}

function interpolate(a: LatLon, b: LatLon, steps: number): LatLon[] {
  const out: LatLon[] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    out.push({ lat: a.lat + (b.lat - a.lat) * f, lon: a.lon + (b.lon - a.lon) * f });
  }
  return out;
}

function intersects(points: LatLon[], c: CircleFeature): boolean {
  return points.some((p) => haversineKm(p, c.center) < c.radiusKm);
}

function obstaclesFor(
  origin: MarineLocation,
  destination: MarineLocation,
  avoidRestricted: boolean,
  avoidHazards: boolean,
): CircleFeature[] {
  const kinds: string[] = [];
  if (avoidRestricted) kinds.push("restricted", "protected");
  if (avoidHazards) kinds.push("hazard");
  const sets = [buildGeoSet(origin), buildGeoSet(destination)];
  return sets.flatMap((s) => s.circles.filter((c) => kinds.includes(c.kind)));
}

/** Push a waypoint clear of a circle by radius + margin, perpendicular to the track. */
function clearOf(p: LatLon, c: CircleFeature, trackBearing: number, marginKm: number): LatLon {
  const dist = haversineKm(p, c.center);
  if (dist >= c.radiusKm + marginKm) return p;
  const away = bearingDeg(c.center, p);
  const side =
    Math.abs(((away - trackBearing + 540) % 360) - 180) > 90 ? away : (trackBearing + 90) % 360;
  return offset(c.center, c.radiusKm + marginKm, side);
}

export function planRoutes(
  origin: MarineLocation,
  destination: MarineLocation,
  opts: { avoidRestricted: boolean; avoidHazards: boolean; speedKn: number },
): RouteCandidate[] {
  const a: LatLon = { lat: origin.lat, lon: origin.lon };
  const b: LatLon = { lat: destination.lat, lon: destination.lon };
  const track = bearingDeg(a, b);
  const steps = Math.max(8, Math.min(28, Math.round(haversineKm(a, b) / 15)));
  const direct = interpolate(a, b, steps);

  const allObstacles = obstaclesFor(origin, destination, true, true);
  const avoided = obstaclesFor(origin, destination, opts.avoidRestricted, opts.avoidHazards);

  const clearance = direct.map((p, i) => {
    if (i === 0 || i === direct.length - 1) return p;
    let q = p;
    for (const c of avoided) q = clearOf(q, c, track, 4);
    return q;
  });

  const kmh = opts.speedKn * 1.852;

  const build = (id: RouteCandidate["id"], points: LatLon[]): RouteCandidate => {
    const distanceKm = legLength(points);
    const warnings: RouteWarning[] = [];
    for (const c of allObstacles) {
      if (intersects(points, c)) {
        warnings.push({
          id: c.id,
          severity: c.kind === "restricted" ? "danger" : "warn",
          text: {
            en: `Track passes through ${c.name.en}.`,
            hi: `मार्ग ${c.name.hi} से होकर जाता है।`,
            gu: `માર્ગ ${c.name.gu} માંથી પસાર થાય છે.`,
          },
        });
      }
    }
    const lanes = [buildGeoSet(origin).lane, buildGeoSet(destination).lane];
    for (const lane of lanes) {
      const near = points.some((p) => lane.points.some((lp) => haversineKm(p, lp) < 9));
      if (near) {
        warnings.push({
          id: `${lane.id}-${id}`,
          severity: "info",
          text: {
            en: "Track crosses a demo shipping lane — keep a sharp lookout for merchant traffic.",
            hi: "मार्ग डेमो जहाजी गलियारे को पार करता है — व्यापारिक यातायात पर सतर्क दृष्टि रखें।",
            gu: "માર્ગ ડેમો જહાજી કોરિડોર ઓળંગે છે — વ્યાપારી ટ્રાફિક પર ધ્યાન રાખો.",
          },
        });
        break;
      }
    }
    return {
      id,
      labelKey: id === "direct" ? "routeDirect" : "routeSafe",
      points,
      distanceKm,
      hours: distanceKm / kmh,
      warnings,
    };
  };

  return [build("direct", direct), build("clearance", clearance)];
}

export function formatDuration(hours: number, lang: Lang): string {
  if (!Number.isFinite(hours)) return "—";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const hu = lang === "hi" ? "घं" : lang === "gu" ? "ક" : "h";
  const mu = lang === "hi" ? "मि" : lang === "gu" ? "મિ" : "m";
  return `${h} ${hu} ${String(m).padStart(2, "0")} ${mu}`;
}
