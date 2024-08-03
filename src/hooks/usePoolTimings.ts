import { getFormatedDateDiff, getFormatedDateDiffSmall } from '@/functions';
import moment from 'moment';
export default function usePoolTimings(pool) {
  const now = moment.utc(),
    isEnded = pool && moment.utc().isAfter(moment.unix(pool.getEndTime).utc()),
    isUpcomming =
      pool &&
      moment.unix(pool.getEndTime).utc().isAfter(moment().utc()) &&
      moment.unix(pool.startTime).utc().isAfter(moment().utc()),
    isActive =
      pool &&
      moment.unix(pool.startTime).utc().isBefore(moment().utc()) &&
      moment.unix(pool.getEndTime).utc().isAfter(moment().utc()),
    startTime = pool && moment.unix(pool.startTime).utc(),
    endTime = pool && moment.unix(pool.getEndTime).utc(),
    registerTime =
      pool && Number(pool.registerTime) > 0 && pool.levelsEnabled
        ? moment.unix(pool.registerTime).utc()
        : null,
    registerEndTime =
      pool && registerTime
        ? moment(registerTime).add(pool.registerDuration, 'seconds')
        : null,
    isRegisterTime =
      pool &&
      registerTime &&
      registerTime.isBefore(now) &&
      registerEndTime.isAfter(now),
    fcfsTime =
      pool && Number(pool.fcfsDuration) > 0
        ? moment(endTime).subtract(pool.fcfsDuration, 'seconds')
        : null,
    isFcfsTime = pool && fcfsTime && fcfsTime.isBefore(moment().utc()),
    
    saleLiveIn =
      pool && isUpcomming && !isEnded
        ? getFormatedDateDiff(startTime.diff(now))
        : null,
    saleLiveInSmall =
      pool && isUpcomming && !isEnded
        ? getFormatedDateDiffSmall(startTime.diff(now))
        : null,
    saleEndsIn =
      pool && isActive && !isEnded
        ? getFormatedDateDiff(endTime.diff(now))
        : null,
    saleEndedAgo =
      pool && isEnded ? getFormatedDateDiff(now.diff(endTime)) : null,
    registerStartsIn =
      pool &&
      !isRegisterTime &&
      registerTime &&
      registerEndTime &&
      registerTime.isBefore(now) &&
      registerEndTime.isAfter(now)
        ? getFormatedDateDiff(registerTime.diff(now))
        : null,
    registerEndsIn =
      pool && isRegisterTime && registerEndTime && registerEndTime.isAfter(now)
        ? getFormatedDateDiff(registerEndTime.diff(now))
        : null,
    fcfsEndsIn = pool && isFcfsTime && !saleEndedAgo ? getFormatedDateDiff(endTime.diff(now)) : null,
      fcfsStartsIn =
      pool && !isFcfsTime && fcfsTime && fcfsTime.utc().isAfter(moment().utc())
        ? getFormatedDateDiff(fcfsTime.diff(now))
        : null,
    registerEndedAgo =
      pool &&
      !isRegisterTime &&
      registerEndTime &&
      registerEndTime.isBefore(now)
        ? getFormatedDateDiff(now.diff(registerEndTime))
        : null;
        

  return {
    isActive,
    isEnded,
    isUpcomming,
    startTime,
    endTime,
    registerTime,
    registerEndTime,
    isRegisterTime,
    fcfsTime,
    isFcfsTime,
    saleLiveIn,
    saleEndsIn,
    saleEndedAgo,
    registerStartsIn,
    registerEndsIn,
    registerEndedAgo,
    saleLiveInSmall,
    fcfsEndsIn,
    fcfsStartsIn,
  };
}
