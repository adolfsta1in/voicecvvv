import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
    try {
        const { messages, cvData } = await req.json();

        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "DEEPSEEK_API_KEY not configured in .env.local" },
                { status: 500 }
            );
        }

        const chatMessages = [
            {
                role: "system" as const,
                content: `${SYSTEM_PROMPT}\n\nCurrent CV state:\n${JSON.stringify(cvData, null, 2)}`,
            },
            ...messages.map((m: { role: string; content: string }) => ({
                role: m.role as "user" | "assistant",
                content: m.content,
            })),
        ];

        const response = await fetch(
            "https://api.deepseek.com/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: chatMessages,
                    temperature: 0.7,
                    max_tokens: 2048,
                    response_format: { type: "json_object" },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("DeepSeek API error:", errorText);
            return NextResponse.json(
                { error: "AI service error" },
                { status: 500 }
            );
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "";

        try {
            const parsed = JSON.parse(text);
            return NextResponse.json(parsed);
        } catch {
            return NextResponse.json({
                message: text,
                cvUpdate: undefined,
            });
        }
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
