import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const SessionHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.log('SessionHandler mounted, current path:', location.pathname);
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user?.email);
          if (session?.access_token) {
            console.log('Setting session with access token');
            await supabase.auth.setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            });
            
            // Only redirect if we're on the login page
            if (location.pathname === '/login') {
              console.log('Redirecting to home after login');
              navigate('/', { replace: true });
            }
          }
          break;

        case 'SIGNED_OUT':
          console.log('User signed out');
          // Only redirect to login if we're not on a public page
          if (location.pathname !== '/login' && 
              location.pathname !== '/' && 
              location.pathname !== '/about' && 
              location.pathname !== '/pricing') {
            console.log('Redirecting to login after signout');
            navigate('/login', { replace: true });
          }
          break;

        case 'TOKEN_REFRESHED':
          console.log('Token refreshed');
          if (!session) {
            console.log('No session after token refresh, signing out');
            await supabase.auth.signOut();
            navigate('/login', { replace: true });
          }
          break;

        case 'USER_UPDATED':
          console.log('User updated:', session?.user?.email);
          break;
      }
    });

    // Initial session check
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          throw error;
        }

        console.log('Initial session check:', session?.user?.email);
        
        if (!session && 
            location.pathname !== '/login' && 
            location.pathname !== '/' && 
            location.pathname !== '/about' && 
            location.pathname !== '/pricing') {
          console.log('No initial session, redirecting to login');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          title: "Sessie fout",
          description: "Er is een probleem met je sessie. Probeer opnieuw in te loggen.",
          variant: "destructive",
        });
        navigate('/login', { replace: true });
      }
    };

    checkInitialSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, toast]);

  return null;
};