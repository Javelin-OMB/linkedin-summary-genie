import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { safeNavigate } from '@/utils/navigationUtils';

export const useSessionState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const initialized = useRef(false);
  const authSubscription = useRef<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSessionError = async (error: any) => {
    console.error('Session error:', error);
    toast({
      title: "Er is een fout opgetreden",
      description: "Probeer opnieuw in te loggen",
      variant: "destructive",
    });
    await safeNavigate(navigate, '/', { replace: true });
  };

  return {
    isLoading,
    setIsLoading,
    sessionChecked,
    setSessionChecked,
    initialized,
    authSubscription,
    handleSessionError,
    navigate,
    toast
  };
};