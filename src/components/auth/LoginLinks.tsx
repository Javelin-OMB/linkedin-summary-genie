import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginLinksProps {
  mode: 'login' | 'signup';
}

const LoginLinks: React.FC<LoginLinksProps> = ({ mode }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-2 text-center">
      {mode === 'login' ? (
        <>
          <a href="#" className="text-sm text-brand-primary hover:text-brand-hover block">
            Wachtwoord vergeten?
          </a>
          <a href="/pricing" className="text-sm text-brand-primary hover:text-brand-hover block">
            Nog geen account? Registreer je hier
          </a>
        </>
      ) : (
        <a 
          href="#" 
          className="text-sm text-brand-primary hover:text-brand-hover block" 
          onClick={() => navigate('/login')}
        >
          Al een account? Log hier in
        </a>
      )}
    </div>
  );
};

export default LoginLinks;