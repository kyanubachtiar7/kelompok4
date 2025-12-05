import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Users, Lightbulb, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SuhuChart from '@/components/SuhuChart';
import KelembapanChart from '@/components/KelembapanChart';
import CameraStream from '@/components/CameraStream';
import { useMQTT } from '../context/MQTTContext';
import { Progress } from '@/components/ui/progress';

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { 
    connectionStatus,
    suhu,
    kelembapan,
    presenceStatus,
    ledStatus,
    buzzerStatus,
    suhuHistory,
    kelembapanHistory 
  } = useMQTT();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedSuhuHistory = suhuHistory.map(d => ({ name: d.timestamp, suhu: d.value })).reverse();
  const formattedKelembapanHistory = kelembapanHistory.map(d => ({ name: d.timestamp, kelembapan: d.value })).reverse();

  const getStatusColor = (status: string) => {
    if (status === 'Terhubung') return 'text-green-400';
    if (status === 'Terputus' || status === 'Error') return 'text-red-400';
    return 'text-yellow-400';
  };

  const cardClasses = "bg-card/80 backdrop-blur-sm border border-primary/20";

  // Menghitung nilai progres untuk gauge (0-100)
  const suhuProgress = suhu !== undefined ? (suhu / 50) * 100 : 0; // Asumsi suhu maks 50°C
  const kelembapanProgress = kelembapan !== undefined ? kelembapan : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-center md:text-left mb-4 md:mb-0 text-primary">
            KIPAS ANGIN OTOMATIS DENGAN MONITORING SUHU RUANGAN
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">MQTT:</span>
              <span className={`font-bold ${getStatusColor(connectionStatus)}`}>
                {connectionStatus}
              </span>
            </div>
            <Button onClick={handleLogout} variant="outline">Keluar</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suhu Ruangan</CardTitle>
              <Thermometer className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suhu !== undefined ? `${suhu.toFixed(1)}°C` : 'Menunggu...'}</div>
              <Progress value={suhuProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kelembaban Udara</CardTitle>
              <Droplets className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kelembapan !== undefined ? `${kelembapan.toFixed(1)}%` : 'Menunggu...'}</div>
              <Progress value={kelembapanProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kehadiran (Sensor)</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{presenceStatus || 'Menunggu...'}</div>
              <p className="text-xs text-muted-foreground">
                Berdasarkan sensor PIR
              </p>
            </CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status LED</CardTitle>
              <Lightbulb className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ledStatus || 'Menunggu...'}</div>
              <p className="text-xs text-muted-foreground">Status perangkat output</p>
            </CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Buzzer</CardTitle>
              <Bell className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{buzzerStatus || 'Menunggu...'}</div>
              <p className="text-xs text-muted-foreground">Status perangkat output</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className={cardClasses}>
            <CardHeader><CardTitle>Grafik Suhu</CardTitle></CardHeader>
            <CardContent><SuhuChart data={formattedSuhuHistory} /></CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader><CardTitle>Grafik Kelembapan</CardTitle></CardHeader>
            <CardContent><KelembapanChart data={formattedKelembapanHistory} /></CardContent>
          </Card>
        </div>

        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle>Deteksi Kehadiran via Kamera</CardTitle>
          </CardHeader>
          <CardContent>
            <CameraStream />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;