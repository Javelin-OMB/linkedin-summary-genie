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

    try {
      setIsLoading(true);
      const trimmedEmail = email.trim();
      console.log(`Starting ${mode} attempt for:`, trimmedEmail);
      
      const authResponse = mode === 'signup'
        ? await supabase.auth.signUp({
            email: trimmedEmail,
            password: password,
            options: {
              emailRedirectTo: window.location.origin,
              data: { email: trimmedEmail }
            }
          })
        : await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password: password,
          });

      const { data, error } = authResponse;

      if (error) throw error;

      console.log(`${mode} successful for user:`, data.user?.email);
      
      if (data.user) {
        await ensureUserRecord(data.user.id, data.user.email || trimmedEmail);
        toast({
          title: "Success",
          description: mode === 'login' 
            ? "Login succesvol! Je wordt doorgestuurd..." 
            : "Account aangemaakt! Je wordt doorgestuurd...",
        });
        
        onSuccess?.();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(`${mode} error:`, error);
      let errorMessage = "Er is iets misgegaan. Probeer het opnieuw.";
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Ongeldige inloggegevens. Controleer je email en wachtwoord.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Email nog niet bevestigd. Check je inbox voor de bevestigingslink.";
        }
      }
      
      toast({
        title: `${mode === 'login' ? 'Login' : 'Registratie'} mislukt`,
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
        <label className="text-sm font-medium">Email adres</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Jouw email adres"
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
          placeholder="Jouw wachtwoord"
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