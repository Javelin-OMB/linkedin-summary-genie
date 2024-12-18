import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export const useLogin = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('Starting login process for:', email);

    try {
      // 1. Probeer in te loggen met Supabase Auth
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
      
      // 2. Check of de gebruiker al bestaat in onze users tabel
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error checking user:', userError);
        throw userError;
      }

      // 3. Als de gebruiker niet bestaat, maak een nieuwe gebruiker aan
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
      
      // Navigate after a short delay to ensure toast is visible
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
      
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