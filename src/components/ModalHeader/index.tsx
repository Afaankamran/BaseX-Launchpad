import { ChevronLeftIcon, XIcon } from '@heroicons/react/outline';

import React, { FC } from 'react';
import Typography from '../Typography';

interface ModalHeaderProps {
  title?: string;
  className?: string;
  onClose?: () => void;
  onBack?: () => void;
}

const ModalHeader: FC<ModalHeaderProps> = ({
  title = undefined,
  onClose = undefined,
  className = '',
  onBack = undefined,
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {onBack && (
        <ChevronLeftIcon
          onClick={onBack}
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      {title && (
        <Typography
          component="p"
          variant="h3"
          className="mb-0 text-white font-weight-bold "
        >
          {title}
        </Typography>
      )}
      <div
        className="flex items-center w-6 h-6 text-white cursor-pointer justify-cente hover:text-high-emphesis"
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      >
        <XIcon width={24} height={24} />
      </div>
    </div>
  );
};

export default ModalHeader;
