import { bearingDeg, haversineKm, type Lang, type MarineLocation } from "./locations";

export interface LatLon {
  lat: number;
  lon: number;
}

export type FeatureKind =
  "pfz" | "restricted" | "protected" | "hazard" | "port" | "lane" | "boundary";

export interface CircleFeature {
  id: string;
  kind: Exclude<FeatureKind, "lane" | "boundary" | "port">;
  center: LatLon;
  radiusKm: number;
  name: Record<Lang, string>;
  detail: Record<Lang, string>;
}

export interface LineFeature {
  id: string;
  kind: "lane" | "boundary" | "coast";
  points: LatLon[];
  name: Record<Lang, string>;
  detail: Record<Lang, string>;
}

export interface PortFeature {
  id: string;
  kind: "port";
  at: LatLon;
  name: Record<Lang, string>;
  detail: Record<Lang, string>;
}

export interface PfzMeta {
  id: string;
  bearing: number;
  distanceKm: number;
  depthM: number;
  chlorophyll: number;
  sstOffset: number;
  species: Record<Lang, string>;
}

export interface GeoSet {
  coast: LineFeature;
  boundary: LineFeature;
  lane: LineFeature;
  circles: CircleFeature[];
  ports: PortFeature[];
  pfzMeta: Record<string, PfzMeta>;
}

