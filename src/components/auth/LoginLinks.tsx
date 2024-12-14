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
          <a href="#" className="text-sm text-[#0177B5] hover:underline block">
            Wachtwoord vergeten?
          </a>
          <a href="/pricing" className="text-sm text-[#0177B5] hover:underline block">
            Nog geen account? Registreer je hier
          </a>
        </>
      ) : (
        <a 
          href="#" 
          className="text-sm text-[#0177B5] hover:underline block" 
          onClick={() => navigate('/login')}
        >
          Al een account? Log hier in
        </a>
      )}
    </div>
  );
};

export default LoginLinks;