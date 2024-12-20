import { supabase } from "@/integrations/supabase/client";
import { fetchLinkedInProfile } from "./linkedinService";

export const createAnalysis = async (url: string, userId: string) => {
  // Generate a UUID for the analysis
  const analysisId = crypto.randomUUID();
  
  // Create a new analysis record
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
    .single();

  if (insertError) {
    console.error('Error creating analysis record:', insertError);
    if (insertError.code === '23505') {
      throw new Error('This profile is currently being analyzed. Please try again in a moment.');
    }
    throw insertError;
  }

  return newAnalysis;
};

export const updateAnalysisWithResults = async (analysisId: string, data: any) => {
  return await supabase
    .from('linkedin_analyses')
    .update({
      analysis: data,
      status: 'completed'
    })
    .eq('id', analysisId);
};

export const markAnalysisAsFailed = async (userId: string, url: string) => {
  return await supabase
    .from('linkedin_analyses')
    .update({ status: 'failed' })
    .eq('user_id', userId)
    .eq('linkedin_url', url)
    .eq('status', 'processing');
};

export const checkExistingAnalysis = async (url: string) => {
  const { data: existingAnalyses, error: checkError } = await supabase
    .from('linkedin_analyses')
    .select('*')
    .eq('linkedin_url', url)
    .eq('status', 'processing');

  if (checkError) {
    console.error('Error checking analysis status:', checkError);
    throw new Error('Failed to check analysis status');
  }

  return existingAnalyses;
};

export const getUserCredits = async (userId: string) => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('credits, trial_start')
    .eq('id', userId)
    .single();

  if (userError) {
    throw new Error('Failed to fetch user data');
  }

  return userData;
};

export const decrementUserCredits = async (userId: string, currentCredits: number) => {
  return await supabase
    .from('users')
    .update({ credits: currentCredits - 1 })
    .eq('id', userId);
};
