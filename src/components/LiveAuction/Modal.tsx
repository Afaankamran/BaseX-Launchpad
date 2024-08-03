import Image from 'next/image';
import Images from '@/public/Assets/Images';
import { Box } from '@mui/material';
export default function Modal() {
  return (
    <>
      <Box className="container mx-auto px-4 my-4 ">
        <div className="text-center">
          <div className=" bg-gradient-to-br from-red-700 to-blue-600 bg-clip-text text-xl font-extrabold text-transparent ">
            Model
          </div>
          <div className="text-3xl font-bold text-white">Financial Model</div>
        </div>

        <Box
          sx={{
            backgroundColor: 'rgba(70, 109, 253, 0.1)',
          }}
          className="my-5 z-10"
        >
          <div className="-z-10">
            <Image src={Images.modal} />
          </div>
        </Box>
      </Box>
    </>
  );
}
