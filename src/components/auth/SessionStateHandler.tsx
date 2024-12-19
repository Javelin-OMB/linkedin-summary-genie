import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { handleSignInEvent, handleSignOutEvent, handleTokenRefresh } from '@/utils/sessionEventHandlers';
import { safeNavigate } from '@/utils/navigationUtils';

interface SessionStateHandlerProps {
  setSessionChecked: (checked: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  authSubscription: any;
  navigate: any;
  toast: any;
  currentPath: string;
}

export const SessionStateHandler = ({
  setSessionChecked,
  setIsLoading,
  authSubscription,
  navigate,
  toast,
  currentPath
}: SessionStateHandlerProps) => {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Session:', session?.user?.email);
      
      try {
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              console.log('User signed in, persisting session...');
              // Ensure session is persisted
              await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token
              });
              await handleSignInEvent(session, navigate, currentPath);
            }
            break;
          case 'SIGNED_OUT':
            await handleSignOutEvent(navigate, currentPath, toast);
            setSessionChecked(false);
            setIsLoading(true);
            break;
          case 'TOKEN_REFRESHED':
            if (session) {
              console.log('Token refreshed, updating session...');
              await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token
              });
            }
            break;
          case 'INITIAL_SESSION':
            if (session) {
              console.log('Initial session detected, ensuring persistence...');
              await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token
              });
            }
            break;
        }
      } catch (error) {
        console.error('Auth event handling error:', error);
        if (event === 'SIGNED_OUT') {
          await safeNavigate(navigate, '/', { replace: true });
        }
      }
    });

    authSubscription.current = subscription;

    return () => {
      console.log('Cleaning up auth subscription');
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
    };
  }, [setSessionChecked, setIsLoading, authSubscription, navigate, toast, currentPath]);

  return null;
};