import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export const maxDuration = 60;

const IS_LOCAL = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
    let browser = null;

    try {
        const body = await req.json();
        const { cvData, templateId } = body;

        if (!cvData) {
            return NextResponse.json({ error: "Missing CV data" }, { status: 400 });
        }

        // Encode the payload for the /render URL
        const payloadStr = JSON.stringify({ cvData, templateId: templateId || "classic" });
        const b64Payload = Buffer.from(payloadStr).toString("base64");

        // Use the origin of the current request
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host");
        const origin = `${protocol}://${host}`;
        const renderUrl = `${origin}/render?data=${encodeURIComponent(b64Payload)}`;

        // Path to local chrome for development
        const localExecutablePath =
            process.platform === "win32"
                ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
                : process.platform === "linux"
                    ? "/usr/bin/google-chrome"
                    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

        // Vercel Serverless Chromium config
        const executablePath = IS_LOCAL
            ? localExecutablePath
            : await chromium.executablePath(
                "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar"
            );

        browser = await puppeteer.launch({
            args: IS_LOCAL ? [] : [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: (chromium as any).defaultViewport,
            executablePath: executablePath,
            headless: IS_LOCAL ? true : (chromium as any).headless,
        });

        const page = await browser.newPage();

        // Navigate to the render page and wait for everything to settle
        await page.goto(renderUrl, { waitUntil: "networkidle0", timeout: 30000 });

        // Optional: wait an extra 500ms for custom fonts to definitely snap into place
        await new Promise((r) => setTimeout(r, 500));

        // Generate the PDF
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            pageRanges: '1', // Export 1 page by default, or remove this to capture multiple pages depending on CV length
        });

        // Return the PDF
        return new NextResponse(pdfBuffer as any, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=cv-export.pdf",
            },
        });

    } catch (error) {
        console.error("Failed to generate PDF:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: String(error) },
            { status: 500 }
        );
    } finally {
        if (browser !== null) {
            await browser.close().catch(console.error);
        }
    }
}
