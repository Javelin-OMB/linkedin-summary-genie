const analyzeProfileForDisc = (profileData: any) => {
  const keywords = {
    D: ['leader', 'direct', 'decisive', 'driven'],
    I: ['influencer', 'inspiring', 'interactive', 'impressive'],
    S: ['steady', 'stable', 'supportive', 'sincere'],
    C: ['compliant', 'careful', 'conscientious', 'calculating']
  };

  let scores = { D: 0, I: 0, S: 0, C: 0 };
  const text = `${profileData.summary} ${profileData.headline}`.toLowerCase();

  Object.entries(keywords).forEach(([type, words]) => {
    words.forEach(word => {
      if (text.includes(word.toLowerCase())) {
        scores[type as keyof typeof scores]++;
      }
    });
  });

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
      "Focus op resultaten en bottom line",
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

export { analyzeProfileForDisc };