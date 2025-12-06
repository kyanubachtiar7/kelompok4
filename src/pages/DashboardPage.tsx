import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Lightbulb, Bell, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VideoStream from '@/components/VideoStream';
import { useMQTT } from '../context/MQTTContext';
import { cn } from '@/lib/utils';
import HumidityGauge from '@/components/HumidityGauge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataLogsTab from '@/components/DataLogsTab';
import HardwareTab from '@/components/HardwareTab';
import SuhuChart from '@/components/SuhuChart';
import KelembapanChart from '@/components/KelembapanChart';

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
    sensorHistory,
    resetSensorHistory
  } = useMQTT();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    if (status === 'Terhubung') return 'text-green-400';
    if (status === 'Terputus' || status === 'Error') return 'text-red-400';
    return 'text-yellow-400';
  };

  const cardClasses = "bg-card/80 backdrop-blur-sm border border-primary/20 transition-all duration-300 ease-in-out hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10";

  const formattedSuhuHistory = sensorHistory.map(d => ({ name: d.timestamp, suhu: d.suhu })).reverse();
  const formattedKelembapanHistory = sensorHistory.map(d => ({ name: d.timestamp, kelembapan: d.kelembapan })).reverse();

  return (
    <div className="min-h-screen text-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-100 tracking-wider">
            SmartFan Control
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className={cn("h-2 w-2 rounded-full", connectionStatus === 'Terhubung' ? 'bg-green-500 animate-pulse' : 'bg-red-500')}></span>
              <span className={getStatusColor(connectionStatus)}>
                MQTT: {connectionStatus}
              </span>
            </div>
            <UserIcon className="h-6 w-6 text-slate-400" />
            <Button onClick={handleLogout} variant="outline" className="border-primary/50 bg-transparent text-slate-100 hover:bg-primary/20">
              Logout
            </Button>
          </div>
        </header>
        
        {/* Hero Section: Video Feed */}
        <Card className={cn(cardClasses, "mb-8 relative overflow-hidden opacity-0 animate-fade-in")} style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-slate-200">Tampilan Awal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <VideoStream />
              <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                LIVE POSE TRACKING
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs defaultValue="monitor" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 mb-6">
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
            <TabsTrigger value="data-logs">Data Logs</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
          </TabsList>

          {/* Tab 1: Monitor Content */}
          <TabsContent value="monitor">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
              <Card className={cn(cardClasses, "opacity-0 animate-fade-in")} style={{ animationDelay: '200ms' }}>
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
              <Card className={cn(cardClasses, "opacity-0 animate-fade-in")} style={{ animationDelay: '300ms' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Humidity</CardTitle>
                  <Droplets className="h-5 w-5 text-primary/80" />
                </CardHeader>
                <CardContent className="pt-2">
                  <HumidityGauge value={kelembapan !== undefined ? kelembapan : 0} />
                </CardContent>
              </Card>
              <Card className={cn(cardClasses, "opacity-0 animate-fade-in")} style={{ animationDelay: '400ms' }}>
                <CardHeader><CardTitle className="text-sm font-medium text-slate-300">Presence (PIR)</CardTitle></CardHeader>
                <CardContent>
                  <div className={cn("text-xl font-bold", presenceStatus === 'ADA ORANG' ? 'text-green-400' : 'text-gray-500')}>
                    {presenceStatus === 'ADA ORANG' ? 'Active' : 'Inactive'}
                  </div>
                </CardContent>
              </Card>
              <Card className={cn(cardClasses, "opacity-0 animate-fade-in")} style={{ animationDelay: '500ms' }}>
                <CardHeader><CardTitle className="text-sm font-medium text-slate-300">LED Status</CardTitle></CardHeader>
                <CardContent>
                  <div className={cn("text-xl font-bold", ledStatus === 'LED MENYALA' ? 'text-yellow-300' : 'text-gray-500')}>
                    {ledStatus === 'LED MENYALA' ? 'ON' : 'OFF'}
                  </div>
                </CardContent>
              </Card>
              <Card className={cn(cardClasses, "opacity-0 animate-fade-in")} style={{ animationDelay: '600ms' }}>
                <CardHeader><CardTitle className="text-sm font-medium text-slate-300">Buzzer Status</CardTitle></CardHeader>
                <CardContent>
                  <div className={cn("text-xl font-bold", buzzerStatus === 'BUZZER MENYALA' ? 'text-red-500' : 'text-gray-500')}>
                    {buzzerStatus === 'BUZZER MENYALA' ? 'ON' : 'OFF'}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={cn(cardClasses, "opacity-0 animate-fade-in")} style={{ animationDelay: '700ms' }}><CardHeader><CardTitle>Real-time Suhu</CardTitle></CardHeader><CardContent><SuhuChart data={formattedSuhuHistory} /></CardContent></Card>
              <Card className={cn(cardClasses, "opacity-0 animate-fade-in")} style={{ animationDelay: '800ms' }}><CardHeader><CardTitle>Real-time Kelembapan</CardTitle></CardHeader><CardContent><KelembapanChart data={formattedKelembapanHistory} /></CardContent></Card>
            </div>
          </TabsContent>

          {/* Tab 2: Data Logs Content */}
          <TabsContent value="data-logs">
            <Card className={cn(cardClasses, "opacity-0 animate-fade-in")}>
              <CardHeader><CardTitle>Sensor Data Log</CardTitle></CardHeader>
              <CardContent>
                <DataLogsTab logs={sensorHistory} resetLogs={resetSensorHistory} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Hardware Content */}
          <TabsContent value="hardware">
            <HardwareTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;