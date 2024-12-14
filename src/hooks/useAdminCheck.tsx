import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

export const useAdminCheck = () => {
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!session?.user?.id) {
          console.log('No session found, redirecting to login');
          navigate('/login');
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          throw new Error('Failed to check admin status');
        }

        if (!userData?.is_admin) {
          console.log('User is not admin, redirecting to home');
          navigate('/');
          toast({
            title: "Toegang geweigerd",
            description: "Je hebt geen toegang tot deze pagina.",
            variant: "destructive",
          });
          return;
        }

        setIsCheckingAdmin(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Fout",
          description: "Er is een fout opgetreden bij het controleren van admin rechten.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [session, navigate, toast]);

  return { isCheckingAdmin };
};