import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const SessionHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleTokenError = () => {
      console.log('Session refresh failed, clearing session...');
      supabase.auth.signOut();
      toast({
        title: "Sessie verlopen",
        description: "Log opnieuw in om door te gaan",
        variant: "destructive",
      });
      navigate('/login');
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed successfully');
        toast({
          title: "Sessie vernieuwd",
          description: "Je sessie is succesvol vernieuwd",
        });
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        navigate('/login');
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
  }, [navigate, toast]);

  return null;
};