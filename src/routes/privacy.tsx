import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalSection } from "../components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & data use — ORCA" },
      {
        name: "description",
        content:
          "How ORCA handles location selection, forecast requests and locally stored preferences.",
      },
      { property: "og:title", content: "Privacy & data use — ORCA" },
      {
        property: "og:description",
        content:
          "How ORCA handles location selection, forecast requests and locally stored preferences.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});

const sections: LegalSection[] = [
  {
    heading: {
      en: "What ORCA stores",
      hi: "ORCA क्या संग्रहित करता है",
      gu: "ORCA શું સંગ્રહે છે",
    },
    body: {
      en: [
        "Your selected language and selected port are stored in your browser's local storage so the console reopens where you left it. Nothing else is stored.",
        "Conversation history lives in the page only. Reloading or clearing the conversation removes it permanently; it is never uploaded.",
      ],
      hi: [
        "चयनित भाषा और चयनित बंदरगाह आपके ब्राउज़र के लोकल स्टोरेज में रखे जाते हैं ताकि कंसोल वहीं से खुले। इसके अतिरिक्त कुछ भी संग्रहित नहीं होता।",
        "संवाद इतिहास केवल पेज में रहता है। पेज पुनः लोड करने या संवाद साफ़ करने पर वह स्थायी रूप से हट जाता है; इसे कभी अपलोड नहीं किया जाता।",
      ],
      gu: [
        "પસંદ કરેલી ભાષા અને બંદર તમારા બ્રાઉઝરના લોકલ સ્ટોરેજમાં રખાય છે જેથી કન્સોલ ત્યાંથી જ ખૂલે. બીજું કશું સંગ્રહાતું નથી.",
        "સંવાદ ઇતિહાસ માત્ર પેજમાં રહે છે. પેજ ફરી લોડ કરતાં કે સંવાદ સાફ કરતાં તે કાયમ માટે દૂર થાય છે; તે કદી અપલોડ થતો નથી.",
      ],
    },
  },
  {
    heading: {
      en: "Requests to third parties",
      hi: "तृतीय पक्ष को अनुरोध",
      gu: "ત્રીજા પક્ષને વિનંતી",
    },
    body: {
      en: [
        "Forecast requests go directly from your browser to Open-Meteo (open-meteo.com). Those requests contain the latitude and longitude of the port you selected — not your device location.",
        "ORCA does not use advertising, analytics or tracking scripts, and does not ask for GPS permission.",
      ],
      hi: [
        "पूर्वानुमान अनुरोध आपके ब्राउज़र से सीधे Open-Meteo (open-meteo.com) को जाते हैं। उनमें चयनित बंदरगाह के अक्षांश-देशांतर होते हैं, आपके उपकरण का स्थान नहीं।",
        "ORCA कोई विज्ञापन, एनालिटिक्स या ट्रैकिंग स्क्रिप्ट प्रयोग नहीं करता और GPS अनुमति नहीं माँगता।",
      ],
      gu: [
        "આગાહી વિનંતી તમારા બ્રાઉઝરથી સીધી Open-Meteo (open-meteo.com) ને જાય છે. તેમાં પસંદ કરેલા બંદરના અક્ષાંશ-રેખાંશ હોય છે, તમારા ઉપકરણનું સ્થાન નહીં.",
        "ORCA કોઈ જાહેરાત, એનાલિટિક્સ કે ટ્રેકિંગ સ્ક્રિપ્ટ વાપરતું નથી અને GPS પરવાનગી માગતું નથી.",
      ],
    },
  },
  {
    heading: { en: "Contact and corrections", hi: "संपर्क एवं सुधार", gu: "સંપર્ક અને સુધારા" },
    body: {
      en: [
        "This is a hackathon prototype. There is no user account, no server-side profile and therefore no personal record to export or delete beyond clearing your browser storage.",
      ],
      hi: [
        "यह एक हैकथॉन प्रोटोटाइप है। कोई उपयोगकर्ता खाता या सर्वर-साइड प्रोफ़ाइल नहीं है, अतः ब्राउज़र स्टोरेज साफ़ करने के अलावा निर्यात या विलोपन हेतु कोई व्यक्तिगत रिकॉर्ड नहीं है।",
      ],
      gu: [
        "આ હેકાથોન પ્રોટોટાઇપ છે. કોઈ વપરાશકર્તા ખાતું કે સર્વર પ્રોફાઇલ નથી, તેથી બ્રાઉઝર સ્ટોરેજ સાફ કરવા સિવાય નિકાસ કે કાઢી નાખવા જેવો કોઈ અંગત રેકોર્ડ નથી.",
      ],
    },
  },
];

function PrivacyPage() {
  return (
    <LegalPage
      titleKey="privacy"
      intro={{
        en: "ORCA is a browser-side console. This page describes exactly what it keeps and what it sends.",
        hi: "ORCA ब्राउज़र-आधारित कंसोल है। यह पृष्ठ बताता है कि यह क्या रखता है और क्या भेजता है।",
        gu: "ORCA બ્રાઉઝર આધારિત કન્સોલ છે. આ પાનું જણાવે છે કે તે શું રાખે છે અને શું મોકલે છે.",
      }}
      sections={sections}
    />
  );
}
