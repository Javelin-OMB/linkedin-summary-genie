import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight animate-fade-in">
              LinkedIn Profile Analyzer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in delay-100">
              Get instant insights from any LinkedIn profile
            </p>
          </div>
          <div className="animate-fade-in delay-200">
            <SearchBar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;