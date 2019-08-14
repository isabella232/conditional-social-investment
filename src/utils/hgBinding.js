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
      console.log(state.positions);
      // this.createPositionTree();
    }
  },
  filterPositions(positions) {
    if(positions) {
      let filtered = [];
      // Used forEach bc returned position events are immutable
      positions.forEach( (position) => {
        if(position[0].balance > 0 || position[1] > 0) {
            filtered.push(position);
        }
      });
      return filtered;
    }
  },
  createPositionTree() {
    let tree;
    let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000000000000000000000000000";
    if(state.positions) {
      console.log(state.positions);
      // Init tree is _array_ of positionGroups [[{pos}, {pos}], ... ]
      // with parent of each pos === ZERO_ADDRESS
      tree = state.positions.filter((position) => {
        // TODO: change this address to master parent address when we have one
        return(position[0].parent === ZERO_ADDRESS);
      });
      this.structurePositionTree(ZERO_ADDRESS, tree);
    }
  },
  structurePositionTree(parent, tree) {
    // Find the children of the given parent address from all positions
    let children = state.positions.filter((position) => {
      return position[0].parent === parent;
    });
    tree.forEach(function (positionGroup, index) {
      if(positionGroup[0].id === parent) {
        // Assign the parents as objects.
        let position = Object.assign({}, positionGroup);
        // Add the children as array to parent
        position.children = children ? children : [];
        // Remove this positionGroup from tree before
        // passing to recursion
        tree.splice(index, index);
        position.children.forEach((child) => {
          this.structurePositionTree(child[0].id, tree);
        });
      }
    });
    return object;
  },
  convertConditionEvent(condition) {
    return state.hgContract.createCondition(condition.oracle, condition.questionId, condition.outcomeSlotCount._hex);
  },
  //TODO: This logic should be moved to the registry module
  async convertPositions(positions) {
    return await Promise.all(positions.map(async (pos) => {
      let converted = []
      if (state.conditions) {
        let condition = state.conditions.find((elem) => {
          return elem.id === pos.values.conditionId;
        });
        for(const indexSet of pos.values.partition) {
          let p = state.hgContract.createPosition(condition, indexSet, pos.values.collateralToken, pos.values.parentCollectionId);
          p.balance = (await p.balanceOf(state.userAddress)).toNumber();
          converted.push(p);
        };
      }
      return converted;
    }));
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
