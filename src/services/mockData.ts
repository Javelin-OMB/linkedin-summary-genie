import { LinkedInProfile } from './linkedinTypes';

export const mockProfileData: LinkedInProfile = {
  name: "John van der Tech",
  headline: "Senior Software Engineer | AI Specialist | Tech Lead",
  summary: "Ervaren software engineer met 10+ jaar ervaring in het bouwen van schaalbare applicaties. Gespecialiseerd in AI/ML implementaties en team leadership.",
  discProfile: {
    type: "D",
    characteristics: [
      "Resultaatgericht",
      "Direct communicerend",
      "Besluitvaardig",
      "Ambitieus"
    ],
    talkingPoints: [
      "Focus op concrete resultaten en ROI",
      "Directe aanpak van uitdagingen",
      "Innovatieve technische oplossingen",
      "Strategische planning en uitvoering"
    ]
  },
  recentPosts: [
    "Net een succesvol AI-implementatieproject afgerond voor een grote klant. 30% efficiëntieverbetering behaald!",
    "Deelde mijn inzichten over microservices architectuur op het Tech Summit 2024",
    "Blij om aan te kondigen dat ons team is uitgebreid met drie nieuwe developers"
  ]
};