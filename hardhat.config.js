require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
// const privateKey = fs.readFileSync(".secret").toString().trim() || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMYMUMBAIKEY}`,
      // url: "https://rpc-mumbai.matic.today",
      accounts: [process.env.NEXT_PUBLIC_PRIVATE_KEY]
    },
    matic: {
      // Infura
      // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMYPOLYGONKEY}`,
      // url: "https://rpc-mainnet.maticvigil.com",
      accounts: [process.env.NEXT_PUBLIC_PRIVATE_KEY]
    }

  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
