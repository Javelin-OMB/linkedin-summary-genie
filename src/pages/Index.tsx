import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-6xl font-bold text-[#221F26] mb-8 leading-tight">
            Get Instant Lead Insights
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Enter a LinkedIn profile URL to receive a comprehensive summary and personalized conversation starters
          </p>
          <SearchBar />
        </div>
      </main>
    </div>
  );
};

export default Index;