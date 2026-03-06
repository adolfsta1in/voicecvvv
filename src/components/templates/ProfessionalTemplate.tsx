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

export default function ProfessionalTemplate({ cv, onFieldChange }: TemplateProps) {
    const { dispatch } = useCVStore();
    const accent = cv.layout?.themeColor || "#2563eb";

    const sectionComponents: Record<string, React.ReactNode> = {
        summary: cv.summary && (
            <div style={{ marginBottom: 20 }}>
                <SectionHeader title="Professional Summary" accent={accent} />
                <EditableText
                    value={cv.summary}
                    path="summary"
                    onFieldChange={onFieldChange}
                    tag="p"
                    style={{ fontSize: "0.875em", color: "#374151", lineHeight: 1.5 }}
                />
            </div>
        ),
        experience: cv.experience.length > 0 && (
            <div style={{ marginBottom: 20 }}>
                <SectionHeader title="Professional Experience" accent={accent} />
                <SortableList
                    items={cv.experience}
                    onReorder={(newOrder) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "experience", newOrder } });
                    }}
                >
                    {cv.experience.map((exp, ei) => (
                        <SortableItem key={exp.id} id={exp.id} handleStyle={{ top: 0, left: -28 }}>
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                                    <EditableText value={exp.jobTitle} path={`experience.${ei}.jobTitle`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.9375em", fontWeight: 700, color: "#111827" }} />
                                    <span style={{ fontSize: "0.8125em", color: "#4b5563", flexShrink: 0, marginLeft: 8, fontWeight: 500 }}>
                                        <EditableText value={exp.startDate} path={`experience.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={exp.endDate} path={`experience.${ei}.endDate`} onFieldChange={onFieldChange} />
                                    </span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                                    <div style={{ fontSize: "0.875em", color: accent, fontWeight: 600 }}>
                                        <EditableText value={exp.company} path={`experience.${ei}.company`} onFieldChange={onFieldChange} />
                                    </div>
                                    {exp.location && <span style={{ fontSize: "0.8125em", color: "#6b7280", fontStyle: "italic" }}><EditableText value={exp.location} path={`experience.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                </div>
                                {exp.description.length > 0 && (
                                    <ul style={{ paddingLeft: 18, listStyleType: "disc", display: "flex", flexDirection: "column", gap: 2 }}>
                                        {exp.description.map((d, di) => (
                                            <li key={di} style={{ fontSize: "0.875em", color: "#374151", lineHeight: 1.5 }}>
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
            <div style={{ marginBottom: 20 }}>
                <SectionHeader title="Education" accent={accent} />
                <SortableList
                    items={cv.education}
                    onReorder={(newOrder) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "education", newOrder } });
                    }}
                >
                    {cv.education.map((edu, ei) => (
                        <SortableItem key={edu.id} id={edu.id} handleStyle={{ top: 0, left: -28 }}>
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                                    <EditableText value={edu.degree} path={`education.${ei}.degree`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.9375em", fontWeight: 700, color: "#111827" }} />
                                    <span style={{ fontSize: "0.8125em", color: "#4b5563", flexShrink: 0, marginLeft: 8, fontWeight: 500 }}>
                                        <EditableText value={edu.startDate} path={`education.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={edu.endDate} path={`education.${ei}.endDate`} onFieldChange={onFieldChange} />
                                    </span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                                    <div style={{ fontSize: "0.875em", color: accent, fontWeight: 600 }}>
                                        <EditableText value={edu.institution} path={`education.${ei}.institution`} onFieldChange={onFieldChange} />
                                    </div>
                                    {edu.location && <span style={{ fontSize: "0.8125em", color: "#6b7280", fontStyle: "italic" }}><EditableText value={edu.location} path={`education.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                </div>
                                {edu.gpa && <div style={{ fontSize: "0.8125em", color: "#4b5563" }}>GPA: <EditableText value={edu.gpa} path={`education.${ei}.gpa`} onFieldChange={onFieldChange} /></div>}
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        skills: cv.skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
                <SectionHeader title="Core Competencies" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                    {cv.skills.map((skill, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: accent, fontSize: "1em", lineHeight: 1 }}>•</span>
                            <span style={{ fontSize: "0.875em", color: "#374151" }}>
                                <EditableText value={skill} path={`skills.${i}`} onFieldChange={onFieldChange} />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ),
        languages: cv.languages && cv.languages.length > 0 && (
            <div style={{ marginBottom: 20 }}>
                <SectionHeader title="Languages" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                    {cv.languages.map((lang, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: accent, fontSize: "1em", lineHeight: 1 }}>•</span>
                            <span style={{ fontSize: "0.875em", color: "#374151" }}>
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
                <ul style={{ paddingLeft: 18, listStyleType: "disc", display: "flex", flexDirection: "column", gap: 2 }}>
                    {cv.certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: "0.875em", color: "#374151", lineHeight: 1.5 }}>
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
        <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: "#111827", background: "white", padding: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>

                {/* Header Section */}
                {cv.personalInfo.fullName && (
                    <div style={{ marginBottom: 24, textAlign: "center" }}>
                        <EditableText
                            value={cv.personalInfo.fullName}
                            path="personalInfo.fullName"
                            onFieldChange={onFieldChange}
                            tag="h1"
                            placeholder="Your Name"
                            style={{ fontSize: "2.25em", fontWeight: 700, color: "#111827", letterSpacing: "0.02em", textTransform: "uppercase", marginBottom: 4, display: "block" }}
                        />
                        {cv.personalInfo.title && (
                            <EditableText
                                value={cv.personalInfo.title}
                                path="personalInfo.title"
                                onFieldChange={onFieldChange}
                                tag="div"
                                style={{ fontSize: "1.125em", color: accent, fontWeight: 400, marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}
                            />
                        )}
                        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 12px", fontSize: "0.875em", color: "#4b5563" }}>
                            {cv.personalInfo.email && <EditableText value={cv.personalInfo.email} path="personalInfo.email" onFieldChange={onFieldChange} />}
                            {cv.personalInfo.phone && <span>| <EditableText value={cv.personalInfo.phone} path="personalInfo.phone" onFieldChange={onFieldChange} /></span>}
                            {cv.personalInfo.location && <span>| <EditableText value={cv.personalInfo.location} path="personalInfo.location" onFieldChange={onFieldChange} /></span>}
                            {cv.personalInfo.linkedin && <span>| <EditableText value={cv.personalInfo.linkedin} path="personalInfo.linkedin" onFieldChange={onFieldChange} /></span>}
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
        <div style={{ marginBottom: 12 }}>
            <h2 style={{
                fontSize: "1em", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.05em", color: "#111827", margin: 0, paddingBottom: 4
            }}>
                {title}
            </h2>
            <div style={{ height: 2, width: "100%", background: "#e5e7eb" }}>
                <div style={{ height: 2, width: 40, background: accent }} />
            </div>
        </div>
    );
}
