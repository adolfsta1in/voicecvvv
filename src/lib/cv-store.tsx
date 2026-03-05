"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { CVData, ChatMessage, emptyCVData } from "./cv-types";

interface CVState {
    messages: ChatMessage[];
    cvData: CVData;
    isLoading: boolean;
}

type CVAction =
    | { type: "ADD_MESSAGE"; payload: ChatMessage }
    | { type: "UPDATE_CV"; payload: Partial<CVData> }
    | { type: "SET_LOADING"; payload: boolean };

const initialState: CVState = {
    messages: [],
    cvData: { ...emptyCVData },
    isLoading: false,
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
