import Vue from 'vue';
import Blockchain from "@/Blockchain";
import state from "@/state";
import _ from "underscore";

let hgBinding = {
  async getContract() {
    let hg = Blockchain.getHGContract();
    state.hgContract = hg;
  },
  setHGRegistry() {
    state.hgRegistry = state.hgContract.getRegistry();
  },
  async getConditions() {
    this.setHGRegistry();
    if(state.hgRegistry) {
      await state.hgRegistry.getConditions()
      .then(() => {
        state.conditions = state.hgRegistry.conditions.map((con) => {
          return this.convertConditionEvent(con.values);
        });
      });
    }
  },
  async getPositions() {
    this.setHGRegistry();
    if(state.hgRegistry) {
      await state.hgRegistry.getPositions();
      let positions = await this.convertPositions(state.hgRegistry.positions);
      state.positions = this.filterPositions(positions);
    }
  },
  filterPositions(positions) {
    if(positions) {
      let filtered = [];
      // Used forEach bc returned position events are immutable
      positions.forEach(async (position) => {
        //TODO: We shouldn't have to get children length of 2 only
        if(position.children) {
          if(position.balance > 0 && position.children.length === 2) {
            filtered.push(position);
          }
        }
      });
      return filtered;
    }
  },
  convertConditionEvent(condition) {
    return state.hgContract.createCondition(condition.oracle, condition.questionId, condition.outcomeSlotCount._hex);
  },
  //TODO: This logic should be moved to the registry module
  async convertPositions(positions) {
    let converted = [];
    let parentLookup = {};
    await Promise.all(positions.map(async (pos) => {
      if (state.conditions) {
        let condition = state.conditions.find((elem) => {
          return elem.id === pos.values.conditionId;
        });
        for(const indexSet of pos.values.partition) {
          let parent = parentLookup[pos.values.parentCollectionId];
          let p = state.hgContract.createPosition(condition, indexSet, pos.values.collateralToken, parent);
          parentLookup[p.collectionId] = p;
          p.balance = (await p.balanceOf(state.userAddress)).toNumber();

          if (parent) {
            console.log("Matching parent: " + parent.collectionId);
            if (parent.children) {
              parent.children.push(p);
            } else {
              parent.children = [p];
            }
          }
          converted.push(p);
        };
      }
      return pos;
    }));
    return converted;
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
