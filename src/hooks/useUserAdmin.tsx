import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAdminCheck } from './useAdminCheck';

export const useUserAdmin = () => {
  const { toast } = useToast();
  const { checkAdminStatus } = useAdminCheck();

  const toggleAdmin = async (userId: string) => {
    try {
      await checkAdminStatus();
      
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('users')
        .update({ is_admin: !user.is_admin })
        .eq('id', userId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        title: "Fout",
        description: "Kon admin status niet wijzigen",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { toggleAdmin };
};