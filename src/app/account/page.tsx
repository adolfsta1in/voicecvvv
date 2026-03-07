"use client";

import React, { useEffect, useState } from "react";
import { getUserCVs, deleteCV, renameCV, CVDbRecord } from "@/lib/cv-api";
import { exportToPDF } from "@/lib/pdf-export";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { logout } from "@/app/login/actions";

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function AccountPage() {
    const [cvs, setCvs] = useState<CVDbRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // MOCK: Replace with actual database check
    const isPro = true;

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) setUserEmail(user.email);
            const data = await getUserCVs();
            setCvs(data);
            setLoading(false);
        }
        load();
    }, []);

    async function handleDelete(id: string) {
        setDeletingId(id);
        const ok = await deleteCV(id);
        if (ok) setCvs((prev) => prev.filter((c) => c.id !== id));
        setDeletingId(null);
    }

    async function handleRename(id: string) {
        if (!renameValue.trim()) return;
        const ok = await renameCV(id, renameValue.trim());
        if (ok) {
            setCvs((prev) =>
                prev.map((c) => (c.id === id ? { ...c, name: renameValue.trim() } : c))
            );
        }
        setRenamingId(null);
        setRenameValue("");
    }

    function startRename(cv: CVDbRecord) {
        setRenamingId(cv.id);
        setRenameValue(cv.name);
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            {/* TopBar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 32px",
                    height: 60,
                    borderBottom: "1px solid var(--border-color)",
                    background: "var(--background)",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            color: "white",
                            fontSize: 14,
                        }}
                    >
                        V
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>VoiceCV</span>
                </Link>

                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    {isPro && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                                border: "1px solid #fcd34d",
                                color: "#b45309",
                                padding: "4px 10px",
                                borderRadius: "100px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.15)",
                            }}
                            title="Pro Subscriber"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
                            </svg>
                            PRO
                        </div>
                    )}
                    <Link
                        href="/app"
                        style={{
                            padding: "8px 20px",
                            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                            color: "white",
                            borderRadius: 10,
                            fontWeight: 600,
                            fontSize: "0.8125rem",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New CV
                    </Link>
                    <button
                        onClick={() => logout()}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--muted)",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            cursor: "pointer",
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 32px" }}>
                {/* Header */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                        <div
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: "1.125rem",
                                color: "white",
                                flexShrink: 0,
                            }}
                        >
                            {userEmail ? getInitials(userEmail.split("@")[0]) : "?"}
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>My CVs</h1>
                            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted)", marginTop: 2 }}>
                                {userEmail}
                            </p>
                        </div>
                    </div>
                    <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9375rem", marginTop: 8 }}>
                        {cvs.length} CV{cvs.length !== 1 ? "s" : ""} saved
                    </p>
                </div>

                {/* Stats strip */}
                {cvs.length > 0 && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 16,
                            marginBottom: 40,
                        }}
                    >
                        {[
                            {
                                label: "Total CVs",
                                value: cvs.length,
                                icon: "📄",
                            },
                            {
                                label: "Last Updated",
                                value: formatDate(cvs[0]?.updated_at ?? ""),
                                icon: "🕒",
                            },
                            {
                                label: "Oldest CV",
                                value: formatDate(cvs[cvs.length - 1]?.created_at ?? ""),
                                icon: "📅",
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                style={{
                                    background: "var(--surface)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: 14,
                                    padding: "20px 24px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                }}
                            >
                                <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
                                <div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 500 }}>
                                        {stat.label}
                                    </div>
                                    <div style={{ fontSize: "1.125rem", fontWeight: 700, marginTop: 2 }}>
                                        {stat.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CV Grid */}
                {loading ? (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: 20,
                        }}
                    >
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                style={{
                                    background: "var(--surface)",
                                    borderRadius: 16,
                                    height: 200,
                                    animation: "pulse-soft 1.5s ease-in-out infinite",
                                    opacity: 0.5,
                                }}
                            />
                        ))}
                    </div>
                ) : cvs.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "80px 20px",
                            border: "2px dashed var(--border-color)",
                            borderRadius: 20,
                        }}
                    >
                        <div style={{ fontSize: "3rem", marginBottom: 16 }}>📋</div>
                        <h2 style={{ fontWeight: 700, fontSize: "1.25rem", margin: "0 0 8px" }}>
                            No CVs yet
                        </h2>
                        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
                            Create your first CV with the AI assistant
                        </p>
                        <Link
                            href="/app"
                            style={{
                                padding: "12px 28px",
                                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                color: "white",
                                borderRadius: 12,
                                fontWeight: 600,
                                textDecoration: "none",
                                fontSize: "0.9375rem",
                            }}
                        >
                            Create my first CV
                        </Link>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: 20,
                        }}
                    >
                        {cvs.map((cv) => {
                            const fullName = cv.content?.personalInfo?.fullName;
                            const title = cv.content?.personalInfo?.title;
                            const skillCount = cv.content?.skills?.length ?? 0;
                            const expCount = cv.content?.experience?.length ?? 0;

                            return (
                                <div
                                    key={cv.id}
                                    className="animate-fade-in-up"
                                    style={{
                                        background: "var(--surface)",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: 16,
                                        padding: 24,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 16,
                                        transition: "box-shadow 0.2s, transform 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                                            "0 8px 32px rgba(99,102,241,0.12)";
                                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                                        (e.currentTarget as HTMLDivElement).style.transform = "none";
                                    }}
                                >
                                    {/* Card header */}
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                        <div
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 10,
                                                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                fontWeight: 700,
                                                fontSize: "1rem",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {fullName ? getInitials(fullName) : "?"}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            {renamingId === cv.id ? (
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleRename(cv.id);
                                                    }}
                                                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                                                >
                                                    <input
                                                        autoFocus
                                                        value={renameValue}
                                                        onChange={(e) => setRenameValue(e.target.value)}
                                                        style={{
                                                            border: "1px solid var(--color-primary)",
                                                            borderRadius: 6,
                                                            padding: "3px 8px",
                                                            fontSize: "0.875rem",
                                                            background: "var(--background)",
                                                            color: "var(--foreground)",
                                                            outline: "none",
                                                            flex: 1,
                                                        }}
                                                    />
                                                    <button
                                                        type="submit"
                                                        style={{
                                                            border: "none",
                                                            background: "var(--color-primary)",
                                                            color: "white",
                                                            borderRadius: 6,
                                                            padding: "4px 8px",
                                                            cursor: "pointer",
                                                            fontSize: "0.75rem",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setRenamingId(null)}
                                                        style={{
                                                            border: "none",
                                                            background: "none",
                                                            color: "var(--muted)",
                                                            cursor: "pointer",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </form>
                                            ) : (
                                                <div
                                                    style={{
                                                        fontWeight: 700,
                                                        fontSize: "0.9375rem",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {cv.name}
                                                </div>
                                            )}
                                            {title && (
                                                <div
                                                    style={{
                                                        fontSize: "0.8125rem",
                                                        color: "var(--muted)",
                                                        marginTop: 2,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {title}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Meta badges */}
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                        {[
                                            { label: `${expCount} job${expCount !== 1 ? "s" : ""}`, color: "#6366f1" },
                                            { label: `${skillCount} skill${skillCount !== 1 ? "s" : ""}`, color: "#10b981" },
                                        ].map((tag) => (
                                            <span
                                                key={tag.label}
                                                style={{
                                                    padding: "3px 10px",
                                                    borderRadius: 20,
                                                    background: tag.color + "15",
                                                    color: tag.color,
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {tag.label}
                                            </span>
                                        ))}
                                        <span
                                            style={{
                                                padding: "3px 10px",
                                                borderRadius: 20,
                                                background: "var(--background)",
                                                color: "var(--muted)",
                                                fontSize: "0.75rem",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {formatDate(cv.updated_at)}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            borderTop: "1px solid var(--border-color)",
                                            paddingTop: 14,
                                        }}
                                    >
                                        <Link
                                            href={`/app?id=${cv.id}`}
                                            style={{
                                                flex: 1.5,
                                                padding: "8px 0",
                                                borderRadius: 9,
                                                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                                color: "white",
                                                textDecoration: "none",
                                                fontSize: "0.8125rem",
                                                fontWeight: 600,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 5,
                                                boxShadow: "0 2px 8px rgba(99, 102, 241, 0.25)",
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                            Open
                                        </Link>
                                        <button
                                            onClick={() => exportToPDF(cv.content)}
                                            style={{
                                                flex: 1,
                                                padding: "8px 0",
                                                borderRadius: 9,
                                                border: "1px solid var(--border-color)",
                                                background: "none",
                                                color: "var(--foreground)",
                                                fontSize: "0.8125rem",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 5,
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={(e) =>
                                            ((e.currentTarget as HTMLButtonElement).style.background =
                                                "var(--surface)")
                                            }
                                            onMouseLeave={(e) =>
                                                ((e.currentTarget as HTMLButtonElement).style.background = "none")
                                            }
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            PDF
                                        </button>
                                        <button
                                            onClick={() => startRename(cv)}
                                            style={{
                                                flex: 1,
                                                padding: "8px 0",
                                                borderRadius: 9,
                                                border: "1px solid var(--border-color)",
                                                background: "none",
                                                color: "var(--foreground)",
                                                fontSize: "0.8125rem",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 5,
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={(e) =>
                                            ((e.currentTarget as HTMLButtonElement).style.background =
                                                "var(--surface)")
                                            }
                                            onMouseLeave={(e) =>
                                                ((e.currentTarget as HTMLButtonElement).style.background = "none")
                                            }
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Rename
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cv.id)}
                                            disabled={deletingId === cv.id}
                                            style={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: 9,
                                                border: "1px solid #fca5a5",
                                                background: "none",
                                                color: "#ef4444",
                                                cursor: deletingId === cv.id ? "wait" : "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                                transition: "background 0.15s",
                                                opacity: deletingId === cv.id ? 0.5 : 1,
                                            }}
                                            onMouseEnter={(e) =>
                                                ((e.currentTarget as HTMLButtonElement).style.background = "#fef2f2")
                                            }
                                            onMouseLeave={(e) =>
                                                ((e.currentTarget as HTMLButtonElement).style.background = "none")
                                            }
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14H6L5 6" />
                                                <path d="M10 11v6M14 11v6" />
                                                <path d="M9 6V4h6v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
