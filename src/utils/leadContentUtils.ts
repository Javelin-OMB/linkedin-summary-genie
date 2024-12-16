export const parseProfileData = (profileData: string) => {
  const sections = {
    samenvatting: [] as string[],
    profielinformatie: [] as string[],
    bedrijfsinformatie: [] as string[],
    linkedinActiviteit: [] as string[],
    websiteSamenvatting: [] as string[],
    vergadertips: [] as string[],
    spinVragen: [] as string[]
  };

  const lines = profileData.split('\n');
  let currentSection = 'samenvatting';

  lines.forEach((line: string) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    if (trimmedLine.toLowerCase().includes('profielinformatie')) {
      currentSection = 'profielinformatie';
    } else if (trimmedLine.toLowerCase().includes('bedrijfsinformatie')) {
      currentSection = 'bedrijfsinformatie';
    } else if (trimmedLine.toLowerCase().includes('linkedin-activiteit')) {
      currentSection = 'linkedinActiviteit';
    } else if (trimmedLine.toLowerCase().includes('website samenvatting')) {
      currentSection = 'websiteSamenvatting';
    } else if (trimmedLine.toLowerCase().includes('vergadertips')) {
      currentSection = 'vergadertips';
    } else if (trimmedLine.toLowerCase().includes('spin-selling vragen')) {
      currentSection = 'spinVragen';
    } else {
      sections[currentSection].push(trimmedLine);
    }
  });

  return sections;
};

export const sectionTitles = {
  samenvatting: "Samenvatting voor leadgeneratie",
  profielinformatie: "Profielinformatie",
  bedrijfsinformatie: "Bedrijfsinformatie",
  linkedinActiviteit: "LinkedIn-activiteit",
  websiteSamenvatting: "Website Samenvatting",
  vergadertips: "Vergadertips",
  spinVragen: "SPIN-selling vragen"
};