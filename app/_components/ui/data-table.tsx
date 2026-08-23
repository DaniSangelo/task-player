import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const DataTable = () => {
  return (
    <div className="border border-accent-600 rounded-md bg-accent-50/5 w-full">
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Tarefa</TableHead>
            <TableHead>Detalhes</TableHead>
            <TableHead>Tempo</TableHead>
            <TableHead>Finalizada?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>01</TableCell>
            <TableCell>LAST-200 - Criar tela de players no painel </TableCell>
            <TableCell> lorem ipsum </TableCell>
            <TableCell className="text-right">01:45:22</TableCell>
            <TableCell className="text-right">✅</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
