import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const handleAuthEvent = async (
  event: string,
  session: any,
  navigate: ReturnType<typeof useNavigate>,
  toast: ReturnType<typeof useToast>['toast'],
  currentPath: string
) => {
  console.log('Auth event:', event, 'Session:', session?.user?.email);

  switch (event) {
    case 'SIGNED_IN':
      if (session?.user && session?.access_token) {
        console.log('Valid session detected, handling user session...');
        
        try {
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token
          });
          
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', session.user.id)
            .maybeSingle();

          if (userError) {
            console.error('Error checking admin status:', userError);
            throw userError;
          }

          console.log('User data:', userData);
          
          if (currentPath !== '/dashboard') {
            navigate('/dashboard', { replace: true });
            toast({
              title: "Succesvol ingelogd",
              description: "Welkom terug!",
            });
          }
        } catch (error) {
          console.error('Error handling session:', error);
          toast({
            title: "Er ging iets mis",
            description: "Probeer opnieuw in te loggen",
            variant: "destructive",
          });
        }
      }
      break;

    case 'SIGNED_OUT':
      console.log('User signed out, clearing session data...');
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      if (!['/', '/login', '/about', '/pricing'].includes(currentPath)) {
        navigate('/', { replace: true });
        toast({
          title: "Uitgelogd",
          description: "Tot ziens!",
        });
      }
      break;

    case 'TOKEN_REFRESHED':
      console.log('Token refreshed, updating session...');
      if (session?.access_token) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
      }
      break;
  }
};