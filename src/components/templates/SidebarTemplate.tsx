"use client";

import React from "react";
import { TemplateProps } from "./ClassicTemplate";
import { SortableList } from "../dnd/SortableList";
import { SortableItem } from "../dnd/SortableItem";
import { useCVStore } from "@/lib/cv-store";

function EditableText({
    value, path, onFieldChange, style, tag: Tag = "span",
}: { value: string; path: string; onFieldChange: (p: string, v: string) => void; style?: React.CSSProperties; tag?: keyof React.JSX.IntrinsicElements; }) {
    return (
        <Tag
            contentEditable suppressContentEditableWarning
            onBlur={(e) => onFieldChange(path, (e.currentTarget as HTMLElement).innerText.trim())}
            style={{ outline: "none", cursor: "text", borderRadius: 3, minWidth: 20, ...style }}
            className="editable-field"
        >{value}</Tag>
    );
}

export default function SidebarTemplate({ cv, onFieldChange }: TemplateProps) {
    const { dispatch } = useCVStore();
    const sidebarBg = "#1e293b";
    const accent = cv.layout?.themeColor || "#10b981";

    const sidebarItems = ["skills", "languages"];
    const mainItems = ["summary", "experience", "education", "certifications"];

    const currentOrder = cv.layout?.sectionOrder || [...mainItems, ...sidebarItems];

    const sidebarOrderItems = currentOrder
        .filter(id => sidebarItems.includes(id))
        .map(id => ({ id }));

    const mainOrderItems = currentOrder
        .filter(id => mainItems.includes(id))
        .map(id => ({ id }));

    const handleReorder = (newOrderObj: { id: string }[], type: "sidebar" | "main") => {
        const newIds = newOrderObj.map(o => o.id);
        const newSectionOrder = currentOrder.map(id => {
            if (type === "sidebar" && sidebarItems.includes(id)) {
                return newIds.shift() || id;
            }
            if (type === "main" && mainItems.includes(id)) {
                return newIds.shift() || id;
            }
            return id;
        });
        dispatch({ type: "REORDER_SECTIONS", payload: newSectionOrder });
    };

    const sectionComponents: Record<string, React.ReactNode> = {
        summary: cv.summary && (
            <div style={{ marginBottom: 24 }}>
                <MainSection title="Profile" accent={accent} />
                <EditableText value={cv.summary} path="summary" onFieldChange={onFieldChange} tag="p"
                    style={{ fontSize: "0.8125em", color: "#374151", lineHeight: 1.7 }} />
            </div>
        ),
        experience: cv.experience.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <MainSection title="Experience" accent={accent} />
                <SortableList
                    items={cv.experience}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "experience", newOrder } });
                    }}
                >
                    {cv.experience.map((exp, ei) => (
                        <SortableItem key={exp.id} id={exp.id} handleStyle={{ top: 0, left: -24 }}>
                            <div style={{ marginBottom: 16, paddingLeft: 12, borderLeft: `2px solid ${accent}` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <EditableText value={exp.jobTitle} path={`experience.${ei}.jobTitle`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.9375em", fontWeight: 700, color: "#1a1a2e" }} />
                                    <span style={{ fontSize: "0.72em", color: "#9ca3af", flexShrink: 0, marginLeft: 8 }}>
                                        <EditableText value={exp.startDate} path={`experience.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={exp.endDate} path={`experience.${ei}.endDate`} onFieldChange={onFieldChange} />
                                    </span>
                                </div>
                                <div style={{ fontSize: "0.8em", color: accent, fontWeight: 500, marginBottom: 5 }}>
                                    <EditableText value={exp.company} path={`experience.${ei}.company`} onFieldChange={onFieldChange} />
                                    {exp.location && <span style={{ color: "#9ca3af" }}> · <EditableText value={exp.location} path={`experience.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                </div>
                                {exp.description.map((d, di) => (
                                    <div key={di} style={{ fontSize: "0.8em", color: "#374151", lineHeight: 1.6, marginBottom: 2 }}>
                                        · <EditableText value={d} path={`experience.${ei}.description.${di}`} onFieldChange={onFieldChange} />
                                    </div>
                                ))}
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        education: cv.education.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <MainSection title="Education" accent={accent} />
                <SortableList
                    items={cv.education}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "education", newOrder } });
                    }}
                >
                    {cv.education.map((edu, ei) => (
                        <SortableItem key={edu.id} id={edu.id} handleStyle={{ top: 0, left: -24 }}>
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <EditableText value={edu.degree} path={`education.${ei}.degree`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.9375em", fontWeight: 700, color: "#1a1a2e" }} />
                                    <span style={{ fontSize: "0.72em", color: "#9ca3af", flexShrink: 0, marginLeft: 8 }}>
                                        <EditableText value={edu.startDate} path={`education.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={edu.endDate} path={`education.${ei}.endDate`} onFieldChange={onFieldChange} />
                                    </span>
                                </div>
                                <div style={{ fontSize: "0.8em", color: accent, fontWeight: 500 }}>
                                    <EditableText value={edu.institution} path={`education.${ei}.institution`} onFieldChange={onFieldChange} />
                                    {edu.location && <span style={{ color: "#9ca3af" }}> · <EditableText value={edu.location} path={`education.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                </div>
                                {edu.gpa && <div style={{ fontSize: "0.8em", color: "#9ca3af", marginTop: 2 }}>GPA: <EditableText value={edu.gpa} path={`education.${ei}.gpa`} onFieldChange={onFieldChange} /></div>}
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        certifications: cv.certifications && cv.certifications.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <MainSection title="Certifications" accent={accent} />
                <ul style={{ paddingLeft: 16, listStyleType: "none", margin: 0 }}>
                    {cv.certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: "0.8em", color: "#374151", lineHeight: 1.6, position: "relative" }}>
                            <span style={{ position: "absolute", left: -12, color: accent }}>•</span>
                            <EditableText value={cert} path={`certifications.${i}`} onFieldChange={onFieldChange} />
                        </li>
                    ))}
                </ul>
            </div>
        ),
        skills: cv.skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
                <SbSection title="Skills" accent={accent} />
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {cv.skills.map((skill, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                            <EditableText value={skill} path={`skills.${i}`} onFieldChange={onFieldChange}
                                style={{ fontSize: "0.75em", color: "#e2e8f0" }} />
                        </div>
                    ))}
                </div>
            </div>
        ),
        languages: cv.languages && cv.languages.length > 0 && (
            <div style={{ marginBottom: 20 }}>
                <SbSection title="Languages" accent={accent} />
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {cv.languages.map((lang, i) => (
                        <EditableText key={i} value={lang} path={`languages.${i}`} onFieldChange={onFieldChange}
                            style={{ fontSize: "0.75em", color: "#94a3b8" }} tag="div" />
                    ))}
                </div>
            </div>
        )
    };

    return (
        <div style={{ display: "flex", flex: 1, minHeight: "100%", fontFamily: "'Inter', sans-serif" }}>
            {/* Sidebar */}
            <div style={{ width: 210, background: sidebarBg, color: "white", padding: "36px 22px", flexShrink: 0 }}>
                {cv.personalInfo.fullName && (
                    <>
                        <EditableText value={cv.personalInfo.fullName} path="personalInfo.fullName" onFieldChange={onFieldChange} tag="h1"
                            style={{ fontSize: "1.25em", fontWeight: 800, color: "white", marginBottom: 4, display: "block", lineHeight: 1.2 }} />
                        {cv.personalInfo.title && (
                            <EditableText value={cv.personalInfo.title} path="personalInfo.title" onFieldChange={onFieldChange} tag="div"
                                style={{ fontSize: "0.8em", color: accent, fontWeight: 500, marginBottom: 16 }} />
                        )}
                    </>
                )}

                <SbSection title="Contact" accent={accent} />
                <div style={{ fontSize: "0.75em", color: "#94a3b8", display: "flex", flexDirection: "column", gap: 5, marginBottom: 24 }}>
                    {cv.personalInfo.email && <EditableText value={cv.personalInfo.email} path="personalInfo.email" onFieldChange={onFieldChange} tag="div" style={{ color: "#94a3b8" }} />}
                    {cv.personalInfo.phone && <EditableText value={cv.personalInfo.phone} path="personalInfo.phone" onFieldChange={onFieldChange} tag="div" style={{ color: "#94a3b8" }} />}
                    {cv.personalInfo.location && <EditableText value={cv.personalInfo.location} path="personalInfo.location" onFieldChange={onFieldChange} tag="div" style={{ color: "#94a3b8" }} />}
                    {cv.personalInfo.linkedin && <EditableText value={cv.personalInfo.linkedin} path="personalInfo.linkedin" onFieldChange={onFieldChange} tag="div" style={{ color: "#94a3b8" }} />}
                </div>

                <SortableList
                    items={sidebarOrderItems}
                    onReorder={(newOrder: { id: string }[]) => handleReorder(newOrder, "sidebar")}
                >
                    {sidebarOrderItems.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            {sectionComponents[item.id]}
                        </SortableItem>
                    ))}
                </SortableList>
            </div>

            {/* Main */}
            <div style={{ flex: 1, padding: "36px 32px", background: "white", color: "#1a1a2e" }}>
                <SortableList
                    items={mainOrderItems}
                    onReorder={(newOrder: { id: string }[]) => handleReorder(newOrder, "main")}
                >
                    {mainOrderItems.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            {sectionComponents[item.id]}
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        </div>
    );
}

function SbSection({ title, accent }: { title: string; accent: string }) {
    return (
        <div style={{ fontSize: "0.65em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: accent, marginBottom: 8, borderBottom: `1px solid rgba(16,185,129,0.2)`, paddingBottom: 4 }}>
            {title}
        </div>
    );
}

function MainSection({ title, accent }: { title: string; accent: string }) {
    return (
        <h2 style={{ fontSize: "0.8125em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 12 }}>
            {title}
        </h2>
    );
}
