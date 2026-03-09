"use client";

import { useState, Suspense } from "react";
import { login, signup } from "./actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
    const [isLogin, setIsLogin] = useState(true);
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const from = searchParams.get("from");

    // Auto-select signup if coming from export
    useState(() => {
        if (from === "export") {
            setIsLogin(false);
        }
    });

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--background)",
                padding: "20px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 400,
                    background: "var(--surface)",
                    padding: "40px",
                    borderRadius: 24,
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            margin: "0 auto 16px",
                        }}
                    >
                        ✨
                    </div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 8px 0" }}>
                        {isLogin ? "Welcome back" : "Create your account"}
                    </h1>
                    <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.9375rem" }}>
                        {from === "export"
                            ? "Create a free account to download your CV"
                            : isLogin
                                ? "Sign in to access your CV workspace"
                                : "Start building your resume with AI"}
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            padding: "12px 16px",
                            background: "#fee2e2",
                            color: "#991b1b",
                            borderRadius: 8,
                            fontSize: "0.875rem",
                            marginBottom: 24,
                            border: "1px solid #fca5a5",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form action={isLogin ? login : signup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label
                            htmlFor="email"
                            style={{
                                display: "block",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                color: "var(--foreground)",
                                marginBottom: 8,
                            }}
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: 12,
                                border: "1px solid var(--border-color)",
                                background: "var(--background)",
                                color: "var(--foreground)",
                                fontSize: "0.9375rem",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            style={{
                                display: "block",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                color: "var(--foreground)",
                                marginBottom: 8,
                            }}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: 12,
                                border: "1px solid var(--border-color)",
                                background: "var(--background)",
                                color: "var(--foreground)",
                                fontSize: "0.9375rem",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: 8,
                            width: "100%",
                            padding: "12px",
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                            color: "white",
                            border: "none",
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                            cursor: "pointer",
                            transition: "opacity 0.2s",
                        }}
                    >
                        {isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                <div style={{ marginTop: 24, textAlign: "center", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--muted)" }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#6366f1",
                            fontWeight: 600,
                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </div>

                <div style={{ marginTop: 24, textAlign: "center" }}>
                    <Link href="/" style={{ color: "var(--muted)", fontSize: "0.875rem", textDecoration: "none" }}>
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
