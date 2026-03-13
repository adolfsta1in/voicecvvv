"use client";

import React, { useState } from "react";
import { useCVStore } from "@/lib/cv-store";
import { exportToPDF } from "@/lib/pdf-export";
import { saveCV } from "@/lib/cv-api";
import { createClient } from "@/lib/supabase/client";
import { getUserSubscription, decrementExportCredit } from "@/lib/subscription-api";
import Link from "next/link";
import { logout } from "@/app/login/actions";
import PricingModal from "./PricingModal";
import { ThemeToggle } from "./ThemeToggle";

export default function TopBar() {
    const { state, dispatch } = useCVStore();
    const cv = state.cvData;
    const templateId = state.templateId;
    const cvId = state.cvId;
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "autosaving" | "autosaved" | "error">("idle");
    const [showPricing, setShowPricing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportCredits, setExportCredits] = useState(0);
    const [isPro, setIsPro] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    React.useEffect(() => {
        async function loadSub() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const sub = await getUserSubscription();
                if (sub) {
                    setExportCredits(sub.export_credits);
                    setIsPro(sub.plan === 'pro');
                }

                // Handle pending checkout after signup/login
                const pendingCheckout = localStorage.getItem("chatcv_pending_checkout");
                if (pendingCheckout) {
                    localStorage.removeItem("chatcv_pending_checkout");

                    if (pendingCheckout === "single") {
                        // TODO: Replace with your actual Lemon Squeezy single CV checkout link
                        const singleCheckoutUrl = "";
                        if (singleCheckoutUrl) {
                            window.location.href = `${singleCheckoutUrl}?checkout[custom][user_id]=${user.id}`;
                        } else {
                            console.warn("Single checkout link not configured");
                        }
                    } else if (pendingCheckout === "pro") {
                        // TODO: Replace with your actual Lemon Squeezy pro subscription checkout link
                        const proCheckoutUrl = "";
                        if (proCheckoutUrl) {
                            window.location.href = `${proCheckoutUrl}&checkout[custom][user_id]=${user.id}`;
                        } else {
                            console.warn("Pro checkout link not configured");
                        }
                    }
                }
            }
        }
        loadSub();
    }, []);

    React.useEffect(() => {
        const start = () => setIsExporting(true);
        const end = () => setIsExporting(false);
        window.addEventListener("pdf-export-start", start);
        window.addEventListener("pdf-export-end", end);
        return () => {
            window.removeEventListener("pdf-export-start", start);
            window.removeEventListener("pdf-export-end", end);
        };
    }, []);

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

    const handleExportClick = async () => {
        if (exportCredits <= 0) {
            setShowPricing(true);
        } else {
            await handleExport();
        }
    };

    const handleExport = async () => {
        try {
            await exportToPDF(cv, templateId);
            // Deduct local state
            setExportCredits(prev => prev - 1);
            // Deduct from DB
            await decrementExportCredit();
        } catch (error) {
            console.error("Export failed", error);
        }
    };



    const handleSave = React.useCallback(async (isAuto = false) => {
        if (!cv.personalInfo.fullName) return;
        setSaveStatus(isAuto ? "autosaving" : "saving");
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setSaveStatus("error"); return; }
            const name = cv.personalInfo.fullName
                ? `${cv.personalInfo.fullName}'s CV`
                : "My CV";

            const contentToSave = { ...cv, templateId };
            const result = await saveCV(user.id, name, contentToSave, cvId || undefined);

            if (result) {
                setSaveStatus(isAuto ? "autosaved" : "saved");
                if (!cvId) {
                    dispatch({ type: "SET_CV_ID", payload: result.id });
                }
            } else {
                setSaveStatus("error");
            }
        } catch {
            setSaveStatus("error");
        } finally {
            setTimeout(() => setSaveStatus("idle"), 2500);
        }
    }, [cv, templateId, cvId, dispatch]);

    // Auto-save effect
    React.useEffect(() => {
        if (!cv.personalInfo.fullName) return;

        const timeoutId = setTimeout(() => {
            handleSave(true);
        }, 3000); // Auto-save 3 seconds after the last change

        return () => clearTimeout(timeoutId);
    }, [cv, templateId, handleSave]);

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
                    <span style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>ChatCV</span>
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
                        color: "#6366f1",
                        fontWeight: 700,
                    }}
                >
                    {progress}%
                </span>
            </div>

            {/* Right */}
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <ThemeToggle />
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
                    href="/account"
                    style={{
                        background: "none",
                        border: "none",
                        color: "var(--muted)",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    My CVs
                </Link>
                <button
                    onClick={() => handleSave(false)}
                    disabled={!cv.personalInfo.fullName || saveStatus === "saving" || saveStatus === "autosaving"}
                    style={{
                        padding: "7px 16px",
                        borderRadius: 9,
                        border: "1px solid var(--border-color)",
                        background:
                            saveStatus === "saved" || saveStatus === "autosaved"
                                ? "#10b981"
                                : saveStatus === "error"
                                    ? "#ef4444"
                                    : "var(--surface)",
                        color:
                            saveStatus === "idle" || saveStatus === "saving" || saveStatus === "autosaving"
                                ? "var(--foreground)"
                                : "white",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: cv.personalInfo.fullName ? "pointer" : "default",
                        opacity: cv.personalInfo.fullName ? 1 : 0.45,
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    {saveStatus === "saving" ? "Saving..." :
                        saveStatus === "autosaving" ? "Auto-saving..." :
                            saveStatus === "saved" ? "✓ Saved" :
                                saveStatus === "autosaved" ? "✓ Auto-saved" :
                                    saveStatus === "error" ? "Error" : "Save CV"}
                </button>
                {userId ? (
                    <button
                        onClick={() => {
                            dispatch({ type: "RESET_CV" });
                            localStorage.removeItem("chatcv_draft_state");
                            logout();
                        }}
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
                ) : (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Link
                            href="/login"
                            style={{
                                color: "var(--foreground)",
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                textDecoration: "none"
                            }}
                        >
                            Log In
                        </Link>
                        <Link
                            href="/login"
                            style={{
                                padding: "6px 14px",
                                borderRadius: "8px",
                                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                                color: "white",
                                fontSize: "0.8125rem",
                                fontWeight: 600,
                                textDecoration: "none",
                            }}
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
                <button
                    onClick={handleExportClick}
                    disabled={!cv.personalInfo.fullName || isExporting}
                    className="btn-primary"
                    style={{
                        padding: "8px 20px",
                        fontSize: "0.8125rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        opacity: cv.personalInfo.fullName && !isExporting ? 1 : 0.5,
                        cursor: isExporting ? "wait" : "pointer"
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
                    {isExporting ? "Generating PDF..." : "Download CV"}
                </button>
            </div>

            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} userId={userId} />
        </div>
    );
}
