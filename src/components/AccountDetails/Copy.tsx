import { CheckCircleIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import React, { FC } from 'react';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import { classNames } from '../../functions';
import { Typography } from "@mui/material"
interface CopyHelperProps {
  className?: string;
  toCopy: string;
  children?: React.ReactNode;
}

const CopyHelper: FC<CopyHelperProps> = ({ className, toCopy, children }) => {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <div
      className={classNames(
        'flex gap-1  items-center flex-shrink-0 space-x-1 no-underline cursor-pointer whitespace-nowrap hover:no-underline focus:no-underline active:no-underline text-blue opacity-80 hover:opacity-100 focus:opacity-100',
        className ?? '',
      )}
      style={{ cursor: 'pointer' }}
      onClick={() => setCopied(toCopy)}
    >
      {isCopied && (
        <div className=" gap-1 flex items-center space-x-1 whitespace-nowrap">
          <Typography
            className="text-white"
          >{`Copied`}</Typography>
          <CheckCircleIcon color="#fff" width={16} height={16} />
        </div>
      )}

      {!isCopied && (
        <>
          {children}
          <ClipboardCopyIcon color="#fff" width={16} height={16} />
        </>
      )}
    </div>
  );
};

export default CopyHelper;
