import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  alpha,
  Card,
} from '@mui/material';
import Images from '@/public/Assets/Images';
import Image from 'next/image';
import { styled, width } from '@mui/system';
import { OutlinedCardPrimaryDark } from '../OutlinedCard';
export default function Roadmap({ roadmap1, roadmap2, roadmap3, roadmap4 }) {
  const items = [...Array(4)];
  return (
    <>
      <div className=" mx-auto px-5 py-[150px] ">
        <div className="py-6 text-center">
          <Box className="flex justify-center items-center">
            <Typography
              variant="h4"
              className="  bg-gradient-to-br from-red-700 to-blue-600 bg-clip-text text-xl font-extrabold text-transparent "
            >
              The Roadmap
            </Typography>
          </Box>
          <Typography variant="h1" className="  text-white pt-2">
            Our Roadmap
          </Typography>
        </div>

        <div className="mt-20">
          <Grid container spacing={10}>
            <RoadMapItem isFirst={true} roadmap={roadmap1} />
            <RoadMapItem roadmap={roadmap2} />
            <RoadMapItem roadmap={roadmap3} />
            <RoadMapItem isLast={true} roadmap={roadmap4} />
          </Grid>
        </div>
      </div>
    </>
  );
}
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '15px',
  position: 'relative',
  flexShrink: 0,
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)'
      : alpha(theme.palette.primary.dark, 0.1),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.common.border} `,
}));
const StyledLineLeft = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'block',
  flex: 1,
  '&:before': {
    [theme.breakpoints.up('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
    content: '""',
    position: 'absolute',
    top: '50%',
    right: 0,
    background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
    height: '1px',
    zIndex: -1,
    width: ` calc( 100% + ${theme.spacing(5)})`,
  },
}));
const StyledLineRight = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'block',
  flex: 1,
  '&:before': {
    [theme.breakpoints.up('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
    content: '""',
    position: 'absolute',
    top: '50%',
    left: 0,
    background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
    height: '1px',
    width: ` calc( 100% + ${theme.spacing(5)})`,
    zIndex: -1,
  },
}));

const StyledIconContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'none',
  },
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
  },
  position: 'absolute',
  top: 0,
  left: `calc( 100% + ${theme.spacing(2)} )`,
  bottom: 0,
  width: '50px',
  zIndex: 1,
  display: 'flex',
  aligntItems: 'center',
  '&  img': {
    flexGrow: 0,
    objectFit: 'contain',
  },
}));
const RoadMapItem = ({ isFirst = false, isLast = false, roadmap }) => {
  const map = roadmap ? roadmap.split(/\n/) : [];
  return (
    <Grid item xs={12} lg={3}>
      <Box display="flex" justifyContent="center" position="relative">
        {!isFirst ? (
          <StyledLineLeft></StyledLineLeft>
        ) : (
          <Box sx={{ flex: 1 }}></Box>
        )}
        <StyledPaper>
          <Typography
            fontWeight="bold"
            variant="h2"
            color="text.primary"
            fontSize="24px"
          >
            {map?.[0]}
          </Typography>
        </StyledPaper>
        {!isLast ? (
          <>
            <StyledLineRight></StyledLineRight>
            <StyledIconContainer>
              <Image src={Images.rightarrow} />
            </StyledIconContainer>
          </>
        ) : (
          <Box sx={{ flex: 1 }}></Box>
        )}
      </Box>
      <Card variant="outlined" className="  my-4 ">
        {map.map((m, i) => {
          if (i !== 0 && m) {
            return (
              <div className="flex p-4">
                <div className="pt-1 flex-shrink-0">
                  <Image src={Images.tick} />
                </div>
                <Typography color="text.primary" className=" px-3 text-white ">
                  {m}
                </Typography>
              </div>
            );
          }
        })}
      </Card>
    </Grid>
  );
};
