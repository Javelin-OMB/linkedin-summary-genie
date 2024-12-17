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
        console.log('Starting session check...');
        
        // Set a shorter timeout (3 seconds)
        timeoutId = setTimeout(() => {
          if (isLoading && isSubscribed) {
            console.log('Session check timeout reached');
            setIsLoading(false);
            toast({
              title: "Timeout",
              description: "Het laden van de sessie duurt te lang. Probeer opnieuw in te loggen.",
              variant: "destructive",
            });
            // Force logout on timeout
            supabase.auth.signOut();
            if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
              navigate('/login');
            }
          }
        }, 3000);

        // Quick session check
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
          await supabase.auth.signOut();
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
          toast({
            title: "Sessie fout",
            description: "Er is een probleem met je sessie. Probeer opnieuw in te loggen.",
            variant: "destructive",
          });
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const handleAuthChange = (event: string, session: any) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        checkSession();
      } else if (event === 'SIGNED_OUT') {
        setIsLoading(false);
        if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
          navigate('/login');
        }
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Initial session check
    checkSession();

    return () => {
      console.log('Cleaning up session handler...');
      isSubscribed = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase, navigate, location.pathname, toast, isLoading]);

  if (isLoading) {
    return <LoadingSpinner message="Sessie controleren..." />;
  }

  return null;
};