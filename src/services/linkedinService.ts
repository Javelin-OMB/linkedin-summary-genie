import { LinkedInProfile, TokenData } from './linkedinTypes';
import { mockProfileData } from './mockData';
import { analyzeProfileForDisc } from './discAnalyzer';
import { toast } from "@/components/ui/use-toast";

const PROXY_URL = import.meta.env.PROD 
  ? 'https://api.lovable.app/proxy/linkedin'
  : 'http://localhost:3000/proxy/linkedin';

const RELEVANCE_API_URL = 'https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited';

const fetchRelevanceSummary = async (linkedinUrl: string): Promise<string> => {
  try {
    const response = await fetch(RELEVANCE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'YOUR_API_KEY' // Note: You should store this securely
      },
      body: JSON.stringify({
        params: {
          linkedin_url: linkedinUrl
        },
        project: "d607c466-f207-4c47-907f-d928278273e2"
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch summary from Relevance API');
    }

    const data = await response.json();
    return data.output || 'No summary available';
  } catch (error) {
    console.error('Error fetching from Relevance:', error);
    throw new Error('Failed to generate profile summary');
  }
};

const isTokenValid = () => {
  const authDataStr = localStorage.getItem("linkedin_auth_data");
  if (!authDataStr) return false;

  try {
    const authData: TokenData = JSON.parse(authDataStr);
    const now = new Date().getTime();
    const tokenAge = (now - authData.timestamp) / 1000;
    return tokenAge < authData.expiresIn;
  } catch {
    return false;
  }
};

const extractProfileId = (url: string): string => {
  const cleanUrl = url.replace(/\/$/, '');
  const matches = cleanUrl.match(/(?:\/in\/|\/pub\/|company\/|profile\/view\?id=)([^\/\?]+)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  const urlParts = cleanUrl.split('/');
  return urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
};

const fetchRecentPosts = async (profileId: string, authCode: string): Promise<string[]> => {
  try {
    const response = await fetch(`${PROXY_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({
        profile_id: profileId,
        auth_code: authCode
      })
    });

    if (!response.ok) {
      console.error('Posts fetch error:', response.status);
      return [];
    }

    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const fetchLinkedInProfile = async (url: string): Promise<LinkedInProfile> => {
  if (import.meta.env.DEV) {
    console.log("Development mode: Returning mock profile data");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockProfileData;
  }

  if (!isTokenValid()) {
    toast({
      title: "Authentication required",
      description: "Your LinkedIn session has expired. Please log in again.",
      variant: "destructive",
    });
    throw new Error("LinkedIn authentication expired. Please reconnect your account.");
  }

  const authDataStr = localStorage.getItem("linkedin_auth_data");
  if (!authDataStr) {
    throw new Error("LinkedIn authentication required. Please connect your account.");
  }

  try {
    const authData: TokenData = JSON.parse(authDataStr);
    const profileId = extractProfileId(url);

    // First, get the LinkedIn profile data
    const response = await fetch(`${PROXY_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify({
        profile_id: profileId,
        auth_code: authData.code
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("linkedin_auth_data");
        toast({
          title: "Session Expired",
          description: "Your LinkedIn session has expired. Please log in again.",
          variant: "destructive",
        });
        throw new Error("LinkedIn session expired. Please reconnect.");
      }
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    const profileData = await response.json();
    const recentPosts = await fetchRecentPosts(profileId, authData.code);
    
    // Get the AI-generated summary from Relevance
    const summary = await fetchRelevanceSummary(url);

    return {
      name: `${profileData.firstName} ${profileData.lastName}`,
      headline: profileData.headline || '',
      summary: summary, // Using the Relevance-generated summary
      discProfile: analyzeProfileForDisc(profileData),
      recentPosts
    };
  } catch (error) {
    console.error("LinkedIn API Error:", error);
    toast({
      title: "Error fetching profile",
      description: error instanceof Error ? error.message : "Something went wrong while fetching the LinkedIn profile",
      variant: "destructive",
    });
    throw error;
  }
};
