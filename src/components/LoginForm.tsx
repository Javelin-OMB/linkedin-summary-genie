import React from 'react';
import SignupForm from './auth/SignupForm';
import LoginFormContent from './auth/LoginFormContent';

interface LoginFormProps {
  onSuccess?: () => void;
  mode?: 'login' | 'signup';
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, mode = 'login' }) => {
  if (mode === 'signup') {
    return <SignupForm onSuccess={onSuccess} />;
  }

  return <LoginFormContent onSuccess={onSuccess} />;
};

export default LoginForm;