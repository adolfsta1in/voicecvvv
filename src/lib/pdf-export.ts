"use client";

import { CVData } from "./cv-types";

export async function exportToPDF(cvData: CVData) {
    if (typeof window === "undefined") return;

    try {
        // We capture the entire document HTML so stylesheets are included
        const html = document.documentElement.outerHTML;
        const origin = window.location.origin;

        const response = await fetch('/api/pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ html, origin }),
        });

        if (!response.ok) {
            throw new Error(`PDF generation failed: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Create an invisible <a> tag to trigger the automatic file download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        const fileName = cvData.personalInfo?.fullName
            ? `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`
            : "CV.pdf";

        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);

    } catch (error) {
        console.error("Error exporting PDF via server API:", error);
        alert("Failed to generate PDF. Please try again.");
    }
}
