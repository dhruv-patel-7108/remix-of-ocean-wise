import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AlertsPanel } from "../components/AlertsPanel";
import { ChatPanel } from "../components/ChatPanel";
import { EvidencePanel } from "../components/EvidencePanel";
import { MarineMap } from "../components/MarineMap";
import { OceanPanel } from "../components/OceanPanel";
import { PfzPanel } from "../components/PfzPanel";
import { RiskPanel } from "../components/RiskPanel";
import { RoutePanel } from "../components/RoutePanel";
import { SystemPanel } from "../components/SystemPanel";
import { TopBar } from "../components/TopBar";
import { WeatherPanel } from "../components/WeatherPanel";
import { SiteFooter } from "../components/SiteFooter";
import type { LatLon } from "../lib/geodata";
import { AppStateProvider, useApp } from "../state/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORCA — Ocean Risk & Coastal Awareness" },
      {
        name: "description",
        content:
          "Marine decision-support console for Indian coastal operators: live weather and ocean conditions, potential fishing zones, route clearance and risk assessment.",
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
  return (
    <AppStateProvider>
      <DashboardBody />
    </AppStateProvider>
  );
}

function DashboardBody() {
  const { lang } = useApp();
  const [routePoints, setRoutePoints] = useState<LatLon[] | null>(null);
  const [routeLabel, setRouteLabel] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-4">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:items-start">
          <MarineMap routePoints={routePoints} routeLabel={routeLabel} />
          <ChatPanel />
        </div>

        <div className="grid gap-4">
          <WeatherPanel />
          <OceanPanel />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:items-start">
          <PfzPanel />
          <RiskPanel />
        </div>

        <RoutePanel
          onRouteChange={(points, label) => {
            setRoutePoints(points);
            setRouteLabel(label);
          }}
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:items-start">
          <AlertsPanel />
          <SystemPanel />
        </div>

        <EvidencePanel />
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
