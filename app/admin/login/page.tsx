"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid password. Please try again.");
            setLoading(false);
        } else {
            router.push("/admin");
        }
    }

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-primary)",
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background glow effects */}
            <div
                style={{
                    position: "absolute",
                    top: "20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "37.5rem",
                    height: "37.5rem",
                    background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    width: "100%",
                    maxWidth: "25rem",
                    position: "relative",
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div
                        style={{
                            width: "4rem",
                            height: "4rem",
                            background: "var(--accent)",
                            borderRadius: "1.125rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                            margin: "0 auto 1rem",
                            boxShadow: "0 0 2.5rem var(--accent-glow)",
                        }}
                    >
                        ⚓
                    </div>
                    <h1
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: "0.375rem",
                        }}
                    >
                        Anchor Point
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        Admin access only — enter your password
                    </p>
                </div>

                {/* Login Card */}
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "0.0625rem solid var(--border)",
                        borderRadius: "1rem",
                        padding: "2rem",
                        boxShadow: "0 1.5rem 4rem rgba(0,0,0,0.4)",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label className="label">Admin Password</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Enter password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoFocus
                                style={{ fontSize: "1rem" }}
                            />
                        </div>

                        {error && (
                            <div
                                style={{
                                    background: "rgba(239,68,68,0.08)",
                                    border: "0.0625rem solid rgba(239,68,68,0.25)",
                                    borderRadius: "0.5rem",
                                    padding: "0.625rem 0.875rem",
                                    color: "var(--danger)",
                                    fontSize: "0.8125rem",
                                    marginBottom: "1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                }}
                            >
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                padding: "0.75rem",
                                fontSize: "0.9375rem",
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? (
                                <>
                                    <span
                                        style={{
                                            width: "1rem",
                                            height: "1rem",
                                            border: "0.125rem solid rgba(255,255,255,0.3)",
                                            borderTopColor: "#fff",
                                            borderRadius: "50%",
                                            display: "inline-block",
                                            animation: "spin 0.8s linear infinite",
                                        }}
                                    />
                                    Authenticating...
                                    sync</>
                            ) : (
                                "→ Sign In"
                            )}
                        </button>
                    </form>
                </div>

                <p
                    style={{
                        textAlign: "center",
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        marginTop: "1.5rem",
                    }}
                >
                    Anchor Point • Tracking Link Platform
                </p>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        </div>
    );
}
