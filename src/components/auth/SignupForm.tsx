import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import LoginFormFields from './LoginFormFields';
import LoginLinks from './LoginLinks';
import { handleSignup } from '@/utils/authUtils';

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
      await handleSignup(email, password);
      
      toast({
        title: "Account aangemaakt",
        description: "Je account is succesvol aangemaakt en je bent nu ingelogd!",
      });
      onSuccess?.();
      navigate('/dashboard');
    } catch (error: any) {
      let errorMessage = "Er is iets misgegaan. Probeer het opnieuw.";
      
      if (error.message === 'ACCOUNT_EXISTS') {
        errorMessage = "Log in met je bestaande account of gebruik een ander e-mailadres.";
      } else if (error.message?.includes('rate limit')) {
        errorMessage = "Te veel pogingen. Probeer het later opnieuw.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Bevestig eerst je e-mailadres via de link in je inbox.";
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