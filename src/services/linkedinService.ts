// Simulatie van LinkedIn API calls
export const fetchLinkedInProfile = async (url: string) => {
  // In een echte implementatie zou dit de LinkedIn API aanroepen
  // Voor nu simuleren we een response
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simuleer netwerk vertraging

  if (!url.includes('linkedin.com')) {
    throw new Error('Invalid LinkedIn URL');
  }

  return {
    name: "John Doe",
    headline: "Sales Professional",
    summary: "Experienced sales professional with 10+ years in B2B sales.",
    discProfile: {
      type: "D",
      characteristics: [
        "Direct communicator",
        "Results-oriented",
        "Takes initiative"
      ],
      talkingPoints: [
        "Focus on bottom-line results",
        "Be brief and to the point",
        "Emphasize solutions over process"
      ]
    },
    recentPosts: [
      "Excited to announce our new product launch!",
      "Great meeting with industry leaders today",
    ]
  };
};