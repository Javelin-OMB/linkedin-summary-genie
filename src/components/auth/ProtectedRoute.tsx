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
          navigate('/', { replace: true });
          return;
        }

        // Check if user exists in the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user data:', userError);
          throw userError;
        }

        // If user doesn't exist in the users table, create them
        if (!userData) {
          console.log('Creating new user record in ProtectedRoute');
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              id: currentSession.user.id,
              email: currentSession.user.email,
              trial_start: new Date().toISOString(),
              credits: 10
            }]);

          if (insertError) {
            console.error('Error creating user record:', insertError);
            throw insertError;
          }
        }

        console.log('Session valid, user can access protected route');
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/', { replace: true });
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