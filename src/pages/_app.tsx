import '../bootstrap'

import * as React from 'react'
import '../styles/index.css';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/free-brands-svg-icons';
import '@fortawesome/free-regular-svg-icons';
import '@fortawesome/free-solid-svg-icons';
import 'material-design-icons';
import * as plurals from 'make-plural/plurals'
import { remoteLoader } from '@lingui/remote-loader'
import { AppProps } from 'next/app';
import { Web3ReactProvider } from '@web3-react/core';
import Web3ReactManager from '../components/Web3ReactManager';
import dynamic from 'next/dynamic';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import getLibrary from '../functions/getLibrary';
import store, { AppDispatch } from '../state';
import ApplicationUpdater from '../state/application/updater';
import TransactionUpdater from '../state/transactions/updater';
import MulticallUpdater from '../state/multicall/updater';
import UserStateUpdater from '../state/user/updater';
import DefaultLayout from '../layouts/Default';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { nanoid } from '@reduxjs/toolkit'
import { NextComponentType, NextPageContext } from 'next';
import { FunctionComponent, Fragment, useEffect, useMemo } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Aos from 'aos';
import 'aos/dist/aos.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import getDesignSystem from '../theme/index';
import 'react-modal-video/scss/modal-video.scss';
import Header from '../components/Header';
import Footer from '@/components/Footer';
import { useDarkModeManager, useIsDarkMode } from '@/state/user/hooks';
import { useActiveWeb3React } from '@/hooks';
import { useRouter } from 'next/router';
import { updateUserDarkMode } from '@/state/user/actions';
import HandleDexTheme from '@/components/DexThemeHandler/HandleDexTheme';
import { Web3ModalProvider } from '@/connectors/web3Provider';
const Web3ProviderNetwork = dynamic(
  () => import('../components/Web3ProviderNetwork'),
  { ssr: false },
);

const CustomThemeProvider = ({ children }) => {
  const isDarkMode = useIsDarkMode();
  const mode = isDarkMode ? 'dark' : 'light';
  const theme = useMemo(() => createTheme(getDesignSystem(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextComponentType<NextPageContext> & {
    Provider: FunctionComponent;
  };
}) {

  const { pathname, query, locale, asPath } = useRouter()



  const sessionId = nanoid()

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment;
  useEffect(() => {
    Aos.init({ duration: 750 });
  }, []);






  useEffect(() => {
    async function load(locale) {
      i18n.loadLocaleData(locale, { plurals: plurals[locale.split('_')[0]] })

      try {
        // Load messages from AWS, use q session param to get latest version from cache
        const resp = await fetch(`https://d3l928w2mi7nub.cloudfront.net/${locale}.json?q=${sessionId}`)
        const remoteMessages = await resp.json()

        const messages = remoteLoader({ messages: remoteMessages, format: 'minimal' })
        i18n.load(locale, messages)
      } catch {
        // Load fallback messages
        const { messages } = await import(`@lingui/loader!./../../locale/${locale}.json?raw-lingui`)
        i18n.load(locale, messages)
      }

      i18n.activate(locale)
    }

    load(locale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])


  return (

    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Web3ReactManager>
            <Web3ModalProvider>
              <ReduxProvider store={store}>
                <CustomThemeProvider>
                  <Provider>
                    <HandleDexTheme />
                    <ApplicationUpdater />
                    <TransactionUpdater />
                    <MulticallUpdater />
                    <UserStateUpdater />
                    <DefaultLayout>
                      <Header />
                      <Component {...pageProps} />
                      <Footer />
                    </DefaultLayout>
                  </Provider>
                </CustomThemeProvider>
              </ReduxProvider>
            </Web3ModalProvider>
          </Web3ReactManager>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </I18nProvider>

  );
}



