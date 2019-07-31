import HG from 'gnosis-hg-js';
import Web3 from 'web3';
const ethers = require('ethers');

// Link gnosis conditional-contracts module to App

const MANAGER_CONTRACT_ADDRESS = "0xE806490B7c439D3dE3A6617592CdE8b571B339eA";

window.ethereum.enable();


let Blockchain = {
  getHGContract() {
      // Check for injected web3 (mist/metamask)
      var web3js = Web3;
      if (typeof web3js !== "undefined") {
        var provider = new ethers.providers.Web3Provider(window.ethereum);
        return new HG(MANAGER_CONTRACT_ADDRESS, provider);
        resolve(provider);
      } else {
        // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) // GANACHE FALLBACK
        new Error("Unable to connect to Metamask");
      }
  }
}

export default Blockchain;
