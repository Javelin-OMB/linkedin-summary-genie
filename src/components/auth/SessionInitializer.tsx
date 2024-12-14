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
      console.log('Checking user data for:', userId);
      
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          setIsInitialized(true);
          return;
        }

        console.log('User data:', userData);
        
        if (userData) {
          console.log('Existing user - redirecting to homepage');
          navigate('/');
        } else {
          console.log('No user data found - redirecting to pricing');
          navigate('/pricing');
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeSession();
  }, [userId, navigate, setIsInitialized]);

  return <LoadingSpinner message="Initializing session..." />;
};