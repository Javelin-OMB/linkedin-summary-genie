import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import LoginDialog from '@/components/LoginDialog';

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      console.log('User is already logged in, redirecting...');
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginDialog 
        isOpen={true} 
        onOpenChange={() => {
          // This dialog should always stay open on the login page
          return;
        }} 
      />
    </div>
  );
};

export default Login;