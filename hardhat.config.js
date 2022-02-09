require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
//const privateKey = fs.readFileSync(".secret").toString();
const projectId = "5e5498a04e7742ffad87eb73039d6d23";


const dotenv = require('dotenv')
dotenv.config()
const privateKey = process.env.privateKey;
console.log(process.env)



// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
/*task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});*/

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity:  "0.8.4",

  networks: {
    hardhat: {
        chainId:1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: ["0dadd484165b788073e469b535c32fd2fe340b9c9ea19db2ed7d98e5d310c43d"], // accounts: [privateKey1, privateKey2, ...]
     
    },

    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: ["0dadd484165b788073e469b535c32fd2fe340b9c9ea19db2ed7d98e5d310c43d"], // accounts: [privateKey1, privateKey2, ...]
     
    },

  
  }
};
