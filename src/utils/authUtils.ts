import { supabase } from "@/integrations/supabase/client";
import { ensureUserRecord } from "./authUtils";

export const handleSignup = async (email: string, password: string) => {
  const trimmedEmail = email.trim().toLowerCase();
  
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', trimmedEmail)
    .single();

  if (existingUser) {
    throw new Error('ACCOUNT_EXISTS');
  }

  // Create new user
  const { data, error: signUpError } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
  });

  if (signUpError) throw signUpError;

  if (data?.user) {
    await ensureUserRecord(data.user.id, trimmedEmail);
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (signInError) throw signInError;
    return data.user;
  }
  
  throw new Error('SIGNUP_FAILED');
};

export const handleLogin = async (email: string, password: string) => {
  const trimmedEmail = email.trim().toLowerCase();
  
  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (signInError) {
    if (signInError.message?.includes('Invalid login credentials')) {
      throw new Error('INVALID_CREDENTIALS');
    }
    throw signInError;
  }

  return data.user;
};