import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import mqtt from 'mqtt';

// Tipe untuk data riwayat
interface HistoryData<T> {
  timestamp: string;
  value: T;
}

// Tipe untuk state yang disediakan oleh context
interface MQTTContextState {
  connectionStatus: string;
  suhu?: number;
  kelembapan?: number;
  presenceStatus?: string;
  ledStatus?: string;
  buzzerStatus?: string;
  suhuHistory: HistoryData<number>[];
  kelembapanHistory: HistoryData<number>[];
  presenceHistory: HistoryData<string>[];
  ledHistory: HistoryData<string>[];
  buzzerHistory: HistoryData<string>[];
}

const MQTTContext = createContext<MQTTContextState | undefined>(undefined);

const MAX_HISTORY = 50;
// Konfigurasi broker MQTT publik HiveMQ
const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const MQTT_OPTIONS = {
  clientId: 'dyad-dashboard-kel4-presence', // Client ID sedikit diubah untuk menghindari konflik
  clean: true,
  reconnectPeriod: 1000,
};
const SENSOR_TOPIC = 'kel4/il/dyad/state';

// Helper function untuk memperbarui riwayat
const updateHistory = <T,>(prevHistory: HistoryData<T>[], newValue: T): HistoryData<T>[] => {
  const newEntry = {
    timestamp: new Date().toLocaleTimeString(),
    value: newValue,
  };
  const updatedHistory = [newEntry, ...prevHistory];
  return updatedHistory.slice(0, MAX_HISTORY);
};

export const MQTTProvider = ({ children }: { children: ReactNode }) => {
  const [connectionStatus, setConnectionStatus] = useState('Menghubungkan...');
  // State dari topik sensor
  const [suhu, setSuhu] = useState<number | undefined>();
  const [kelembapan, setKelembapan] = useState<number | undefined>();
  const [presenceStatus, setPresenceStatus] = useState<string | undefined>();
  const [ledStatus, setLedStatus] = useState<string | undefined>();
  const [buzzerStatus, setBuzzerStatus] = useState<string | undefined>();

  // State riwayat
  const [suhuHistory, setSuhuHistory] = useState<HistoryData<number>[]>([]);
  const [kelembapanHistory, setKelembapanHistory] = useState<HistoryData<number>[]>([]);
  const [presenceHistory, setPresenceHistory] = useState<HistoryData<string>[]>([]);
  const [ledHistory, setLedHistory] = useState<HistoryData<string>[]>([]);
  const [buzzerHistory, setBuzzerHistory] = useState<HistoryData<string>[]>([]);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);

    client.on('connect', () => {
      setConnectionStatus('Terhubung');
      client.subscribe(SENSOR_TOPIC, (err) => {
        if (err) {
          console.error('Gagal subscribe ke topik:', err);
        } else {
          console.log('Berhasil subscribe ke topik:', SENSOR_TOPIC);
        }
      });
    });

    client.on('reconnect', () => setConnectionStatus('Menghubungkan...'));
    client.on('close', () => setConnectionStatus('Terputus'));
    client.on('error', (err) => {
      console.error('Koneksi MQTT Error:', err);
      setConnectionStatus('Error');
      client.end();
    });

    client.on('message', (topic, payload) => {
      const payloadString = payload.toString();
      console.log('MQTT message received:', topic, payloadString);
      try {
        const data = JSON.parse(payloadString);

        if (topic === SENSOR_TOPIC) {
          if (typeof data.suhu === 'number') {
            setSuhu(data.suhu);
            setSuhuHistory(prev => updateHistory(prev, data.suhu));
          }
          if (typeof data.kelembapan === 'number') {
            setKelembapan(data.kelembapan);
            setKelembapanHistory(prev => updateHistory(prev, data.kelembapan));
          }
          if (data.presence === 1 || data.presence === 0) {
            const status = data.presence === 1 ? 'ADA ORANG' : 'TIDAK ADA ORANG';
            setPresenceStatus(status);
            setPresenceHistory(prev => updateHistory(prev, status));
          }
          if (data.led === 1 || data.led === 0) {
            const status = data.led === 1 ? 'LED MENYALA' : 'LED MATI';
            setLedStatus(status);
            setLedHistory(prev => updateHistory(prev, status));
          }
          if (data.buzzer === 1 || data.buzzer === 0) {
            const status = data.buzzer === 1 ? 'BUZZER MENYALA' : 'BUZZER MATI';
            setBuzzerStatus(status);
            setBuzzerHistory(prev => updateHistory(prev, status));
          }
        }
      } catch (error) {
        console.error('Gagal parse JSON dari MQTT:', error);
      }
    });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  const value = {
    connectionStatus,
    suhu,
    kelembapan,
    presenceStatus,
    ledStatus,
    buzzerStatus,
    suhuHistory,
    kelembapanHistory,
    presenceHistory,
    ledHistory,
    buzzerHistory,
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