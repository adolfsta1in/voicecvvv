"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    handleStyle?: React.CSSProperties; // allows passing custom spacing for nested lists
}

export function SortableItem({ id, children, handleStyle }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: "relative" as const,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative rounded-md outline outline-2 outline-transparent hover:outline-indigo-500/40 transition-all duration-200">
            {/* Hover Action Toolbar */}
            <div
                className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1 z-[60] bg-white shadow-md border border-slate-200 rounded p-0.5"
                style={{ left: -36, top: 0, ...handleStyle }}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="p-1 rounded bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 4h2v2H4V4zm4 0h2v2H8V4zm-4 4h2v2H4V8zm4 0h2v2H8V8zm-4 4h2v2H4v-2zm4 0h2v2H8v-2z" />
                    </svg>
                </div>
            </div>

            {/* The child content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
