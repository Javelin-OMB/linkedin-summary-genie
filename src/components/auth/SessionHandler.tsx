import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';

export const SessionHandler = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isSubscribed = true;

    const checkSession = async () => {
      try {
        console.log('Checking session status...');
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession?.user?.id) {
          console.log('No active session found');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
          setIsLoading(false);
          return;
        }

        console.log('Active session found for:', currentSession.user.email);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Session check error:', error);
        if (isSubscribed) {
          setIsLoading(false);
          if (location.pathname !== '/login') {
            toast({
              title: "Sessie fout",
              description: "Er is een probleem met je sessie. Je wordt doorgestuurd...",
              variant: "destructive",
            });
          }
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
        }
      }
    };

    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in, verifying session...');
        await checkSession();
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsLoading(false);
        if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
          navigate('/login');
        }
      }
    };

    // Initiële sessiecheck
    checkSession();

    // Auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      console.log('Cleaning up session handler...');
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [supabase, navigate, location.pathname, toast]);

  if (isLoading) {
    return <LoadingSpinner message="Even geduld..." />;
  }

  return null;
};