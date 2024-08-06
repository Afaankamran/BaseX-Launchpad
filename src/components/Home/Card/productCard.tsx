import { OutlinedCardPrimaryDark } from '@/components/OutlinedCard';
import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useIsDarkMode } from '@/state/user/hooks';
import Link from 'next/link'; // Step 1: Import Link component

const ProductsCard = ({ item, id }) => {
  const isDark = useIsDarkMode();

  return (
    <div>
      <OutlinedCardPrimaryDark
        bgOpacity={0.1}
        sx={{
          height: '100%',
        }}
        key={id}
      >
        <div>
          <div
            className={`flex flex-col justify-center p-5 md:p-10 ${isDark ? item.bgColor : ''
              }`}
          >
            <div className="flex items-center mb-5 ">
              <Image src={item.logo} alt="icons" />
              {/* Step 2: Wrap title with Link component if item.link exists */}
              {item.link ? (
                <Link href={item.link} passHref>
                  <a className="ml-5 text-3xl font-bold">{item.title}</a>
                </Link>
              ) : (
                <h3 className="ml-5 text-3xl font-bold">{item.title}</h3>
              )}
            </div>
            <Typography color="text.light">{item.description}</Typography>
            {/* Step 3: Add button for Dex product */}
            {item.title === 'Dex' && item.link && (
              <Box mt={2}>
                <Link href={item.link} passHref>
                  <Button variant="contained" color="primary">Go to DEX</Button>
                </Link>
              </Box>
            )}
          </div>
        </div>
      </OutlinedCardPrimaryDark>
    </div>
  );
};

export default ProductsCard;
