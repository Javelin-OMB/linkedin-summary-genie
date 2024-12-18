import { useToast } from "@/components/ui/use-toast";

interface SignupValidationProps {
  email: string;
  password: string;
}

const useSignupValidation = ({ email, password }: SignupValidationProps) => {
  const { toast } = useToast();

  const validateSignup = () => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Validatie fout",
        description: "Vul zowel je e-mailadres als wachtwoord in",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { validateSignup };
};

export default useSignupValidation;