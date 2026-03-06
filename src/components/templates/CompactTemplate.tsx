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

export default function CompactTemplate({ cv, onFieldChange }: TemplateProps) {
    const { dispatch } = useCVStore();
    const accent = cv.layout?.themeColor || "#8b5cf6";

    const sectionComponents: Record<string, React.ReactNode> = {
        summary: cv.summary && (
            <div style={{ marginBottom: 16 }}>
                <CmpSection title="Summary" accent={accent} />
                <EditableText value={cv.summary} path="summary" onFieldChange={onFieldChange} tag="p"
                    style={{ fontSize: "0.78em", color: "#374151", lineHeight: 1.6 }} />
            </div>
        ),
        experience: cv.experience.length > 0 && (
            <div style={{ marginBottom: 16 }}>
                <CmpSection title="Experience" accent={accent} />
                <SortableList
                    items={cv.experience}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "experience", newOrder } });
                    }}
                >
                    {cv.experience.map((exp, ei) => (
                        <SortableItem key={exp.id} id={exp.id} handleStyle={{ top: 0, left: -24 }}>
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <EditableText value={exp.jobTitle} path={`experience.${ei}.jobTitle`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.8125em", fontWeight: 700, color: "#1a1a2e" }} />
                                    <span style={{ fontSize: "0.68em", color: "#9ca3af", flexShrink: 0, marginLeft: 6 }}>
                                        <EditableText value={exp.startDate} path={`experience.${ei}.startDate`} onFieldChange={onFieldChange} />–<EditableText value={exp.endDate} path={`experience.${ei}.endDate`} onFieldChange={onFieldChange} />
                                    </span>
                                </div>
                                <div style={{ fontSize: "0.75em", color: accent, fontWeight: 500, marginBottom: 3 }}>
                                    <EditableText value={exp.company} path={`experience.${ei}.company`} onFieldChange={onFieldChange} />
                                    {exp.location && <span style={{ color: "#9ca3af", fontWeight: 400 }}> · <EditableText value={exp.location} path={`experience.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                </div>
                                {exp.description.map((d, di) => (
                                    <div key={di} style={{ fontSize: "0.76em", color: "#374151", lineHeight: 1.5, marginBottom: 1 }}>
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
            <div style={{ marginBottom: 16 }}>
                <CmpSection title="Education" accent={accent} />
                <SortableList
                    items={cv.education}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "education", newOrder } });
                    }}
                >
                    {cv.education.map((edu, ei) => (
                        <SortableItem key={edu.id} id={edu.id} handleStyle={{ top: 0, left: -24 }}>
                            <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <EditableText value={edu.degree} path={`education.${ei}.degree`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.8125em", fontWeight: 700, color: "#1a1a2e" }} />
                                    <div style={{ fontSize: "0.75em", color: accent, fontWeight: 500 }}>
                                        <EditableText value={edu.institution} path={`education.${ei}.institution`} onFieldChange={onFieldChange} />
                                    </div>
                                </div>
                                <div style={{ fontSize: "0.72em", color: "#9ca3af", textAlign: "right" }}>
                                    <EditableText value={edu.startDate} path={`education.${ei}.startDate`} onFieldChange={onFieldChange} />–<EditableText value={edu.endDate} path={`education.${ei}.endDate`} onFieldChange={onFieldChange} />
                                    {edu.gpa && <div>GPA <EditableText value={edu.gpa} path={`education.${ei}.gpa`} onFieldChange={onFieldChange} /></div>}
                                </div>
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        skills: cv.skills.length > 0 && (
            <div style={{ marginBottom: 16 }}>
                <CmpSection title="Skills" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {cv.skills.map((skill, i) => (
                        <span key={i} style={{ fontSize: "0.7em", padding: "2px 8px", background: "#ede9fe", color: "#5b21b6", borderRadius: 12, fontWeight: 500 }}>
                            <EditableText value={skill} path={`skills.${i}`} onFieldChange={onFieldChange} />
                        </span>
                    ))}
                </div>
            </div>
        ),
        languages: cv.languages && cv.languages.length > 0 && (
            <div style={{ marginBottom: 16 }}>
                <CmpSection title="Languages" accent={accent} />
                <div style={{ fontSize: "0.76em", color: "#374151" }}>
                    {cv.languages.map((lang, i) => (
                        <React.Fragment key={i}>
                            <EditableText value={lang} path={`languages.${i}`} onFieldChange={onFieldChange} />
                            {i < (cv.languages?.length ?? 0) - 1 && <span style={{ color: "#d1d5db" }}> · </span>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        ),
        certifications: cv.certifications && cv.certifications.length > 0 && (
            <div style={{ marginBottom: 16 }}>
                <CmpSection title="Certifications" accent={accent} />
                {cv.certifications.map((cert, i) => (
                    <div key={i} style={{ fontSize: "0.76em", color: "#374151", lineHeight: 1.5, marginBottom: 2 }}>
                        · <EditableText value={cert} path={`certifications.${i}`} onFieldChange={onFieldChange} />
                    </div>
                ))}
            </div>
        )
    };

    const sectionOrderItems = (cv.layout?.sectionOrder || ["summary", "experience", "education", "skills", "languages", "certifications"]).map((id) => {
        if (!sectionComponents[id]) return null;
        return { id };
    }).filter(Boolean) as { id: string }[];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1a1a2e", background: "white", fontSize: "0.8em", padding: "0 20px" }}>
            {/* Header */}
            {cv.personalInfo.fullName && (
                <div style={{ marginBottom: 20, borderBottom: `2px solid ${accent}`, paddingBottom: 10, paddingTop: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                            <EditableText value={cv.personalInfo.fullName} path="personalInfo.fullName" onFieldChange={onFieldChange} tag="h1"
                                style={{ fontSize: "1.5em", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.03em", display: "block", marginBottom: 2 }} />
                            {cv.personalInfo.title && (
                                <EditableText value={cv.personalInfo.title} path="personalInfo.title" onFieldChange={onFieldChange} tag="div"
                                    style={{ fontSize: "0.8125em", color: accent, fontWeight: 600 }} />
                            )}
                        </div>
                        <div style={{ textAlign: "right", fontSize: "0.72em", color: "#9ca3af", display: "flex", flexDirection: "column", gap: 2 }}>
                            {cv.personalInfo.email && <EditableText value={cv.personalInfo.email} path="personalInfo.email" onFieldChange={onFieldChange} tag="div" />}
                            {cv.personalInfo.phone && <EditableText value={cv.personalInfo.phone} path="personalInfo.phone" onFieldChange={onFieldChange} tag="div" />}
                            {cv.personalInfo.location && <EditableText value={cv.personalInfo.location} path="personalInfo.location" onFieldChange={onFieldChange} tag="div" />}
                            {cv.personalInfo.linkedin && <EditableText value={cv.personalInfo.linkedin} path="personalInfo.linkedin" onFieldChange={onFieldChange} tag="div" />}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ paddingBottom: 30 }}>
                <SortableList
                    items={sectionOrderItems}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_SECTIONS", payload: newOrder.map((o: { id: string }) => o.id) });
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

function CmpSection({ title, accent }: { title: string; accent: string }) {
    return (
        <h2 style={{ fontSize: "0.7em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginBottom: 8 }}>
            {title}
        </h2>
    );
}
