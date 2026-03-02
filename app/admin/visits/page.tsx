"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { safeFetch } from "@/lib/safeFetch";

const Map = dynamic(() => import("@/app/admin/components/Map"), { ssr: false });

interface Visit {
    id: number;
    ip: string;
    country: string;
    countryCode: string;
    region: string;
    city: string;
    lat: number;
    lng: number;
    gpsLat: number;
    gpsLng: number;
    isp: string;
    org: string;
    deviceType: string;
    os: string;
    browser: string;
    timezone: string;
    language: string;
    linkLabel: string;
    linkSlug: string;
    createdAt: string;
}

interface LinkOption {
    id: number;
    label: string;
    slug: string;
}

function VisitsPageContent() {
    const searchParams = useSearchParams();
    const linkIdParam = searchParams.get("link_id");

    const [visits, setVisits] = useState<Visit[]>([]);
    const [links, setLinks] = useState<LinkOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLink, setSelectedLink] = useState(linkIdParam || "");
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        let mounted = true;
        safeFetch<LinkOption[]>("/api/admin/links").then((data) => {
            if (mounted) setLinks(data ?? []);
        });
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        let mounted = true;
        const url = selectedLink
            ? `/api/admin/visits?link_id=${selectedLink}`
            : "/api/admin/visits";
        safeFetch<Visit[]>(url).then((data) => {
            if (mounted) {
                setVisits(data ?? []);
                setLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [selectedLink]);

    const mapMarkers = visits
        .filter((v) => v.gpsLat || v.lat)
        .map((v) => ({
            lat: v.gpsLat || v.lat,
            lng: v.gpsLng || v.lng,
            ip: v.ip,
            city: v.city,
            country: v.country,
            browser: v.browser,
            device: v.deviceType,
            createdAt: v.createdAt,
        }));

    const deviceIcon = (type: string) => {
        if (type === "mobile") return "📱";
        if (type === "tablet") return "📲";
        return "💻";
    };

    return (
        <div>
            <div className="section-header" style={{ marginBottom: "1.75rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                        Visits
                    </h1>
                    <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        {visits.length} captured visits
                        {selectedLink && " for this link"}
                    </p>
                </div>
                <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                    <select
                        className="input"
                        style={{ width: "12.5rem" }}
                        value={selectedLink}
                        onChange={(e) => setSelectedLink(e.target.value)}
                    >
                        <option value="">All Links</option>
                        {links.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`btn ${showMap ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setShowMap(!showMap)}
                    >
                        🗺️ {showMap ? "Hide Map" : "Show Map"}
                    </button>
                </div>
            </div>

            {/* Map */}
            {showMap && (
                <div
                    className="card"
                    style={{ height: "25rem", padding: 0, marginBottom: "1.5rem", overflow: "hidden" }}
                >
                    <Map markers={mapMarkers} />
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "3.75rem" }}>
                    Loading visits...
                </div>
            ) : visits.length === 0 ? (
                <div className="card empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No visits captured</h3>
                    <p>Share your tracking links to start capturing visitor data</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>IP Address</th>
                                <th>Location</th>
                                <th>GPS</th>
                                <th>Device / Browser</th>
                                <th>OS</th>
                                <th>ISP</th>
                                <th>Link</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visits.map((v) => (
                                <tr
                                    key={v.id}
                                    onClick={() => (window.location.href = `/admin/visits/${v.id}`)}
                                >
                                    <td style={{ color: "var(--text-muted)", fontSize: "0.6875rem" }}>#{v.id}</td>
                                    <td className="td-primary" style={{ fontFamily: "monospace" }}>
                                        {v.ip}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: "0.8125rem" }}>
                                            <div style={{ color: "var(--text-primary)" }}>{v.city || "?"}</div>
                                            <div style={{ color: "var(--text-muted)", fontSize: "0.6875rem" }}>
                                                {v.region && `${v.region}, `}{v.country || "Unknown"}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {v.gpsLat ? (
                                            <span className="badge badge-success">✓ GPS</span>
                                        ) : v.lat ? (
                                            <span className="badge badge-warning">IP-based</span>
                                        ) : (
                                            <span className="badge badge-muted">None</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ fontSize: "0.75rem" }}>
                                            <div style={{ color: "var(--text-primary)" }}>
                                                {deviceIcon(v.deviceType)} {v.browser}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{v.os}</td>
                                    <td
                                        style={{
                                            fontSize: "0.75rem",
                                            maxWidth: "9.375rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            color: "var(--text-muted)",
                                        }}
                                    >
                                        {v.isp || "—"}
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{v.linkLabel || "—"}</span>
                                    </td>
                                    <td style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                                        {new Date(v.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default function VisitsPage() {
    return (
        <Suspense fallback={<div style={{ color: "var(--text-muted)", padding: "3.75rem", textAlign: "center" }}>Loading...</div>}>
            <VisitsPageContent />
        </Suspense>
    );
}
