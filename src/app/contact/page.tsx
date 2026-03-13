"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ContactPage() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)" }}>
            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 48px",
                    height: 72,
                    borderBottom: "1px solid var(--border-color)",
                    background: "var(--background)",
                }}
            >
                <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>ChatCV</span>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                    <Link href="/#features" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
                        Features
                    </Link>
                    <Link href="/#faq" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
                        FAQ
                    </Link>
                    <ThemeToggle />
                </div>
            </nav>
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 24 }}>Contact Us</h1>
                <p style={{ fontSize: "1.125rem", color: "var(--muted)", marginBottom: 40, lineHeight: 1.6 }}>
                    Have questions, feedback, or need support? We&apos;re here to help you get the most out of ChatCV. 
                    Reach out to us and we&apos;ll get back to you as soon as possible.
                </p>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 32 }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 16 }}>Email Support</h2>
                    <p style={{ fontSize: "1rem", color: "var(--muted)", marginBottom: 16 }}>
                        You can email us directly at:
                    </p>
                    <a href="mailto:adees.shirinbekk@gmail.com" style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}>
                        adees.shirinbekk@gmail.com
                    </a>
                </div>
            </div>
            
            <footer
                style={{
                    borderTop: "1px solid var(--border-color)",
                    padding: "32px 48px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "var(--muted)",
                    fontSize: "0.875rem",
                    marginTop: "auto"
                }}
            >
                <div>© {new Date().getFullYear()} ChatCV. All rights reserved.</div>
                <div style={{ display: "flex", gap: 24 }}>
                    <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-foreground">
                        Privacy
                    </Link>
                    <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-foreground">
                        Terms
                    </Link>
                    <Link href="/contact" style={{ color: "var(--foreground)", textDecoration: "none", transition: "color 0.2s" }}>
                        Contact
                    </Link>
                </div>
            </footer>
        </div>
    );
}
