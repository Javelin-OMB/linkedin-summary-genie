import { useState } from 'react';
import { useToast } from "./use-toast";
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    if (isLoading) {
      console.log('Login already in progress, skipping...');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Starting login process for:', email);

      const { user } = await loginUser(email, password);

      if (!user) {
        throw new Error('No user data returned');
      }

      // Show success message
      toast({
        title: "Succesvol ingelogd",
        description: "Je wordt doorgestuurd naar het dashboard...",
      });

      // Explicit navigation with logging
      console.log('Attempting navigation to dashboard...');
      try {
        await navigate('/dashboard', { replace: true });
        console.log('Navigation to dashboard completed');
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Fallback navigation
        window.location.href = '/dashboard';
      }

      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Display error message from authService
      toast({
        title: "Login mislukt",
        description: error.message,
        variant: "destructive",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};
