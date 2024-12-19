import { Badge } from "@/components/ui/badge";
import DashboardOverview from './DashboardOverview';
import DashboardAnalyses from './DashboardAnalyses';
import { useSession } from '@supabase/auth-helpers-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardContentProps {
  userData: {
    is_admin?: boolean;
    credits?: number;
  };
}

const DashboardContent = ({ userData }: DashboardContentProps) => {
  const session = useSession();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-[#0177B5]">Your Dashboard</h1>
        {userData?.is_admin && (
          <Badge variant="secondary" className="bg-[#0177B5] text-white">
            Administrator
          </Badge>
        )}
      </div>
      {session?.user?.email && (
        <div className="space-y-2">
          <p className="text-gray-600">
            Logged in as: {session.user.email}
          </p>
          <p className="text-gray-600 font-medium">
            Available credits: {userData?.credits ?? '...'}
          </p>
        </div>
      )}
      <DashboardOverview credits={userData?.credits} />
      {isMobile && <DashboardAnalyses />}
    </div>
  );
};

export default DashboardContent;