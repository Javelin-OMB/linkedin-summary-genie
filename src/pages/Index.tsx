import Navbar from "@/components/Navbar";
import LeadSummary from "@/components/LeadSummary";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <LeadSummary />
    </div>
  );
};

export default Index;