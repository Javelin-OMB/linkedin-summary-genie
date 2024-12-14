import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { ensureUserRecord, validateLoginInputs } from '@/utils/authUtils';
import LoginLinks from './auth/LoginLinks';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Additional validation before submission
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Validatie fout",
        description: "Vul zowel je e-mailadres als wachtwoord in",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    console.log(`Attempting ${mode} for email:`, trimmedEmail);

    try {
      if (mode === 'signup') {
        console.log('Starting signup process...');
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', trimmedEmail)
          .single();

        if (existingUser) {
          toast({
            title: "Account bestaat al",
            description: "Log in met je bestaande account of gebruik een ander e-mailadres.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (signUpError) {
          console.error('Signup error:', signUpError);
          throw signUpError;
        }

        if (data?.user) {
          await ensureUserRecord(data.user.id, trimmedEmail);
          console.log('User record created, attempting auto-login...');
          
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });

          if (signInError) {
            console.error('Auto-login after signup failed:', signInError);
            throw signInError;
          }

          toast({
            title: "Account aangemaakt",
            description: "Je account is succesvol aangemaakt en je bent nu ingelogd!",
          });
          onSuccess?.();
          navigate('/dashboard');
        }
      } else {
        console.log('Starting login process...');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          console.error('Login error:', signInError);
          
          if (signInError.message?.includes('Invalid login credentials')) {
            toast({
              title: "Inloggen mislukt",
              description: "E-mailadres of wachtwoord is onjuist. Controleer je gegevens en probeer het opnieuw.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          
          throw signInError;
        }

        console.log('Login successful, redirecting...');
        toast({
          title: "Succesvol ingelogd",
          description: "Je wordt doorgestuurd naar het dashboard...",
        });
        onSuccess?.();
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error(`${mode} error:`, error);
      
      let errorMessage = "Er is iets misgegaan. Probeer het opnieuw.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "E-mailadres of wachtwoord is onjuist. Controleer je gegevens en probeer het opnieuw.";
      } else if (error.message?.includes('rate limit')) {
        errorMessage = "Te veel pogingen. Probeer het later opnieuw.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Bevestig eerst je e-mailadres via de link in je inbox.";
      }
      
      toast({
        title: `${mode === 'login' ? 'Inloggen' : 'Registratie'} mislukt`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">E-mailadres</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Vul je e-mailadres in"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Wachtwoord</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Vul je wachtwoord in"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90"
        disabled={isLoading}
      >
        {isLoading 
          ? (mode === 'login' ? "Bezig met inloggen..." : "Account aanmaken...") 
          : (mode === 'login' ? "Inloggen" : "Account aanmaken")}
      </Button>
      <LoginLinks mode={mode} />
    </form>
  );
};

export default LoginForm;