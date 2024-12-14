import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

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

  const validateInputs = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast({
        title: "Error",
        description: "Email is vereist",
        variant: "destructive",
      });
      return false;
    }
    if (!password) {
      toast({
        title: "Error",
        description: "Wachtwoord is vereist",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    try {
      setIsLoading(true);
      const trimmedEmail = email.trim();
      console.log(`Starting ${mode} attempt for:`, trimmedEmail);
      
      let authResponse;
      if (mode === 'signup') {
        console.log('Attempting signup...');
        authResponse = await supabase.auth.signUp({
          email: trimmedEmail,
          password: password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              email: trimmedEmail,
            }
          }
        });
      } else {
        console.log('Attempting login...');
        authResponse = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });
      }

      const { data, error } = authResponse;

      if (error) {
        console.error(`Supabase ${mode} error:`, error.message);
        throw error;
      }

      console.log(`${mode} successful for user:`, data.user?.email);
      
      if (data.user) {
        // Check if user exists in our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        console.log('User data from database:', userData);
        console.log('User error from database:', userError);

        if (userError && mode === 'signup') {
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
            throw new Error('Failed to create user record');
          }
        }

        toast({
          title: "Success",
          description: mode === 'login' 
            ? "Login succesvol! Je wordt doorgestuurd..." 
            : "Account aangemaakt! Je wordt doorgestuurd...",
        });
        
        onSuccess?.();
        navigate('/');
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
        {isLoading ? (mode === 'login' ? "Bezig met inloggen..." : "Account aanmaken...") : (mode === 'login' ? "Inloggen" : "Account aanmaken")}
      </Button>
      <div className="space-y-2 text-center">
        {mode === 'login' ? (
          <>
            <a href="#" className="text-sm text-[#0177B5] hover:underline block">
              Wachtwoord vergeten?
            </a>
            <a href="/pricing" className="text-sm text-[#0177B5] hover:underline block">
              Nog geen account? Registreer je hier
            </a>
          </>
        ) : (
          <a href="#" className="text-sm text-[#0177B5] hover:underline block" onClick={() => navigate('/login')}>
            Al een account? Log hier in
          </a>
        )}
      </div>
    </form>
  );
};

export default LoginForm;