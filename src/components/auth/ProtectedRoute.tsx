import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/LoadingSpinner';
import { initializeUserSession } from '@/utils/sessionInitializer';
import { safeNavigate } from '@/utils/navigationUtils';

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
        setIsLoading(false);
      } catch (error) {
        console.error('ProtectedRoute - Error checking session:', error);
        toast({
          title: "Er is een fout opgetreden",
          description: "Probeer opnieuw in te loggen",
          variant: "destructive",
        });
        await safeNavigate(navigate, '/', { replace: true });
      }
    };

    checkSession();
  }, [navigate, toast]);

  if (!session && !isLoading) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner message="Bezig met laden..." />;
  }

  return <>{children}</>;
};