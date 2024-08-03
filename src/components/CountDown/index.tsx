import { FC, useEffect, useState } from "react";
import  moment from 'moment';
import useCountdown from "./useCountDown";
import { useLaunchpads } from "@/hooks/useLaunchpadPools";

 const CountDown = ({ pool }) => {
  const now = moment();
  const startDate = pool?.startTime;
  const endDate = pool?.endTime;
  // const startDate = 0;
  // const endDate = 1703584809;

   const countDown = useCountdown(startDate, endDate, now)
   
   return countDown
 }

 export default CountDown