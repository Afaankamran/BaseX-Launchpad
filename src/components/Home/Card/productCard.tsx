import { OutlinedCardPrimaryDark } from '@/components/OutlinedCard';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useIsDarkMode } from '@/state/user/hooks';
const ProductsCard = ({ item, id }) => {
  const isDark = useIsDarkMode();
  return (
    <div>
      {' '}
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
              <h3 className="ml-5 text-3xl font-bold">{item.title}</h3>
            </div>
            <Typography color="text.light">{item.description}</Typography>
          </div>
        </div>
      </OutlinedCardPrimaryDark>
    </div>
  );
};

export default ProductsCard;
