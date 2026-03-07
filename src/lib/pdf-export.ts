"use client";

import { CVData } from "./cv-types";

export async function exportToPDF(cvData: CVData) {
    if (typeof window === "undefined") return;

    try {
        // Dynamically import html2pdf to avoid SSR issues during build
        // @ts-ignore
        const html2pdfModule = await import("html2pdf.js");
        const html2pdf: any = html2pdfModule.default ? html2pdfModule.default : html2pdfModule;

        // The container holding the CV in the UI
        const element = document.getElementById("cv-preview-content");
        if (!element) {
            throw new Error("Could not find CV content container");
        }

        // Add a temporary class to fix some styles during PDF generation if needed
        element.classList.add("exporting-pdf");

        const fileName = cvData.personalInfo?.fullName
            ? `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`
            : "CV.pdf";

        const opt = {
            margin: 0,
            filename: fileName,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
        };

        await html2pdf().set(opt).from(element).save();

        // Cleanup
        element.classList.remove("exporting-pdf");

    } catch (error) {
        console.error("Error exporting PDF via html2pdf:", error);
        alert("Failed to generate PDF. Please try again.");
    }
}
