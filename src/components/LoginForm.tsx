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
      
      // First check if the user exists in auth.users
      const { data: { user: existingUser }, error: getUserError } = await supabase.auth.getUser();
      console.log('Existing user check:', existingUser);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Login error details:', error);
        let errorMessage = "Er is iets misgegaan. Probeer het opnieuw.";
        
        if (error.message?.includes('Invalid login credentials')) {
          // Check if user exists but credentials are wrong
          const { data: userCheck } = await supabase
            .from('users')
            .select('email')
            .eq('email', email.trim())
            .single();

          if (userCheck) {
            errorMessage = "Onjuist wachtwoord. Probeer het opnieuw.";
          } else {
            errorMessage = "Dit e-mailadres is niet bij ons bekend. Maak eerst een account aan.";
          }
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = "Bevestig eerst je e-mailadres via de link in je inbox.";
        } else if (error.message?.includes('Failed to fetch')) {
          errorMessage = "Kan geen verbinding maken met de server. Controleer je internetverbinding.";
          console.log('Network error during login:', error);
        }
        
        toast({
          title: "Inloggen mislukt",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        console.log('Login successful for:', data.user.email);
        
        // Check if user exists in our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user data:', userError);
          toast({
            title: "Fout bij ophalen gebruikersgegevens",
            description: "Er is een fout opgetreden bij het ophalen van je gebruikersgegevens.",
            variant: "destructive",
          });
          return;
        }

        // If user doesn't exist in users table, create them
        if (!userData) {
          console.log('Creating user record in users table...');
          const { error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                trial_start: new Date().toISOString(),
                credits: 10
              }
            ]);

          if (createError) {
            console.error('Error creating user record:', createError);
            toast({
              title: "Fout bij aanmaken gebruiker",
              description: "Er is een fout opgetreden bij het aanmaken van je gebruikersprofiel.",
              variant: "destructive",
            });
            return;
          }
        }

        console.log('User data retrieved:', userData);
        onSuccess?.();
        
        toast({
          title: "Succesvol ingelogd",
          description: "Je wordt doorgestuurd...",
        });
        
        navigate('/');
      }
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Inloggen mislukt",
        description: "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.",
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
        {isLoading ? "Bezig met inloggen..." : "Inloggen"}
      </Button>
      <LoginLinks mode="login" />
    </form>
  );
};

export default LoginForm;