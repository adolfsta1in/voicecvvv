"use client";

import { CVData } from "./cv-types";
import { TemplateId } from "./cv-templates";

// Keep track of ongoing export to prevent multiple clicks
let isExporting = false;

/**
 * Exports the CV to PDF using the new server-side headless browser pipeline.
 * This guarantees a consistent, pixel-perfect A4 representation.
 */
export async function exportToPDF(cvData: CVData, templateId: TemplateId) {
    if (typeof window === "undefined" || isExporting) return;

    try {
        isExporting = true;

        // Broadcast custom event so the TopBar can show a loading state
        window.dispatchEvent(new CustomEvent("pdf-export-start"));

        const response = await fetch('/api/pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cvData, templateId })
        });

        if (!response.ok) {
            throw new Error(`Failed to generate PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        const name = cvData.personalInfo?.fullName
            ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`
            : "VoiceCV_Export.pdf";

        a.download = name;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

    } catch (error) {
        console.error("PDF export error:", error);
        alert("Failed to generate PDF: " + (error instanceof Error ? error.message : String(error)));
    } finally {
        isExporting = false;
        window.dispatchEvent(new CustomEvent("pdf-export-end"));
    }
}
