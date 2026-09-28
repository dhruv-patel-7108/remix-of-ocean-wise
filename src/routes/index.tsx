import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "../components/AppShell";
import { ChatPanel } from "../components/ChatPanel";
import {
  AlertsSummaryCard,
  ForecastSummaryCard,
  KpiStrip,
  RiskFactorsCard,
  SourcesSummaryCard,
  ZonesSummaryCard,
} from "../components/DashboardOverview";
import { MarineMap } from "../components/MarineMap";
import { OceanPanel } from "../components/OceanPanel";
import { t } from "../lib/i18n";
import { useApp } from "../state/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORCA — Ocean Risk & Coastal Awareness" },
      {
        name: "description",
        content:
          "Marine decision-support dashboard for Indian coastal operators: live weather and ocean conditions, potential fishing zones, route clearance and risk assessment.",
      },
      { property: "og:title", content: "ORCA — Ocean Risk & Coastal Awareness" },
      {
        property: "og:description",
        content:
          "Live marine weather, fishing-zone intelligence, route planning and risk assessment for Indian coastal ports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { lang } = useApp();
  return (
    <AppShell title={t(lang, "navDashboard")}>
      <KpiStrip />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:items-start">
        <MarineMap routePoints={null} />
        <ChatPanel />
      </div>
      <OceanPanel />
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <ForecastSummaryCard />
        <ZonesSummaryCard />
        <AlertsSummaryCard />
        <RiskFactorsCard lang={lang} />
        <SourcesSummaryCard />
      </div>
    </AppShell>
  );
}
