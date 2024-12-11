import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="pt-32 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#0FA0CE] to-blue-600">
            Get Instant Lead Insights
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Enter a LinkedIn profile URL to receive a comprehensive summary and personalized conversation starters
          </p>
          <SearchBar />
        </div>
      </main>
    </div>
  );
};

export default Index;