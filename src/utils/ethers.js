import { ethers, BigNumber } from "ethers";
import { collectionBaseAddress } from "./props";
import Collection from '../../artifacts/contracts/Docchain.sol/Collection.json'
import { create } from 'ipfs-http-client'

export const getContract = async (addr, abi, provider) => {

  try {
    const contract = new ethers.Contract(addr, abi, provider);
    const signer = await provider.getSigner()
    const instance = await contract.connect(signer);

    return instance

  } catch (error) {
    throw new Error("Fail to load contract")
  }
}

export const getContractBase = async (chainId, provider) => {
  try {
    const contract = await getContract(collectionBaseAddress[chainId], Collection.abi, provider)
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
  return(String(Number(fee)+1))
}


