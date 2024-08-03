import React, { PureComponent, useMemo } from 'react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart } from 'recharts';
import useSWR from 'swr';
import { data } from './data';
import useDataFetching from './useFetchChartData';
import moment from 'moment';
import { useTheme } from '@emotion/react';
import { Box, Card, Typography } from '@mui/material';
import { calculateMinTickGap, formatDate } from './utils';

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];





const url = 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=24438&range=ALL'
const color = 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)'
function AreaCharts({ range }) {


  const { data: result } = useDataFetching(`/api/chartData?range=${range}`);


  const chart = result && result?.data ? result.data.points : data;

  const chartData: { key: string, Price: number }[] = useMemo(() => {
    const result = Object.entries(chart)?.map(([key, value]) => {
      const pv = value?.v?.[1]
      const pc = value?.c?.[0]
      return {
        key: moment.unix(Number(key)).format(formatDate(range)),
        Volume: pv, // Use the first element of "c" instead of "pv"
        Price: value?.c?.[0] // Use the second element of "c" instead of "amt"
      }
    });

    return result;
  }, [chart, range])






  return (

    <>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={1000}
          height={300}
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}

        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={'#FF3E3D'} stopOpacity={1} />
              <stop offset="100%" stopColor={'#466DFD'} stopOpacity={1} />
            </linearGradient>
            <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF3E3D" />
              <stop offset="100%" stopColor="#466DFD" />
            </linearGradient>
            <linearGradient id="myGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 62, 61, 0.4)" />
              <stop offset="100%" stopColor="rgba(132, 43, 61, 0)" />
            </linearGradient>
          </defs>

          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey={'key'} minTickGap={calculateMinTickGap(range)} padding={{ right: 10 }} tickMargin={5} />
          <YAxis padding={{ top: 100 }} />

          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="Price" strokeWidth="0.28%" stroke="url(#colorUv)" fill="url(#myGradient2)" />
          {/* <Area type="monotone" dataKey="Price" strokeWidth="0.28%" stroke="url(#colorUv)" fill="url(#myGradient)"/> */}
          {/* <rect width="100%" height="100%" fill=" url(#myGradient2)" /> */}
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
export default AreaCharts;


const CustomTooltip = (props) => {
  console.log({ props })

  const { payload, label } = props;
  const theme = useTheme();

  if (payload && label) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 2rem',
          margin: '20px 0px ',
          width: '100%',
          maxWidth: "300px"
        }}
      >
        <Box
          sx={{
            borderRadius: '15px',
            position: 'relative',
            '&::before': {
              borderRadius: '15px',
              content: "''",
              position: 'absolute',
              top: '-1px',
              left: '-1px',
              bottom: '-1px',
              right: '-1px',
              background:
                'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
              zIndex: -1,
            },
            background: theme?.palette.background.default
          }}
        >
          <Card>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'start',
                padding: '1rem',
                height: '100%',
                flexDirection: "column"
              }}
            >
              <Typography variant="body1" className=" whitespace-nowrap">
                {payload ? `${payload[0]?.dataKey ? payload[0]?.dataKey : "Price"} : ${payload[0]?.payload.Price.toFixed(4)}` : '-'}
              </Typography>
              <Typography variant="body1" className=" whitespace-nowrap">
                {payload ? `Volume: $${payload[0]?.payload.Volume}` : '-'}

              </Typography>
              <Typography variant="body1" className=" whitespace-nowrap">
                Date: {label}
              </Typography>
            </Box>
          </Card>
        </Box>


      </Box>
    );
  }
  return null

};