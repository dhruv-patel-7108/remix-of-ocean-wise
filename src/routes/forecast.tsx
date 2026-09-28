import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "../components/AppShell";
import { WeatherPanel } from "../components/WeatherPanel";
import { OceanPanel } from "../components/OceanPanel";
import { t } from "../lib/i18n";
import { useApp } from "../state/app-state";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Forecast — ORCA" },
      { name: "description", content: "Hour-by-hour marine weather and ocean forecast for the selected Indian coastal port." },
      { property: "og:title", content: "Forecast — ORCA" },
      { property: "og:description", content: "Hour-by-hour marine weather and ocean forecast for the selected Indian coastal port." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const { lang } = useApp();
  return (
    <AppShell title={t(lang, "navForecast")}>
        <WeatherPanel />
        <OceanPanel />
    </AppShell>
  );
}
