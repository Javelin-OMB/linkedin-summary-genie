import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/LoadingSpinner';
import { initializeUserSession } from '@/utils/sessionInitializer';
import { safeNavigate } from '@/utils/navigationUtils';
import { LOADING_TIMEOUT } from '@/utils/constants';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [sessionChecked, setSessionChecked] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        console.log('ProtectedRoute - Starting session check');

        // Set up loading timeout
        timeoutId = setTimeout(() => {
          console.error('ProtectedRoute - Loading timeout reached');
          setIsLoading(false);
          toast({
            title: "Laden duurde te lang",
            description: "Probeer de pagina te verversen",
            variant: "destructive",
          });
        }, LOADING_TIMEOUT);

        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('ProtectedRoute - Session check error:', error);
          throw error;
        }

        if (!currentSession?.user) {
          console.log('ProtectedRoute - No session found, redirecting to login');
          toast({
            title: "Toegang geweigerd",
            description: "Log in om deze pagina te bekijken",
            variant: "destructive",
          });
          await safeNavigate(navigate, '/', { replace: true });
          return;
        }

        console.log('ProtectedRoute - Valid session found:', currentSession.user.email);
        await initializeUserSession(currentSession.user.id, currentSession.user.email);
      } catch (error) {
        console.error('ProtectedRoute - Error checking session:', error);
        toast({
          title: "Er is een fout opgetreden",
          description: "Probeer opnieuw in te loggen",
          variant: "destructive",
        });
        await safeNavigate(navigate, '/', { replace: true });
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
        setSessionChecked(true);
      }
    };

    if (!sessionChecked) {
      checkSession();
    }

  // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [navigate, toast]);

  // Add session state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('ProtectedRoute - Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        setSessionChecked(false);
        setIsLoading(true);
        await safeNavigate(navigate, '/', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading || (!session && !sessionChecked)) {
    return <LoadingSpinner message="Bezig met laden..." />;
  }

  return <>{children}</>;
};