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
    throw new Error("LinkedIn authentication required. Please connect your account first.");
  }

  try {
    // Log the auth code for debugging
    console.log("Using auth code:", authCode);
    
    // In a production environment, you would:
    // 1. Send this auth code to your backend
    // 2. Backend would exchange it for an access token
    // 3. Backend would make the actual API calls
    
    // For demo purposes, we'll return mock data
    return {
      name: "John Doe",
      headline: "Sales Professional at ABC Corp",
      summary: "Experienced sales professional with 10+ years in B2B sales.",
      discProfile: {
        type: "I",
        characteristics: [
          "Enthusiastic",
          "Persuasive",
          "Optimistic",
          "Social"
        ],
        talkingPoints: [
          "Focus on building rapport",
          "Share success stories",
          "Keep the conversation dynamic",
          "Use social proof"
        ]
      },
      recentPosts: [
        "Excited to announce our new product launch!",
        "Great meeting with clients today discussing innovation",
        "Sharing insights from the latest sales conference"
      ]
    };
  } catch (error) {
    console.error("LinkedIn API Error:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to fetch LinkedIn profile",
      variant: "destructive",
    });
    throw error;
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
