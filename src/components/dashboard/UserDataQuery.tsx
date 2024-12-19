import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface UserDataQueryProps {
  loadingTimeout: boolean;
  children: (userData: any) => React.ReactNode;
}

const UserDataQuery = ({ loadingTimeout, children }: UserDataQueryProps) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if no session
  useEffect(() => {
    if (!session && loadingTimeout) {
      console.log('No session found after timeout, redirecting to login');
      navigate('/login');
      toast({
        title: "Sessie verlopen",
        description: "Log opnieuw in om door te gaan",
        variant: "destructive",
      });
    }
  }, [session, loadingTimeout, navigate, toast]);

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['userData', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('No session found');
      }
      
      console.log('Fetching user data for:', session.user.email);
      const { data, error } = await supabase
        .from('users')
        .select('credits, is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No user data found');
        throw new Error('User data not found');
      }

      return data;
    },
    enabled: !!session?.user?.id,
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
    retryDelay: 1000
  });

  if (isLoading && !loadingTimeout) {
    return (
      <LoadingSpinner 
        message="Dashboard laden..." 
      />
    );
  }

  if (isLoading && loadingTimeout) {
    return (
      <LoadingSpinner 
        message="Het laden duurt langer dan verwacht. Ververs de pagina als dit blijft duren." 
      />
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    toast({
      title: "Error",
      description: "Er ging iets mis bij het laden van je gegevens. Probeer de pagina te verversen.",
      variant: "destructive",
    });
    return null;
  }

  if (!session && loadingTimeout) {
    return null;
  }

  return <>{children(userData)}</>;
};

export default UserDataQuery;