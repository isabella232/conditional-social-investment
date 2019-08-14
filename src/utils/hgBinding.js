import Vue from 'vue';
import Blockchain from "@/Blockchain";
import state from "@/state";
import _ from "underscore";

const NULL_ID = "0x0000000000000000000000000000000000000000000000000000000000000000";


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
  convertAndMatchParents(parentsLookup, unmatched, matched) {
    let next = [];
    unmatched.map((pos) => {
      let parent = parentsLookup[pos.values.parentCollectionId];

      if (parent || pos.values.parentCollectionId === NULL_ID) {
        for (const indexSet of pos.values.partition) {
          let p = state.hgContract.createPosition(getCondition(pos), indexSet, pos.values.collateralToken, parent);
          parentsLookup[p.collectionId] = p;
          if (parent) {
            (parent.children = parent.children || []).push(p);
          }
          matched.push(p);
        }
      } else {
        next.push(pos);
      }
    });
    return next.length == 0 ? matched : this.convertAndMatchParents(parentsLookup, next, matched);
  },
  //TODO: This logic should be moved to the registry module
  async convertPositions(positions) {
    let results = [];
    let matched = this.convertAndMatchParents({}, positions, results);
    for(const p of matched) {
      p.balance = (await p.balanceOf(state.userAddress)).toNumber();
    }
    return matched;
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
