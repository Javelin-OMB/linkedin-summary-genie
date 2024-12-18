import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePasswordReset } from '@/hooks/usePasswordReset';

interface PasswordResetFormProps {
  onSubmit: (password: string) => Promise<void>;
  loading: boolean;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onSubmit, loading }) => {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Nieuw wachtwoord
        </label>
        <Input
          id="password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Vul je nieuwe wachtwoord in"
          required
          minLength={6}
          className="mt-1"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-brand-primary hover:bg-brand-hover text-black"
        disabled={loading}
      >
        {loading ? "Bezig met wijzigen..." : "Wachtwoord wijzigen"}
      </Button>
    </form>
  );
};

export default PasswordResetForm;