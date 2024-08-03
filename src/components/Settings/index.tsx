import { ChainId, Percent } from '@devdot/basex-sdk'
import React, { useRef, useState } from 'react'
import {
  useExpertModeManager,
  useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserTransactionTTL,
} from '../../state/user/hooks'
import { useModalOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import AdjustmentsIcon from '../../../public/adjustmentsIcon.svg'
import { RiMenuAddLine } from "react-icons/ri";


// import { AdjustmentsIcon } from '@heroicons/react/outline'
import { ApplicationModal } from '../../state/application/actions'
import Button from '../Button'
import Modal from '../Modal'
import ModalHeader from '../ModalHeader'
import QuestionHelper from '../QuestionHelper'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'
import Typography from '../Typography'
import { t } from '@lingui/macro'
import { useActiveWeb3React } from '../../hooks'
import { useLingui } from '@lingui/react'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import Image from 'next/image'

export default function SettingsTab({ placeholderSlippage }: { placeholderSlippage?: Percent }) {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>(null)
  const open = useModalOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  const [ttl, setTtl] = useUserTransactionTTL()

  const [userUseArcher, setUserUseArcher] = useUserArcherUseRelay()

  return (
    <div className="relative flex" ref={node}>
      <div
        className="flex items-center bg-red-400 bg-[#466dfd1a] border border-border-color justify-center p-3 rounded-[6px] cursor-pointer"
        onClick={toggle}
        id="open-settings-dialog-button"
      >
        <RiMenuAddLine size={20} />

        {/* <Image src={AdjustmentsIcon} /> */}
        {/* <AdjustmentsIcon className="w-[26px] h-[26px] transform rotate-90" /> */}
      </div>
      {open && (
        <div className="absolute top-[50px] right-1 w-80 sm:w-[600px] z-50 -mr-2.5  md:-mr-5 bg-[#18192B] border-2 border-border-color rounded  shadow-lg">
          <div className="p-4 space-y-4">
            <Typography weight={700} className="text-high-emphesis">
              {i18n._(t`Transaction Settings`)}
            </Typography>

            <TransactionSettings placeholderSlippage={placeholderSlippage} />
            <div className="w-full h-[1px] bg-gradient-3 opacity-50 my-[2rem]"></div>
            <Typography className="text-high-emphesis" weight={700}>
              {i18n._(t`Interface Settings`)}
            </Typography>

            <div className="flex items-center justify-between">
              <div className="flex items-center !relative">
                <Typography variant="sm" className="text-primary">
                  {i18n._(t`Toggle Expert Mode`)}
                </Typography>
                <QuestionHelper
                  text={i18n._(t`Bypasses confirmation modals and allows high slippage trades. Use at your own risk.`)}
                />
              </div>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                      toggleExpertMode()
                      setShowConfirmation(false)
                    }
                    : () => {
                      toggle()
                      setShowConfirmation(true)
                    }
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Typography variant="sm" className="text-primary">
                  {i18n._(t`Disable Multihops`)}
                </Typography>
                <QuestionHelper text={i18n._(t`Restricts swaps to direct pairs only.`)} />
              </div>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
              />
            </div>
            {/* {chainId == ChainId.MAINNET && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Typography variant="sm" className="text-primary">
                    {i18n._(t`MEV Shield by Archer DAO`)}
                  </Typography>
                  <QuestionHelper
                    text={i18n._(
                      t`Send transaction privately to avoid front-running and sandwich attacks. Requires a miner tip to incentivize miners`
                    )}
                  />
                </div>
                <Toggle
                  id="toggle-use-archer"
                  isActive={userUseArcher}
                  toggle={() => setUserUseArcher(!userUseArcher)}
                />
              </div>
            )} */}
          </div>
        </div>
      )}

      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)}>
        <div className="space-y-4">
          <ModalHeader title={i18n._(t`Are you sure?`)} onClose={() => setShowConfirmation(false)} />
          <Typography variant="lg">
            {i18n._(t`Expert mode turns off the confirm transaction prompt and allows high slippage trades
                                that often result in bad rates and lost funds.`)}
          </Typography>
          <Typography variant="sm" className="font-medium">
            {i18n._(t`ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.`)}
          </Typography>
          <Button
            color="red"
            size="lg"
            onClick={() => {
              // if (window.prompt(i18n._(t`Please type the word "confirm" to enable expert mode.`)) === 'confirm') {
              //   toggleExpertMode()
              //   setShowConfirmation(false)
              // }
              toggleExpertMode()
              setShowConfirmation(false)
            }}
          >
            <Typography variant="lg" id="confirm-expert-mode">
              {i18n._(t`Turn On Expert Mode`)}
            </Typography>
          </Button>
        </div>
      </Modal>
    </div>
  )
}
