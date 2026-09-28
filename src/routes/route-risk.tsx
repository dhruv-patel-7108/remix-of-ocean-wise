import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "../components/AppShell";
import { MarineMap } from "../components/MarineMap";
import { RiskPanel } from "../components/RiskPanel";
import { RoutePanel } from "../components/RoutePanel";
import type { LatLon } from "../lib/geodata";
import { t } from "../lib/i18n";
import { useApp } from "../state/app-state";

export const Route = createFileRoute("/route-risk")({
  head: () => ({
    meta: [
      { title: "Route & Risk — ORCA" },
      {
        name: "description",
        content: "Plan coastal routes around demo restricted areas and hazards, with ORCA's risk assessment and contributing factors.",
      },
      { property: "og:title", content: "Route & Risk — ORCA" },
      {
        property: "og:description",
        content: "Route planning and risk scoring for Indian coastal operators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RouteRiskPage,
});

function RouteRiskPage() {
  const { lang } = useApp();
  const [routePoints, setRoutePoints] = useState<LatLon[] | null>(null);
  const [routeLabel, setRouteLabel] = useState<string | undefined>(undefined);
  return (
    <AppShell title={t(lang, "navRouteRisk")}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:items-start">
        <MarineMap routePoints={routePoints} routeLabel={routeLabel} />
        <RiskPanel />
      </div>
      <RoutePanel
        onRouteChange={(points, label) => {
          setRoutePoints(points);
          setRouteLabel(label);
        }}
      />
    </AppShell>
  );
}
