import { SOURCES, type DataStatus } from "../lib/api";
import { formatDateTime, t } from "../lib/i18n";
import type { Lang } from "../lib/locations";
import { useApp } from "../state/app-state";
import { EmptyState, Section, StatusBadge } from "./ui/primitives";

interface Row {
  source: string;
  type: Record<Lang, string>;
  status: DataStatus;
  at: number | string;
  why: Record<Lang, string>;
}

export function EvidencePanel() {
  const { lang, snapshot } = useApp();

  if (!snapshot) {
    return (
      <Section id="evidence" index={10} title={t(lang, "secEvidence")}>
        <EmptyState text={t(lang, "loading")} />
      </Section>
    );
  }

  const rows: Row[] = [
    {
      source: SOURCES.weather,
      type: {
        en: "Hourly atmospheric forecast",
        hi: "घंटेवार वायुमंडलीय पूर्वानुमान",
        gu: "કલાકવાર વાયુમંડળ આગાહી",
      },
      status: snapshot.weatherStatus,
      at: snapshot.weatherResult.fetchedAt,
      why: {
        en: "Wind, gusts, visibility and rain probability drive the risk score and alert thresholds.",
        hi: "हवा, झोंके, दृश्यता एवं वर्षा संभावना जोखिम स्कोर तथा चेतावनी सीमाएँ तय करते हैं।",
        gu: "પવન, ઝાપટાં, દૃશ્યતા અને વરસાદની શક્યતા જોખમ સ્કોર અને ચેતવણી મર્યાદા નક્કી કરે છે.",
      },
    },
    {
      source: SOURCES.marine,
      type: {
        en: "Hourly wave and sea-state forecast",
        hi: "घंटेवार लहर एवं समुद्र स्थिति पूर्वानुमान",
        gu: "કલાકવાર મોજાં અને દરિયાઈ સ્થિતિ આગાહી",
      },
      status: snapshot.marineStatus,
      at: snapshot.marineResult.fetchedAt,
      why: {
        en: "Wave height, swell period and sea surface temperature weight both risk and fishing-zone suitability.",
        hi: "लहर ऊँचाई, स्वेल अवधि एवं सतह तापमान जोखिम तथा मत्स्य क्षेत्र उपयुक्तता दोनों को प्रभावित करते हैं।",
        gu: "મોજાં ઊંચાઈ, સ્વેલ સમયગાળો અને સપાટી તાપમાન જોખમ તથા મત્સ્ય વિસ્તાર અનુકૂળતા બંનેને અસર કરે છે.",
      },
    },
    {
      source: SOURCES.geo,
      type: {
        en: "Zones, restrictions, hazards, ports, lanes",
        hi: "क्षेत्र, प्रतिबंध, खतरे, बंदरगाह, गलियारे",
        gu: "વિસ્તાર, પ્રતિબંધ, જોખમ, બંદર, કોરિડોર",
      },
      status: "demo",
      at: Date.now(),
      why: {
        en: "Geometry is generated around each port for demonstration; it positions zones and triggers route clearance offsets.",
        hi: "भूगोल प्रत्येक बंदरगाह के आसपास प्रदर्शन हेतु बनाया गया है; यह क्षेत्रों की स्थिति तय करता है और मार्ग क्लीयरेंस लागू करता है।",
        gu: "ભૂગોળ દરેક બંદર આસપાસ નિદર્શન માટે બનાવી છે; તે વિસ્તારની સ્થિતિ નક્કી કરે છે અને માર્ગ ક્લિયરન્સ લાગુ કરે છે.",
      },
    },
    {
      source: SOURCES.model,
      type: {
        en: "Risk, suitability and route calculations",
        hi: "जोखिम, उपयुक्तता एवं मार्ग गणना",
        gu: "જોખમ, અનુકૂળતા અને માર્ગ ગણતરી",
      },
      status: "demo",
      at: Date.now(),
      why: {
        en: "Deterministic thresholds documented in Terms & Usage; no external model or third-party inference is used.",
        hi: "शर्तें एवं उपयोग में प्रलेखित निश्चित सीमाएँ; कोई बाहरी मॉडल प्रयुक्त नहीं।",
        gu: "શરતો અને ઉપયોગમાં નોંધેલી નિશ્ચિત મર્યાદા; કોઈ બાહ્ય મોડેલ વપરાયું નથી.",
      },
    },
    {
      source: "IMD / INCOIS / Indian Coast Guard",
      type: { en: "Official warnings", hi: "आधिकारिक चेतावनियाँ", gu: "સત્તાવાર ચેતવણીઓ" },
      status: "unavailable",
      at: Date.now(),
      why: {
        en: "Not connected. ORCA makes no claim about official warnings and cannot substitute for them.",
        hi: "जुड़ा नहीं है। ORCA आधिकारिक चेतावनियों का दावा नहीं करता और न ही उनका विकल्प है।",
        gu: "જોડાયેલ નથી. ORCA સત્તાવાર ચેતવણીનો દાવો કરતું નથી કે તેનો વિકલ્પ નથી.",
      },
    },
  ];

  return (
    <Section id="evidence" index={10} title={t(lang, "secEvidence")}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="label-xs py-2 pr-3">
                {t(lang, "source")}
              </th>
              <th scope="col" className="label-xs py-2 pr-3">
                {t(lang, "dataType")}
              </th>
              <th scope="col" className="label-xs py-2 pr-3">
                {t(lang, "status")}
              </th>
              <th scope="col" className="label-xs py-2 pr-3">
                {t(lang, "lastUpdated")}
              </th>
              <th scope="col" className="label-xs py-2">
                {t(lang, "why")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.source} className="border-b border-border align-top">
                <td className="py-2 pr-3 font-medium">{r.source}</td>
                <td className="py-2 pr-3 text-muted-foreground">{r.type[lang]}</td>
                <td className="py-2 pr-3">
                  <StatusBadge status={r.status} lang={lang} />
                </td>
                <td className="num py-2 pr-3 text-xs text-muted-foreground">
                  {formatDateTime(r.at, lang)}
                </td>
                <td className="py-2 text-xs leading-relaxed text-muted-foreground">
                  {r.why[lang]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
