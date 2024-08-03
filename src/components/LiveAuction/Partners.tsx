import { Grid } from '@mui/material';
import Image from 'next/image';
import Images from '@/public/Assets/Images';
export default function Partners() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center text-xs text-white">
        <div className=" bg-gradient-to-br from-red-700 to-blue-600 bg-clip-text text-xl font-extrabold text-transparent ">
          Partnership
        </div>
        <div className="text-2xl font-bold ">Meet Our Partners</div>
      </div>

      <div>
        <Grid container className="mt-[6rem] ">
          <Grid item xs={12} sm={6} md={3}>
            <div className="bg-black text-center py-3 my-4 lg:my-0 mx-2 border-[0.5px]">
              <Image src={Images.p1} />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className="bg-black text-center py-8 my-4 lg:my-0 mx-2 border-[0.5px]">
              <Image src={Images.p2} />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className="bg-black text-center py-7 my-4 lg:my-0 mx-2 border-[0.5px]">
              <Image src={Images.p3} />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className="bg-black text-center py-5 my-4 lg:my-0 mx-2 border-[0.5px]">
              <Image src={Images.p4} />
            </div>
          </Grid>
        </Grid>
      </div>

      <div>
        <Grid container className="my-[2rem] ">
          <Grid item xs={12} sm={6} md={3}>
            <div className="bg-black text-center py-3 my-4 lg:my-0 mx-2 border-[0.5px]">
              <Image src={Images.p5} />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className="bg-black text-center py-2 my-4 lg:my-0 mx-2 border-[0.5px]">
              <Image src={Images.p6} />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className="bg-black text-center py-6 my-4 lg:my-0 mx-2 border-[0.5px]">
              <Image src={Images.p7} />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <div className="bg-black text-center py-3 my-4 lg:my-0 mx-2 border-[0.5px]">
              <Image src={Images.p8} />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
