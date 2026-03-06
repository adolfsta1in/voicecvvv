import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Parse PDF
        const data = await pdfParse(buffer);
        const parsedText = data.text;

        return NextResponse.json({ text: parsedText });
    } catch (error) {
        console.error("PDF Parse error:", error);
        return NextResponse.json(
            { error: "Failed to parse PDF file" },
            { status: 500 }
        );
    }
}
