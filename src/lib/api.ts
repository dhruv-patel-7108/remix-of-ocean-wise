import type { MarineLocation } from "./locations";

export type DataStatus = "live" | "demo" | "unavailable";

export interface HourlySeries {
  time: string[];
  values: Record<string, (number | null)[]>;
}

export interface DataResult {
  status: DataStatus;
  fetchedAt: number;
  hourly: HourlySeries;
  error?: string;
}

export interface WeatherFields {
  temperature: number | null;
  windSpeed: number | null;
  windDirection: number | null;
  windGusts: number | null;
  visibility: number | null;
  precipitationProbability: number | null;
  precipitation: number | null;
}

export interface MarineFields {
  waveHeight: number | null;
  waveDirection: number | null;
  wavePeriod: number | null;
  swellHeight: number | null;
  swellPeriod: number | null;
  seaSurfaceTemperature: number | null;
  currentVelocity: number | null;
  currentDirection: number | null;
}

const WEATHER_VARS = [
  "temperature_2m",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "visibility",
  "precipitation_probability",
  "precipitation",
];

const MARINE_VARS = [
  "wave_height",
  "wave_direction",
  "wave_period",
  "swell_wave_height",
  "swell_wave_period",
  "sea_surface_temperature",
  "ocean_current_velocity",
  "ocean_current_direction",
];

export const SOURCES = {
  weather: "Open-Meteo Forecast API",
  marine: "Open-Meteo Marine API",
  geo: "ORCA demo geospatial dataset",
  model: "ORCA internal calculation",
} as const;

const CACHE_MS = 10 * 60 * 1000;
const cache = new Map<string, DataResult>();

function hoursFrom(startOfToday: Date, count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startOfToday.getTime() + i * 3600_000);
    out.push(isoLocal(d));
  }
  return out;
}

