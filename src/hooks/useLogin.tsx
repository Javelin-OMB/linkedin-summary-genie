import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ensureUserRecord } from '@/services/authService';

export const useLogin = (onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('Starting login process for:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      console.log('Login successful for user:', data.user.email);
      
      // Ensure user record exists in our database
      await ensureUserRecord(data.user.id, data.user.email!);
      
      // Show success message
      toast({
        title: "Succesvol ingelogd",
        description: "Je wordt doorgestuurd...",
      });
      
      // Call success callback if provided
      onSuccess?.();
      
      // Navigate after a short delay to ensure toast is visible
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};