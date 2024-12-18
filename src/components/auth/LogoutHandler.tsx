import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

export const useLogoutHandler = () => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Clear any stored session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Uitloggen mislukt",
          description: "Er is een fout opgetreden tijdens het uitloggen. Probeer het opnieuw.",
          variant: "destructive",
        });
        return;
      }

      console.log('Logout successful');
      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd.",
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Uitloggen mislukt",
        description: "Er is een onverwachte fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      });
    }
  };

  return handleLogout;
};