"use client";

import { CVData } from "./cv-types";

export async function exportToPDF(cvData: CVData) {
    if (typeof window === "undefined") return;

    const element = document.getElementById("cv-preview-content");
    if (!element) {
        alert("No CV content found. Please make sure your CV has some content before exporting.");
        return;
    }

    const fileName = cvData.personalInfo?.fullName
        ? `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`
        : "CV.pdf";

    try {
        const html2canvas = (await import("html2canvas")).default;
        const { jsPDF } = await import("jspdf");

        // A4 dimensions in mm
        const A4_WIDTH_MM = 210;
        const A4_HEIGHT_MM = 297;

        // Render the element to a canvas
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            // Ignore UI-only elements
            ignoreElements: (el) => el.classList?.contains("hide-on-print"),
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        // Calculate how many A4 pages we need
        const imgWidthPx = canvas.width;
        const imgHeightPx = canvas.height;

        // Scale: fit the image width to A4 width
        const pdfWidth = A4_WIDTH_MM;
        const pdfHeight = (imgHeightPx * pdfWidth) / imgWidthPx;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        // If the content is taller than one page, split across pages
        let remainingHeight = pdfHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
        remainingHeight -= A4_HEIGHT_MM;

        // Add more pages if content overflows
        while (remainingHeight > 0) {
            position -= A4_HEIGHT_MM;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
            remainingHeight -= A4_HEIGHT_MM;
        }

        // Trigger instant download
        pdf.save(fileName);

    } catch (error) {
        console.error("Error exporting PDF:", error);
        alert("Failed to generate PDF. Please try again.");
    }
}
