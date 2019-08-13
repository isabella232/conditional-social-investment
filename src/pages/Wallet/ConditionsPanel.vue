<template lang="html">
  <md-drawer class="md-right" :md-active.sync="active">
    <md-toolbar style="margin-bottom: 20px;" class="md-teal">
      <h2> Conditions </h2>
    </md-toolbar>
    <div v-if="conditions.length > 0" class="md-layout">
      <div v-for="condition in conditions"
           class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
          <condition-card :condition="condition"
                          :project="project"
                          v-on:success="alertSplitSuccess"></condition-card>
      </div>
    </div>
  </md-drawer>
</template>

<script>
import ConditionCard from './ConditionCard';
import state from "@/state";
import hgBinding from "@/utils/hgBinding";

export default {
  props: [
    'project',
    'active',
  ],
  components: {
    ConditionCard,
  },
  methods: {
    alertSplitSuccess: function() {
      console.log('hello');
    },
    getConditions: async function() {
      await hgBinding.getConditions();
      this.conditions = state.conditions;
    },
  },
  data () {
    return {
      conditions: [],
    }
  },
  beforeMount() {
    this.getConditions();
  }
}
</script>

<style lang="css">
.md-toolbar {
  border-radius: none !important;
}
</style>
