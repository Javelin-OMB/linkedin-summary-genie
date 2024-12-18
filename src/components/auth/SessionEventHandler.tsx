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
          // Update session
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token
          });
          
          // Verify user exists in users table
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

          // Only redirect to dashboard if not already there
          if (currentPath !== '/dashboard') {
            console.log('Redirecting to dashboard...');
            navigate('/dashboard', { replace: true });
            toast({
              title: "Successfully logged in",
              description: "Welcome back!",
            });
          }
        } catch (error) {
          console.error('Error handling session:', error);
          toast({
            title: "Something went wrong",
            description: "Please try logging in again",
            variant: "destructive",
          });
        }
      }
      break;

    case 'SIGNED_OUT':
      console.log('User signed out, clearing session data...');
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Only redirect to home if on a protected route
      if (!['/', '/login', '/about', '/pricing'].includes(currentPath)) {
        navigate('/', { replace: true });
        toast({
          title: "Logged out",
          description: "See you soon!",
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