import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Users, Lightbulb, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SuhuChart from '@/components/SuhuChart';
import KelembapanChart from '@/components/KelembapanChart';
import VideoStream from '@/components/VideoStream';
import { useMQTT } from '../context/MQTTContext';
import { cn } from '@/lib/utils';
import HumidityGauge from '@/components/HumidityGauge';

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

  const cardClasses = "bg-card backdrop-blur-sm border border-primary/30 rounded-2xl shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all hover:border-primary/60 hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] animate-glow";

  return (
    <div className="min-h-screen text-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-slate-100 tracking-wider">
              SmartFan Control
            </h1>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm">
              <span className="relative flex h-3 w-3">
                <span className={cn(
                  "animate-pulse-green absolute inline-flex h-full w-full rounded-full opacity-75",
                  connectionStatus === 'Terhubung' ? 'bg-green-400' : 'bg-red-400'
                )}></span>
                <span className={cn(
                  "relative inline-flex rounded-full h-3 w-3",
                  connectionStatus === 'Terhubung' ? 'bg-green-500' : 'bg-red-500'
                )}></span>
              </span>
              <span className={getStatusColor(connectionStatus)}>
                MQTT: {connectionStatus}
              </span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-primary/50 bg-primary/20 text-primary-foreground hover:bg-primary/30">
              Keluar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Temperature</CardTitle>
              <Thermometer className="h-5 w-5 text-primary/80" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {suhu !== undefined ? `${suhu.toFixed(1)}°C` : '...'}
              </div>
            </CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Humidity</CardTitle>
              <Droplets className="h-5 w-5 text-primary/80" />
            </CardHeader>
            <CardContent className="pt-2">
              <HumidityGauge value={kelembapan !== undefined ? kelembapan : 0} />
            </CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Presence (PIR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Users className={cn(
                  "h-8 w-8 transition-all",
                  presenceStatus === 'ADA ORANG' ? 'text-cyan-400 drop-shadow-[0_0_5px_#22d3ee]' : 'text-gray-500'
                )} />
                <div className={cn(
                  "text-2xl font-bold",
                  presenceStatus === 'ADA ORANG' ? 'text-cyan-400' : 'text-gray-500'
                )}>
                  {presenceStatus === 'ADA ORANG' ? 'Active' : 'Inactive'}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Motion Sensor Status</p>
            </CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">LED Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Lightbulb className={cn(
                  "h-8 w-8 transition-all",
                  ledStatus === 'LED MENYALA' ? 'text-pink-400 drop-shadow-[0_0_8px_#f472b6]' : 'text-gray-500'
                )} />
                <div className={cn(
                  "text-2xl font-bold",
                  ledStatus === 'LED MENYALA' ? 'text-pink-400' : 'text-gray-500'
                )}>
                  {ledStatus === 'LED MENYALA' ? 'ON' : 'OFF'}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Buzzer Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Bell className={cn(
                  "h-8 w-8 transition-all",
                  buzzerStatus === 'BUZZER MENYALA' ? 'text-red-500 drop-shadow-[0_0_8px_#ef4444] animate-pulse' : 'text-gray-500'
                )} />
                <div className={cn(
                  "text-2xl font-bold",
                  buzzerStatus === 'BUZZER MENYALA' ? 'text-red-500' : 'text-gray-500'
                )}>
                  {buzzerStatus === 'BUZZER MENYALA' ? 'ON' : 'OFF'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className={cardClasses}>
            <CardHeader><CardTitle className="text-slate-200">Temperature History</CardTitle></CardHeader>
            <CardContent><SuhuChart data={formattedSuhuHistory} /></CardContent>
          </Card>
          <Card className={cardClasses}>
            <CardHeader><CardTitle className="text-slate-200">Humidity History</CardTitle></CardHeader>
            <CardContent><KelembapanChart data={formattedKelembapanHistory} /></CardContent>
          </Card>
        </div>

        <Card className={cn(cardClasses, "overflow-hidden")}>
          <CardHeader>
            <CardTitle className="text-slate-200">Live Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoStream />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;