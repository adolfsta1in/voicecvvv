"use client";

import { emptyCVData } from "@/lib/cv-types";
import TechTemplate from "@/components/templates/TechTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import SidebarTemplate from "@/components/templates/SidebarTemplate";
import ElegantTemplate from "@/components/templates/ElegantTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import type { CVData } from "@/lib/cv-types";
import type { TemplateId } from "@/lib/cv-templates";
import { useEffect, useState } from "react";
import { CVProvider } from "@/lib/cv-store";

/**
 * A dedicated hidden route specifically for Puppeteer to print the CV.
 * It renders absolutely zero UI except the raw template component.
 */
export default function CVPrintView() {
    const [cv, setCv] = useState<CVData | null>(null);
    const [zoom, setZoom] = useState<number>(1); // Support zooming if needed but usually 1

    useEffect(() => {
        // We will read the cv data from localStorage as injected by Puppeteer
        const checkData = () => {
            try {
                const stored = localStorage.getItem('CV_PRINT_DATA');
                if (stored) {
                    const injectedData = JSON.parse(stored);
                    if (injectedData && injectedData.cv) {
                        setCv(injectedData.cv);
                        setZoom(injectedData.zoom || 1);
                        return true;
                    }
                }
            } catch (e) {
                console.error("Error reading print data", e);
            }
            return false;
        };

        if (!checkData()) {
            // Poll for data since evaluateOnNewDocument can sometimes race with React hydration
            const interval = setInterval(() => {
                if (checkData()) {
                    clearInterval(interval);
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, []);

    if (!cv) {
        return <div className="p-4">Waiting for printable data...</div>;
    }

    const templateId = ((cv as any).templateId as TemplateId) || "tech";

    // No-op for field changes since this is a static print view
    const noopUpdate = () => { };

    const renderTemplate = () => {
        const props = { cv, onFieldChange: noopUpdate };
        switch (templateId) {
            case "tech": return <TechTemplate {...props} />;
            case "modern": return <ModernTemplate {...props} />;
            case "professional": return <ProfessionalTemplate {...props} />;
            case "executive": return <ExecutiveTemplate {...props} />;
            case "sidebar": return <SidebarTemplate {...props} />;
            case "elegant": return <ElegantTemplate {...props} />;
            case "minimal": return <MinimalTemplate {...props} />;
            default: return <TechTemplate {...props} />;
        }
    };

    return (
        <CVProvider>
            <div style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: "max-content", // Important: let the template dictate its 210mm/A4 width
                backgroundColor: "transparent",
            }}>
                <div id="cv-print-content" data-print-ready="true">
                    {renderTemplate()}
                </div>
            </div>
        </CVProvider>
    );
}
