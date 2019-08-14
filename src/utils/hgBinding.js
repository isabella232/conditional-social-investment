import Vue from 'vue';
import Blockchain from "@/Blockchain";
import state from "@/state";
import _ from "underscore";


var getCondition = function(pos) {
  return state.conditions.find((elem) => {
    return elem.id === pos.values.conditionId;
  });
}

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
      console.log(positions);
      state.positions = this.filterPositions(positions);

    }
  },
  filterPositions(positions) {
    if(positions) {
      let filtered = [];
      // Used forEach bc returned position events are immutable
      positions.forEach(async (position) => {
        if(position.balance > 0 && !position.parent) {
          filtered.push(position);
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
        for(const indexSet of pos.values.partition) {
          if (pos.values.parentCollectionId == "0x0000000000000000000000000000000000000000000000000000000000000000") {
            let p = state.hgContract.createPosition(getCondition(pos), indexSet, pos.values.collateralToken, null);
            parentLookup[p.collectionId] = p;
            p.balance = (await p.balanceOf(state.userAddress)).toNumber();
            converted.push(p);
          }
        };
      return pos;
    }));

    await Promise.all(positions.map(async (pos) => {
      for(const indexSet of pos.values.partition) {
        if (pos.values.parentCollectionId != "0x0000000000000000000000000000000000000000000000000000000000000000") {
          console.log("Parent id: " + pos.values.parentCollectionId);
          let parent = parentLookup[pos.values.parentCollectionId];
          let p = state.hgContract.createPosition(getCondition(pos), indexSet, pos.values.collateralToken, parent);
          parentLookup[p.collectionId] = p;
          p.balance = (await p.balanceOf(state.userAddress)).toNumber();
          console.log("My id: " + p.collectionId);
          if (parent) {
            console.log("Matching parent: " + parent.collectionId);
            if (parent.children) {
              parent.children.push(p);
            } else {
              parent.children = [p];
            }
          }
          converted.push(p);
        }
      };
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
