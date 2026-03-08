import React from "react";
import RenderClient from "./RenderClient";

export default async function RenderPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const dataParam = params.data;

    if (!dataParam || typeof dataParam !== "string") {
        return <div>Missing CV data payload in query params.</div>;
    }

    let payload;
    try {
        const jsonStr = Buffer.from(dataParam, "base64").toString("utf-8");
        payload = JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse CV payload", e);
        return <div>Invalid CV data payload.</div>;
    }

    return <RenderClient cvData={payload.cvData} templateId={payload.templateId} />;
}
