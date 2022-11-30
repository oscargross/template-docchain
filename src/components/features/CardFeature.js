import React from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';

export default ({ text, text2,label }) => (
  <Card sx={{ mt: 4 }}>
    <CardHeader
      subheader=""
      title={label}
    />
    <Divider />
    <CardContent>
      <Typography
        color="inherit"
        variant="subtitle1"
        sx={{mb:4}}>
        {text}
      </Typography>
      <Typography
        color="inherit"
        variant="subtitle2">
        {text2}
      </Typography>
    </CardContent>
    <Divider />
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
    </Box>
  </Card>
)