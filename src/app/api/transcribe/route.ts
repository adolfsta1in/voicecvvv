import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "ELEVENLABS_API_KEY not configured" },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const audioFile = formData.get("audio") as File | null;

        if (!audioFile) {
            return NextResponse.json(
                { error: "No audio file provided" },
                { status: 400 }
            );
        }

        // Forward to ElevenLabs Scribe v2 API
        const elevenLabsForm = new FormData();
        elevenLabsForm.append("file", audioFile, "recording.webm");
        elevenLabsForm.append("model_id", "scribe_v1");

        const response = await fetch(
            "https://api.elevenlabs.io/v1/speech-to-text",
            {
                method: "POST",
                headers: {
                    "xi-api-key": apiKey,
                },
                body: elevenLabsForm,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs STT error:", response.status, errorText);
            return NextResponse.json(
                { error: "Transcription failed", details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        // Scribe v2 returns { text: "..." }
        return NextResponse.json({ text: data.text || "" });
    } catch (error) {
        console.error("Transcribe API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
