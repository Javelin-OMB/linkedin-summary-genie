import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
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

interface ProfileSummaryProps {
  data: ProfileData;
}

const ProfileSummary = ({ data }: ProfileSummaryProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6 animate-fadeIn">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
        <p className="text-gray-600 mb-4">{data.headline}</p>
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Professional Summary</h3>
          <p className="text-gray-700">{data.summary}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">DISC Profile: Type {data.discProfile.type}</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Characteristics</h4>
            <div className="flex flex-wrap gap-2">
              {data.discProfile.characteristics.map((trait, index) => (
                <Badge key={index} variant="secondary">{trait}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Recommended Talking Points</h4>
            <ul className="list-disc pl-5 space-y-1">
              {data.discProfile.talkingPoints.map((point, index) => (
                <li key={index} className="text-gray-700">{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {data.recentPosts.map((post, index) => (
            <p key={index} className="text-gray-700 border-l-2 border-linkedin-primary pl-4">
              {post}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProfileSummary;