import { useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useToast } from "@/components/ui/use-toast";
import { useLogin } from '@/hooks/useLogin';
import { useLoadingTimeout } from '@/hooks/useLoadingTimeout';
import { supabase } from "@/integrations/supabase/client";

interface LoginSubmitHandlerProps {
  email: string;
  password: string;
  onSuccess?: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

export const useLoginSubmitHandler = ({
  email,
  password,
  onSuccess,
  setEmail,
  setPassword,
}: LoginSubmitHandlerProps) => {
  const { handleLogin, isLoading } = useLogin();
  const { toast } = useToast();
  const { startLoadingTimeout, clearLoadingTimeout } = useLoadingTimeout();

  const debouncedSubmit = useCallback(
    debounce(async (email: string, password: string) => {
      console.log('Starting login process for:', email);
      
      try {
        startLoadingTimeout();
        console.log('Attempting login with Supabase...');
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (loginError) {
          console.error('Login error:', loginError);
          
          // Handle specific error cases
          if (loginError.message.includes('Invalid login credentials')) {
            throw new Error('Onjuiste inloggegevens. Controleer je e-mailadres en wachtwoord.');
          }
          
          if (loginError.message.includes('Email not confirmed')) {
            throw new Error('Je account is nog niet geactiveerd. Check je inbox voor de activatielink.');
          }
          
          throw loginError;
        }

        if (!loginData.user) {
          throw new Error('Geen gebruikersgegevens ontvangen na login.');
        }

        // Clear form
        setEmail('');
        setPassword('');
        
        // Show success message
        toast({
          title: "Succesvol ingelogd",
          description: "Je wordt doorgestuurd naar het dashboard...",
        });
        
        console.log('Login successful, preparing redirect...');
        
        // Wait a moment before calling onSuccess to ensure session is properly set
        setTimeout(() => {
          console.log('Executing redirect callback...');
          onSuccess?.();
        }, 500);

      } catch (error: any) {
        console.error('Login error details:', error);
        
        let errorMessage = "Er ging iets mis tijdens het inloggen. Probeer het later opnieuw.";
        
        if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Login mislukt",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        clearLoadingTimeout();
      }
    }, 300),
    [handleLogin, toast, onSuccess, startLoadingTimeout, clearLoadingTimeout]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with:', { email, password: '***' });
    
    if (!email.trim() || !password.trim()) {
      console.log('Validation failed: empty fields');
      toast({
        title: "Vul alle velden in",
        description: "Email en wachtwoord zijn verplicht",
        variant: "destructive",
      });
      return;
    }

    console.log('Form validation passed, triggering debounced login...');
    debouncedSubmit(email, password);
  };

  return { onSubmit, isLoading };
};