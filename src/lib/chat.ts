import { compass, formatDateTime, t } from "./i18n";
import { findAllLocationsInText, type Lang, type MarineLocation } from "./locations";
import { planRoutes, formatDuration } from "./route";
import { RISK_LABEL_KEY } from "./risk";
import { loadSnapshot, type Snapshot } from "./snapshot";
import { SOURCES } from "./api";

export type Intent =
  | "conditions"
  | "safety"
  | "pfz"
  | "bestZone"
  | "warnings"
  | "route"
  | "compare"
  | "metric"
  | "unknown";

export type MetricKey = "wind" | "wave" | "sst" | "visibility" | "rain" | "current";

export interface DayTime {
  dayOffset: number;
  hour: number | null;
  /** Localisable description of the requested moment. */
  partKey: "now" | "morning" | "afternoon" | "evening" | "night" | "exact";
}

export interface ParsedQuery {
  intent: Intent;
  metric: MetricKey | null;
  locations: MarineLocation[];
  time: DayTime;
  explicitLocation: boolean;
  explicitTime: boolean;
}

export interface EvidenceRef {
  source: string;
  status: "live" | "demo" | "unavailable";
  when: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  /** Text rendered in the current UI language. */
  text: Record<Lang, string>;
  /** Exactly what the operator typed (kept for transparency). */
  original?: string;
  evidence?: EvidenceRef[];
  at: number;
}

const KW = {
  tomorrow: ["tomorrow", "कल", "आवतीकाल", "આવતીકાલે", "આવતી કાલે"],
  dayAfter: ["day after tomorrow", "परसों", "પરમ દિવસે"],
  today: ["today", "आज", "આજે", "now", "अभी", "હમણાં"],
  morning: ["morning", "सुबह", "सवेरे", "સવાર", "સવારે"],
  afternoon: ["afternoon", "noon", "दोपहर", "બપોર"],
  evening: ["evening", "शाम", "સાંજ"],
  night: ["night", "रात", "રાત"],
  safety: [
    "safe",
    "safety",
    "risk",
    "danger",
    "सुरक्षित",
    "सुरक्षा",
    "जोखिम",
    "ખતરો",
    "સલામત",
    "સલામતી",
    "જોખમ",
  ],
  pfz: [
    "fishing zone",
    "fishing",
    "pfz",
    "catch",
    "मछली",
    "मत्स्य",
    "मछली पकड़",
    "માછલી",
    "મત્સ્ય",
  ],
  best: [
    "best",
    "better",
    "which zone",
    "सबसे अच्छा",
    "बेहतर",
    "कौन सा क्षेत्र",
    "શ્રેષ્ઠ",
    "સારું",
    "કયો વિસ્તાર",
  ],
  warnings: ["warning", "alert", "advisory", "चेतावनी", "सलाह", "ચેતવણી", "સલાહ"],
  route: ["route", "passage", "navigate", "sail to", "मार्ग", "रास्ता", "માર્ગ", "રસ્તો"],
  compare: ["compare", "vs", "versus", "तुलना", "सरखाम", "સરખામણી"],
  conditions: [
    "condition",
    "ocean",
    "sea",
    "marine",
    "weather",
    "स्थिति",
    "समुद्र",
    "मौसम",
    "સ્થિતિ",
    "દરિયો",
    "હવામાન",
  ],
  wind: ["wind", "gust", "हवा", "झोंक", "પવન", "ઝાપટ"],
  wave: ["wave", "swell", "लहर", "स्वेल", "મોજા", "સ્વેલ"],
  sst: ["temperature", "sst", "sea surface", "तापमान", "તાપમાન"],
  visibility: ["visibility", "fog", "दृश्यता", "કોહરો", "દૃશ્યતા"],
  rain: ["rain", "precipitation", "वर्षा", "बारिश", "વરસાદ"],
  current: ["current", "धारा", "પ્રવાહ"],
  restricted: ["restricted", "avoid", "प्रतिबंधित", "बचते", "પ્રતિબંધિત", "ટાળ"],
  here: ["here", "यहाँ", "यहां", "અહીં"],
};

const has = (text: string, list: string[]) => list.some((k) => text.includes(k));

