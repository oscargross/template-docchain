import React, { useEffect, useState, useContext } from 'react';
import { Box, Container, CircularProgress, Alert, Snackbar, Backdrop, Typography, CardContent, Card, Tooltip } from '@mui/material'
import { getSBTsSign } from '../services/firebase';
import { Web3Context } from '../contexts/web3-context';
import { SBTsListResults } from '../components/collection/sbts-list-results';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { amber } from '@mui/material/colors';
import { availableChains, hrefTransaction } from '../utils/props';

export default () => {
  const { account, chainId } = useContext(Web3Context)

  const [sbts, setSbts] = useState([])
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [msgError, setMsgError] = useState()
  const [path, setPath] = useState()
  const [hash, setHash] = useState()

  const getSbts = async () => {
    try {
      const sbts = await getSBTsSign(account, true)
      setSbts(sbts)

    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    getSbts()
  }, [chainId, account])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  }


  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={() => setOpenBackdrop(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={openSnack}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {msgError ? <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>{msgError}</Alert>
          : <Alert severity="success" onClose={handleClose} sx={{ width: '100%' }} >Successful transaction</Alert>
        }
      </Snackbar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 6,
        }}
      >
        <Container maxWidth={false}>
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
                variant="h5"
              >My documents
              </Typography>
            </Box>
          </Box>
          {
            hash && <Box sx={{ mt: 3, width: 'fit-content', }} >
              <Card sx={{ backgroundColor: amber[400] }}>
                <Typography
                  sx={{ m: 3 }}
                  variant="p"
                >
                  The transaction is running...
                </Typography>
                <CardContent sx={{
                  display: 'flex',
                  backgroundColor: amber[700]
                }}>
                  <CircularProgress
                    sx={{
                      marginRight: '20px',
                      alignSelf: 'center',
                      color: 'black'
                    }} />
                  <Box
                    sx={{
                      display: 'grid',
                      textAlign: 'center'
                    }}>
                    <Typography
                      variant="p"
                      sx={{
                        mb: 1,
                        cursor: 'pointer'
                      }}
                    >
                      SBT: <a href={`https://ipfs.io/ipfs/${path}`} rel="noopener noreferrer" target={'_blank'}>{path.slice(0, 7) + '...'}</a>
                    </Typography>
                    <Typography
                      sx={{ display: 'flex' }}
                      variant="p"
                    >
                      Rede {availableChains[chainId]}
                      <Tooltip title={'Click to access transaction'} >
                        <a href={hrefTransaction[chainId] + hash} rel="noopener noreferrer" target='_blank'>
                          <Box
                            sx={{ marginLeft: '10px' }} >
                            <OpenInNewIcon
                              sx={{ color: 'black' }} />
                          </Box>
                        </a>
                      </Tooltip>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          }
          <Box sx={{ mt: 3 }}>
            <SBTsListResults sbts={sbts} profile={true}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};
