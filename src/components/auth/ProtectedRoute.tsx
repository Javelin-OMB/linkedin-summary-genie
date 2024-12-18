import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/LoadingSpinner';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Protected Route - Current session:', currentSession?.user?.email);
        
        if (!currentSession) {
          console.log('No session found in ProtectedRoute, redirecting to login');
          toast({
            title: "Toegang geweigerd",
            description: "Log in om deze pagina te bekijken",
            variant: "destructive",
          });
          navigate('/login', { replace: true });
          return;
        }

        // Check if user exists in the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', currentSession.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          throw userError;
        }

        console.log('User admin status in ProtectedRoute:', userData?.is_admin);

        // Ensure the session is properly set
        await supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token
        });
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
};