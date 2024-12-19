import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface UserDataQueryProps {
  loadingTimeout: boolean;
  children: (userData: any) => React.ReactNode;
}

const UserDataQuery = ({ loadingTimeout, children }: UserDataQueryProps) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [queryAttempts, setQueryAttempts] = useState(0);

  useEffect(() => {
    if (!session && loadingTimeout) {
      navigate('/login');
    }
  }, [session, loadingTimeout, navigate]);

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['userData', session?.user?.id, queryAttempts],
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
    staleTime: 30000,
    retry: 2,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Query error:', error);
      setQueryAttempts(prev => prev + 1);
      if (queryAttempts >= 2) {
        toast({
          title: "Fout bij laden",
          description: "Er ging iets mis bij het laden van je gegevens. Probeer de pagina te verversen.",
          variant: "destructive",
        });
      }
    }
  });

  if (error) {
    console.error('Dashboard error:', error);
    return null;
  }

  if (isLoading && !loadingTimeout) {
    return <LoadingSpinner message="Dashboard laden..." />;
  }

  if (isLoading && loadingTimeout) {
    return (
      <LoadingSpinner 
        message="Het laden duurt langer dan verwacht. Probeer de pagina te verversen." 
      />
    );
  }

  if (!session && loadingTimeout) {
    return null;
  }

  return <>{children(userData)}</>;
};

export default UserDataQuery;