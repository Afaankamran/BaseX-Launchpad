import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, BarChart, Bar } from 'recharts'
import { RowBetween, AutoRow } from '../components/Row'

import { toK, toNiceDate, toNiceDateYear, formattedNum, getTimeframe } from './utils'
// import { OptionButton } from '../ButtonStyled'
import { darken } from 'polished'
import { usePairChartData, useHourlyRateData, usePairData } from './contexts/PairData'
import { timeframeOptions } from './constants'
import { useMedia } from 'react-use'
// import { EmptyCard } from '..'
import DropdownSelect from '../components/DropdownSelect'
// import CandleStickChart from './components/CandleChart'
import LocalLoader from './components/LocalLoader'
// import { useDarkModeManager } from '../../contexts/LocalStorage'
import dynamic from 'next/dynamic'
import { useAllPairsInarray, useGlobalData } from './contexts/GlobalData'
import { useActiveWeb3React } from '../hooks'
const CandleStickChart = dynamic(() => import('./components/CandleChart'), {
  ssr: false,
})
const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border-radius: 20px;
  color: #fff;
  height: ${({ height }) => height && height};
`
export const OptionButton = styled.div`
  font-weight: 500;
  width: fit-content;
  white-space: nowrap;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.bg4};
  background-color: ${({ active, theme }) => active && theme.bg3};
  color: #fff;
  font-size: 14px;
  :hover {
    cursor: ${({ disabled }) => !disabled && 'pointer'};
  }
  ${({ active }) =>
    active &&
    `
  background-color:rgb(64, 68, 79);`}
`
const ChartWrapper = styled.div`
  height: 100%;
  max-height: 550px;
  color: #fff;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

const OptionsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 40px;
`

const CHART_VIEW = {
  //   VOLUME: 'Volume',
  //   LIQUIDITY: 'Liquidity',
  RATE0: 'Rate 0',
  RATE1: 'Rate 1',
}

const PairChart = ({ pair, currency0, currency1, color }) => {
  const liquidityAddress = pair?.liquidityToken?.address?.toLowerCase()
  useGlobalData()
  const pairAddresses = useAllPairsInarray()
  const tokens = [currency0?.wrapped?.address?.toLowerCase(), currency1?.wrapped?.address?.toLowerCase()]

  const address =
    pairAddresses.find(
      (pair) => tokens.includes(pair?.token0?.id?.toLowerCase()) && tokens.includes(pair?.token1?.id?.toLowerCase())
    )?.id || liquidityAddress
  const {
    token0,
    token1,
    reserve0,
    reserve1,
    reserveUSD,
    trackedReserveUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    volumeChangeUntracked,
    liquidityChangeUSD,
  } = usePairData(address)
  const base0 = reserve1 / reserve0
  const base1 = reserve0 / reserve1
  const [chartFilter, setChartFilter] = useState(CHART_VIEW.RATE1)

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.MONTH)

  //   const [darkMode] = useDarkModeManager()
  //   const textColor = darkMode ? 'white' : 'black'

  // update the width on a window resize
  const ref = useRef()
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  const [height, setHeight] = useState(ref?.current?.container?.clientHeight)
  useEffect(() => {
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWidth(ref?.current?.container?.clientWidth ?? width)
      setHeight(ref?.current?.container?.clientHeight ?? height)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [height, isClient, width]) // Empty array ensures that effect is only run on mount and unmount
  // get data for pair, and rates
  const pairData = usePairData(address)
  let chartData = usePairChartData(address)
  const hourlyData = useHourlyRateData(address, timeWindow)
  const hourlyRate0 = hourlyData && hourlyData[0]
  const hourlyRate1 = hourlyData && hourlyData[1]

  // formatted symbols for overflow
  const formattedSymbol0 =
    pairData?.token0?.symbol.length > 6 ? pairData?.token0?.symbol.slice(0, 5) + '...' : pairData?.token0?.symbol
  const formattedSymbol1 =
    pairData?.token1?.symbol.length > 6 ? pairData?.token1?.symbol.slice(0, 5) + '...' : pairData?.token1?.symbol

  const below1600 = useMedia('(max-width: 1600px)')
  const below1080 = useMedia('(max-width: 1080px)')
  const below600 = useMedia('(max-width: 600px)')

  let utcStartTime = getTimeframe(timeWindow)
  chartData = chartData?.filter((entry) => entry.date >= utcStartTime)

  if (chartData && chartData.length === 0) {
    return (
      <ChartWrapper>
        <EmptyCard height="300px">No historical data yet.</EmptyCard>{' '}
      </ChartWrapper>
    )
  }

  /**
   * Used to format values on chart on scroll
   * Needs to be raw html for chart API to parse styles
   * @param {*} val
   */
  function valueFormatter(val) {
    if (chartFilter === CHART_VIEW.RATE0) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol1}/${formattedSymbol0}<span>`
      )
    }
    if (chartFilter === CHART_VIEW.RATE1) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol0}/${formattedSymbol1}<span>`
      )
    }
  }

  const aspect = below1080 ? 60 / 20 : below1600 ? 60 / 28 : 60 / 22

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <DropdownSelect options={CHART_VIEW} active={chartFilter} setActive={setChartFilter} color={color} />
          <DropdownSelect options={timeframeOptions} active={timeWindow} setActive={setTimeWindow} color={color} />
        </RowBetween>
      ) : (
        <OptionsRow>
          <AutoRow gap="6px" style={{ flexWrap: 'nowrap' }}>
            {/* <OptionButton
              active={chartFilter === CHART_VIEW.LIQUIDITY}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME)
                setChartFilter(CHART_VIEW.LIQUIDITY)
              }}
            >
              Liquidity
            </OptionButton>
            <OptionButton
              active={chartFilter === CHART_VIEW.VOLUME}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME)
                setChartFilter(CHART_VIEW.VOLUME)
              }}
            >
              Volume
            </OptionButton> */}
            <OptionButton
              className={
                chartFilter === CHART_VIEW.RATE0
                  ? 'bg-gradient-to-r from-opaque-blue to-opaque-pink hover:from-blue hover:to-pink'
                  : ''
              }
              active={chartFilter === CHART_VIEW.RATE0}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK)
                setChartFilter(CHART_VIEW.RATE0)
              }}
            >
              {pairData.token0 ? formattedSymbol1 + '/' + formattedSymbol0 : '-'}
            </OptionButton>
            <OptionButton
              active={chartFilter === CHART_VIEW.RATE1}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK)
                setChartFilter(CHART_VIEW.RATE1)
              }}
            >
              {pairData.token0 ? formattedSymbol0 + '/' + formattedSymbol1 : '-'}
            </OptionButton>
          </AutoRow>
          <AutoRow justify="flex-end" gap="6px">
            <OptionButton
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
            >
              All
            </OptionButton>
          </AutoRow>
        </OptionsRow>
      )}
      <div className="flex items-center w-full h-full" style={{ maxHeight: '300px' }}>
        {chartFilter === CHART_VIEW.RATE1 &&
          (hourlyRate1 ? (
            <ResponsiveContainer aspect={aspect} ref={ref} className="flex items-center">
              <CandleStickChart
                data={hourlyRate1}
                base={base0}
                margin={false}
                width={width}
                valueFormatter={valueFormatter}
              />
            </ResponsiveContainer>
          ) : (
            <LocalLoader />
          ))}

        {chartFilter === CHART_VIEW.RATE0 &&
          (hourlyRate0 ? (
            <ResponsiveContainer aspect={aspect} ref={ref} className="flex items-center">
              <CandleStickChart
                data={hourlyRate0}
                base={base1}
                margin={false}
                width={width}
                valueFormatter={valueFormatter}
              />
            </ResponsiveContainer>
          ) : (
            <LocalLoader />
          ))}
      </div>
    </ChartWrapper>
  )
}

export default PairChart
