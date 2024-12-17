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
    const checkSession = async () => {
      try {
        console.log('Checking session status...');
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession?.user?.id) {
          console.log('No active session found');
          if (!['/', '/login', '/about', '/pricing'].includes(location.pathname)) {
            navigate('/login');
          }
          onSessionChecked(false);
          setIsLoading(false);
          return;
        }

        console.log('Active session found for:', currentSession.user.email);
        onSessionChecked(true);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Session check error:', error);
        setIsLoading(false);
        if (location.pathname !== '/login') {
          toast({
            title: "Sessie fout",
            description: "Er is een probleem met je sessie. Je wordt doorgestuurd...",
            variant: "destructive",
          });
          navigate('/login');
        }
        onSessionChecked(false);
      }
    };

    checkSession();
  }, [supabase, navigate, location.pathname, toast, onSessionChecked]);

  if (isLoading) {
    return <LoadingSpinner message="Even geduld..." />;
  }

  return null;
};