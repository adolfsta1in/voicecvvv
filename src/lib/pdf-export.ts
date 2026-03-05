"use client";

import { CVData } from "./cv-types";

export async function exportToPDF(cvData: CVData) {
    // Dynamic import to avoid SSR issues
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("cv-preview-content");
    if (!element) return;

    const opt = {
        margin: 0,
        filename: `${cvData.personalInfo.fullName || "My"}_CV.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait" as const,
        },
    };

    await html2pdf().set(opt).from(element).save();
}
