import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mqtt, { MqttClient } from 'mqtt';
import SuhuChart from '@/components/SuhuChart';
import KelembapanChart from '@/components/KelembapanChart';
import VideoStream from '@/components/VideoStream';

interface SensorData {
  name: string;
  suhu: number;
}

interface KelembapanData {
  name: string;
  kelembapan: number;
}

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [suhu, setSuhu] = useState('Menunggu...');
  const [kelembapan, setKelembapan] = useState('Menunggu...');
  const [jumlahOrang, setJumlahOrang] = useState('Menunggu...');
  const [suhuHistory, setSuhuHistory] = useState<SensorData[]>([]);
  const [kelembapanHistory, setKelembapanHistory] = useState<KelembapanData[]>([]);
  
  useEffect(() => {
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    client.on('connect', () => {
      console.log('Terhubung ke broker MQTT HiveMQ');
      client.subscribe('kel4/il/suhu', (err) => {
        if (err) console.error('Gagal berlangganan topik suhu:', err);
      });
      client.subscribe('kel4/il/kelembapan', (err) => {
        if (err) console.error('Gagal berlangganan topik kelembapan:', err);
      });
      client.subscribe('kel4/il/deteksi', (err) => {
        if (err) console.error('Gagal berlangganan topik deteksi:', err);
      });
    });

    client.on('message', (topic, payload) => {
      const message = payload.toString();
      const time = new Date().toLocaleTimeString();

      if (topic === 'kel4/il/suhu') {
        setSuhu(message);
        setSuhuHistory(prev => [...prev.slice(-19), { name: time, suhu: parseFloat(message) }]);
      } else if (topic === 'kel4/il/kelembapan') {
        setKelembapan(message);
        setKelembapanHistory(prev => [...prev.slice(-19), { name: time, kelembapan: parseFloat(message) }]);
      } else if (topic === 'kel4/il/deteksi') {
        setJumlahOrang(message);
      }
    });

    client.on('error', (err) => {
      console.error('Koneksi MQTT Error:', err);
      client.end();
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-center md:text-left mb-4 md:mb-0">
            KIPAS ANGIN OTOMATIS DENGAN MONITORING SUHU RUANGAN
          </h1>
          <Button onClick={handleLogout}>Keluar</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suhu Ruangan</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suhu}°C</div>
              <p className="text-xs text-muted-foreground">Data real-time dari sensor</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kelembaban Udara</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kelembapan}%</div>
              <p className="text-xs text-muted-foreground">Data real-time dari sensor</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jumlah Orang Terdeteksi</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jumlahOrang}</div>
              <p className="text-xs text-muted-foreground">Berdasarkan deteksi pose</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader><CardTitle>Grafik Suhu</CardTitle></CardHeader>
            <CardContent><SuhuChart data={suhuHistory} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Grafik Kelembapan</CardTitle></CardHeader>
            <CardContent><KelembapanChart data={kelembapanHistory} /></CardContent>
          </Card>
        </div>

        <VideoStream />
      </div>
    </div>
  );
};

export default DashboardPage;