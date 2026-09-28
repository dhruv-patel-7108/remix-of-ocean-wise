import {
  combinedStatus,
  fetchMarine,
  fetchWeather,
  indexForTime,
  marineAt,
  weatherAt,
  type DataResult,
  type DataStatus,
  type MarineFields,
  type WeatherFields,
} from "./api";
import { derivedAlerts, demoAdvisories, type Alert } from "./alerts";
import { buildGeoSet, circlesOfKind, distanceToCircleKm } from "./geodata";
import type { MarineLocation } from "./locations";
import { computePfz, type PfzZone } from "./pfz";
import { assessRisk, type RiskAssessment } from "./risk";

export interface Snapshot {
  location: MarineLocation;
  when: Date;
  weather: WeatherFields;
  marine: MarineFields;
  weatherResult: DataResult;
  marineResult: DataResult;
  weatherStatus: DataStatus;
  marineStatus: DataStatus;
  overallStatus: DataStatus;
  validTime: string;
  risk: RiskAssessment;
  pfz: PfzZone[];
  alerts: { derived: Alert[]; demo: Alert[] };
  nearestRestrictedKm: number;
  nearestHazardKm: number;
}

export function buildSnapshot(
  location: MarineLocation,
  when: Date,
  weatherResult: DataResult,
  marineResult: DataResult,
): Snapshot {
  const wi = indexForTime(weatherResult.hourly, when);
  const mi = indexForTime(marineResult.hourly, when);
  const weather = weatherAt(weatherResult, wi);
  const marine = marineAt(marineResult, mi);

  const set = buildGeoSet(location);
  const here = { lat: location.lat, lon: location.lon };
  const restricted = [...circlesOfKind(set, "restricted"), ...circlesOfKind(set, "protected")];
  const hazards = circlesOfKind(set, "hazard");
  const nearestRestrictedKm = Math.min(...restricted.map((c) => distanceToCircleKm(here, c)));
  const nearestHazardKm = Math.min(...hazards.map((c) => distanceToCircleKm(here, c)));

  const overallStatus = combinedStatus(weatherResult.status, marineResult.status);

  return {
    location,
    when,
    weather,
    marine,
    weatherResult,
    marineResult,
    weatherStatus: weatherResult.status,
    marineStatus: marineResult.status,
    overallStatus,
    validTime: weatherResult.hourly.time[wi] ?? when.toISOString(),
    risk: assessRisk(weather, marine, {
      nearRestrictedKm: nearestRestrictedKm,
      nearHazardKm: nearestHazardKm,
    }),
    pfz: computePfz(location, weather, marine, overallStatus === "live"),
    alerts: { derived: derivedAlerts(weather, marine), demo: demoAdvisories(location) },
    nearestRestrictedKm,
    nearestHazardKm,
  };
}

/** Async snapshot used by the conversation engine (shares the API cache). */
export async function loadSnapshot(location: MarineLocation, when: Date): Promise<Snapshot> {
  const [w, m] = await Promise.all([fetchWeather(location), fetchMarine(location)]);
  return buildSnapshot(location, when, w, m);
}
