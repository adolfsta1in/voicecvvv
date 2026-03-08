import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Only require puppeteer modules if we're actually running it
// We'll dynamically require these inside the GET/POST handlers
// to avoid loading heavy binaries during Vercel edge/middleware initialization.

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cvData, zoom = 1, theme = "light" } = body;

        console.log("Starting PDF generation for CV...");

        // Dynamic imports for Puppeteer
        // In local development, we use standard puppeteer.
        // In Vercel, we use puppeteer-core + sparticuz/chromium
        let browser;
        try {
            if (process.env.VERCEL) {
                console.log("Running on Vercel: Using @sparticuz/chromium and puppeteer-core");
                const chromium = (await import("@sparticuz/chromium")).default;
                const puppeteer = (await import("puppeteer-core")).default;

                // Configure Chromium for Vercel Serverless
                chromium.setGraphicsMode = false;

                browser = await puppeteer.launch({
                    args: chromium.args,
                    defaultViewport: (chromium as any).defaultViewport,
                    executablePath: await chromium.executablePath(),
                    headless: (chromium as any).headless || true,
                    ignoreHTTPSErrors: true,
                } as any);
            } else {
                console.log("Running locally: Using standard puppeteer");
                // We fallback to standard puppeteer locally
                const puppeteer = (await import("puppeteer")).default;
                browser = await puppeteer.launch({
                    headless: true, // true (v1 headless), 'new' (v2 headless)
                    args: ["--no-sandbox", "--disable-setuid-sandbox"],
                });
            }
        } catch (error) {
            console.error("Puppeteer Initialization Error:", error);
            return NextResponse.json(
                { error: "Failed to initialize PDF renderer.", details: error instanceof Error ? error.message : String(error) },
                { status: 500 }
            );
        }

        const page = await browser.newPage();

        // Capture browser console logs for debugging
        page.on('console', msg => console.log('PUPPETEER BROWSER CONSOLE:', msg.text()));
        page.on('pageerror', error => console.error('PUPPETEER BROWSER ERROR:', error));

        // Ensure we load page as a certain theme
        await page.emulateMediaFeatures([
            { name: "prefers-color-scheme", value: theme }
        ]);

        // Intercept network requests if we wanted to speed things up, but we want all fonts/CSS
        // to load properly.
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 }); // A4 at 96dpi

        // Determine base URL dynamically depending on Vercel deployment URL vs Localhost
        const heads = await headers();
        const host = heads.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;
        const printUrl = `${baseUrl}/pdf-render`;

        console.log(`Navigating Puppeteer to ${printUrl}`);

        // Go to the print page first so the origin is established
        await page.goto(printUrl, {
            waitUntil: "networkidle0", // wait until all fonts, images, and network requests settle
            timeout: 30000,
        });

        // Set up the injection *after* navigation so localStorage/window are on the correct domain
        await page.evaluate((data, currentZoom) => {
            (window as any).__CV_DATA__ = { cv: data, zoom: currentZoom };
            localStorage.setItem('CV_PRINT_DATA', JSON.stringify({ cv: data, zoom: currentZoom }));
        }, cvData, zoom);

        // Wait explicitly for our React component to mount and signal it's ready
        try {
            await page.waitForSelector("#cv-print-content[data-print-ready='true']", {
                timeout: 10000,
            });
        } catch (err) {
            const html = await page.content();
            console.error("Puppeteer Timeout. Page HTML dump:", html);
            throw err;
        }

        // Give it an extra small buffer just to ensure any late CSS/font-rendering applies
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log("Generating PDF file...");

        // Generate PDF
        // Important: we printBackground: true so CSS backgrounds (like templates) show up
        // We set format to A4 and remove margins to match the CV exact styling.
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
            preferCSSPageSize: true, // Use any @page css settings the document defines
        });

        await browser.close();
        console.log("PDF generation successful. Buffer size:", pdfBuffer.length);

        // pdfBuffer is a Uint8Array. We need to convert it to actual Buffer/Blob for NextResponse
        const pdfBlob = new Blob([Buffer.from(pdfBuffer)], { type: "application/pdf" });

        // Create standard Next.js Response with PDF headers
        return new NextResponse(pdfBlob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="CV.pdf"`,
                "Content-Length": pdfBlob.size.toString(),
            },
        });

    } catch (error) {
        console.error("Error generating PDF:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF file.", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
