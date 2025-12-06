import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface HumidityGaugeProps {
  value: number;
}

const HumidityGauge = ({ value }: HumidityGaugeProps) => {
  const data = [{ name: 'Humidity', value: value }];

  return (
    <ResponsiveContainer width="100%" height={120}>
      <RadialBarChart
        innerRadius="70%"
        outerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
        barSize={12}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          dataKey="value"
          angleAxisId={0}
          fill="hsl(var(--primary))"
          cornerRadius={6}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-primary text-4xl font-bold"
        >
          {`${value.toFixed(0)}%`}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default HumidityGauge;