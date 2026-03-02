"use client";

import { useState } from "react";
import AdminSessionProvider from "@/app/admin/SessionProvider";
import Sidebar from "@/app/admin/components/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <AdminSessionProvider>
            <div className="admin-layout">
                {/* Mobile Header */}
                <header className="mobile-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div style={{ fontSize: "1.25rem" }}>⚓</div>
                        <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>Anchor Point</div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-primary)",
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            padding: "0.25rem"
                        }}
                    >
                        ☰
                    </button>
                </header>

                {/* Sidebar Overlay */}
                <div
                    className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
                    onClick={() => setIsSidebarOpen(false)}
                />

                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="admin-main">
                    {children}
                </main>
            </div>
        </AdminSessionProvider>
    );
}
