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
    
    const errors = validateLoginInputs(email, password);
    if (errors.length > 0) {
      errors.forEach(error => {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }

    setIsLoading(true);
    const trimmedEmail = email.trim();
    console.log(`Starting ${mode} attempt for:`, trimmedEmail);

    try {
      if (mode === 'signup') {
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
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { email: trimmedEmail }
          }
        });

        if (error) throw error;

        if (data.user) {
          await ensureUserRecord(data.user.id, data.user.email || trimmedEmail);
          toast({
            title: "Account aangemaakt",
            description: "Je account is succesvol aangemaakt! Je kunt nu inloggen.",
          });
          // Redirect to login after successful registration
          navigate('/login');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Inloggen mislukt",
              description: "Controleer je e-mailadres en wachtwoord of maak eerst een account aan.",
              variant: "destructive",
            });
            return;
          }
          throw error;
        }

        if (data.user) {
          toast({
            title: "Succesvol ingelogd",
            description: "Je wordt doorgestuurd naar het dashboard...",
          });
          onSuccess?.();
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error(`${mode} error:`, error);
      let errorMessage = "Er is iets misgegaan. Probeer het opnieuw.";
      
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = "E-mail nog niet bevestigd. Controleer je inbox voor de bevestigingslink.";
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