import React from 'react';
import SignupFormFields from './SignupFormFields';
import SignupButton from './SignupButton';
import LoginLinks from './LoginLinks';
import useSignup from '@/hooks/useSignup';

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSignup
  } = useSignup(onSuccess);

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <SignupFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
      />
      <SignupButton isLoading={isLoading} />
      <LoginLinks mode="signup" />
    </form>
  );
};

export default SignupForm;