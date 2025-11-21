import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Lightbulb, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import mqtt, { MqttClient } from 'mqtt';
import SuhuChart from '@/components/SuhuChart';
import { showSuccess, showError } from '@/utils/toast';

interface SuhuData {
  name: string;
  suhu: number;
}

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [suhu, setSuhu] = useState('Menunggu data...');
  const [suhuHistory, setSuhuHistory] = useState<SuhuData[]>([]);
  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    const mqttClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
    setClient(mqttClient);

    mqttClient.on('connect', () => {
      console.log('Terhubung ke broker MQTT HiveMQ');
      mqttClient.subscribe('kel4/il/suhu', (err) => {
        if (err) {
          console.error('Gagal berlangganan topik suhu:', err);
        }
      });
    });

    mqttClient.on('message', (topic, payload) => {
      if (topic === 'kel4/il/suhu') {
        const suhuValue = payload.toString();
        setSuhu(suhuValue);

        const newSuhuData: SuhuData = {
          name: new Date().toLocaleTimeString(),
          suhu: parseFloat(suhuValue),
        };

        setSuhuHistory(prevHistory => {
          const updatedHistory = [...prevHistory, newSuhuData];
          if (updatedHistory.length > 20) {
            return updatedHistory.slice(updatedHistory.length - 20);
          }
          return updatedHistory;
        });
      }
    });

    mqttClient.on('error', (err) => {
      console.error('Koneksi MQTT Error:', err);
      mqttClient.end();
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePublish = (mode: 'manual' | 'auto') => {
    if (client) {
      const topic = 'kel4/il/manualuato';
      client.publish(topic, mode, (error) => {
        if (error) {
          showError('Gagal mengirim perintah.');
          console.error('Publish error:', error);
        } else {
          showSuccess(`Perintah mode '${mode}' berhasil dikirim.`);
        }
      });
    } else {
      showError('Koneksi MQTT belum siap.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dasbor IoT</h1>
          <Button onClick={handleLogout}>Keluar</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suhu Ruangan</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suhu}°C</div>
              <p className="text-xs text-muted-foreground">Data dari MQTT</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kelembaban Udara</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">65%</div>
              <p className="text-xs text-muted-foreground">Cukup lembab</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Lampu</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Menyala</div>
              <p className="text-xs text-muted-foreground">Lampu ruang tamu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kontrol Sistem</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => handlePublish('manual')}>Mode Manual</Button>
                <Button onClick={() => handlePublish('auto')} variant="secondary">Mode Otomatis</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Suhu Real-time</CardTitle>
            </CardHeader>
            <CardContent>
              <SuhuChart data={suhuHistory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;