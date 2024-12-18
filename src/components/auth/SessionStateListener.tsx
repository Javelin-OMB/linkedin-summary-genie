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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user.email);
        onStateChange(event);
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
        console.log('User signed out or session expired');
        onStateChange(event);
        toast({
          title: "Session ended",
          description: "Please log in again to continue",
        });
        navigate('/login', { replace: true });
      }
    });

    // Initialize session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No active session found');
        onStateChange('INITIAL_SESSION');
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, navigate, onStateChange, toast]);

  return null;
};