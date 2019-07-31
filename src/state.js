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
