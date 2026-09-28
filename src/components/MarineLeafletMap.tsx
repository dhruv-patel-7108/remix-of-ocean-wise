import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import {
  Circle,
  LayersControl,
  MapContainer,
  Marker,
  Pane,
  Polyline,
  Popup,
  ScaleControl,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import { Crosshair } from "lucide-react";

import type { GeoSet, LatLon } from "../lib/geodata";
import type { Lang, MarineLocation } from "../lib/locations";
import { Button } from "./ui/primitives";

export interface MapSelection {
  name: string;
  detail: string;
  meta?: string | undefined;
}

const LABELS: Record<Lang, { recenter: string; coordinates: string; layers: string }> = {
  en: { recenter: "Recenter on selected location", coordinates: "Map coordinates", layers: "Map layers" },
  hi: { recenter: "चुने हुए स्थान पर फिर केंद्रित करें", coordinates: "मानचित्र निर्देशांक", layers: "मानचित्र परतें" },
  gu: { recenter: "પસંદ કરેલા સ્થાન પર ફરી કેન્દ્રિત કરો", coordinates: "નકશાના યામ", layers: "નકશાના સ્તરો" },
};

const STYLE = {
  pfz: { color: "var(--color-ok)", fillColor: "var(--color-ok)", fillOpacity: 0.2 },
  restricted: {
    color: "var(--color-destructive)",
    fillColor: "var(--color-destructive)",
    fillOpacity: 0.16,
    dashArray: "7 5",
  },
  protected: {
    color: "var(--color-primary)",
    fillColor: "var(--color-primary)",
    fillOpacity: 0.14,
    dashArray: "6 5",
  },
  hazard: {
    color: "var(--color-warning)",
    fillColor: "var(--color-warning)",
    fillOpacity: 0.2,
  },
} as const;

function toTuple(point: LatLon): [number, number] {
  return [point.lat, point.lon];
}

function CoordinateReadout({ lang }: { lang: Lang }) {
  const map = useMapEvents({
    move: () => setCenter(map.getCenter()),
    zoom: () => setCenter(map.getCenter()),
  });
  const [center, setCenter] = useState(() => map.getCenter());

  return (
    <div className="orca-coordinate-readout" aria-label={LABELS[lang].coordinates}>
      {center.lat.toFixed(4)}°, {center.lng.toFixed(4)}°
    </div>
  );
}

function LocationSync({ location }: { location: MarineLocation }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView([location.lat, location.lon], 9, { animate: false });
  }, [location.id, location.lat, location.lon, map]);
  return null;
}

function createPortIcon(selected: boolean) {
  return L.divIcon({
    className: "orca-port-icon-shell",
    html: `<span class="${selected ? "orca-location-marker" : "orca-port-marker"}"></span>`,
    iconSize: selected ? [24, 24] : [14, 14],
    iconAnchor: selected ? [12, 12] : [7, 7],
  });
}

