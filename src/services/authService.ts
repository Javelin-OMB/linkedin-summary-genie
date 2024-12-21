import { User } from '../types/user';
import { supabase } from '../integrations/supabase/client';

export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login with email:', email.trim());
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.error('Login error details:', error);
      
      if (error.message.includes('Invalid login credentials')) {
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
      
      if (error.message.includes('Email not confirmed')) {
        throw new Error("Je account is nog niet geactiveerd. Check je inbox voor de activatielink.");
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error("Kan geen verbinding maken met de server. Controleer je internetverbinding.");
      }
      
      throw new Error(error.message || "Er is iets misgegaan. Probeer het opnieuw.");
    }

    if (!data.user) {
      throw new Error("Er is een fout opgetreden tijdens het inloggen.");
    }

    await ensureUserRecord(data.user.id, data.user.email!);
    
    if (data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      });
    }

    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

export const ensureUserRecord = async (userId: string, userEmail: string) => {
  try {
    console.log('Checking for existing user record:', userId);
    
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking user record:', checkError);
      throw new Error("Er is een fout opgetreden bij het controleren van je gebruikersgegevens.");
    }

    if (!existingUser) {
      console.log('Creating new user record...');
      
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: userEmail,
          trial_start: new Date().toISOString(),
          credits: 10
        });

      if (insertError) {
        console.error('Error creating user record:', insertError);
        throw new Error("Er is een fout opgetreden bij het aanmaken van je gebruikersprofiel.");
      }

      console.log('User record created successfully');
      return { id: userId, email: userEmail, credits: 10 };
    }

    console.log('Existing user record found');
    return existingUser;
  } catch (error: any) {
    console.error('Error in ensureUserRecord:', error);
    throw error;
  }
};

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  if (!userId) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data?.is_admin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const logoutUser = async () => {
  try {
    console.log('Starting logout process...');
    
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      throw error;
    }

    console.log('Logout successful');
    return true;
  } catch (error) {
    console.error('Unexpected logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async (userId: string): Promise<User | null> => {
  if (!userId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    return data as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
