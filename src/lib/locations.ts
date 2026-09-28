export type Lang = "en" | "hi" | "gu";

export type Coast = "west" | "east";

export interface MarineLocation {
  id: string;
  /** Display name per language. Latin name kept as the canonical identifier. */
  name: Record<Lang, string>;
  region: Record<Lang, string>;
  lat: number;
  lon: number;
  coast: Coast;
  /** Words (any language / transliteration) that identify this place in a question. */
  aliases: string[];
  portType: "major" | "fishing";
}

export const LOCATIONS: MarineLocation[] = [
  {
    id: "veraval",
    name: { en: "Veraval", hi: "वेरावल", gu: "વેરાવળ" },
    region: { en: "Gujarat", hi: "गुजरात", gu: "ગુજરાત" },
    lat: 20.905,
    lon: 70.367,
    coast: "west",
    aliases: ["veraval", "वेरावल", "વેરાવળ", "somnath"],
    portType: "fishing",
  },
  {
    id: "porbandar",
    name: { en: "Porbandar", hi: "पोरबंदर", gu: "પોરબંદર" },
    region: { en: "Gujarat", hi: "गुजरात", gu: "ગુજરાત" },
    lat: 21.641,
    lon: 69.609,
    coast: "west",
    aliases: ["porbandar", "पोरबंदर", "પોરબંદર"],
    portType: "major",
  },
  {
    id: "mumbai",
    name: { en: "Mumbai", hi: "मुंबई", gu: "મુંબઈ" },
    region: { en: "Maharashtra", hi: "महाराष्ट्र", gu: "મહારાષ્ટ્ર" },
    lat: 18.94,
    lon: 72.835,
    coast: "west",
    aliases: ["mumbai", "bombay", "मुंबई", "મુંબઈ"],
    portType: "major",
  },
  {
    id: "diu",
    name: { en: "Diu", hi: "दीव", gu: "દીવ" },
    region: { en: "Daman & Diu", hi: "दमन और दीव", gu: "દમણ અને દીવ" },
    lat: 20.714,
    lon: 70.983,
    coast: "west",
    aliases: ["diu", "दीव", "દીવ"],
    portType: "fishing",
  },
  {
    id: "kochi",
    name: { en: "Kochi", hi: "कोच्चि", gu: "કોચી" },
    region: { en: "Kerala", hi: "केरल", gu: "કેરળ" },
    lat: 9.966,
    lon: 76.24,
    coast: "west",
    aliases: ["kochi", "cochin", "कोच्चि", "કોચી"],
    portType: "major",
  },
  {
    id: "chennai",
    name: { en: "Chennai", hi: "चेन्नई", gu: "ચેન્નઈ" },
    region: { en: "Tamil Nadu", hi: "तमिलनाडु", gu: "તમિલનાડુ" },
    lat: 13.087,
    lon: 80.292,
    coast: "east",
    aliases: ["chennai", "madras", "चेन्नई", "ચેન્નઈ"],
    portType: "major",
  },
  {
    id: "visakhapatnam",
    name: { en: "Visakhapatnam", hi: "विशाखापत्तनम", gu: "વિશાખાપટ્ટનમ" },
    region: { en: "Andhra Pradesh", hi: "आंध्र प्रदेश", gu: "આંધ્ર પ્રદેશ" },
    lat: 17.686,
    lon: 83.318,
    coast: "east",
    aliases: ["visakhapatnam", "vizag", "विशाखापत्तनम", "વિશાખાપટ્ટનમ"],
    portType: "major",
  },
  {
    id: "sundarbans",
    name: {
      en: "Sundarbans (Kolkata coast)",
      hi: "सुंदरबन (कोलकाता तट)",
      gu: "સુંદરબન (કોલકાતા તટ)",
    },
    region: { en: "West Bengal", hi: "पश्चिम बंगाल", gu: "પશ્ચિમ બંગાળ" },
    lat: 21.65,
    lon: 88.5,
    coast: "east",
    aliases: [
      "sundarban",
      "sundarbans",
      "kolkata",
      "calcutta",
      "सुंदरबन",
      "कोलकाता",
      "સુંદરબન",
      "કોલકાતા",
    ],
    portType: "fishing",
  },
];

export const DEFAULT_LOCATION_ID = "veraval";

export function getLocation(id: string): MarineLocation {
  return LOCATIONS.find((l) => l.id === id) ?? (LOCATIONS[0] as MarineLocation);
}

/** Find a supported location mentioned anywhere in free text. */
export function findLocationInText(text: string): MarineLocation | null {
  const lower = text.toLowerCase();
  for (const loc of LOCATIONS) {
    for (const alias of loc.aliases) {
      if (lower.includes(alias.toLowerCase())) return loc;
    }
  }
  return null;
}

/** All supported locations mentioned, in order of appearance (used for comparisons). */
export function findAllLocationsInText(text: string): MarineLocation[] {
  const lower = text.toLowerCase();
  const hits: { loc: MarineLocation; at: number }[] = [];
  for (const loc of LOCATIONS) {
    let best = -1;
    for (const alias of loc.aliases) {
      const i = lower.indexOf(alias.toLowerCase());
      if (i >= 0 && (best < 0 || i < best)) best = i;
    }
    if (best >= 0) hits.push({ loc, at: best });
  }
  return hits.sort((a, b) => a.at - b.at).map((h) => h.loc);
}

const R = 6371;
export function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function bearingDeg(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(la2);
  const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
