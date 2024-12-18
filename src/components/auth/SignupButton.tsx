import React from 'react';
import { Button } from "@/components/ui/button";

interface SignupButtonProps {
  isLoading: boolean;
}

const SignupButton: React.FC<SignupButtonProps> = ({ isLoading }) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-brand-primary hover:bg-brand-hover text-black"
      disabled={isLoading}
    >
      {isLoading ? "Account aanmaken..." : "Account aanmaken"}
    </Button>
  );
};

export default SignupButton;