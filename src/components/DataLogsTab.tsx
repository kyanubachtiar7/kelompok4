import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SensorLog {
  timestamp: string;
  suhu: number;
  kelembapan: number;
}

interface DataLogsTabProps {
  logs: SensorLog[];
}

const ROWS_PER_PAGE = 10;

const DataLogsTab = ({ logs }: DataLogsTabProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(logs.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentLogs = logs.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div>
      <div className="rounded-md border border-border min-h-[520px]">
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
            {currentLogs.length > 0 ? (
              currentLogs.map((log, index) => (
                <TableRow 
                  key={startIndex + index} 
                  className="opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
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
      <div className="flex items-center justify-end space-x-4 py-4">
        <span className="text-sm text-muted-foreground">
          Halaman {currentPage} dari {totalPages > 0 ? totalPages : 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="bg-transparent hover:bg-primary/20 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="bg-transparent hover:bg-primary/20 disabled:opacity-50"
        >
          Berikutnya
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default DataLogsTab;