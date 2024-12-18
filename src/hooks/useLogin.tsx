import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export const useLogin = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('Starting login process for:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      console.log('Login successful for user:', data.user.email);
      
      // Check if the user exists in our users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error checking user:', userError);
        throw userError;
      }

      // If the user doesn't exist, create a new user record
      if (!existingUser) {
        console.log('Creating new user record');
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              trial_start: new Date().toISOString(),
              credits: 10
            }
          ]);

        if (insertError) {
          console.error('Error creating user record:', insertError);
          throw insertError;
        }
      }
      
      // Show success message
      toast({
        title: "Succesvol ingelogd",
        description: "Je wordt doorgestuurd...",
      });
      
      // Call success callback if provided
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Onjuiste inloggegevens. Controleer je e-mailadres en wachtwoord.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Je account is nog niet geactiveerd. Check je inbox voor de activatielink.";
      }
      
      toast({
        title: "Inloggen mislukt",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};