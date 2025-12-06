import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Trash2 } from "lucide-react";
import * as XLSX from 'xlsx';

interface SensorLog {
  timestamp: string;
  suhu: number;
  kelembapan: number;
}

interface DataLogsTabProps {
  logs: SensorLog[];
  resetLogs: () => void;
}

const ROWS_PER_PAGE = 10;

const DataLogsTab = ({ logs, resetLogs }: DataLogsTabProps) => {
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

  const handleDownload = () => {
    // Menyiapkan header untuk file Excel
    const headers = ["No", "Jam", "Data Suhu (°C)", "Data Kelembapan (%)"];
    
    // Memformat data log agar sesuai dengan header
    const data = logs.map((log, index) => ({
      No: index + 1,
      Jam: log.timestamp,
      'Data Suhu (°C)': log.suhu.toFixed(1),
      'Data Kelembapan (%)': log.kelembapan.toFixed(0)
    }));

    // Membuat worksheet dari data JSON
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Membuat workbook baru
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sensor");

    // Menambahkan header secara manual untuk memastikan urutan dan teks yang benar
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    // Mengatur lebar kolom agar tabel terlihat rapi
    worksheet["!cols"] = [
      { wch: 5 },   // Kolom "No"
      { wch: 15 },  // Kolom "Jam"
      { wch: 20 },  // Kolom "Data Suhu (°C)"
      { wch: 25 }   // Kolom "Data Kelembapan (%)"
    ];

    // Menghasilkan file Excel dan memicu unduhan
    XLSX.writeFile(workbook, "sensor_data_log.xlsx");
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
                  Tidak ada data log.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetLogs}
            className="bg-destructive/20 hover:bg-destructive/40 text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={logs.length === 0}
            className="bg-primary/20 hover:bg-primary/40 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        <div className="flex items-center justify-end space-x-4">
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
    </div>
  );
};

export default DataLogsTab;