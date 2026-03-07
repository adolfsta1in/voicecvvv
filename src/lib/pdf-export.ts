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
 * Sanitize all colors on an element tree so html2canvas can parse them.
 * Converts modern CSS color functions (lab, oklch, oklab, lch, color)
 * into standard rgb/rgba by reading the browser's computed styles.
 */
function sanitizeColors(root: HTMLElement) {
    const colorProps = [
        "color",
        "backgroundColor",
        "borderColor",
        "borderTopColor",
        "borderRightColor",
        "borderBottomColor",
        "borderLeftColor",
        "outlineColor",
        "textDecorationColor",
        "boxShadow",
    ];

    const unsupportedPattern = /\b(lab|oklch|oklab|lch|color)\s*\(/i;

    const allElements = root.querySelectorAll("*");
    const elements = [root, ...Array.from(allElements)] as HTMLElement[];

    for (const el of elements) {
        const computed = window.getComputedStyle(el);

        for (const prop of colorProps) {
            try {
                const inlineVal = el.style.getPropertyValue(
                    prop.replace(/([A-Z])/g, "-$1").toLowerCase()
                );
                const computedVal = computed.getPropertyValue(
                    prop.replace(/([A-Z])/g, "-$1").toLowerCase()
                );

                // If inline or computed style uses an unsupported color function,
                // override with the computed RGB value (browser auto-converts)
                if (
                    unsupportedPattern.test(inlineVal) ||
                    unsupportedPattern.test(computedVal)
                ) {
                    // The computed style from the browser is ALWAYS in rgb/rgba
                    el.style.setProperty(
                        prop.replace(/([A-Z])/g, "-$1").toLowerCase(),
                        computedVal,
                        "important"
                    );
                }
            } catch {
                // skip unreadable props
            }
        }

        // Also handle background shorthand and gradients
        try {
            const bg = computed.getPropertyValue("background");
            if (unsupportedPattern.test(bg)) {
                el.style.setProperty("background", computed.getPropertyValue("background-color"), "important");
            }
        } catch {
            // skip
        }
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

        // Clone the element so we don't modify the real page
        const clone = element.cloneNode(true) as HTMLElement;

        // Remove UI-only overlays
        clone.querySelectorAll(".hide-on-print").forEach(el => el.remove());

        // Force white background for the PDF
        clone.style.background = "#ffffff";
        clone.style.color = "#000000";
        clone.style.boxShadow = "none";
        clone.style.border = "none";
        clone.style.borderRadius = "0";
        clone.style.width = element.offsetWidth + "px";
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "0";

        // Append to DOM so computed styles work
        document.body.appendChild(clone);

        // Convert any unsupported CSS color functions (lab, oklch, etc.) to RGB
        sanitizeColors(clone);

        try {
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
            });

            const imgData = canvas.toDataURL("image/jpeg", 0.95);

            const A4_W = 210;
            const A4_H = 297;
            const pdfWidth = A4_W;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            const pdf = new jsPDFConstructor({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            let yOffset = 0;
            pdf.addImage(imgData, "JPEG", 0, yOffset, pdfWidth, pdfHeight);

            let remaining = pdfHeight - A4_H;
            while (remaining > 0) {
                yOffset -= A4_H;
                pdf.addPage();
                pdf.addImage(imgData, "JPEG", 0, yOffset, pdfWidth, pdfHeight);
                remaining -= A4_H;
            }

            pdf.save(fileName);
        } finally {
            // Always clean up the clone
            if (clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
        }
    } catch (error) {
        console.error("PDF export error:", error);
        alert("Failed to generate PDF: " + (error instanceof Error ? error.message : String(error)));
    }
}
