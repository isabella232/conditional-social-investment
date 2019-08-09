<template lang="html">
    <md-card class="md-layout md-elevation-2">
        <md-card-header data-background-color="blue" class="md-layout-item">
            <div>
                <div class="md-title">{{ condition.questionId | parseQuestion }}</div>
                <md-divider md-get-palette-color="white"></md-divider>
                <h6>Oracle address:</h6>
                <h4 style="overflow-wrap: break-word;">{{ condition.oracle }}</h4>
            </div>
        </md-card-header>

        <md-card-expand>
            <md-card-actions md-alignment="space-between">
                <md-card-expand-trigger>
                    <md-button data-background-color="teal"
                               @click.native="selectCondition(condition)">
                               <span v-if="!condition.open">Select</span>
                               <span v-else>Close</span>
                    </md-button>
                </md-card-expand-trigger>
            </md-card-actions>
            <md-card-expand-content>
                <md-card-content>
                    <md-field>
                        <label>Enter Amount</label>
                        <span class="md-prefix">£</span>
                        <md-input v-model="condition.splitAmount"></md-input>
                    </md-field>
                    <md-button @click="fullSplit"
                                v-bind:class="{ 'md-teal': (condition.splitAmount && condition.splitAmount.length > 0) }">
                                Split</md-button>
                    <md-button>Merge</md-button>
                </md-card-content>
            </md-card-expand-content>
        </md-card-expand>
    </md-card>
</template>

<script>
import { utils } from "ethers";
import state from "@/state";
export default {
    props: [
        'condition',
        'project',
    ],
    methods: {
        fullSplit: async function () {
            if(this.selectedCondition && this.project) {
                await this.project.coupon.approve(state.hgContract.contract.address, this.selectedCondition.splitAmount);
                let position = await this.selectedCondition.fullSplit(this.project.contract.address, this.selectedCondition.splitAmount);
                console.log(position);
                let balance = await this.project.coupon.balanceOf(state.hgContract.contract.address);
                console.log(balance);
                this.$emit('split-success');
            }
        },
        selectCondition: function(condition) {
            if(this.seletedCondition) {
                this.selectedCondition = null;
            }
            else {
                this.selectedCondition = condition;
            }
        },
    },
    data: function() {
        return {
            selectedCondition: null,
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
