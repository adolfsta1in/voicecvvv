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

export default function MinimalTemplate({ cv, onFieldChange }: TemplateProps) {
    const { dispatch } = useCVStore();

    const sectionComponents: Record<string, React.ReactNode> = {
        summary: cv.summary && (
            <div style={{ marginBottom: 24 }}>
                <MinSection title="About" />
                <EditableText value={cv.summary} path="summary" onFieldChange={onFieldChange} tag="p"
                    style={{ fontSize: "0.875em", color: "#374151", lineHeight: 1.75 }} />
            </div>
        ),
        experience: cv.experience.length > 0 && (
            <div style={{ marginBottom: 24 }}>
                <MinSection title="Experience" />
                <SortableList
                    items={cv.experience}
                    onReorder={(newOrder) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "experience", newOrder } });
                    }}
                >
                    {cv.experience.map((exp, ei) => (
                        <SortableItem key={exp.id} id={exp.id} handleStyle={{ top: 0, left: -24 }}>
                            <div style={{ marginBottom: 18 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <EditableText value={exp.jobTitle} path={`experience.${ei}.jobTitle`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.9375em", fontWeight: 700, color: "#111827" }} />
                                    <span style={{ fontSize: "0.75em", color: "#9ca3af", flexShrink: 0 }}>
                                        <EditableText value={exp.startDate} path={`experience.${ei}.startDate`} onFieldChange={onFieldChange} /> – <EditableText value={exp.endDate} path={`experience.${ei}.endDate`} onFieldChange={onFieldChange} />
                                    </span>
                                </div>
                                <div style={{ fontSize: "0.8125em", color: "#6b7280", marginBottom: 6 }}>
                                    <EditableText value={exp.company} path={`experience.${ei}.company`} onFieldChange={onFieldChange} />
                                    {exp.location && <span> · <EditableText value={exp.location} path={`experience.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                </div>
                                {exp.description.map((d, di) => (
                                    <div key={di} style={{ display: "flex", gap: 8, fontSize: "0.8125em", color: "#374151", lineHeight: 1.65, marginBottom: 2 }}>
                                        <span style={{ color: "#9ca3af", flexShrink: 0 }}>—</span>
                                        <EditableText value={d} path={`experience.${ei}.description.${di}`} onFieldChange={onFieldChange} />
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
                <MinSection title="Education" />
                <SortableList
                    items={cv.education}
                    onReorder={(newOrder) => {
                        dispatch({ type: "REORDER_LIST", payload: { path: "education", newOrder } });
                    }}
                >
                    {cv.education.map((edu, ei) => (
                        <SortableItem key={edu.id} id={edu.id} handleStyle={{ top: 0, left: -24 }}>
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <EditableText value={edu.degree} path={`education.${ei}.degree`} onFieldChange={onFieldChange} tag="h3"
                                        style={{ fontSize: "0.9375em", fontWeight: 700, color: "#111827" }} />
                                    <span style={{ fontSize: "0.75em", color: "#9ca3af", flexShrink: 0 }}>
                                        <EditableText value={edu.startDate} path={`education.${ei}.startDate`} onFieldChange={onFieldChange} /> – <EditableText value={edu.endDate} path={`education.${ei}.endDate`} onFieldChange={onFieldChange} />
                                    </span>
                                </div>
                                <div style={{ fontSize: "0.8125em", color: "#6b7280" }}>
                                    <EditableText value={edu.institution} path={`education.${ei}.institution`} onFieldChange={onFieldChange} />
                                    {edu.location && <span> · <EditableText value={edu.location} path={`education.${ei}.location`} onFieldChange={onFieldChange} /></span>}
                                </div>
                                {edu.gpa && <div style={{ fontSize: "0.8125em", color: "#9ca3af", marginTop: 2 }}>GPA: <EditableText value={edu.gpa} path={`education.${ei}.gpa`} onFieldChange={onFieldChange} /></div>}
                            </div>
                        </SortableItem>
                    ))}
                </SortableList>
            </div>
        ),
        skills: cv.skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
                <MinSection title="Skills" />
                <div style={{ fontSize: "0.8125em", color: "#374151", lineHeight: 1.8 }}>
                    {cv.skills.map((skill, i) => (
                        <React.Fragment key={i}>
                            <EditableText value={skill} path={`skills.${i}`} onFieldChange={onFieldChange} />
                            {i < cv.skills.length - 1 && <span style={{ color: "#d1d5db" }}> · </span>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        ),
        languages: cv.languages && cv.languages.length > 0 && (
            <div style={{ marginBottom: 20 }}>
                <MinSection title="Languages" />
                <div style={{ fontSize: "0.8125em", color: "#374151" }}>
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
            <div>
                <MinSection title="Certifications" />
                <ul style={{ paddingLeft: 18, listStyleType: "square", color: "#9ca3af" }}>
                    {cv.certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: "0.8125em", color: "#374151", lineHeight: 1.6, marginBottom: 4 }}>
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
        <div style={{ fontFamily: "'Inter', sans-serif", color: "#111827", background: "white" }}>
            {/* Header */}
            {cv.personalInfo.fullName && (
                <div style={{ marginBottom: 28, borderBottom: "1px solid #e5e7eb", paddingBottom: 20 }}>
                    <EditableText value={cv.personalInfo.fullName} path="personalInfo.fullName" onFieldChange={onFieldChange} tag="h1"
                        style={{ fontSize: "2em", fontWeight: 800, color: "#111827", marginBottom: 6, display: "block", letterSpacing: "-0.04em" }} />
                    {cv.personalInfo.title && (
                        <EditableText value={cv.personalInfo.title} path="personalInfo.title" onFieldChange={onFieldChange} tag="div"
                            style={{ fontSize: "1em", color: "#6b7280", fontWeight: 400, marginBottom: 10 }} />
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: "0.8em", color: "#9ca3af" }}>
                        {cv.personalInfo.email && <EditableText value={cv.personalInfo.email} path="personalInfo.email" onFieldChange={onFieldChange} />}
                        {cv.personalInfo.phone && <EditableText value={cv.personalInfo.phone} path="personalInfo.phone" onFieldChange={onFieldChange} />}
                        {cv.personalInfo.location && <EditableText value={cv.personalInfo.location} path="personalInfo.location" onFieldChange={onFieldChange} />}
                        {cv.personalInfo.linkedin && <EditableText value={cv.personalInfo.linkedin} path="personalInfo.linkedin" onFieldChange={onFieldChange} />}
                    </div>
                </div>
            )}

            {/* Sortable Main Sections */}
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
    );
}

function MinSection({ title }: { title: string }) {
    return (
        <div style={{ fontSize: "0.6875em", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#9ca3af", marginBottom: 10 }}>
            {title}
        </div>
    );
}
