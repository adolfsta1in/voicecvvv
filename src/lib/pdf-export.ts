"use client";

import { CVData } from "./cv-types";

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
 * Force ALL color-related CSS properties on every element to their
 * computed rgb/rgba values as inline styles. This ensures html2canvas
 * never encounters unsupported color functions (lab, oklch, etc.)
 * from stylesheets.
 */
function forceComputedColors(root: HTMLElement) {
    const colorProps = [
        "color",
        "background-color",
        "border-color",
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color",
        "outline-color",
        "text-decoration-color",
    ];

    const elements = [root, ...Array.from(root.querySelectorAll("*"))] as HTMLElement[];

    for (const el of elements) {
        const computed = window.getComputedStyle(el);

        // Force every color property to its computed rgb value as inline style
        for (const prop of colorProps) {
            const val = computed.getPropertyValue(prop);
            if (val && val !== "rgba(0, 0, 0, 0)" && val !== "transparent") {
                el.style.setProperty(prop, val);
            }
        }

        // Handle background (could have gradients with lab colors)
        const bgImage = computed.getPropertyValue("background-image");
        if (bgImage && bgImage !== "none") {
            el.style.setProperty("background-image", bgImage);
        }
        const bgColor = computed.getPropertyValue("background-color");
        if (bgColor) {
            el.style.setProperty("background-color", bgColor);
        }

        // Handle box-shadow (remove if it has unsupported colors)
        const shadow = computed.getPropertyValue("box-shadow");
        if (shadow && /\b(lab|oklch|oklab|lch|color)\s*\(/i.test(shadow)) {
            el.style.setProperty("box-shadow", "none");
        } else if (shadow && shadow !== "none") {
            el.style.setProperty("box-shadow", shadow);
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

        // Clone the CV — preserves original template styling
        const clone = element.cloneNode(true) as HTMLElement;

        // Remove UI overlays
        clone.querySelectorAll(".hide-on-print").forEach(el => el.remove());
        clone.querySelectorAll("[contenteditable]").forEach(el => {
            el.removeAttribute("contenteditable");
        });

        // Place clone off-screen with same dimensions
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        clone.style.top = "0";
        clone.style.width = element.offsetWidth + "px";
        clone.style.boxShadow = "none";
        clone.style.border = "none";
        clone.style.borderRadius = "0";

        document.body.appendChild(clone);

        // Force ALL computed colors as inline RGB — this is the key fix.
        // html2canvas reads inline styles first, so it will never try to
        // parse the stylesheet's lab() values.
        forceComputedColors(clone);

        try {
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                logging: false,
            });

            const imgData = canvas.toDataURL("image/png");

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
