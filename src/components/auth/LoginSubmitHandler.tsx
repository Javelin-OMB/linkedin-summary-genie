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
      console.log('Auth state before login attempt:', await supabase.auth.getSession());
      
      try {
        startLoadingTimeout();
        console.log('Attempting login with Supabase...');
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        
        console.log('Supabase login response:', { 
          success: !!loginData, 
          user: loginData?.user?.email,
          error: loginError?.message 
        });

        if (loginError) throw loginError;
        
        // Verify session was created
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session check after login:', { 
          hasSession: !!session, 
          error: sessionError?.message 
        });
        
        if (!session) {
          console.error('No session created after successful login');
          throw new Error('Session not persisted after login');
        }
        
        // Ensure session is persisted
        console.log('Persisting session tokens...');
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
        
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
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
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