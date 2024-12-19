import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const checkInitialSession = async (
  navigate: ReturnType<typeof useNavigate>,
  toast: ReturnType<typeof useToast>['toast'],
  currentPath: string
) => {
  try {
    console.log('Checking initial session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking session:', error);
      throw error;
    }

    if (session?.user) {
      console.log('Valid session found for user:', session.user.email);
      
      // Verify user exists in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user data:', userError);
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
      if (currentPath === '/') {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
      }
    } else {
      console.log('No active session found');
      // Only redirect to home if on a protected route
      if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/about' && currentPath !== '/pricing') {
        console.log('Redirecting to home...');
        navigate('/', { replace: true });
        toast({
          title: "Sessie verlopen",
          description: "Log opnieuw in om door te gaan",
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    console.error('Session check error:', error);
    toast({
      title: "Sessie fout",
      description: "Er was een probleem met je sessie. Probeer opnieuw in te loggen.",
      variant: "destructive",
    });
    navigate('/', { replace: true });
  }
};