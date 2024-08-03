import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import Images from '@/public/Assets/Images';
import Link from 'next/link';
import { ConstructionTwoTone } from '@mui/icons-material';
import {
  OutlinedCard,
  OutlinedCardBorderGradient,
  OutlinedCardPrimaryDark,
} from '@/components/OutlinedCard';
import { useIsDarkMode } from '@/state/user/hooks';
import styled from '@emotion/styled';
import { filter } from 'lodash';

interface IContainerStyled {
  isAirdropButton: boolean
}

const ContainerStyled = styled(OutlinedCardBorderGradient)<IContainerStyled>(({ theme, isAirdropButton }) => ({
  background:
    "#28273f",
  // boxShadow: ' 0px 0px 30px rgba(255, 78, 78, 0.63)',
  borderRadius: '15px',
  padding: '1rem',
  position: 'relative',
  border: 'none',
  overflow: 'visible',
  // boxShadow: 'none',
}));

const HeroCard = ({ photo, title, description, isAirdropButton = false, ...props }: {
  photo: string, title: string, description?: string, isAirdropButton?: boolean
}) => {
  const isDarkMode = useIsDarkMode();
  const theme = useTheme()
  return (
    <div>
      <Box
        sx={{
          padding: '1.5px',
          borderRadius: '16px',
          background: "#8C888840",
          // boxSha dow: ' 0px 0px 50px rgba(255, 78, 78, 0.63)',
        }}
      >
        <ContainerStyled isAirdropButton >
          <Box
          // sx={{
          //   display: 'flex',
          //   justifyContent: 'space-between',
          //   alignItems: 'center',
          // }}
          >
            <Box className="flex items-center justify-center flex-col text-center relative">
              <div className='absolute left-1/2 -top-14 -translate-x-1/2 bg-white rounded-full w-20 h-20 '>

                <Image src={photo} />
              </div>
              <Box className="flex  flex-col space-y-2 mt-12  w-full">
                <Typography fontSize={isAirdropButton ? "20px" : "32px"} sx={{ my: "20px" }} fontWeight={'bold'}>{title}</Typography>
                {
                  <Box className='flex justify-center space-x-5 w-full  items-center'>

                    <Box>

                      {description && <Typography variant="body1" fontSize="12px" >
                        {description}
                      </Typography>}
                    </Box>
                    <Box className=' scale-75'>

                      {
                        <Box
                          ml={2}
                          sx={{
                            borderRadius: '10px',
                            position: 'relative',
                            '&::before': {
                              borderRadius: '12px',
                              content: "''",
                              position: 'absolute',
                              top: '-3px',
                              left: '-3px',
                              bottom: '-3px',
                              right: '-3px',
                              background:
                                'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
                              zIndex: 1,
                            },
                            background: theme.palette.background.default,
                          }}
                        >
                          <Card sx={{ borderRadius: '10px', zIndex: 1, position: 'relative', background: isDarkMode ? "#3e2d4f" : "#fff  " }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '0.6rem',
                                height: '100%',
                                cursor: 'pointer'
                              }}
                            >
                              {/* <Typography variant="h5" className=" whitespace-nowrap"> */}
                              <Image src={Images.arrowRight} width={30} height={30} alt='arrow' style={{ filter: isDarkMode ? 'invert(0)' : 'invert(1)' }} />
                              {/* </Typography> */}
                            </Box>
                          </Card>
                        </Box>

                      }
                    </Box>

                  </Box>
                }

              </Box>
            </Box>


          </Box>
        </ContainerStyled>
      </Box>
    </div>
  );
};

export default HeroCard;