function parseTime(text: string): DayTime {
  let dayOffset = 0;
  if (has(text, KW.dayAfter)) dayOffset = 2;
  else if (has(text, KW.tomorrow)) dayOffset = 1;

  const explicit = text.match(/\b(\d{1,2})\s*(am|pm|:00|बजे|વાગ્યે)?\b/);
  if (explicit) {
    let h = parseInt(explicit[1] ?? "", 10);
    const suffix = explicit[2];
    if (suffix === "pm" && h < 12) h += 12;
    if (suffix === "am" && h === 12) h = 0;
    if (h >= 0 && h <= 23 && (suffix || /\d{1,2}:\d{2}/.test(text))) {
      return { dayOffset, hour: h, partKey: "exact" };
    }
  }
  if (has(text, KW.morning)) return { dayOffset, hour: 6, partKey: "morning" };
  if (has(text, KW.afternoon)) return { dayOffset, hour: 14, partKey: "afternoon" };
  if (has(text, KW.evening)) return { dayOffset, hour: 18, partKey: "evening" };
  if (has(text, KW.night)) return { dayOffset, hour: 22, partKey: "night" };
  return { dayOffset, hour: null, partKey: dayOffset > 0 ? "morning" : "now" };
}

export function parseQuery(raw: string): ParsedQuery {
  const text = raw.toLowerCase().trim();
  const locations = findAllLocationsInText(text);
  const time = parseTime(text);

  let intent: Intent = "unknown";
  let metric: MetricKey | null = null;

  if (has(text, KW.compare) || locations.length >= 2) intent = "compare";
  else if (has(text, KW.route)) intent = "route";
  else if (has(text, KW.warnings)) intent = "warnings";
  else if (has(text, KW.best) && has(text, KW.pfz)) intent = "bestZone";
  else if (has(text, KW.pfz)) intent = "pfz";
  else if (has(text, KW.safety)) intent = "safety";
  else if (has(text, KW.wind)) {
    intent = "metric";
    metric = "wind";
  } else if (has(text, KW.wave)) {
    intent = "metric";
    metric = "wave";
  } else if (has(text, KW.visibility)) {
    intent = "metric";
    metric = "visibility";
  } else if (has(text, KW.rain)) {
    intent = "metric";
    metric = "rain";
  } else if (has(text, KW.current)) {
    intent = "metric";
    metric = "current";
  } else if (has(text, KW.sst)) {
    intent = "metric";
    metric = "sst";
  } else if (has(text, KW.conditions)) intent = "conditions";
  else if (has(text, KW.best)) intent = "bestZone";

  const explicitTime = time.dayOffset > 0 || time.partKey !== "now" || has(text, KW.today);

  return {
    intent,
    metric,
    locations,
    time,
    explicitLocation: locations.length > 0 && !has(text, KW.here),
    explicitTime,
  };
}

export function resolveWhen(time: DayTime): Date {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  if (time.dayOffset) d.setDate(d.getDate() + time.dayOffset);
  if (time.hour !== null) d.setHours(time.hour);
  return d;
}

const METRIC_LABEL: Record<MetricKey, string> = {
  wind: "wind",
  wave: "waveHeight",
  sst: "sst",
  visibility: "visibility",
  rain: "precipitation",
  current: "current",
};

const INTENT_PHRASE: Record<Intent, Record<Lang, string>> = {
  conditions: {
    en: "Ocean and weather conditions",
    hi: "महासागर एवं मौसम की स्थिति",
    gu: "મહાસાગર અને હવામાનની સ્થિતિ",
  },
  safety: { en: "Safety assessment", hi: "सुरक्षा आकलन", gu: "સલામતી આકલન" },
  pfz: { en: "Potential fishing zones", hi: "संभावित मत्स्य क्षेत्र", gu: "સંભવિત મત્સ્ય વિસ્તાર" },
  bestZone: {
    en: "Best rated fishing zone",
    hi: "सर्वोत्तम मत्स्य क्षेत्र",
    gu: "શ્રેષ્ઠ મત્સ્ય વિસ્તાર",
  },
  warnings: { en: "Marine warnings", hi: "समुद्री चेतावनियाँ", gu: "દરિયાઈ ચેતવણીઓ" },
  route: { en: "Route planning", hi: "मार्ग नियोजन", gu: "માર્ગ આયોજન" },
  compare: { en: "Comparison", hi: "तुलना", gu: "સરખામણી" },
  metric: { en: "Forecast value", hi: "पूर्वानुमान मान", gu: "આગાહી મૂલ્ય" },
  unknown: { en: "Question", hi: "प्रश्न", gu: "પ્રશ્ન" },
};

