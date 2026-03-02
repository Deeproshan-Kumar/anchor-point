"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const navItems = [
    { href: "/admin", icon: "⬡", label: "Dashboard" },
    { href: "/admin/links", icon: "🔗", label: "Links" },
    { href: "/admin/visits", icon: "📍", label: "Visits" },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    // Close sidebar when navigating on mobile
    useEffect(() => {
        if (isOpen) {
            onClose();
        }
    }, [pathname, isOpen, onClose]);

    return (
        <aside
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                width: "var(--sidebar-width)",
                background: "var(--bg-secondary)",
                borderRight: "0.0625rem solid var(--border)",
                display: "flex",
                flexDirection: "column",
                zIndex: 100,
                overflow: "hidden",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            }}
            className="sidebar-nav"
        >
            {/* Mobile Close Button */}
            <button
                onClick={onClose}
                className="mobile-only"
                style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "1.25rem",
                    cursor: "pointer",
                    zIndex: 10,
                }}
            >
                ✕
            </button>

            {/* Logo */}
            <div
                style={{
                    padding: "1.5rem 1.25rem",
                    borderBottom: "0.0625rem solid var(--border)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div
                        style={{
                            width: "2.25rem",
                            height: "2.25rem",
                            background: "var(--accent)",
                            borderRadius: "0.625rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.125rem",
                            boxShadow: "0 0 1.25rem var(--accent-glow)",
                        }}
                    >
                        ⚓
                    </div>
                    <div>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: "0.9375rem",
                                color: "var(--text-primary)",
                            }}
                        >
                            Anchor Point
                        </div>
                        <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                            Admin Panel
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "1rem 0.75rem" }}>
                <div
                    style={{
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "0 0.5rem",
                        marginBottom: "0.5rem",
                    }}
                >
                    Navigation
                </div>
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.625rem",
                                padding: "0.625rem 0.75rem",
                                borderRadius: "0.5rem",
                                marginBottom: "0.125rem",
                                textDecoration: "none",
                                background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                                fontWeight: isActive ? 600 : 400,
                                fontSize: "0.875rem",
                                transition: "all 0.15s",
                                border: isActive
                                    ? "0.0625rem solid rgba(99,102,241,0.2)"
                                    : "0.0625rem solid transparent",
                            }}
                        >
                            <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div
                style={{
                    padding: "1rem 0.75rem",
                    borderTop: "0.0625rem solid var(--border)",
                }}
            >
                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        width: "100%",
                        padding: "0.625rem 0.75rem",
                        borderRadius: "0.5rem",
                        background: "transparent",
                        border: "0.0625rem solid transparent",
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                        e.currentTarget.style.color = "var(--danger)";
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-muted)";
                        e.currentTarget.style.borderColor = "transparent";
                    }}
                >
                    <span>🚪</span> Logout
                </button>
            </div>
        </aside>
    );
}
