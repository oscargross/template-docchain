import React, { useContext, useEffect, useState } from 'react'
import { green } from '@mui/material/colors';
import { Tooltip, Snackbar, Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Web3Context } from './../contexts/web3-context';
import { styled } from '@mui/material/styles';
import { amber } from '@mui/material/colors';
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { providerOptions } from './../services/providerOptions';
import { toHex } from './../utils/converter';
import { networkParams } from './../services/networks';
import { availableChains } from '../utils/props';
import { getContractBase } from '../utils/ethers';


export const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(amber[700]),
  backgroundColor: amber[700],
  '&:hover': {
    backgroundColor: amber[400],
  },
}));

let web3Modal
export default function ConnectWeb3() {

  const { setProps, unsetProps, provider, account, chainId, connection, setContractBase } = useContext(Web3Context)
  const [error, setError] = useState("");
  const [chainNameTemp, setChainNameTemp] = useState('')
  const [open, setOpen] = useState(false);

  const connectWallet = async () => {
    try {
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const network = await provider.getNetwork();
      const accounts = await provider.listAccounts();
      await setProps({ connection, provider, accounts, network })
      if (!Object.keys(availableChains).includes(network.chainId.toString())) {
        setChainNameTemp(network?.name)
        setError('Network not available!');
        setOpen(true)
      } else {

        const contract = await getContractBase(network.chainId.toString(), provider)
        setContractBase(contract)
        setOpen(false)
      }


    } catch (error) {
      setOpen(true)
      setError('Error completing connection');
    }
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    unsetProps();
  };

  const initConnection = async () => {

    web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions // required
    });
    if (web3Modal.cachedProvider) {
      connectWallet();
    }

  }

  useEffect(() => {
    initConnection()
  }, []);

  useEffect(() => {
    if (connection?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        // if (accounts) setAccount(accounts[0]);
        if (accounts) initConnection()
      };

      const handleChainChanged = async (_hexChainId) => {
        console.log("chainChanged", _hexChainId);
        // setChainId(_hexChainId);
        initConnection()

      };

      const handleDisconnect = () => {
        console.log("disconnect");
        disconnect();
      };

      connection.on("accountsChanged", handleAccountsChanged);
      connection.on("chainChanged", handleChainChanged);
      connection.on("disconnect", handleDisconnect);

      return () => {
        if (connection.removeListener) {
          connection.removeListener("accountsChanged", handleAccountsChanged);
          connection.removeListener("chainChanged", handleChainChanged);
          connection.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [connection]);

  const switchChain = async ({ target: { value } }) => {
    try {
      await provider.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(value) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(value)]]
          });
        } catch (error) {
          setError('Fail to change network');
          setOpen(true)
        }
      }
    }

  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <>
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
      {!account || !chainId ? (
        <ColorButton variant="contained" onClick={connectWallet}>Connect Wallet</ColorButton>
      ) : (
        <Stack direction="row" spacing={1}>
          {Object.keys(availableChains).includes(chainId) &&
            <Tooltip title={'Click to disconnect'} >
              <Button variant="outlined" color={'success'} onClick={disconnect} startIcon={<DoneOutlineIcon sx={{ fontSize: 25, color: green[500] }} />}>
                {account.slice(0, 7)} . . . {account.slice(-4)}
              </Button>
            </Tooltip>
          }
          <FormControl sx={{ m: 1, minWidth: 120 }} error={!availableChains[chainId] && true}>
            <Select
              value={chainId}
              onChange={switchChain}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value={chainId} >
                <em>{availableChains[chainId] ? availableChains[chainId] : `⚠️  ${chainNameTemp}`}</em>
              </MenuItem>
              {
                Object.keys(availableChains).filter(chain => chain !== chainId).map((chain, i) => (
                  <MenuItem key={i} value={chain}>{availableChains[chain]}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Stack>
      )}
    </>
  )
}



