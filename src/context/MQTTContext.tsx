import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import mqtt from 'mqtt';

// Tipe untuk data riwayat sensor
interface SensorHistory {
  timestamp: string;
  suhu: number;
  kelembapan: number;
}

// Tipe untuk state yang disediakan oleh context
interface MQTTContextState {
  connectionStatus: string;
  suhu?: number;
  kelembapan?: number;
  presenceStatus?: string;
  ledStatus?: string;
  buzzerStatus?: string;
  sensorHistory: SensorHistory[];
}

const MQTTContext = createContext<MQTTContextState | undefined>(undefined);

const MAX_HISTORY = 50;
const UPDATE_INTERVAL = 5000; // 5 detik dalam milidetik
const MQTT_BROKER_URL = 'wss://55ad080716e4440ca9ccdd6a9f124730.s1.eu.hivemq.cloud:8884/mqtt';
const SENSOR_TOPIC = 'kel4/il/dyad/state';

export const MQTTProvider = ({ children }: { children: ReactNode }) => {
  const [connectionStatus, setConnectionStatus] = useState('Menghubungkan...');
  const [suhu, setSuhu] = useState<number | undefined>();
  const [kelembapan, setKelembapan] = useState<number | undefined>();
  const [presenceStatus, setPresenceStatus] = useState<string | undefined>();
  const [ledStatus, setLedStatus] = useState<string | undefined>();
  const [buzzerStatus, setBuzzerStatus] = useState<string | undefined>();
  const [sensorHistory, setSensorHistory] = useState<SensorHistory[]>([]);
  const lastUpdateTime = useRef(0);

  useEffect(() => {
    const clientId = `web_dashboard_${Date.now()}_${Math.random().toString(16).substring(2, 8)}`;
    const MQTT_OPTIONS: mqtt.IClientOptions = {
      clientId,
      username: 'kelompok4',
      password: 'Kelompok4',
      clean: true,
      keepalive: 60,
      reconnectPeriod: 5000,
    };

    const client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);

    client.on('connect', () => {
      setConnectionStatus('Terhubung');
      client.subscribe(SENSOR_TOPIC, { qos: 1 });
    });

    client.on('reconnect', () => setConnectionStatus('Menghubungkan...'));
    client.on('close', () => setConnectionStatus('Terputus'));
    client.on('error', (err) => {
      console.error('Koneksi MQTT Error:', err);
      setConnectionStatus('Error');
      client.end();
    });

    client.on('message', (topic, payload) => {
      const now = Date.now();
      if (now - lastUpdateTime.current < UPDATE_INTERVAL) {
        return; // Abaikan pesan jika belum 5 detik
      }
      lastUpdateTime.current = now;

      try {
        const data = JSON.parse(payload.toString());

        if (topic === SENSOR_TOPIC) {
          // Update state individual
          if (typeof data.suhu === 'number') setSuhu(data.suhu);
          if (typeof data.kelembapan === 'number') setKelembapan(data.kelembapan);
          if (data.presence === 1 || data.presence === 0) {
            setPresenceStatus(data.presence === 1 ? 'ADA ORANG' : 'TIDAK ADA ORANG');
          }
          if (data.led === 1 || data.led === 0) {
            setLedStatus(data.led === 1 ? 'LED MENYALA' : 'LED MATI');
          }
          if (data.buzzer === 1 || data.buzzer === 0) {
            setBuzzerStatus(data.buzzer === 1 ? 'BUZZER MENYALA' : 'BUZZER MATI');
          }

          // Tambahkan ke riwayat log jika ada data suhu dan kelembapan
          if (typeof data.suhu === 'number' && typeof data.kelembapan === 'number') {
            const newLogEntry: SensorHistory = {
              timestamp: new Date().toLocaleTimeString(),
              suhu: data.suhu,
              kelembapan: data.kelembapan,
            };
            setSensorHistory(prev => [newLogEntry, ...prev].slice(0, MAX_HISTORY));
          }
        }
      } catch (error) {
        console.error('Gagal parse JSON dari MQTT:', error);
      }
    });

    return () => {
      if (client) client.end();
    };
  }, []);

  const value = {
    connectionStatus,
    suhu,
    kelembapan,
    presenceStatus,
    ledStatus,
    buzzerStatus,
    sensorHistory,
  };

  return <MQTTContext.Provider value={value}>{children}</MQTTContext.Provider>;
};

export const useMQTT = () => {
  const context = useContext(MQTTContext);
  if (context === undefined) {
    throw new Error('useMQTT harus digunakan di dalam MQTTProvider');
  }
  return context;
};