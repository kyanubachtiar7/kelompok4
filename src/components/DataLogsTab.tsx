import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface EventLog {
  timestamp: string;
  event: string;
  value: string | number;
  status: string;
}

interface DataLogsTabProps {
  logs: EventLog[];
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  if (status.toLowerCase().includes("high") || status.toLowerCase().includes("active")) return "destructive";
  if (status.toLowerCase().includes("update")) return "secondary";
  return "default";
};

const DataLogsTab = ({ logs }: DataLogsTabProps) => {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Timestamp</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <TableRow key={index} className="bg-transparent even:bg-white/5">
                <TableCell className="font-medium">{log.timestamp}</TableCell>
                <TableCell>{log.event}</TableCell>
                <TableCell>{log.value}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={getStatusVariant(log.status)}>{log.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No data logs available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataLogsTab;