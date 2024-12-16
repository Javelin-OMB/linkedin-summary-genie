import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAdminCheck = () => {
  const session = useSession();
  const { toast } = useToast();

  const checkAdminStatus = async () => {
    if (!session?.user?.id) {
      console.error('No session found when checking admin status');
      throw new Error('Authentication required');
    }

    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (currentUserError) {
      console.error('Error checking admin status:', currentUserError);
      toast({
        title: "Fout",
        description: "Failed to verify admin status",
        variant: "destructive",
      });
      throw new Error('Failed to verify admin status');
    }

    if (!currentUser?.is_admin) {
      console.error('Non-admin user attempted admin action');
      throw new Error('Unauthorized: Admin access required');
    }

    return true;
  };

  return { checkAdminStatus };
};