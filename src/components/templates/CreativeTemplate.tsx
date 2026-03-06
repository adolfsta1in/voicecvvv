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

export default function CreativeTemplate({ cv, onFieldChange }: TemplateProps) {
    const { dispatch } = useCVStore();
    const accent = cv.layout?.themeColor || "#f59e0b";
    const accent2 = "#ef4444";

    const sectionComponents: Record<string, React.ReactNode> = {
        summary: cv.summary && (
            <div style={{ marginBottom: 24 }}>
                <CreSection title="About Me" accent={accent} />
                <EditableText value={cv.summary} path="summary" onFieldChange={onFieldChange} tag="p"
                    style={{ fontSize: "0.8125em", color: "#374151", lineHeight: 1.75 }} />
            </div>
        ),
        experience: cv.experience.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <CreSection title="Experience" accent={accent} />
                <SortableList
                    items={cv.experience}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "experience", newOrder } });
                    }}
                >
                    {cv.experience.map((exp, ei) => (
                        <SortableItem key={exp.id} id={exp.id} handleStyle={{ top: 0, left: -24 }}>
                            <div style={{ marginBottom: 18, display: "flex", gap: 14 }}>
                                {/* Timeline dot */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent2})`, marginTop: 4 }} />
                                    {ei < cv.experience.length - 1 && <div style={{ width: 2, flex: 1, background: "#fde68a", marginTop: 4 }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 1 }}>
                                        <EditableText value={exp.jobTitle} path={`experience.${ei}.jobTitle`} onFieldChange={onFieldChange} tag="h3"
                                            style={{ fontSize: "0.9375em", fontWeight: 700, color: "#1a1a2e" }} />
                                        <span style={{ fontSize: "0.72em", color: "#9ca3af", flexShrink: 0, marginLeft: 8 }}>
                                            <EditableText value={exp.startDate} path={`experience.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={exp.endDate} path={`experience.${ei}.endDate`} onFieldChange={onFieldChange} />
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "0.8em", color: accent, fontWeight: 600, marginBottom: 5 }}>
                                        <EditableText value={exp.company} path={`experience.${ei}.company`} onFieldChange={onFieldChange} />
                                        {exp.location && <span style={{ color: "#9ca3af", fontWeight: 400 }}> · <EditableText value={exp.location} path={`experience.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                    </div>
                                    {exp.description.map((d, di) => (
                                        <div key={di} style={{ fontSize: "0.8em", color: "#374151", lineHeight: 1.6, marginBottom: 2 }}>
                                            → <EditableText value={d} path={`experience.${ei}.description.${di}`} onFieldChange={onFieldChange} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        education: cv.education.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <CreSection title="Education" accent={accent} />
                <SortableList
                    items={cv.education}
                    onReorder={(newOrder: { id: string }[]) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "education", newOrder } });
                    }}
                >
                    {cv.education.map((edu, ei) => (
                        <SortableItem key={edu.id} id={edu.id} handleStyle={{ top: 0, left: -24 }}>
                            <div style={{ marginBottom: 12, display: "flex", gap: 14 }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${accent}`, background: "white", marginTop: 4 }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                        <EditableText value={edu.degree} path={`education.${ei}.degree`} onFieldChange={onFieldChange} tag="h3"
                                            style={{ fontSize: "0.9375em", fontWeight: 700, color: "#1a1a2e" }} />
                                        <span style={{ fontSize: "0.72em", color: "#9ca3af", flexShrink: 0, marginLeft: 8 }}>
                                            <EditableText value={edu.startDate} path={`education.${ei}.startDate`} onFieldChange={onFieldChange} /> — <EditableText value={edu.endDate} path={`education.${ei}.endDate`} onFieldChange={onFieldChange} />
                                        </span>
                                    </div>
                                    <div style={{ fontSize: "0.8em", color: "#6b7280" }}>
                                        <EditableText value={edu.institution} path={`education.${ei}.institution`} onFieldChange={onFieldChange} />
                                        {edu.location && <span> · <EditableText value={edu.location} path={`education.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                    </div>
                                </div>
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        skills: cv.skills.length > 0 && (
            <div style={{ marginBottom: 22 }}>
                <CreSection title="Skills" accent={accent} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cv.skills.map((skill, i) => {
                        const colours = ["#fef3c7", "#fee2e2", "#fce7f3", "#dbeafe", "#ecfdf5", "#ede9fe"];
                        const textColours = ["#92400e", "#991b1b", "#9d174d", "#1e40af", "#065f46", "#5b21b6"];
                        const ci = i % colours.length;
                        return (
                            <span key={i} style={{ fontSize: "0.75em", padding: "4px 12px", background: colours[ci], color: textColours[ci], borderRadius: 20, fontWeight: 500 }}>
                                <EditableText value={skill} path={`skills.${i}`} onFieldChange={onFieldChange} />
                            </span>
                        );
                    })}
                </div>
            </div>
        ),
        languages: cv.languages && cv.languages.length > 0 && (
            <div style={{ marginBottom: 22 }}>
                <CreSection title="Languages" accent={accent} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {cv.languages.map((lang, i) => (
                        <span key={i} style={{ fontSize: "0.75em", padding: "4px 12px", background: "#fef3c7", color: "#92400e", borderRadius: 20, fontWeight: 500 }}>
                            <EditableText value={lang} path={`languages.${i}`} onFieldChange={onFieldChange} />
                        </span>
                    ))}
                </div>
            </div>
        ),
        certifications: cv.certifications && cv.certifications.length > 0 && (
            <div style={{ marginBottom: 22 }}>
                <CreSection title="Certifications" accent={accent} />
                <ul style={{ paddingLeft: 16, listStyleType: "none", margin: 0 }}>
                    {cv.certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: "0.8125em", color: "#374151", lineHeight: 1.6, marginBottom: 4 }}>
                            ✦ <EditableText value={cert} path={`certifications.${i}`} onFieldChange={onFieldChange} />
                        </li>
                    ))}
                </ul>
            </div>
        )
    };

    const sectionOrderItems = (cv.layout?.sectionOrder || ["summary", "experience", "education", "skills", "languages", "certifications"]).map((id) => {
        if (!sectionComponents[id]) return null;
        return { id };
    }).filter(Boolean) as { id: string }[];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#1a1a2e", background: "white", display: "flex", flex: 1 }}>
            {/* Left colour strip */}
            <div style={{ width: 6, background: `linear-gradient(180deg, ${accent}, ${accent2})`, borderRadius: "4px 0 0 4px", flexShrink: 0 }} />

            <div style={{ flex: 1, padding: "36px 36px 36px 30px" }}>
                {/* Header */}
                {cv.personalInfo.fullName && (
                    <div style={{ marginBottom: 26, paddingBottom: 18, borderBottom: `2px dashed #fde68a` }}>
                        <EditableText value={cv.personalInfo.fullName} path="personalInfo.fullName" onFieldChange={onFieldChange} tag="h1"
                            style={{ fontSize: "2em", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.04em", marginBottom: 6, display: "block" }} />
                        {cv.personalInfo.title && (
                            <div style={{ display: "inline-flex" }}>
                                <EditableText value={cv.personalInfo.title} path="personalInfo.title" onFieldChange={onFieldChange} tag="span"
                                    style={{
                                        fontSize: "0.875em", fontWeight: 600, marginBottom: 12,
                                        background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                    }} />
                            </div>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px", fontSize: "0.775em", color: "#9ca3af", marginTop: 6 }}>
                            {cv.personalInfo.email && <EditableText value={cv.personalInfo.email} path="personalInfo.email" onFieldChange={onFieldChange} />}
                            {cv.personalInfo.phone && <EditableText value={cv.personalInfo.phone} path="personalInfo.phone" onFieldChange={onFieldChange} />}
                            {cv.personalInfo.location && <EditableText value={cv.personalInfo.location} path="personalInfo.location" onFieldChange={onFieldChange} />}
                            {cv.personalInfo.linkedin && <EditableText value={cv.personalInfo.linkedin} path="personalInfo.linkedin" onFieldChange={onFieldChange} />}
                        </div>
                    </div>
                )}

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

function CreSection({ title, accent }: { title: string; accent: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 18, height: 2, background: accent, borderRadius: 1 }} />
            <h2 style={{ fontSize: "0.8125em", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#1a1a2e" }}>
                {title}
            </h2>
        </div>
    );
}
