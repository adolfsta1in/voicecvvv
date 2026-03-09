import { CVData } from "./cv-types";
import { TemplateId } from "./cv-templates";

let isExporting = false;

/**
 * Request PDF generation from the headless browser API.
 */
export async function exportToPDF(cvData: CVData, templateId: TemplateId) {
    if (typeof window === "undefined" || isExporting) return;

    try {
        isExporting = true;
        window.dispatchEvent(new CustomEvent("pdf-export-start"));

        const response = await fetch("/api/pdf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cvData, templateId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Server responded with status ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        // Create a reasonable filename
        const name = cvData.personalInfo?.fullName
            ? `${cvData.personalInfo.fullName.replace(/\s+/g, "_")}_CV.pdf`
            : "ChatCV.pdf";

        a.download = name;
        document.body.appendChild(a);

        // Trigger download
        a.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

    } catch (error) {
        console.error("PDF Export Failed:", error);
        alert("Failed to export PDF: " + (error instanceof Error ? error.message : String(error)));
    } finally {
        isExporting = false;
        window.dispatchEvent(new CustomEvent("pdf-export-end"));
    }
}
