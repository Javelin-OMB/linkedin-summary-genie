import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import LoginFormFields from './LoginFormFields';
import { useLogin } from '@/hooks/useLogin';
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';
import debounce from 'lodash/debounce';

interface LoginFormContentProps {
  onSuccess?: () => void;
}

const LOGIN_TIMEOUT = 10000; // 10 seconds timeout

const LoginFormContent: React.FC<LoginFormContentProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isLoading } = useLogin();
  const { toast } = useToast();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Debounced submit handler
  const debouncedSubmit = useCallback(
    debounce(async (email: string, password: string) => {
      console.log('Starting login process for:', email);
      
      try {
        // Set timeout for loading state
        const timeout = setTimeout(() => {
          toast({
            title: "Login duurt te lang",
            description: "Probeer het later opnieuw",
            variant: "destructive",
          });
          window.location.href = '/'; // Fallback navigation
        }, LOGIN_TIMEOUT);
        
        setTimeoutId(timeout);

        await handleLogin(email, password);
        
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
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    }, 300), // 300ms debounce
    [handleLogin, toast, onSuccess]
  );

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

    console.log('Form submitted, triggering debounced login...');
    debouncedSubmit(email, password);
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