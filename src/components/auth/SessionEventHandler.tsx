import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SessionEventHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', currentSession?.user?.email);
        
        if (currentSession?.user?.id) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }

          console.log('User data after sign in:', userData);
          
          if (userData) {
            console.log('Existing user - redirecting to homepage');
            toast({
              title: "Welcome back!",
              description: "You have successfully logged in.",
            });
            navigate('/');
          } else {
            console.log('New user - redirecting to pricing');
            navigate('/pricing');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        toast({
          title: "Signed out",
          description: "You have been logged out successfully",
        });
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
};