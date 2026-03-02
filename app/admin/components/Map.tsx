"use client";

import { useEffect, useRef, useState } from "react";

interface MarkerData {
    lat: number;
    lng: number;
    label?: string;
    ip?: string;
    city?: string;
    country?: string;
    browser?: string;
    device?: string;
    createdAt?: string;
}

interface MapProps {
    markers: MarkerData[];
    zoom?: number;
    center?: [number, number];
}

export default function Map({ markers, zoom = 2, center = [20, 0] }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<unknown>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !mapRef.current) return;

        // Dynamically import leaflet to avoid SSR issues
        import("leaflet").then((L) => {
            // Clean up existing map
            if (mapInstanceRef.current) {
                (mapInstanceRef.current as { remove: () => void }).remove();
                mapInstanceRef.current = null;
            }

            const map = L.map(mapRef.current!, {
                center,
                zoom,
                zoomControl: true,
            });

            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                {
                    attribution: "© OpenStreetMap © CartoDB",
                    subdomains: "abcd",
                    maxZoom: 19,
                }
            ).addTo(map);

            // Custom marker icon
            const customIcon = L.divIcon({
                className: "",
                html: `<div style="
          width: 1.25rem; height: 1.25rem;
          background: #6366f1;
          border: 0.1875rem solid rgba(99,102,241,0.4);
          border-radius: 50%;
          box-shadow: 0 0 0.75rem rgba(99,102,241,0.8);
          cursor: pointer;
        "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            });

            const validMarkers = markers.filter(
                (m) => m.lat != null && m.lng != null && !isNaN(m.lat) && !isNaN(m.lng)
            );

            validMarkers.forEach((m) => {
                const popup = `
          <div style="
            background: #111827;
            color: #f1f5f9;
            border: 0.0625rem solid #1e2a3a;
            border-radius: 0.5rem;
            padding: 0.75rem;
            min-width: 12.5rem;
            font-family: monospace;
            font-size: 0.75rem;
            line-height: 1.8;
          ">
            <div style="font-size:0.875rem; font-weight:600; color:#6366f1; margin-bottom:0.5rem;">📍 ${m.ip || "Unknown IP"}</div>
            ${m.city || m.country ? `<div>🌍 ${[m.city, m.country].filter(Boolean).join(", ")}</div>` : ""}
            ${m.browser ? `<div>🌐 ${m.browser}</div>` : ""}
            ${m.device ? `<div>📱 ${m.device}</div>` : ""}
            ${m.createdAt ? `<div>⏰ ${new Date(m.createdAt).toLocaleString()}</div>` : ""}
          </div>
        `;
                L.marker([m.lat, m.lng], { icon: customIcon })
                    .bindPopup(popup, { maxWidth: 280 })
                    .addTo(map);
            });

            // Fit map to markers if any
            if (validMarkers.length > 0 && zoom === 2) {
                const group = L.featureGroup(
                    validMarkers.map((m) => L.marker([m.lat, m.lng]))
                );
                map.fitBounds(group.getBounds().pad(0.3));
            }

            mapInstanceRef.current = map;
        });

        return () => {
            if (mapInstanceRef.current) {
                (mapInstanceRef.current as { remove: () => void }).remove();
                mapInstanceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, markers]);

    if (!mounted) {
        return (
            <div
                style={{
                    height: "100%",
                    background: "var(--bg-secondary)",
                    borderRadius: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                }}
            >
                Loading map...
            </div>
        );
    }

    return (
        <div
            ref={mapRef}
            style={{
                height: "100%",
                width: "100%",
                borderRadius: "0.75rem",
                overflow: "hidden",
            }}
        />
    );
}
