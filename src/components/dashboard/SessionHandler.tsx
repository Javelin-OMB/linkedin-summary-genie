import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

interface SessionHandlerProps {
  loadingTimeout: boolean;
}

const SessionHandler = ({ loadingTimeout }: SessionHandlerProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkSession = () => {
      if (!session && loadingTimeout) {
        console.log('No session found, redirecting to login');
        navigate('/login');
        toast({
          title: "Sessie verlopen",
          description: "Log opnieuw in om door te gaan",
          variant: "destructive",
        });
      }
    };

    // Initial check
    checkSession();

    // Set up periodic checks
    const intervalId = setInterval(checkSession, 5000);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [session, loadingTimeout, navigate, toast]);

  return null;
};

export default SessionHandler;