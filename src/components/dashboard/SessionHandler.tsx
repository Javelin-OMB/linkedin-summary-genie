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

    if (!session && loadingTimeout) {
      console.log('No session found after timeout, redirecting to login');
      timeoutId = setTimeout(() => {
        navigate('/login');
        toast({
          title: "Sessie verlopen",
          description: "Log opnieuw in om door te gaan",
          variant: "destructive",
        });
      }, 100); // Small delay to prevent immediate redirect
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [session, loadingTimeout, navigate, toast]);

  return null;
};

export default SessionHandler;