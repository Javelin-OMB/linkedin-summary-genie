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
    let timeoutId: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        console.log('Starting quick session check...');
        
        // Kortere timeout (1.5 seconden)
        timeoutId = setTimeout(() => {
          if (isLoading && isSubscribed) {
            console.log('Quick session check timeout');
            setIsLoading(false);
            // Alleen een toast tonen als we niet op de login pagina zijn
            if (location.pathname !== '/login') {
              toast({
                title: "Let op",
                description: "Sessie wordt opnieuw geladen...",
                variant: "default",
              });
            }
            // Geen automatische uitlog meer bij timeout
          }
        }, 1500);

        // Snelle sessiecheck zonder extra data
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession?.user?.id) {
          console.log('No active session found');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
          setIsLoading(false);
          return;
        }

        console.log('Session found for user:', currentSession.user.email);
        setIsLoading(false);
        clearTimeout(timeoutId);
        
      } catch (error) {
        console.error('Session check error:', error);
        if (isSubscribed) {
          setIsLoading(false);
          // Alleen een foutmelding tonen als we niet op de login pagina zijn
          if (location.pathname !== '/login') {
            toast({
              title: "Sessie fout",
              description: "Er is een probleem met je sessie. Je wordt opnieuw ingelogd.",
              variant: "destructive",
            });
          }
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in, checking session...');
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
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase, navigate, location.pathname, toast, isLoading]);

  if (isLoading) {
    return <LoadingSpinner message="Even geduld..." />;
  }

  return null;
};