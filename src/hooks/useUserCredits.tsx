import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from './useAuth';
import { useSession } from '@supabase/auth-helpers-react';

export const useUserCredits = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { requireAdmin } = useAuth();
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
          .select('credits')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setCredits(data?.credits ?? 0);
      } catch (error) {
        console.error('Error fetching credits:', error);
        toast({
          title: "Error",
          description: "Could not load credits",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [session, toast]);

  const updateCredits = async (userId: string, change: number) => {
    try {
      // Verify admin status before proceeding
      await requireAdmin();
      
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const newCredits = (user.credits || 0) + change;
      if (newCredits < 0) {
        throw new Error('Credits cannot be negative');
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Update local state if the updated user is the current user
      if (userId === session?.user?.id) {
        setCredits(newCredits);
      }

      return true;
    } catch (error: any) {
      console.error('Error updating credits:', error);
      toast({
        title: "Error",
        description: error.message || "Could not update credits",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { credits, isLoading, updateCredits };
};
