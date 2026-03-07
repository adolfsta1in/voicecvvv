"use client";

import { CVData } from "./cv-types";

export async function exportToPDF(cvData: CVData) {
    if (typeof window === "undefined") return;

    try {
        // Dynamically import html2pdf to avoid SSR issues
        const html2pdf = (await import("html2pdf.js")).default;

        const element = document.getElementById("cv-preview-content");
        if (!element) {
            alert("No CV content found. Please make sure your CV has some content before exporting.");
            return;
        }

        const fileName = cvData.personalInfo?.fullName
            ? `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`
            : "CV.pdf";

        // Clone the element so we can style it for PDF without affecting the page
        const clone = element.cloneNode(true) as HTMLElement;

        // Remove any UI overlays (page break indicators, edit hints etc.)
        clone.querySelectorAll(".hide-on-print").forEach(el => el.remove());

        // Force white background and black text for the PDF
        clone.style.background = "#ffffff";
        clone.style.color = "#000000";
        clone.style.boxShadow = "none";
        clone.style.border = "none";
        clone.style.borderRadius = "0";

        const opt = {
            margin: 0,
            filename: fileName,
            image: { type: "jpeg" as const, quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                backgroundColor: "#ffffff",
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait" as const,
            },
        };

        await html2pdf().set(opt).from(clone).save();

    } catch (error) {
        console.error("Error exporting PDF:", error);
        alert("Failed to generate PDF. Please try again.");
    }
}
