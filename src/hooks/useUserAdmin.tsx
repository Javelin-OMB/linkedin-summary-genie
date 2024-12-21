import { supabase } from '../integrations/supabase/client';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from './useAuth';

export const useUserAdmin = () => {
  const { toast } = useToast();
  const { requireAdmin } = useAuth();

  const toggleAdmin = async (userId: string) => {
    try {
      // Verify admin status before proceeding
      await requireAdmin();
      
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

      toast({
        title: "Succes",
        description: `Admin status ${user.is_admin ? 'verwijderd' : 'toegekend'}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error toggling admin status:', error);
      toast({
        title: "Fout",
        description: error.message || "Kon admin status niet wijzigen",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { toggleAdmin };
};
