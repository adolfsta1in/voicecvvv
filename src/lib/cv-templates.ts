export type TemplateId =
    | "classic"
    | "minimal"
    | "sidebar"
    | "executive"
    | "creative"
    | "compact"
    | "modern"
    | "professional"
    | "elegant"
    | "tech";

export interface TemplateConfig {
    id: TemplateId;
    name: string;
    description: string;
    accentColor: string;
    secondaryColor: string;
    bgColor: string;
    swatch: string; // CSS gradient or color for the thumbnail swatch
}

export const TEMPLATES: TemplateConfig[] = [
    {
        id: "classic",
        name: "Classic",
        description: "Clean professional layout with indigo accents",
        accentColor: "#6366f1",
        secondaryColor: "#4f46e5",
        bgColor: "#ffffff",
        swatch: "linear-gradient(135deg, #6366f1, #818cf8)",
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "Ultra-clean, no colour — pure typography",
        accentColor: "#1a1a2e",
        secondaryColor: "#374151",
        bgColor: "#ffffff",
        swatch: "linear-gradient(135deg, #1a1a2e, #374151)",
    },
    {
        id: "sidebar",
        name: "Sidebar",
        description: "Two-column layout with a dark sidebar",
        accentColor: "#10b981",
        secondaryColor: "#059669",
        bgColor: "#ffffff",
        swatch: "linear-gradient(135deg, #1e293b, #10b981)",
    },
    {
        id: "executive",
        name: "Executive",
        description: "Bold header bar, refined typography for senior roles",
        accentColor: "#0ea5e9",
        secondaryColor: "#0284c7",
        bgColor: "#ffffff",
        swatch: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    },
    {
        id: "creative",
        name: "Creative",
        description: "Vibrant accent edge, timeline dots, colour tags",
        accentColor: "#f59e0b",
        secondaryColor: "#d97706",
        bgColor: "#ffffff",
        swatch: "linear-gradient(135deg, #f59e0b, #ef4444)",
    },
    {
        id: "compact",
        name: "Compact",
        description: "Dense two-column body, maximum content in one page",
        accentColor: "#8b5cf6",
        secondaryColor: "#7c3aed",
        bgColor: "#ffffff",
        swatch: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    },
    {
        id: "modern",
        name: "Modern",
        description: "Bold header with clear section separations",
        accentColor: "#0f172a",
        secondaryColor: "#334155",
        bgColor: "#ffffff",
        swatch: "linear-gradient(135deg, #0f172a, #64748b)",
    },
    {
        id: "professional",
        name: "Professional",
        description: "Traditional, subtle accent lines, highly readable",
        accentColor: "#2563eb",
        secondaryColor: "#1d4ed8",
        bgColor: "#ffffff",
        swatch: "linear-gradient(135deg, #2563eb, #3b82f6)",
    },
    {
        id: "elegant",
        name: "Elegant",
        description: "Centered header, sophisticated serif-inspired fonts",
        accentColor: "#9f1239",
        secondaryColor: "#be123c",
        bgColor: "#fcfbf9",
        swatch: "linear-gradient(135deg, #9f1239, #fda4af)",
    },
    {
        id: "tech",
        name: "Tech",
        description: "Monospaced tech styling with command-line aesthetics",
        accentColor: "#10b981",
        secondaryColor: "#059669",
        bgColor: "#111827",
        swatch: "linear-gradient(135deg, #111827, #10b981)",
    },
];

export function getTemplate(id: TemplateId): TemplateConfig {
    return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
