import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/dashboard');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Welcome Back
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