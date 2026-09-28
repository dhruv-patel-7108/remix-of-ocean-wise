import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "../components/AppShell";
import { MarineMap } from "../components/MarineMap";
import { t } from "../lib/i18n";
import { useApp } from "../state/app-state";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Marine Map — ORCA" },
      { name: "description", content: "Port-centred marine map with fishing zones, restricted and protected areas, hazards, lanes and boundaries." },
      { property: "og:title", content: "Marine Map — ORCA" },
      { property: "og:description", content: "Port-centred marine map with fishing zones, restricted and protected areas, hazards, lanes and boundaries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MarineMapPage,
});

function MarineMapPage() {
  const { lang } = useApp();
  return (
    <AppShell title={t(lang, "navMap")}>
        <MarineMap routePoints={null} />
    </AppShell>
  );
}
