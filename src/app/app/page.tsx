"use client";

import { CVProvider, useCVStore } from "@/lib/cv-store";
import { getCV } from "@/lib/cv-api";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import ChatPanel from "@/components/ChatPanel";
import CVPreview from "@/components/CVPreview";
import DesignSidebar from "@/components/DesignSidebar";
import { TemplateId } from "@/lib/cv-templates";

function CVLoader() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { dispatch } = useCVStore();

    useEffect(() => {
        if (!id) return;
        async function load() {
            dispatch({ type: "SET_LOADING", payload: true });
            const data = await getCV(id!);
            if (data) {
                dispatch({
                    type: "LOAD_CV",
                    payload: {
                        cvId: data.id,
                        templateId: (data.content.templateId as TemplateId) || "classic",
                        data: data.content,
                    },
                });
            }
            dispatch({ type: "SET_LOADING", payload: false });
        }
        load();
    }, [id, dispatch]);

    return null;
}

export default function AppPage() {
    return (
        <CVProvider>
            <Suspense fallback={null}>
                <CVLoader />
            </Suspense>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    width: "100vw",
                    overflow: "hidden",
                }}
            >
                <div className="hide-on-print">
                    <TopBar />
                </div>
                <div
                    style={{
                        display: "flex",
                        flex: 1,
                        overflow: "hidden",
                    }}
                >
                    {/* Chat Panel */}
                    <div
                        className="hide-on-print"
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
                        className="print-fullscreen"
                        style={{
                            flex: 1,
                            overflow: "hidden",
                            background: "var(--surface)",
                        }}
                    >
                        <CVPreview />
                    </div>

                    {/* Design Sidebar */}
                    <div
                        className="hide-on-print"
                        style={{
                            width: 280,
                            flexShrink: 0,
                            background: "var(--surface)",
                            zIndex: 10,
                        }}
                    >
                        <DesignSidebar />
                    </div>
                </div>
            </div>
        </CVProvider>
    );
}
