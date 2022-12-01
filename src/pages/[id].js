import React, { useEffect, useState, useContext } from 'react';
import CardSBT from '../components/CardSBT';
import { Box, Container, Grid, CircularProgress, Alert, Snackbar, Backdrop, Typography, CardContent, Card, Tooltip } from '@mui/material'
import { getSBTs, addSBT, editCollection } from '../services/firebase';
import { Web3Context } from '../contexts/web3-context';
import { useRouter } from 'next/router';
import { getContract } from '../utils/ethers';
import { CollectionsListToolbar } from '../components/collection/collection-list-toolbar';
import ModalNewCollection from '../components/collection/collection-modal-new'
import { addIPFS, getFee } from '../utils/ethers';
import { ethers } from 'ethers';
import { wordsError } from '../utils/converter';
import { SBTsListResults } from '../components/collection/sbts-list-results';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { amber } from '@mui/material/colors';
import { availableChains, hrefTransaction } from '../utils/props';

export default () => {
  const { account, chainId, provider, contractBase, gasLimit } = useContext(Web3Context)
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [sbts, setSbts] = useState([])
  const [recipient, setRecipient] = useState()
  const [file, setFile] = useState();
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [msgError, setMsgError] = useState()
  const [contractSBT, setContractSBT] = useState()
  const [fee, setFee] = useState()
  const [owner, setOwner] = useState()
  const [hash, setHash] = useState()
  const [check, setCheck] = useState(false)

  const handleChangeFile = (file) => {
    setFile(file);
  };

  const getSbts = async () => {
    try {

      const contract = await getContract({addr: router.query.id, provider})
      setContractSBT(contract)
      const sbts = await getSBTs(router.query.id)
      setSbts(sbts)

    } catch (error) {
      console.error(error.message)
    }
  }

  const setValidRecipient = (addr) => {

    ethers.utils.isAddress(addr) ? setRecipient(addr) : setRecipient()

  }

  const setOwnerCollection = async () => {
    const owner = await contractBase.ownerOfCollection(router.query.id)
    setOwner(owner)
  }

  useEffect(() => {
    setOwnerCollection()
    getSbts()
  }, [chainId, account])

  const onChangeSearch = ({ target: { value } }) => setCollectionsRender(collections.filter(c => (c.name.toLowerCase()).includes(value.toLowerCase())))

  const handleOpen = async () => {
    if (!open && !fee) {
      const feeNow = await getFee(chainId, provider)
      setFee(feeNow)
    }

    setOpen(!open);
  }

  const createSBT = async () => {
    setOpen(false)
    setOpenBackdrop(true);
    setMsgError()
    try {

      const weiValue = await provider.getBalance(account)
      if (Number(ethers.utils.formatEther(weiValue)) < Number(ethers.utils.formatEther(fee))) throw Error('Insuficient Funds')

      const path = await addIPFS(file)
      const transactionDocIssued = await contractSBT.issueDegree(`https://ipfs.io/ipfs/${path}`, recipient, {
        value: String(Number(fee) + 20),
        gasLimit
      })
      const transaction = await provider.getTransaction(transactionDocIssued?.hash)

      setOpenBackdrop(false)
      setHash(transactionDocIssued?.hash)
      setOpen(false)
      const result = await transaction.wait();

      if (!result.status == 1) throw new Error('Transaction fail')

      await addSBT(path, {
        contract: router.query.id,
        recipient: recipient,
        date: new Date(Date.now()).toLocaleString().split(',')[0],
        accepted: false
      })
      await editCollection(router.query.id, sbts.length+1)

      setTimeout(() => {
        getSbts()
      }, 400);

      setHash()
      setOpenSnack(true);

    } catch (error) {
      console.error(error?.message)
      setMsgError(wordsError(error?.message))
      setOpenSnack(true);
      setOpen(false)
      setOpenBackdrop(false)
      setHash()
    }
  }

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

      <ModalNewCollection
        fee={fee && ethers.utils.formatEther(fee)}
        create={createSBT}
        handleChangeFile={handleChangeFile}
        handleOpen={handleOpen}
        open={open}
        sbt={true}
        field={recipient}
        setField={setValidRecipient}
        file={file}
        setCheck={setCheck}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 6,
        }}
      >

        <Container maxWidth={false}>
          <CollectionsListToolbar sbt={true} owner={owner} onChangeSearch={onChangeSearch} handleOpen={handleOpen} />
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
                      sx={{ mb: 1 }}
                      variant="p"
                    >
                      Recipient: {recipient}
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
            <SBTsListResults sbts={sbts} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
