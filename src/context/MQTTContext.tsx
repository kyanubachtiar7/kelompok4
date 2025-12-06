import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import mqtt from 'mqtt';

// Tipe untuk data riwayat
interface HistoryData<T> {
  timestamp: string;
  value: T;
}

// Tipe untuk log kejadian
interface EventLog {
  timestamp: string;
  event: string;
  value: string | number;
  status: string;
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
  eventHistory: EventLog[];
}

const MQTTContext = createContext<MQTTContextState | undefined>(undefined);

const MAX_HISTORY = 50;
const MQTT_BROKER_URL = 'wss://55ad080716e4440ca9ccdd6a9f124730.s1.eu.hivemq.cloud:8884/mqtt';
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

const addEventLog = (prevLogs: EventLog[], event: string, value: string | number, status: string): EventLog[] => {
  const newLog: EventLog = {
    timestamp: new Date().toLocaleTimeString(),
    event,
    value,
    status,
  };
  return [newLog, ...prevLogs].slice(0, MAX_HISTORY);
};

export const MQTTProvider = ({ children }: { children: ReactNode }) => {
  const [connectionStatus, setConnectionStatus] = useState('Menghubungkan...');
  const [suhu, setSuhu] = useState<number | undefined>();
  const [kelembapan, setKelembapan] = useState<number | undefined>();
  const [presenceStatus, setPresenceStatus] = useState<string | undefined>();
  const [ledStatus, setLedStatus] = useState<string | undefined>();
  const [buzzerStatus, setBuzzerStatus] = useState<string | undefined>();

  const [suhuHistory, setSuhuHistory] = useState<HistoryData<number>[]>([]);
  const [kelembapanHistory, setKelembapanHistory] = useState<HistoryData<number>[]>([]);
  const [eventHistory, setEventHistory] = useState<EventLog[]>([]);

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
      setEventHistory(prev => addEventLog(prev, "MQTT Connection", "Success", "Connected"));
      client.subscribe(SENSOR_TOPIC, { qos: 1 });
    });

    client.on('reconnect', () => setConnectionStatus('Menghubungkan...'));
    client.on('close', () => {
      setConnectionStatus('Terputus');
      setEventHistory(prev => addEventLog(prev, "MQTT Connection", "Failure", "Disconnected"));
    });
    client.on('error', (err) => {
      console.error('Koneksi MQTT Error:', err);
      setConnectionStatus('Error');
      client.end();
    });

    client.on('message', (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());

        if (topic === SENSOR_TOPIC) {
          if (typeof data.suhu === 'number') {
            setSuhu(data.suhu);
            setSuhuHistory(prev => updateHistory(prev, data.suhu));
            setEventHistory(prev => addEventLog(prev, "Temp. Update", `${data.suhu.toFixed(1)}°C`, data.suhu > 30 ? "High Temp" : "Normal"));
          }
          if (typeof data.kelembapan === 'number') {
            setKelembapan(data.kelembapan);
            setKelembapanHistory(prev => updateHistory(prev, data.kelembapan));
            setEventHistory(prev => addEventLog(prev, "Humidity Update", `${data.kelembapan.toFixed(0)}%`, "Update"));
          }
          if (data.presence === 1 || data.presence === 0) {
            const status = data.presence === 1 ? 'ADA ORANG' : 'TIDAK ADA ORANG';
            setPresenceStatus(status);
            setEventHistory(prev => addEventLog(prev, "Motion Sensor", status, data.presence === 1 ? "Active" : "Inactive"));
          }
          if (data.led === 1 || data.led === 0) {
            const status = data.led === 1 ? 'LED MENYALA' : 'LED MATI';
            setLedStatus(status);
            setEventHistory(prev => addEventLog(prev, "LED Status", status, data.led === 1 ? "ON" : "OFF"));
          }
          if (data.buzzer === 1 || data.buzzer === 0) {
            const status = data.buzzer === 1 ? 'BUZZER MENYALA' : 'BUZZER MATI';
            setBuzzerStatus(status);
            setEventHistory(prev => addEventLog(prev, "Buzzer Status", status, data.buzzer === 1 ? "Active" : "Inactive"));
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
    suhuHistory,
    kelembapanHistory,
    eventHistory,
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