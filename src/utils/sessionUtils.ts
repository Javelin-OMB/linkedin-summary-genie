import { NavigateFunction } from 'react-router-dom';
import { SupabaseClient } from '@supabase/supabase-js';
import { toast } from "@/components/ui/use-toast";

export const handleUserSession = async (
  supabase: SupabaseClient,
  user: any,
  navigate: NavigateFunction,
  toastFn: typeof toast
) => {
  try {
    console.log('Setting session for user:', user.email);
    
    // Check if user exists in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (userError) {
      console.error('Error checking user:', userError);
      throw userError;
    }

    // If user doesn't exist, create them
    if (!userData) {
      console.log('Creating new user record');
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email,
          trial_start: new Date().toISOString(),
          credits: 10
        }]);

      if (insertError) {
        console.error('Error creating user record:', insertError);
        throw insertError;
      }
    }

    toastFn({
      title: "Succesvol ingelogd",
      description: "Je wordt doorgestuurd naar de hoofdpagina...",
    });

    // Kleine vertraging om de toast te laten zien
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);
  } catch (error) {
    console.error('Session handling error:', error);
    toastFn({
      title: "Er is een fout opgetreden",
      description: "Probeer het opnieuw of neem contact op met support.",
      variant: "destructive",
    });
  }
};

export const handleSignOut = async (
  supabase: SupabaseClient,
  navigate: NavigateFunction,
  toastFn: typeof toast
) => {
  try {
    console.log('Starting logout process...');
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    console.log('User signed out');
    navigate('/login', { replace: true });
  } catch (error) {
    console.error('Sign out error:', error);
    toastFn({
      title: "Uitloggen mislukt",
      description: "Er is een fout opgetreden tijdens het uitloggen.",
      variant: "destructive",
    });
  }
};