function timePhrase(time: DayTime, lang: Lang): string {
  const day =
    time.dayOffset === 0
      ? t(lang, "today")
      : time.dayOffset === 1
        ? t(lang, "tomorrow")
        : lang === "hi"
          ? "परसों"
          : lang === "gu"
            ? "પરમ દિવસે"
            : "day after tomorrow";
  if (time.partKey === "now" && time.dayOffset === 0) return t(lang, "now");
  if (time.partKey === "exact" && time.hour !== null)
    return `${day} ${String(time.hour).padStart(2, "0")}:00`;
  const part =
    time.partKey === "now"
      ? t(lang, "morning")
      : t(lang, time.partKey === "exact" ? "morning" : time.partKey);
  return `${day} ${part}`;
}

/**
 * Canonical restatement of the operator's question in the active UI language,
 * so the transcript reads in one language regardless of input language.
 */
export function renderQuestion(
  parsed: ParsedQuery,
  locations: MarineLocation[],
  lang: Lang,
): string {
  const names = locations.map((l) => l.name[lang]);
  const where = names.length > 1 ? names.join(lang === "en" ? " vs " : " / ") : (names[0] ?? "");
  const when = timePhrase(parsed.time, lang);
  const subject =
    parsed.intent === "metric" && parsed.metric
      ? t(lang, METRIC_LABEL[parsed.metric])
      : INTENT_PHRASE[parsed.intent][lang];

  if (parsed.intent === "unknown") return `${subject} — ${where}`;
  if (lang === "hi") return `${where}: ${subject} (${when})`;
  if (lang === "gu") return `${where}: ${subject} (${when})`;
  return `${subject} near ${where} (${when})`;
}

function bullet(lines: string[]): string {
  return lines.map((l) => `• ${l}`).join("\n");
}

function statusTag(s: Snapshot, lang: Lang): string {
  const tag = s.overallStatus === "live" ? t(lang, "live") : t(lang, "demo");
  return `[${tag}] ${formatDateTime(s.validTime, lang)}`;
}

function conditionsBody(s: Snapshot, lang: Lang): string {
  const w = s.weather;
  const m = s.marine;
  const lines = [
    `${t(lang, "wind")}: ${w.windSpeed?.toFixed(0) ?? "—"} km/h ${compass(w.windDirection, lang)} · ${t(lang, "gusts")} ${w.windGusts?.toFixed(0) ?? "—"} km/h`,
    `${t(lang, "waveHeight")}: ${m.waveHeight?.toFixed(1) ?? "—"} m ${compass(m.waveDirection, lang)} · ${t(lang, "swellPeriod")} ${m.swellPeriod?.toFixed(0) ?? "—"} s`,
    `${t(lang, "sst")}: ${m.seaSurfaceTemperature?.toFixed(1) ?? "—"} °C · ${t(lang, "current")} ${m.currentVelocity?.toFixed(2) ?? "—"} m/s`,
    `${t(lang, "visibility")}: ${w.visibility !== null ? (w.visibility / 1000).toFixed(1) : "—"} km · ${t(lang, "precipitation")} ${w.precipitationProbability ?? "—"}%`,
  ];
  return bullet(lines);
}

function evidenceOf(s: Snapshot, extra: EvidenceRef[] = []): EvidenceRef[] {
  return [
    { source: SOURCES.weather, status: s.weatherStatus, when: s.weatherResult.fetchedAt },
    { source: SOURCES.marine, status: s.marineStatus, when: s.marineResult.fetchedAt },
    ...extra,
  ];
}

const LANGS: Lang[] = ["en", "hi", "gu"];

function each(fn: (lang: Lang) => string): Record<Lang, string> {
  return { en: fn("en"), hi: fn("hi"), gu: fn("gu") } as Record<Lang, string>;
}
void LANGS;

export interface AnswerResult {
  text: Record<Lang, string>;
  evidence: EvidenceRef[];
}

