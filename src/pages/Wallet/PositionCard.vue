<template lang="html">
    <md-card class="md-layout md-elevation-2 md-layout-item md-size-100">
        <md-card-header data-background-color="blue" class="md-layout-item">
            <div class="md-title">{{ position.condition.questionId | parseQuestion }}</div>
            <h4>{{ position.indexSet | parseOption }} </h4>
            <md-divider md-get-palette-color="white"></md-divider>
            <h5>Balance: <b>{{position.balance}}</b></h5>
        </md-card-header>
        <md-card-content>
                 <md-table v-for="(option, index) in options">
                     <!-- <md-table-row slot="md-table-row"
                                   md-selectable="multiple"
                                   md-auto-select> -->
                     <!-- <md-table-cell>{{ option.name }}</md-table-cell> -->
                     <!-- <md-table-cell style="float: right; margin-top: -20px;">
                             <md-button class="md-just-icon md-simple md-primary"
                                        @click="selectSplit(index)">
                                <md-icon>call_split</md-icon>
                                <md-tooltip md-direction="top">Split</md-tooltip>
                             </md-button>
                         <md-button class="md-just-icon md-simple md-deep-purple">
                             <md-icon>call_merge</md-icon>
                             <md-tooltip md-direction="top">Merge</md-tooltip>
                         </md-button>
                     </md-table-cell> -->
                 <!-- </md-table-row> -->
             </md-table>
        </md-card-content>


        <md-card-actions>
            <md-button v-if="position.children"
                       @click="openChildren()"
                       class="md-lightblue">
                       <span v-if="!extendTree">View</span>
                       <span v-else>Hide</span>
                       Children</md-button>
            <md-button @click="selectSplit(position.indexSet)"
                       class="md-deep-purple">Split</md-button>
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
            ]
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
</style>
