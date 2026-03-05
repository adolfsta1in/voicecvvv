"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.error("Login error:", error.message);
        return redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/", "layout");
    redirect("/app");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error, data: signUpData } = await supabase.auth.signUp(data);

    if (error) {
        console.error("Signup error:", error.message);
        return redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    // If email confirmation is required, session is null but error is also null.
    if (!signUpData.session) {
        return redirect(`/login?error=${encodeURIComponent("Check your email to confirm your account")}`);
    }

    revalidatePath("/", "layout");
    redirect("/app");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}
