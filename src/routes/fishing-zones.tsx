import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "../components/AppShell";
import { PfzPanel } from "../components/PfzPanel";
import { MarineMap } from "../components/MarineMap";
import { t } from "../lib/i18n";
import { useApp } from "../state/app-state";

export const Route = createFileRoute("/fishing-zones")({
  head: () => ({
    meta: [
      { title: "Potential Fishing Zones — ORCA" },
      { name: "description", content: "Scored potential fishing zones with SST, chlorophyll, depth, species and reasoning." },
      { property: "og:title", content: "Potential Fishing Zones — ORCA" },
      { property: "og:description", content: "Scored potential fishing zones with SST, chlorophyll, depth, species and reasoning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FishingZonesPage,
});

function FishingZonesPage() {
  const { lang } = useApp();
  return (
    <AppShell title={t(lang, "navPfz")}>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:items-start">
          <PfzPanel />
          <MarineMap routePoints={null} />
        </div>
    </AppShell>
  );
}
