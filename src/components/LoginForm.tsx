import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import LoginFormFields from './auth/LoginFormFields';
import LoginLinks from './auth/LoginLinks';
import SignupForm from './auth/SignupForm';
import { loginUser, ensureUserRecord } from '@/services/authService';

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
      const { user } = await loginUser(email, password);
      
      if (user) {
        await ensureUserRecord(user.id, user.email!);
        
        onSuccess?.();
        
        toast({
          title: "Succesvol ingelogd",
          description: "Je wordt doorgestuurd...",
        });
        
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Inloggen mislukt",
        description: error.message || "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.",
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