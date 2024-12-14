import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from "@/components/ui/use-toast";

interface SessionInitializerProps {
  userId: string;
  setIsInitialized: (value: boolean) => void;
}

export const SessionInitializer = ({ userId, setIsInitialized }: SessionInitializerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initializeSession = async () => {
      console.log('Starting session initialization for user:', userId);
      
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          toast({
            title: "Fout bij initialiseren sessie",
            description: "Er is een probleem opgetreden bij het ophalen van je gebruikersgegevens.",
            variant: "destructive",
          });
          throw userError;
        }

        console.log('User data retrieved:', userData);
        
        if (userData) {
          console.log('Session initialized successfully');
          setIsInitialized(true);
          toast({
            title: "Welkom terug!",
            description: "Je bent succesvol ingelogd.",
          });
        } else {
          console.log('No user data found - redirecting to pricing');
          navigate('/pricing');
        }
      } catch (error) {
        console.error('Error during session initialization:', error);
        navigate('/login');
      }
    };

    initializeSession();
  }, [userId, navigate, setIsInitialized, toast]);

  return <LoadingSpinner message="Even geduld..." />;
};