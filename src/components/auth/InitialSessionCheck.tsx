import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const checkInitialSession = async (
  navigate: ReturnType<typeof useNavigate>,
  toast: ReturnType<typeof useToast>['toast'],
  currentPath: string
) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Initial session check:', session?.user?.email);
    
    if (error) {
      console.error('Error checking session:', error);
      throw error;
    }

    if (session?.user) {
      if (currentPath !== '/dashboard') {
        navigate('/dashboard', { replace: true });
      }
    } else if (!['/', '/login', '/about', '/pricing'].includes(currentPath)) {
      console.log('No session found, redirecting to home');
      navigate('/', { replace: true });
      toast({
        title: "Sessie verlopen",
        description: "Log opnieuw in om door te gaan",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error('Session check error:', error);
    toast({
      title: "Sessie fout",
      description: "Er is een probleem met je sessie. Probeer opnieuw in te loggen.",
      variant: "destructive",
    });
    navigate('/', { replace: true });
  }
};