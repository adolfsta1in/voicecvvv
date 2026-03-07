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
        ? `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV`
        : "CV";

    // Clone the CV content
    const clone = element.cloneNode(true) as HTMLElement;

    // Remove UI-only elements (page break indicators, edit hints, etc.)
    clone.querySelectorAll(".hide-on-print").forEach(el => el.remove());

    // Remove contenteditable attributes
    clone.querySelectorAll("[contenteditable]").forEach(el => {
        el.removeAttribute("contenteditable");
    });

    // Gather all stylesheets from the current page
    const stylesheets = Array.from(document.styleSheets);
    let cssText = "";
    for (const sheet of stylesheets) {
        try {
            const rules = Array.from(sheet.cssRules || []);
            for (const rule of rules) {
                cssText += rule.cssText + "\n";
            }
        } catch {
            // Cross-origin stylesheets can't be read — skip them
        }
    }

    // Open a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        alert("Pop-up blocked! Please allow pop-ups for this site and try again.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${fileName}</title>
            <style>
                ${cssText}

                /* Print-specific overrides */
                @page {
                    size: A4;
                    margin: 0;
                }
                *, *::before, *::after {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                body {
                    margin: 0;
                    padding: 0;
                    background: #ffffff !important;
                    color: #000000 !important;
                }
                .cv-print-container {
                    width: 794px;
                    margin: 0 auto;
                    background: #ffffff !important;
                }
                .hide-on-print {
                    display: none !important;
                }
            </style>
        </head>
        <body>
            <div class="cv-print-container">
                ${clone.outerHTML}
            </div>
            <script>
                // Auto-trigger print dialog once the page loads
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        // Close the window after printing (or cancelling)
                        setTimeout(function() { window.close(); }, 500);
                    }, 300);
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}
