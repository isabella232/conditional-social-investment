import Vue from 'vue';
import Blockchain from './Blockchain';

let State = {
  debug: true,
  // web3: {
  //   isInjected: false,
  //   web3Instance: null,
  //   networkId: null,
  //   balance: null,
  //   error: null
  // },
  state: {
    conditions: [],
    hgContract: {},
    projects: [
      {
        code: "UNEMPLOYMENT",
        name: "Job training and acitivation program",
        country: "Poland",
        balance: "$5,000",
        interests: "10%"
      },
      {
        code: "CANCER",
        name: "Breast cancer mammography analytics",
        country: "United Kingdom",
        balance: "$10,000",
        interests: "3%"
      },
      {
        code: "WATER",
        name: "Building new wells in sub-saharan Africa",
        country: "Sudan",
        balance: "$2,500",
        interests: "5%"
      }
    ],
  },
  getContract() {
    let hg = Blockchain.getHGContract();
    Vue.set(this.state, 'hgContract', hg);
  },
  async getHGRegistry() {
    let hgRegistry = await this.state.hgContract.createRegistry();
    Vue.set(this.state, 'conditions', hgRegistry);
  },
  addCondition(condition) {
    this.state.conditions.push(condition);
  }
}

export default State
