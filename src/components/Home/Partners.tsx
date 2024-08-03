import { Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import Images from '@/public/Assets/Images';
import { OutlinedCardTransparent } from '../OutlinedCard';
import { useIsDarkMode } from '@/state/user/hooks';
export default function Partners() {
  const isDarkMode = useIsDarkMode();
  const imageData = [
    {
      img: Images.p1,
    },
    {
      img: Images.p2,
    },
    {
      img: Images.p3,
    },
    {
      img: Images.p4,
    },
    {
      img: Images.p5,
    },
    {
      img: Images.p6,
    },
    {
      img: Images.p7,
    },
    {
      img: Images.p8,
    },
  ];
  return (
    <Box
      sx={{
        backgroundColor: isDarkMode ? '#070309' : 'transparent',
      }}
    >
      <div className="max-w-[1530px] mx-auto px-4  ">
        <div className="text-center text-xs text-white space-y-2 py-[106px] ">
          <Box className="flex justify-center items-center ">
            <Typography variant="h4">Partnerships</Typography>
          </Box>
          <Box>
            <Typography variant="h1" color="text.primary">
              Meet our Partner
            </Typography>
          </Box>
        </div>

        <div className=" ">
          <Grid container className="mt-[6rem] " spacing={2}>
            {imageData.map((item, id) => {
              return (
                <Grid item xs={12} sm={6} md={3} key={id}>
                  <OutlinedCardTransparent
                    sx={{ borderRadius: 0.5 }}
                    className="w-full h-full flex items-center py-10 px-5  justify-center  text-center  my-4 lg:my-0  "
                  >
                    <Box sx={{ filter: isDarkMode ? '' : 'invert(100%)' }}>
                      <Image src={item.img} />
                    </Box>
                  </OutlinedCardTransparent>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
    </Box>
  );
}
