import React from 'react';
import LoginFormFields from './LoginFormFields';

interface SignupFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
}

const SignupFormFields: React.FC<SignupFormFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading
}) => {
  return (
    <LoginFormFields
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
    />
  );
};

export default SignupFormFields;