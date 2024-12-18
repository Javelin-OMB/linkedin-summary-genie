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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="dialog-title" className="text-2xl font-bold text-center">
            {title}
          </DialogTitle>
          <DialogDescription id="dialog-description" className="text-center text-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        <LoginForm onSuccess={handleSuccess} mode={mode} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;