import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Ensure you add these to your environment variables
const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "YOUR_LEMON_SQUEEZY_WEBHOOK_SECRET";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function POST(req: Request) {
    try {
        // 1. Verify the Webhook Signature
        const clonedReq = req.clone();
        const eventType = req.headers.get("X-Event-Name");
        const body = await req.text();
        const signature = req.headers.get("X-Signature");

        if (!signature || !eventType) {
            return new NextResponse("Missing headers", { status: 400 });
        }

        const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
        const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8");
        const signatureBuffer = Buffer.from(signature, "utf8");

        if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
            return new NextResponse("Invalid signature", { status: 403 });
        }

        // 2. Parse the payload
        const payload = JSON.parse(body);
        const customData = payload.meta?.custom_data || {};
        const userId = customData.user_id;

        if (!userId) {
            console.error("No user_id found in webhook custom_data", payload);
            return new NextResponse("No user_id found", { status: 200 }); // Return 200 so LS doesn't retry
        }

        console.log(`Processing Webhook: ${eventType} for User: ${userId}`);

        // 3. Handle specific events
        if (eventType === "order_created") {
            // Verify if it's the "Single CV" product
            // Example product name check: You can use product_id if you know it
            const isSubscription = payload.data?.attributes?.first_order_item?.variant_name?.toLowerCase().includes("pro");

            if (!isSubscription) {
                // It's a single purchase. Let's increment export credits by 1.
                // Fetch current user subscription
                const { data: userSub } = await supabase
                    .from("user_subscriptions")
                    .select("*")
                    .eq("user_id", userId)
                    .single();

                const currentCredits = userSub?.export_credits || 0;

                await supabase
                    .from("user_subscriptions")
                    .upsert({
                        user_id: userId,
                        export_credits: currentCredits + 1,
                        updated_at: new Date().toISOString()
                    });

                console.log(`Incremented export credits for user ${userId}. Total: ${currentCredits + 1}`);
            }
        }

        if (eventType === "subscription_created" || eventType === "subscription_updated") {
            // For monthly pro subscription: Give 10 credits
            await supabase
                .from("user_subscriptions")
                .upsert({
                    user_id: userId,
                    plan: "pro",
                    export_credits: 10,
                    lemon_squeezy_customer_id: payload.data?.attributes?.customer_id?.toString() || null,
                    lemon_squeezy_subscription_id: payload.data?.id?.toString() || null,
                    updated_at: new Date().toISOString()
                });

            console.log(`Updated user ${userId} to Pro plan with 10 credits.`);
        }

        if (eventType === "subscription_expired" || eventType === "subscription_cancelled") {
            // Revert them to free plan and 0 credits
            await supabase
                .from("user_subscriptions")
                .upsert({
                    user_id: userId,
                    plan: "free",
                    export_credits: 0,
                    updated_at: new Date().toISOString()
                });

            console.log(`User ${userId} subscription ended. Reverted to Free plan.`);
        }

        return new NextResponse("Webhook processed successfully", { status: 200 });

    } catch (error) {
        console.error("Webhook processing error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
