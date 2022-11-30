import React from "react";
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { registerChartJs } from '../utils/register-chart-js';
import { theme } from '../theme';
import { DashboardLayout } from './../components/dashboard-layout';
import { Web3Provider } from "../contexts/web3-context";

const clientSideEmotionCache = createEmotionCache();

export default (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>
            Docchain
          </title>
          <meta
            name="viewport"
            content="initial-scale=1, width=device-width"
          />
        </Head>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <Web3Provider>
              <CssBaseline />
              <DashboardLayout >
                <Component {...pageProps} />
              </DashboardLayout>
            </Web3Provider>
          </ThemeProvider>
        </LocalizationProvider>
      </CacheProvider>

    </>
  );
}
