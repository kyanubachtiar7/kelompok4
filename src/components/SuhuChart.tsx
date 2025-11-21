import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="suhu" stroke="#8884d8" activeDot={{ r: 8 }} name="Suhu (°C)" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SuhuChart;