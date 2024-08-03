import React from 'react'
import { winnerList } from './constant'
import { Box, Card } from '@mui/material'
import { copyToClipBoard, shortenAddress } from '@/functions'
import { shortenHash } from '../../functions/format'
import { useIsDarkMode } from '@/state/user/hooks'

const WinnerList = () => {
  const isDarkMode = useIsDarkMode()
  return (

    <Box sx={{
      // height: '100%',
      // height: '800px',
      // overflowY: 'auto'
    }}>

      <Box
        sx={{
          padding: '1.5px',
          background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
          // boxShadow: ' 0px 0px 50px rgba(255, 78, 78, 0.63)',
          zIndex: -1,
        }}
      >
        <Box

          sx={{
            zIndex: -1,
            background: (isDarkMode) ? "#000" : '#fff',
            borderRadius: 0,

          }}
        >

          <Card sx={{
            zIndex: 1,
            // background: (isDarkMode) ? "#000" : '#fff',
            background: 'linear-gradient(90deg, rgba(255, 62, 61, 0.05) 10%, rgba(70, 109, 253, 0.05) 100%)',
            borderRadius: 0,
            padding: '2rem '

          }}>

            {/* list */}
            <div>
              <div className="flex justify-center md:justify-around items-start  flex-wrap gap-2 ">
                {winnerList.map((winner, index) => {
                  return <ListHolder winner={winner} key={index} />
                })}
              </div>

            </div>
          </Card>
        </Box>

      </Box >
    </Box >


  )
}

export default WinnerList


const ListHolder = ({ winner }) => {

  return (<>
    <div>
      {winner.map((list, index) => {
        return (
          <a href={`https://arbiscan.io/address/${list.address}`} target="_blank">
            <div key={index} className='flex  justify-center md:justify-start items-center flex-col md:flex-row space-y-1'>
              <div className='cursor-pointer' title="Go to explorer" onClick={() => copyToClipBoard(list.address)}>{shortenHash(list.address)} {" "}</div>
              <div>
                - ETH {list.ethValue}
              </div>
            </div>
          </a>
        )
      })}
    </div>
  </>)
}