import { supabase } from "@/integrations/supabase/client";
import { fetchLinkedInProfile } from "./linkedinService";

interface Analysis {
  id: string;
  linkedin_url: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  started_at: string;
  analysis: Record<string, any>;
}

interface UserData {
  credits: number | null;
  trial_start: string | null;
}

export const createAnalysis = async (url: string, userId: string): Promise<Analysis> => {
  const analysisId = crypto.randomUUID();
  
  const { data: newAnalysis, error: insertError } = await supabase
    .from('linkedin_analyses')
    .insert({
      id: analysisId,
      linkedin_url: url,
      user_id: userId,
      status: 'processing',
      started_at: new Date().toISOString(),
      analysis: {}
    })
    .select()
    .maybeSingle();

  if (insertError) {
    console.error('Error creating analysis record:', insertError);
    if (insertError.code === '23505') {
      throw new Error('Dit profiel wordt momenteel geanalyseerd. Probeer het later opnieuw.');
    }
    throw new Error('Kon geen nieuwe analyse aanmaken');
  }

  if (!newAnalysis) {
    throw new Error('Geen analyse data ontvangen na creatie');
  }

  return newAnalysis;
};

export const updateAnalysisWithResults = async (analysisId: string, data: any) => {
  const { error } = await supabase
    .from('linkedin_analyses')
    .update({
      analysis: data,
      status: 'completed'
    })
    .eq('id', analysisId);

  if (error) {
    console.error('Error updating analysis:', error);
    throw new Error('Kon analyse resultaten niet updaten');
  }
};

export const markAnalysisAsFailed = async (userId: string, url: string) => {
  const { error } = await supabase
    .from('linkedin_analyses')
    .update({ status: 'failed' })
    .eq('user_id', userId)
    .eq('linkedin_url', url)
    .eq('status', 'processing');

  if (error) {
    console.error('Error marking analysis as failed:', error);
    throw new Error('Kon analyse niet markeren als mislukt');
  }
};

export const checkExistingAnalysis = async (url: string): Promise<Analysis[] | null> => {
  const { data: existingAnalyses, error: checkError } = await supabase
    .from('linkedin_analyses')
    .select('*')
    .eq('linkedin_url', url)
    .eq('status', 'processing');

  if (checkError) {
    console.error('Error checking analysis status:', checkError);
    throw new Error('Kon analyse status niet controleren');
  }

  return existingAnalyses;
};

export const getUserCredits = async (userId: string): Promise<UserData> => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('credits, trial_start')
    .eq('id', userId)
    .maybeSingle();

  if (userError) {
    console.error('Error fetching user data:', userError);
    throw new Error('Kon gebruiker gegevens niet ophalen');
  }

  if (!userData) {
    throw new Error('Geen gebruiker gevonden');
  }

  return userData;
};

export const decrementUserCredits = async (userId: string, currentCredits: number) => {
  const { error } = await supabase
    .from('users')
    .update({ credits: currentCredits - 1 })
    .eq('id', userId);

  if (error) {
    console.error('Error decrementing credits:', error);
    throw new Error('Kon credits niet verminderen');
  }
};