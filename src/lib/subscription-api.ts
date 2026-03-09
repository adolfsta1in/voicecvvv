import { createClient } from "./supabase/client";

export interface UserSubscription {
    user_id: string;
    plan: 'free' | 'pro';
    export_credits: number;
    lemon_squeezy_customer_id?: string;
    lemon_squeezy_subscription_id?: string;
}

/**
 * Fetches the active subscription and export credits for the current authenticated user.
 */
export async function getUserSubscription(): Promise<UserSubscription | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error) {
        // If the record doesn't exist yet, we can pretend they are free
        console.error("Error fetching user subscription:", error);
        return {
            user_id: user.id,
            plan: 'free',
            export_credits: 0
        };
    }

    return data as UserSubscription;
}

/**
 * Decreases the user's export credits by 1.
 * Only intended to be called when they successfully export a PDF.
 * This is called from the client; ensure RLS allows updates or, ideally, call an RPC/Server Action.
 * For simplicity as requested, we'll try to update it directly. If RLS blocks it, we might need an Edge Function or Server Action.
 */
export async function decrementExportCredit(): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    // First fetch current credits to decrement safely. In a real highly-concurrent app, use an RPC.
    const currentSub = await getUserSubscription();

    if (!currentSub || currentSub.export_credits <= 0) {
        return false;
    }

    const { error } = await supabase
        .from('user_subscriptions')
        .update({ export_credits: currentSub.export_credits - 1 })
        .eq('user_id', user.id);

    if (error) {
        console.error("Error decrementing export credit:", error);
        return false;
    }

    return true;
}
