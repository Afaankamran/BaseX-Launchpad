import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function StatsBarChart({ data, color = 'primary', dataKey }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={data.length * 40 + 60}
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 15,
          left: 5,
          bottom: 5,
        }}
        barGap={30}
        barSize={30}
        maxBarSize={30}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        {/* <XAxis dataKey="name" />
        <YAxis /> */}
        <XAxis type="number" fontSize={12} />
        <YAxis type="category" width={70} fontSize={12} dataKey="id" />
        {/* <Tooltip /> */}
        {/* <Legend /> */}
        <defs>
          <linearGradient
            id={'colorUv' + color}
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0"
              stopColor={color == 'primary' ? '#FB403F' : '#1A4BFC'}
            />
            <stop
              offset="1"
              stopColor={color == 'primary' ? '#773A89' : '#6EAFFB'}
            />
          </linearGradient>
        </defs>
        <Bar dataKey={dataKey} fill={`url(#colorUv${color})`} />
      </BarChart>
    </ResponsiveContainer>
  );
}
