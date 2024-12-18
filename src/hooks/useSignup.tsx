import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

interface UseSignupReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  handleSignup: (e: React.FormEvent) => Promise<void>;
}

const useSignup = (onSuccess?: () => void): UseSignupReturn => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createUserRecord = async (userId: string, userEmail: string) => {
    console.log('Creating user record in users table...');
    const { error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email: userEmail,
          trial_start: new Date().toISOString(),
          credits: 10
        }
      ]);

    if (userError) {
      console.error('Error creating user record:', userError);
      throw userError;
    }

    console.log('User record created successfully');
  };

  const performSignup = async () => {
    console.log('Starting signup process for email:', email.trim());
    
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (signUpError) {
      console.error('Auth signup error:', signUpError);
      throw signUpError;
    }

    console.log('Auth signup response:', authData);

    if (!authData.user) {
      console.error('No user data returned after signup');
      throw new Error('No user data returned after signup');
    }

    console.log('Auth signup successful. User ID:', authData.user.id);
    await createUserRecord(authData.user.id, authData.user.email!);
    return authData.user;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Validatie fout",
        description: "Vul zowel je e-mailadres als wachtwoord in",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await performSignup();
      
      toast({
        title: "Account aangemaakt",
        description: "Je account is succesvol aangemaakt. Check je email om je account te verifiëren!",
      });
      
      onSuccess?.();
      navigate('/');
      
    } catch (error: any) {
      console.error('Signup error details:', error);
      let errorMessage = "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "Dit e-mailadres is al geregistreerd. Probeer in te loggen.";
      }
      
      toast({
        title: "Registratie mislukt",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSignup
  };
};

export default useSignup;