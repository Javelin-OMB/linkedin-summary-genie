import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-6 animate-fadeIn p-4">
      <Card className="p-8 bg-white shadow-lg">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h2>
          <p className="text-lg text-gray-600">{data.headline}</p>
        </div>

        <Separator className="my-6" />

        {/* Summary Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data.summary}</p>
        </div>

        {/* DISC Profile Section */}
        <Card className="p-6 bg-gray-50 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            DISC Profile: Type {data.discProfile.type}
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Key Characteristics</h4>
              <div className="flex flex-wrap gap-2">
                {data.discProfile.characteristics.map((trait, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Recommended Talking Points</h4>
              <ul className="space-y-2">
                {data.discProfile.talkingPoints.map((point, index) => (
                  <li 
                    key={index} 
                    className="flex items-start"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Recent Activity Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {data.recentPosts.map((post, index) => (
              <div 
                key={index} 
                className="p-4 bg-gray-50 rounded-lg border-l-4 border-linkedin-primary"
              >
                <p className="text-gray-700">{post}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSummary;