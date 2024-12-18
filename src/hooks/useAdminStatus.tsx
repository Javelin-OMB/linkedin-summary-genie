import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) {
        setIsAdmin(false);
        return;
      }

      try {
        console.log('Checking admin status for user:', session.user.email);
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error);
          toast({
            title: "Error",
            description: "Could not verify admin status",
            variant: "destructive",
          });
          return;
        }
        
        setIsAdmin(!!data?.is_admin);
        
        if (data?.is_admin) {
          console.log('Admin status confirmed for user:', session.user.email);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [session, supabase, toast]);

  return isAdmin;
};