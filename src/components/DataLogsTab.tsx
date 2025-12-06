import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SensorLog {
  timestamp: string;
  suhu: number;
  kelembapan: number;
}

interface DataLogsTabProps {
  logs: SensorLog[];
}

const DataLogsTab = ({ logs }: DataLogsTabProps) => {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">No</TableHead>
            <TableHead className="w-[150px]">Jam</TableHead>
            <TableHead>Data Suhu (°C)</TableHead>
            <TableHead className="text-right">Data Kelembapan (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <TableRow key={index} className="bg-transparent even:bg-white/5">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.suhu.toFixed(1)}</TableCell>
                <TableCell className="text-right">{log.kelembapan.toFixed(0)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                Menunggu data dari sensor...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataLogsTab;