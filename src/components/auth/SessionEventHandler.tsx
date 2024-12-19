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
  console.log('Auth state transition:', { event, user: session?.user?.email, currentPath });

  switch (event) {
    case 'SIGNED_IN':
      if (session?.user && session?.access_token) {
        console.log('Valid session detected, starting session handling...');
        
        try {
          // Update session
          console.log('Updating session tokens...');
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token
          });
          
          // Verify user exists in users table
          console.log('Verifying user record...');
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            console.error('Error checking user:', userError);
            throw userError;
          }

          // Create user record if it doesn't exist
          if (!userData) {
            console.log('Creating new user record...');
            const { error: insertError } = await supabase
              .from('users')
              .insert([{
                id: session.user.id,
                email: session.user.email,
                trial_start: new Date().toISOString(),
                credits: 10
              }]);

            if (insertError) {
              console.error('Error creating user record:', insertError);
              throw insertError;
            }
          }

          // Navigation logic with fallback
          if (currentPath !== '/dashboard') {
            console.log('Attempting navigation to dashboard...');
            try {
              navigate('/dashboard', { replace: true });
              console.log('Navigation to dashboard completed');
            } catch (navError) {
              console.error('Navigation failed, using fallback:', navError);
              window.location.href = '/dashboard';
            }
          }
        } catch (error) {
          console.error('Session handling error:', error);
          toast({
            title: "Er ging iets mis",
            description: "Probeer het opnieuw",
            variant: "destructive",
          });
          // Fallback navigation on error
          window.location.href = '/';
        }
      }
      break;

    case 'SIGNED_OUT':
      console.log('User signed out, cleaning up session data...');
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      if (!['/', '/login', '/about', '/pricing'].includes(currentPath)) {
        try {
          navigate('/', { replace: true });
        } catch (navError) {
          console.error('Navigation failed, using fallback:', navError);
          window.location.href = '/';
        }
        toast({
          title: "Uitgelogd",
          description: "Tot ziens!",
        });
      }
      break;

    case 'TOKEN_REFRESHED':
      console.log('Token refresh detected, updating session...');
      if (session?.access_token) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
      }
      break;
  }
};