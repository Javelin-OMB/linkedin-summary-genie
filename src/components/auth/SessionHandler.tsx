import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { handleUserSession, handleSignOut } from '@/utils/sessionUtils';

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
      return; // Skip session handling for password reset
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'User:', session?.user?.email);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user && session?.access_token) {
            console.log('Valid session detected, handling user session...');
            await handleUserSession(supabase, session.user, navigate, toast);
          }
          break;

        case 'SIGNED_OUT':
          console.log('User signed out, checking current path...');
          localStorage.removeItem('supabase.auth.token'); // Clear any stored tokens
          if (!['/', '/login', '/about', '/pricing', '/reset-password'].includes(location.pathname)) {
            console.log('Redirecting to home page after logout...');
            navigate('/', { replace: true });
          }
          break;

        case 'TOKEN_REFRESHED':
          console.log('Token refreshed, checking session...');
          if (!session && !isPasswordReset) {
            console.log('No session after token refresh, signing out');
            await handleSignOut(supabase, navigate, toast);
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
            !['/', '/login', '/about', '/pricing', '/reset-password'].includes(location.pathname)) {
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