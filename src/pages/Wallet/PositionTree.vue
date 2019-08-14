<template>
    <div class="md-layout md-size-100">
      <position-card :position="position"
                     :project="project"
                     v-on:open-conditions-panel="openConditionsPanel"
                     v-on:extend-tree="toggleExtend">
      </position-card>
      <div v-if="position.children && extendTree"
           class="md-layout md-size-100"
           style="margin-top:30px;">
        <div class="md-layout-item md-size-50">
          <PositionTree :position="position.children[0]"
                        :posId="position.children[0].id">
          </PositionTree>
        </div>
        <div class="md-layout-item md-size-50">
          <PositionTree :position="position.children[1]"
                        :posId="position.children[1].id">
          </PositionTree>
        </div>
      </div>
    </div>
</template>

<script>
import PositionCard from "./PositionCard";

export default {
  name: "PositionTree",
  props: [
    'position',
    'posId',
    'project',
  ],
  components: {
    PositionCard,
  },
  data() {
    return {
      extendTree: false,
    }
  },
  methods: {
    toggleExtend: function(){
      this.extendTree = !this.extendTree;
      this.$forceUpdate();
    },
    splitFromPosition: function(position, index) {
       this.openConditionsPanel();
       this.selectedPosition = position[index];
       console.log(this.selectedPosition);
    },
    openConditionsPanel: function(position, index) {
      if(position) {
        this.$emit('open-conditions-panel', position, index);
      }
    }
  }
}
</script>

<style></style>
