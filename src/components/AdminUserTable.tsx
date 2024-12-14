import { User, Plus, Minus, Check, X, Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

interface UserData {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
}

interface AdminUserTableProps {
  users: UserData[];
  onUpdateCredits: (userId: string, change: number) => Promise<void>;
  onToggleAdmin: (userId: string) => Promise<void>;
  onAddUser: (email: string, initialCredits: number) => Promise<void>;
}

const AdminUserTable = ({ 
  users, 
  onUpdateCredits, 
  onToggleAdmin,
  onAddUser 
}: AdminUserTableProps) => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [initialCredits, setInitialCredits] = useState("10");
  const { toast } = useToast();

  const handleAddUser = async () => {
    if (!newUserEmail.trim()) {
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
      setIsAddUserOpen(false);
      toast({
        title: "Gebruiker toegevoegd",
        description: "De nieuwe gebruiker is succesvol toegevoegd",
      });
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het toevoegen van de gebruiker",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gebruikers Beheer</h2>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
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
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gebruiker</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.email}
                </TableCell>
                <TableCell>
                  {user.is_admin ? (
                    <Badge variant="default" className="bg-linkedin-primary hover:bg-linkedin-primary">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Gebruiker</Badge>
                  )}
                </TableCell>
                <TableCell>{user.credits}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateCredits(user.id, 1)}
                      title="Credit toevoegen"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateCredits(user.id, -1)}
                      title="Credit verwijderen"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleAdmin(user.id)}
                      className={user.is_admin ? "border-red-500 hover:border-red-600" : "border-green-500 hover:border-green-600"}
                      title={user.is_admin ? "Admin rechten verwijderen" : "Admin rechten toekennen"}
                    >
                      {user.is_admin ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUserTable;