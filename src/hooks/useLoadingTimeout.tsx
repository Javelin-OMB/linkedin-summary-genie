import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

const LOGIN_TIMEOUT = 10000; // 10 seconds

export const useLoadingTimeout = () => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startLoadingTimeout = () => {
    const timeout = setTimeout(() => {
      toast({
        title: "Login duurt te lang",
        description: "Probeer het later opnieuw",
        variant: "destructive",
      });
      window.location.href = '/'; // Fallback navigation
    }, LOGIN_TIMEOUT);
    
    setTimeoutId(timeout);
    return timeout;
  };

  const clearLoadingTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  useEffect(() => {
    return () => clearLoadingTimeout();
  }, []);

  return { startLoadingTimeout, clearLoadingTimeout };
};