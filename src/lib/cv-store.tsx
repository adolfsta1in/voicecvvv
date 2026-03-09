"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { CVData, ChatMessage, emptyCVData } from "./cv-types";
import { TemplateId } from "./cv-templates";

interface CVState {
    messages: ChatMessage[];
    cvData: CVData;
    isLoading: boolean;
    templateId: TemplateId;
    cvId: string | null;
}

type CVAction =
    | { type: "ADD_MESSAGE"; payload: ChatMessage }
    | { type: "UPDATE_CV"; payload: Partial<CVData> }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_TEMPLATE"; payload: TemplateId }
    | { type: "SET_CV_ID"; payload: string | null }
    | { type: "LOAD_CV"; payload: { cvId: string; templateId: TemplateId; data: CVData } }
    | { type: "REORDER_SECTIONS"; payload: string[] }
    | { type: "REORDER_LIST"; payload: { path: keyof CVData; newOrder: unknown[] } }
    | { type: "SET_THEME_COLOR"; payload: string }
    | { type: "SET_SPACING"; payload: "tight" | "normal" | "relaxed" }
    | { type: "SET_FONT_SIZE"; payload: "small" | "normal" | "large" }
    | { type: "RESTORE_STATE"; payload: Partial<CVState> };

const LOCAL_STORAGE_KEY = "chatcv_draft_state";

const initialState: CVState = {
    messages: [],
    cvData: { ...emptyCVData },
    isLoading: false,
    templateId: "classic",
    cvId: null,
};

function mergeCV(current: CVData, update: Partial<CVData>): CVData {
    return {
        personalInfo: {
            ...current.personalInfo,
            ...(update.personalInfo || {}),
        },
        summary: update.summary ?? current.summary,
        experience: update.experience ?? current.experience,
        education: update.education ?? current.education,
        skills: update.skills ?? current.skills,
        languages: update.languages ?? current.languages,
        certifications: update.certifications ?? current.certifications,
        layout: update.layout ?? current.layout,
    };
}

function cvReducer(state: CVState, action: CVAction): CVState {
    switch (action.type) {
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] };
        case "UPDATE_CV":
            return { ...state, cvData: mergeCV(state.cvData, action.payload) };
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_TEMPLATE":
            return { ...state, templateId: action.payload };
        case "SET_CV_ID":
            return { ...state, cvId: action.payload };
        case "LOAD_CV":
            return {
                ...state,
                cvId: action.payload.cvId,
                templateId: action.payload.templateId,
                cvData: action.payload.data,
            };
        case "REORDER_SECTIONS":
            return {
                ...state,
                cvData: { ...state.cvData, layout: { ...state.cvData.layout, sectionOrder: action.payload } },
            };
        case "REORDER_LIST":
            return {
                ...state,
                cvData: { ...state.cvData, [action.payload.path]: action.payload.newOrder },
            };
        case "SET_THEME_COLOR":
            return {
                ...state,
                cvData: { ...state.cvData, layout: { ...state.cvData.layout, themeColor: action.payload } },
            };
        case "SET_SPACING":
            return {
                ...state,
                cvData: { ...state.cvData, layout: { ...state.cvData.layout, documentSpacing: action.payload } },
            };
        case "SET_FONT_SIZE":
            return {
                ...state,
                cvData: { ...state.cvData, layout: { ...state.cvData.layout, fontSize: action.payload } },
            };
        case "RESTORE_STATE":
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
}

const CVContext = createContext<{
    state: CVState;
    dispatch: React.Dispatch<CVAction>;
} | null>(null);

export function CVProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cvReducer, initialState);
    const [isInitialized, setIsInitialized] = React.useState(false);

    // Load from local storage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                dispatch({ type: "RESTORE_STATE", payload: parsed });
            } catch (e) {
                console.error("Failed to parse saved CV state", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage on change
    React.useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                messages: state.messages,
                cvData: state.cvData,
                templateId: state.templateId,
                // Don't persist cvId or isLoading across sessions
            }));
        }
    }, [state.messages, state.cvData, state.templateId, isInitialized]);

    if (!isInitialized) return null; // Or a loader

    return (
        <CVContext.Provider value={{ state, dispatch }}>
            {children}
        </CVContext.Provider>
    );
}

export function useCVStore() {
    const context = useContext(CVContext);
    if (!context) throw new Error("useCVStore must be used within CVProvider");
    return context;
}
