import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UserTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead>Gebruiker</TableHead>
      <TableHead>Rol</TableHead>
      <TableHead>Credits</TableHead>
      <TableHead>Acties</TableHead>
    </TableRow>
  </TableHeader>
);

export default UserTableHeader;