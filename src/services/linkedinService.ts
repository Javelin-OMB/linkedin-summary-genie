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
  const authCode = localStorage.getItem("linkedin_auth_code");
  
  if (!authCode) {
    throw new Error("LinkedIn authenticatie vereist. Verbind eerst je account.");
  }

  try {
    // Extract profile ID from URL
    const urlParts = url.split('/');
    const profileId = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];

    console.log("Attempting to fetch profile with ID:", profileId);
    console.log("Using auth code:", authCode);

    // Make API call to LinkedIn
    const response = await fetch(`${LINKEDIN_API_URL}/people/${profileId}`, {
      headers: {
        'Authorization': `Bearer ${authCode}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("LinkedIn API Response Status:", response.status);
      console.error("LinkedIn API Response Status Text:", response.statusText);
      const errorText = await response.text();
      console.error("LinkedIn API Error Response:", errorText);
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    const profileData = await response.json();
    console.log("LinkedIn API response:", profileData);

    // Extract relevant data from API response
    const profile = {
      name: `${profileData.firstName} ${profileData.lastName}`,
      headline: profileData.headline || '',
      summary: profileData.summary || '',
      discProfile: analyzeProfileForDisc(profileData),
      recentPosts: await fetchRecentPosts(profileId, authCode)
    };

    return profile;
  } catch (error) {
    console.error("LinkedIn API Error:", error);
    throw error;
  }
};

const fetchRecentPosts = async (profileId: string, authCode: string): Promise<string[]> => {
  try {
    const response = await fetch(`${LINKEDIN_API_URL}/people/${profileId}/posts`, {
      headers: {
        'Authorization': `Bearer ${authCode}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Error fetching posts:", response.statusText);
      return [];
    }

    const postsData = await response.json();
    return postsData.elements
      .slice(0, 3)
      .map((post: any) => post.commentary || post.text || '')
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

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