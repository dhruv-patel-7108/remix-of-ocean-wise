import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "../components/AppShell";
import { AlertsPanel } from "../components/AlertsPanel";
import { t } from "../lib/i18n";
import { useApp } from "../state/app-state";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Marine Alerts — ORCA" },
      { name: "description", content: "Forecast-derived marine alerts and demo advisories, with official feed status shown clearly." },
      { property: "og:title", content: "Marine Alerts — ORCA" },
      { property: "og:description", content: "Forecast-derived marine alerts and demo advisories, with official feed status shown clearly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const { lang } = useApp();
  return (
    <AppShell title={t(lang, "navAlerts")}>
        <AlertsPanel />
    </AppShell>
  );
}
