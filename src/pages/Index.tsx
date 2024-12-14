import Navbar from "@/components/Navbar";
import LeadSummary from "@/components/LeadSummary";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <SearchBar />
        <LeadSummary />
      </div>
    </div>
  );
};

export default Index;