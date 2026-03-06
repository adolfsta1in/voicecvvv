import { createClient } from "./supabase/client";
import { CVData } from "./cv-types";

// This file contains functions to interact with the Supabase `cvs` table from the client side.

export interface CVDbRecord {
    id: string;
    user_id: string;
    name: string;
    content: CVData;
    created_at: string;
    updated_at: string;
    email?: string;
    phone_number?: string;
    job_title?: string;
}

export async function saveCV(userId: string, name: string, content: CVData, cvId?: string): Promise<CVDbRecord | null> {
    const supabase = createClient();

    if (cvId) {
        // Update existing CV
        const { data, error } = await supabase
            .from('cvs')
            .update({ name, content })
            .eq('id', cvId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error("Error updating CV:", error);
            return null;
        }
        return data;
    } else {
        // Create new CV
        const { data, error } = await supabase
            .from('cvs')
            .insert([
                { user_id: userId, name, content }
            ])
            .select()
            .single();

        if (error) {
            console.error("Error creating CV:", error);
            return null;
        }
        return data;
    }
}

export async function getUserCVs(): Promise<CVDbRecord[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error("Error fetching CVs:", error);
        return [];
    }

    return data || [];
}

export async function getCV(cvId: string): Promise<CVDbRecord | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .single();

    if (error) {
        console.error("Error fetching CV:", error);
        return null;
    }

    return data;
}

export async function deleteCV(cvId: string): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId);

    if (error) {
        console.error("Error deleting CV:", error);
        return false;
    }

    return true;
}

export async function renameCV(cvId: string, name: string): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('cvs')
        .update({ name })
        .eq('id', cvId);

    if (error) {
        console.error("Error renaming CV:", error);
        return false;
    }

    return true;
}
