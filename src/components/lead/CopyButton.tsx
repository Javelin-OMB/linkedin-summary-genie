import React, { useState } from 'react';
import { Copy, CheckCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CopyButtonProps {
  onCopy: () => Promise<void>;
}

const CopyButton = ({ onCopy }: CopyButtonProps) => {
  const [copying, setCopying] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await onCopy();
      setCopying(true);
      toast({
        title: "Gekopieerd",
        description: "De volledige samenvatting is gekopieerd naar het klembord.",
      });
      setTimeout(() => {
        setCopying(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Fout bij kopiëren",
        description: "Er is een fout opgetreden bij het kopiëren naar het klembord.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleCopy}
      className="gap-2"
    >
      {copying ? (
        <>
          <CheckCheck className="h-5 w-5" />
          Gekopieerd
        </>
      ) : (
        <>
          <Copy className="h-5 w-5" />
          Kopieer volledige samenvatting
        </>
      )}
    </Button>
  );
};

export default CopyButton;