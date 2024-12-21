import { supabase } from '../integrations/supabase/client';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from './useAuth';

export const useUserCreation = () => {
  const { toast } = useToast();
  const { requireAdmin } = useAuth();

  const addUser = async (email: string, initialCredits: number) => {
    try {
      // Verify admin status before proceeding
      await requireAdmin();

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true,
        password: Math.random().toString(36).slice(-8),
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create auth user');

      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          credits: initialCredits,
          is_admin: false
        });

      if (userError) throw userError;

      toast({
        title: "Succes",
        description: "Nieuwe gebruiker toegevoegd",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "Fout",
        description: error.message || "Kon gebruiker niet toevoegen",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { addUser };
};
