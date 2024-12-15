import Navigation from "@/components/Navigation";
import LeadSummary from "@/components/LeadSummary";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import LoginDialog from "@/components/LoginDialog";

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onLoginClick={() => setIsLoginOpen(true)} />
      <LoginDialog 
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        mode="login"
      />
      <div className="container mx-auto px-4 pt-24">
        <LeadSummary />
        <div className="mt-2">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Index;