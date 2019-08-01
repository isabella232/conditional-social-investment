const ethers = require('ethers');
const catalogContract = require('../contracts/ProjectCatalog.json');
const projectContract = require('../contracts/ProjectWithBonds.json');
const demoTokenContract = require('../contracts/DemoToken.json');

import {state} from "../state.js";



const CATALOG_ADDRESS = "0xfb0000f8BA76d80825247aC21Dd4074701343F73";
const PROJECT_ADDRESS = "0xF4ae14E517Ea5Ae42955fbb1503991d4E0189edC";
const DEMO_TOKEN_ADDRESS = "0x0d694e6d4310b10830abe7d5CFfde8b4Bf267B40";
var provider, signer;

const injectedWeb3 = window.web3;
if (typeof injectedWeb3 !== "undefined") {
  provider = new ethers.providers.Web3Provider(injectedWeb3.currentProvider);
  signer = provider.getSigner();
} else {
  console.log("No web3 provider available");
}

export const projects = {
  deployCatalog: async function() {
    let factory = new ethers.ContractFactory(catalogContract.abi, catalogContract.bytecode, signer);
    let contract = await factory.deploy();
    console.log(contract.address);
  },
  deployProject: async function() {
    let factory = new ethers.ContractFactory(projectContract.abi, projectContract.bytecode, signer);
    //constructor(string memory _name, uint8 _upfrontPaymentPercentage, uint256 _couponNominalPrice, uint256 _couponInterestRate) public
    let contract = await factory.deploy('UNEMPLOYMENT', 0, 1, 15);
    console.log(contract.address);
    await contract.setToken("0x0d694e6d4310b10830abe7d5CFfde8b4Bf267B40");
    await this.registerProject('UNEMPLOYMENT', contract.address);
  },
  deployDemoToken: async function() {
    let factory = new ethers.ContractFactory(demoTokenContract.abi, demoTokenContract.bytecode, signer);
    let contract = await factory.deploy();
    console.log(contract.address);
  },
  deposit: async function() {
    console.log("DEPOSITING 100 tokens...");
    let tokenContract = new ethers.Contract(DEMO_TOKEN_ADDRESS, demoTokenContract.abi, signer);
    await tokenContract.mint(100);
    this.updateBalance();
  },
  updateBalance: async function() {
    let address = await signer.getAddress();
    console.log("Checking balance for: " + address);
    let tokenContract = new ethers.Contract(DEMO_TOKEN_ADDRESS, demoTokenContract.abi, signer);
    let balance = await tokenContract.balanceOf(address);
    state.balance.value = balance.valueOf();
  },
  registerProject: async function(name, address) {
    let contract = new ethers.Contract(CATALOG_ADDRESS, catalogContract.abi, signer);
    await contract.addProject(name, address);
  },
  fetchProjects: function() {
    state.projects = [];
    let eventAbi = [catalogContract.abi[4]];
    let iface = new ethers.utils.Interface(eventAbi);

    let filter = {
      address: CATALOG_ADDRESS,
      fromBlock: 0
    };

    provider.getLogs(filter).then((results) => {

      results.forEach(async (result) => {
        let event = iface.parseLog(result);
        let address = event.values[1];
        let contract = new ethers.Contract(address, projectContract.abi, signer);
        let code = await contract.name();
        let interests = await contract.couponInterestRate();

        let project = {
          code: code,
          desc: state.projectDesc[code],
          contract: contract,
          interests: interests + '%'
        };
        state.projects.push(project);
      });
    });
  }
};

projects.updateBalance();
projects.fetchProjects();
