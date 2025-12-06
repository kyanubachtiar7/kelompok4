import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SuhuData {
  name: string;
  suhu: number;
}

interface SuhuChartProps {
  data: SuhuData[];
}

const SuhuChart = ({ data }: SuhuChartProps) => {
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
          <linearGradient id="colorSuhu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
          <filter id="shadowSuhu" height="200%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#8884d8" floodOpacity="0.3" />
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°C`} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background) / 0.8)',
            borderColor: 'hsl(var(--border))',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          itemStyle={{ color: '#8884d8' }}
        />
        <Legend wrapperStyle={{ fontSize: '14px' }} />
        <Area 
          type="monotone" 
          dataKey="suhu" 
          stroke="#8884d8" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorSuhu)" 
          name="Suhu (°C)"
          filter="url(#shadowSuhu)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SuhuChart;