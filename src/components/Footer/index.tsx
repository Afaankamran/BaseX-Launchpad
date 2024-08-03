import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack,
  Card,
  TextField,
} from '@mui/material';

import {
  FaDiscord,
  FaGithub,
  FaTelegramPlane,
  FaTwitter,
  FaRedditAlien
} from 'react-icons/fa';
import { SiGitbook } from 'react-icons/si';
import { AiFillMediumSquare } from 'react-icons/ai';
import Link from 'next/link';
import { useIsDarkMode } from '@/state/user/hooks';
import { SocialOutlinedCard } from '../OutlinedCard';
import { Formik } from 'formik';
import { newsletterValidator } from '@/functions/validators/newsletter';
import { Error } from '../FormikError';
import { BASE_URI } from '@/constants';
import useNewsletterSubscriber from '@/hooks/useNewsletterSubscriber';
import Image from 'next/image';
import styled from 'styled-components';

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`;

export default function Footer() {
  const isDarkMode = useIsDarkMode();
  const footerInput = [
    'px-1 py-1 border-2 rounded-[12px] border-[#4767fb1a] bg-[#090c1c] flex items-center cursor-pointer ',
  ];
  const iconsStyle = ['p-2  flex items-center cursor-pointer '];


  function handleSubmit() {
    console.log("sumbit")
  }
  return (
    <>
      <div className="w-full ">
        <Box className="px-5 lg:px-10 py-12">
          <Container maxWidth="lg">
            <Grid container spacing={5}>
              <Grid item sm={12} lg={4} className="">
                <Box className=" ">

                  <Box sx={{ display: 'flex' }} className="space-x-1 ">
                    <a href="/" target="_blank">
                      <SocialOutlinedCard className={`${iconsStyle}  `}>
                        <FaTwitter size={25} />
                      </SocialOutlinedCard>
                    </a>
                    <a href="/" target="_blank">
                      <SocialOutlinedCard className={`${iconsStyle}  `}>
                        <FaTelegramPlane size={25} />
                      </SocialOutlinedCard>
                    </a>
                    <a href="/" target="_blank">
                      <SocialOutlinedCard className={`${iconsStyle} `}>
                        <FaDiscord size={25} />
                      </SocialOutlinedCard>
                    </a>
                    <a href="/" target="_blank">
                      <SocialOutlinedCard className={`${iconsStyle}  `}>
                        <SiGitbook size={25} />
                      </SocialOutlinedCard>
                    </a>


                    <a href="/" target="_blank">
                      <SocialOutlinedCard className={`${iconsStyle} `}>
                        <AiFillMediumSquare size={25} />
                      </SocialOutlinedCard>
                    </a>
                    <a href="/" target="_blank">
                      <SocialOutlinedCard className={`${iconsStyle} `}>
                        <FaRedditAlien size={25} />
                      </SocialOutlinedCard>
                    </a>
                  </Box>
                  <Typography color="text.light" sx={{ my: 4 }}>
                    The DeFi hub on Base Network to bootstrap innovations, monitor and manage digital assets.{' '}
                  </Typography>


                </Box>
              </Grid>
              <Grid item sm={12} lg={4}>
                <Box
                  sx={{
                    display: { xs: 'block', lg: 'flex ' },
                    justifyContent: 'space-around',
                  }}
                  className="space-y-10 sm:space-y-0"
                >
                  <Box>
                    <h4 className="text-lg font-medium mb-5">Site Links</h4>

                    <ul className="space-y-3">
                      {/* <Link href="/">
                        <li>
                          <a className=" cursor-pointer">
                            <Typography color="text.light">
                              Launchpad
                            </Typography>
                          </a>
                        </li>
                      </Link> */}

                      <li>
                        <a
                          href="/"

                          className=" cursor-pointer"
                        >
                          <Typography color="text.light">DEX</Typography>
                        </a>
                      </li>
                      {/* 
                      <Link href="/">
                        <li>
                          <a className=" cursor-pointer">
                            <Typography color="text.light">Stake</Typography>
                          </a>
                        </li>
                      </Link>
                      <Link href="/">
                        <li>
                          <a className=" cursor-pointer">
                            <Typography color="text.light">Stats</Typography>
                          </a>
                        </li>
                      </Link> */}
                    </ul>
                  </Box>

                </Box>
              </Grid>

              <Grid item sm={12} lg={4}>
                <Box className="space-y-3">
                  <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
                    Subscribe Now!
                  </Typography>
                  <Typography color="text.light">
                    Subscribe for the airdrops & PreSale
                  </Typography>
                  <Formik
                    onSubmit={handleSubmit}
                    validationSchema={newsletterValidator}
                    initialValues={{ email: '' }}
                  >
                    {({
                      isSubmitting,
                      handleSubmit,
                      handleChange,

                      values,
                      submitForm,
                    }) => (
                      <form noValidate onSubmit={handleSubmit}>
                        <TextField
                          type="Email"
                          name="email"
                          placeholder="Email Address"
                          onChange={handleChange}
                          value={values.email}
                          InputProps={{
                            sx: { '& input': { padding: '17px' } },
                            endAdornment: (
                              <Button
                                variant="contained"
                                onClick={submitForm}
                                size="large"
                                disabled={isSubmitting}
                                sx={{
                                  borderRadius: '10px',
                                  background:
                                    ' linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
                                  padding: '10px 2rem ',
                                  fontWeight: '600',
                                  marginRight: '-8px',
                                }}
                              >
                                Subscribe
                              </Button>
                            ),
                          }}
                        />
                        <Error name="email" />
                      </form>
                    )}
                  </Formik>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

      </div>
    </>
  );
}
