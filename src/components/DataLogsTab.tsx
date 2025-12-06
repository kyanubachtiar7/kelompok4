import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <ScrollArea className="h-[400px] rounded-md border border-border">
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
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No data logs available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default DataLogsTab;