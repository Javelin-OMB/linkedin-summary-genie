import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const SessionHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Initial session check
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No initial session found');
        navigate('/login');
      }
    };

    checkInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user?.email);
          toast({
            title: "Ingelogd",
            description: "Je bent succesvol ingelogd",
          });
          navigate('/');
          break;

        case 'SIGNED_OUT':
          console.log('User signed out');
          toast({
            title: "Uitgelogd",
            description: "Je bent uitgelogd",
          });
          navigate('/login');
          break;

        case 'TOKEN_REFRESHED':
          if (session) {
            console.log('Token refreshed successfully');
            // Persist the session
            await supabase.auth.setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            });
          } else {
            console.log('Token refresh failed');
            handleTokenError();
          }
          break;

        case 'USER_UPDATED':
          console.log('User data updated');
          break;
      }
    });

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

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
};