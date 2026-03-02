"use client";

import { useEffect, useState } from "react";
import { safeFetch } from "@/lib/safeFetch";

interface Link {
    id: number;
    slug: string;
    label: string;
    redirectUrl: string;
    visitCount: number;
    createdAt: string;
}

export default function LinksPage() {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ label: "", redirectUrl: "https://www.linkedin.com/in/deeproshan-kumar/" });
    const [creating, setCreating] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    async function loadLinks() {
        const data = await safeFetch<Link[]>("/api/admin/links");
        setLinks(data ?? []);
        setLoading(false);
    }

    useEffect(() => {
        let mounted = true;
        async function init() {
            const data = await safeFetch<Link[]>("/api/admin/links");
            if (mounted) {
                setLinks(data ?? []);
                setLoading(false);
            }
        }
        init();
        return () => { mounted = false; };
    }, []);

    async function createLink() {
        setCreating(true);
        await fetch("/api/admin/links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setShowModal(false);
        setForm({ label: "", redirectUrl: "https://www.linkedin.com/in/deeproshan-kumar/" });
        setCreating(false);
        loadLinks();
    }

    async function deleteLink(id: number) {
        if (!confirm("Delete this link and all its visits?")) return;
        await fetch(`/api/admin/links/${id}`, { method: "DELETE" });
        loadLinks();
    }

    function copyLink(slug: string, id: number) {
        const url = `${window.location.origin}/t/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    return (
        <div>
            <div className="section-header" style={{ marginBottom: "1.75rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                        Tracking Links
                    </h1>
                    <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        Create and manage your fake tracking links
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + New Link
                </button>
            </div>

            {loading ? (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "3.75rem" }}>
                    Loading...
                </div>
            ) : links.length === 0 ? (
                <div className="card empty-state">
                    <div className="empty-icon">🔗</div>
                    <h3>No tracking links yet</h3>
                    <p>Click &quot;New Link&quot; to create your first tracking link</p>
                    <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => setShowModal(true)}>
                        + Create First Link
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Label</th>
                                <th>Tracking URL</th>
                                <th>Redirect To</th>
                                <th>Visits</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link) => (
                                <tr key={link.id} onClick={() => { }} style={{ cursor: "default" }}>
                                    <td className="td-primary">{link.label}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <code
                                                style={{
                                                    background: "rgba(99,102,241,0.1)",
                                                    color: "var(--accent)",
                                                    padding: "0.1875rem 0.5rem",
                                                    borderRadius: "0.25rem",
                                                    fontSize: "0.75rem",
                                                    fontFamily: "monospace",
                                                }}
                                            >
                                                /t/{link.slug}
                                            </code>
                                            <button
                                                className={`btn btn-ghost btn-sm copy-tooltip ${copiedId === link.id ? "copied" : ""}`}
                                                onClick={() => copyLink(link.slug, link.id)}
                                                title="Copy full URL"
                                            >
                                                {copiedId === link.id ? "✓" : "📋"}
                                            </button>
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            maxWidth: "12.5rem",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <a
                                            href={link.redirectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {link.redirectUrl}
                                        </a>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{link.visitCount}</span>
                                    </td>
                                    <td style={{ fontSize: "0.75rem" }}>
                                        {new Date(link.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "0.375rem" }}>
                                            <a
                                                href={`/admin/visits?link_id=${link.id}`}
                                                className="btn btn-ghost btn-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                👁️ Visits
                                            </a>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={(e) => { e.stopPropagation(); deleteLink(link.id); }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--text-primary)" }}>
                            ✨ Create New Tracking Link
                        </h2>
                        <div style={{ marginBottom: "1rem" }}>
                            <label className="label">Label (internal name)</label>
                            <input
                                className="input"
                                placeholder="e.g. Instagram DM bait"
                                value={form.label}
                                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                                autoFocus
                            />
                        </div>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label className="label">Redirect URL (where target goes after capture)</label>
                            <input
                                className="input"
                                placeholder="https://example.com/"
                                value={form.redirectUrl}
                                onChange={(e) => setForm((f) => ({ ...f, redirectUrl: e.target.value }))}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "0.625rem", justifyContent: "flex-end" }}>
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={createLink}
                                disabled={creating || !form.label || !form.redirectUrl}
                            >
                                {creating ? "Creating..." : "Create Link"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
