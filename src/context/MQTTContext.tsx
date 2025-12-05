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
  presence?: number;
  ledStatus?: string;
  suhuHistory: HistoryData<number>[];
  kelembapanHistory: HistoryData<number>[];
  presenceHistory: HistoryData<number>[];
  ledHistory: HistoryData<string>[];
}

const MQTTContext = createContext<MQTTContextState | undefined>(undefined);

const MAX_HISTORY = 20;
const MQTT_BROKER_URL = 'ws://localhost:9001'; // Diperbarui ke port WebSocket
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
  const [presence, setPresence] = useState<number | undefined>();
  const [ledStatus, setLedStatus] = useState<string | undefined>();

  const [suhuHistory, setSuhuHistory] = useState<HistoryData<number>[]>([]);
  const [kelembapanHistory, setKelembapanHistory] = useState<HistoryData<number>[]>([]);
  const [presenceHistory, setPresenceHistory] = useState<HistoryData<number>[]>([]);
  const [ledHistory, setLedHistory] = useState<HistoryData<string>[]>([]);

  useEffect(() => {
    // Opsi koneksi diperbarui
    const client = mqtt.connect(MQTT_BROKER_URL, {
      clean: true,
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      setConnectionStatus('Terhubung');
      client.subscribe(TOPICS, (err) => {
        if (err) {
          console.error('Gagal subscribe ke topik:', err);
        }
      });
    });

    client.on('reconnect', () => {
      setConnectionStatus('Menyambungkan ulang...');
    });

    client.on('close', () => {
      setConnectionStatus('Terputus');
    });
    
    client.on('error', (err) => {
      console.error('Koneksi MQTT Error:', err);
      setConnectionStatus('Error');
      client.end();
    });

    client.on('message', (topic, payload) => {
      try {
        const message = JSON.parse(payload.toString());
        // Menambahkan console.log untuk debugging
        console.log(`Pesan diterima dari topik [${topic}]:`, message);
        
        const value = message.value;

        switch (topic) {
          case 'kel4/il/suhu':
            setSuhu(value);
            setSuhuHistory(prev => updateHistory(prev, value));
            break;
          case 'kel4/il/kelembapan':
            setKelembapan(value);
            setKelembapanHistory(prev => updateHistory(prev, value));
            break;
          case 'kel4/il/presence':
            setPresence(value);
            setPresenceHistory(prev => updateHistory(prev, value));
            break;
          case 'kel4/il/led':
            setLedStatus(value);
            setLedHistory(prev => updateHistory(prev, value));
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Gagal mem-parsing payload JSON:', error);
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
    presence,
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