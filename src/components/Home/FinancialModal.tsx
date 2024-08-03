import Images from '@/public/Assets/Images';
import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useIsDarkMode } from '@/state/user/hooks';

const FinancialModal = () => {
  const isDarkMode = useIsDarkMode();
  return (
    <div className="mt-[100px]">
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            flexDirection: 'column',
          }}
        >
          <div className="text-left w-full space-y-2">
            <Box className="flex justify-start items-center w-full">
              <Typography variant="h4" fontSize="50px" fontWeight="bold">Financial Model</Typography>
            </Box>

          </div>
          <Box
            sx={{
              border: '3px solid #0c8ce9',
              marginTop: '7rem',
              // padding: '2rem', 
              borderRadius: '15px',
              overflow: 'hidden',

            }}
          >
            <Image
              src={
                Images.BaseSystem
              }
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default FinancialModal;
