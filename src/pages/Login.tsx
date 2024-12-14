import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';

  useEffect(() => {
    if (session) {
      console.log('User is already logged in, redirecting to homepage...');
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
        </h1>
        <LoginForm mode={mode as 'login' | 'signup'} />
      </div>
    </div>
  );
};

export default Login;