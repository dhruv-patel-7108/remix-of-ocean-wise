import type { Lang } from "./locations";

export type { Lang };

export const LANGUAGES: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी" },
  { id: "gu", label: "ગુજરાતી" },
];

type Dict = Record<string, Record<Lang, string>>;

export const STRINGS: Dict = {
  appName: { en: "ORCA", hi: "ORCA", gu: "ORCA" },
  appTagline: {
    en: "Ocean Risk & Coastal Awareness",
    hi: "महासागर जोखिम एवं तटीय जागरूकता",
    gu: "મહાસાગર જોખમ અને તટીય જાગૃતિ",
  },
  systemStatus: { en: "System status", hi: "सिस्टम स्थिति", gu: "સિસ્ટમ સ્થિતિ" },
  operator: { en: "Operator", hi: "संचालक", gu: "સંચાલક" },
  operatorGuest: { en: "Guest operator", hi: "अतिथि संचालक", gu: "મહેમાન સંચાલક" },
  language: { en: "Language", hi: "भाषा", gu: "ભાષા" },
  location: { en: "Location", hi: "स्थान", gu: "સ્થાન" },
  coordinates: { en: "Coordinates", hi: "निर्देशांक", gu: "યામ" },
  lastUpdated: { en: "Last updated", hi: "अंतिम अद्यतन", gu: "છેલ્લે અપડેટ" },
  source: { en: "Source", hi: "स्रोत", gu: "સ્ત્રોત" },
  refresh: { en: "Refresh data", hi: "डेटा ताज़ा करें", gu: "ડેટા તાજું કરો" },
  live: { en: "LIVE", hi: "लाइव", gu: "લાઇવ" },
  demo: { en: "DEMO", hi: "डेमो", gu: "ડેમો" },
  unavailable: { en: "UNAVAILABLE", hi: "अनुपलब्ध", gu: "અનુપલબ્ધ" },
  cached: { en: "CACHED", hi: "संचित", gu: "સંગ્રહિત" },
  loading: { en: "Loading…", hi: "लोड हो रहा है…", gu: "લોડ થાય છે…" },

  // Sections
  secChat: { en: "ORCA Conversation", hi: "ORCA संवाद", gu: "ORCA સંવાદ" },
  secMap: { en: "Marine Map", hi: "समुद्री मानचित्र", gu: "દરિયાઈ નકશો" },
  secWeather: { en: "Weather Intelligence", hi: "मौसम जानकारी", gu: "હવામાન માહિતી" },
  secOcean: { en: "Ocean Conditions", hi: "महासागर स्थिति", gu: "મહાસાગર સ્થિતિ" },
  secPfz: {
    en: "Potential Fishing Zones",
    hi: "संभावित मत्स्य क्षेत्र",
    gu: "સંભવિત મત્સ્ય વિસ્તાર",
  },
  secRoute: { en: "Route Planning", hi: "मार्ग नियोजन", gu: "માર્ગ આયોજન" },
  secRisk: { en: "Risk & Safety", hi: "जोखिम एवं सुरक्षा", gu: "જોખમ અને સલામતી" },
  secAlerts: { en: "Marine Alerts", hi: "समुद्री चेतावनियाँ", gu: "દરિયાઈ ચેતવણીઓ" },
  secSystem: { en: "Data Pipeline Status", hi: "डेटा पाइपलाइन स्थिति", gu: "ડેટા પાઇપલાઇન સ્થિતિ" },
  secEvidence: { en: "Evidence & Sources", hi: "प्रमाण एवं स्रोत", gu: "પુરાવા અને સ્ત્રોત" },

  // Chat
  chatIntro: {
    en: "Ask about ocean conditions, fishing zones, warnings or routes. Mention a port name to query it directly.",
    hi: "महासागर स्थिति, मत्स्य क्षेत्र, चेतावनियों या मार्गों के बारे में पूछें। किसी बंदरगाह का नाम लिखकर सीधे पूछ सकते हैं।",
    gu: "મહાસાગર સ્થિતિ, મત્સ્ય વિસ્તાર, ચેતવણી કે માર્ગ વિશે પૂછો. કોઈ બંદરનું નામ લખીને સીધું પૂછી શકો છો.",
  },
  chatPlaceholder: {
    en: "Ask ORCA about conditions, zones, warnings or routes",
    hi: "ORCA से स्थिति, क्षेत्र, चेतावनी या मार्ग पूछें",
    gu: "ORCA ને સ્થિતિ, વિસ્તાર, ચેતવણી કે માર્ગ વિશે પૂછો",
  },
  send: { en: "Send", hi: "भेजें", gu: "મોકલો" },
  thinking: {
    en: "Retrieving data…",
    hi: "डेटा प्राप्त किया जा रहा है…",
    gu: "ડેટા મેળવાઈ રહ્યો છે…",
  },
  suggested: { en: "Suggested questions", hi: "सुझाए गए प्रश्न", gu: "સૂચવેલા પ્રશ્નો" },
  clearChat: { en: "Clear conversation", hi: "संवाद साफ़ करें", gu: "સંવાદ સાફ કરો" },
  emptyQuestion: {
    en: "Type a question first.",
    hi: "पहले कोई प्रश्न लिखें।",
    gu: "પહેલાં કોઈ પ્રશ્ન લખો.",
  },
  youLabel: { en: "You", hi: "आप", gu: "તમે" },
  originalText: { en: "Original text", hi: "मूल पाठ", gu: "મૂળ લખાણ" },
  unsupportedQuestion: {
    en: "ORCA could not map that question to a marine data query. Try asking about conditions, safety, fishing zones, warnings, routes or a comparison.",
    hi: "ORCA इस प्रश्न को समुद्री डेटा प्रश्न में नहीं बदल सका। स्थिति, सुरक्षा, मत्स्य क्षेत्र, चेतावनी, मार्ग या तुलना के बारे में पूछें।",
    gu: "ORCA આ પ્રશ્નને દરિયાઈ ડેટા પ્રશ્નમાં ફેરવી શક્યું નથી. સ્થિતિ, સલામતી, મત્સ્ય વિસ્તાર, ચેતવણી, માર્ગ કે સરખામણી વિશે પૂછો.",
  },

  // Weather fields
  wind: { en: "Wind", hi: "हवा", gu: "પવન" },
  windDirection: { en: "Wind direction", hi: "हवा की दिशा", gu: "પવનની દિશા" },
  gusts: { en: "Gusts", hi: "झोंके", gu: "ઝાપટાં" },
  visibility: { en: "Visibility", hi: "दृश्यता", gu: "દૃશ્યતા" },
  precipitation: { en: "Rain chance", hi: "वर्षा संभावना", gu: "વરસાદની શક્યતા" },
  temperature: { en: "Air temperature", hi: "वायु तापमान", gu: "હવાનું તાપમાન" },
  forecastTime: { en: "Forecast time", hi: "पूर्वानुमान समय", gu: "આગાહી સમય" },
  now: { en: "Now", hi: "अभी", gu: "હમણાં" },
  today: { en: "Today", hi: "आज", gu: "આજે" },
  tomorrow: { en: "Tomorrow", hi: "कल", gu: "આવતીકાલે" },
  morning: { en: "Morning", hi: "सुबह", gu: "સવાર" },
  afternoon: { en: "Afternoon", hi: "दोपहर", gu: "બપોર" },
  evening: { en: "Evening", hi: "शाम", gu: "સાંજ" },
  night: { en: "Night", hi: "रात", gu: "રાત" },

  // Ocean fields
  waveHeight: { en: "Wave height", hi: "लहर ऊँचाई", gu: "મોજાંની ઊંચાઈ" },
  waveDirection: { en: "Wave direction", hi: "लहर दिशा", gu: "મોજાંની દિશા" },
  wavePeriod: { en: "Wave period", hi: "लहर अवधि", gu: "મોજાંનો સમયગાળો" },
  swellHeight: { en: "Swell height", hi: "स्वेल ऊँचाई", gu: "સ્વેલ ઊંચાઈ" },
  swellPeriod: { en: "Swell period", hi: "स्वेल अवधि", gu: "સ્વેલ સમયગાળો" },
  sst: { en: "Sea surface temperature", hi: "समुद्र सतह तापमान", gu: "દરિયાઈ સપાટીનું તાપમાન" },
  current: { en: "Ocean current", hi: "समुद्री धारा", gu: "દરિયાઈ પ્રવાહ" },

  // PFZ
  zone: { en: "Zone", hi: "क्षेत्र", gu: "વિસ્તાર" },
  suitability: { en: "Suitability", hi: "उपयुक्तता", gu: "અનુકૂળતા" },
  confidence: { en: "Confidence", hi: "विश्वास", gu: "વિશ્વાસ" },
  distance: { en: "Distance", hi: "दूरी", gu: "અંતર" },
  depth: { en: "Depth", hi: "गहराई", gu: "ઊંડાઈ" },
  chlorophyll: { en: "Chlorophyll-a", hi: "क्लोरोफिल-a", gu: "ક્લોરોફિલ-a" },
  species: { en: "Typical species", hi: "सामान्य प्रजातियाँ", gu: "સામાન્ય પ્રજાતિઓ" },
  explanation: { en: "Why", hi: "कारण", gu: "કારણ" },
  bestZone: { en: "Best rated zone", hi: "सर्वोत्तम क्षेत्र", gu: "શ્રેષ્ઠ વિસ્તાર" },
  pfzNote: {
    en: "Zone geometry and chlorophyll/depth values are a demo geospatial dataset. Scores are computed from live wind and wave data where available.",
    hi: "क्षेत्र भूगोल तथा क्लोरोफिल/गहराई मान डेमो डेटासेट हैं। स्कोर उपलब्ध लाइव हवा एवं लहर डेटा से गणना किए जाते हैं।",
    gu: "વિસ્તારની ભૂગોળ તથા ક્લોરોફિલ/ઊંડાઈ મૂલ્યો ડેમો ડેટાસેટ છે. સ્કોર ઉપલબ્ધ લાઇવ પવન અને મોજાં ડેટામાંથી ગણાય છે.",
  },

  // Risk
  riskLow: { en: "Low risk", hi: "कम जोखिम", gu: "ઓછું જોખમ" },
  riskModerate: { en: "Moderate risk", hi: "मध्यम जोखिम", gu: "મધ્યમ જોખમ" },
  riskHigh: { en: "High risk", hi: "उच्च जोखिम", gu: "ઊંચું જોખમ" },
  riskSevere: { en: "Severe risk", hi: "गंभीर जोखिम", gu: "ગંભીર જોખમ" },
  reasons: { en: "Contributing factors", hi: "योगदान कारक", gu: "કારણભૂત પરિબળો" },
  riskDisclaimer: {
    en: "ORCA risk levels are computed from public forecast data. They are decision support only and are not an official safety clearance.",
    hi: "ORCA जोखिम स्तर सार्वजनिक पूर्वानुमान डेटा से गणना किए जाते हैं। ये केवल निर्णय सहायता हैं, कोई आधिकारिक सुरक्षा मंजूरी नहीं।",
    gu: "ORCA જોખમ સ્તર જાહેર આગાહી ડેટામાંથી ગણાય છે. તે માત્ર નિર્ણય સહાય છે, કોઈ સત્તાવાર સલામતી મંજૂરી નથી.",
  },

  // Route
  origin: { en: "Origin", hi: "प्रारंभ", gu: "શરૂઆત" },
  destination: { en: "Destination", hi: "गंतव्य", gu: "ગંતવ્ય" },
  avoidRestricted: {
    en: "Avoid restricted areas",
    hi: "प्रतिबंधित क्षेत्र टालें",
    gu: "પ્રતિબંધિત વિસ્તાર ટાળો",
  },
  avoidHazards: { en: "Avoid hazard areas", hi: "खतरा क्षेत्र टालें", gu: "જોખમ વિસ્તાર ટાળો" },
  vesselSpeed: { en: "Vessel speed", hi: "नौका गति", gu: "નૌકા ગતિ" },
  computeRoute: { en: "Compute routes", hi: "मार्ग निकालें", gu: "માર્ગ ગણો" },
  routeDirect: { en: "Direct track", hi: "सीधा मार्ग", gu: "સીધો માર્ગ" },
  routeSafe: { en: "Clearance track", hi: "सुरक्षित मार्ग", gu: "સુરક્ષિત માર્ગ" },
  eta: { en: "Estimated time", hi: "अनुमानित समय", gu: "અંદાજિત સમય" },
  waypoints: { en: "Waypoints", hi: "मार्गबिंदु", gu: "માર્ગબિંદુ" },
  routeWarnings: { en: "Route warnings", hi: "मार्ग चेतावनी", gu: "માર્ગ ચેતવણી" },
  routeClear: {
    en: "No restricted or hazard area intersected.",
    hi: "कोई प्रतिबंधित या खतरा क्षेत्र नहीं मिला।",
    gu: "કોઈ પ્રતિબંધિત કે જોખમ વિસ્તાર નડતો નથી.",
  },
  sameEndpoints: {
    en: "Origin and destination must differ.",
    hi: "प्रारंभ और गंतव्य अलग होने चाहिए।",
    gu: "શરૂઆત અને ગંતવ્ય અલગ હોવા જોઈએ.",
  },
  routeDisclaimer: {
    en: "Demo route engine: great-circle legs with clearance offsets around demo geometry. Not certified navigation — plot passage on approved charts.",
    hi: "डेमो मार्ग इंजन: डेमो भूगोल के चारों ओर क्लीयरेंस सहित ग्रेट-सर्कल खंड। यह प्रमाणित नेविगेशन नहीं है — स्वीकृत चार्ट पर मार्ग बनाएं।",
    gu: "ડેમો માર્ગ એન્જિન: ડેમો ભૂગોળની આસપાસ ક્લિયરન્સ સાથે ગ્રેટ-સર્કલ ખંડ. આ પ્રમાણિત નેવિગેશન નથી — માન્ય ચાર્ટ પર માર્ગ દોરો.",
  },

  // Alerts
  derivedAlerts: {
    en: "Derived from live forecast",
    hi: "लाइव पूर्वानुमान से निकाला गया",
    gu: "લાઇવ આગાહી પરથી તારવેલ",
  },
  officialAlerts: {
    en: "Official authority feeds",
    hi: "आधिकारिक प्राधिकरण फ़ीड",
    gu: "સત્તાવાર સંસ્થા ફીડ",
  },
  demoAlerts: { en: "Demo advisories", hi: "डेमो सलाह", gu: "ડેમો સલાહ" },
  officialUnavailable: {
    en: "ORCA is not connected to IMD, INCOIS or Coast Guard feeds and cannot verify official warnings. Check official bulletins and your local harbour authority before sailing.",
    hi: "ORCA IMD, INCOIS या तटरक्षक फ़ीड से जुड़ा नहीं है और आधिकारिक चेतावनियों की पुष्टि नहीं कर सकता। रवाना होने से पहले आधिकारिक बुलेटिन एवं स्थानीय बंदरगाह प्राधिकरण देखें।",
    gu: "ORCA IMD, INCOIS કે તટરક્ષક ફીડ સાથે જોડાયેલ નથી અને સત્તાવાર ચેતવણીની ખાતરી કરી શકતું નથી. નીકળતાં પહેલાં સત્તાવાર બુલેટિન અને સ્થાનિક બંદર સત્તાની સલાહ લો.",
  },
  noDerivedAlerts: {
    en: "No forecast threshold exceeded for this location and time.",
    hi: "इस स्थान और समय के लिए कोई पूर्वानुमान सीमा पार नहीं हुई।",
    gu: "આ સ્થાન અને સમય માટે કોઈ આગાહી મર્યાદા ઓળંગાઈ નથી.",
  },

  // Map
  legend: { en: "Legend", hi: "संकेत सूची", gu: "સંકેત યાદી" },
  mapPort: { en: "Port", hi: "बंदरगाह", gu: "બંદર" },
  mapPfz: { en: "Fishing zone", hi: "मत्स्य क्षेत्र", gu: "મત્સ્ય વિસ્તાર" },
  mapRestricted: { en: "Restricted area", hi: "प्रतिबंधित क्षेत्र", gu: "પ્રતિબંધિત વિસ્તાર" },
  mapProtected: { en: "Protected area", hi: "संरक्षित क्षेत्र", gu: "સંરક્ષિત વિસ્તાર" },
  mapHazard: { en: "Hazard", hi: "खतरा", gu: "જોખમ" },
  mapLane: { en: "Shipping lane", hi: "जहाजी मार्ग", gu: "જહાજી માર્ગ" },
  mapBoundary: {
    en: "12 nm territorial limit",
    hi: "12 नॉटिकल मील सीमा",
    gu: "12 નોટિકલ માઈલ સીમા",
  },
  mapRoute: { en: "Planned route", hi: "नियोजित मार्ग", gu: "આયોજિત માર્ગ" },
  mapCoast: { en: "Coastline", hi: "तटरेखा", gu: "તટરેખા" },
  routeEmpty: {
    en: "Choose an origin and destination, then compute routes.",
    hi: "आरंभ और गंतव्य चुनें, फिर मार्ग गणना करें।",
    gu: "શરૂઆત અને ગંતવ્ય પસંદ કરી માર્ગ ગણો.",
  },
  mapFeature: { en: "Feature details", hi: "विशेषता विवरण", gu: "વિશેષતા વિગત" },
  mapSelect: {
    en: "Select a map feature for details.",
    hi: "विवरण हेतु मानचित्र वस्तु चुनें।",
    gu: "વિગત માટે નકશાની વસ્તુ પસંદ કરો.",
  },
  mapGeometryNote: {
    en: "Zone, hazard and boundary geometry is a demo dataset built around each port. Not for navigation.",
    hi: "क्षेत्र, खतरा एवं सीमा भूगोल प्रत्येक बंदरगाह के आसपास बनाया गया डेमो डेटासेट है। नेविगेशन हेतु नहीं।",
    gu: "વિસ્તાર, જોખમ અને સીમાની ભૂગોળ દરેક બંદર આસપાસ બનાવેલ ડેમો ડેટાસેટ છે. નેવિગેશન માટે નહીં.",
  },

  // Evidence / status
  dataType: { en: "Data type", hi: "डेटा प्रकार", gu: "ડેટા પ્રકાર" },
  why: { en: "Effect on recommendation", hi: "अनुशंसा पर प्रभाव", gu: "ભલામણ પર અસર" },
  status: { en: "Status", hi: "स्थिति", gu: "સ્થિતિ" },
  apiError: { en: "Request failed", hi: "अनुरोध विफल", gu: "વિનંતી નિષ્ફળ" },
  fallbackNotice: {
    en: "Live request failed. Showing clearly labelled demo values until the service responds.",
    hi: "लाइव अनुरोध विफल। सेवा उपलब्ध होने तक स्पष्ट रूप से चिह्नित डेमो मान दिखाए जा रहे हैं।",
    gu: "લાઇવ વિનંતી નિષ્ફળ. સેવા મળે ત્યાં સુધી સ્પષ્ટ રીતે ચિહ્નિત ડેમો મૂલ્યો બતાવાય છે.",
  },

  // Legal
  privacy: { en: "Privacy", hi: "गोपनीयता", gu: "ગોપનીયતા" },
  terms: { en: "Terms & Usage", hi: "शर्तें एवं उपयोग", gu: "શરતો અને ઉપયોગ" },
  backToDashboard: { en: "Back to dashboard", hi: "डैशबोर्ड पर लौटें", gu: "ડેશબોર્ડ પર પાછા" },
  disclaimerShort: {
    en: "ORCA is decision support, not certified navigation or an official warning service. Always follow instructions from official maritime authorities.",
    hi: "ORCA निर्णय सहायता है, प्रमाणित नेविगेशन या आधिकारिक चेतावनी सेवा नहीं। हमेशा आधिकारिक समुद्री प्राधिकरणों के निर्देशों का पालन करें।",
    gu: "ORCA નિર્ણય સહાય છે, પ્રમાણિત નેવિગેશન કે સત્તાવાર ચેતવણી સેવા નથી. હંમેશા સત્તાવાર દરિયાઈ સંસ્થાઓની સૂચનાનું પાલન કરો.",
  },
};

export function t(lang: Lang, key: keyof typeof STRINGS | string): string {
  const entry = STRINGS[key as string];
  if (!entry) return key as string;
  return entry[lang] ?? entry.en;
}

/** Compass point abbreviations localised only where a script exists. */
/** Compass points stay as standard navigation abbreviations in every language. */
export function compass(deg: number | null | undefined, _lang: Lang): string {
  if (deg === null || deg === undefined || Number.isNaN(deg)) return "—";
  const points = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const idx = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
  return `${points[idx]} ${Math.round(deg)}°`;
}

const LOCALES: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", gu: "gu-IN" };

export function formatDateTime(iso: string | number | Date, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(LOCALES[lang], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function formatTime(iso: string | number | Date, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(LOCALES[lang], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function formatNumber(n: number | null | undefined, digits = 1, lang: Lang = "en"): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat(LOCALES[lang], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}
