"use client";

import { CVData } from "./cv-types";

/**
 * Loads a script from a CDN URL and returns a promise that resolves when loaded.
 */
function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

export async function exportToPDF(cvData: CVData) {
    if (typeof window === "undefined") return;

    const element = document.getElementById("cv-preview-content");
    if (!element) {
        alert("No CV content found. Please make sure your CV has some content before exporting.");
        return;
    }

    const fileName = cvData.personalInfo?.fullName
        ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`
        : "CV.pdf";

    try {
        // Load libraries from CDN — this bypasses all bundler/Turbopack issues
        await Promise.all([
            loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
            loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js"),
        ]);

        // Access the globally loaded libraries
        const html2canvas = (window as unknown as Record<string, unknown>).html2canvas as (
            el: HTMLElement,
            opts: Record<string, unknown>
        ) => Promise<HTMLCanvasElement>;

        const jsPDFConstructor = ((window as unknown as Record<string, unknown>).jspdf as Record<string, unknown>)
            .jsPDF as new (opts: Record<string, unknown>) => {
                addImage: (data: string, type: string, x: number, y: number, w: number, h: number) => void;
                addPage: () => void;
                save: (name: string) => void;
            };

        if (!html2canvas || !jsPDFConstructor) {
            alert("PDF libraries failed to load. Please check your internet connection and try again.");
            return;
        }

        // Render the CV element to a high-res canvas
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            ignoreElements: (el: Element) => el.classList?.contains("hide-on-print"),
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        // A4 dimensions in mm
        const A4_W = 210;
        const A4_H = 297;

        const pdfWidth = A4_W;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        const pdf = new jsPDFConstructor({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        // Add pages as needed
        let yOffset = 0;
        pdf.addImage(imgData, "JPEG", 0, yOffset, pdfWidth, pdfHeight);

        let remaining = pdfHeight - A4_H;
        while (remaining > 0) {
            yOffset -= A4_H;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, yOffset, pdfWidth, pdfHeight);
            remaining -= A4_H;
        }

        // Trigger the download
        pdf.save(fileName);
    } catch (error) {
        console.error("PDF export error:", error);
        alert("Failed to generate PDF: " + (error instanceof Error ? error.message : String(error)));
    }
}
