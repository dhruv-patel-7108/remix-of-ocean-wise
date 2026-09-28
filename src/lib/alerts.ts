import type { MarineFields, WeatherFields } from "./api";
import type { Lang, MarineLocation } from "./locations";

export interface Alert {
  id: string;
  origin: "derived" | "demo";
  severity: "info" | "warn" | "danger";
  title: Record<Lang, string>;
  body: Record<Lang, string>;
}

/** Alerts computed directly from the forecast values currently on screen. */
export function derivedAlerts(w: WeatherFields, m: MarineFields): Alert[] {
  const out: Alert[] = [];
  const wind = w.windSpeed ?? 0;
  const gust = w.windGusts ?? 0;
  const wave = m.waveHeight ?? 0;
  const vis = w.visibility;
  const pp = w.precipitationProbability ?? 0;

  if (wind >= 35 || gust >= 50) {
    out.push({
      id: "wind",
      origin: "derived",
      severity: wind >= 50 ? "danger" : "warn",
      title: {
        en: "Strong wind threshold exceeded",
        hi: "तेज़ हवा सीमा पार",
        gu: "તેજ પવન મર્યાદા ઓળંગી",
      },
      body: {
        en: `Forecast wind ${wind.toFixed(0)} km/h with gusts to ${gust.toFixed(0)} km/h. Small craft should reconsider departure.`,
        hi: `पूर्वानुमान हवा ${wind.toFixed(0)} km/h, झोंके ${gust.toFixed(0)} km/h तक। छोटी नौकाएँ प्रस्थान पर पुनर्विचार करें।`,
        gu: `આગાહી પવન ${wind.toFixed(0)} km/h, ઝાપટાં ${gust.toFixed(0)} km/h સુધી. નાની નૌકાઓએ પ્રસ્થાન પર ફેરવિચાર કરવો.`,
      },
    });
  }
  if (wave >= 2.5) {
    out.push({
      id: "wave",
      origin: "derived",
      severity: wave >= 3.5 ? "danger" : "warn",
      title: { en: "Rough sea state", hi: "उग्र समुद्री स्थिति", gu: "ઉગ્ર દરિયાઈ સ્થિતિ" },
      body: {
        en: `Significant wave height ${wave.toFixed(1)} m at the selected hour.`,
        hi: `चयनित समय पर उल्लेखनीय लहर ऊँचाई ${wave.toFixed(1)} मीटर।`,
        gu: `પસંદ કરેલ સમયે નોંધપાત્ર મોજાં ઊંચાઈ ${wave.toFixed(1)} મીટર.`,
      },
    });
  }
  if (vis !== null && vis < 5000) {
    out.push({
      id: "vis",
      origin: "derived",
      severity: vis < 2000 ? "danger" : "warn",
      title: { en: "Reduced visibility", hi: "घटी हुई दृश्यता", gu: "ઘટેલી દૃશ્યતા" },
      body: {
        en: `Visibility ${(vis / 1000).toFixed(1)} km. Radar and sound signals recommended.`,
        hi: `दृश्यता ${(vis / 1000).toFixed(1)} किमी। रडार एवं ध्वनि संकेत उपयोग करें।`,
        gu: `દૃશ્યતા ${(vis / 1000).toFixed(1)} કિમી. રડાર અને ધ્વનિ સંકેત વાપરો.`,
      },
    });
  }
  if (pp >= 70) {
    out.push({
      id: "rain",
      origin: "derived",
      severity: "info",
      title: { en: "High rain probability", hi: "अधिक वर्षा संभावना", gu: "વધુ વરસાદની શક્યતા" },
      body: {
        en: `${pp}% chance of precipitation at the selected hour; squalls can reduce visibility quickly.`,
        hi: `चयनित समय पर ${pp}% वर्षा संभावना; झोंकेदार वर्षा दृश्यता तेज़ी से घटा सकती है।`,
        gu: `પસંદ કરેલ સમયે ${pp}% વરસાદની શક્યતા; ઝાપટાં દૃશ્યતા ઝડપથી ઘટાડી શકે.`,
      },
    });
  }
  return out;
}

/** Static, clearly-labelled demo advisories anchored to each coast. */
export function demoAdvisories(loc: MarineLocation): Alert[] {
  const west = loc.coast === "west";
  return [
    {
      id: "demo-fishing-ban",
      origin: "demo",
      severity: "info",
      title: {
        en: "Seasonal fishing ban reminder (demo)",
        hi: "मौसमी मत्स्य प्रतिबंध अनुस्मारक (डेमो)",
        gu: "મોસમી મત્સ્ય પ્રતિબંધ યાદ (ડેમો)",
      },
      body: {
        en: `Demo record: monsoon fishing ban typically applies on the ${west ? "west" : "east"} coast between June and July. Confirm exact dates with your state fisheries department.`,
        hi: `डेमो रिकॉर्ड: ${west ? "पश्चिमी" : "पूर्वी"} तट पर मानसून मत्स्य प्रतिबंध सामान्यतः जून–जुलाई में लागू होता है। सही तिथियाँ राज्य मत्स्य विभाग से पुष्टि करें।`,
        gu: `ડેમો રેકોર્ડ: ${west ? "પશ્ચિમ" : "પૂર્વ"} તટે ચોમાસુ મત્સ્ય પ્રતિબંધ સામાન્ય રીતે જૂન–જુલાઈમાં લાગુ પડે છે. ચોક્કસ તારીખ રાજ્ય મત્સ્ય વિભાગ પાસેથી ખાતરી કરો.`,
      },
    },
    {
      id: "demo-exercise",
      origin: "demo",
      severity: "warn",
      title: {
        en: "Restricted exercise area active (demo)",
        hi: "प्रतिबंधित अभ्यास क्षेत्र सक्रिय (डेमो)",
        gu: "પ્રતિબંધિત કવાયત વિસ્તાર સક્રિય (ડેમો)",
      },
      body: {
        en: "Demo record: the naval exercise box shown on the map is treated as active for route scoring. Real activations are published as notices to mariners.",
        hi: "डेमो रिकॉर्ड: मानचित्र पर दिखाया नौसैनिक अभ्यास क्षेत्र मार्ग स्कोरिंग हेतु सक्रिय माना गया है। वास्तविक सक्रियण नाविक सूचनाओं में प्रकाशित होते हैं।",
        gu: "ડેમો રેકોર્ડ: નકશા પરનો નૌકા કવાયત વિસ્તાર માર્ગ સ્કોરિંગ માટે સક્રિય ગણ્યો છે. વાસ્તવિક સક્રિયકરણ નાવિક સૂચનામાં પ્રસિદ્ધ થાય છે.",
      },
    },
  ];
}
