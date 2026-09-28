import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchMarine, fetchWeather } from "../lib/api";
import type { Lang } from "../lib/i18n";
import { DEFAULT_LOCATION_ID, getLocation, type MarineLocation } from "../lib/locations";
import { buildSnapshot, type Snapshot } from "../lib/snapshot";

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  location: MarineLocation;
  setLocationId: (id: string) => void;
  /** Hours ahead of the current hour that the dashboard is showing. */
  offsetHours: number;
  setOffsetHours: (h: number) => void;
  when: Date;
  snapshot: Snapshot | null;
  isLoading: boolean;
  refresh: () => void;
}

const Ctx = createContext<AppState | null>(null);

const LANG_KEY = "orca.lang";
const LOC_KEY = "orca.location";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [locationId, setLocationIdState] = useState<string>(DEFAULT_LOCATION_ID);
  const [offsetHours, setOffsetHours] = useState(0);
  const [hourTick, setHourTick] = useState(() => Math.floor(Date.now() / 3600_000));

  useEffect(() => {
    try {
      const l = localStorage.getItem(LANG_KEY) as Lang | null;
      if (l === "en" || l === "hi" || l === "gu") setLangState(l);
      const loc = localStorage.getItem(LOC_KEY);
      if (loc) setLocationIdState(getLocation(loc).id);
    } catch {
      /* storage unavailable — keep defaults */
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => setHourTick(Math.floor(Date.now() / 3600_000)), 60_000);
    return () => clearInterval(id);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const setLocationId = useCallback((id: string) => {
    setLocationIdState(getLocation(id).id);
    try {
      localStorage.setItem(LOC_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const location = useMemo(() => getLocation(locationId), [locationId]);

  const when = useMemo(() => {
    const d = new Date(hourTick * 3600_000);
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + offsetHours);
    return d;
  }, [hourTick, offsetHours]);

  const weatherQ = useQuery({
    queryKey: ["weather", location.id],
    queryFn: () => fetchWeather(location),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const marineQ = useQuery({
    queryKey: ["marine", location.id],
    queryFn: () => fetchMarine(location),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const snapshot = useMemo(() => {
    if (!weatherQ.data || !marineQ.data) return null;
    return buildSnapshot(location, when, weatherQ.data, marineQ.data);
  }, [location, when, weatherQ.data, marineQ.data]);

  const refresh = useCallback(() => {
    void weatherQ.refetch();
    void marineQ.refetch();
  }, [weatherQ, marineQ]);

  const value: AppState = {
    lang,
    setLang,
    location,
    setLocationId,
    offsetHours,
    setOffsetHours,
    when,
    snapshot,
    isLoading: weatherQ.isLoading || marineQ.isLoading,
    refresh,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}
