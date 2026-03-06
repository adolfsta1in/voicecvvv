"use client";

import React, { useCallback } from "react";
import { useCVStore } from "@/lib/cv-store";
import { applyPatch } from "@/lib/cv-patch";

// Template imports
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import SidebarTemplate from "@/components/templates/SidebarTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";
import CompactTemplate from "@/components/templates/CompactTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import ElegantTemplate from "@/components/templates/ElegantTemplate";
import TechTemplate from "@/components/templates/TechTemplate";

export default function CVPreview() {
    const { state, dispatch } = useCVStore();
    const cv = state.cvData;
    const templateId = state.templateId;
    const layoutInfo = state.cvData.layout || {};
    const fontSize = layoutInfo.fontSize || "normal";
    const spacing = layoutInfo.documentSpacing || "normal";

    const fontScale = fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px";
    const spaceScale = spacing === "tight" ? 0.85 : spacing === "relaxed" ? 1.25 : 1;

    const hasAnyContent =
        cv.personalInfo.fullName ||
        cv.summary ||
        cv.experience.length > 0 ||
        cv.education.length > 0 ||
        cv.skills.length > 0;

    const handleFieldChange = useCallback(
        (path: string, value: string) => {
            const patch = applyPatch(cv, path, value);
            if (Object.keys(patch).length > 0) {
                dispatch({ type: "UPDATE_CV", payload: patch });
            }
        },
        [cv, dispatch],
    );

    function renderTemplate() {
        const props = { cv, onFieldChange: handleFieldChange };
        switch (templateId) {
            case "minimal": return <MinimalTemplate {...props} />;
            case "sidebar": return <SidebarTemplate {...props} />;
            case "executive": return <ExecutiveTemplate {...props} />;
            case "creative": return <CreativeTemplate {...props} />;
            case "compact": return <CompactTemplate {...props} />;
            case "modern": return <ModernTemplate {...props} />;
            case "professional": return <ProfessionalTemplate {...props} />;
            case "elegant": return <ElegantTemplate {...props} />;
            case "tech": return <TechTemplate {...props} />;
            case "classic":
            default: return <ClassicTemplate {...props} />;
        }
    }

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <style>{`
                #cv-preview-content {
                    font-size: ${fontScale} !important;
                }
                #cv-preview-content * {
                    line-height: calc(1.6 * ${spaceScale}) !important;
                }
            `}</style>

            {/* Edit hint bar */}
            {hasAnyContent && (
                <div
                    className="hide-on-print"
                    style={{
                        padding: "5px 16px",
                        background: "var(--surface)",
                        borderBottom: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                        Click any text in the document to edit it directly
                    </span>
                </div>
            )}

            {/* Scrollable CV area */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "24px 24px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                }}
            >
                {!hasAnyContent ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            minHeight: 500,
                            textAlign: "center",
                            color: "#94a3b8",
                        }}
                    >
                        <div style={{ fontSize: "3rem", marginBottom: 16 }}>📄</div>
                        <div style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 8, color: "#64748b" }}>
                            Your CV will appear here
                        </div>
                        <div style={{ fontSize: "0.875rem", maxWidth: 300, lineHeight: 1.6 }}>
                            Start chatting with the AI assistant on the left. As you answer questions, your resume will build itself in real time.
                        </div>
                    </div>
                ) : (
                    <div
                        id="cv-preview-content"
                        className="cv-document animate-fade-in"
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            width: "794px",
                            minHeight: "1123px",
                            padding: templateId === "sidebar" || templateId === "executive" || templateId === "creative" ? 0 : "48px 56px",
                            borderRadius: 8,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 30px rgba(0,0,0,0.06)",
                            border: "1px solid #e5e7eb",
                            flexShrink: 0,
                            overflow: "hidden", // clip the page break overlay
                        }}
                    >
                        {/* Page break indicators */}
                        <div
                            className="hide-on-print"
                            style={{
                                position: "absolute",
                                top: 0, left: 0, right: 0, bottom: 0,
                                zIndex: 100,
                                pointerEvents: "none",
                                backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 1122px, rgba(99, 102, 241, 0.4) 1122px, rgba(99, 102, 241, 0.4) 1123px)",
                            }}
                        />
                        {/* A small "Page Break" label that repeats every 1123px */}
                        <div
                            className="hide-on-print"
                            style={{
                                position: "absolute",
                                top: 0, left: 0, right: 0, bottom: 0,
                                zIndex: 100,
                                pointerEvents: "none",
                                backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 1110px, rgba(99, 102, 241, 0.1) 1110px, rgba(99, 102, 241, 0.1) 1122px)",
                                backgroundSize: "100% 1123px",
                            }}
                        />

                        {renderTemplate()}
                    </div>
                )}
            </div>
        </div>
    );
}
