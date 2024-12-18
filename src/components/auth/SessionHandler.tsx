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
            
            // Check if user exists in users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userError && userError.code !== 'PGRST116') {
              console.error('Error checking user:', userError);
              toast({
                title: "Error",
                description: "Er is een probleem opgetreden bij het ophalen van je gebruikersgegevens.",
                variant: "destructive",
              });
              return;
            }

            // If user doesn't exist, create them
            if (!userData) {
              const { error: insertError } = await supabase
                .from('users')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    trial_start: new Date().toISOString(),
                    credits: 10
                  }
                ]);

              if (insertError) {
                console.error('Error creating user:', insertError);
                toast({
                  title: "Error",
                  description: "Er is een probleem opgetreden bij het aanmaken van je gebruikersprofiel.",
                  variant: "destructive",
                });
                return;
              }
            }
            
            toast({
              title: "Succesvol ingelogd",
              description: "Je wordt doorgestuurd naar de hoofdpagina...",
            });

            // Kleine vertraging om de toast te laten zien
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 1000);
          }
          break;

        case 'SIGNED_OUT':
          console.log('User signed out');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
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

        if (!session && 
            !['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
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