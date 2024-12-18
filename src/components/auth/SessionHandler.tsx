import { useEffect } from 'react';
import { SessionChecker } from './SessionChecker';
import { SessionStateListener } from './SessionStateListener';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const SessionHandler = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleTokenError = () => {
      console.log('Session refresh failed, clearing session...');
      supabase.auth.signOut();
      toast({
        title: "Session expired",
        description: "Please log in again",
        variant: "destructive",
      });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    // Handle token refresh errors
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        handleTokenError();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <>
      <SessionChecker onSessionChecked={() => {}} />
      <SessionStateListener onStateChange={() => {}} />
    </>
  );
};