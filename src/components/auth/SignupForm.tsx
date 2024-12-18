import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import LoginFormFields from './LoginFormFields';
import LoginLinks from './LoginLinks';
import { supabase } from "@/integrations/supabase/client";

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
      console.log('Attempting signup with email:', email.trim());
      
      // 1. First create the auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('No user data returned after signup');
      }

      console.log('Auth signup successful for:', authData.user.email);

      // 2. Create the user record in our users table
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            trial_start: new Date().toISOString(),
            credits: 10
          }
        ]);

      if (userError) {
        console.error('Error creating user record:', userError);
        toast({
          title: "Fout bij aanmaken gebruiker",
          description: "Er is een probleem opgetreden bij het aanmaken van je account. Probeer het opnieuw.",
          variant: "destructive",
        });
        return;
      }

      console.log('User record created successfully');
      
      toast({
        title: "Account aangemaakt",
        description: "Je account is succesvol aangemaakt. Je kunt nu inloggen!",
      });
      
      onSuccess?.();
      navigate('/');
      
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LoginFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
      />
      <Button 
        type="submit" 
        className="w-full bg-brand-primary hover:bg-brand-hover text-black"
        disabled={isLoading}
      >
        {isLoading ? "Account aanmaken..." : "Account aanmaken"}
      </Button>
      <LoginLinks mode="signup" />
    </form>
  );
};

export default SignupForm;