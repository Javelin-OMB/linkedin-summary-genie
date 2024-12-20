import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createUserRecord = async (userId: string, userEmail: string) => {
    try {
      console.log('Creating user record in users table...');
      
      const { error } = await supabase
        .from('users')
        .insert([{
          id: userId,
          email: userEmail,
          trial_start: new Date().toISOString(),
          credits: 10
        }]);

      if (error) {
        console.error('Error creating user record:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in createUserRecord:', error);
      throw error;
    }
  };

  const performSignup = async (email: string, password: string) => {
    try {
      console.log('Starting signup process for email:', email);
      
      // First, create the auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            email: email.trim()
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      console.log('Auth signup response:', data);

      if (!data.user) {
        throw new Error('No user data returned from signup');
      }

      console.log('Auth signup successful. User ID:', data.user.id);

      // Now create the user record in our users table
      await createUserRecord(data.user.id, data.user.email!);

      // Show success message
      toast({
        title: "Account aangemaakt",
        description: "Je account is succesvol aangemaakt. Je kunt nu inloggen.",
      });

      // Navigate to login
      navigate('/login');

      return data.user;
    } catch (error: any) {
      console.error('Signup error details:', error);
      
      let errorMessage = "Er is een fout opgetreden tijdens het registreren.";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "Dit e-mailadres is al geregistreerd.";
      }
      
      throw new Error(errorMessage);
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await performSignup(email, password);
    } catch (error: any) {
      console.error('Signup error details:', error);
      toast({
        title: "Registratie mislukt",
        description: error.message || "Er is een fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
};