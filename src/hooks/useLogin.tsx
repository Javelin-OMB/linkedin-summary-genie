import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    if (isLoading) {
      console.log('Login already in progress, skipping...');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Starting login process for:', email);

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
        description: "Je wordt doorgestuurd naar het dashboard...",
      });

      // Explicit navigation with logging
      console.log('Attempting navigation to dashboard...');
      try {
        await navigate('/dashboard', { replace: true });
        console.log('Navigation to dashboard completed');
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Fallback navigation
        window.location.href = '/dashboard';
      }

      return data.user;
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Onjuiste inloggegevens. Controleer je e-mailadres en wachtwoord.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Je account is nog niet geactiveerd. Check je inbox voor de activatielink.";
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};