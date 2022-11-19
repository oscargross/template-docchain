// import React from 'react'
// import { Web3Modal, ConnectButton,useAccount, useDisconnect, useNetwork, useSwitchNetwork } from '@web3modal/react'
// import { chains, providers } from '@web3modal/ethereum'
// import { green } from '@mui/material/colors';
// import { Tooltip } from '@mui/material';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
// import CircularProgress from '@mui/material/CircularProgress';

// export default function ConnectWeb3ButtonWeb3modal() {
//   const { account } = useAccount()
//   const { network } = useNetwork()
//   const modalConfig = {
//     theme: "dark",
//     accentColor: "orange",
//     ethereum: {
//       appName: "WebModal Tutorial",
//       chains: [chains.goerli, chains.mainnet, chains.polygon, chains.avalanche, chains.localhost, chains.hardhat],
//       providers: [
//         providers.walletConnectProvider({
//           projectId: '',
//         })],
//       autoCorrect: true,
//     },
//     projectId: '',
//   }
//   return (
//     <>
//       <Web3Modal config={modalConfig} />
//       {!account.isConnected
//         ? <ConnectButton />
//         : <ButtonConnected account={account} network={network} />
//       }
//     </>
//   )
// }
// const ButtonConnected = ({ account, network }) => {
//   const disconnect = useDisconnect()
//   const { switchNetwork, isLoading } = useSwitchNetwork()
//   const [chain] = React.useState('');
//   const handleChange = async (event) => {
//     await switchNetwork({ chainId: (network?.chains.find(c => c.name == event.target.value)).id })
//   };

//   return <>
//     <Stack direction="row" spacing={1}>
//       <Tooltip title={'Click to disconnect'} >
//         <Button variant="outlined" color={'success'} onClick={() => disconnect()} startIcon={<DoneOutlineIcon sx={{ fontSize: 25, color: green[500] }} />}>
//           {account.address.slice(0, 7)} . . . {account.address.slice(-4)}
//         </Button>
//       </Tooltip>
//       <FormControl sx={{ m: 1, minWidth: 120 }}>
//         <Select
//           value={chain}
//           onChange={handleChange}
//           displayEmpty
//           inputProps={{ 'aria-label': 'Without label' }}
//         >
//           <MenuItem value='' >
//             {isLoading && <CircularProgress color="success" sx={{ marginRight: 2}} size={20} />}
//             <em>{network.chain.name}</em>
//           </MenuItem>
//           {
//             network?.chains.filter(chain => chain.name !== network.chain.name).map((chain, i) => (
//               <MenuItem key={i} value={chain.name}>{chain.name}</MenuItem>
//             ))
//           }
//         </Select>
//       </FormControl>
//     </Stack>
//   </>
// }



