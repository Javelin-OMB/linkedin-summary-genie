import { LinkedInProfile, TokenData } from './linkedinTypes';
import { mockProfileData } from './mockData';
import { analyzeProfileForDisc } from './discAnalyzer';
import { toast } from "@/components/ui/use-toast";

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

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

const fetchRecentPosts = async (profileId: string, authCode: string): Promise<string[]> => {
  try {
    console.log('Fetching posts for profile:', profileId);
    const response = await fetch(`${LINKEDIN_API_URL}/people/${profileId}/posts`, {
      headers: {
        'Authorization': `Bearer ${authCode}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Posts fetch response:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Posts fetch error details:', errorText);
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const postsData = await response.json();
    return postsData.elements
      .slice(0, 3)
      .map((post: any) => post.commentary || post.text || '')
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchLinkedInProfile = async (url: string): Promise<LinkedInProfile> => {
  if (import.meta.env.DEV) {
    console.log("Development mode: Returning mock profile data");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockProfileData;
  }

  if (!isTokenValid()) {
    console.error("LinkedIn token invalid or expired");
    toast({
      title: "Authentication Required",
      description: "Je LinkedIn-sessie is verlopen. Log opnieuw in.",
      variant: "destructive",
    });
    throw new Error("LinkedIn authentication expired. Please reconnect your account.");
  }

  const authDataStr = localStorage.getItem("linkedin_auth_data");
  if (!authDataStr) {
    throw new Error("LinkedIn authentication required. Please connect your account.");
  }

  try {
    console.log('Starting LinkedIn profile fetch');
    const authData: TokenData = JSON.parse(authDataStr);
    
    // Extract profile ID from URL
    const urlParts = url.split('/');
    const profileId = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    console.log('Extracted profile ID:', profileId);

    const response = await fetch(`${LINKEDIN_API_URL}/people/${profileId}`, {
      headers: {
        'Authorization': `Bearer ${authData.code}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Profile fetch response:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Profile fetch error details:', errorText);
      
      if (response.status === 401) {
        localStorage.removeItem("linkedin_auth_data");
        toast({
          title: "Sessie Verlopen",
          description: "Je LinkedIn-sessie is verlopen. Log opnieuw in.",
          variant: "destructive",
        });
        throw new Error("LinkedIn session expired. Please reconnect.");
      }
      
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    const profileData = await response.json();
    console.log('LinkedIn API response:', profileData);

    const recentPosts = await fetchRecentPosts(profileId, authData.code);

    const profile: LinkedInProfile = {
      name: `${profileData.firstName} ${profileData.lastName}`,
      headline: profileData.headline || '',
      summary: profileData.summary || '',
      discProfile: analyzeProfileForDisc(profileData),
      recentPosts
    };

    return profile;
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