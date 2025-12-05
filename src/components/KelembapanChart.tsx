import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        <Line type="monotone" dataKey="kelembapan" stroke="#82ca9d" activeDot={{ r: 8 }} name="Kelembapan (%)" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default KelembapanChart;