/** Open-Meteo returns local-naive ISO strings (YYYY-MM-DDTHH:mm); mirror that for demo data. */
export function isoLocal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`;
}

function seedOf(loc: MarineLocation): number {
  return Math.abs(Math.round(loc.lat * 1000 + loc.lon * 977));
}

function wave(seed: number, i: number, period: number, phase: number): number {
  return Math.sin((i / period) * Math.PI * 2 + (seed % 97) / 97 + phase);
}

function demoWeather(loc: MarineLocation, hours: string[]): HourlySeries {
  const s = seedOf(loc);
  const n = hours.length;
  const base = loc.coast === "west" ? 14 : 12;
  const temperature_2m: (number | null)[] = [];
  const wind_speed_10m: (number | null)[] = [];
  const wind_direction_10m: (number | null)[] = [];
  const wind_gusts_10m: (number | null)[] = [];
  const visibility: (number | null)[] = [];
  const precipitation_probability: (number | null)[] = [];
  const precipitation: (number | null)[] = [];
  for (let i = 0; i < n; i++) {
    const ws = Math.max(3, base + wave(s, i, 24, 0) * 5 + wave(s, i, 7, 1.2) * 2);
    temperature_2m.push(Number((27 + wave(s, i, 24, -1.5) * 3.5).toFixed(1)));
    wind_speed_10m.push(Number(ws.toFixed(1)));
    wind_direction_10m.push(
      Math.round(((loc.coast === "west" ? 245 : 120) + wave(s, i, 36, 0.5) * 30 + 360) % 360),
    );
    wind_gusts_10m.push(Number((ws * 1.45).toFixed(1)));
    visibility.push(Math.round(14000 + wave(s, i, 30, 2) * 5000));
    const pp = Math.max(0, Math.round(30 + wave(s, i, 18, 0.9) * 30));
    precipitation_probability.push(pp);
    precipitation.push(Number(Math.max(0, (pp - 55) / 30).toFixed(1)));
  }
  return {
    time: hours,
    values: {
      temperature_2m,
      wind_speed_10m,
      wind_direction_10m,
      wind_gusts_10m,
      visibility,
      precipitation_probability,
      precipitation,
    },
  };
}

function demoMarine(loc: MarineLocation, hours: string[]): HourlySeries {
  const s = seedOf(loc) + 31;
  const n = hours.length;
  const wave_height: (number | null)[] = [];
  const wave_direction: (number | null)[] = [];
  const wave_period: (number | null)[] = [];
  const swell_wave_height: (number | null)[] = [];
  const swell_wave_period: (number | null)[] = [];
  const sea_surface_temperature: (number | null)[] = [];
  const ocean_current_velocity: (number | null)[] = [];
  const ocean_current_direction: (number | null)[] = [];
  for (let i = 0; i < n; i++) {
    const wh = Math.max(0.3, 1.4 + wave(s, i, 26, 0) * 0.7 + wave(s, i, 9, 2) * 0.25);
    wave_height.push(Number(wh.toFixed(2)));
    wave_direction.push(
      Math.round(((loc.coast === "west" ? 250 : 135) + wave(s, i, 40, 1) * 25 + 360) % 360),
    );
    wave_period.push(Number((7 + wave(s, i, 22, 0.3) * 1.8).toFixed(1)));
    swell_wave_height.push(Number((wh * 0.72).toFixed(2)));
    swell_wave_period.push(Number((9.5 + wave(s, i, 28, 1.7) * 2).toFixed(1)));
    sea_surface_temperature.push(Number((28.2 + wave(s, i, 48, 0.2) * 1.4).toFixed(1)));
    ocean_current_velocity.push(Number(Math.abs(0.4 + wave(s, i, 20, 1.1) * 0.25).toFixed(2)));
    ocean_current_direction.push(
      Math.round(((loc.coast === "west" ? 200 : 40) + wave(s, i, 34, 0.7) * 40 + 360) % 360),
    );
  }
  return {
    time: hours,
    values: {
      wave_height,
      wave_direction,
      wave_period,
      swell_wave_height,
      swell_wave_period,
      sea_surface_temperature,
      ocean_current_velocity,
      ocean_current_direction,
    },
  };
}

function demoResult(loc: MarineLocation, kind: "weather" | "marine", error?: string): DataResult {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(0);
  const hours = hoursFrom(start, 24 * 4);
  return {
    status: "demo",
    fetchedAt: Date.now(),
    hourly: kind === "weather" ? demoWeather(loc, hours) : demoMarine(loc, hours),
    ...(error ? { error } : {}),
  };
}

async function fetchSeries(url: string, vars: string[]): Promise<HourlySeries> {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as { hourly?: Record<string, unknown> };
  const hourly = json.hourly;
  const times = hourly?.["time"];
  if (!hourly || !Array.isArray(times)) throw new Error("malformed response");
  const values: Record<string, (number | null)[]> = {};
  for (const v of vars) {
    const arr = hourly[v];
    values[v] = Array.isArray(arr) ? (arr as (number | null)[]) : [];
  }
  return { time: times as string[], values };
}

async function load(loc: MarineLocation, kind: "weather" | "marine"): Promise<DataResult> {
  const key = `${kind}:${loc.id}`;
  const hit = cache.get(key);
  if (hit && hit.status === "live" && Date.now() - hit.fetchedAt < CACHE_MS) return hit;

  const vars = kind === "weather" ? WEATHER_VARS : MARINE_VARS;
  const base =
    kind === "weather"
      ? "https://api.open-meteo.com/v1/forecast"
      : "https://marine-api.open-meteo.com/v1/marine";
  const url =
    `${base}?latitude=${loc.lat}&longitude=${loc.lon}&hourly=${vars.join(",")}` +
    `&timezone=auto&forecast_days=4`;

  try {
    const hourly = await fetchSeries(url, vars);
    const result: DataResult = { status: "live", fetchedAt: Date.now(), hourly };
    cache.set(key, result);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "network error";
    if (hit && hit.status === "live") {
      // Serve the most recent valid live payload, marked as its original fetch time.
      return { ...hit, error: message };
    }
    const fallback = demoResult(loc, kind, message);
    cache.set(key, fallback);
    return fallback;
  }
}

export const fetchWeather = (loc: MarineLocation) => load(loc, "weather");
export const fetchMarine = (loc: MarineLocation) => load(loc, "marine");

/** Index of the hour nearest to the requested timestamp. */
export function indexForTime(series: HourlySeries, when: Date): number {
  if (!series.time.length) return 0;
  const target = when.getTime();
  let best = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < series.time.length; i++) {
    const stamp = series.time[i];
    if (!stamp) continue;
    const diff = Math.abs(new Date(stamp).getTime() - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return best;
}

const at = (s: HourlySeries, key: string, i: number): number | null => {
  const v = s.values[key]?.[i];
  return typeof v === "number" ? v : null;
};

export function weatherAt(r: DataResult, i: number): WeatherFields {
  return {
    temperature: at(r.hourly, "temperature_2m", i),
    windSpeed: at(r.hourly, "wind_speed_10m", i),
    windDirection: at(r.hourly, "wind_direction_10m", i),
    windGusts: at(r.hourly, "wind_gusts_10m", i),
    visibility: at(r.hourly, "visibility", i),
    precipitationProbability: at(r.hourly, "precipitation_probability", i),
    precipitation: at(r.hourly, "precipitation", i),
  };
}

export function marineAt(r: DataResult, i: number): MarineFields {
  return {
    waveHeight: at(r.hourly, "wave_height", i),
    waveDirection: at(r.hourly, "wave_direction", i),
    wavePeriod: at(r.hourly, "wave_period", i),
    swellHeight: at(r.hourly, "swell_wave_height", i),
    swellPeriod: at(r.hourly, "swell_wave_period", i),
    seaSurfaceTemperature: at(r.hourly, "sea_surface_temperature", i),
    currentVelocity: at(r.hourly, "ocean_current_velocity", i),
    currentDirection: at(r.hourly, "ocean_current_direction", i),
  };
}

export function combinedStatus(...s: DataStatus[]): DataStatus {
  if (s.every((x) => x === "live")) return "live";
  if (s.some((x) => x === "unavailable")) return "unavailable";
  return "demo";
}
