import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.1} />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(10, 5, 25, 0.7)',
            borderColor: 'hsl(var(--border))',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#e2e8f0' }}
          itemStyle={{ color: '#8b5cf6' }}
        />
        <Area 
          type="monotone" 
          dataKey="kelembapan" 
          stroke="#8b5cf6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorKelembapan)" 
          name="Kelembapan (%)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default KelembapanChart;