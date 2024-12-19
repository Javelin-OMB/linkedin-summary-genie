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
        console.log('ProtectedRoute - Starting session check');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('ProtectedRoute - Current session:', currentSession?.user?.email);
        
        if (!currentSession) {
          console.log('ProtectedRoute - No session found, redirecting to login');
          toast({
            title: "Toegang geweigerd",
            description: "Log in om deze pagina te bekijken",
            variant: "destructive",
          });
          try {
            await navigate('/', { replace: true });
          } catch (navError) {
            console.error('Navigation failed, using fallback:', navError);
            window.location.href = '/';
          }
          return;
        }

        // Verify user exists in the users table
        console.log('ProtectedRoute - Verifying user record');
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentSession.user.id)
          .maybeSingle();

        if (userError && userError.code !== 'PGRST116') {
          console.error('ProtectedRoute - Error fetching user data:', userError);
          throw userError;
        }

        // If user doesn't exist in the users table, create them
        if (!userData) {
          console.log('ProtectedRoute - Creating new user record');
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              id: currentSession.user.id,
              email: currentSession.user.email,
              trial_start: new Date().toISOString(),
              credits: 10
            }]);

          if (insertError) {
            console.error('ProtectedRoute - Error creating user record:', insertError);
            throw insertError;
          }
        }

        console.log('ProtectedRoute - Session valid, proceeding to render protected content');
      } catch (error) {
        console.error('ProtectedRoute - Error checking session:', error);
        toast({
          title: "Er is een fout opgetreden",
          description: "Probeer opnieuw in te loggen",
          variant: "destructive",
        });
        try {
          await navigate('/', { replace: true });
        } catch (navError) {
          console.error('Navigation failed, using fallback:', navError);
          window.location.href = '/';
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      checkSession();
    }
  }, [navigate, toast, isLoading]);

  // Add immediate check for session to prevent unnecessary loading
  if (!session && !isLoading) {
    console.log('ProtectedRoute - No session found after loading');
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner message="Bezig met laden..." />;
  }

  console.log('ProtectedRoute - Rendering protected content');
  return <>{children}</>;
};