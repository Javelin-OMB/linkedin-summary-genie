import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

export const SessionHandler = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Initializing auth state...', { session });
    let isSubscribed = true;
    
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Current session:', currentSession?.user?.email);
        
        if (!currentSession?.user?.id) {
          console.log('No active session found');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
          return;
        }

        if (!isSubscribed) return;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          toast({
            title: "Error",
            description: "Er is een probleem opgetreden bij het ophalen van je gegevens.",
            variant: "destructive",
          });
          return;
        }

        if (!isSubscribed) return;
        setIsInitialized(true);

        if (location.pathname === '/login' && userData) {
          navigate('/');
          toast({
            title: "Welkom terug!",
            description: "Je bent succesvol ingelogd.",
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          title: "Error",
          description: "Er is een probleem opgetreden bij het controleren van je sessie.",
          variant: "destructive",
        });
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
        setIsInitialized(true);
        navigate('/');
        toast({
          title: "Welkom!",
          description: "Je bent succesvol ingelogd.",
        });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsInitialized(false);
        navigate('/');
        toast({
          title: "Tot ziens!",
          description: "Je bent succesvol uitgelogd.",
        });
      }
    });

    return () => {
      console.log('Cleaning up auth subscriptions');
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [supabase, navigate, location.pathname, toast, session]);

  return null;
};