/** Deterministic PRNG so demo geometry is stable per location. */
function rng(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const KM_PER_DEG = 111;

/** Offset a point by distance (km) along a compass bearing. */
export function offset(p: LatLon, km: number, bearing: number): LatLon {
  const rad = (bearing * Math.PI) / 180;
  const dLat = (km * Math.cos(rad)) / KM_PER_DEG;
  const dLon = (km * Math.sin(rad)) / (KM_PER_DEG * Math.cos((p.lat * Math.PI) / 180));
  return { lat: p.lat + dLat, lon: p.lon + dLon };
}

/** Bearing pointing away from land for a given coast. */
export function seawardBearing(loc: MarineLocation): number {
  return loc.coast === "west" ? 230 : 110;
}

const SPECIES: Record<Lang, string>[] = [
  { en: "Indian mackerel, oil sardine", hi: "बांगड़ा, तेल सार्डिन", gu: "બાંગડા, તેલ સારડીન" },
  { en: "Ribbonfish, Bombay duck", hi: "रिबनफिश, बॉम्बे डक", gu: "રિબનફિશ, બોમ્બે ડક" },
  { en: "Seer fish, tuna", hi: "सुरमई, टूना", gu: "સુરમઈ, ટૂના" },
  { en: "Pomfret, croaker", hi: "पॉमफ्रेट, क्रोकर", gu: "પોમ્ફ્રેટ, ક્રોકર" },
  { en: "Shrimp, cuttlefish", hi: "झींगा, कटलफिश", gu: "ઝીંગા, કટલફિશ" },
];

function zoneName(i: number): Record<Lang, string> {
  const tag = `PFZ-${String(i + 1).padStart(2, "0")}`;
  return {
    en: `Zone ${tag}`,
    hi: `क्षेत्र ${tag}`,
    gu: `વિસ્તાર ${tag}`,
  };
}

const cacheGeo = new Map<string, GeoSet>();

export function buildGeoSet(loc: MarineLocation): GeoSet {
  const cached = cacheGeo.get(loc.id);
  if (cached) return cached;

  const rand = rng(loc.id);
  const sea = seawardBearing(loc);
  const alongCoast = (sea + 90) % 360;

  // Coastline: a gently varying line through the port, perpendicular to the seaward direction.
  const coastPoints: LatLon[] = [];
  for (let i = -6; i <= 6; i++) {
    const base = offset({ lat: loc.lat, lon: loc.lon }, i * 12, alongCoast);
    coastPoints.push(offset(base, (rand() - 0.5) * 8 - 2, sea));
  }

  const coast: LineFeature = {
    id: "coast",
    kind: "coast",
    points: coastPoints,
    name: { en: "Coastline", hi: "तटरेखा", gu: "તટરેખા" },
    detail: {
      en: "Generalised coastline for orientation only.",
      hi: "केवल दिशा-बोध हेतु सरलीकृत तटरेखा।",
      gu: "માત્ર દિશા સમજવા માટે સરળ કરેલી તટરેખા.",
    },
  };

  const boundary: LineFeature = {
    id: "boundary",
    kind: "boundary",
    points: coastPoints.map((p) => offset(p, 22.2, sea)),
    name: { en: "12 nm territorial limit", hi: "12 नॉटिकल मील सीमा", gu: "12 નોટિકલ માઈલ સીમા" },
    detail: {
      en: "Approximate 12 nautical mile line drawn from the demo coastline. Indicative only.",
      hi: "डेमो तटरेखा से खींची गई अनुमानित 12 नॉटिकल मील रेखा। केवल संकेतात्मक।",
      gu: "ડેમો તટરેખાથી દોરેલી અંદાજિત 12 નોટિકલ માઈલ રેખા. માત્ર સૂચક.",
    },
  };

  const lane: LineFeature = {
    id: "lane",
    kind: "lane",
    points: coastPoints.filter((_, i) => i % 3 === 0).map((p) => offset(p, 46 + rand() * 6, sea)),
    name: { en: "Coastal shipping lane", hi: "तटीय जहाजी मार्ग", gu: "તટીય જહાજી માર્ગ" },
    detail: {
      en: "Demo traffic corridor used for crossing warnings.",
      hi: "पार करने की चेतावनी हेतु प्रयुक्त डेमो यातायात गलियारा।",
      gu: "ક્રોસિંગ ચેતવણી માટે વપરાતો ડેમો ટ્રાફિક કોરિડોર.",
    },
  };

  const circles: CircleFeature[] = [];
  const pfzMeta: Record<string, PfzMeta> = {};

  for (let i = 0; i < 4; i++) {
    const brg = (sea - 45 + i * 30 + rand() * 12) % 360;
    const dist = 18 + i * 14 + rand() * 10;
    const center = offset({ lat: loc.lat, lon: loc.lon }, dist, brg);
    const id = `${loc.id}-pfz-${i}`;
    circles.push({
      id,
      kind: "pfz",
      center,
      radiusKm: 7 + rand() * 4,
      name: zoneName(i),
      detail: {
        en: "Demo fishing zone polygon; suitability scored from live wind and wave data.",
        hi: "डेमो मत्स्य क्षेत्र; उपयुक्तता लाइव हवा एवं लहर डेटा से आँकी गई।",
        gu: "ડેમો મત્સ્ય વિસ્તાર; અનુકૂળતા લાઇવ પવન અને મોજાં ડેટાથી આંકી.",
      },
    });
    pfzMeta[id] = {
      id,
      bearing: brg,
      distanceKm: dist,
      depthM: Math.round(18 + dist * 0.9 + rand() * 20),
      chlorophyll: Number((0.4 + rand() * 2.1).toFixed(2)),
      sstOffset: Number((rand() * 1.4 - 0.7).toFixed(1)),
      species: SPECIES[i % SPECIES.length] as Record<Lang, string>,
    };
  }

  circles.push({
    id: `${loc.id}-restricted-0`,
    kind: "restricted",
    center: offset({ lat: loc.lat, lon: loc.lon }, 34, (sea + 55) % 360),
    radiusKm: 11,
    name: {
      en: "Restricted naval exercise box",
      hi: "प्रतिबंधित नौसैनिक अभ्यास क्षेत्र",
      gu: "પ્રતિબંધિત નૌકા કવાયત વિસ્તાર",
    },
    detail: {
      en: "Demo restriction polygon. Real restrictions are published in official notices to mariners.",
      hi: "डेमो प्रतिबंध क्षेत्र। वास्तविक प्रतिबंध आधिकारिक नाविक सूचनाओं में प्रकाशित होते हैं।",
      gu: "ડેમો પ્રતિબંધ વિસ્તાર. વાસ્તવિક પ્રતિબંધ સત્તાવાર નાવિક સૂચનામાં પ્રસિદ્ધ થાય છે.",
    },
  });

  circles.push({
    id: `${loc.id}-protected-0`,
    kind: "protected",
    center: offset({ lat: loc.lat, lon: loc.lon }, 27, (sea - 68 + 360) % 360),
    radiusKm: 9,
    name: {
      en: "Protected marine habitat",
      hi: "संरक्षित समुद्री आवास",
      gu: "સંરક્ષિત દરિયાઈ આવાસ",
    },
    detail: {
      en: "Demo conservation area; trawling assumed prohibited in scoring.",
      hi: "डेमो संरक्षण क्षेत्र; स्कोरिंग में ट्रॉलिंग निषिद्ध मानी गई है।",
      gu: "ડેમો સંરક્ષણ વિસ્તાર; સ્કોરિંગમાં ટ્રોલિંગ પ્રતિબંધિત ગણી છે.",
    },
  });

  circles.push({
    id: `${loc.id}-hazard-0`,
    kind: "hazard",
    center: offset({ lat: loc.lat, lon: loc.lon }, 20, (sea + 18) % 360),
    radiusKm: 6,
    name: {
      en: "Shoal and wreck hazard",
      hi: "उथला जल एवं मलबा खतरा",
      gu: "છીછરું પાણી અને ભંગાર જોખમ",
    },
    detail: {
      en: "Demo hazard: charted shoal patch with reported wreck.",
      hi: "डेमो खतरा: चिह्नित उथला क्षेत्र एवं सूचित मलबा।",
      gu: "ડેમો જોખમ: નોંધાયેલ છીછરો પટ્ટો અને ભંગાર.",
    },
  });

  circles.push({
    id: `${loc.id}-hazard-1`,
    kind: "hazard",
    center: offset({ lat: loc.lat, lon: loc.lon }, 41, (sea - 20 + 360) % 360),
    radiusKm: 7,
    name: {
      en: "Offshore platform exclusion",
      hi: "अपतटीय प्लेटफॉर्म वर्जित क्षेत्र",
      gu: "દરિયાઈ પ્લેટફોર્મ વર્જિત વિસ્તાર",
    },
    detail: {
      en: "Demo 500 m platform exclusion scaled up for visibility.",
      hi: "डेमो 500 मीटर वर्जित क्षेत्र, दृश्यता हेतु बड़ा दिखाया गया।",
      gu: "ડેમો 500 મીટર વર્જિત વિસ્તાર, દેખાય તે માટે મોટો બતાવ્યો.",
    },
  });

  const ports: PortFeature[] = [
    {
      id: `${loc.id}-port`,
      kind: "port",
      at: { lat: loc.lat, lon: loc.lon },
      name: loc.name,
      detail: {
        en: loc.portType === "major" ? "Major port / harbour" : "Fishing harbour",
        hi: loc.portType === "major" ? "प्रमुख बंदरगाह" : "मत्स्य बंदरगाह",
        gu: loc.portType === "major" ? "મુખ્ય બંદર" : "મત્સ્ય બંદર",
      },
    },
    {
      id: `${loc.id}-anchorage`,
      kind: "port",
      at: offset({ lat: loc.lat, lon: loc.lon }, 9, sea),
      name: { en: "Outer anchorage", hi: "बाहरी लंगरगाह", gu: "બાહ્ય લંગરગાહ" },
      detail: {
        en: "Demo waiting anchorage outside the harbour entrance.",
        hi: "बंदरगाह प्रवेश के बाहर डेमो प्रतीक्षा लंगरगाह।",
        gu: "બંદર પ્રવેશ બહાર ડેમો પ્રતીક્ષા લંગરગાહ.",
      },
    },
  ];

  const set: GeoSet = { coast, boundary, lane, circles, ports, pfzMeta };
  cacheGeo.set(loc.id, set);
  return set;
}

export function circlesOfKind(set: GeoSet, kind: CircleFeature["kind"]): CircleFeature[] {
  return set.circles.filter((c) => c.kind === kind);
}

export function distanceToCircleKm(p: LatLon, c: CircleFeature): number {
  return haversineKm(p, c.center) - c.radiusKm;
}

export function bearingFrom(loc: MarineLocation, p: LatLon): number {
  return bearingDeg({ lat: loc.lat, lon: loc.lon }, p);
}
