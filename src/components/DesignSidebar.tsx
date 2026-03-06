"use client";

import React from "react";
import { useCVStore } from "@/lib/cv-store";
import { TEMPLATES, TemplateId } from "@/lib/cv-templates";

const THEME_COLORS = [
    { name: "Indigo", value: "#6366f1" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Emerald", value: "#10b981" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Slate", value: "#475569" },
    { name: "Neutral", value: "#171717" },
];

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 24, width: "100%" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", marginBottom: 12 }}>
                {title}
            </div>
            {children}
        </div>
    );
}

export default function DesignSidebar() {
    const { state, dispatch } = useCVStore();
    const current = state.templateId;
    const layout = state.cvData.layout || {};
    const currentColor = layout.themeColor;
    const spacing = layout.documentSpacing || "normal";
    const fontSize = layout.fontSize || "normal";

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: "24px 20px",
                borderLeft: "1px solid var(--border-color)",
                overflowY: "auto",
                height: "100%",
                background: "var(--background)",
                scrollbarWidth: "none",
            }}
        >
            <div style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 24, color: "var(--foreground)" }}>
                Design Settings
            </div>

            {/* Layout Controls */}
            <SidebarSection title="Layout">
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--foreground)", marginBottom: 8, fontWeight: 500 }}>Font Size</div>
                        <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--border-color)", borderRadius: 8, overflow: "hidden" }}>
                            {(["small", "normal", "large"] as const).map(size => (
                                <button
                                    key={size}
                                    onClick={() => dispatch({ type: "SET_FONT_SIZE", payload: size })}
                                    style={{
                                        flex: 1, padding: "6px 0", fontSize: "0.8125rem", border: "none", cursor: "pointer", transition: "all 0.2s",
                                        background: fontSize === size ? "var(--color-primary)" : "transparent",
                                        color: fontSize === size ? "white" : "var(--muted)",
                                        fontWeight: fontSize === size ? 600 : 400,
                                    }}
                                >
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--foreground)", marginBottom: 8, fontWeight: 500 }}>Spacing</div>
                        <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--border-color)", borderRadius: 8, overflow: "hidden" }}>
                            {(["tight", "normal", "relaxed"] as const).map(sp => (
                                <button
                                    key={sp}
                                    onClick={() => dispatch({ type: "SET_SPACING", payload: sp })}
                                    style={{
                                        flex: 1, padding: "6px 0", fontSize: "0.8125rem", border: "none", cursor: "pointer", transition: "all 0.2s",
                                        background: spacing === sp ? "var(--color-primary)" : "transparent",
                                        color: spacing === sp ? "white" : "var(--muted)",
                                        fontWeight: spacing === sp ? 600 : 400,
                                    }}
                                >
                                    {sp.charAt(0).toUpperCase() + sp.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </SidebarSection>

            {/* Color Controls */}
            <SidebarSection title="Accent Color">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {THEME_COLORS.map((color) => {
                        const isActive = currentColor === color.value;
                        return (
                            <button
                                key={color.value}
                                onClick={() => dispatch({ type: "SET_THEME_COLOR", payload: color.value })}
                                title={color.name}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: color.value,
                                    border: isActive ? `2px solid var(--foreground)` : "2px solid transparent",
                                    outline: isActive ? `2px solid var(--background)` : "none",
                                    outlineOffset: -4,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    padding: 0,
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            />
                        );
                    })}
                    <button
                        onClick={() => dispatch({ type: "SET_THEME_COLOR", payload: "" })}
                        title="Template Default"
                        style={{
                            padding: "0 12px",
                            height: 32,
                            fontSize: "0.75rem",
                            color: !currentColor ? "var(--foreground)" : "var(--muted)",
                            background: "transparent",
                            border: "1px solid var(--border-color)",
                            borderRadius: 16,
                            cursor: "pointer",
                            fontWeight: !currentColor ? 600 : 400,
                        }}
                    >
                        Default
                    </button>
                </div>
            </SidebarSection>

            {/* Template Controls */}
            <SidebarSection title="Templates">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {TEMPLATES.map((tpl) => {
                        const isActive = current === tpl.id;
                        return (
                            <button
                                key={tpl.id}
                                onClick={() => dispatch({ type: "SET_TEMPLATE", payload: tpl.id as TemplateId })}
                                title={tpl.description}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "10px",
                                    borderRadius: 12,
                                    border: isActive ? `2px solid ${currentColor || tpl.accentColor}` : "2px solid transparent",
                                    background: isActive ? `${currentColor || tpl.accentColor}14` : "var(--surface)",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    outline: "none",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        aspectRatio: "1/1.3",
                                        borderRadius: 6,
                                        background: tpl.swatch,
                                        boxShadow: isActive ? `0 4px 12px ${currentColor || tpl.accentColor}44` : "0 1px 4px rgba(0,0,0,0.08)",
                                        position: "relative",
                                        overflow: "hidden",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        transform: isActive ? "scale(1.04)" : "scale(1)",
                                    }}
                                >
                                    <div style={{ position: "absolute", inset: '10%', display: "flex", flexDirection: "column", gap: 3 }}>
                                        <div style={{ height: 6, background: "rgba(255,255,255,0.7)", borderRadius: 2 }} />
                                        <div style={{ height: 4, background: "rgba(255,255,255,0.45)", borderRadius: 2, width: "70%" }} />
                                        <div style={{ marginTop: 4, height: 3, background: "rgba(255,255,255,0.35)", borderRadius: 1.5 }} />
                                        <div style={{ height: 3, background: "rgba(255,255,255,0.35)", borderRadius: 1.5, width: "80%" }} />
                                        <div style={{ height: 3, background: "rgba(255,255,255,0.25)", borderRadius: 1.5, width: "60%" }} />
                                    </div>
                                </div>
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: isActive ? 700 : 500,
                                        color: isActive ? (currentColor || tpl.accentColor) : "var(--muted)",
                                    }}
                                >
                                    {tpl.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </SidebarSection>

            <div style={{ height: 40 }} /> {/* Bottom padding */}
        </div>
    );
}
