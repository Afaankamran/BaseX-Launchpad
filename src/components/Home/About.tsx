import Images from '@/public/Assets/Images';
import { Box, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useIsDarkMode } from '@/state/user/hooks';

const PopUp = dynamic(() => import('./Popup'), {
  ssr: false,
});

export default function About() {
  const isDarkMode = useIsDarkMode();
  return (
    <Box
      sx={{
        background: isDarkMode ? '#070309' : 'transparent',
      }}
    >
      <Box
        sx={{
          background: isDarkMode
            ? 'radial-gradient(40.55% 50% at 50% 50%, rgb(24, 10, 23 , 0.6 ) 0%, rgba(18, 5, 21, 0) 100%)'
            : 'transparent',
          backgroundBlendMode: 'screen',
        }}
      >
        <Container maxWidth="lg">
          <section className=" body-font py-[10vh] ">
            <div className="  flex justify-between py-24  flex-col items-center space-y-10">
              <div className=" max-w-6xl  lg:flex-grow  md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center ">
                <div className="flex justify-center items-center w-full">

                  <span className="flex justify-center items-center w-fit">
                    <h1 className="title-font md:whitespace-nowrap text-center w-full sm:text-5xl text-3xl mb-4  text-transparent lg:leading-tight p-4   bg-clip-text bg-gradient-to-r font-semibold from-[#fd0000de] to-[#466DFD]">
                      Introducing BASEX
                    </h1>
                  </span>
                </div>

                <Typography
                  color="text.secondary"
                  className="mb-8 leading-relaxed text-center"
                  fontSize='20px'
                >
                  BaseX Introduces its own Decentralized Exchange platform which aims to host projects launching exclusively on the Base Network.
                  <br />
                  <br />
                  BaseX aims to create a viable ecosystem by featuring its own Decentralized Exchange to allow for trading and Liquidity farming. Additionally, BaseX will use it’s Venture Arm to invest in developers building several protocols which will generate returns for its Users.
                </Typography>
              </div>

            </div>
          </section>
        </Container>
      </Box>
    </Box>
  );
}
