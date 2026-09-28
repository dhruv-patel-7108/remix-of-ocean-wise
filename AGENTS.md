<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## ORCA architecture rules

- Selected location and language live in `src/state/app-state.tsx` as the single source of truth; every panel reads them rather than holding its own copy.
- Live marine/weather data comes only from `src/lib/api.ts` (Open-Meteo forecast + marine, 10-minute cache) and must carry a `live | demo | unavailable` status; panels never label demo data as live.
- Demo geospatial content is generated deterministically per port in `src/lib/geodata.ts` so zones, hazards and routes stay stable and location-coherent.
- Chat intent parsing and multilingual answer rendering live in `src/lib/chat.ts`; no external model is called.
- `AppStateProvider` wraps `<Outlet />` in `__root.tsx` and every console route renders inside `AppShell` (teal sidebar + header selectors), so location/language persist across the eight nav routes.
- Dashboard summary cards (`DashboardOverview.tsx`) read `snapshot` and reuse `buildSnapshot` for future hours; never duplicate risk/PFZ/alert logic there.
