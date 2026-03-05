"use client";

import { CVProvider } from "@/lib/cv-store";
import TopBar from "@/components/TopBar";
import ChatPanel from "@/components/ChatPanel";
import CVPreview from "@/components/CVPreview";

export default function AppPage() {
    return (
        <CVProvider>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    width: "100vw",
                    overflow: "hidden",
                }}
            >
                <TopBar />
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        overflow: "hidden",
                    }}
                >
                    {/* Chat Panel */}
                    <div
                        style={{
                            width: "40%",
                            minWidth: 340,
                            maxWidth: 480,
                            flexShrink: 0,
                            overflow: "hidden",
                        }}
                    >
                        <ChatPanel />
                    </div>

                    {/* CV Preview */}
                    <div
                        style={{
                            flex: 1,
                            overflow: "hidden",
                            background: "var(--surface)",
                        }}
                    >
                        <CVPreview />
                    </div>
                </div>
            </div>
        </CVProvider>
    );
}
