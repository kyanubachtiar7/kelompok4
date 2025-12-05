import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import mqtt from 'mqtt';

// Tipe untuk data riwayat
interface HistoryData<T> {
  timestamp: string;
  value: T;
}

// Tipe untuk data kehadiran dari JSON
interface PresenceData {
  presence: number;
  count: number;
  status: string;
}

// Tipe untuk state yang disediakan oleh context
interface MQTTContextState {
  connectionStatus: string;
  suhu?: number;
  kelembapan?: number;
  presenceData?: PresenceData;
  ledStatus?: string;
  suhuHistory: HistoryData<number>[];
  kelembapanHistory: HistoryData<number>[];
  presenceHistory: HistoryData<PresenceData>[];
  ledHistory: HistoryData<string>[];
}

const MQTTContext = createContext<MQTTContextState | undefined>(undefined);

const MAX_HISTORY = 50;
const MQTT_BROKER_URL = 'ws://localhost:9001';
const TOPICS = ['kel4/il/suhu', 'kel4/il/kelembapan', 'kel4/il/presence', 'kel4/il/led'];

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
  const [suhu, setSuhu] = useState<number | undefined>();
  const [kelembapan, setKelembapan] = useState<number | undefined>();
  const [presenceData, setPresenceData] = useState<PresenceData | undefined>();
  const [ledStatus, setLedStatus] = useState<string | undefined>();

  const [suhuHistory, setSuhuHistory] = useState<HistoryData<number>[]>([]);
  const [kelembapanHistory, setKelembapanHistory] = useState<HistoryData<number>[]>([]);
  const [presenceHistory, setPresenceHistory] = useState<HistoryData<PresenceData>[]>([]);
  const [ledHistory, setLedHistory] = useState<HistoryData<string>[]>([]);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_URL, {
      clean: true,
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      setConnectionStatus('Terhubung');
      client.subscribe(TOPICS, (err) => {
        if (err) {
          console.error('Gagal subscribe ke topik:', err);
        } else {
          console.log('Berhasil subscribe ke topik:', TOPICS);
        }
      });
    });

    client.on('reconnect', () => setConnectionStatus('Menyambungkan ulang...'));
    client.on('close', () => setConnectionStatus('Terputus'));
    client.on('error', (err) => {
      console.error('Koneksi MQTT Error:', err);
      setConnectionStatus('Error');
      client.end();
    });

    client.on('message', (topic, payload) => {
      const payloadString = payload.toString();
      console.log('MQTT message received:', topic, payloadString);

      switch (topic) {
        case 'kel4/il/suhu': {
          const value = parseFloat(payloadString);
          if (!isNaN(value)) {
            setSuhu(value);
            setSuhuHistory(prev => updateHistory(prev, value));
          }
          break;
        }
        case 'kel4/il/kelembapan': {
          const value = parseFloat(payloadString);
          if (!isNaN(value)) {
            setKelembapan(value);
            setKelembapanHistory(prev => updateHistory(prev, value));
          }
          break;
        }
        case 'kel4/il/presence': {
          try {
            const data: PresenceData = JSON.parse(payloadString);
            setPresenceData(data);
            setPresenceHistory(prev => updateHistory(prev, data));
          } catch (e) {
            console.error('Gagal mem-parsing payload JSON untuk presence:', e);
          }
          break;
        }
        case 'kel4/il/led': {
          const value = payloadString.toLowerCase();
          const status = (value === '1' || value === 'on') ? 'ON' : 'OFF';
          setLedStatus(status);
          setLedHistory(prev => updateHistory(prev, status));
          break;
        }
        default:
          break;
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
    presenceData,
    ledStatus,
    suhuHistory,
    kelembapanHistory,
    presenceHistory,
    ledHistory,
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