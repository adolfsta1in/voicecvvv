"use client";

import React from "react";
import { CVData } from "@/lib/cv-types";
import { TemplateId } from "@/lib/cv-templates";

import ClassicTemplate from "@/components/templates/ClassicTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import SidebarTemplate from "@/components/templates/SidebarTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";
import CompactTemplate from "@/components/templates/CompactTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import ElegantTemplate from "@/components/templates/ElegantTemplate";
import TechTemplate from "@/components/templates/TechTemplate";

export default function RenderClient({ cvData, templateId }: { cvData: CVData, templateId: TemplateId }) {
    const layoutInfo = cvData.layout || {};
    const fontSize = layoutInfo.fontSize || "normal";
    const spacing = layoutInfo.documentSpacing || "normal";

    const fontScale = fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px";
    const spaceScale = spacing === "tight" ? 0.85 : spacing === "relaxed" ? 1.25 : 1;

    // We do NOT want to trigger any field changes on the render page.
    const handleFieldChange = () => { };

    const props = { cv: cvData, onFieldChange: handleFieldChange };

    let TemplateComponent;
    switch (templateId) {
        case "minimal": TemplateComponent = <MinimalTemplate {...props} />; break;
        case "sidebar": TemplateComponent = <SidebarTemplate {...props} />; break;
        case "executive": TemplateComponent = <ExecutiveTemplate {...props} />; break;
        case "creative": TemplateComponent = <CreativeTemplate {...props} />; break;
        case "compact": TemplateComponent = <CompactTemplate {...props} />; break;
        case "modern": TemplateComponent = <ModernTemplate {...props} />; break;
        case "professional": TemplateComponent = <ProfessionalTemplate {...props} />; break;
        case "elegant": TemplateComponent = <ElegantTemplate {...props} />; break;
        case "tech": TemplateComponent = <TechTemplate {...props} />; break;
        case "classic":
        default: TemplateComponent = <ClassicTemplate {...props} />; break;
    }

    return (
        <div style={{ background: "white", minHeight: "100vh" }}>
            <style>{`
                /* Base typography to match builder */
                body {
                    margin: 0;
                    padding: 0;
                    background: white !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                #cv-render-content {
                    font-size: ${fontScale} !important;
                }
                #cv-render-content * {
                    line-height: calc(1.6 * ${spaceScale}) !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                }
                
                /* Hide any interactive elements */
                .editable-field { cursor: default !important; }
                .editable-field:hover { background: transparent !important; }
                [data-drag-handle] { display: none !important; }
            `}</style>

            <div
                id="cv-render-content"
                className="cv-document"
                style={{
                    width: "210mm",
                    minHeight: "297mm",
                    padding: templateId === "sidebar" || templateId === "executive" || templateId === "creative" ? 0 : "48px 56px",
                    margin: "0 auto", // Center if viewed in browser, ignored in print
                    boxSizing: "border-box",
                    position: "relative",
                    overflow: "hidden", // clip any bleeds
                }}
            >
                {TemplateComponent}
            </div>
        </div>
    );
}
