import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleSignInEvent, handleSignOutEvent, handleTokenRefresh } from '@/utils/sessionEventHandlers';
import { checkInitialSession } from './InitialSessionCheck';
import { safeNavigate } from '@/utils/navigationUtils';

export const SessionHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const initialized = useRef(false);
  const authSubscription = useRef<any>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    console.log('SessionHandler mounted, current path:', location.pathname);
    
    const initializeSession = async () => {
      try {
        console.log('Initializing session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Valid session found, initializing...', session.user.email);
          await checkInitialSession(navigate, toast, location.pathname);
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        await safeNavigate(navigate, '/', { replace: true });
      }
    };

    initializeSession();
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Session:', session?.user?.email);
      try {
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user && location.pathname === '/') {
              console.log('User signed in, navigating to dashboard...');
              await handleSignInEvent(session, navigate, location.pathname);
            }
            break;
          case 'SIGNED_OUT':
            await handleSignOutEvent(navigate, location.pathname, toast);
            break;
          case 'TOKEN_REFRESHED':
            await handleTokenRefresh(session);
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
  }, [navigate, location.pathname, toast]);

  return null;
};