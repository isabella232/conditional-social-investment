import Vue from 'vue';
import Blockchain from "@/Blockchain";
import state from "@/state";

let hgBinding = {
  async getContract() {
    let hg = Blockchain.getHGContract();
    state.hgContract = hg;
  },
  async getConditions() {
    state.hgRegistry = state.hgContract.getRegistry();
    if(state.hgRegistry) {
      await state.hgRegistry.getConditions()
      .then(() => {
        state.conditions = state.hgRegistry.conditions.map((con) => {
          return this.convertConditionEvent(con.values);
        });
      });
    }
  },
  convertConditionEvent(condition) {
    return state.hgContract.createCondition(condition.oracle, condition.questionId, condition.outcomeSlotCount._hex);
  },
  async prepareCondition(condition) {
    if(state.hgContract && condition) {
      let hg = state.hgContract;
      await hg.prepareCondition(condition.question, condition.oracle, condition.outcomesSlotsCount);
      await this.getConditions();
    }
  }
}

export default hgBinding;
