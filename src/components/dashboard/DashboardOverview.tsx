import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserCredits } from '@/hooks/useUserCredits';
import UsageCard from './UsageCard';
import ProPlanCard from './ProPlanCard';

interface DashboardOverviewProps {
  credits?: number | null;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ credits: propCredits }) => {
  const { credits: hookCredits, isLoading } = useUserCredits();
  const credits = propCredits ?? hookCredits;
  const maxFreeSearches = 10;
  const [showNoCreditsDialog, setShowNoCreditsDialog] = React.useState(credits === 0);

  useEffect(() => {
    if (credits && credits > 0) {
      setShowNoCreditsDialog(false);
    } else if (credits === 0) {
      setShowNoCreditsDialog(true);
    }
  }, [credits]);

  const handleEmailClick = () => {
    window.location.href = 'mailto:tom.spoor@ombdigital.io';
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <UsageCard 
          credits={credits}
          isLoading={isLoading}
          maxFreeSearches={maxFreeSearches}
        />
        <ProPlanCard />
      </div>

      <AlertDialog open={showNoCreditsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Need More Leadsummaries?</AlertDialogTitle>
            <AlertDialogDescription>
              You've used all your free leadsummaries. Would you like to test more? Contact us to discuss your needs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleEmailClick}>
              Contact tom.spoor@ombdigital.io
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DashboardOverview;