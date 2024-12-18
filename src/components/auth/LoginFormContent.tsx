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

    try {
      await handleLogin(email, password);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Inloggen mislukt",
        description: "Controleer je gegevens en probeer het opnieuw",
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
        className="w-full bg-linkedin-primary hover:bg-linkedin-hover text-white"
        disabled={isLoading}
      >
        {isLoading ? "Inloggen..." : "Inloggen"}
      </Button>
      <LoginLinks mode="login" />
    </form>
  );
};

export default LoginFormContent;