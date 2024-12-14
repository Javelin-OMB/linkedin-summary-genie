import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Loader2 className="h-8 w-8 animate-spin text-linkedin-primary mb-2" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;