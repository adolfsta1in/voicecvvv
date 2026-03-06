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

export default function TechTemplate({ cv, onFieldChange }: TemplateProps) {
    const { dispatch } = useCVStore();
    const accent = cv.layout?.themeColor || "#10b981"; // Emerald

    const sectionComponents: Record<string, React.ReactNode> = {
        summary: cv.summary && (
            <div style={{ marginBottom: 24 }}>
                <SectionHeader title="01_PROFILE" accent={accent} />
                <EditableText
                    value={cv.summary}
                    path="summary"
                    onFieldChange={onFieldChange}
                    tag="p"
                    style={{ fontSize: "0.875em", color: "#9ca3af", lineHeight: 1.6 }}
                />
            </div>
        ),
        experience: cv.experience.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <SectionHeader title="02_EXPERIENCE" accent={accent} />
                <SortableList
                    items={cv.experience}
                    onReorder={(newOrder) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "experience", newOrder } });
                    }}
                >
                    {cv.experience.map((exp, ei) => (
                        <SortableItem key={exp.id} id={exp.id} handleStyle={{ top: 0, left: -28 }}>
                            <div style={{ marginBottom: 20, borderLeft: `1px dashed #374151`, paddingLeft: 16, position: "relative" }}>
                                <div style={{ position: "absolute", left: -4, top: 4, width: 7, height: 7, background: "#111827", border: `1px solid ${accent}` }} />
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                                    <EditableText value={exp.jobTitle} path={`experience.${ei}.jobTitle`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.9375em", fontWeight: 700, color: "#f3f4f6" }} />
                                    <span style={{ fontSize: "0.75em", color: accent, flexShrink: 0, marginLeft: 8 }}>
                                        [<EditableText value={exp.startDate} path={`experience.${ei}.startDate`} onFieldChange={onFieldChange} /> - <EditableText value={exp.endDate} path={`experience.${ei}.endDate`} onFieldChange={onFieldChange} />]
                                    </span>
                                </div>
                                <div style={{ fontSize: "0.8125em", color: "#9ca3af", fontWeight: 600, marginBottom: 8 }}>
                                    <span style={{ color: accent }}>@</span> <EditableText value={exp.company} path={`experience.${ei}.company`} onFieldChange={onFieldChange} />
                                    {exp.location && <span> | <EditableText value={exp.location} path={`experience.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                </div>
                                {exp.description.length > 0 && (
                                    <ul style={{ paddingLeft: 16, listStyleType: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                                        {exp.description.map((d, di) => (
                                            <li key={di} style={{ fontSize: "0.8125em", color: "#d1d5db", lineHeight: 1.5 }}>
                                                <span style={{ color: "#4b5563", marginRight: 6 }}>{'>'}</span>
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
                <SectionHeader title="03_EDUCATION" accent={accent} />
                <SortableList
                    items={cv.education}
                    onReorder={(newOrder) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "education", newOrder } });
                    }}
                >
                    {cv.education.map((edu, ei) => (
                        <SortableItem key={edu.id} id={edu.id} handleStyle={{ top: 0, left: -28 }}>
                            <div style={{ marginBottom: 16, borderLeft: `1px dashed #374151`, paddingLeft: 16, position: "relative" }}>
                                <div style={{ position: "absolute", left: -4, top: 4, width: 7, height: 7, background: "#111827", border: `1px solid ${accent}` }} />
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                                    <EditableText value={edu.degree} path={`education.${ei}.degree`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.9375em", fontWeight: 700, color: "#f3f4f6" }} />
                                    <span style={{ fontSize: "0.75em", color: accent, flexShrink: 0, marginLeft: 8 }}>
                                        [<EditableText value={edu.startDate} path={`education.${ei}.startDate`} onFieldChange={onFieldChange} /> - <EditableText value={edu.endDate} path={`education.${ei}.endDate`} onFieldChange={onFieldChange} />]
                                    </span>
                                </div>
                                <div style={{ fontSize: "0.8125em", color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>
                                    <span style={{ color: accent }}>@</span> <EditableText value={edu.institution} path={`education.${ei}.institution`} onFieldChange={onFieldChange} />
                                    {edu.location && <span> | <EditableText value={edu.location} path={`education.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                </div>
                                {edu.gpa && <div style={{ fontSize: "0.8125em", color: "#6b7280" }}>{`// GPA:`} <EditableText value={edu.gpa} path={`education.${ei}.gpa`} onFieldChange={onFieldChange} /></div>}
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        skills: cv.skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <SectionHeader title="04_SKILLS" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {cv.skills.map((skill, i) => (
                        <div key={i} style={{ border: `1px solid #374151`, padding: "4px 10px", borderRadius: 2 }}>
                            <span style={{ fontSize: "0.8125em", color: "#d1d5db" }}>
                                <EditableText value={skill} path={`skills.${i}`} onFieldChange={onFieldChange} />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        languages: cv.languages && cv.languages.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <SectionHeader title="05_LANGUAGES" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {cv.languages.map((lang, i) => (
                        <div key={i} style={{ border: `1px solid #374151`, padding: "4px 10px", borderRadius: 2 }}>
                            <span style={{ fontSize: "0.8125em", color: "#d1d5db" }}>
                                <EditableText value={lang} path={`languages.${i}`} onFieldChange={onFieldChange} />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        certifications: cv.certifications && cv.certifications.length > 0 && (
            <div>
                <SectionHeader title="06_CERTIFICATIONS" accent={accent} />
                <ul style={{ paddingLeft: 0, listStyleType: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                    {cv.certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: "0.8125em", color: "#d1d5db", lineHeight: 1.5 }}>
                            <span style={{ color: accent, marginRight: 6 }}>*</span>
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
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", color: "#d1d5db", background: "#111827", padding: "40px", minHeight: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>

                {/* Header Section */}
                {cv.personalInfo.fullName && (
                    <div style={{ marginBottom: 32, border: `1px solid #374151`, padding: 20, position: "relative" }}>
                        <div style={{ position: "absolute", top: -8, left: 16, background: "#111827", padding: "0 8px", fontSize: "0.75em", color: accent }}>{'<user_data>'}</div>
                        <EditableText
                            value={cv.personalInfo.fullName}
                            path="personalInfo.fullName"
                            onFieldChange={onFieldChange}
                            tag="h1"
                            placeholder="Your Name"
                            style={{ fontSize: "2em", fontWeight: 700, color: "#f9fafb", marginBottom: 6, display: "block" }}
                        />
                        {cv.personalInfo.title && (
                            <div style={{ fontSize: "1em", color: accent, marginBottom: 16 }}>
                                {'> '}
                                <EditableText
                                    value={cv.personalInfo.title}
                                    path="personalInfo.title"
                                    onFieldChange={onFieldChange}
                                />
                            </div>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: "0.8125em", color: "#9ca3af" }}>
                            {cv.personalInfo.email && <div>E: <EditableText value={cv.personalInfo.email} path="personalInfo.email" onFieldChange={onFieldChange} /></div>}
                            {cv.personalInfo.phone && <div>P: <EditableText value={cv.personalInfo.phone} path="personalInfo.phone" onFieldChange={onFieldChange} /></div>}
                            {cv.personalInfo.location && <div>L: <EditableText value={cv.personalInfo.location} path="personalInfo.location" onFieldChange={onFieldChange} /></div>}
                            {cv.personalInfo.linkedin && <div>U: <EditableText value={cv.personalInfo.linkedin} path="personalInfo.linkedin" onFieldChange={onFieldChange} /></div>}
                        </div>
                    </div>
                )}

                {/* Sortable Main Sections */}
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
    );
}

function SectionHeader({ title, accent }: { title: string; accent: string }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <h2 style={{
                fontSize: "1em", fontWeight: 700,
                color: accent, margin: 0, paddingBottom: 4
            }}>
                {title} <span style={{ color: "#374151" }}>----------------------------------------------------</span>
            </h2>
        </div>
    );
}
