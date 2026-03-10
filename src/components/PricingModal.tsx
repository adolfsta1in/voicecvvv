"use client";

import React from "react";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string | null;
}

import { useRouter } from "next/navigation";

export default function PricingModal({ isOpen, onClose, userId }: PricingModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
        }}>
            <div
                className="animate-fade-in-up"
                style={{
                    background: "var(--background)",
                    borderRadius: "20px",
                    width: "90%",
                    maxWidth: "800px",
                    padding: "40px",
                    position: "relative",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    border: "1px solid var(--border-color)"
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--muted)",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        transition: "background 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "var(--surface)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "none"}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "12px", background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Export Your Professional CV
                    </h2>
                    <p style={{ color: "var(--muted)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>
                        You've built a great CV. Choose a plan to download your high-quality PDF and land your dream job.
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    {/* Single CV Plan */}
                    <div style={{
                        padding: "32px",
                        borderRadius: "16px",
                        border: "1px solid var(--border-color)",
                        background: "var(--surface)",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{ marginBottom: "24px" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>Single CV</h3>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                                <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>$4.99</span>
                                <span style={{ color: "var(--muted)", fontWeight: 500 }}>once</span>
                            </div>
                            <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.9375rem" }}>
                                Perfect if you just need one polished resume right now.
                            </p>
                        </div>

                        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", flex: 1 }}>
                            {[
                                "1 PDF Export",
                                "High-quality download",
                                "No watermarks",
                                "Keep your data forever"
                            ].map((feature, i) => (
                                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", fontSize: "0.9375rem" }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            className="btn-secondary"
                            style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
                            onClick={() => {
                                if (!userId) {
                                    localStorage.setItem("chatcv_pending_checkout", "single");
                                    router.push("/login?from=export");
                                    return;
                                }
                                // TODO: Replace with your actual Lemon Squeezy single CV checkout link
                                const singleCheckoutUrl = "https://voicecvai.lemonsqueezy.com/checkout/buy/YOUR_SINGLE_VARIANT_ID";
                                window.open(`${singleCheckoutUrl}?checkout[custom][user_id]=${userId}`, "_blank");
                            }}
                        >
                            Buy Single CV
                        </button>
                    </div>

                    {/* Pro Subscription Plan */}
                    <div style={{
                        padding: "32px",
                        borderRadius: "16px",
                        border: "2px solid var(--color-primary)",
                        background: "linear-gradient(to bottom, rgba(99, 102, 241, 0.05), transparent)",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative"
                    }}>
                        <div style={{
                            position: "absolute",
                            top: "-12px",
                            right: "24px",
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                            color: "white",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase"
                        }}>
                            Most Popular
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px", color: "var(--color-primary)" }}>Pro Plan</h3>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                                <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>$9.99</span>
                                <span style={{ color: "var(--muted)", fontWeight: 500 }}>/month</span>
                            </div>
                            <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "0.9375rem" }}>
                                For job seekers applying to multiple roles. Cancel anytime.
                            </p>
                        </div>

                        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", flex: 1 }}>
                            {[
                                "Up to 10 PDF Exports per month",
                                "Tailor CVs for different jobs",
                                "High-quality downloads",
                                "No watermarks",
                                "Priority support"
                            ].map((feature, i) => (
                                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", fontSize: "0.9375rem", fontWeight: i === 0 ? 600 : 400 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            className="btn-primary"
                            style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
                            onClick={() => {
                                if (!userId) {
                                    localStorage.setItem("chatcv_pending_checkout", "pro");
                                    router.push("/login?from=export");
                                    return;
                                }
                                // TODO: Replace with your actual Lemon Squeezy pro subscription checkout link
                                const proCheckoutUrl = "";
                                if (proCheckoutUrl) {
                                    window.open(`${proCheckoutUrl}&checkout[custom][user_id]=${userId}`, "_blank");
                                } else {
                                    alert("Pro checkout link not configured yet.");
                                }
                            }}
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
