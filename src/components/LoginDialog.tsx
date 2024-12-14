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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === 'login' ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            {mode === 'login' 
              ? "Log in met je email en wachtwoord" 
              : "Maak een nieuw account aan"}
          </DialogDescription>
        </DialogHeader>
        <LoginForm onSuccess={() => onOpenChange(false)} mode={mode} />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;