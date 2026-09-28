import type { MarineFields, WeatherFields } from "./api";
import {
  buildGeoSet,
  circlesOfKind,
  distanceToCircleKm,
  type CircleFeature,
  type PfzMeta,
} from "./geodata";
import { haversineKm, type Lang, type MarineLocation } from "./locations";

export interface PfzZone {
  id: string;
  name: Record<Lang, string>;
  center: { lat: number; lon: number };
  radiusKm: number;
  distanceKm: number;
  score: number;
  confidence: number;
  sst: number | null;
  chlorophyll: number;
  depthM: number;
  species: Record<Lang, string>;
  reasons: Record<Lang, string>;
  meta: PfzMeta;
}

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Suitability blends demo habitat descriptors (chlorophyll, depth) with live
 * sea state — rough water and long transits reduce the score.
 */
export function computePfz(
  loc: MarineLocation,
  w: WeatherFields,
  m: MarineFields,
  dataIsLive: boolean,
): PfzZone[] {
  const set = buildGeoSet(loc);
  const zones = circlesOfKind(set, "pfz");
  const restricted = [...circlesOfKind(set, "restricted"), ...circlesOfKind(set, "protected")];

  return zones
    .map((z: CircleFeature) => {
      const meta = set.pfzMeta[z.id] as PfzMeta;
      const distanceKm = haversineKm({ lat: loc.lat, lon: loc.lon }, z.center);
      const sst =
        m.seaSurfaceTemperature !== null
          ? Number((m.seaSurfaceTemperature + meta.sstOffset).toFixed(1))
          : null;

      let score = 42;
      score += clamp(meta.chlorophyll * 16, 0, 34);
      if (meta.depthM >= 30 && meta.depthM <= 80) score += 8;
      if (sst !== null && sst >= 26 && sst <= 29.5) score += 10;
      const wave = m.waveHeight ?? 1.5;
      score -= clamp((wave - 1.2) * 14, 0, 30);
      const wind = w.windSpeed ?? 15;
      score -= clamp((wind - 20) * 0.8, 0, 22);
      score -= clamp((distanceKm - 30) * 0.25, 0, 14);

      const nearestRestricted = restricted.length
        ? Math.min(...restricted.map((r) => distanceToCircleKm(z.center, r)))
        : 99;
      if (nearestRestricted < 0) score -= 30;
      else if (nearestRestricted < 6) score -= 12;

      score = Math.round(clamp(score));
      const confidence = Math.round(
        clamp((dataIsLive ? 74 : 48) - clamp((distanceKm - 25) * 0.4, 0, 18)),
      );

      const chl = meta.chlorophyll.toFixed(2);
      const reasons: Record<Lang, string> = {
        en: `Chlorophyll-a ${chl} mg/m³ over ${meta.depthM} m bottom, sea state ${wave.toFixed(1)} m, wind ${Math.round(wind)} km/h${
          nearestRestricted < 6 ? ", close to a restricted or protected boundary" : ""
        }.`,
        hi: `क्लोरोफिल-a ${chl} mg/m³, गहराई ${meta.depthM} मी, लहर ${wave.toFixed(1)} मी, हवा ${Math.round(wind)} km/h${
          nearestRestricted < 6 ? ", प्रतिबंधित या संरक्षित सीमा के निकट" : ""
        }।`,
        gu: `ક્લોરોફિલ-a ${chl} mg/m³, ઊંડાઈ ${meta.depthM} મી, મોજાં ${wave.toFixed(1)} મી, પવન ${Math.round(wind)} km/h${
          nearestRestricted < 6 ? ", પ્રતિબંધિત કે સંરક્ષિત સીમાની નજીક" : ""
        }.`,
      };

      return {
        id: z.id,
        name: z.name,
        center: z.center,
        radiusKm: z.radiusKm,
        distanceKm,
        score,
        confidence,
        sst,
        chlorophyll: meta.chlorophyll,
        depthM: meta.depthM,
        species: meta.species,
        reasons,
        meta,
      };
    })
    .sort((a, b) => b.score - a.score);
}
