import HG from 'gnosis-hg-js';
import Web3 from 'web3';
const ethers = require('ethers');

// Link gnosis conditional-contracts module to App

//Old: 0x2b27168e83cAb0Ee27CCF66c970587B92ee844C4
const MANAGER_CONTRACT_ADDRESS = "0x9AA66681661611674ae8dbD671d3eCb160Cddec7";

let Blockchain = {
  getHGContract() {
      // Check for injected web3 (mist/metamask)
      var web3js = Web3;
      if (typeof web3js !== "undefined") {
        return new HG(MANAGER_CONTRACT_ADDRESS);
      }
      else {
        console.log('web3 not found');
      }
  },
  getCurrentUserAddress() {
    const injectedWeb3 = window.web3;
    if (typeof injectedWeb3 !== "undefined") {
      let provider = new ethers.providers.Web3Provider(injectedWeb3.currentProvider);
      let signer = provider.getSigner();
      let userAddress = signer.getAddress();
      return(userAddress);
    } else {
      console.log("No web3 provider available");
    }
  }
}

export default Blockchain;
