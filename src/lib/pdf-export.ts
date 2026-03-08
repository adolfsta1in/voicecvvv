"use client";

import { CVData } from "./cv-types";

// Keep track of ongoing export to prevent multiple clicks
let isExporting = false;

/**
 * Exports the CV preview to PDF using the browser's native print functionality.
 * This produces a pixel-perfect PDF that matches exactly what the user sees on screen.
 * No server-side rendering needed — works everywhere including Vercel.
 */
export async function exportToPDF(cvData: CVData) {
    if (typeof window === "undefined" || isExporting) return;

    const element = document.getElementById("cv-preview-content");
    if (!element) {
        alert("No CV content found. Please make sure your CV has some content before exporting.");
        return;
    }

    try {
        isExporting = true;

        // Create a hidden iframe to isolate the print context
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.top = "-10000px";
        iframe.style.left = "-10000px";
        iframe.style.width = "210mm";
        iframe.style.height = "297mm";
        iframe.style.border = "none";
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
            throw new Error("Could not access iframe document");
        }

        // Copy all stylesheets from the parent document
        const styleSheets = Array.from(document.styleSheets);
        let cssText = "";
        for (const sheet of styleSheets) {
            try {
                const rules = Array.from(sheet.cssRules || []);
                for (const rule of rules) {
                    cssText += rule.cssText + "\n";
                }
            } catch {
                // Cross-origin stylesheets can't be read - fetch them via link tags instead
                if (sheet.href) {
                    const link = iframeDoc.createElement("link");
                    link.rel = "stylesheet";
                    link.href = sheet.href;
                    iframeDoc.head.appendChild(link);
                }
            }
        }

        // Also copy CSS custom properties from :root / html / body
        const computedRoot = getComputedStyle(document.documentElement);
        let cssVars = ":root {\n";
        for (let i = 0; i < computedRoot.length; i++) {
            const prop = computedRoot[i];
            if (prop.startsWith("--")) {
                cssVars += `  ${prop}: ${computedRoot.getPropertyValue(prop)};\n`;
            }
        }
        cssVars += "}\n";

        // Copy Google Fonts links
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]');
        fontLinks.forEach((link) => {
            const clone = link.cloneNode(true) as HTMLLinkElement;
            iframeDoc.head.appendChild(clone);
        });

        // Write the print document
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <style>
                    ${cssVars}
                    ${cssText}

                    @page {
                        size: A4;
                        margin: 0;
                    }

                    *, *::before, *::after {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }

                    html, body {
                        margin: 0;
                        padding: 0;
                        width: 210mm;
                        background: white;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    /* Hide any scrollbars */
                    body::-webkit-scrollbar { display: none; }

                    /* Ensure editable fields lose their interactive styling */
                    .editable-field {
                        cursor: default !important;
                    }
                    .editable-field:hover {
                        background: transparent !important;
                    }

                    /* Hide drag handles */
                    [data-drag-handle] {
                        display: none !important;
                    }
                </style>
            </head>
            <body>
                ${element.innerHTML}
            </body>
            </html>
        `);
        iframeDoc.close();

        // Wait for fonts and images to load
        await new Promise<void>((resolve) => {
            iframe.onload = () => resolve();
            // Fallback timeout in case onload doesn't fire
            setTimeout(resolve, 2000);
        });

        // Extra wait for fonts to render
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Trigger print on the iframe
        const iframeWindow = iframe.contentWindow;
        if (!iframeWindow) {
            throw new Error("Could not access iframe window");
        }

        // Print the iframe content
        iframeWindow.focus();
        iframeWindow.print();

        // Cleanup after a delay to let the print dialog process
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);

    } catch (error) {
        console.error("PDF export error:", error);
        alert("Failed to generate PDF: " + (error instanceof Error ? error.message : String(error)));
    } finally {
        isExporting = false;
    }
}
