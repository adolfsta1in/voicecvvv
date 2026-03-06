import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { html, origin } = body;

        if (!html || !origin) {
            return new Response(JSON.stringify({ error: "Missing html or origin" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Inject the base tag so that relative assets (like /fonts, /images, CSS vars) resolve correctly
        const headMatch = html.match(/<head[^>]*>/i);
        let completeHtml = html;

        if (headMatch) {
            completeHtml = html.replace(
                headMatch[0],
                `${headMatch[0]}\n<base href="${origin}/">`
            );
        } else {
            // Fallback if no head tag for some reason
            completeHtml = `<head><base href="${origin}/"></head>\n${html}`;
        }

        // Launch headless Chrome
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        // Set the content and wait for network idle to ensure fonts/images load
        await page.setContent(completeHtml, {
            waitUntil: "networkidle0",
        });

        // Generate the PDF
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true, // Important to keep CSS background colors
            margin: {
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px",
            },
        });

        await browser.close();

        // Return the PDF buffer directly
        return new Response(pdfBuffer as unknown as BodyInit, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="cv.pdf"',
                "Content-Length": pdfBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
