import { LinkedInProfile, TokenData } from './linkedinTypes';
import { mockProfileData } from './mockData';
import { analyzeProfileForDisc } from './discAnalyzer';
import { toast } from "@/components/ui/use-toast";

// Use a proxy URL for LinkedIn API calls with the correct environment
const PROXY_URL = import.meta.env.PROD 
  ? 'https://api.lovable.app/proxy/linkedin'
  : 'http://localhost:3000/proxy/linkedin';

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
  // Remove trailing slash if present
  const cleanUrl = url.replace(/\/$/, '');
  
  // Try to extract the profile ID or vanity URL
  const matches = cleanUrl.match(/(?:\/in\/|\/pub\/|company\/|profile\/view\?id=)([^\/\?]+)/);
  if (matches && matches[1]) {
    return matches[1];
  }
  
  // If no match found, try to get the last part of the URL
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
        'Accept': 'application/json'
      },
      credentials: 'include',
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
  // Only use mock data in development
  if (import.meta.env.DEV) {
    console.log("Development mode: Returning mock profile data");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockProfileData;
  }

  if (!isTokenValid()) {
    toast({
      title: "Authenticatie vereist",
      description: "Je LinkedIn-sessie is verlopen. Log opnieuw in.",
      variant: "destructive",
    });
    throw new Error("LinkedIn authenticatie verlopen. Verbind je account opnieuw.");
  }

  const authDataStr = localStorage.getItem("linkedin_auth_data");
  if (!authDataStr) {
    throw new Error("LinkedIn authenticatie vereist. Verbind je account.");
  }

  try {
    const authData: TokenData = JSON.parse(authDataStr);
    const profileId = extractProfileId(url);

    const response = await fetch(`${PROXY_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        profile_id: profileId,
        auth_code: authData.code
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("linkedin_auth_data");
        toast({
          title: "Sessie Verlopen",
          description: "Je LinkedIn-sessie is verlopen. Log opnieuw in.",
          variant: "destructive",
        });
        throw new Error("LinkedIn sessie verlopen. Verbind opnieuw.");
      }
      throw new Error(`LinkedIn API fout: ${response.statusText}`);
    }

    const profileData = await response.json();
    const recentPosts = await fetchRecentPosts(profileId, authData.code);

    return {
      name: `${profileData.firstName} ${profileData.lastName}`,
      headline: profileData.headline || '',
      summary: profileData.summary || '',
      discProfile: analyzeProfileForDisc(profileData),
      recentPosts
    };
  } catch (error) {
    console.error("LinkedIn API Error:", error);
    toast({
      title: "Fout bij ophalen profiel",
      description: error instanceof Error ? error.message : "Er ging iets mis bij het ophalen van het LinkedIn profiel",
      variant: "destructive",
    });
    throw error;
  }
};