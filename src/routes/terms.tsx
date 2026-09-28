import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalSection } from "../components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms, usage limits & marine safety — ORCA" },
      {
        name: "description",
        content:
          "ORCA usage terms, data limitations, risk-model thresholds and the marine safety disclaimer for coastal operators.",
      },
      { property: "og:title", content: "Terms, usage limits & marine safety — ORCA" },
      {
        property: "og:description",
        content:
          "Usage terms, data limitations, risk-model thresholds and the marine safety disclaimer.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

const sections: LegalSection[] = [
  {
    heading: {
      en: "Marine safety disclaimer",
      hi: "समुद्री सुरक्षा अस्वीकरण",
      gu: "દરિયાઈ સલામતી અસ્વીકરણ",
    },
    body: {
      en: [
        "ORCA is decision support. It is not certified navigation software, not an electronic chart system and not an official warning service.",
        "Routes shown here are geometric constructions over a demo dataset. Plot every passage on approved charts and follow the instructions of the harbour authority, the Indian Coast Guard and your state fisheries department.",
        "If official guidance and ORCA disagree, official guidance applies.",
      ],
      hi: [
        "ORCA निर्णय सहायता है। यह प्रमाणित नेविगेशन सॉफ़्टवेयर, इलेक्ट्रॉनिक चार्ट प्रणाली अथवा आधिकारिक चेतावनी सेवा नहीं है।",
        "यहाँ दिखाए गए मार्ग डेमो डेटासेट पर बनी ज्यामितीय रचनाएँ हैं। प्रत्येक यात्रा स्वीकृत चार्ट पर बनाएं तथा बंदरगाह प्राधिकरण, भारतीय तटरक्षक एवं राज्य मत्स्य विभाग के निर्देशों का पालन करें।",
        "आधिकारिक मार्गदर्शन और ORCA में भिन्नता होने पर आधिकारिक मार्गदर्शन मान्य होगा।",
      ],
      gu: [
        "ORCA નિર્ણય સહાય છે. તે પ્રમાણિત નેવિગેશન સોફ્ટવેર, ઇલેક્ટ્રોનિક ચાર્ટ સિસ્ટમ કે સત્તાવાર ચેતવણી સેવા નથી.",
        "અહીં દર્શાવેલા માર્ગ ડેમો ડેટાસેટ પર બનેલી ભૌમિતિક રચનાઓ છે. દરેક સફર માન્ય ચાર્ટ પર દોરો અને બંદર સત્તા, ભારતીય તટરક્ષક તથા રાજ્ય મત્સ્ય વિભાગની સૂચનાનું પાલન કરો.",
        "સત્તાવાર માર્ગદર્શન અને ORCA વચ્ચે ફરક હોય તો સત્તાવાર માર્ગદર્શન લાગુ પડે.",
      ],
    },
  },
  {
    heading: { en: "Data limitations", hi: "डेटा सीमाएँ", gu: "ડેટા મર્યાદાઓ" },
    body: {
      en: [
        "Weather and ocean values come from the Open-Meteo Forecast and Marine APIs and are model output, not observations. They are cached for up to ten minutes per port.",
        "Fishing zones, restricted and protected areas, hazards, shipping lanes and the 12 nm line are a demo geospatial dataset generated around each port for demonstration. They are labelled DEMO everywhere they appear.",
        "ORCA is not connected to IMD, INCOIS or Coast Guard feeds, so the official-warning section always reports UNAVAILABLE rather than inventing bulletins.",
      ],
      hi: [
        "मौसम एवं महासागर मान Open-Meteo Forecast तथा Marine API से आते हैं और मॉडल आउटपुट हैं, प्रेक्षण नहीं। प्रति बंदरगाह इन्हें दस मिनट तक संचित रखा जाता है।",
        "मत्स्य क्षेत्र, प्रतिबंधित एवं संरक्षित क्षेत्र, खतरे, जहाजी गलियारे तथा 12 नॉटिकल मील रेखा प्रदर्शन हेतु प्रत्येक बंदरगाह के आसपास बनाया गया डेमो डेटासेट हैं और सर्वत्र डेमो अंकित हैं।",
        "ORCA IMD, INCOIS या तटरक्षक फ़ीड से जुड़ा नहीं है, अतः आधिकारिक चेतावनी अनुभाग सदैव अनुपलब्ध दर्शाता है।",
      ],
      gu: [
        "હવામાન અને મહાસાગર મૂલ્યો Open-Meteo Forecast અને Marine API માંથી આવે છે અને મોડેલ આઉટપુટ છે, અવલોકન નહીં. દરેક બંદર માટે તે દસ મિનિટ સુધી સંગ્રહાય છે.",
        "મત્સ્ય વિસ્તાર, પ્રતિબંધિત અને સંરક્ષિત વિસ્તાર, જોખમ, જહાજી કોરિડોર તથા 12 નોટિકલ માઈલ રેખા નિદર્શન માટે દરેક બંદર આસપાસ બનાવેલ ડેમો ડેટાસેટ છે અને દરેક જગ્યાએ ડેમો તરીકે ચિહ્નિત છે.",
        "ORCA IMD, INCOIS કે તટરક્ષક ફીડ સાથે જોડાયેલ નથી, તેથી સત્તાવાર ચેતવણી વિભાગ હંમેશા અનુપલબ્ધ દર્શાવે છે.",
      ],
    },
  },
  {
    heading: {
      en: "How the risk score is built",
      hi: "जोखिम स्कोर कैसे बनता है",
      gu: "જોખમ સ્કોર કેવી રીતે બને છે",
    },
    body: {
      en: [
        "Fixed thresholds add weight to a 0–100 score: wind from 22 km/h, gusts from 45 km/h, wave height from 1.5 m, visibility below 5 km, rain probability from 70%, surface current from 1.0 m/s, plus proximity under 5 km to a demo restricted area or hazard.",
        "Bands: 0–19 low, 20–44 moderate, 45–69 high, 70+ severe. No machine-learning model and no third-party inference is involved.",
      ],
      hi: [
        "निश्चित सीमाएँ 0–100 स्कोर में भार जोड़ती हैं: हवा 22 km/h से, झोंके 45 km/h से, लहर 1.5 मी से, दृश्यता 5 किमी से कम, वर्षा संभावना 70% से, सतही धारा 1.0 m/s से, तथा डेमो प्रतिबंधित क्षेत्र या खतरे से 5 किमी से कम दूरी।",
        "श्रेणियाँ: 0–19 कम, 20–44 मध्यम, 45–69 उच्च, 70+ गंभीर। कोई मशीन-लर्निंग मॉडल प्रयुक्त नहीं।",
      ],
      gu: [
        "નિશ્ચિત મર્યાદાઓ 0–100 સ્કોરમાં વજન ઉમેરે છે: પવન 22 km/h થી, ઝાપટાં 45 km/h થી, મોજાં 1.5 મી થી, દૃશ્યતા 5 કિમીથી ઓછી, વરસાદ શક્યતા 70% થી, સપાટી પ્રવાહ 1.0 m/s થી, તથા ડેમો પ્રતિબંધિત વિસ્તાર કે જોખમથી 5 કિમીથી ઓછું અંતર.",
        "શ્રેણી: 0–19 ઓછું, 20–44 મધ્યમ, 45–69 ઊંચું, 70+ ગંભીર. કોઈ મશીન-લર્નિંગ મોડેલ વપરાયું નથી.",
      ],
    },
  },
  {
    heading: { en: "Acceptable use", hi: "स्वीकार्य उपयोग", gu: "સ્વીકાર્ય ઉપયોગ" },
    body: {
      en: [
        "Use ORCA for planning and situational awareness only. Do not rely on it for collision avoidance, distress response or legal compliance with maritime boundaries.",
        "The prototype is provided without warranty and may be offline or out of date at any time.",
      ],
      hi: [
        "ORCA का उपयोग केवल नियोजन एवं स्थिति-बोध हेतु करें। टक्कर-निवारण, आपात प्रतिक्रिया अथवा समुद्री सीमाओं के कानूनी पालन हेतु इस पर निर्भर न रहें।",
        "यह प्रोटोटाइप बिना किसी वारंटी के दिया गया है और कभी भी अनुपलब्ध या पुराना हो सकता है।",
      ],
      gu: [
        "ORCA નો ઉપયોગ માત્ર આયોજન અને પરિસ્થિતિ સમજ માટે કરો. અથડામણ નિવારણ, કટોકટી પ્રતિસાદ કે દરિયાઈ સીમાના કાનૂની પાલન માટે તેના પર આધાર ન રાખો.",
        "આ પ્રોટોટાઇપ કોઈ વોરંટી વિના આપેલ છે અને કોઈપણ સમયે અનુપલબ્ધ કે જૂનો હોઈ શકે.",
      ],
    },
  },
];

function TermsPage() {
  return (
    <LegalPage
      titleKey="terms"
      intro={{
        en: "Read these limits before using ORCA output for any operational decision.",
        hi: "किसी भी परिचालन निर्णय हेतु ORCA के परिणाम उपयोग करने से पहले ये सीमाएँ पढ़ें।",
        gu: "કોઈપણ કાર્યકારી નિર્ણય માટે ORCA ના પરિણામ વાપરતાં પહેલાં આ મર્યાદાઓ વાંચો.",
      }}
      sections={sections}
    />
  );
}
