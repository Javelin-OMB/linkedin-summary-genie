import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated:', session);
      } else if (event === 'USER_DELETED') {
        navigate('/login');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password recovery email sent",
          description: "Please check your email for the recovery link.",
        });
      } else if (event === 'AUTH_ERROR') {
        toast({
          title: "Authentication error",
          description: "Please try again or contact support if the problem persists.",
          variant: "destructive",
        });
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-[#0177B5] mb-8">
          Welcome to LeadSummary
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: {
                background: '#0177B5',
                color: 'white',
                borderRadius: '0.375rem',
              },
              anchor: {
                color: '#0177B5',
              },
            },
          }}
          theme="light"
          providers={[]}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
};

export default Login;