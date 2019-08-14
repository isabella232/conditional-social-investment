<template lang="html">
    <md-card class="md-layout md-elevation-2 md-layout-item md-size-100">
        <md-card-header data-background-color="blue" class="md-layout-item">
            <div class="md-title">{{ position.condition.questionId | parseQuestion }}</div>
            <h4>{{ position.indexSet | parseOption }} </h4>
            <md-divider md-get-palette-color="white"></md-divider>
            <h5>Balance: <b>{{position.balance}}</b></h5>
        </md-card-header>

        <md-card-content>
            <md-checkbox v-model="selectedToMerge"
                         :value="position">Select to merge</md-checkbox>
        </md-card-content>
        <md-card-actions>
            <md-button v-if="position.children"
                       @click="openChildren()"
                       class="md-lightblue md-round">
                       <span v-if="!extendTree">View</span>
                       <span v-else>Hide</span>
                       Children</md-button>
           <md-button @click="selectSplit(position.indexSet)" class="md-icon-button md-round md-raised md-deep-purple split-merge-button">
                          <md-icon>call_split</md-icon>
                          <md-tooltip md-direction="top">Split</md-tooltip></md-button>
            <md-button @click="merge()" class="md-icon-button md-round md-raised md-primary split-merge-button">
                           <md-icon>call_merge</md-icon>
                           <md-tooltip md-direction="top">Merge</md-tooltip></md-button>
        </md-card-actions>
    </md-card>
</template>

<script>
import { utils } from "ethers";
import state from "@/state";
import NavTabsTable from "@/components";

export default {
    components: {
        NavTabsTable,
    },
    props: [
        'position',
        'project',
    ],
    methods: {
        selectSplit: async function (index) {
            if(this.position && this.project) {
                this.$emit('open-conditions-panel', this.position, index);
            }
        },
        openChildren: function() {
            this.extendTree = !this.extendTree;
            this.$forceUpdate();
            this.$emit('extend-tree');
        },
        merge: function() {
            this.$emit('open-merge-panel');
        }
    },
    data: function() {
        return {
            selectedPosition: null,
            extendTree: false,
            showPanel: false,
            options: [
                { name: 'Yes' },
                { name: 'No' }
            ],
            selectedToMerge: state.selectedToMerge
        }
    },
    filters: {
        parseQuestion: function (questionId) {
            if (!questionId) return 'Question name unknown';
            let question = utils.parseBytes32String(questionId);
            return question;
        },
        parseOption: function(option) {
          return option == 1 ? 'Yes' : 'No';
        }
    },
}
</script>

<style lang="css">
.split-merge-button {
    height: 40px !important;
    width: 40px !important;
    border-radius: 20px;
    padding-top: 10px !important;
}
.md-icon {
    font-size: 80px !important;
}
</style>
