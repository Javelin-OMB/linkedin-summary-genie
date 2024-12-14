import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export const useUserCredits = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchCredits = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching credits for user:', session.user.email);
        const { data, error } = await supabase
          .from('users')
          .select('credits')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching credits:', error);
          throw error;
        }

        console.log('Credits fetched:', data?.credits);
        setCredits(data?.credits ?? 0);
      } catch (error) {
        console.error('Error in fetchCredits:', error);
        setCredits(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [session, supabase]);

  return { credits, isLoading };
};