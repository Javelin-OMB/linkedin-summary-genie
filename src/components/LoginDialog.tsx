import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LoginForm from './LoginForm';

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'login' | 'signup';
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onOpenChange, mode = 'login' }) => {
  const title = mode === 'login' ? "Welkom terug" : "Account aanmaken";
  const description = mode === 'login' 
    ? "Log in met je email en wachtwoord" 
    : "Maak een nieuw account aan";

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const dialogId = mode === 'login' ? 'login-dialog' : 'signup-dialog';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-labelledby={`${dialogId}-title`}
        aria-describedby={`${dialogId}-description`}
      >
        <DialogHeader>
          <DialogTitle id={`${dialogId}-title`} className="text-2xl font-bold text-center">
            {title}
          </DialogTitle>
          <DialogDescription id={`${dialogId}-description`} className="text-center text-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        <LoginForm onSuccess={handleSuccess} mode={mode} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;