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
    
    // Check if we're on the reset password page with a recovery token
    const isPasswordReset = location.pathname === '/reset-password' && 
                          window.location.hash.includes('type=recovery');
    
    if (isPasswordReset) {
      console.log('Password reset page detected with recovery token, skipping session handling');
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'User:', session?.user?.email);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user && session?.access_token) {
            console.log('Valid session detected, handling user session...');
            localStorage.setItem('supabase.auth.token', session.access_token);
            if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
              navigate(location.pathname);
            } else {
              navigate('/');
            }
          }
          break;

        case 'SIGNED_OUT':
          console.log('User signed out, clearing session data...');
          localStorage.removeItem('supabase.auth.token');
          sessionStorage.clear();
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/', { replace: true });
          }
          break;

        case 'TOKEN_REFRESHED':
          console.log('Token refreshed, updating session...');
          if (session?.access_token) {
            localStorage.setItem('supabase.auth.token', session.access_token);
          }
          break;
      }
    });

    // Initial session check
    const checkInitialSession = async () => {
      if (isPasswordReset) {
        console.log('Skipping initial session check for password reset page');
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.email);
        
        if (error) {
          console.error('Error checking session:', error);
          throw error;
        }

        if (!session && 
            !['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
          console.log('No initial session, redirecting to home');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          title: "Sessie fout",
          description: "Er is een probleem met je sessie. Probeer opnieuw in te loggen.",
          variant: "destructive",
        });
        navigate('/', { replace: true });
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