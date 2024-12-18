import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import LoginFormFields from './LoginFormFields';
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
      // Error handling happens in useLogin hook
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
      <div className="text-center space-y-2">
        <a href="#" className="block text-linkedin-primary hover:text-linkedin-hover">
          Wachtwoord vergeten?
        </a>
        <a href="#" className="block text-linkedin-primary hover:text-linkedin-hover">
          Nog geen account? Registreer je hier
        </a>
      </div>
    </form>
  );
};

export default LoginFormContent;