import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface SessionStateListenerProps {
  onStateChange: (event: string) => void;
}

export const SessionStateListener = ({ onStateChange }: SessionStateListenerProps) => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user.email);
        onStateChange(event);
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        onStateChange(event);
        navigate('/login', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, navigate, onStateChange]);

  return null;
};