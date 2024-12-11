import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 pt-20">
        <div className="w-full max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-[#1A1F2C] leading-tight tracking-tight">
              Get Instant Lead Insights
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
              Enter a LinkedIn profile URL to receive a comprehensive summary and personalized conversation starters
            </p>
          </div>
          <SearchBar />
        </div>
      </main>
    </div>
  );
};

export default Index;