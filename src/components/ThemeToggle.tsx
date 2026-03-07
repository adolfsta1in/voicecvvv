"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid var(--border-color)",
                background: "var(--surface)",
                color: "var(--foreground)",
                cursor: "pointer",
                transition: "all 0.2s",
            }}
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" style={{ position: "absolute", width: 18, height: 18, transition: "all 0.2s", transform: theme === "dark" ? "scale(0) rotate(-90deg)" : "scale(1) rotate(0deg)" }} />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" style={{ position: "absolute", width: 18, height: 18, transition: "all 0.2s", transform: theme === "light" ? "scale(0) rotate(90deg)" : "scale(1) rotate(0deg)" }} />
        </button>
    );
}
