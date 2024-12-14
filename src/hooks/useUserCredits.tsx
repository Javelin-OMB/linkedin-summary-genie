import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";

export const useUserCredits = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    const fetchCredits = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('credits, trial_start')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setCredits(data?.credits ?? 0);
      } catch (error) {
        console.error('Error fetching user credits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [session]);

  return { credits, isLoading };
};