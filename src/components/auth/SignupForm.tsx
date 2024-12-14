import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import LoginFormFields from './LoginFormFields';
import LoginLinks from './LoginLinks';
import { supabase } from '@/integrations/supabase/client';

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
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Signup error:', error);
        let errorMessage = "Er is iets misgegaan. Probeer het opnieuw.";
        
        if (error.message?.includes('user_already_exists')) {
          errorMessage = "Dit e-mailadres is al geregistreerd. Probeer in te loggen met je bestaande account.";
          navigate('/login');
        } else if (error.message?.includes('rate limit')) {
          errorMessage = "Te veel pogingen. Probeer het later opnieuw.";
        }
        
        toast({
          title: "Registratie mislukt",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        console.log('Signup successful for user:', data.user.email);
        
        // Create user record in our users table
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              trial_start: new Date().toISOString(),
              credits: 10
            }
          ]);

        if (userError) {
          console.error('Error creating user record:', userError);
          // Continue anyway as auth was successful
        }

        toast({
          title: "Account aangemaakt",
          description: "Je account is succesvol aangemaakt. Je kunt nu inloggen!",
        });
        
        onSuccess?.();
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Unexpected error during signup:', error);
      toast({
        title: "Registratie mislukt",
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
        className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90"
        disabled={isLoading}
      >
        {isLoading ? "Account aanmaken..." : "Account aanmaken"}
      </Button>
      <LoginLinks mode="signup" />
    </form>
  );
};

export default SignupForm;