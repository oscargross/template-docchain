import React, { useEffect, useState, useContext } from 'react';
import CardSBT from '../components/CardSBT';
import { Box, Container, Grid, CircularProgress, Alert, Snackbar, Backdrop } from '@mui/material'
import { getSBT, newRegister, editRegister, deleteRegister } from '../services/firebase';
import { Web3Context } from '../contexts/web3-context';
import { useRouter } from 'next/router';
import { getContract } from '../utils/ethers';
import SBT from '../../artifacts/contracts/Docchain.sol/SBT.json'
import { CollectionsListToolbar } from '../components/collection/collection-list-toolbar';
import ModalNewCollection from '../components/collection/collection-modal-new'
import { addIPFS, getFee } from '../utils/ethers';
import { ethers } from 'ethers';
export default () => {
  const { account, chainId, provider } = useContext(Web3Context)
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [sbts, setSbts] = useState([])
  const [recipient, setRecipient] = useState([])
  const [file, setFile] = useState();
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [msgError, setMsgError] = useState()
  const [contractSBT, setContractSBT] = useState()
  const handleChangeFile = (file) => {
    setFile(file);
  };

  const getSbts = async () => {
    try {

      const contract = await getContract(router.query.id, SBT.abi, provider)
      setContractSBT(contract)

      const sbts = await contract.getListOwners()
      // console.log(sbts)
    } catch (error) {
      console.log(error)
    }
  }

  const setValidRecipient = (addr) => {

    ethers.utils.isAddress(addr) ? setRecipient(addr) : setRecipient()

  }

  useEffect(() => {
    getSbts()
  }, [])

  const onChangeSearch = ({ target: { value } }) => setCollectionsRender(collections.filter(c => (c.name.toLowerCase()).includes(value.toLowerCase())))

  const handleOpen = () => setOpen(!open);


  const createSBT = async () => {
    try {
      const getFeeNow = await getFee(chainId, provider)
      const path = await addIPFS(file)
      // console.log(path, recipient)
      // const path = ''
      const transactionDocIssued = await contractSBT.issueDegree(`https://ipfs.io/ipfs/${path}`, recipient, {
        value: ethers.BigNumber.from(getFeeNow),
        // gasLimit: 1 * 10 ** 6
      })




    } catch (error) {
      console.log(error.message)
      setMsgError()
    }
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
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

      <ModalNewCollection create={createSBT} handleChangeFile={handleChangeFile} handleOpen={handleOpen} open={open} sbt={true} field={recipient} setField={setValidRecipient} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 6,
        }}
      >

        <Container maxWidth={false}>
          <CollectionsListToolbar sbt={true} onChangeSearch={onChangeSearch} handleOpen={handleOpen} />
          <Box sx={{
            flexGrow: 1, marginTop: 10, marginLeft: '7%'
          }}>
            <Grid container spacing={{ xs: 7, sm: 7, md: 7 }} columns={{ xs: 8, sm: 8, md: 8 }} >
              <Grid item>
                <CardSBT sbt={'sbt'} />
              </Grid>
              <Grid item>
                <CardSBT sbt={'sbt'} />
              </Grid>
              <Grid item>
                <CardSBT sbt={'sbt'} />
              </Grid>
              <Grid item>
                <CardSBT sbt={'sbt'} />
              </Grid>
              <Grid item>
                <CardSBT sbt={'sbt'} />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};
