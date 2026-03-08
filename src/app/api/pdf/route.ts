import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Encode the payload to pass via URL
        const dataStr = Buffer.from(JSON.stringify(body)).toString("base64");

        // Get the current origin
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host") || "localhost:3000";
        const origin = `${protocol}://${host}`;

        const renderUrl = `${origin}/render?data=${encodeURIComponent(dataStr)}`;

        // Determine if we are running locally or in Vercel
        const isLocal = process.env.NODE_ENV === "development";

        const executablePath = isLocal
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // A fairly safe assumption for Windows testing, but we should make it flexible or just use local puppeteer
            : await chromium.executablePath();

        // Launch headless browser
        const browser = await puppeteer.launch({
            args: isLocal ? puppeteer.defaultArgs() : chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath || undefined,
            headless: isLocal ? true : chromium.headless,
            // If local, we might need a channel if we don't have a path
            channel: isLocal && !executablePath ? 'chrome' : undefined,
        });

        const page = await browser.newPage();

        // Navigate to the render page
        await page.goto(renderUrl, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });

        // Extra wait to ensure custom fonts are loaded
        await page.evaluateHandle('document.fonts.ready');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        });

        await browser.close();

        // Return the PDF
        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="CV_Export.pdf"`,
            },
        });

    } catch (error) {
        console.error("PDF generation failed:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
