import React, { useContext } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography, Tooltip
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import { ColorButton } from './../ConnectButton';
import { amber, grey } from '@mui/material/colors';

export const CollectionsListToolbar = ({ onChangeSearch, handleOpen, sbt }) => {

  return (
    <Box >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          {sbt ? 'SBTS' : 'Collections'}
        </Typography>
        <Box sx={{ m: 1 }}>
          <Tooltip title="Function in development">

            <Button

              startIcon={(<UploadIcon fontSize="small" />)}
              sx={{ mr: 1, color: grey[800] }}
            >
              Import
            </Button>
          </Tooltip>
          <Tooltip title="Function in development">

            <Button
              startIcon={(<DownloadIcon fontSize="small" />)}
             sx={{ mr: 1, color: grey[800] }}
            >
              Export
            </Button>
          </Tooltip>

          <ColorButton
            variant="contained"
            onClick={handleOpen}
          >
            Add {sbt ? 'SBT' : 'Collection'}
          </ColorButton>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                onChange={onChangeSearch}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        color="action"
                        fontSize="small"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

