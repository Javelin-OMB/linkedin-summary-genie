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
        const user = await handleLogin(email, password);
        console.log('Login successful, user:', user?.email);
        
        // Ensure session is persisted before proceeding
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Session not persisted after login');
        }
        
        // Clear form
        setEmail('');
        setPassword('');
        
        // Show success message
        toast({
          title: "Succesvol ingelogd",
          description: "Je wordt doorgestuurd naar het dashboard...",
        });
        
        // Wait a moment before calling onSuccess to ensure session is properly set
        setTimeout(() => {
          onSuccess?.();
        }, 500);
      } catch (error: any) {
        console.error('Login error:', error);
        toast({
          title: "Login mislukt",
          description: error.message || "Er ging iets mis tijdens het inloggen",
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

  return { onSubmit, isLoading };
};