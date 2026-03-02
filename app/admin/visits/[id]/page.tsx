"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/admin/components/Map"), { ssr: false });

interface VisitDetail {
    id: number;
    ip: string;
    country: string;
    countryCode: string;
    region: string;
    city: string;
    lat: number | null;
    lng: number | null;
    gpsLat: number | null;
    gpsLng: number | null;
    isp: string;
    org: string;
    timezone: string;
    deviceType: string;
    os: string;
    browser: string;
    userAgent: string;
    language: string;
    referer: string;
    linkLabel: string;
    linkSlug: string;
    createdAt: string;
}

const Field = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            padding: "0.875rem 0",
            borderBottom: "0.0625rem solid var(--border)",
        }}
    >
        <span
            style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
            }}
        >
            {label}
        </span>
        <span
            style={{
                fontSize: "0.875rem",
                color: value ? "var(--text-primary)" : "var(--text-muted)",
                fontFamily: typeof value === "string" && (label.toLowerCase().includes("ip") || label.toLowerCase().includes("agent"))
                    ? "monospace"
                    : "inherit",
                wordBreak: "break-all",
            }}
        >
            {value ?? "—"}
        </span>
    </div>
);

export default function VisitDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [visit, setVisit] = useState<VisitDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetch(`/api/admin/visits/${params.id}`)
            .then((r) => r.json())
            .then((data) => {
                if (mounted) {
                    setVisit(data);
                    setLoading(false);
                }
            });
        return () => { mounted = false; };
    }, [params.id]);

    if (loading) {
        return (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "3.75rem" }}>
                Loading visit details...
            </div>
        );
    }

    if (!visit) {
        return (
            <div style={{ textAlign: "center", padding: "3.75rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
                <p style={{ color: "var(--text-muted)" }}>Visit not found</p>
                <button className="btn btn-ghost" style={{ marginTop: "1rem" }} onClick={() => router.back()}>
                    ← Go Back
                </button>
            </div>
        );
    }

    const hasGps = visit.gpsLat != null && visit.gpsLng != null;
    const hasIpLocation = visit.lat != null && visit.lng != null;
    const mapLat = visit.gpsLat ?? visit.lat;
    const mapLng = visit.gpsLng ?? visit.lng;

    const markers =
        mapLat && mapLng
            ? [
                {
                    lat: mapLat,
                    lng: mapLng,
                    ip: visit.ip,
                    city: visit.city,
                    country: visit.country,
                    browser: visit.browser,
                    device: visit.deviceType,
                    createdAt: visit.createdAt,
                },
            ]
            : [];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "1.75rem" }}>
                <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginBottom: "1rem" }}
                    onClick={() => router.back()}
                >
                    ← Back to Visits
                </button>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                    <div>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                            Visit #{visit.id}
                        </h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
                            Captured {new Date(visit.createdAt).toLocaleString()} via{" "}
                            <span style={{ color: "var(--accent)" }}>{visit.linkLabel || visit.linkSlug}</span>
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                        {hasGps ? (
                            <span className="badge badge-success">✓ GPS Precise</span>
                        ) : hasIpLocation ? (
                            <span className="badge badge-warning">IP-Based Location</span>
                        ) : (
                            <span className="badge badge-muted">No Location</span>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 23.75rem", gap: "1.25rem" }}>
                {/* Left column — data */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Network info */}
                    <div className="card">
                        <div
                            style={{
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                color: "var(--accent)",
                                marginBottom: "0.25rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            🌐 Network Information
                        </div>
                        <Field label="IP Address" value={visit.ip} />
                        <Field label="ISP" value={visit.isp} />
                        <Field label="Organization" value={visit.org} />
                        <Field label="Timezone" value={visit.timezone} />
                    </div>

                    {/* Location info */}
                    <div className="card">
                        <div
                            style={{
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                color: "#10b981",
                                marginBottom: "0.25rem",
                            }}
                        >
                            📍 Location Information
                        </div>
                        <Field label="Country" value={visit.country} />
                        <Field label="Region" value={visit.region} />
                        <Field label="City" value={visit.city} />
                        <Field label="IP-Based Coordinates" value={visit.lat != null ? `${visit.lat}, ${visit.lng}` : null} />
                        <Field
                            label="GPS Coordinates (browser)"
                            value={visit.gpsLat != null ? `${visit.gpsLat}, ${visit.gpsLng}` : null}
                        />
                    </div>

                    {/* Device info */}
                    <div className="card">
                        <div
                            style={{
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                color: "#f59e0b",
                                marginBottom: "0.25rem",
                            }}
                        >
                            💻 Device & Browser
                        </div>
                        <Field label="Device Type" value={visit.deviceType} />
                        <Field label="Browser" value={visit.browser} />
                        <Field label="Operating System" value={visit.os} />
                        <Field label="Language" value={visit.language} />
                        <Field label="Referer" value={visit.referer} />
                        <Field label="User Agent" value={visit.userAgent} />
                    </div>
                </div>

                {/* Right column — map */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Map */}
                    <div
                        className="card"
                        style={{ height: "23.75rem", padding: 0, overflow: "hidden", flexShrink: 0 }}
                    >
                        {markers.length > 0 ? (
                            <Map
                                markers={markers}
                                zoom={mapLat && mapLng ? 10 : 2}
                                center={mapLat && mapLng ? [mapLat, mapLng] : [20, 0]}
                            />
                        ) : (
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--text-muted)",
                                }}
                            >
                                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", opacity: 0.3 }}>🗺️</div>
                                <p>No location data</p>
                            </div>
                        )}
                    </div>

                    {/* Quick summary card */}
                    <div className="card">
                        <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                            Quick Summary
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                            {[
                                { icon: "🌍", label: "Location", value: [visit.city, visit.country].filter(Boolean).join(", ") || "Unknown" },
                                { icon: "📱", label: "Device", value: visit.deviceType || "Unknown" },
                                { icon: "🌐", label: "Browser", value: visit.browser || "Unknown" },
                                { icon: "💿", label: "OS", value: visit.os || "Unknown" },
                                { icon: "🏢", label: "ISP", value: visit.isp || "Unknown" },
                            ].map((item) => (
                                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                    <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>{item.label}</div>
                                        <div
                                            style={{
                                                fontSize: "0.8125rem",
                                                color: "var(--text-primary)",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {item.value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
