import React from 'react';
import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { SettingsNotifications } from '../components/settings/settings-notifications';
import SettingsIdentification from '../components/settings/SettingsIdentification';

export default () => (
  <>
    <Head>
      <title>
        Settings
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{ mb: 3 }}
          variant="h4"
        >
          Settings
        </Typography>
        <SettingsNotifications />
        <Box sx={{ pt: 3 }}>
          <SettingsIdentification />
        </Box>
      </Container>
    </Box>
  </>
)

