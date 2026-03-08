"use client";

import { CVData } from "./cv-types";

// Keep track of ongoing export to prevent multiple clicks
let isExporting = false;

export async function exportToPDF(cvData: CVData) {
    if (typeof window === "undefined" || isExporting) return;

    const element = document.getElementById("cv-preview-content");
    if (!element) {
        alert("No CV content found. Please make sure your CV has some content before exporting.");
        return;
    }

    try {
        isExporting = true;

        // Let the user know it's starting (this could be a toast in a fuller implementation)
        console.log("Starting secure server-side PDF generation...");

        // Grab current theme to ensure the PDF renders in the same mode (light/dark)
        const isDarkMode = document.documentElement.classList.contains("dark");
        const theme = isDarkMode ? "dark" : "light";

        // Calculate current zoom level of the CV preview if needed,
        // but for a 1:1 server render, we usually just want to render at scale 1.

        const response = await fetch("/api/export-pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cvData,
                zoom: 1,
                theme
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to generate PDF on the server.");
        }

        // The response is a binary PDF Blob
        const blob = await response.blob();

        // Create an invisible anchor tag to trigger the browser download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const fileName = cvData.personalInfo?.fullName
            ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`
            : "CV.pdf";

        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log("PDF downloaded successfully!");

    } catch (error) {
        console.error("PDF export error:", error);
        alert("Failed to generate PDF: " + (error instanceof Error ? error.message : String(error)));
    } finally {
        isExporting = false;
    }
}
