import About from '@/components/Home/About';
import Faqs from '@/components/Home/Faqs';
import FinancialModal from '@/components/Home/FinancialModal';
import Hero from '@/components/Home/Hero';
import Product from '@/components/Home/Product';
import Roadmap from '@/components/Home/Roadmap';
import Tokennomics from '@/components/Home/Tokenomics';
import LearnAndEarn from '@/components/LearnAndEarn';
import { useIsDarkMode } from '@/state/user/hooks';
import { Box } from '@mui/material';
import Head from 'next/head';






export default function Home() {
  const isDarkMode = useIsDarkMode();

  return (
    <>
      <Head>
        <title>Home</title>
        <meta
          name="description"
          content="Launchpad and DeFi hub of the Base Network"
        />
        <meta property="og:url" content="https://BaseX.fi" />
        <meta property="og: title" content="BaseX" />
        <meta
          property="og:description"
          content="Launchpad and DeFi hub of the Base Network"
        />
      </Head>
      <div className="w-full">
        <Hero />
        <About />
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            // width: '100%',
            // height: '100%',
            zIndex: '2',
          }}
        >
          <Box
            sx={{
              background: isDarkMode
                ? 'radial-gradient(50% 50% at 50% 50%, #070e30 0%, rgba(7, 14, 48, 0) 100%)'
                : 'transparent',
              backgroundBlendMode: 'screen',
              backgroundPosition: '0rem -20rem',
              backgroundRepeat: 'no-repeat',
              opacity: 0.5,
              position: 'absolute',
              height: '100%',
              width: '100%',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: '-1',
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: '-1',
              backgroundBlendMode: 'screen',
              opacity: 0.5,
              backgroundImage: isDarkMode
                ? 'radial-gradient(50% 50% at 50% 50%, #1B0C1D 0%, rgba(11, 4, 13, 0) 100%)'
                : 'transparent',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0rem 15rem',
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              width: '1289px',
              height: '1289px',
              // left: 0,
              right: '-24%',
              top: '55%',
              bottom: 0,
              zIndex: '-1',

              backgroundBlendMode: 'screen',
              opacity: 0.4,
              // borderRadius: '100%',
              backgroundImage: isDarkMode
                ? 'radial-gradient(50% 50% at 50% 50%, #070E30 0%, rgba(7, 14, 48, 0) 100%)'
                : ' transparent',
              backgroundRepeat: 'no-repeat',
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              width: '1483px',
              height: '1483px',
              left: '-15%',
              right: '0',
              top: '60%',
              bottom: '0',
              zIndex: '-1',
              backgroundBlendMode: 'screen',
              opacity: 0.4,
              // borderRadius: '100%',
              backgroundImage: isDarkMode
                ? 'radial-gradient(50% 50% at 50% 50%, #070E30 0%, rgba(7, 14, 48, 0) 100%)'
                : ' transparent',
              backgroundRepeat: 'no-repeat',
            }}
          ></Box>
          <Product />
          <Roadmap />
          <Box mt={12}></Box>
          <Tokennomics />
        </Box>

        {/* <ClaimReward/> */}

        <FinancialModal />
        {/* <Team /> */}
        <LearnAndEarn />
        {/* <Partners /> */}
        <Faqs />
        {/* <Contact /> */}
        {/* <div className="clr" style={{ height: '150px' }} /> */}


      </div>
    </>
  );
}
