import { ethers } from "ethers";
import { collectionBaseAddress } from "./props";
import Collection from './Collection.json'
import SBT from './SBT.json'

import { create } from 'ipfs-http-client'

export const claimDoc = async (addr, provider, account, gasLimit) => {
  try {

    const contractInstance = await getContract({ addr, provider })
    const obj = await contractInstance.personToDegree(account)
    console.log(Number(obj.tokenId))
    if (!obj.tokenURI) throw Error()

    const message = await contractInstance.getMessageHash(account, Number(obj.tokenId), obj.tokenURI)
    const signer = await provider.getSigner()
    const signature = await signer.signMessage(ethers.utils.arrayify(message))

    const transactionByDocchain = await getDocchainWallet(addr, provider, message, signature, gasLimit)
    return transactionByDocchain

  } catch (error) {
    console.error(error.message)
    throw new Error('Error in blockchain calls')
  }
}

const getDocchainWallet = async (addr, provider, message, signature, gasLimit) => {
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY_DOCCHAIN;
  const wallet = new ethers.Wallet(privateKey, provider);

  const contract = new ethers.Contract(addr, SBT.abi, wallet)
  const transaction = await contract.connect(wallet).claimDegree(message, signature, { gasLimit })
  return transaction
}

export const getContract = async ({ addr, provider, abi }) => {
  const abiCall = abi ? abi : SBT.abi
  try {
    const contract = new ethers.Contract(addr, abiCall, provider);
    const signer = await provider.getSigner()
    const instance = await contract.connect(signer);

    return instance

  } catch (error) {
    throw new Error("Fail to load contract")
  }
}

export const getContractBase = async (chainId, provider) => {
  try {
    const contract = await getContract({ addr: collectionBaseAddress[chainId], abi: Collection.abi, provider })
    return contract
  } catch (error) {
    return false
  }
}

export const addIPFS = async (file) => {
  try {
    const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID;
    const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET;
    const auth =
      'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    });
    const { path } = await client.add(file)
    return path

  } catch (error) {
    throw new Error('IPFS upload fail')
  }
}


export const getFee = async (chainId, provider) => {
  const contractBase = await getContractBase(chainId, provider)
  const fee = await contractBase.getFee()
  //  await contractBase.updateFee(ethers.utils.parseEther("0.02"), { gasLimit: 3000000 })
  return (fee)
}


