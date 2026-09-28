import type { MarineFields, WeatherFields } from "./api";
import type { Lang } from "./locations";

export type RiskLevel = "low" | "moderate" | "high" | "severe";

export interface RiskFactor {
  key: string;
  label: Record<Lang, string>;
  value: string;
  weight: number;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number;
  factors: RiskFactor[];
}

export const RISK_LABEL_KEY: Record<RiskLevel, string> = {
  low: "riskLow",
  moderate: "riskModerate",
  high: "riskHigh",
  severe: "riskSevere",
};

/** Non-colour indicator so risk is never conveyed by colour alone. */
export const RISK_GLYPH: Record<RiskLevel, string> = {
  low: "I",
  moderate: "II",
  high: "III",
  severe: "IV",
};

function f(
  key: string,
  en: string,
  hi: string,
  gu: string,
  value: string,
  weight: number,
): RiskFactor {
  return { key, label: { en, hi, gu }, value, weight };
}

export function assessRisk(
  w: WeatherFields,
  m: MarineFields,
  extras: { nearRestrictedKm?: number | null; nearHazardKm?: number | null } = {},
): RiskAssessment {
  const factors: RiskFactor[] = [];
  let score = 0;

  const wind = w.windSpeed ?? 0;
  if (wind >= 50) {
    score += 45;
    factors.push(
      f("wind", "Gale force wind", "आंधी जैसी हवा", "તોફાની પવન", `${wind.toFixed(0)} km/h`, 45),
    );
  } else if (wind >= 35) {
    score += 28;
    factors.push(f("wind", "Strong wind", "तेज़ हवा", "તેજ પવન", `${wind.toFixed(0)} km/h`, 28));
  } else if (wind >= 22) {
    score += 14;
    factors.push(f("wind", "Fresh breeze", "ताज़ा हवा", "તાજો પવન", `${wind.toFixed(0)} km/h`, 14));
  }

  const gust = w.windGusts ?? 0;
  if (gust >= 60) {
    score += 22;
    factors.push(
      f("gust", "Severe gusts", "तीव्र झोंके", "તીવ્ર ઝાપટાં", `${gust.toFixed(0)} km/h`, 22),
    );
  } else if (gust >= 45) {
    score += 12;
    factors.push(
      f(
        "gust",
        "Notable gusts",
        "उल्लेखनीय झोंके",
        "નોંધપાત્ર ઝાપટાં",
        `${gust.toFixed(0)} km/h`,
        12,
      ),
    );
  }

  const wave = m.waveHeight ?? 0;
  if (wave >= 3.5) {
    score += 40;
    factors.push(
      f(
        "wave",
        "Very rough sea",
        "अत्यंत उग्र समुद्र",
        "અત્યંત ઉગ્ર દરિયો",
        `${wave.toFixed(1)} m`,
        40,
      ),
    );
  } else if (wave >= 2.5) {
    score += 25;
    factors.push(f("wave", "Rough sea", "उग्र समुद्र", "ઉગ્ર દરિયો", `${wave.toFixed(1)} m`, 25));
  } else if (wave >= 1.5) {
    score += 12;
    factors.push(
      f("wave", "Moderate sea", "मध्यम समुद्र", "મધ્યમ દરિયો", `${wave.toFixed(1)} m`, 12),
    );
  }

  const sp = m.swellPeriod ?? 0;
  if (sp >= 12 && wave >= 1.5) {
    score += 8;
    factors.push(
      f(
        "swell",
        "Long-period swell",
        "लंबी अवधि स्वेल",
        "લાંબા સમયગાળાનું સ્વેલ",
        `${sp.toFixed(0)} s`,
        8,
      ),
    );
  }

  const vis = w.visibility;
  if (vis !== null && vis < 2000) {
    score += 25;
    factors.push(
      f(
        "vis",
        "Very poor visibility",
        "अत्यंत कम दृश्यता",
        "અત્યંત ઓછી દૃશ્યતા",
        `${(vis / 1000).toFixed(1)} km`,
        25,
      ),
    );
  } else if (vis !== null && vis < 5000) {
    score += 12;
    factors.push(
      f(
        "vis",
        "Reduced visibility",
        "घटी दृश्यता",
        "ઘટેલી દૃશ્યતા",
        `${(vis / 1000).toFixed(1)} km`,
        12,
      ),
    );
  }

  const pp = w.precipitationProbability ?? 0;
  if (pp >= 70) {
    score += 10;
    factors.push(
      f("rain", "High rain probability", "अधिक वर्षा संभावना", "વધુ વરસાદની શક્યતા", `${pp}%`, 10),
    );
  }

  const cur = m.currentVelocity ?? 0;
  if (cur >= 1.0) {
    score += 8;
    factors.push(
      f(
        "current",
        "Strong surface current",
        "तेज़ सतही धारा",
        "તેજ સપાટી પ્રવાહ",
        `${cur.toFixed(2)} m/s`,
        8,
      ),
    );
  }

  if (
    extras.nearRestrictedKm !== null &&
    extras.nearRestrictedKm !== undefined &&
    extras.nearRestrictedKm < 5
  ) {
    score += 12;
    factors.push(
      f(
        "restricted",
        "Close to restricted area",
        "प्रतिबंधित क्षेत्र के निकट",
        "પ્રતિબંધિત વિસ્તારની નજીક",
        `${Math.max(0, extras.nearRestrictedKm).toFixed(1)} km`,
        12,
      ),
    );
  }
  if (
    extras.nearHazardKm !== null &&
    extras.nearHazardKm !== undefined &&
    extras.nearHazardKm < 5
  ) {
    score += 10;
    factors.push(
      f(
        "hazard",
        "Close to charted hazard",
        "चिह्नित खतरे के निकट",
        "નોંધાયેલ જોખમની નજીક",
        `${Math.max(0, extras.nearHazardKm).toFixed(1)} km`,
        10,
      ),
    );
  }

  if (!factors.length) {
    factors.push(
      f(
        "calm",
        "All monitored thresholds within calm range",
        "सभी निगरानी सीमाएँ शांत श्रेणी में",
        "બધી નિરીક્ષિત મર્યાદા શાંત શ્રેણીમાં",
        "",
        0,
      ),
    );
  }

  const level: RiskLevel =
    score >= 70 ? "severe" : score >= 45 ? "high" : score >= 20 ? "moderate" : "low";
  return { level, score: Math.min(100, score), factors };
}
