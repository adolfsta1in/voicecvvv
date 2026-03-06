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

export default function ExecutiveTemplate({ cv, onFieldChange }: TemplateProps) {
    const { dispatch } = useCVStore();
    const accent = cv.layout?.themeColor || "#0ea5e9";
    const headerBg = "#0f172a";

    const sectionComponents: Record<string, React.ReactNode> = {
        summary: cv.summary && (
            <div style={{ marginBottom: 26 }}>
                <ExecSection title="Executive Summary" accent={accent} />
                <div style={{ background: "#f8fafc", borderLeft: `4px solid ${accent}`, padding: "14px 18px", borderRadius: "0 8px 8px 0" }}>
                    <EditableText value={cv.summary} path="summary" onFieldChange={onFieldChange} tag="p"
                        style={{ fontSize: "0.875em", color: "#334155", lineHeight: 1.75, fontStyle: "italic" }} />
                </div>
            </div>
        ),
        experience: cv.experience.length > 0 && (
            <div style={{ marginBottom: 26 }}>
                <ExecSection title="Professional Experience" accent={accent} />
                <SortableList
                    items={cv.experience}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "experience", newOrder } });
                    }}
                >
                    {cv.experience.map((exp, ei) => (
                        <SortableItem key={exp.id} id={exp.id} handleStyle={{ top: 0, left: -28 }}>
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                                    <div>
                                        <EditableText value={exp.jobTitle} path={`experience.${ei}.jobTitle`} onFieldChange={onFieldChange} tag="h3"
                                            style={{ fontSize: "1em", fontWeight: 800, color: "#0f172a" }} />
                                        <div style={{ fontSize: "0.8125em", color: accent, fontWeight: 600 }}>
                                            <EditableText value={exp.company} path={`experience.${ei}.company`} onFieldChange={onFieldChange} />
                                            {exp.location && <span style={{ color: "#94a3b8", fontWeight: 400 }}> · <EditableText value={exp.location} path={`experience.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                        </div>
                                    </div>
                                    <div style={{ background: "#f1f5f9", borderRadius: 6, padding: "3px 10px", fontSize: "0.75em", color: "#64748b", fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>
                                        <EditableText value={exp.startDate} path={`experience.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={exp.endDate} path={`experience.${ei}.endDate`} onFieldChange={onFieldChange} />
                                    </div>
                                </div>
                                {exp.description.length > 0 && (
                                    <ul style={{ paddingLeft: 18, listStyleType: "disc", marginTop: 6 }}>
                                        {exp.description.map((d, di) => (
                                            <li key={di} style={{ fontSize: "0.8125em", color: "#475569", lineHeight: 1.65, marginBottom: 3 }}>
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
            <div style={{ marginBottom: 26 }}>
                <ExecSection title="Education" accent={accent} />
                <SortableList
                    items={cv.education}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "education", newOrder } });
                    }}
                >
                    {cv.education.map((edu, ei) => (
                        <SortableItem key={edu.id} id={edu.id} handleStyle={{ top: 0, left: -28 }}>
                            <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <EditableText value={edu.degree} path={`education.${ei}.degree`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.9375em", fontWeight: 700, color: "#0f172a" }} />
                                    <div style={{ fontSize: "0.8125em", color: accent, fontWeight: 500 }}>
                                        <EditableText value={edu.institution} path={`education.${ei}.institution`} onFieldChange={onFieldChange} />
                                        {edu.location && <span style={{ color: "#94a3b8", fontWeight: 400 }}> · <EditableText value={edu.location} path={`education.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                    </div>
                                    {edu.gpa && <div style={{ fontSize: "0.8em", color: "#94a3b8", marginTop: 2 }}>GPA: <EditableText value={edu.gpa} path={`education.${ei}.gpa`} onFieldChange={onFieldChange} /></div>}
                                </div>
                                <div style={{ background: "#f1f5f9", borderRadius: 6, padding: "3px 10px", fontSize: "0.75em", color: "#64748b", fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>
                                    <EditableText value={edu.startDate} path={`education.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={edu.endDate} path={`education.${ei}.endDate`} onFieldChange={onFieldChange} />
                                </div>
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        skills: cv.skills.length > 0 && (
            <div>
                <ExecSection title="Core Competencies" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cv.skills.map((skill, i) => (
                        <span key={i} style={{ fontSize: "0.75em", padding: "4px 12px", background: "#e0f2fe", color: "#0369a1", borderRadius: 20, fontWeight: 500 }}>
                            <EditableText value={skill} path={`skills.${i}`} onFieldChange={onFieldChange} />
                        </span>
                    ))}
                </div>
            </div>
        ),
        languages: cv.languages && cv.languages.length > 0 && (
            <div>
                <ExecSection title="Languages" accent={accent} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {cv.languages.map((lang, i) => (
                        <span key={i} style={{ fontSize: "0.75em", padding: "4px 12px", background: "#f1f5f9", color: "#475569", borderRadius: 20, fontWeight: 500 }}>
                            <EditableText value={lang} path={`languages.${i}`} onFieldChange={onFieldChange} />
                        </span>
                    ))}
                </div>
            </div>
        ),
        certifications: cv.certifications && cv.certifications.length > 0 && (
            <div>
                <ExecSection title="Certifications" accent={accent} />
                <ul style={{ paddingLeft: 16, listStyleType: "none" }}>
                    {cv.certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: "0.8125em", color: "#475569", lineHeight: 1.6, marginBottom: 4 }}>
                            ✦ <EditableText value={cert} path={`certifications.${i}`} onFieldChange={onFieldChange} />
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
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1a1a2e", background: "white" }}>
            {/* Bold Header Bar */}
            {cv.personalInfo.fullName && (
                <div style={{ background: headerBg, color: "white", padding: "32px 40px", marginBottom: 28 }}>
                    <EditableText value={cv.personalInfo.fullName} path="personalInfo.fullName" onFieldChange={onFieldChange} tag="h1"
                        style={{ fontSize: "2.25em", fontWeight: 900, color: "white", letterSpacing: "-0.04em", marginBottom: 6, display: "block" }} />
                    {cv.personalInfo.title && (
                        <EditableText value={cv.personalInfo.title} path="personalInfo.title" onFieldChange={onFieldChange} tag="div"
                            style={{ fontSize: "1em", color: accent, fontWeight: 600, marginBottom: 14 }} />
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: "0.8em", color: "#94a3b8" }}>
                        {cv.personalInfo.email && <EditableText value={cv.personalInfo.email} path="personalInfo.email" onFieldChange={onFieldChange} style={{ color: "#94a3b8" }} />}
                        {cv.personalInfo.phone && <EditableText value={cv.personalInfo.phone} path="personalInfo.phone" onFieldChange={onFieldChange} style={{ color: "#94a3b8" }} />}
                        {cv.personalInfo.location && <EditableText value={cv.personalInfo.location} path="personalInfo.location" onFieldChange={onFieldChange} style={{ color: "#94a3b8" }} />}
                        {cv.personalInfo.linkedin && <EditableText value={cv.personalInfo.linkedin} path="personalInfo.linkedin" onFieldChange={onFieldChange} style={{ color: "#94a3b8" }} />}
                    </div>
                </div>
            )}

            <div style={{ padding: "0 40px 40px" }}>
                <SortableList
                    items={sectionOrderItems}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_SECTIONS", payload: newOrder.map((o: { id: string }) => o.id) });
                    }}
                >
                    {sectionOrderItems.map((item) => {
                        if (item.id === "skills" || item.id === "certifications") {
                            // We need to group skills and certifications into a two column layout if they are next to each other
                            // But for simplicity of reordering, we'll keep them as normal blocks here, 
                            // to support drag and drop we can't easily put them side by side in a generic list.
                            // I will keep them stacked for now. User might place them anywhere.
                        }

                        return (
                            <div key={item.id} style={{ marginBottom: (item.id === "skills" || item.id === "languages" || item.id === "certifications") ? 22 : 0 }}>
                                <SortableItem id={item.id}>
                                    {sectionComponents[item.id]}
                                </SortableItem>
                            </div>
                        );
                    })}
                </SortableList>
            </div>
        </div>
    );
}

function ExecSection({ title, accent }: { title: string; accent: string }) {
    return (
        <h2 style={{ fontSize: "0.75em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: accent, borderBottom: `1px solid #e2e8f0`, paddingBottom: 6, marginBottom: 12 }}>
            {title}
        </h2>
    );
}
