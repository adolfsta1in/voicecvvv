"use client";

import React from "react";
import { CVData } from "@/lib/cv-types";
import { SortableList } from "../dnd/SortableList";
import { SortableItem } from "../dnd/SortableItem";
import { useCVStore } from "@/lib/cv-store";

export interface TemplateProps {
    cv: CVData;
    onFieldChange: (path: string, value: string) => void;
}

function EditableText({
    value,
    path,
    onFieldChange,
    style,
    tag: Tag = "span",
    placeholder = "...",
}: {
    value: string;
    path: string;
    onFieldChange: (path: string, value: string) => void;
    style?: React.CSSProperties;
    tag?: keyof React.JSX.IntrinsicElements;
    placeholder?: string;
}) {
    return (
        <Tag
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            onBlur={(e) => {
                const el = e.currentTarget as HTMLElement;
                onFieldChange(path, el.innerText.trim());
            }}
            style={{
                outline: "none",
                cursor: "text",
                borderRadius: 3,
                transition: "background 0.15s",
                minWidth: 20,
                ...style,
            }}
            className="editable-field"
        >
            {value}
        </Tag>
    );
}

export default function ModernTemplate({ cv, onFieldChange }: TemplateProps) {
    const { dispatch } = useCVStore();
    const accent = cv.layout?.themeColor || "#0f172a";

    const sectionComponents: Record<string, React.ReactNode> = {
        summary: cv.summary && (
            <div style={{ marginBottom: 24 }}>
                <SectionHeader title="Profile" accent={accent} />
                <EditableText
                    value={cv.summary}
                    path="summary"
                    onFieldChange={onFieldChange}
                    tag="p"
                    style={{ fontSize: "0.875em", color: "#475569", lineHeight: 1.6 }}
                />
            </div>
        ),
        experience: cv.experience.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <SectionHeader title="Experience" accent={accent} />
                <SortableList
                    items={cv.experience}
                    onReorder={(newOrder) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "experience", newOrder } });
                    }}
                >
                    {cv.experience.map((exp, ei) => (
                        <SortableItem key={exp.id} id={exp.id} handleStyle={{ top: 0, left: -28 }}>
                            <div style={{ marginBottom: 18, position: "relative" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                                    <div>
                                        <EditableText value={exp.jobTitle} path={`experience.${ei}.jobTitle`} onFieldChange={onFieldChange} tag="h3"
                                            style={{ fontSize: "1em", fontWeight: 700, color: "#1e293b" }} />
                                        <div style={{ fontSize: "0.875em", color: accent, fontWeight: 600, marginTop: 2 }}>
                                            <EditableText value={exp.company} path={`experience.${ei}.company`} onFieldChange={onFieldChange} />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "0.75em", fontWeight: 600, color: "#64748b", background: "#f1f5f9", padding: "4px 8px", borderRadius: 4 }}>
                                            <EditableText value={exp.startDate} path={`experience.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={exp.endDate} path={`experience.${ei}.endDate`} onFieldChange={onFieldChange} />
                                        </span>
                                        {exp.location && <div style={{ fontSize: "0.75em", color: "#94a3b8", marginTop: 4 }}><EditableText value={exp.location} path={`experience.${ei}.location`} onFieldChange={onFieldChange} /></div>}
                                    </div>
                                </div>
                                {exp.description.length > 0 && (
                                    <ul style={{ paddingLeft: 18, marginTop: 8, listStyleType: "square", display: "flex", flexDirection: "column", gap: 4 }}>
                                        {exp.description.map((d, di) => (
                                            <li key={di} style={{ fontSize: "0.875em", color: "#475569", lineHeight: 1.6 }}>
                                                <EditableText value={d} path={`experience.${ei}.description.${di}`} onFieldChange={onFieldChange} />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        education: cv.education.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <SectionHeader title="Education" accent={accent} />
                <SortableList
                    items={cv.education}
                    onReorder={(newOrder) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "education", newOrder } });
                    }}
                >
                    {cv.education.map((edu, ei) => (
                        <SortableItem key={edu.id} id={edu.id} handleStyle={{ top: 0, left: -28 }}>
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                                    <div>
                                        <EditableText value={edu.degree} path={`education.${ei}.degree`} onFieldChange={onFieldChange} tag="h3"
                                            style={{ fontSize: "1em", fontWeight: 700, color: "#1e293b" }} />
                                        <div style={{ fontSize: "0.875em", color: accent, fontWeight: 600, marginTop: 2 }}>
                                            <EditableText value={edu.institution} path={`education.${ei}.institution`} onFieldChange={onFieldChange} />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "0.75em", fontWeight: 600, color: "#64748b", background: "#f1f5f9", padding: "4px 8px", borderRadius: 4 }}>
                                            <EditableText value={edu.startDate} path={`education.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={edu.endDate} path={`education.${ei}.endDate`} onFieldChange={onFieldChange} />
                                        </span>
                                        {edu.location && <div style={{ fontSize: "0.75em", color: "#94a3b8", marginTop: 4 }}><EditableText value={edu.location} path={`education.${ei}.location`} onFieldChange={onFieldChange} /></div>}
                                    </div>
                                </div>
                                {edu.gpa && <div style={{ fontSize: "0.875em", color: "#64748b", marginTop: 4 }}>GPA: <EditableText value={edu.gpa} path={`education.${ei}.gpa`} onFieldChange={onFieldChange} /></div>}
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        skills: cv.skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <SectionHeader title="Skills" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 12px" }}>
                    {cv.skills.map((skill, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, opacity: 0.8 }} />
                            <span style={{ fontSize: "0.875em", color: "#334155", fontWeight: 500 }}>
                                <EditableText value={skill} path={`skills.${i}`} onFieldChange={onFieldChange} />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        languages: cv.languages && cv.languages.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <SectionHeader title="Languages" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
                    {cv.languages.map((lang, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", borderRadius: 4 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />
                            </div>
                            <span style={{ fontSize: "0.875em", color: "#334155", fontWeight: 500 }}>
                                <EditableText value={lang} path={`languages.${i}`} onFieldChange={onFieldChange} />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        certifications: cv.certifications && cv.certifications.length > 0 && (
            <div>
                <SectionHeader title="Certifications" accent={accent} />
                <ul style={{ paddingLeft: 0, listStyleType: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {cv.certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: "0.875em", color: "#334155", padding: "10px 14px", background: "#f8fafc", borderLeft: `3px solid ${accent}`, borderRadius: "0 6px 6px 0" }}>
                            <EditableText value={cert} path={`certifications.${i}`} onFieldChange={onFieldChange} />
                        </li>
                    ))}
                </ul>
            </div>
        ),
    };

    const sectionOrderItems = (cv.layout?.sectionOrder || ["summary", "experience", "education", "skills", "languages", "certifications"]).map((id) => {
        if (!sectionComponents[id]) return null;
        return { id };
    }).filter(Boolean) as { id: string }[];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#0f172a", background: "white", padding: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

                {/* Header Section */}
                {cv.personalInfo.fullName && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${accent}`, paddingBottom: 24 }}>
                        <div style={{ maxWidth: "60%" }}>
                            <EditableText
                                value={cv.personalInfo.fullName}
                                path="personalInfo.fullName"
                                onFieldChange={onFieldChange}
                                tag="h1"
                                placeholder="Your Name"
                                style={{ fontSize: "2.5em", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 8, display: "block" }}
                            />
                            {cv.personalInfo.title && (
                                <EditableText
                                    value={cv.personalInfo.title}
                                    path="personalInfo.title"
                                    onFieldChange={onFieldChange}
                                    tag="div"
                                    style={{ fontSize: "1.25em", color: accent, fontWeight: 600 }}
                                />
                            )}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, fontSize: "0.8125em", color: "#475569", textAlign: "right" }}>
                            {cv.personalInfo.email && <EditableText value={cv.personalInfo.email} path="personalInfo.email" onFieldChange={onFieldChange} />}
                            {cv.personalInfo.phone && <EditableText value={cv.personalInfo.phone} path="personalInfo.phone" onFieldChange={onFieldChange} />}
                            {cv.personalInfo.location && <EditableText value={cv.personalInfo.location} path="personalInfo.location" onFieldChange={onFieldChange} />}
                            {cv.personalInfo.linkedin && <EditableText value={cv.personalInfo.linkedin} path="personalInfo.linkedin" onFieldChange={onFieldChange} />}
                        </div>
                    </div>
                )}

                {/* Sortable Main Sections */}
                <div style={{ marginTop: 8 }}>
                    <SortableList
                        items={sectionOrderItems}
                        onReorder={(newOrder) => {
                            dispatch({ type: "REORDER_SECTIONS", payload: newOrder.map((o) => o.id) });
                        }}
                    >
                        {sectionOrderItems.map((item) => (
                            <SortableItem key={item.id} id={item.id}>
                                {sectionComponents[item.id]}
                            </SortableItem>
                        ))}
                    </SortableList>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, accent }: { title: string; accent: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ padding: "6px 12px", background: accent, borderRadius: 6 }}>
                <h2 style={{
                    fontSize: "0.875em", fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.08em", color: "#ffffff", margin: 0,
                }}>
                    {title}
                </h2>
            </div>
            <div style={{ height: 1, flex: 1, background: "#e2e8f0" }} />
        </div>
    );
}
