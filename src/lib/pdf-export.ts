"use client";

import { CVData } from "./cv-types";

/**
 * Loads a script from a CDN URL and returns a promise that resolves when loaded.
 */
function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
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

/**
 * Sanitize unsupported CSS color functions (lab, oklch, oklab, lch, color)
 * by replacing them with the browser's computed rgb/rgba values.
 * This only touches colors that would crash html2canvas — everything else stays intact.
 */
function sanitizeColors(root: HTMLElement) {
    const unsupported = /\b(lab|oklch|oklab|lch|color)\s*\(/i;

    const cssColorProps = [
        "color", "background-color", "border-color",
        "border-top-color", "border-right-color",
        "border-bottom-color", "border-left-color",
        "outline-color", "text-decoration-color",
    ];

    const elements = [root, ...Array.from(root.querySelectorAll("*"))] as HTMLElement[];

    for (const el of elements) {
        const computed = window.getComputedStyle(el);

        for (const prop of cssColorProps) {
            try {
                const val = el.style.getPropertyValue(prop);
                if (val && unsupported.test(val)) {
                    // Browser computed style is always rgb/rgba
                    el.style.setProperty(prop, computed.getPropertyValue(prop), "important");
                }
            } catch { /* skip */ }
        }

        // Check inline background shorthand 
        try {
            const bgInline = el.style.getPropertyValue("background");
            if (bgInline && unsupported.test(bgInline)) {
                const bgColor = computed.getPropertyValue("background-color");
                el.style.setProperty("background", bgColor, "important");
            }
        } catch { /* skip */ }

        // Check inline box-shadow
        try {
            const shadow = el.style.getPropertyValue("box-shadow");
            if (shadow && unsupported.test(shadow)) {
                el.style.setProperty("box-shadow", "none", "important");
            }
        } catch { /* skip */ }
    }
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
        // Load libraries from CDN
        await Promise.all([
            loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"),
            loadScript("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"),
        ]);

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

        // Clone the element — preserve ALL original styles (don't override colors)
        const clone = element.cloneNode(true) as HTMLElement;

        // Remove UI-only overlays (page break lines, edit hints)
        clone.querySelectorAll(".hide-on-print").forEach(el => el.remove());

        // Remove contenteditable attributes
        clone.querySelectorAll("[contenteditable]").forEach(el => {
            el.removeAttribute("contenteditable");
        });

        // Position clone off-screen but keep same dimensions as the original
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        clone.style.width = element.offsetWidth + "px";
        // Remove any box-shadow/border from the page container (UI chrome, not part of CV)
        clone.style.boxShadow = "none";
        clone.style.border = "none";
        clone.style.borderRadius = "0";

        // Append to DOM so computed styles are available
        document.body.appendChild(clone);

        // Only fix unsupported color functions — leave everything else as-is
        sanitizeColors(clone);

        try {
            // Render to canvas — exact pixel copy of what's on screen
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                backgroundColor: null, // transparent — let the CV's own background show
                logging: false,
            });

            const imgData = canvas.toDataURL("image/png");

            // A4 in mm
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
            pdf.addImage(imgData, "PNG", 0, yOffset, pdfWidth, pdfHeight);

            let remaining = pdfHeight - A4_H;
            while (remaining > 0) {
                yOffset -= A4_H;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, yOffset, pdfWidth, pdfHeight);
                remaining -= A4_H;
            }

            pdf.save(fileName);
        } finally {
            if (clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
        }
    } catch (error) {
        console.error("PDF export error:", error);
        alert("Failed to generate PDF: " + (error instanceof Error ? error.message : String(error)));
    }
}
