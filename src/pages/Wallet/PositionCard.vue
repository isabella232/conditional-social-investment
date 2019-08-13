<template lang="html">
    <md-card class="md-layout md-elevation-2 md-layout-item md-size-50">
        <md-card-header data-background-color="blue" class="md-layout-item">
            <div class="md-title">Position</div>
            <h4> {{ position[0].condition.questionId | parseQuestion }}</h4>
            <md-divider md-get-palette-color="white"></md-divider>
            <h6>Oracle address:</h6>
            <h4 style="overflow-wrap: break-word;">{{ position[0].condition.oracle }}</h4>
        </md-card-header>
        <md-card-content>
                 <md-table v-for="(option, index) in options">
                     <md-table-row slot="md-table-row"
                                   md-selectable="multiple"
                                   md-auto-select>
                     <md-table-cell>{{ option.name }}</md-table-cell>
                     <md-table-cell style="float: right; margin-top: -20px;">
                             <md-button class="md-just-icon md-simple md-primary"
                                        @click="selectSplit(index)">
                                <md-icon>call_split</md-icon>
                                <md-tooltip md-direction="top">Split</md-tooltip>
                             </md-button>
                         <md-button class="md-just-icon md-simple md-deep-purple">
                             <md-icon>call_merge</md-icon>
                             <md-tooltip md-direction="top">Merge</md-tooltip>
                         </md-button>
                     </md-table-cell>
                 </md-table-row>
             </md-table>
        </md-card-content>
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
    },
    data: function() {
        return {
            selectedPosition: null,
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
        }
    }
}
</script>

<style lang="css">
</style>
