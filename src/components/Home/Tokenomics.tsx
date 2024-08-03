import { useIsDarkMode } from '@/state/user/hooks';
import { Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import {
  OutlinedCard,
  OutlinedCardTransparent,
} from '../OutlinedCard';

const StyledProgressBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%,  ${theme.palette.primary.main} 100%)`,
    zIndex: -1,
    borderRadius: theme.shape.borderRadius,
    opacity: 0.1,
  },
}));

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const PercentageCircle = styled(Box)(({ theme, color }) => ({
  backgroundColor: color,
  color: theme.palette.common.white,
  borderRadius: '50%',
  width: 50,
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  fontWeight: 'bold',
}));

const calculateCoordinatesForPercent = (percent) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};

const generatePieChartPath = (data) => {
  let cumulativePercent = 0;

  return data.map((slice, index) => {
    const [startX, startY] = calculateCoordinatesForPercent(cumulativePercent);
    cumulativePercent += slice.percent;
    const [endX, endY] = calculateCoordinatesForPercent(cumulativePercent);

    const largeArcFlag = slice.percent > 0.5 ? 1 : 0;

    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L 0 0`,
    ].join(' ');

    return (
      <path key={index} d={pathData} fill={colors[index % colors.length]} />
    );
  });
};

export default function Tokenomics() {
  const isDarkMode = useIsDarkMode();

  const tokenData = [
    { title: 'Farming Rewards', amount: 30 },
    { title: 'Staking Rewards', amount: 30 },
    { title: 'Development Fund', amount: 30 },
    { title: 'Token Sale', amount: 30 },
    { title: 'Founders Fund', amount: 30 },
    { title: 'DEX Liquidity', amount: 30 },
    { title: 'Advisors', amount: 30 },
    { title: 'Short Term Venture Tokens', amount: 30 },
    { title: 'Long Term Venture Tokens', amount: 30 },
    { title: 'Community Rewards', amount: 30 },
  ];

  const vastingData = [
    { title: 'Team', percent: 0.10, description: 'These tokens belong to the team for further development' },
    { title: 'Public Sale', percent: 0.35, description: 'These tokens are sold through different sales marketing' },
    { title: 'Rewards / Bounces', percent: 0.30, description: 'These are tokens to be given away to the community' },
    { title: 'LP / Partnerships', percent: 0.20, description: 'These token will be used for CEX liquidities and partners' },
    { title: 'Private Sale', percent: 0.05, description: 'These are tokens to be sold privately' },
  ];

  const pieChartPaths = generatePieChartPath(vastingData);

  return (
    <Box className="calWidth">
      <Container maxWidth="lg">
        <div className="mt-[200px] mx-7">
          <div className="text-left space-y-2">
            <Box className="flex justify-start items-center w-full">
              <Typography variant="h4" fontSize="50px" fontWeight="bold">Tokenomics</Typography>
            </Box>
          </div>
          <Grid container className="py-8">
            <Grid item xs={12} sm={12} md={4} lg={4} className="pt-4 space-y-1">
              <OutlinedCard>
                <Typography variant="h5" className="py-6 text-center">Token Distribution</Typography>
                <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
                  {pieChartPaths}
                </svg>
              </OutlinedCard>
            </Grid>
            <Grid item xs={12} md={8}>
              <OutlinedCard className="mx-0 sm:mx-0 lg:mx-4 my-4 px-6 py-6 rounded-lg flex flex-col justify-start">
                <div>
                  {vastingData.map((item, index) => (
                    <OutlinedCardTransparent key={index} className="my-4 grid grid-cols-1 lg:grid-cols-4 place-content-center space-y-5 lg:space-y-0">
                      <Box className="min-h-[69px] flex justify-center lg:justify-start pl-5 items-center rounded-t-xl p-2 lg:rounded-xl" sx={{ background: 'transparent' }}>
                        <PercentageCircle color={colors[index % colors.length]}>
                          {Math.round(item.percent * 100)}%
                        </PercentageCircle>
                      </Box>
                      <div className="w-full mx-2 flex flex-col items-center lg:items-start text-center xl:text-left lg:col-span-2 py-2 lg:py-3 px-2">
                        <Typography variant="body2" className="font-bold" sx={{ color: 'primary.main', mb: 2 }}>{item.title}</Typography>
                        <Typography variant="body2">{item.description}</Typography>
                      </div>
                    </OutlinedCardTransparent>
                  ))}
                </div>
              </OutlinedCard>
            </Grid>
          </Grid>
        </div>
      </Container>
    </Box>
  );
}
