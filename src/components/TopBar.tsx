"use client";

import React from "react";
import { useCVStore } from "@/lib/cv-store";
import { exportToPDF } from "@/lib/pdf-export";
import Link from "next/link";
import { logout } from "@/app/login/actions";

export default function TopBar() {
    const { state } = useCVStore();
    const cv = state.cvData;

    // Calculate completion percentage
    const sections = [
        cv.personalInfo.fullName,
        cv.personalInfo.email,
        cv.summary,
        cv.experience.length > 0,
        cv.education.length > 0,
        cv.skills.length > 0,
    ];
    const filled = sections.filter(Boolean).length;
    const progress = Math.round((filled / sections.length) * 100);

    async function handleExport() {
        await exportToPDF(cv);
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                height: 60,
                borderBottom: "1px solid var(--border-color)",
                background: "var(--background)",
                flexShrink: 0,
            }}
        >
            {/* Left */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                            fontSize: "14px",
                            color: "white",
                            fontWeight: 800,
                        }}
                    >
                        V
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>VoiceCV</span>
                </Link>
            </div>

            {/* Center - Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                    style={{
                        fontSize: "0.8125rem",
                        color: "var(--muted)",
                        fontWeight: 500,
                    }}
                >
                    Completion
                </span>
                <div
                    style={{
                        width: 120,
                        height: 6,
                        background: "var(--surface)",
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #6366f1, #818cf8)",
                            borderRadius: 3,
                            transition: "width 0.5s ease",
                        }}
                    />
                </div>
                <span
                    style={{
                        fontSize: "0.75rem",
                        color: "var(--color-primary)",
                        fontWeight: 700,
                    }}
                >
                    {progress}%
                </span>
            </div>

            {/* Right */}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
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
                <button
                    onClick={handleExport}
                    disabled={!cv.personalInfo.fullName}
                    className="btn-primary"
                    style={{
                        padding: "8px 20px",
                        fontSize: "0.8125rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        opacity: cv.personalInfo.fullName ? 1 : 0.5,
                    }}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export PDF
                </button>
            </div>
        </div>
    );
}
