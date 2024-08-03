import React, { useEffect, useMemo } from "react";
import moment from "moment";
import Countdown from "react-countdown";
import { classNames } from "@/functions";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import Link from "next/link";

// please install following pacakges "react-countdown" , "moment.js" , style which one you like

export const gradientText = "font-bold text-transparent lg:leading-tight bg-clip-text bg-gradient-to-r from-[#fd0000] to-[#466DFD]";
// the start and end time is in seconds , and "now" is moment obj here  
const useCountdown = (startTime, endTime, now) => {

  const router = useRouter()

  console.log({ router: router.pathname })

  return useMemo(() => {
    if (now.isBefore(startTime * 1000)) {
      // Start time is in the future
      const formattedStartTime = moment(startTime * 1000).format("YYYY-MM-DD HH:mm:ss");
      return <div className="text-white flex justify-center items-center space-x-3">
        <p className={gradientText}>Starts in:</p>
        <Countdown date={formattedStartTime} className={'font-bold'} />
      </div>
    } else if (now.isSameOrAfter(startTime * 1000) && now.isBefore(endTime * 1000)) {
      // Start time has passed, but end time is still in the future
      const formattedEndTime = moment(endTime * 1000).format("YYYY-MM-DD HH:mm:ss");
      return <div className="text-white flex justify-center items-center space-x-3">
        <p className={gradientText}>Ends in:</p>
        <Countdown date={formattedEndTime} className="font-bold" />
      </div>
    } else {
      // End time has passed
      return <div className="text-white flex items-center flex-col justify-center space-x-1 cursor-pointer">
        <Link href='/airdrop'>
          <p className={classNames(gradientText)}>Announcement: BaseX $200k Treasury Liquidation Airdrop. Read more</p>
        </Link>
        {/* <div className={classNames(gradientText, 'underline decoration-red-900 text-[16px] cursor-pointer')}  >Read more</div> */}
      </div>
    }
    return null
  }, [startTime, endTime, now]);

  // return countdownComponent;
};

export default useCountdown;