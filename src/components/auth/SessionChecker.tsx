import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';

interface SessionCheckerProps {
  onSessionChecked: (isAuthenticated: boolean) => void;
}

export const SessionChecker = ({ onSessionChecked }: SessionCheckerProps) => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (!session?.user?.id) {
          console.log('No active session found');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login', { replace: true });
          }
          onSessionChecked(false);
        } else {
          console.log('Active session found for:', session.user.email);
          onSessionChecked(true);
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
          toast({
            title: "Sessie fout",
            description: "Er is een probleem met je sessie. Je wordt doorgestuurd...",
            variant: "destructive",
          });
          navigate('/login', { replace: true });
        }
        onSessionChecked(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [supabase, navigate, location.pathname, onSessionChecked, toast]);

  if (isLoading) {
    return <LoadingSpinner message="Even geduld..." />;
  }

  return null;
};