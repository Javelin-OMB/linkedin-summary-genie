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
      console.log('Initial session check:', session?.user?.email);
      
      if (!session) {
        console.log('No initial session found, redirecting to login');
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
          console.log('User signed in successfully:', session?.user?.email);
          // Ensure user record exists in the database
          if (session?.user?.id) {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userError) {
              console.error('Error fetching user data:', userError);
              toast({
                title: "Fout bij ophalen gebruikersgegevens",
                description: "Er is een probleem opgetreden. Probeer het opnieuw.",
                variant: "destructive",
              });
              return;
            }

            if (!userData) {
              console.log('Creating new user record');
              const { error: insertError } = await supabase
                .from('users')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    trial_start: new Date().toISOString(),
                    credits: 10,
                  }
                ]);

              if (insertError) {
                console.error('Error creating user record:', insertError);
                toast({
                  title: "Fout bij aanmaken gebruikersprofiel",
                  description: "Er is een probleem opgetreden. Probeer het opnieuw.",
                  variant: "destructive",
                });
                return;
              }
            }
          }

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
          console.log('Session token refreshed');
          if (session) {
            // Persist the refreshed session
            await supabase.auth.setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            });
          } else {
            console.log('Token refresh failed, clearing session');
            await supabase.auth.signOut();
            toast({
              title: "Sessie verlopen",
              description: "Log opnieuw in om door te gaan",
              variant: "destructive",
            });
            navigate('/login');
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
};