import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { handleAuthEvent } from './SessionEventHandler';
import { checkInitialSession } from './InitialSessionCheck';

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
    
    // Check initial session when component mounts
    checkInitialSession(navigate, toast, location.pathname);
    
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'Session:', session?.user?.email);
      await handleAuthEvent(event, session, navigate, toast, location.pathname);
    });

    // Store subscription reference
    authSubscription.current = subscription;

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth subscription');
      if (authSubscription.current) {
        authSubscription.current.unsubscribe();
      }
    };
  }, [navigate, location.pathname, toast]);

  return null;
};