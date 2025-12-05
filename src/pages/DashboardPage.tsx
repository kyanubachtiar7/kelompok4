import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Users, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SuhuChart from '@/components/SuhuChart';
import KelembapanChart from '@/components/KelembapanChart';
import VideoStream from '@/components/VideoStream';
import { useMQTT } from '../context/MQTTContext';

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { 
    connectionStatus,
    suhu,
    kelembapan,
    presenceData,
    ledStatus,
    suhuHistory,
    kelembapanHistory 
  } = useMQTT();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mengonversi data riwayat agar sesuai dengan format yang diharapkan oleh komponen grafik
  const formattedSuhuHistory = suhuHistory.map(d => ({ name: d.timestamp, suhu: d.value })).reverse();
  const formattedKelembapanHistory = kelembapanHistory.map(d => ({ name: d.timestamp, kelembapan: d.value })).reverse();

  const getStatusColor = (status: string) => {
    if (status === 'Terhubung') return 'text-green-500';
    if (status === 'Terputus' || status === 'Error' || status === 'Menyambungkan ulang...') return 'text-red-500';
    return 'text-yellow-500';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-xl md:text-3xl font-bold text-center md:text-left mb-4 md:mb-0">
            KIPAS ANGIN OTOMATIS DENGAN MONITORING SUHU RUANGAN
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">MQTT:</span>
              <span className={`font-bold ${getStatusColor(connectionStatus)}`}>
                {connectionStatus}
              </span>
            </div>
            <Button onClick={handleLogout}>Keluar</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suhu Ruangan</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suhu !== undefined ? `${suhu}°C` : 'Menunggu...'}</div>
              <p className="text-xs text-muted-foreground">Data real-time dari sensor</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kelembaban Udara</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kelembapan !== undefined ? `${kelembapan}%` : 'Menunggu...'}</div>
              <p className="text-xs text-muted-foreground">Data real-time dari sensor</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran Orang</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{presenceData?.status || 'Menunggu...'}</div>
              <p className="text-xs text-muted-foreground">
                {presenceData?.count !== undefined ? `Jumlah orang: ${presenceData.count}` : 'Berdasarkan deteksi sensor'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status LED</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ledStatus || 'Menunggu...'}</div>
              <p className="text-xs text-muted-foreground">Status perangkat output</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle>Grafik Suhu</CardTitle></CardHeader>
            <CardContent><SuhuChart data={formattedSuhuHistory} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Grafik Kelembapan</CardTitle></CardHeader>
            <CardContent><KelembapanChart data={formattedKelembapanHistory} /></CardContent>
          </Card>
        </div>

        <VideoStream />
      </div>
    </div>
  );
};

export default DashboardPage;