export async function answerQuery(
  parsed: ParsedQuery,
  locations: MarineLocation[],
  when: Date,
): Promise<AnswerResult> {
  const primary = locations[0] as MarineLocation;

  if (parsed.intent === "unknown") {
    const s = await loadSnapshot(primary, when);
    return {
      text: each(
        (lang) =>
          `${t(lang, "unsupportedQuestion")}\n\n${primary.name[lang]} — ${statusTag(s, lang)}\n${conditionsBody(s, lang)}`,
      ),
      evidence: evidenceOf(s),
    };
  }

  if (parsed.intent === "compare" && locations.length >= 2) {
    const [a, b] = await Promise.all([
      loadSnapshot(locations[0] as MarineLocation, when),
      loadSnapshot(locations[1] as MarineLocation, when),
    ]);
    const better = a.risk.score <= b.risk.score ? a : b;
    return {
      text: each((lang) => {
        const line = (s: Snapshot) =>
          `${s.location.name[lang]} — ${statusTag(s, lang)}\n${conditionsBody(s, lang)}\n${t(lang, RISK_LABEL_KEY[s.risk.level])} (${s.risk.score}/100)`;
        const verdict =
          lang === "hi"
            ? `कम जोखिम स्कोर के आधार पर ${better.location.name.hi} की स्थिति बेहतर है।`
            : lang === "gu"
              ? `ઓછા જોખમ સ્કોરના આધારે ${better.location.name.gu} ની સ્થિતિ સારી છે.`
              : `On the computed risk score, ${better.location.name.en} has the more workable conditions.`;
        return `${line(a)}\n\n${line(b)}\n\n${verdict}`;
      }),
      evidence: [...evidenceOf(a), ...evidenceOf(b)],
    };
  }

  if (parsed.intent === "route") {
    const origin = locations[0] as MarineLocation;
    const destination = (locations[1] ?? locations[0]) as MarineLocation;
    if (origin.id === destination.id) {
      return {
        text: each((lang) =>
          lang === "hi"
            ? `मार्ग निकालने हेतु दो स्थान बताइए, जैसे "वेरावल से पोरबंदर मार्ग"। ${t(lang, "routeDisclaimer")}`
            : lang === "gu"
              ? `માર્ગ ગણવા માટે બે સ્થળ જણાવો, જેમ કે "વેરાવળથી પોરબંદર માર્ગ". ${t(lang, "routeDisclaimer")}`
              : `Name two ports for a passage, for example "route from Veraval to Porbandar". ${t(lang, "routeDisclaimer")}`,
        ),
        evidence: [{ source: SOURCES.geo, status: "demo", when: Date.now() }],
      };
    }
    const routes = planRoutes(origin, destination, {
      avoidRestricted: true,
      avoidHazards: true,
      speedKn: 9,
    });
    const s = await loadSnapshot(origin, when);
    return {
      text: each((lang) => {
        const body = routes
          .map(
            (r) =>
              `${t(lang, r.labelKey)}: ${r.distanceKm.toFixed(0)} km · ${formatDuration(r.hours, lang)}\n  ${
                r.warnings.length
                  ? r.warnings.map((x) => x.text[lang]).join(" ")
                  : t(lang, "routeClear")
              }`,
          )
          .join("\n");
        return `${origin.name[lang]} → ${destination.name[lang]}\n${body}\n\n${t(lang, "routeDisclaimer")}`;
      }),
      evidence: [
        { source: SOURCES.geo, status: "demo", when: Date.now() },
        { source: SOURCES.model, status: "demo", when: Date.now() },
        ...evidenceOf(s),
      ],
    };
  }

  const s = await loadSnapshot(primary, when);

  if (parsed.intent === "conditions") {
    return {
      text: each(
        (lang) =>
          `${primary.name[lang]} — ${statusTag(s, lang)}\n${conditionsBody(s, lang)}\n\n${t(lang, RISK_LABEL_KEY[s.risk.level])} · ${t(lang, "riskDisclaimer")}`,
      ),
      evidence: evidenceOf(s),
    };
  }

  if (parsed.intent === "safety") {
    return {
      text: each((lang) => {
        const factors = s.risk.factors.map((x) =>
          x.value ? `${x.label[lang]} — ${x.value}` : x.label[lang],
        );
        const verdict =
          s.risk.level === "low"
            ? lang === "hi"
              ? "गणना की गई स्थिति छोटी नौकाओं के सामान्य संचालन की सीमा में है।"
              : lang === "gu"
                ? "ગણેલી સ્થિતિ નાની નૌકાઓના સામાન્ય સંચાલનની મર્યાદામાં છે."
                : "Computed conditions sit inside the normal operating range for small craft."
            : lang === "hi"
              ? "प्रस्थान से पहले स्थानीय बंदरगाह प्राधिकरण एवं आधिकारिक बुलेटिन की पुष्टि करें।"
              : lang === "gu"
                ? "નીકળતાં પહેલાં સ્થાનિક બંદર સત્તા અને સત્તાવાર બુલેટિનની ખાતરી કરો."
                : "Confirm with the local harbour authority and official bulletins before departure.";
        return `${primary.name[lang]} — ${statusTag(s, lang)}\n${t(lang, RISK_LABEL_KEY[s.risk.level])} (${s.risk.score}/100)\n${bullet(factors)}\n\n${verdict}\n${t(lang, "riskDisclaimer")}`;
      }),
      evidence: evidenceOf(s, [{ source: SOURCES.model, status: "demo", when: Date.now() }]),
    };
  }

  if (parsed.intent === "pfz" || parsed.intent === "bestZone") {
    const zones = parsed.intent === "bestZone" ? s.pfz.slice(0, 1) : s.pfz.slice(0, 3);
    return {
      text: each((lang) => {
        const body = zones
          .map(
            (z) =>
              `${z.name[lang]} — ${t(lang, "suitability")} ${z.score}/100 · ${t(lang, "confidence")} ${z.confidence}%\n  ${t(lang, "distance")} ${z.distanceKm.toFixed(0)} km · ${z.center.lat.toFixed(3)}, ${z.center.lon.toFixed(3)} · ${t(lang, "depth")} ${z.depthM} m\n  ${t(lang, "sst")} ${z.sst?.toFixed(1) ?? "—"} °C · ${t(lang, "chlorophyll")} ${z.chlorophyll} mg/m³\n  ${t(lang, "species")}: ${z.species[lang]}\n  ${z.reasons[lang]}`,
          )
          .join("\n\n");
        return `${primary.name[lang]} — ${statusTag(s, lang)}\n${body}\n\n${t(lang, "pfzNote")}`;
      }),
      evidence: evidenceOf(s, [{ source: SOURCES.geo, status: "demo", when: Date.now() }]),
    };
  }

  if (parsed.intent === "warnings") {
    return {
      text: each((lang) => {
        const derived = s.alerts.derived.length
          ? s.alerts.derived.map((a) => `${a.title[lang]} — ${a.body[lang]}`).join("\n")
          : t(lang, "noDerivedAlerts");
        const demo = s.alerts.demo.map((a) => `${a.title[lang]} — ${a.body[lang]}`).join("\n");
        return `${primary.name[lang]} — ${statusTag(s, lang)}\n\n${t(lang, "derivedAlerts")}:\n${derived}\n\n${t(lang, "officialAlerts")}: ${t(lang, "unavailable")}\n${t(lang, "officialUnavailable")}\n\n${t(lang, "demoAlerts")}:\n${demo}`;
      }),
      evidence: evidenceOf(s, [{ source: SOURCES.geo, status: "demo", when: Date.now() }]),
    };
  }

  // metric
  const metric = parsed.metric ?? "wind";
  return {
    text: each((lang) => {
      const w = s.weather;
      const m = s.marine;
      const value =
        metric === "wind"
          ? `${w.windSpeed?.toFixed(0) ?? "—"} km/h ${compass(w.windDirection, lang)} · ${t(lang, "gusts")} ${w.windGusts?.toFixed(0) ?? "—"} km/h`
          : metric === "wave"
            ? `${m.waveHeight?.toFixed(1) ?? "—"} m ${compass(m.waveDirection, lang)} · ${t(lang, "swellPeriod")} ${m.swellPeriod?.toFixed(0) ?? "—"} s`
            : metric === "sst"
              ? `${m.seaSurfaceTemperature?.toFixed(1) ?? "—"} °C`
              : metric === "visibility"
                ? `${w.visibility !== null ? (w.visibility / 1000).toFixed(1) : "—"} km`
                : metric === "rain"
                  ? `${w.precipitationProbability ?? "—"}%`
                  : `${m.currentVelocity?.toFixed(2) ?? "—"} m/s ${compass(m.currentDirection, lang)}`;
      return `${primary.name[lang]} — ${statusTag(s, lang)}\n${t(lang, METRIC_LABEL[metric])}: ${value}`;
    }),
    evidence: evidenceOf(s),
  };
}
