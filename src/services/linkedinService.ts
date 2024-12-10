import { toast } from "@/components/ui/use-toast";

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

interface LinkedInProfile {
  name: string;
  headline: string;
  summary: string;
  discProfile: {
    type: string;
    characteristics: string[];
    talkingPoints: string[];
  };
  recentPosts: string[];
}

export const fetchLinkedInProfile = async (url: string): Promise<LinkedInProfile> => {
  // Extract LinkedIn ID/username from URL
  const urlParts = url.split('/');
  const profileId = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];

  try {
    // First, we need to get the access token
    const accessToken = localStorage.getItem('linkedin_access_token');
    
    if (!accessToken) {
      throw new Error('LinkedIn authentication required. Please login first.');
    }

    // Fetch basic profile information
    const profileResponse = await fetch(`${LINKEDIN_API_URL}/people/${profileId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LinkedIn profile');
    }

    const profileData = await profileResponse.json();

    // Fetch recent posts
    const postsResponse = await fetch(`${LINKEDIN_API_URL}/people/${profileId}/posts`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    const postsData = await postsResponse.json();

    // Analyze profile data to determine DISC profile (this would be a separate service in production)
    const discProfile = analyzeProfileForDisc(profileData);

    return {
      name: `${profileData.firstName} ${profileData.lastName}`,
      headline: profileData.headline || '',
      summary: profileData.summary || '',
      discProfile: discProfile,
      recentPosts: postsData.elements.map((post: any) => post.commentary) || []
    };
  } catch (error) {
    console.error('LinkedIn API Error:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch LinkedIn profile",
      variant: "destructive",
    });
    throw error;
  }
};

// Helper function to analyze profile and determine DISC profile
const analyzeProfileForDisc = (profileData: any) => {
  // This is a simplified example. In production, you would want to use
  // natural language processing and machine learning to accurately determine DISC profile
  const keywords = {
    D: ['leader', 'direct', 'decisive', 'driven'],
    I: ['influencer', 'inspiring', 'interactive', 'impressive'],
    S: ['steady', 'stable', 'supportive', 'sincere'],
    C: ['compliant', 'careful', 'conscientious', 'calculating']
  };

  // Simple keyword matching (this should be much more sophisticated in production)
  let scores = { D: 0, I: 0, S: 0, C: 0 };
  const text = `${profileData.summary} ${profileData.headline}`.toLowerCase();

  Object.entries(keywords).forEach(([type, words]) => {
    words.forEach(word => {
      if (text.includes(word.toLowerCase())) {
        scores[type as keyof typeof scores]++;
      }
    });
  });

  // Find dominant type
  const dominantType = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return {
    type: dominantType,
    characteristics: keywords[dominantType as keyof typeof keywords],
    talkingPoints: getTalkingPoints(dominantType)
  };
};

const getTalkingPoints = (discType: string): string[] => {
  const talkingPoints = {
    D: [
      "Focus on results and bottom line",
      "Be brief and to the point",
      "Stick to business, avoid small talk",
      "Present facts and challenges"
    ],
    I: [
      "Be friendly and show enthusiasm",
      "Allow time for social interaction",
      "Share stories and experiences",
      "Focus on big picture ideas"
    ],
    S: [
      "Be patient and consistent",
      "Show genuine interest in their needs",
      "Provide clear, step-by-step explanations",
      "Emphasize stability and security"
    ],
    C: [
      "Provide detailed information",
      "Be organized and logical",
      "Focus on quality and accuracy",
      "Give them time to analyze"
    ]
  };

  return talkingPoints[discType as keyof typeof talkingPoints] || [];
};