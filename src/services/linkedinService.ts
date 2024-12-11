import { LinkedInProfile } from './linkedinTypes';
import { mockProfileData } from './mockData';
import { analyzeProfileForDisc } from './discAnalyzer';
import { toast } from "@/components/ui/use-toast";

const RELEVANCE_API_URL = 'https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited';

export const fetchLinkedInProfile = async (url: string): Promise<LinkedInProfile> => {
  if (import.meta.env.DEV) {
    console.log("Development mode: Returning mock profile data");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockProfileData;
  }

  const RELEVANCE_API_KEY = localStorage.getItem('RELEVANCE_API_KEY');
  if (!RELEVANCE_API_KEY) {
    throw new Error('Relevance API key not found. Please set up your API key.');
  }

  try {
    const response = await fetch(RELEVANCE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': RELEVANCE_API_KEY
      },
      body: JSON.stringify({
        params: {
          linkedin_url: url
        },
        project: "d607c466-f207-4c47-907f-d928278273e2"
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch summary from Relevance API');
    }

    const data = await response.json();
    const summary = data.output || 'No summary available';

    // Create a profile object with the Relevance API response
    return {
      name: "Profile", // This will be extracted from the summary later
      headline: "Professional", // This will be extracted from the summary later
      summary: summary,
      discProfile: analyzeProfileForDisc({ summary }),
      recentPosts: [] // We're not fetching posts anymore
    };
  } catch (error) {
    console.error("API Error:", error);
    toast({
      title: "Error fetching profile",
      description: error instanceof Error ? error.message : "Something went wrong while fetching the profile",
      variant: "destructive",
    });
    throw error;
  }
};