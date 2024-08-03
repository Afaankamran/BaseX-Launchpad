import { Box, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import Images from '@/public/Assets/Images';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PieChartIcon from '@mui/icons-material/PieChart';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import PoolCard from '../PoolCard';
import AdminProvider, { useAdmin } from '@/components/Admin/Context';
import { useIsDarkMode } from '@/state/user/hooks';

export default function LiveAuction({ livePools }) {
  const { admin, updateAdmin } = useAdmin();
  const isDarkMode = useIsDarkMode();

  return (
    <>
      <Box
        sx={{
          background: ' linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
          padding: '1px 0px',
        }}
        className="calWidth"
      >
        <Box
          sx={{
            background: isDarkMode ? '#0A0815' : '#ffffff',
          }}
        >
          <Box
            className="py-[7vh] lg:py-[14vh] "
            sx={{
              background:
                'linear-gradient(90deg, rgba(255, 62, 61, 0.05) 0%, rgba(70, 109, 253, 0.05) 100%)',
            }}
          >
            <div className="max-w-5xl mx-auto">
              <Box>
                <div className="text-center text-xs text-white space-y-2 px-5">
                  <Box className="flex justify-center items-center">
                    <Typography variant="h4">Ongoing Sale</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h1">Live Auction</Typography>
                  </Box>
                </div>
              </Box>

              {livePools.length <= 0 && (
                <div className="justify-center flex py-5 w-full ">
                  <span>No projects currently live</span>
                </div>
              )}
              {livePools.map((pool) => {
                return (
                  <PoolCard pool={pool} isAdmin={admin} key={pool.addresss} />
                );
              })}
              {/* <LivePoolCard /> */}
            </div>
          </Box>
        </Box>
      </Box>
    </>
  );
}
LiveAuction.Provider = AdminProvider;

// function LivePoolCard() {
//   return (
//     <div className="  mt-20">
//       <Box
//         sx={{
//           borderRadius: '10px',
//           border: '1px solid #81aad881',
//           background: '#0b0c1e',
//         }}
//       >
//         <Box display="flex">
//           <Grid container className="p-2 ">
//             <Grid item xs={12} sm={12} md={5}>
//               <Box className="text-center">
//                 <Image src={Images.auction} />
//               </Box>
//             </Grid>
//             <Grid xs={12} sm={12} md={7}>
//               <Container>
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   borderBottom="1px solid #466efd5e"
//                 >
//                   <div className="flex justify-center items-center py-4">
//                     <Image src={Images.nft} alt="" />
//                     <div>
//                       <p className="pl-3 font-bold text-xl lg:text-2xl">
//                         NFT Digital Art
//                       </p>
//                       <Typography
//                         variant="h2"
//                         className="pl-3 text-blue-100 pt-2"
//                       >
//                         1 SLIME = 0.019 ETH
//                       </Typography>
//                     </div>
//                   </div>
//                   <div className="">
//                     <Box
//                       sx={{
//                         borderRadius: '20px',
//                         border: '1px solid #FF5E5E',
//                         color: '#FF5E5E',
//                         background: '#ff5e5e1c',
//                       }}
//                       className=" mt-[2rem]"
//                     >
//                       <Box className="flex items-center px-3 py-1">
//                         <Box className="">
//                           <TimelapseIcon />
//                         </Box>
//                         <Box className="pl-2">
//                           <p className="text-sm">Sold Out</p>
//                         </Box>
//                       </Box>
//                     </Box>
//                   </div>
//                 </Box>
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   className="pt-4 pb-3"
//                 >
//                   <Box>
//                     <Typography variant="subtitle1" color="common.blue">
//                       Total Raised
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography variant="subtitle1" color="common.blue">
//                       Time Left
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   marginBottom="30px"
//                 >
//                   <Box>
//                     <Typography variant="h5" fontWeight="bold" color="#466DFD">
//                       $1,232,300 / $1,232,300
//                     </Typography>
//                   </Box>
//                   <Box className="flex justify-center items-center">
//                     <Image src={Images.launchpadClock} />

//                     <Typography
//                       variant="h5"
//                       color="common.white"
//                       fontWeight="bold"
//                       marginLeft="5px"
//                     >
//                       3h, 30Mins
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box
//                   sx={{
//                     backgroundColor: 'common.cardbg2',
//                     border: '1px solid #466efd5c',
//                   }}
//                   className="mt-4 mb-2 rounded-lg"
//                 >
//                   <Container>
//                     <Box
//                       display="flex"
//                       justifyContent="space-between"
//                       alignItems="center"
//                       className="pt-2"
//                     >
//                       <Typography variant="h2" color="common.blue">
//                         Curent Sale
//                       </Typography>

//                       <Box>
//                         <Typography
//                           variant="h6"
//                           fontWeight="bold"
//                           color="#466DFD"
//                         >
//                           72%
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <div className="pb-3">
//                       <div className="h-4 w-full rounded-full bg-[#070309] dark:bg-gray-700">
//                         <div
//                           className="h-4 rounded-full bg-gradient-to-r from-[#D24A4E] to-[#2563EB]"
//                           style={{ width: '75%' }}
//                         ></div>
//                       </div>
//                     </div>
//                   </Container>
//                   <Box borderTop="1px solid #466efd60">
//                     <Grid container>
//                       <Grid item sm={4} md={4}>
//                         <Box
//                           borderRight="1px solid #466efd60"
//                           className="px-4 py-3"
//                         >
//                           <Typography variant="h2" color="common.blue">
//                             Participants
//                           </Typography>
//                           <Typography color="white">1235</Typography>
//                         </Box>
//                       </Grid>
//                       <Grid item sm={4} md={4}>
//                         <Box
//                           borderRight="1px solid #466efd60"
//                           className="px-4 py-3"
//                         >
//                           <Typography variant="h2" color="common.blue">
//                             Start Date
//                           </Typography>
//                           <Typography color="white">05.03.2022</Typography>
//                         </Box>
//                       </Grid>
//                       <Grid item sm={4} md={4}>
//                         <Box className="px-4 py-3">
//                           <Typography variant="h2" color="common.blue">
//                             Token Price
//                           </Typography>
//                           <Typography color="white">$0.001</Typography>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </Box>
//                 </Box>

//                 <Box className="mt-5">
//                   <Grid container>
//                     <Grid item sm={12} md={4} lg={4}>
//                       <Box>
//                         <Typography variant="h2" color="common.blue">
//                           <PieChartIcon className="pr-1" />
//                           Tokens Sold
//                         </Typography>
//                         <Typography
//                           fontWeight="bold"
//                           className="pl-6"
//                           color="#466DFD"
//                         >
//                           100
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item sm={12} md={4} lg={4}>
//                       <Box>
//                         <Typography variant="h2" color="common.blue">
//                           <BuildCircleIcon className="pr-1" />
//                           Sales Progress
//                         </Typography>
//                         <Typography
//                           color="#466DFD"
//                           fontWeight="bold"
//                           className="pl-6"
//                         >
//                           0.1%
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item sm={12} md={4} lg={4}>
//                       <Box>
//                         <Typography variant="h2" color="common.blue">
//                           <ArrowCircleUpIcon className="pr-1" />
//                           Your Allocation
//                         </Typography>
//                         <Typography
//                           color="#466DFD"
//                           fontWeight="bold"
//                           className="pl-6"
//                         >
//                           100%
//                         </Typography>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               </Container>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </div>
//   );
// }
