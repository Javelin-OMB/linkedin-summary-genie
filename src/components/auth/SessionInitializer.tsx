import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { initializeUserSession } from '@/utils/sessionInitializer';
import { safeNavigate } from '@/utils/navigationUtils';

interface SessionInitializerProps {
  setIsLoading: (loading: boolean) => void;
  setSessionChecked: (checked: boolean) => void;
  navigate: any;
  toast: any;
  currentPath: string;
}

export const SessionInitializer = ({
  setIsLoading,
  setSessionChecked,
  navigate,
  toast,
  currentPath
}: SessionInitializerProps) => {
  useEffect(() => {
    const initSession = async () => {
      try {
        console.log('SessionInitializer - Starting session check');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SessionInitializer - Session check error:', error);
          throw error;
        }

        if (!session?.user) {
          console.log('SessionInitializer - No session found, redirecting to login');
          if (currentPath !== '/' && 
              currentPath !== '/login' && 
              currentPath !== '/about' && 
              currentPath !== '/pricing') {
            toast({
              title: "Toegang geweigerd",
              description: "Log in om deze pagina te bekijken",
              variant: "destructive",
            });
            await safeNavigate(navigate, '/', { replace: true });
          }
        } else {
          console.log('SessionInitializer - Valid session found:', session.user.email);
          await initializeUserSession(session.user.id, session.user.email);
        }
      } catch (error) {
        console.error('SessionInitializer - Error:', error);
        toast({
          title: "Er is een fout opgetreden",
          description: "Probeer opnieuw in te loggen",
          variant: "destructive",
        });
        await safeNavigate(navigate, '/', { replace: true });
      } finally {
        setIsLoading(false);
        setSessionChecked(true);
      }
    };

    initSession();
  }, [setIsLoading, setSessionChecked, navigate, toast, currentPath]);

  return null;
};