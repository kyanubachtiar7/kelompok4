import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
            <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.1} />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°C`} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(10, 5, 25, 0.7)',
            borderColor: 'hsl(var(--border))',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.5rem',
            color: '#e2e8f0'
          }}
          labelStyle={{ color: '#e2e8f0' }}
          itemStyle={{ color: '#f472b6' }}
        />
        <Area 
          type="monotone" 
          dataKey="suhu" 
          stroke="#f472b6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorSuhu)" 
          name="Suhu (°C)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SuhuChart;