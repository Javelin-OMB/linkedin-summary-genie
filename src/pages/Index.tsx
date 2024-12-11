import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-[40px] sm:text-[56px] font-bold text-[#1A1F2C] mb-6 leading-tight">
            Get Instant Lead Insights
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Enter a LinkedIn profile URL to receive a comprehensive summary and personalized conversation starters
          </p>
          <SearchBar />
        </div>
      </main>
    </div>
  );
};

export default Index;