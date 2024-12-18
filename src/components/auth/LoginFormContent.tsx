import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import LoginFormFields from './LoginFormFields';
import LoginLinks from './LoginLinks';
import { useLogin } from '@/hooks/useLogin';
import { useToast } from "@/components/ui/use-toast";

interface LoginFormContentProps {
  onSuccess?: () => void;
}

const LoginFormContent: React.FC<LoginFormContentProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isLoading } = useLogin(onSuccess);
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Vul alle velden in",
        description: "Email en wachtwoord zijn verplicht",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting login process for:', email);
    
    try {
      await handleLogin(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Onjuiste inloggegevens. Controleer je e-mailadres en wachtwoord.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Je account is nog niet geactiveerd. Check je inbox voor de activatielink.";
      }
      
      toast({
        title: "Inloggen mislukt",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <LoginFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
      />
      <Button 
        type="submit" 
        className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Inloggen..." : "Inloggen"}
      </Button>
      <div className="text-center space-y-2">
        <a href="#" className="block text-yellow-500 hover:text-yellow-600">
          Wachtwoord vergeten?
        </a>
        <a href="#" className="block text-yellow-500 hover:text-yellow-600">
          Nog geen account? Registreer je hier
        </a>
      </div>
    </form>
  );
};

export default LoginFormContent;