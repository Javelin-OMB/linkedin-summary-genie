import React from 'react';
import { Input } from "@/components/ui/input";

interface LoginFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading
}) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">E-mailadres</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Vul je e-mailadres in"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Wachtwoord</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Vul je wachtwoord in"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>
    </>
  );
};

export default LoginFormFields;