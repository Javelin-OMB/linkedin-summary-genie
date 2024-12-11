import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">
            LinkedIn Profile Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Enter a LinkedIn profile URL to get insights
          </p>
          <SearchBar />
        </div>
      </main>
    </div>
  );
};

export default Index;