import moment from "moment";

const getEarlyPool = (pools) => {

  const earlyPool = pools.reduce((acc, curr, ind) => {
    if (ind > 1 && curr.startTime) {
      const currPoolStartTime = curr.startTime.unix();
      const currPoolEndTime = curr.endTime ? curr.endTime.unix() : 0;

      if ((currPoolStartTime > acc.startTime && currPoolStartTime > moment().unix()) || (currPoolEndTime > moment().unix() && currPoolEndTime < acc.endTime)) {
        return {
          startTime: currPoolStartTime,
          endTime: currPoolEndTime,
          pool: curr
        };
      }
    }

    return acc;
  }, { startTime: 0, endTime: Infinity, pool: null });
  return { pool: earlyPool }
}

export default getEarlyPool