"use client";

import React from "react";
import { useCVStore } from "@/lib/cv-store";

export default function CVPreview() {
    const { state } = useCVStore();
    const cv = state.cvData;

    const hasAnyContent =
        cv.personalInfo.fullName ||
        cv.summary ||
        cv.experience.length > 0 ||
        cv.education.length > 0 ||
        cv.skills.length > 0;

    return (
        <div
            style={{
                height: "100%",
                overflowY: "auto",
                padding: "32px 24px",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div
                id="cv-preview-content"
                className="cv-document"
                style={{
                    width: "100%",
                    maxWidth: 700,
                    minHeight: 900,
                    padding: "48px 48px",
                    borderRadius: 8,
                    boxShadow:
                        "0 1px 3px rgba(0,0,0,0.08), 0 8px 30px rgba(0,0,0,0.06)",
                    border: "1px solid #e5e7eb",
                    position: "relative",
                }}
            >
                {!hasAnyContent ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            minHeight: 600,
                            textAlign: "center",
                            color: "#94a3b8",
                        }}
                    >
                        <div style={{ fontSize: "3rem", marginBottom: 16 }}>📄</div>
                        <div style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 8, color: "#64748b" }}>
                            Your CV will appear here
                        </div>
                        <div style={{ fontSize: "0.875rem", maxWidth: 300, lineHeight: 1.6 }}>
                            Start chatting with the AI assistant on the left. As you answer questions, your resume will build itself in real time.
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {/* Header */}
                        {cv.personalInfo.fullName && (
                            <div
                                className="animate-fade-in-up"
                                style={{ marginBottom: 24, textAlign: "center" }}
                            >
                                <h1
                                    style={{
                                        fontSize: "1.75rem",
                                        fontWeight: 800,
                                        color: "#1a1a2e",
                                        marginBottom: 4,
                                    }}
                                >
                                    {cv.personalInfo.fullName}
                                </h1>
                                {cv.personalInfo.title && (
                                    <div
                                        style={{
                                            fontSize: "1rem",
                                            color: "#6366f1",
                                            fontWeight: 500,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {cv.personalInfo.title}
                                    </div>
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        flexWrap: "wrap",
                                        gap: "8px 16px",
                                        fontSize: "0.8125rem",
                                        color: "#6b7280",
                                    }}
                                >
                                    {cv.personalInfo.email && (
                                        <span>{cv.personalInfo.email}</span>
                                    )}
                                    {cv.personalInfo.phone && (
                                        <span>•  {cv.personalInfo.phone}</span>
                                    )}
                                    {cv.personalInfo.location && (
                                        <span>•  {cv.personalInfo.location}</span>
                                    )}
                                    {cv.personalInfo.linkedin && (
                                        <span>•  {cv.personalInfo.linkedin}</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        {cv.summary && (
                            <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
                                <h2
                                    style={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "#6366f1",
                                        borderBottom: "2px solid #6366f1",
                                        paddingBottom: 4,
                                        marginBottom: 10,
                                    }}
                                >
                                    Professional Summary
                                </h2>
                                <p
                                    style={{
                                        fontSize: "0.8125rem",
                                        color: "#374151",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {cv.summary}
                                </p>
                            </div>
                        )}

                        {/* Experience */}
                        {cv.experience.length > 0 && (
                            <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
                                <h2
                                    style={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "#6366f1",
                                        borderBottom: "2px solid #6366f1",
                                        paddingBottom: 4,
                                        marginBottom: 14,
                                    }}
                                >
                                    Experience
                                </h2>
                                {cv.experience.map((exp) => (
                                    <div
                                        key={exp.id}
                                        className="animate-fade-in-up"
                                        style={{ marginBottom: 16 }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "baseline",
                                                marginBottom: 2,
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontSize: "0.9375rem",
                                                    fontWeight: 700,
                                                    color: "#1a1a2e",
                                                }}
                                            >
                                                {exp.jobTitle}
                                            </h3>
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "#6b7280",
                                                    flexShrink: 0,
                                                    marginLeft: 8,
                                                }}
                                            >
                                                {exp.startDate} — {exp.endDate}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "0.8125rem",
                                                color: "#6366f1",
                                                fontWeight: 500,
                                                marginBottom: 6,
                                            }}
                                        >
                                            {exp.company}
                                            {exp.location ? ` · ${exp.location}` : ""}
                                        </div>
                                        {exp.description.length > 0 && (
                                            <ul
                                                style={{
                                                    paddingLeft: 18,
                                                    listStyleType: "disc",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 3,
                                                }}
                                            >
                                                {exp.description.map((d, i) => (
                                                    <li
                                                        key={i}
                                                        style={{
                                                            fontSize: "0.8125rem",
                                                            color: "#374151",
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Education */}
                        {cv.education.length > 0 && (
                            <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
                                <h2
                                    style={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "#6366f1",
                                        borderBottom: "2px solid #6366f1",
                                        paddingBottom: 4,
                                        marginBottom: 14,
                                    }}
                                >
                                    Education
                                </h2>
                                {cv.education.map((edu) => (
                                    <div
                                        key={edu.id}
                                        className="animate-fade-in-up"
                                        style={{ marginBottom: 12 }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "baseline",
                                                marginBottom: 2,
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontSize: "0.9375rem",
                                                    fontWeight: 700,
                                                    color: "#1a1a2e",
                                                }}
                                            >
                                                {edu.degree}
                                            </h3>
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "#6b7280",
                                                    flexShrink: 0,
                                                    marginLeft: 8,
                                                }}
                                            >
                                                {edu.startDate} — {edu.endDate}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "0.8125rem",
                                                color: "#6366f1",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {edu.institution}
                                            {edu.location ? ` · ${edu.location}` : ""}
                                        </div>
                                        {edu.gpa && (
                                            <div
                                                style={{
                                                    fontSize: "0.8125rem",
                                                    color: "#6b7280",
                                                    marginTop: 2,
                                                }}
                                            >
                                                GPA: {edu.gpa}
                                            </div>
                                        )}
                                        {edu.highlights && edu.highlights.length > 0 && (
                                            <ul style={{ paddingLeft: 18, listStyleType: "disc", marginTop: 4 }}>
                                                {edu.highlights.map((h, i) => (
                                                    <li
                                                        key={i}
                                                        style={{
                                                            fontSize: "0.8125rem",
                                                            color: "#374151",
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        {h}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Skills */}
                        {cv.skills.length > 0 && (
                            <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
                                <h2
                                    style={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "#6366f1",
                                        borderBottom: "2px solid #6366f1",
                                        paddingBottom: 4,
                                        marginBottom: 10,
                                    }}
                                >
                                    Skills
                                </h2>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {cv.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                fontSize: "0.75rem",
                                                padding: "4px 12px",
                                                background: "#f0f0ff",
                                                color: "#4f46e5",
                                                borderRadius: 20,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {cv.languages && cv.languages.length > 0 && (
                            <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
                                <h2
                                    style={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "#6366f1",
                                        borderBottom: "2px solid #6366f1",
                                        paddingBottom: 4,
                                        marginBottom: 10,
                                    }}
                                >
                                    Languages
                                </h2>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 6,
                                    }}
                                >
                                    {cv.languages.map((lang, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                fontSize: "0.75rem",
                                                padding: "4px 12px",
                                                background: "#fef3c7",
                                                color: "#92400e",
                                                borderRadius: 20,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certifications */}
                        {cv.certifications && cv.certifications.length > 0 && (
                            <div className="animate-fade-in-up">
                                <h2
                                    style={{
                                        fontSize: "0.8125rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "#6366f1",
                                        borderBottom: "2px solid #6366f1",
                                        paddingBottom: 4,
                                        marginBottom: 10,
                                    }}
                                >
                                    Certifications
                                </h2>
                                <ul style={{ paddingLeft: 18, listStyleType: "disc" }}>
                                    {cv.certifications.map((cert, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                fontSize: "0.8125rem",
                                                color: "#374151",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {cert}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
