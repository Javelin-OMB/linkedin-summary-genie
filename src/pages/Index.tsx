import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-[40px] sm:text-[56px] font-bold text-[#1A1F2C] leading-tight">
            Get Instant Lead Insights
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Enter a LinkedIn profile URL to receive a comprehensive summary and personalized conversation starters
          </p>
          <SearchBar />
        </div>
      </main>
    </div>
  );
};

export default Index;