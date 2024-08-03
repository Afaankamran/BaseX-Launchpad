import { Typography } from '@mui/material';
import React, { useState } from 'react';

const ListWithActiveItem = ({ TimeStamp, index, activeIndex }) => {
  return (
    <div>
      {' '}
      <Typography
        variant={activeIndex == index ? 'h4' : 'h2'}
        component="span"
        fontWeight={activeIndex == index ? 'bolder' : 'medium'}
        className={
          activeIndex == index
            ? 'font-extrabold cursor-pointer'
            : 'cursor-pointer'
        }
      >
        {TimeStamp}
      </Typography>
    </div>
  );
};

export default ListWithActiveItem;
