import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import LoginFormFields from './LoginFormFields';
import { useLogin } from '@/hooks/useLogin';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LoginFormContentProps {
  onSuccess?: () => void;
}

const LoginFormContent: React.FC<LoginFormContentProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isLoading } = useLogin();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const result = await handleLogin(email, password);
      console.log('Login successful:', result);
      
      // Clear form
      setEmail('');
      setPassword('');
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login mislukt",
        description: error.message || "Er ging iets mis tijdens het inloggen",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Bezig met inloggen..." />;
  }

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
        className="w-full bg-[#FEDB01] hover:bg-[#FEDB01]/90 text-black"
        disabled={isLoading}
      >
        {isLoading ? "Inloggen..." : "Inloggen"}
      </Button>
      <div className="text-center space-y-2">
        <a href="#" className="block text-[#FEDB01] hover:text-[#FEDB01]/90">
          Wachtwoord vergeten?
        </a>
        <a href="#" className="block text-[#FEDB01] hover:text-[#FEDB01]/90">
          Nog geen account? Registreer je hier
        </a>
      </div>
    </form>
  );
};

export default LoginFormContent;