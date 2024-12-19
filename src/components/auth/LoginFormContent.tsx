import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import LoginFormFields from './LoginFormFields';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useLoginSubmitHandler } from './LoginSubmitHandler';

interface LoginFormContentProps {
  onSuccess?: () => void;
}

const LoginFormContent: React.FC<LoginFormContentProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { onSubmit, isLoading } = useLoginSubmitHandler({
    email,
    password,
    onSuccess,
    setEmail,
    setPassword,
  });

  if (isLoading) {
    return <LoadingSpinner message="Bezig met inloggen..." />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <LoginFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
      />
      <Button 
        type="submit" 
        className="w-full bg-[#FEDB01] hover:bg-[#FEDB01]/90 text-black"
        disabled={isLoading}
      >
        {isLoading ? "Inloggen..." : "Inloggen"}
      </Button>
      <div className="text-center space-y-2">
        <a href="#" className="block text-[#FEDB01] hover:text-[#FEDB01]/90">
          Wachtwoord vergeten?
        </a>
        <a href="#" className="block text-[#FEDB01] hover:text-[#FEDB01]/90">
          Nog geen account? Registreer je hier
        </a>
      </div>
    </form>
  );
};

export default LoginFormContent;