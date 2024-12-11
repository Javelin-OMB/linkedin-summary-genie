import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <Navbar />
      <main className="pt-32 px-4 sm:px-6 lg:px-8 pb-16 container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Get Instant Lead Insights
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Enter a LinkedIn profile URL to receive a comprehensive summary and personalized conversation starters
          </p>
          <div className="w-full max-w-3xl mx-auto pt-8">
            <SearchBar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;