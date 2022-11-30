import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { Box, Container, Card, Typography, CardContent, Tooltip, CircularProgress, Snackbar, Alert, Backdrop } from '@mui/material';
import { CollectionsListResults } from '../components/collection/collection-list-results';
import { CollectionsListToolbar } from '../components/collection/collection-list-toolbar';
import ModalNewCollection from '../components/collection/collection-modal-new'
import { Web3Context } from '../contexts/web3-context';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { availableChains, hrefTransaction } from '../utils/props';
import { amber } from '@mui/material/colors';
import { wordsError } from '../utils/converter';
import { getContractBase } from '../utils/ethers';

import { getCollections, addCollection } from './../services/firebase';
export default () => {
  const { account, chainId, provider, contractBase, gasLimit } = useContext(Web3Context)
  const [collectionsRender, setCollectionsRender] = useState([])
  const [open, setOpen] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [msgError, setMsgError] = useState()
  const [collections, setCollections] = useState([])
  const [name, setName] = useState()
  const [hash, setHash] = useState()
  const [check, setCheck] = useState(false)

  const handleOpen = () => setOpen(!open);


  const getCollec = async () => {
    try {
      // const aa = await getContractBase(chainId, provider)
      // const vv = await aa.getCollectionsOfOwner(account)
      // console.log(vv)
      const collections = await getCollections(account)
      setCollections(collections)
      setCollectionsRender(collections)
    } catch (error) {
      setMsgError(wordsError(error?.message))
    }
  }

  useEffect(() => {
    getCollec()
  }, [chainId, account])


  const onChangeSearch = ({ target: { value } }) => setCollectionsRender(collections.filter(c => (c.name.toLowerCase()).includes(value.toLowerCase())))

  const createCollection = async () => {
    setOpen(false)
    setOpenBackdrop(true);
    setMsgError()
 
    try {
      const newCollection = await contractBase.createNewCollection(name, {
        gasLimit
      })

      const transaction = await provider.getTransaction(newCollection?.hash)

      setOpenBackdrop(false)
      setHash(newCollection?.hash)
      setOpen(false)
      const result = await transaction.wait();
      if (!result.status == 1) throw new Error('Transaction fail')

      const newCollections = await contractBase.getCollectionsOfOwner(account)
      const newAddressCollection = newCollections.filter(c => !collections.map(c => c.id).includes(c))[0]

      await addCollection(newAddressCollection, {
        name: name,
        owner: account,
        sbts: Number(0),
        date: new Date(Date.now()).toLocaleString().split(',')[0]
      })

      setTimeout(() => {
        getCollec()
      }, 400);

      setHash()
      setOpenSnack(true);
    } catch (error) {
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
      <Head>
        <title>
          Collections
        </title>
      </Head>
      <ModalNewCollection
        setCheck={setCheck}
        create={createCollection}
        handleOpen={handleOpen}
        open={open}
        field={name}
        setField={setName} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 6,
        }}
      >
        <Container maxWidth={false}>
          <CollectionsListToolbar onChangeSearch={onChangeSearch} handleOpen={handleOpen} />
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
                      Collection: {name}
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
            <CollectionsListResults collections={collectionsRender} />
          </Box>
        </Container>
      </Box>
    </>
  );
};
