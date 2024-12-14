import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/LoadingSpinner';

interface SessionInitializerProps {
  userId: string;
  setIsInitialized: (value: boolean) => void;
}

export const SessionInitializer = ({ userId, setIsInitialized }: SessionInitializerProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const initializeSession = async () => {
      console.log('Initializing session for user:', userId);
      
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          throw userError;
        }

        console.log('User data retrieved:', userData);
        
        if (userData) {
          console.log('Session initialized successfully');
          setIsInitialized(true);
        } else {
          console.log('No user data found - redirecting to pricing');
          navigate('/pricing');
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        navigate('/login');
      }
    };

    initializeSession();
  }, [userId, navigate, setIsInitialized]);

  return <LoadingSpinner message="Even geduld..." />;
};