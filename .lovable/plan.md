# Marine Map Upgrade

## Scope
- Replace only the current diagram map with a real OpenStreetMap basemap powered by Leaflet.
- Preserve ORCA’s selected-location state, generated PFZs, hazards, restricted/protected areas, ports, maritime boundary, shipping lane, and optional route.
- Keep the current map card, legend, feature details, demo status, and multilingual labels.

## Implementation
- Add Leaflet and its type definitions, loading the browser-only map behind the existing server-rendering boundary.
- Render geographic overlays at their existing latitude/longitude coordinates, with restrained ORCA teal, green, amber, and red styling.
- Add standard zoom controls, a selected-port recenter control, coordinate readout, and a compact layer switcher.
- Recenter and rebuild overlays whenever the selected location changes.

## Verification
- Check Veraval coordinates, marker, PFZ placement, and all overlay categories.
- Switch to another port and back to confirm the map never falls back to Mumbai.
- Test route navigation and location/language controls, then confirm preview health on desktop and mobile-sized views.
