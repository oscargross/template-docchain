import React, { useEffect, useState, useContext } from 'react';
import { Box, Container, CircularProgress, Alert, Snackbar, Backdrop, Typography, CardContent, Card, Tooltip } from '@mui/material'
import { getSBTsSign, editSBT } from '../services/firebase';
import { Web3Context } from '../contexts/web3-context';
import { useRouter } from 'next/router';
import { claimDoc } from '../utils/ethers';
import { wordsError } from '../utils/converter';
import { SBTsListResults } from '../components/collection/sbts-list-results';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { amber } from '@mui/material/colors';
import { availableChains, hrefTransaction } from '../utils/props';

export default () => {
  const { account, chainId, provider, gasLimit } = useContext(Web3Context)
  const router = useRouter()

  const [sbts, setSbts] = useState([])
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [msgError, setMsgError] = useState()
  const [path, setPath] = useState()
  const [hash, setHash] = useState()

  const getSbts = async () => {
    try {
      const sbts = await getSBTsSign(account, false)
      setSbts(sbts)

    } catch (error) {
      console.log(error.message)
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


  const approve = async (contract, id) => {
    setOpenBackdrop(true);
    setMsgError()
    setPath(id)

    try {

      const transaction = await claimDoc(contract, provider, account, gasLimit)
      setOpenBackdrop(false)
      setHash(transaction?.hash)
      const result = await transaction.wait();

      if (!result.status == 1) throw new Error('Transaction fail')
      await editSBT(id)

      setTimeout(() => {
        getSbts()
      }, 400);

      setHash()
      setOpenSnack(true);
      setPath()

    } catch (error) {
      console.error(error?.message)
      setMsgError(wordsError(error?.message))
      setOpenSnack(true);
      setOpenBackdrop(false)
      setHash()
      setPath()
    }
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
              >Documents awaiting signature
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
            <SBTsListResults sbts={sbts} toSign={true} approve={approve} disableButton={path} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
