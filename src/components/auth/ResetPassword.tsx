import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';
import PasswordResetForm from './PasswordResetForm';
import { usePasswordReset } from '@/hooks/usePasswordReset';

const ResetPassword = () => {
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, handlePasswordReset } = usePasswordReset();

  useEffect(() => {
    const initializePasswordReset = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        if (!accessToken || type !== 'recovery') {
          console.error('Invalid or missing recovery token');
          toast({
            title: "Ongeldige link",
            description: "Deze wachtwoord reset link is ongeldig of verlopen.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        setInitializing(false);
      } catch (error) {
        console.error('Error in initializePasswordReset:', error);
        toast({
          title: "Fout",
          description: "Er is een fout opgetreden. Probeer het opnieuw.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    initializePasswordReset();

    return () => {
      setInitializing(false);
    };
  }, [navigate, toast]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Even geduld..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Nieuw wachtwoord instellen
        </h1>
        <PasswordResetForm 
          onSubmit={handlePasswordReset}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ResetPassword;