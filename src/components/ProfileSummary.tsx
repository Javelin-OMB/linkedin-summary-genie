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
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-8 animate-fadeIn p-6">
      <Card className="p-8 bg-white shadow-xl rounded-xl">
        {/* Header Section with Gradient Background */}
        <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">{data.name}</h2>
          <p className="text-xl text-gray-600 font-medium">{data.headline}</p>
        </div>

        <Separator className="my-8" />

        {/* Summary Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-8 bg-linkedin-primary rounded-full mr-3"></span>
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg pl-5">
            {data.summary}
          </p>
        </div>

        {/* DISC Profile Section */}
        <Card className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 mb-10 rounded-xl shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
            DISC Profile: Type {data.discProfile.type}
          </h3>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Key Characteristics</h4>
              <div className="flex flex-wrap gap-3">
                {data.discProfile.characteristics.map((trait, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-white text-blue-800 hover:bg-blue-100 transition-colors duration-200 text-sm py-1 px-3 shadow-sm"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Recommended Talking Points</h4>
              <ul className="space-y-3">
                {data.discProfile.talkingPoints.map((point, index) => (
                  <li 
                    key={index} 
                    className="flex items-start bg-white p-4 rounded-lg shadow-sm"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-linkedin-primary mt-2 mr-3"></span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Recent Activity Section */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {data.recentPosts.map((post, index) => (
              <div 
                key={index} 
                className="p-6 bg-white rounded-xl shadow-sm border-l-4 border-linkedin-primary hover:shadow-md transition-shadow duration-200"
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