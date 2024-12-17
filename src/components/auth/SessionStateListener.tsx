import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

interface SessionStateListenerProps {
  onStateChange: (event: string) => void;
}

export const SessionStateListener = ({ onStateChange }: SessionStateListenerProps) => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in, verifying session...');
        onStateChange(event);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
          navigate('/login');
        }
        onStateChange(event);
      }
    });

    return () => {
      console.log('Cleaning up auth state listener...');
      subscription.unsubscribe();
    };
  }, [supabase, navigate, onStateChange]);

  return null;
};