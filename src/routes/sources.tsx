import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "../components/AppShell";
import { SystemPanel } from "../components/SystemPanel";
import { EvidencePanel } from "../components/EvidencePanel";
import { t } from "../lib/i18n";
import { useApp } from "../state/app-state";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Data & Sources — ORCA" },
      { name: "description", content: "Live, demo and unavailable status of every data source ORCA uses." },
      { property: "og:title", content: "Data & Sources — ORCA" },
      { property: "og:description", content: "Live, demo and unavailable status of every data source ORCA uses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  const { lang } = useApp();
  return (
    <AppShell title={t(lang, "navSources")}>
        <SystemPanel />
        <EvidencePanel />
    </AppShell>
  );
}
