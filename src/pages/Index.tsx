import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Instant Lead Insights
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Enter a LinkedIn profile URL to receive a comprehensive summary and personalized conversation starters
          </p>
          <SearchBar />
          <div className="mt-4 text-sm text-gray-500">
            10 free searches remaining
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;