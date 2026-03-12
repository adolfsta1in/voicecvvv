-- Run this in your Supabase SQL Editor

-- Create the user_subscriptions table
CREATE TABLE public.user_subscriptions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free' or 'pro'
    email TEXT,
    export_credits INTEGER NOT NULL DEFAULT 0,
    lemon_squeezy_customer_id TEXT,
    lemon_squeezy_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only read their own subscription data
CREATE POLICY "Users can view own subscription" 
    ON public.user_subscriptions 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow users to update their own subscription (needed for client-side credit decrement)
CREATE POLICY "Users can update own subscription" 
    ON public.user_subscriptions 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Optional: If you want to allow a secure backend (Service Role) to update everything without RLS blocking it
-- RLS doesn't apply to service_role, so the webhook can update records securely!

-- Trigger to automatically create a user_subscriptions record when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, email, plan, export_credits)
  VALUES (new.id, new.email, 'free', 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
