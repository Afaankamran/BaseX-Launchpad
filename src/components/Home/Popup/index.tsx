import React, { useState } from 'react';
import { AiFillPlayCircle } from 'react-icons/ai';
import { useIsDarkMode } from '@/state/user/hooks';
import ModalVideo from 'react-modal-video';

interface Props {
  url: string;
}

const PopupVideo = ({ url }) => {
  const [isOpen, setOpen] = useState(false);
  const isDarkMode = useIsDarkMode();

  return (
    <React.Fragment>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId={url}
        onClose={() => setOpen(false)}
      />

      <div
        className="  upperButton z-30  flex h-full w-full cursor-pointer items-center justify-center"
        onClick={() => setOpen(true)}
      >
        <div
          className={
            isDarkMode
              ? 'mb-20 sm:mb-0 absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  '
              : 'invert mb-20 sm:mb-0 absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          }
        >
          <AiFillPlayCircle
            size={100}
            color={isDarkMode ? '#466DFD' : '#000'}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default PopupVideo;
