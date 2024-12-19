import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
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
        console.log('ProtectedRoute - Current session:', currentSession?.user?.email);
        
        if (!currentSession) {
          console.log('ProtectedRoute - No session found, redirecting to login');
          toast({
            title: "Toegang geweigerd",
            description: "Log in om deze pagina te bekijken",
            variant: "destructive",
          });
          await safeNavigate(navigate, '/', { replace: true });
          return;
        }

        await initializeUserSession(currentSession.user.id, currentSession.user.email);
        console.log('ProtectedRoute - Session valid, proceeding to render protected content');
      } catch (error) {
        console.error('ProtectedRoute - Error checking session:', error);
        toast({
          title: "Er is een fout opgetreden",
          description: "Probeer opnieuw in te loggen",
          variant: "destructive",
        });
        await safeNavigate(navigate, '/', { replace: true });
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