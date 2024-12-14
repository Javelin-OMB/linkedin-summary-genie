import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AddUserDialogProps {
  onAddUser: (email: string, initialCredits: number) => Promise<void>;
}

const AddUserDialog = ({ onAddUser }: AddUserDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [initialCredits, setInitialCredits] = useState("10");
  const { toast } = useToast();

  const handleAddUser = async () => {
    if (!newUserEmail) {
      toast({
        title: "Fout",
        description: "Vul een e-mailadres in",
        variant: "destructive",
      });
      return;
    }

    try {
      await onAddUser(newUserEmail, parseInt(initialCredits));
      setNewUserEmail("");
      setInitialCredits("10");
      setIsOpen(false);
      toast({
        title: "Succes",
        description: `Nieuwe gebruiker ${newUserEmail} toegevoegd`,
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Fout",
        description: "Kon gebruiker niet toevoegen",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0177B5] hover:bg-[#0177B5]/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Nieuwe Gebruiker
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nieuwe Gebruiker Toevoegen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <Input
              type="email"
              placeholder="gebruiker@email.com"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Credits</label>
            <Input
              type="number"
              value={initialCredits}
              onChange={(e) => setInitialCredits(e.target.value)}
              min="0"
            />
          </div>
          <Button 
            className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90"
            onClick={handleAddUser}
          >
            Gebruiker Toevoegen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;