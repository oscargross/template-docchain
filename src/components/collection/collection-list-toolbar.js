import React, { useContext } from 'react'
import { useRouter } from 'next/router';
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
import { Web3Context } from '../../contexts/web3-context';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
export const CollectionsListToolbar = ({ onChangeSearch, handleOpen, sbt,owner }) => {
  const { account } = useContext(Web3Context)
  const router = useRouter()

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

          {sbt ? <>
            <Tooltip title="Back to collections">
              <ArrowBackOutlinedIcon sx={{ mr: 5, fontSize: 30, cursor: 'pointer' }} onClick={() => {router.replace('/collection')}} />
            </Tooltip>
            <>SBTS</>
          </>
            : 'Collections'
          }
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
          <Tooltip title={(sbt && owner !== account) ? "Must be owner to add" : ''}>
            <span>
              <ColorButton
                variant="contained"
                onClick={handleOpen}
                disabled={(sbt && owner !== account) && true}
              >
                Add {sbt ? 'SBT' : 'Collection'}
              </ColorButton>
            </span>
          </Tooltip>
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

