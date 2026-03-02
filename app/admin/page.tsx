"use client";

import { useEffect, useState } from "react";
import { safeFetch } from "@/lib/safeFetch";

interface Stats {
    totalLinks: number;
    totalVisits: number;
    uniqueIPs: number;
    uniqueCountries: number;
    recentVisits: { date: string; count: number }[];
    topCountries: { country: string; countryCode: string; count: number }[];
}

interface RecentVisit {
    id: number;
    ip: string;
    country: string;
    city: string;
    browser: string;
    os: string;
    deviceType: string;
    linkLabel: string;
    createdAt: string;
}

const StatCard = ({
    icon,
    label,
    value,
    color,
}: {
    icon: string;
    label: string;
    value: number;
    color: string;
}) => (
    <div className="stat-card">
        <div className="stat-icon" style={{ background: `${color}18`, fontSize: "1.375rem" }}>
            {icon}
        </div>
        <div>
            <div className="stat-value">{value.toLocaleString()}</div>
            <div className="stat-label">{label}</div>
        </div>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState(false);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            safeFetch<Stats>("/api/admin/stats"),
            safeFetch<RecentVisit[]>("/api/admin/visits"),
        ]).then(([s, v]) => {
            if (!mounted) return;
            if (s === null) {
                setDbError(true);
            } else {
                setStats(s);
            }
            setRecentVisits((v ?? []).slice(0, 8));
            setLoading(false);
        });
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
                <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚙️</div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (dbError) {
        return (
            <div>
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                        Dashboard
                    </h1>
                </div>
                <div
                    style={{
                        background: "rgba(245,158,11,0.06)",
                        border: "0.0625rem solid rgba(245,158,11,0.25)",
                        borderRadius: "1rem",
                        padding: "2rem",
                        maxWidth: "37.5rem",
                    }}
                >
                    <div style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>🗄️</div>
                    <h2 style={{ color: "var(--warning)", fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                        Database Not Connected
                    </h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: "1.7" }}>
                        The admin panel is running but cannot reach the database. Please complete setup:
                    </p>
                    <ol style={{ color: "var(--text-secondary)", lineHeight: "2", paddingLeft: "1.25rem" }}>
                        <li>
                            Edit <code style={{ background: "rgba(99,102,241,0.1)", color: "var(--accent)", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" }}>.env.local</code> with your MySQL credentials
                        </li>
                        <li>
                            Run <code style={{ background: "rgba(99,102,241,0.1)", color: "var(--accent)", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" }}>npm run db:push</code> to create the tables
                        </li>
                        <li>Restart the dev server: <code style={{ background: "rgba(99,102,241,0.1)", color: "var(--accent)", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" }}>npm run dev</code></li>
                    </ol>
                    <div
                        style={{
                            marginTop: "1.25rem",
                            background: "var(--bg-secondary)",
                            border: "0.0625rem solid var(--border)",
                            borderRadius: "0.5rem",
                            padding: "0.875rem 1rem",
                            fontFamily: "monospace",
                            fontSize: "0.8125rem",
                            color: "var(--text-secondary)",
                        }}
                    >
                        <div style={{ color: "var(--text-muted)", marginBottom: "0.375rem", fontSize: "0.6875rem" }}>
                            .env.local
                        </div>
                        <div>DATABASE_URL=mysql://user:pass@localhost:3306/anchor_point</div>
                        <div>ADMIN_PASSWORD=your_password</div>
                        <div>NEXTAUTH_SECRET=random_32_char_string</div>
                        <div>NEXTAUTH_URL=http://localhost:3000</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
                    <div className="live-dot" />
                    <span style={{ fontSize: "0.75rem", color: "var(--success)" }}>Live</span>
                </div>
                <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    Dashboard
                </h1>
                <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Overview of your tracking links and captured data
                </p>
            </div>

            {/* Stats grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(12.5rem, 1fr))",
                    gap: "1rem",
                    marginBottom: "2rem",
                }}
            >
                <StatCard icon="🔗" label="Total Links" value={stats?.totalLinks ?? 0} color="#6366f1" />
                <StatCard icon="👁️" label="Total Visits" value={stats?.totalVisits ?? 0} color="#06b6d4" />
                <StatCard icon="🌐" label="Unique IPs" value={stats?.uniqueIPs ?? 0} color="#10b981" />
                <StatCard icon="🗺️" label="Countries" value={stats?.uniqueCountries ?? 0} color="#f59e0b" />
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
            }}>
                {/* Recent visits table */}
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: "0.0625rem solid var(--border)" }}>
                        <div className="section-title">Recent Visits</div>
                    </div>
                    {recentVisits.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No visits yet</h3>
                            <p>Share a tracking link to start capturing data</p>
                        </div>
                    ) : (
                        <div className="table-container" style={{ border: "none" }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>IP</th>
                                        <th>Location</th>
                                        <th>Device</th>
                                        <th>Link</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentVisits.map((v) => (
                                        <tr
                                            key={v.id}
                                            onClick={() => (window.location.href = `/admin/visits/${v.id}`)}
                                        >
                                            <td className="td-primary" style={{ fontFamily: "monospace" }}>{v.ip}</td>
                                            <td>
                                                {v.city && v.country
                                                    ? `${v.city}, ${v.country}`
                                                    : v.country || "—"}
                                            </td>
                                            <td>
                                                <div style={{ fontSize: "0.75rem" }}>
                                                    <div style={{ color: "var(--text-primary)" }}>{v.browser || "—"}</div>
                                                    <div style={{ color: "var(--text-muted)" }}>{v.os}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-info">{v.linkLabel || "—"}</span>
                                            </td>
                                            <td style={{ fontSize: "0.75rem" }}>
                                                {new Date(v.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Top countries */}
                <div className="card">
                    <div className="section-title" style={{ marginBottom: "1rem" }}>Top Countries</div>
                    {stats?.topCountries?.length ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {stats.topCountries.map((c, i) => (
                                <div key={c.country} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                    <div
                                        style={{
                                            width: "1.375rem",
                                            height: "1.375rem",
                                            borderRadius: "50%",
                                            background: "var(--accent)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.625rem",
                                            fontWeight: 700,
                                            color: "#fff",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "0.8125rem", color: "var(--text-primary)", fontWeight: 500 }}>
                                            {c.country || "Unknown"}
                                        </div>
                                        <div
                                            style={{
                                                height: "0.1875rem",
                                                background: "var(--border)",
                                                borderRadius: "0.125rem",
                                                marginTop: "0.25rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: "100%",
                                                    width: `${Math.min((c.count / (stats?.totalVisits || 1)) * 100, 100)}%`,
                                                    background: "var(--accent)",
                                                    borderRadius: "0.125rem",
                                                    transition: "width 0.5s ease",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ color: "var(--text-muted)", fontSize: "0.8125rem", textAlign: "center", padding: "1.25rem 0" }}>
                            No data yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
