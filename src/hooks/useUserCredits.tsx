import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAdminCheck } from './useAdminCheck';

export const useUserCredits = () => {
  const { toast } = useToast();
  const { checkAdminStatus } = useAdminCheck();

  const updateCredits = async (userId: string, change: number) => {
    try {
      await checkAdminStatus();
      
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

      return true;
    } catch (error) {
      console.error('Error updating credits:', error);
      toast({
        title: "Fout",
        description: "Kon credits niet bijwerken",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { updateCredits };
};