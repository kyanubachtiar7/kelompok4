import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KelembapanData {
  name: string;
  kelembapan: number;
}

interface KelembapanChartProps {
  data: KelembapanData[];
}

const KelembapanChart = ({ data }: KelembapanChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorKelembapan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
          <filter id="shadowKelembapan" height="200%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#82ca9d" floodOpacity="0.3" />
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background) / 0.8)',
            borderColor: 'hsl(var(--border))',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          itemStyle={{ color: '#82ca9d' }}
        />
        <Legend wrapperStyle={{ fontSize: '14px' }} />
        <Area 
          type="monotone" 
          dataKey="kelembapan" 
          stroke="#82ca9d" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorKelembapan)" 
          name="Kelembapan (%)"
          filter="url(#shadowKelembapan)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default KelembapanChart;