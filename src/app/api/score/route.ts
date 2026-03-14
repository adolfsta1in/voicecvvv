import { NextRequest, NextResponse } from "next/server";

const SCORE_SYSTEM_PROMPT = `
You are an expert technical recruiter and resume writer. 
Your task is to evaluate the provided resume data against the highest industry standards (e.g., Harvard Business School resume guidelines, top tech company expectations).

A perfect resume (score 100) should have:
- A strong, concise professional summary.
- Experience bullets that start with strong action verbs and emphasize quantifiable results and impact (e.g., "Increased sales by X%").
- Clear and complete education details.
- Relevant skills clearly categorized.

Evaluate the current resume data. Provide:
1. An overall score out of 100 representing its current quality.
2. A list of 3-5 specific, constructive feedback points explaining why the score wasn't higher and what's missing.
3. A list of 2-4 highly specific questions the user can answer to improve the resume right now. (Make the questions act as prompts for them to give you the data needed to fulfill your feedback).

Respond ONLY with a JSON object in this exact format:
{
  "score": 85,
  "feedback": [
    "Experience bullets lack quantifiable metrics.",
    "Summary is too vague and doesn't state your target role."
  ],
  "questions": [
    "What specific metrics or percentages can you provide for the 'managed team' bullet point?",
    "What specific role are you targeting for your next job so we can tailor the summary?"
  ]
}
`;

export async function POST(req: NextRequest) {
    try {
        const { cvData } = await req.json();

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
                content: SCORE_SYSTEM_PROMPT,
            },
            {
                role: "user" as const,
                content: `Please score this CV data:\n${JSON.stringify(cvData, null, 2)}`
            }
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
                    temperature: 0.3,
                    max_tokens: 1500,
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
            return NextResponse.json(
                { error: "Failed to parse AI response" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Score API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
