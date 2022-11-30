import React, { createContext, useState } from 'react'
import { availableChains } from '../utils/props';

export const Web3Context = createContext({
  provider: undefined,
  setContractBase: () => { },
  contractBase: undefined,
  setChainId: () => { },
  chainId: undefined,
  setAccount: () => { },
  account: undefined,
  setProps: () => { },
  unsetProps: () => { },
});

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState();
  const [connection, setConnection] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [contractBase, setContractBase] = useState()
  const setProps = async ({ provider, accounts, network, connection }) => {

    setProvider(provider);
    setConnection(connection);
    if (accounts) setAccount(accounts[0]);
    setChainId(network.chainId.toString());
  }
  const unsetProps = () => {
    setAccount();
    setChainId();
    setProvider();
    setConnection();
    setContractBase()
  }
  const gasLimit = 1 * 10 ** 7

  // const ok = () => (!account || !Object.keys(availableChains).includes(chainId)) ? false : true

  return (
    <Web3Context.Provider value={{ gasLimit,setProps, setChainId, setAccount, unsetProps, setContractBase, provider, account, chainId, connection, contractBase }}>
      {children}
    </Web3Context.Provider>
  )


}
