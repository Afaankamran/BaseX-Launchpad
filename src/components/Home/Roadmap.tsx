import {
  Box,
  Card,
  Container,
  Grid,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import Images from '@/public/Assets/Images';
import Image from 'next/image';
import { width } from '@mui/system';
import { useIsDarkMode } from '@/state/user/hooks';
// import { GoPrimitiveDot } from 'react-icons/go';

import {
  OutlinedCardBorderGradient,
  OutlinedCardPrimaryDark,
} from '../OutlinedCard';



const VerticalLine = styled(Box)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: 4px;
  background-color: #363e8e;
  box-shadow: 0px 0px 34px 10px #363E8E;
  z-index: -1;
`;

const HorizontalLine = styled(Box)`
  position: absolute;
  width: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
  height: 3px;
  background-color: #363e8e;
  box-shadow: 0px 0px 34px 10px #363E8E;
  z-index: -1;
`;


const Q2 = ["DEX Development", "Token Generator"]
const Q3 = ["LaunchPad", "KYC and Audits", "Anti-bot", "Multi Sender"]
// const Q3 = ["Fork token generator of Kaichain", "Hello Token", "Simple Token", "Standard Token", "Burnable Token", "Mint Token", "Pausable Token", "Common Token", "Deflationary token", "Texable token"]
 const Q4 = ["CEX Launch", "Launchpad Refinement"]
export const buying = [
  {
    title: 'Q2 - 2024',
    subtitle:
      <OutlinedCardPrimaryDark bgOpacity={0.1} sx={{ padding: "14px" }} >
        {Q2.map((q, i) => {
          return <div className="flex px-4 py-2" key={i}>
            <div className="">
              <Image src={Images.MapCheck} />
            </div>
            <div className=" px-3 ">{q}</div>
          </div>
        })}

      </OutlinedCardPrimaryDark>,
    icon: '/walletCoin.svg',
  },
  {
    title: 'Q3 - 2024',
    subtitle:
      <OutlinedCardPrimaryDark bgOpacity={0.1}>
        {Q3.map((q, i) => {
          return <div className="flex px-4 py-2" key={i}>
            <div className="">
              <Image src={Images.MapCheck} />
            </div>
            <div className=" px-3 ">{q}</div>
          </div>
        })}
      </OutlinedCardPrimaryDark>
    ,
    icon: '/eths.svg',
  },
  // {
  //   title: 'Q3 - 2024',
  //   subtitle:
  //     <OutlinedCardPrimaryDark bgOpacity={0.1}>
  //       {Q3.map((q, i) => {
  //         return <div className="flex px-4 py-2" key={i}>
  //           <div className="">
  //             <Image src={Images.MapCheck} />
  //           </div>
  //           <div className=" px-3 ">{q}</div>
  //         </div>
  //       })}

  //     </OutlinedCardPrimaryDark>,
  //   icon: '/rainbowHorse.svg',
  // },
  {
    title: 'Q4 - 2024',
    subtitle:
      <OutlinedCardPrimaryDark bgOpacity={0.1}>
        {Q4.map((q, i) => {
          return <div className="flex px-4 py-2" key={i}>
            <div className="">
              <Image src={Images.MapCheck} />
            </div>
            <div className=" px-3 ">{q}</div>
          </div>
        })}

      </OutlinedCardPrimaryDark>,
    icon: '/apsWithcoins.svg',
  },
];


export default function Roadmap() {
  const isDarkMode = useIsDarkMode();
  const theme = useTheme();
  return (
    <Container maxWidth="lg">
      <div className="   mt-[122px]  ">
        <div className="py-6 mb-4 text-center">
          <div className="text-left space-y-2">
            <Box className="flex justify-start items-center w-full">
              <Typography variant="h4" fontSize="50px" fontWeight="bold">THE FUTURE</Typography>
            </Box>

          </div>

        </div>

        <Box id="buy">
          <Container maxWidth="lg" style={{ position: 'relative' }}>
            <div className='flex justify-center items-center'>
              <OutlinedCardPrimaryDark bgOpacity={0.1}
                sx={{ border: "3px solid #363e8e", boxShadow: "0px 0px 7px  #363e8e", width: "fit-content", marginBottom: { xs: "3rem", md: "0rem" } }}
              >
                <div className="flex p-4 ">
                  <div className="text-2xl font-bold">
                    Our Roadmap
                  </div>
                </div>
              </OutlinedCardPrimaryDark>
            </div>
            <Box >
              <div className='hidden lg:block'>
                <VerticalLine />
              </div>
              {buying.map((item, index) => {
                return (
                  <Grid
                    key={index}
                    container
                    sx={{
                      gap: { xs: "20px", md: '0px' },

                      '&:nth-child(odd)': {
                        flexDirection: 'row-reverse',
                        gap: { xs: "20px", md: '0px' },
                        '& .text-div': {
                          justifyContent: { xs: 'center', md: "end" },
                          textAlign: { xs: 'center', md: 'end' },
                        },
                        '& .img-div': {
                          justifyContent: { xs: 'center', md: 'start' },
                        },
                      },


                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={5}
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'end' },
                        alignItems: 'center',
                      }}
                      className="img-div"
                    >
                      {' '}
                      <OutlinedCardPrimaryDark bgOpacity={0.1}
                        sx={{ border: "3px solid #363e8e", boxShadow: "0px 0px 7px  #363e8e" }}
                      >
                        <div className="flex p-4">
                          <div className="text-2xl font-bold">
                            {item.title}
                          </div>
                        </div>

                      </OutlinedCardPrimaryDark>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={2}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                        }}
                      >
                        <div className="p-3 w-14 h-14 border flex justify-center items-center rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
                          }}
                        >
                          <Image src={Images.DownArrow} />
                        </div>
                        <div className='hidden lg:block'>

                          <HorizontalLine />
                        </div>
                        {/* <GoPrimitiveDot
                            size={50}
                            color={theme.palette.primary.main}
                          /> */}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={5}
                      className="text-div"
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', md: "start" },
                        alignItems: 'center',
                        textAlign: { xs: 'center', md: 'start' },
                        marginBottom: '3rem',
                        marginTop: { xs: "0px", md: '3rem' },
                      }}
                    >
                      {item.subtitle}
                    </Grid>
                  </Grid>
                );
              })}
            </Box>
          </Container>
        </Box>
      </div>
    </Container>
  );
}











// <Grid container spacing={3} className="flex justify-center relative">
//   <Box
//     className=" justify-center items-center relative top-[166px] h-0.5  w-full ml-5 hidden lg:flex mx-auto "
//     sx={{
//       background: 'linear-gradient(90deg, #ff3e3d 0%, #466dfd 100%)',
//     }}
//   ></Box>
//   <Grid item xs={12} md={3} lg={3}>
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '0 2rem',
//         margin: '20px 0px ',
//       }}
//     >
//       <Box
//         sx={{
//           borderRadius: '15px',
//           position: 'relative',
//           '&::before': {
//             borderRadius: '15px',
//             content: "''",
//             position: 'absolute',
//             top: '-1px',
//             left: '-1px',
//             bottom: '-1px',
//             right: '-1px',
//             background:
//               'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
//             zIndex: -1,
//           },
//           background: theme.palette.background.default,
//         }}
//       >
//         <Card>
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               padding: '1rem 2rem',
//               height: '100%',
//             }}
//           >
//             <Typography variant="h5" className=" whitespace-nowrap">
//               Q4 - 2022
//             </Typography>
//           </Box>
//         </Card>
//       </Box>

//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '30px',
//           width: '2px',
//           background:
//             'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
//         }}
//       ></Box>
//       <Image src={Images.roadmapArrow} />
//     </Box>
//     <OutlinedCardPrimaryDark bgOpacity={0.1}>
//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">Launchpad & DEX Development</div>
//       </div>
//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">Beta Testing</div>
//       </div>
//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">Strategic Partnerships</div>
//       </div>
//       {/* <div className="flex p-4">
//                   <div className="">
//                     <Box
//                       sx={{
//                         padding: '4px',
//                         background:
//                           'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//                         borderRadius: '50%',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <Image src={Images.tick} />
//                     </Box>
//                   </div>
//                   <div className=" px-3 ">Start Marketing</div>
//                 </div> */}
//     </OutlinedCardPrimaryDark>
//   </Grid>
//   {/* --------------- */}
//   <Grid item xs={12} md={3} lg={3}>
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '0 2rem',
//         margin: '20px 0px ',
//       }}
//     >
//       <Box
//         sx={{
//           borderRadius: '15px',
//           position: 'relative',
//           '&::before': {
//             borderRadius: '15px',
//             content: "''",
//             position: 'absolute',
//             top: '-1px',
//             left: '-1px',
//             bottom: '-1px',
//             right: '-1px',
//             background:
//               'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
//             zIndex: -1,
//           },
//           background: theme.palette.background.default,
//         }}
//       >
//         <Card>
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               padding: '1rem 2rem',
//               height: '100%',
//             }}
//           >
//             <Typography variant="h5" className=" whitespace-nowrap">
//               Q1 - 2023
//             </Typography>
//           </Box>
//         </Card>
//       </Box>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '30px',
//           width: '2px',
//           background:
//             'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
//         }}
//       ></Box>
//       <Image src={Images.roadmapArrow} />
//     </Box>
//     <OutlinedCardPrimaryDark bgOpacity={0.1}>
//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">$ARRAY Public Sale</div>
//       </div>
//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">Listing on DEX</div>
//       </div>

//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">Launch Staking</div>
//       </div>

//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">First Project IDO</div>
//       </div>

//     </OutlinedCardPrimaryDark>
//   </Grid>
//   {/* --------------- */}

//   <Grid item xs={12} md={3} lg={3}>
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '0 2rem',
//         margin: '20px 0px ',
//       }}
//     >
//       <Box
//         sx={{
//           borderRadius: '15px',
//           position: 'relative',
//           '&::before': {
//             borderRadius: '15px',
//             content: "''",
//             position: 'absolute',
//             top: '-1px',
//             left: '-1px',
//             bottom: '-1px',
//             right: '-1px',
//             background:
//               'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
//             zIndex: -1,
//           },
//           background: theme.palette.background.default,
//         }}
//       >
//         <Card>
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               padding: '1rem 2rem',
//               height: '100%',
//             }}
//           >
//             <Typography variant="h5" className=" whitespace-nowrap">
//               Q2 - 2023
//             </Typography>
//           </Box>
//         </Card>
//       </Box>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '30px',
//           width: '2px',
//           background:
//             'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
//         }}
//       ></Box>
//       <Image src={Images.roadmapArrow} />
//     </Box>
//     <OutlinedCardPrimaryDark bgOpacity={0.1}>
//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">Governance</div>
//       </div>
//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">Ecosystem NFTs</div>
//       </div>
//     </OutlinedCardPrimaryDark>
//   </Grid>

//   <Grid item xs={12} md={3} lg={3}>
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '0 2rem',
//         margin: '20px 0px ',
//       }}
//     >
//       <Box
//         sx={{
//           borderRadius: '15px',
//           position: 'relative',
//           '&::before': {
//             borderRadius: '15px',
//             content: "''",
//             position: 'absolute',
//             top: '-1px',
//             left: '-1px',
//             bottom: '-1px',
//             right: '-1px',
//             background:
//               'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
//             zIndex: -1,
//           },
//           background: theme.palette.background.default,
//         }}
//       >
//         <Card>
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               padding: '1rem 2rem',
//               height: '100%',
//             }}
//           >
//             <Typography variant="h5" className=" whitespace-nowrap">
//               Q3 - 2023
//             </Typography>
//           </Box>
//         </Card>
//       </Box>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '30px',
//           width: '2px',
//           background:
//             'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
//         }}
//       ></Box>
//       <Image src={Images.roadmapArrow} />
//     </Box>
//     <OutlinedCardPrimaryDark bgOpacity={0.1}>
//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">CEX Launch</div>
//       </div>
//       <div className="flex p-4">
//         <div className="">
//           <Box
//             sx={{
//               padding: '4px',
//               background:
//                 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.26) 100%)',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Image src={Images.tick} />
//           </Box>
//         </div>
//         <div className=" px-3 ">Launchpad Refinement</div>
//       </div>
//     </OutlinedCardPrimaryDark>
//   </Grid>
// </Grid>