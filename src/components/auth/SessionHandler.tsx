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
        console.log('Checking session state...');
        
        // Shorter timeout (5 seconds instead of 10)
        timeoutId = setTimeout(() => {
          if (isLoading && isSubscribed) {
            console.log('Session check timeout');
            setIsLoading(false);
            toast({
              title: "Timeout",
              description: "Het laden van de sessie duurt te lang. Probeer de pagina te verversen.",
              variant: "destructive",
            });
          }
        }, 5000);

        // Quick session check without waiting for full user data
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        // If no session, handle immediately without further checks
        if (!currentSession?.user?.id) {
          console.log('No active session found');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
          setIsLoading(false);
          return;
        }

        // Only proceed with user data check if we have a session
        if (isSubscribed && currentSession?.user?.id) {
          console.log('Checking user data for:', currentSession.user.email);
          
          const { error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            throw userError;
          }
        }

        setIsLoading(false);
        
      } catch (error) {
        console.error('Session check error:', error);
        if (!isSubscribed) return;
        
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
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
        await checkSession();
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsLoading(false);
        navigate('/');
        toast({
          title: "Tot ziens!",
          description: "Je bent succesvol uitgelogd.",
        });
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Initial session check
    checkSession();

    return () => {
      console.log('Cleaning up auth subscriptions');
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