import React, { useEffect, useState, useContext } from 'react';
import CardSBT from '../components/CardSBT';
import { Box, Container, Grid, CircularProgress, Alert, Snackbar, Backdrop, Typography, CardContent, Card, Tooltip, Paper, TextField, InputAdornment, SvgIcon } from '@mui/material'
import { getSBTs, addSBT, editCollection, getSBTsSign, getCollections, getNameByAddr } from '../services/firebase';
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
import { Search as SearchIcon } from '../icons/search'
import { CollectionsListResults } from '../components/collection/collection-list-results';


export default () => {
  const router = useRouter()
  const [collections, setCollections] = useState([])
  const [sbts, setSbts] = useState([])
  const [name, setName] = useState(undefined)
  const [addr, setAddr] = useState()
  const [recipient, setRecipient] = useState()
  const [msgError, setMsgError] = useState()
  const [contractSBT, setContractSBT] = useState()
  const [loading, setLoading] = useState(false)
  const [errorSearch, setErrorSearch] = useState(false)

  const getCollectionsAndSbts = async (addr) => {
    try {
      const sbts = await getSBTsSign(addr, true)
      const collections = await getCollections(addr)
      const nameAddr = await getNameByAddr(addr)
      setName(nameAddr)
      setSbts(sbts)
      setCollections(collections)
      setLoading(false)
      setAddr(addr)

    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
  }, [])

  const onChangeSearch = ({ target: { value } }) => {
    console.log(addr, value)
    if (ethers.utils.isAddress(value)) {
      if (addr?.toLowerCase().trim() !== value.toLowerCase().trim()) {
        setErrorSearch(false)
        setLoading(true)
        getCollectionsAndSbts(value)
      } else setErrorSearch(false)
    } else {
      setErrorSearch(true)
    }
  }
  const WarnDoNotHaveFile = ({textMessage}) => (
    <Paper sx={{ padding: '25px', minWidth: '700px', margin: '20px auto', backgroundColor:'#F3F3E3'}} elevation={4}>
      <Typography
        sx={{
          textAlign: 'center'
        }}
        variant="h6"
      > {`${name ? name : addr.slice(0, 7) + '. . .'+ addr.slice(-4)} ${textMessage}`}
      </Typography>

    </Paper>
  )
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 6,
        }}
      >
        <Container maxWidth={false}>
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
            >           Find a profile
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ maxWidth: 500 }}>
                  <TextField
                    disabled={loading && true}
                    error={errorSearch && true}
                    helperText={errorSearch ? "Invalid address" : ""}
                    onChange={onChangeSearch}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {loading
                            ?
                            <CircularProgress
                              size='30px'
                              sx={{
                                alignSelf: 'center',
                                color: 'black'
                              }} />
                            :
                            <SvgIcon
                              color="action"
                              fontSize="small"
                            >
                              <SearchIcon />
                            </SvgIcon>
                          }
                        </InputAdornment>
                      )
                    }}
                    placeholder="Enter wallet address"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
          {addr &&
            <Box sx={{ mt: 3 }}>
              <Paper sx={{ padding: '16px', minWidth: '700px', backgroundColor: amber[400]}} elevation={3}>
                <Typography
                  sx={{
                    textAlign: 'center', textDecorationLine: 'underline',
                    fontStyle: 'italic'
                  }}
                  variant="h5"
                > {name ? `${name} => ${addr}` : addr}
                </Typography>

              </Paper>
              {sbts.length > 0 ?
                <>
                  <Box
                    sx={{
                      margin: '20px auto'
                    }}>
                    <Typography
                      sx={{ m: 1 }}
                      variant="h5"
                    > It&apos;s SBTs
                    </Typography>
                    <Typography
                      sx={{ m: 1 }}
                      variant="h6"
                    >
                      These are the documents that {name ? name : addr} approved to receive in his profile:
                    </Typography>
                  </Box>

                  <SBTsListResults sbts={sbts} profile={true} />
                </>
                : <WarnDoNotHaveFile textMessage="still don't have documents received and approved in it's profile" />
              }
              {collections.length > 0 ?
                <>
                  <Box
                    sx={{
                      margin: '20px auto'
                    }}>

                    <Typography
                      sx={{ m: 1 }}
                      variant="h5"
                    > It&apos;s Collections
                    </Typography>
                    <Typography
                      sx={{ m: 1 }}
                      variant="h6"
                    >
                      These are the collections that {name ? name : addr} has been created:
                    </Typography>
                  </Box>
                  <CollectionsListResults collections={collections} />
                </>
                : <WarnDoNotHaveFile textMessage="haven't created any document collections yet" />
              }
            </Box>
          }
        </Container>
      </Box>
    </>
  );
};



