import { Box } from '@mui/system';
import {
  Typography,
  styled,
  useTheme,
  darken,
  lighten,
  Container,
  Card,
  alpha,
} from '@mui/material';
import { Grid } from '@mui/material';
import { Button } from '@mui/material';
import Link from 'next/link';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import useSWR from 'swr';
import {
  useSinglePoolData,
  useUserRemainingAllocation,
} from '@/hooks/useLaunchpadPools';
import usePoolTimings from '@/hooks/usePoolTimings';
import { classNames, formatNumberScale, fromWei, truncate } from '@/functions';
import { useActiveWeb3React } from '@/hooks';
import Images from '@/public/Assets/Images';
import Image from 'next/image';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import PieChartIcon from '@mui/icons-material/PieChart';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { OutlinedCardPrimaryDark } from '../OutlinedCard';
import { useIsDarkMode } from '@/state/user/hooks';
import { BASE_URI } from '@/constants';
import { ThirdwebStorage } from "@thirdweb-dev/storage";

const storage = new ThirdwebStorage();
const StyledCardDetail = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0,0,0,0.05)',
}));
export default function PoolCard({ pool, isAdmin = false }) {
  const isDarkMode = useIsDarkMode();
  const theme = useTheme();
  const { account } = useActiveWeb3React();
  const { data: poolData } = useSWR(`/idos/${pool.address}`, () => {
    return fetch(`${BASE_URI}/idos/${pool.address}`).then((res) => {
      if (res.status == 200) {
        return res.json();
      }
    });
  });
  // const { data: poolData } = useSWR(`pool/${pool.address}`, async () => {
  //   return fetch(`https://ipfs.infura.io/ipfs/${pool.ipfsHash}`).then((res) =>
  //     res.json(),
  //   );
  // });
  const data = useSinglePoolData(pool.address);
  const { data: userTiers } = useSWR(
    `pool/whtielist/${data?.dataUri}`,
    async () => {
      if (!data?.dataUri) return null;
      // return fetch(`https://ipfs.infura.io/ipfs/${data?.dataUri}`).then((res) =>
      //   res.json(),
      // );

      const queryData = await storage.downloadJSON(data?.dataUri);
      return queryData;
    },
  );
  const userInIpfs = userTiers ? userTiers[account] : null;
  const userTier = userInIpfs ? userInIpfs.tier : null;
  const buyingPower: string = userInIpfs ? userInIpfs.buyingPower : '0';
  const userAllocations = useUserRemainingAllocation(pool.address, buyingPower);
  const {
    startTime,
    isActive,
    isEnded,
    isUpcomming,
    registerStartsIn,
    registerEndsIn,
    registerEndedAgo,
    saleLiveIn,
    saleEndedAgo,
    saleEndsIn,
    saleLiveInSmall,
  } = usePoolTimings(data);
  const cap = data ? fromWei(data.rate.mul(data.tokensForSale), 36) : 0;
  const raised = data ? fromWei(data.rate.mul(data.tokensSold), 36) : 0;
  const progress = data
    ? (
        (Number(fromWei(data.tokensSold)) /
          Number(fromWei(data.tokensForSale))) *
        100
      ).toFixed(2)
    : 0;
  const isUserWhitelisted = false;

  const tokensUSDValueBought =
    data && userAllocations.balance
      ? Number(fromWei(userAllocations.balance)) * Number(fromWei(data.rate))
      : 0;
  const maxSellAllocation =
    userAllocations.balance && data
      ? (Number(fromWei(data.maxSell)) - userAllocations.balance) *
        Number(fromWei(data.rate))
      : 0;

  const whiteListAllocation =
    data?.whitelistEnabled && isUserWhitelisted
      ? Number(fromWei(data.maxSell))
      : 0;

  const levelsAllocation =
    userAllocations?.maxAllocation && data
      ? (
          Number(fromWei(userAllocations.maxAllocation)) -
          tokensUSDValueBought +
          whiteListAllocation
        ).toFixed(6)
      : 0;

  const maxBuy = Math.max(
    Math.min(Number(levelsAllocation), Number(cap)),
    (data?.whitelistEnabled && isUserWhitelisted) ||
      data?.isFcfsTime ||
      !data?.levelsEnabled
      ? maxSellAllocation
      : 0,
  );
  const remainingAllocation = data ? maxBuy / Number(fromWei(data.rate)) : 0;


  console.log({poolData})
  const detailUrl = isAdmin
    ? `/configure/projects/${pool.address}`
    : `/launchpad/${pool.address}`;
  return !isActive ? (
    <Link href={detailUrl}>
      <OutlinedCardPrimaryDark bgOpacity={0.1} className="  cursor-pointer  ">
        {(!poolData && !isAdmin) || !data ? null : (
          <Box className="h-full w-full px-2 pt-2 pb-3 rounded-lg text-center border border-[#81aad869]">
            {isUpcomming && (
              <Card
                variant="outlined"
                className="  rounded-lg mb-2 p-2 space-y-1 "
              >
                <Typography color="text.light" variant="body2">
                  Starts in
                </Typography>
                <Box className="flex justify-center items-center">
                  <Typography variant="h3"> {saleLiveInSmall} UTC</Typography>
                </Box>
              </Card>
            )}


            <img
              src={poolData?.image}
              alt="CardImage"
              width="500px"
              height="260px"
              className='rounded-lg !w-full'

              style={{aspectRatio:"16/14"}}
            
              />

            <Box className="flex flex-col md:flex-row  justify-between items-center bg-orange-400 space-y-2 md:space-y-0 mx-3 mt-3">
              <Box className="lg:text-left space-y-2 md:space-y-0">
                <Typography color="text.light">Total Raised</Typography>
                <h3 className="font-bold ">
                  ${raised ? truncate(raised).toLocaleString() : 0} / $
                  {cap ? cap.toLocaleString() : 0}
                </h3>
              </Box>
              {isUpcomming && (
                <Box className="bg-[#20492f76] border border-[#20492f] rounded-full px-3 py-1 text-[#35ca1d]">
                  Upcoming
                </Box>
              )}
              {isEnded && (
                <Box className="bg-[#fd3f3f1a] border border-[#fd3f3f33] rounded-full px-3 py-1 text-[#FD3F3F]">
                  Completed
                </Box>
              )}
            </Box>  
            {/* prograssBar Start */}
            <Box className="mx-3 mt-5 ">
              <div className="flex justify-between items-center   pb-2 lg:pb-0">
                <Typography color="text.light">Current Sale </Typography>
                <Typography fontWeight={700} color="primary.main">
                  {progress}%
                </Typography>
              </div>
              <div className="h-4 w-full rounded-full relative">
                <div
                  className={classNames(
                    'bg-[#131013]  absolute inset-0 rounded-full ',
                    isDarkMode ? 'opacity-100' : 'opacity-10',
                  )}
                ></div>
                <div
                  className="h-4 absolute top-0 left-0 bottom-0 rounded-full bg-gradient-to-r from-[#D24A4E] to-[#2563EB]"
                  style={{ width: progress + '%' }}
                ></div>
              </div>
            </Box>
            {/* prograssBar End */}
            <OutlinedCardPrimaryDark
              bgOpacity={0.07}
              className=" p-3 space-y-1 mt-3 border "
            >
              {/* Card Start */}
              <StyledCardDetail className="flex justify-between items-center   rounded-lg py-2 px-4">
                <Box className="flex items-center">
                  <Image src={Images.landingcard1} alt="image" />
                  <p className="ml-2">Participants</p>
                </Box>
                <p>
                  {' '}
                  {'-'}

                </p>
              </StyledCardDetail>
              <StyledCardDetail className="flex justify-between items-center  rounded-lg py-2 px-4">
                <Box className="flex items-center">
                  <Image src={Images.landingcard1} alt="image" />
                  <p className="ml-2">Token Price</p>
                </Box>
                <p> ${fromWei(data.rate).toLocaleString()}</p>
              </StyledCardDetail>
              <StyledCardDetail className="flex justify-between items-center  rounded-lg py-2 px-4">
                <Box className="flex items-center">
                  <Image src={Images.landingcard1} alt="image" />
                  <p className="ml-2">Start Date</p>
                </Box>
                <p> {startTime.format('MM.DD.YYYY')}</p>
              </StyledCardDetail>
              {/* Card end */}
            </OutlinedCardPrimaryDark>
            <Box>
              <div className="grid grid-cols-2 place-content-center place-items-center space-y-3 sm:space-y-0 sm:grid-cols-3  mt-5 mx-3">
                <div>
                  <div className="flex  space-x-1">
                    <Box>
                      <Image src={Images.landingchart} alt="img" />
                    </Box>
                    <Typography
                      component="p"
                      color="text.light"
                      variant="caption"
                    >
                      Tokens Sold
                      <Typography
                        textAlign="left"
                        color="primary.main"
                        variant="caption"
                        component="p"
                        fontWeight="bold"
                      >
                        {' '}
                        {formatNumberScale(Number(fromWei(data.tokensSold)))}
                      </Typography>
                    </Typography>{' '}
                  </div>
                </div>
                <div>
                  <div className="flex  space-x-1">
                    <Box>
                      <Image src={Images.landingchart} alt="img" />
                    </Box>
                    <Typography
                      component="p"
                      color="text.light"
                      variant="caption"
                    >
                      Total Tokens
                      <Typography
                        textAlign="left"
                        color="primary.main"
                        variant="caption"
                        component="p"
                        fontWeight="bold"
                      >
                        {' '}
                        {formatNumberScale(Number(fromWei(data.tokensForSale)))}
                      </Typography>
                    </Typography>{' '}
                  </div>
                </div>
                <div>
                  <div className="flex  space-x-1">
                    <Box>
                      <Image src={Images.landingchart} alt="img" />
                    </Box>
                    <Typography
                      component="p"
                      color="text.light"
                      variant="caption"
                    >
                      Sale Activity
                      <Typography
                        textAlign="left"
                        color="primary.main"
                        variant="caption"
                        component="p"
                        fontWeight="bold"
                      >
                        {' '}
                        {isEnded && 'Ended'}
                        {isUpcomming && 'Upcoming'}
                        {isActive && 'Live'}
                      </Typography>
                    </Typography>{' '}
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        )}
      </OutlinedCardPrimaryDark>
    </Link>
  ) : (
    <Link href={detailUrl}>
      <div className="  mt-20 cursor-pointer">
        {!poolData || !data ? null : (
          <OutlinedCardPrimaryDark bgOpacity={0.1}>
            <Box display="flex">
              <Grid container className="p-2 ">
                <Grid item xs={12} sm={12} md={5}>
                  <Box className="text-center flex justify-center items-cener h-full">
                    <img
                      src={poolData.image}
                      alt="image"
                      className="object-contain"
                    />
                  </Box>
                </Grid>
                <Grid xs={12} sm={12} md={7}>
                  <Container>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      borderBottom={`1px solid ${alpha('#466efd5e', 0.15)}`}
                    >
                      <div className="flex justify-center items-center py-4">
                        <Image src={                                poolData.projectIcon
                                  ? poolData?.projectIcon
                            : Images.nft} 
                           width={50}
                              height={50}
                              alt="icon"
                          />
                        <div>
                          <p className="pl-3 font-bold text-xl lg:text-2xl">
                            {poolData.name}
                          </p>
                          <Typography
                            variant="h2"
                            color="text.light"
                            className="pl-3  pt-2"
                          >
                            $1 = {Number(data.rate.toString()/1e18)}{' '}
                            {poolData.symbol}
                          </Typography>
                        </div>
                      </div>
                      {data.tokensSold == data.tokensForSale && (
                        <div className="">
                          <Box
                            sx={{
                              borderRadius: '20px',
                              border: '1px solid #FF5E5E',
                              color: '#FF5E5E',
                              background: '#ff5e5e1c',
                            }}
                            className=" mt-[2rem]"
                          >
                            <Box className="flex items-center px-3 py-1">
                              <Box className="">
                                <TimelapseIcon />
                              </Box>
                              <Box className="pl-2">
                                <p className="text-sm">Sold Out</p>
                              </Box>
                            </Box>
                          </Box>
                        </div>
                      )}
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      className="pt-4 pb-3"
                    >
                      <Box>
                        <Typography variant="subtitle1" color="text.light">
                          Total Raised
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" color="text.light">
                          Time Left
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      marginBottom="30px"
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="primary.main"
                        >
                          ${raised ? truncate(raised).toLocaleString() : 0} / $
                          {cap ? cap.toLocaleString() : 0}
                        </Typography>
                      </Box>
                      <Box className="flex justify-center items-center">
                        <Image src={Images.launchpadClock} />

                        <Typography
                          variant="h5"
                          color="common.white"
                          fontWeight="bold"
                          marginLeft="5px"
                        >
                          {saleEndsIn}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        backgroundColor: 'common.cardbg2',
                        border: `1px solid ${alpha('#466efd5c', 0.15)}`,
                      }}
                      className="mt-4 mb-2 rounded-lg"
                    >
                      <Container>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          className="pt-2"
                        >
                          <Typography variant="h2" color="text.light">
                            Curent Sale
                          </Typography>

                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="#466DFD"
                            >
                              {progress}%
                            </Typography>
                          </Box>
                        </Box>
                        <div className="pb-3">
                          <div className="h-4 w-full rounded-full relative">
                            <div
                              className={classNames(
                                'bg-[#131013]  absolute inset-0 rounded-full ',
                                isDarkMode ? 'opacity-100' : 'opacity-10',
                              )}
                            ></div>
                            <div
                              className="h-4 absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-[#D24A4E] to-[#2563EB]"
                              style={{ width: progress + '%' }}
                            ></div>
                          </div>
                        </div>
                      </Container>
                      <Box borderTop={`1px solid ${alpha('#466efd60', 0.15)}`}>
                        <Grid container>
                          <Grid item sm={4} md={4}>
                            <Box
                              borderRight={`1px solid ${alpha(
                                '#466efd60',
                                0.15,
                              )}`}
                              className="px-4 py-3"
                            >
                              <Typography variant="h2" color="text.light">
                                Participants
                              </Typography>
                              <Typography color="text.primary">
                                {' '}
                                {'-'}

                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item sm={4} md={4}>
                            <Box
                              borderRight={`1px solid ${alpha(
                                '#466efd60',
                                0.15,
                              )}`}
                              className="px-4 py-3"
                            >
                              <Typography variant="h2" color="text.light">
                                Start Date
                              </Typography>
                              <Typography color="text.primary">
                                {startTime.format('MM.DD.YYYY')}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item sm={4} md={4}>
                            <Box className="px-4 py-3">
                              <Typography variant="h2" color="text.light">
                                Token Price
                              </Typography>
                              <Typography color="text.primary">
                                ${fromWei(data.rate).toLocaleString()}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>

                    <Box className="mt-5">
                      <Grid container>
                        <Grid item sm={12} md={4} lg={4}>
                          <Box>
                            <Typography variant="h2" color="text.light">
                              <PieChartIcon className="pr-1" />
                              Tokens Sold
                            </Typography>
                            <Typography
                              fontWeight="bold"
                              className="pl-6"
                              color="#466DFD"
                            >
                              {formatNumberScale(
                                Number(fromWei(data.tokensSold)),
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={4} lg={4}>
                          <Box>
                            <Typography variant="h2" color="text.light">
                              <BuildCircleIcon className="pr-1" />
                              Sales Progress
                            </Typography>
                            <Typography
                              color="#466DFD"
                              fontWeight="bold"
                              className="pl-6"
                            >
                              {progress}%
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item sm={12} md={4} lg={4}>
                          <Box>
                            <Typography variant="h2" color="text.light">
                              <ArrowCircleUpIcon className="pr-1" />
                              Your Allocation
                            </Typography>
                            <Typography
                              color="#466DFD"
                              fontWeight="bold"
                              className="pl-6"
                            >
                              {remainingAllocation}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Container>
                </Grid>
              </Grid>
            </Box>
          </OutlinedCardPrimaryDark>
        )}
      </div>
    </Link>
  );
}
