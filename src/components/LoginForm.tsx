import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import LoginFormFields from './auth/LoginFormFields';
import LoginLinks from './auth/LoginLinks';
import SignupForm from './auth/SignupForm';
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onSuccess?: () => void;
  mode?: 'login' | 'signup';
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, mode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (mode === 'signup') {
    return <SignupForm onSuccess={onSuccess} />;
  }

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
      console.log('Attempting login with email:', email.trim());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Supabase auth error:', error);
        let errorMessage = "Er is iets misgegaan. Probeer het opnieuw.";
        
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = "Account niet gevonden. Controleer of je e-mailadres correct is of maak een nieuw account aan.";
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = "Bevestig eerst je e-mailadres via de link in je inbox.";
        }
        
        toast({
          title: "Inloggen mislukt",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        console.log('Login successful for user:', data.user.email);
        
        // Check if user exists in our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          toast({
            title: "Fout bij ophalen gebruikersgegevens",
            description: "Er is een fout opgetreden bij het ophalen van je gebruikersgegevens. Probeer het opnieuw.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Succesvol ingelogd",
          description: "Je wordt doorgestuurd naar het dashboard...",
        });
        
        onSuccess?.();
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "Er is iets misgegaan. Probeer het opnieuw.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Account niet gevonden. Controleer of je e-mailadres correct is of maak een nieuw account aan.";
      } else if (error.message?.includes('rate limit')) {
        errorMessage = "Te veel pogingen. Probeer het later opnieuw.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Bevestig eerst je e-mailadres via de link in je inbox.";
      }
      
      toast({
        title: "Inloggen mislukt",
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
        className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90"
        disabled={isLoading}
      >
        {isLoading ? "Bezig met inloggen..." : "Inloggen"}
      </Button>
      <LoginLinks mode="login" />
    </form>
  );
};

export default LoginForm;