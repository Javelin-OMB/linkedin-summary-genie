import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  [key: string]: any;
}

export const analyzeLinkedInProfile = async (url: string, userId: string, currentCredits: number | null) => {
  console.log('Starting LinkedIn profile analysis...');
  console.log('URL:', url);
  console.log('User ID:', userId);
  console.log('Current credits:', currentCredits);
  
  try {
    console.log('Making API request via Edge Function...');
    const { data: functionData, error: functionError } = await supabase.functions.invoke('analyze-linkedin', {
      body: { url }
    });

    if (functionError) {
      console.error('Edge Function Error:', functionError);
      throw new Error(`Edge Function error: ${functionError.message}`);
    }

    if (!functionData || functionData.error) {
      console.error('Analysis failed:', functionData?.error || 'Unknown error');
      throw new Error(functionData?.error || 'Failed to analyze LinkedIn profile');
    }

    console.log('API Response data:', functionData);

    // Store analysis in Supabase
    console.log('Storing analysis in Supabase...');
    const { error: analysisError } = await supabase
      .from('linkedin_analyses')
      .insert({
        linkedin_url: url,
        analysis: functionData,
        user_id: userId
      });

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      throw new Error('Failed to store analysis in database');
    }

    // Decrease credits
    if (currentCredits !== null) {
      console.log('Updating user credits...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: currentCredits - 1 })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating credits:', updateError);
        throw new Error('Failed to update credits');
      }
      console.log('Credits updated successfully');
    }

    console.log('Analysis completed successfully');
    return functionData;
  } catch (error) {
    console.error('LinkedIn Analysis Error:', error);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze LinkedIn profile');
  }
};