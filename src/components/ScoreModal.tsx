import React, { useState } from "react";
import { useCVStore } from "@/lib/cv-store";
import ReactMarkdown from "react-markdown";

interface ScoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ScoreModal({ isOpen, onClose }: ScoreModalProps) {
    const { state, dispatch } = useCVStore();
    const { resumeScore, cvData } = state;
    const [answers, setAnswers] = useState<string[]>([]);
    const [isApplying, setIsApplying] = useState(false);

    // Initialize answers array when questions arrive
    React.useEffect(() => {
        if (resumeScore?.questions) {
            setAnswers(new Array(resumeScore.questions.length).fill(""));
        }
    }, [resumeScore]);

    if (!isOpen) return null;

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleApplyImprovements = async () => {
        if (!resumeScore) return;
        setIsApplying(true);
        
        // Formulate a user message from the answers
        const answeredQuestions = resumeScore.questions.map(
            (q, i) => `Q: ${q}\nA: ${answers[i] || "N/A"}`
        ).join("\n\n");
        
        const prompt = `Please update my resume based on the following answers to your previous feedback questions:\n\n${answeredQuestions}`;

        try {
            // First send to chat API to update the CV
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        ...state.messages,
                        { role: "user", content: prompt }
                    ],
                    cvData: cvData,
                }),
            });

            if (!res.ok) throw new Error("Chat API error");
            const data = await res.json();
            
            // Add messages to chat
            const userMsg = {
                id: `user_${Date.now()}`,
                role: "user" as const,
                content: prompt,
                timestamp: new Date(),
            };
            const aiMsg = {
                id: `ai_${Date.now()}`,
                role: "assistant" as const,
                content: data.message,
                timestamp: new Date(),
            };
            
            dispatch({ type: "ADD_MESSAGE", payload: userMsg });
            dispatch({ type: "ADD_MESSAGE", payload: aiMsg });

            if (data.cvUpdate) {
                dispatch({ type: "UPDATE_CV", payload: data.cvUpdate });
                
                // Now trigger a re-score
                dispatch({ type: "SET_SCORING", payload: true });
                const updatedCV = { ...cvData, ...data.cvUpdate };
                
                const scoreRes = await fetch("/api/score", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cvData: updatedCV }),
                });
                
                if (scoreRes.ok) {
                    const scoreData = await scoreRes.json();
                    if (scoreData.score) {
                         dispatch({ type: "SET_SCORE_RESULT", payload: scoreData });
                    }
                }
            }
        } catch (err) {
            console.error("Failed to apply improvements", err);
        } finally {
            setIsApplying(false);
        }
    };

    if (state.isScoring) {
        return (
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
            }}>
                <div style={{
                    background: "var(--surface)", width: "100%", maxWidth: 400,
                    borderRadius: 24, padding: 32, textAlign: "center",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: "50%",
                        border: "3px solid var(--border-color)",
                        borderTopColor: "var(--color-primary)",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 20px"
                    }} />
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>Analyzing Resume</h2>
                    <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                        Our AI is reviewing your resume against industry standards...
                    </p>
                </div>
            </div>
        );
    }

    if (!resumeScore) return null;

    // Determine color based on score
    const scoreColor = resumeScore.score >= 80 ? "#10b981" : resumeScore.score >= 50 ? "#f59e0b" : "#ef4444";

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
            padding: 24
        }}>
            <div style={{
                background: "var(--surface)", width: "100%", maxWidth: 680,
                maxHeight: "90vh", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                animation: "fade-in-up 0.3s ease-out"
            }}>
                {/* Header */}
                <div style={{
                    padding: "24px 32px", borderBottom: "1px solid var(--border-color)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "var(--background)"
                }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems:"center", gap: 8 }}>
                        ✨ Resume AI Score
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none", border: "none", color: "var(--muted)",
                            cursor: "pointer", padding: 4, borderRadius: 8, display: "flex"
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div style={{ overflowY: "auto", padding: "32px", flex: 1 }}>
                    <div style={{ display: "flex", gap: 32, alignItems: "flex-start", marginBottom: 40 }}>
                        {/* Score Circle */}
                        <div style={{
                            width: 120, height: 120, borderRadius: "50%",
                            background: `conic-gradient(${scoreColor} ${resumeScore.score}%, var(--border-color) 0)`,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            position: "relative"
                        }}>
                            <div style={{
                                width: 104, height: 104, borderRadius: "50%", background: "var(--background)",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                            }}>
                                <span style={{ fontSize: "2rem", fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                                    {resumeScore.score}
                                </span>
                                <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>
                                    / 100
                                </span>
                            </div>
                        </div>

                        {/* Feedback list */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 12 }}>Feedback</h3>
                            <ul style={{ paddingLeft: 20, color: "var(--foreground)", fontSize: "0.9375rem", lineHeight: 1.6, gap: 8, display: "flex", flexDirection: "column" }}>
                                {resumeScore.feedback.map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {resumeScore.questions.length > 0 && (
                        <div style={{ background: "var(--background)", borderRadius: 16, padding: 24, border: "1px solid var(--border-color)" }}>
                            <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                💡 How to improve
                            </h3>
                            <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: 20 }}>
                                Answer these questions and our AI will automatically update and strengthen your resume.
                            </p>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {resumeScore.questions.map((q, i) => (
                                    <div key={i}>
                                        <label style={{ display: "block", fontSize: "0.9375rem", fontWeight: 600, marginBottom: 8 }}>
                                            {q}
                                        </label>
                                        <textarea
                                            value={answers[i] || ""}
                                            onChange={(e) => handleAnswerChange(i, e.target.value)}
                                            placeholder="Write your answer here..."
                                            rows={2}
                                            style={{
                                                width: "100%", padding: 12, borderRadius: 12, border: "1px solid var(--border-color)",
                                                background: "var(--surface)", color: "var(--foreground)", fontFamily: "inherit",
                                                resize: "vertical", fontSize: "0.875rem"
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {resumeScore.questions.length > 0 && (
                    <div style={{
                        padding: "20px 32px", borderTop: "1px solid var(--border-color)",
                        display: "flex", justifyContent: "flex-end", background: "var(--background)"
                    }}>
                        <button
                            className="btn-primary"
                            onClick={handleApplyImprovements}
                            disabled={isApplying || answers.every(a => !a.trim())}
                            style={{
                                padding: "10px 24px", fontSize: "0.9375rem", opacity: (isApplying || answers.every(a => !a.trim())) ? 0.6 : 1,
                                cursor: (isApplying || answers.every(a => !a.trim())) ? "not-allowed" : "pointer"
                            }}
                        >
                            {isApplying ? "Updating Resume..." : "Apply Improvements"}
                        </button>
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    );
}

