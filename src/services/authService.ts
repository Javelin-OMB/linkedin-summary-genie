import { supabase } from "@/integrations/supabase/client";

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login with email:', email.trim());
  
  try {
    const { data: { user: existingUser }, error: getUserError } = await supabase.auth.getUser();
    console.log('Existing user check:', existingUser);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.error('Login error details:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        // Check if the user exists to provide a more specific error message
        const { data: userCheck } = await supabase
          .from('users')
          .select('email')
          .eq('email', email.trim())
          .maybeSingle();

        if (userCheck) {
          throw new Error("Onjuist wachtwoord. Probeer het opnieuw.");
        } else {
          throw new Error("Dit e-mailadres is niet bij ons bekend. Maak eerst een account aan.");
        }
      }
      
      // Handle other specific error cases
      if (error.message.includes('Email not confirmed')) {
        throw new Error("Bevestig eerst je e-mailadres via de link in je inbox.");
      }
      
      // Generic error for network or other issues
      if (error.message.includes('Failed to fetch')) {
        throw new Error("Kan geen verbinding maken met de server. Controleer je internetverbinding.");
      }
      
      // Fallback error message
      throw new Error(error.message || "Er is iets misgegaan. Probeer het opnieuw.");
    }

    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

export const ensureUserRecord = async (userId: string, userEmail: string) => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (userError) {
    console.error('Error fetching user data:', userError);
    throw new Error("Er is een fout opgetreden bij het ophalen van je gebruikersgegevens.");
  }

  if (!userData) {
    console.log('Creating user record in users table...');
    const { error: createError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email: userEmail,
          trial_start: new Date().toISOString(),
          credits: 10
        }
      ]);

    if (createError) {
      console.error('Error creating user record:', createError);
      throw new Error("Er is een fout opgetreden bij het aanmaken van je gebruikersprofiel.");
    }
  }

  return userData;
};