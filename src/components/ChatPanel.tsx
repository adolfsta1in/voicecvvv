"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useCVStore } from "@/lib/cv-store";
import { ChatMessage } from "@/lib/cv-types";

import ReactMarkdown from "react-markdown";

// Extend Window for SpeechRecognition
interface SpeechRecognitionEvent {
    results: { [key: number]: { [key: number]: { transcript: string } } };
    resultIndex: number;
}


export default function ChatPanel() {
    const { state, dispatch } = useCVStore();
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const hasInitialized = useRef(false);
    const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);

    function createRecognition() {
        const SpeechRecognition =
            (window as unknown as Record<string, unknown>).SpeechRecognition ||
            (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
        if (!SpeechRecognition) return null;

        const recognition = new (SpeechRecognition as new () => {
            continuous: boolean;
            interimResults: boolean;
            lang: string;
            onresult: ((e: SpeechRecognitionEvent) => void) | null;
            onend: (() => void) | null;
            onerror: ((e: { error: string }) => void) | null;
            start: () => void;
            stop: () => void;
        })();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        return recognition;
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [state.messages]);

    // Auto-send greeting on mount
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        if (state.messages.length === 0) {
            sendToAI([
                {
                    id: "init",
                    role: "user",
                    content: "Hi, I'd like to create my CV. Please start guiding me.",
                    timestamp: new Date(),
                },
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleListening = useCallback(() => {
        if (isListening) {
            // Stop listening
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        // Start listening
        const recognition = createRecognition();
        if (!recognition) {
            alert("Speech recognition is not supported in your browser. Please use Chrome.");
            return;
        }

        recognitionRef.current = recognition;
        let finalTranscript = "";

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = "";
            for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
                const result = event.results[i];
                if (result && result[0]) {
                    const transcript = result[0].transcript;
                    // Check if it's a final result
                    if ((event.results[i] as unknown as { isFinal: boolean }).isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interim = transcript;
                    }
                }
            }
            setInput(finalTranscript + interim);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (e: { error: string }) => {
            console.error("Speech recognition error:", e.error);
            setIsListening(false);
        };

        recognition.start();
        setIsListening(true);
    }, [isListening]);

    async function sendToAI(msgs: ChatMessage[]) {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: msgs.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    cvData: state.cvData,
                }),
            });

            if (!res.ok) throw new Error("API error");

            const data = await res.json();

            const aiMessage: ChatMessage = {
                id: `ai_${Date.now()}`,
                role: "assistant",
                content: data.message,
                timestamp: new Date(),
            };
            dispatch({ type: "ADD_MESSAGE", payload: aiMessage });

            if (data.cvUpdate) {
                dispatch({ type: "UPDATE_CV", payload: data.cvUpdate });
            }
        } catch (err) {
            console.error(err);
            const errorMsg: ChatMessage = {
                id: `err_${Date.now()}`,
                role: "assistant",
                content:
                    "I'm sorry, I encountered an issue. Please make sure the API key is configured and try again.",
                timestamp: new Date(),
            };
            dispatch({ type: "ADD_MESSAGE", payload: errorMsg });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }

    async function handleSend() {
        const text = input.trim();
        if (!text || state.isLoading) return;

        // Stop listening if active
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }

        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        dispatch({ type: "ADD_MESSAGE", payload: userMessage });
        setInput("");

        if (inputRef.current) {
            inputRef.current.style.height = "auto";
        }

        const allMessages = [...state.messages, userMessage];
        await sendToAI(allMessages);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setInput(e.target.value);
        const el = e.target;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "var(--surface)",
                borderRight: "1px solid var(--border-color)",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid var(--border-color)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                        }}
                    >
                        ✨
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                            CV Assistant
                        </div>
                        <div
                            style={{
                                fontSize: "0.75rem",
                                color: "var(--muted)",
                            }}
                        >
                            {state.isLoading ? "Thinking..." : "Online"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                {state.messages
                    .filter((m) => m.id !== "init")
                    .map((msg, idx) => (
                        <div
                            key={msg.id}
                            className="animate-fade-in-up"
                            style={{
                                animationDelay: `${idx * 0.05}s`,
                                display: "flex",
                                justifyContent:
                                    msg.role === "user" ? "flex-end" : "flex-start",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "85%",
                                    padding: "12px 16px",
                                    borderRadius:
                                        msg.role === "user"
                                            ? "16px 16px 4px 16px"
                                            : "16px 16px 16px 4px",
                                    background:
                                        msg.role === "user"
                                            ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                                            : "var(--background)",
                                    color: msg.role === "user" ? "white" : "var(--foreground)",
                                    fontSize: "0.875rem",
                                    lineHeight: "1.6",
                                    border:
                                        msg.role === "assistant"
                                            ? "1px solid var(--border-color)"
                                            : "none",
                                    boxShadow:
                                        msg.role === "user"
                                            ? "0 2px 8px rgba(99, 102, 241, 0.2)"
                                            : "0 1px 4px rgba(0,0,0,0.04)",
                                }}
                            >
                                {msg.role === "assistant" ? (
                                    <div className="chat-markdown">
                                        <ReactMarkdown>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    ))}

                {state.isLoading && (
                    <div
                        className="animate-fade-in"
                        style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                        <div
                            style={{
                                padding: "14px 20px",
                                borderRadius: "16px 16px 16px 4px",
                                background: "var(--background)",
                                border: "1px solid var(--border-color)",
                                display: "flex",
                                gap: "6px",
                                alignItems: "center",
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: "50%",
                                        background: "var(--color-primary)",
                                        animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Listening indicator */}
            {isListening && (
                <div
                    style={{
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: "0.8125rem",
                        color: "#ef4444",
                        fontWeight: 500,
                    }}
                >
                    <div
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#ef4444",
                            animation: "pulse-soft 1.5s ease-in-out infinite",
                        }}
                    />
                    Listening... speak now
                </div>
            )}

            {/* Input */}
            <div
                style={{
                    padding: "16px",
                    borderTop: "1px solid var(--border-color)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-end",
                        background: "var(--background)",
                        border: isListening
                            ? "1px solid #ef4444"
                            : "1px solid var(--border-color)",
                        borderRadius: "14px",
                        padding: "8px 8px 8px 16px",
                        transition: "border-color 0.2s",
                    }}
                >
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            isListening ? "Listening..." : "Type or tap the mic to speak..."
                        }
                        rows={1}
                        style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            color: "var(--foreground)",
                            fontSize: "0.875rem",
                            lineHeight: "1.5",
                            resize: "none",
                            fontFamily: "inherit",
                            padding: "4px 0",
                        }}
                    />

                    {/* Mic button */}
                    <button
                        onClick={toggleListening}
                        title={isListening ? "Stop listening" : "Start voice input"}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: "none",
                            background: isListening
                                ? "#ef4444"
                                : "var(--surface)",
                            color: isListening ? "white" : "var(--muted)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                            flexShrink: 0,
                            animation: isListening ? "pulse-soft 1.5s ease-in-out infinite" : "none",
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                    </button>

                    {/* Send button */}
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || state.isLoading}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            border: "none",
                            background:
                                input.trim() && !state.isLoading
                                    ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                                    : "var(--surface)",
                            color:
                                input.trim() && !state.isLoading
                                    ? "white"
                                    : "var(--muted)",
                            cursor:
                                input.trim() && !state.isLoading
                                    ? "pointer"
                                    : "default",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                            flexShrink: 0,
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