export function MarineLeafletMap({
  geo,
  location,
  lang,
  routePoints,
  onSelect,
}: {
  geo: GeoSet;
  location: MarineLocation;
  lang: Lang;
  routePoints?: LatLon[] | null | undefined;
  onSelect: (selection: MapSelection) => void;
}) {
  const mapRef = useRef<LeafletMap | null>(null);
  const labels = LABELS[lang];
  const center: [number, number] = [location.lat, location.lon];
  const selectedIcon = useMemo(() => createPortIcon(true), []);
  const portIcon = useMemo(() => createPortIcon(false), []);

  const selectCircle = (circle: GeoSet["circles"][number]) => {
    onSelect({
      name: circle.name[lang],
      detail: circle.detail[lang],
      meta: `${circle.center.lat.toFixed(3)}, ${circle.center.lon.toFixed(3)} · r ${circle.radiusKm.toFixed(0)} km`,
    });
  };

  return (
    <div className="orca-map-wrap">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={9}
        minZoom={4}
        maxZoom={15}
        scrollWheelZoom
        zoomControl
        className="orca-leaflet-map"
        aria-label={`${location.name[lang]} marine map`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Pane name="orca-zones" style={{ zIndex: 410 }}>
          <LayersControl position="topright" collapsed>
            <LayersControl.Overlay checked name="Potential Fishing Zones">
              <>
                {geo.circles
                  .filter((circle) => circle.kind === "pfz")
                  .map((circle) => (
                    <Circle
                      key={circle.id}
                      center={toTuple(circle.center)}
                      radius={circle.radiusKm * 1000}
                      pathOptions={{ ...STYLE.pfz, weight: 2 }}
                      eventHandlers={{ click: () => selectCircle(circle) }}
                    >
                      <Tooltip permanent direction="top" offset={[0, -5]}>
                        {circle.name[lang]}
                      </Tooltip>
                      <Popup>{circle.detail[lang]}</Popup>
                    </Circle>
                  ))}
              </>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Hazards">
              <>
                {geo.circles
                  .filter((circle) => circle.kind === "hazard")
                  .map((circle) => (
                    <Circle
                      key={circle.id}
                      center={toTuple(circle.center)}
                      radius={circle.radiusKm * 1000}
                      pathOptions={{ ...STYLE.hazard, weight: 2 }}
                      eventHandlers={{ click: () => selectCircle(circle) }}
                    >
                      <Tooltip>{circle.name[lang]}</Tooltip>
                      <Popup>{circle.detail[lang]}</Popup>
                    </Circle>
                  ))}
              </>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Restricted & protected">
              <>
                {geo.circles
                  .filter((circle) => circle.kind === "restricted" || circle.kind === "protected")
                  .map((circle) => {
                    const style = circle.kind === "restricted" ? STYLE.restricted : STYLE.protected;
                    return (
                      <Circle
                        key={circle.id}
                        center={toTuple(circle.center)}
                        radius={circle.radiusKm * 1000}
                        pathOptions={{ ...style, weight: 2 }}
                        eventHandlers={{ click: () => selectCircle(circle) }}
                      >
                        <Tooltip>{circle.name[lang]}</Tooltip>
                        <Popup>{circle.detail[lang]}</Popup>
                      </Circle>
                    );
                  })}
              </>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Maritime context">
              <>
                <Polyline
                  positions={geo.boundary.points.map(toTuple)}
                  pathOptions={{ color: "var(--color-accent)", weight: 2, dashArray: "9 7", opacity: 0.85 }}
                  eventHandlers={{
                    click: () => onSelect({ name: geo.boundary.name[lang], detail: geo.boundary.detail[lang] }),
                  }}
                >
                  <Tooltip>{geo.boundary.name[lang]}</Tooltip>
                </Polyline>
                <Polyline
                  positions={geo.lane.points.map(toTuple)}
                  pathOptions={{ color: "var(--color-muted-foreground)", weight: 5, dashArray: "16 12", opacity: 0.65 }}
                  eventHandlers={{
                    click: () => onSelect({ name: geo.lane.name[lang], detail: geo.lane.detail[lang] }),
                  }}
                >
                  <Tooltip>{geo.lane.name[lang]}</Tooltip>
                </Polyline>
              </>
            </LayersControl.Overlay>

            {routePoints && routePoints.length > 1 ? (
              <LayersControl.Overlay checked name="Route">
                <Polyline
                  positions={routePoints.map(toTuple)}
                  pathOptions={{ color: "var(--color-primary)", weight: 4, opacity: 0.95 }}
                />
              </LayersControl.Overlay>
            ) : null}
          </LayersControl>
        </Pane>

        {geo.ports.map((port) => {
          const isSelected = port.id === `${location.id}-port`;
          return (
            <Marker
              key={port.id}
              position={toTuple(port.at)}
              icon={isSelected ? selectedIcon : portIcon}
              eventHandlers={{
                click: () =>
                  onSelect({
                    name: port.name[lang],
                    detail: port.detail[lang],
                    meta: `${port.at.lat.toFixed(3)}, ${port.at.lon.toFixed(3)}`,
                  }),
              }}
            >
              <Tooltip permanent={isSelected} direction="right" offset={[10, 0]}>
                {port.name[lang]}
              </Tooltip>
              <Popup>{port.detail[lang]}</Popup>
            </Marker>
          );
        })}

        <ScaleControl position="bottomleft" imperial={false} />
        <CoordinateReadout lang={lang} />
        <LocationSync location={location} />
      </MapContainer>

      <div className="absolute bottom-7 right-2 z-[500]">
        <Button
          variant="default"
          ariaLabel={labels.recenter}
          onClick={() => mapRef.current?.setView(center, 9)}
        >
          <Crosshair aria-hidden className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}