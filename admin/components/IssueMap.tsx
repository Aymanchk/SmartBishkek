"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Issue, STATUS_COLORS, CATEGORY_LABELS, STATUS_LABELS } from "@/lib/api";

const BISHKEK_CENTER: [number, number] = [42.8746, 74.5698];

export default function IssueMap({ issues }: { issues: Issue[] }) {
  return (
    <MapContainer
      center={BISHKEK_CENTER}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {issues.map((issue) => {
        const lat = parseFloat(issue.latitude);
        const lng = parseFloat(issue.longitude);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return (
          <CircleMarker
            key={issue.id}
            center={[lat, lng]}
            radius={9}
            pathOptions={{
              color: "#fff",
              weight: 2,
              fillColor: STATUS_COLORS[issue.status],
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>#{issue.id}</strong>
                <div>Категория: {issue.category ? CATEGORY_LABELS[issue.category] : "—"}</div>
                <div>Статус: {STATUS_LABELS[issue.status]}</div>
                {issue.image_url && (
                  <img
                    src={issue.image_url}
                    alt=""
                    style={{ width: "100%", marginTop: 6, borderRadius: 4 }}
                  />
                )}
                {issue.description && <p style={{ marginTop: 6 }}>{issue.description}</p>}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
