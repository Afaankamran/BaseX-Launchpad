import { classNames, formatNumber, formatPercent } from '../../functions'

import { Disclosure } from '@headlessui/react'
import DoubleLogo from '../../components/DoubleLogo'
import FarmListItemDetails from './FarmListItemDetails'
import Image from '../../components/Image'
import { Chef, PairType } from './enum'
import React from 'react'
import { useCurrency } from '../../hooks/Tokens'
import QuestionHelper from '../../components/QuestionHelper'
import CurrencyLogo from '../../components/CurrencyLogo'

const FarmListItem = ({ farm, ...rest }) => {
  const token0 = useCurrency(farm?.pair?.token0?.id)
  const token1 = useCurrency(farm?.pair?.token1?.id)
  const token = useCurrency(farm?.pair?.token?.address)
  const isStaticFarm = farm.chef == Chef.MASTERCHEF_STATIC
  const isNFTStake = farm.chef == Chef.MASTERCHEF_ARRAY_NFT
  const isPairNft = farm.chef == Chef.MASTERCHEF_PAIR_NFT

  const nftMax = farm?.nftRewards?.[0]?.maxSupply ? Number(farm?.nftRewards[0]?.maxSupply) : 0
  const rewardDebted = farm?.pool?.rewardDebted ? Number(farm?.pool?.rewardDebted) : 0
  const remainingPercentage = (rewardDebted / nftMax) * 100
  return (
    <Disclosure {...rest}>
      {({ open }) => (
        <div
          className={open && 'p-[2px] border-gradient-r-blue-pink-dark-800 border-2 border-transparent rounded-[15px] '}
        >
          <div>
            <Disclosure.Button
              className={classNames(
                open && `rounded-b-none border-b-0 bg-light-gradient  `,

                `w-full px-4 py-2 pb-4 text-left rounded-[15px] cursor-pointer select-none bg-dark-900 text-primary text-sm md:text-lg ${!open && ' border border-border-color'
                }`
              )}
            >
              <div className="grid grid-cols-4 text-center">
                <div className="flex flex-col col-span-2  md:col-span-1">
                  <h4 className="text-secondary ml-[6px] mb-1  text-[14px] text-left">Name</h4>
                  <div className="flex space-x-3 justify-start items-center">
                    <div>
                      {isStaticFarm || isNFTStake ? (
                        <div className="">
                          <CurrencyLogo currency={token} size={20} />
                        </div>
                      ) : (
                        <DoubleLogo currency0={token0} currency1={token1} size={20} />
                      )}
                    </div>
                    <div className="flex flex-col justify-center text-[16px]">
                      <div>
                        {isStaticFarm || isNFTStake ? (
                          <span className="font-bold">{token?.symbol}</span>
                        ) : (
                          <>
                            <span className="font-bold ">{farm?.pair?.token0?.symbol}</span>/
                            <span className={farm?.pair?.type === PairType.KASHI ? 'font-thin' : 'font-bold'}>
                              {farm?.pair?.token1?.symbol}
                            </span>
                          </>
                        )}
                      </div>
                      {/* {farm?.pair?.type === PairType.SWAP && (
                      <div className="text-xs md:text-base text-secondary">BASEX Farm</div>
                    )}
                    {farm?.pair?.type === PairType.KASHI && (
                      <div className="text-xs md:text-base text-secondary">Kashi Farm</div>
                    )} */}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-secondary   text-[14px]">TVL</h4>
                  <div className="flex flex-col justify-center font-bold text-[16px]">
                    {formatNumber(farm.tvl, true)}
                  </div>
                </div>

                <div>
                  <h4 className="text-secondary text-center   text-[14px]">APR</h4>

                  {!isNFTStake && !isPairNft && (
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex flex-row items-center font-bold text-right text-high-emphesis">
                        {farm.chef === Chef.MASTERCHEF_STATIC ? (
                          <>{farm.rewardAPY}%</>
                        ) : (
                          <>
                            {farm?.tvl !== 0
                              ? farm?.roiPerYear > 10000
                                ? '>10,000%'
                                : formatPercent(farm?.roiPerYear * 100)
                              : 'Infinite'}
                            {!!farm?.feeApyPerYear && (
                              <QuestionHelper
                                text={
                                  <div className="flex flex-col">
                                    <div>
                                      Reward APR:{' '}
                                      {farm?.tvl !== 0
                                        ? farm?.rewardAprPerYear > 10000
                                          ? '>10,000%'
                                          : formatPercent(farm?.rewardAprPerYear * 100)
                                        : 'Infinite'}
                                    </div>
                                    <div>
                                      Fee APY:{' '}
                                      {farm?.feeApyPerYear < 10000
                                        ? formatPercent(farm?.feeApyPerYear * 100)
                                        : '>10,000%'}
                                    </div>
                                  </div>
                                }
                              />
                            )}
                          </>
                        )}
                      </div>
                      {farm.chef === Chef.MASTERCHEF_STATIC ? (
                        <div className="text-xs text-right md:text-base text-secondary">{farm.durationOfPool} days</div>
                      ) : (
                        ''
                        // <div className="text-xs text-right md:text-base text-secondary">annualized</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <h4 className="text-secondary   text-[14px]">Reward</h4>

                  {isNFTStake || isPairNft ? (
                    <div className="h-full flex items-center">
                      <div className="flex flex-col w-full">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-blue h-2.5 rounded-full"
                            style={{ width: remainingPercentage + '%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <p>
                            {rewardDebted} {farm?.nftRewards[0]?.symbol}
                          </p>
                          <p>
                            {nftMax} {farm?.nftRewards[0]?.symbol}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-row items-center justify-center hidden space-x-4 md:flex">
                      <div className="flex items-center space-x-2">
                        {farm?.rewards?.map((reward, i) => (
                          <div key={i} className="flex items-center">
                            <div className="p-1 rounded-full bg-linear-gradient">
                              <Image
                                src={reward.icon}
                                width="20px"
                                height="20px"
                                className="rounded-full"
                                layout="fixed"
                                alt={reward.token}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col space-y-1">
                        {farm?.rewards?.map((reward, i) => (
                          <div key={i} className="text-xs md:text-sm whitespace-nowrap">
                            {formatNumber(reward.rewardPerDay)} {reward.token} / DAY
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Disclosure.Button>

            {open && <FarmListItemDetails farm={farm} />}
          </div>
        </div>
      )}
    </Disclosure>
  )
}

export default FarmListItem
