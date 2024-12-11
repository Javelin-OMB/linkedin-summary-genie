import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
              LinkedIn Profile Analyzer
            </h1>
            <p className="text-lg text-gray-600">
              Enter a LinkedIn profile URL to get insights
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <SearchBar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;