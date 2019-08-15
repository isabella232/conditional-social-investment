<template>
    <div class="content conditions-page">
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
                <h2>Available Conditions</h2>
            </div>
        </div>
        <div v-if="conditions.length > 0" class="md-layout">
            <div v-for="condition in conditions"
                 class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
                <stats-card data-background-color="blue">
                    <template slot="header">
                        <md-icon>content_copy</md-icon>
                    </template>

                    <template slot="content">
                        <h4> {{ condition.questionId | getQuestion }} </h4>




                    </template>

                    <template slot="footer">

                        <div class="md-layout-item md-size-100">
                            <div class="stats">
                                <h5>Oracle address:</h5>
                                <p class="oracle-address">{{ condition.oracle }}</p>
                            </div>
                            <h6 class="md-size-33">Options: </h6>
                            <div class="md-layout-item md-size-33" v-for="(option, index) in options">
                                <div class="condition-option md-lightblue">{{ option.name }}</div>
                            </div>
                        </div>
                    </template>



                </stats-card>
            </div>
        </div>
        <div v-else class="md-layout">
            <h3>There are currently no conditions, create one!</h3>
        </div>
        <md-button class="add-condition md-fab-top-center md-fab"
                   style="background-color: #1CB8C4 !important;"
                   @click="showSidepanel = true">
            <md-icon style="margin-left: -19px">add</md-icon>
        </md-button>
        <md-drawer class="md-right" :md-active.sync="showSidepanel">
          <div>
            <form novalidate class="md-layout">
              <md-card class="md-layout-item ">
                <md-card-header style="background-color: rgb(80, 174, 84);">
                  <h3 class="md-title" style="color: #fff;">Create a condition</h3>
                </md-card-header>

                <md-card-content>
                    <div class="md-layout-item md-small-size-100">
                      <md-field>
                        <label for="question">Question</label>
                        <md-input name="question" id="question" v-model="form.question" :disabled="sending"/>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100">
                      <md-field>
                        <label for="oracle">Oracle Address</label>
                        <md-input name="oracle" id="oracle" v-model="form.oracle" :disabled="sending"/>
                      </md-field>
                    </div>
                </md-card-content>
                <md-progress-bar md-mode="indeterminate" v-if="sending"/>
                <md-card-actions>
                  <md-button type="submit"
                             class="md-info"
                             :disabled="sending"
                             @click="prepareCondition">Create condition</md-button>
                </md-card-actions>
              </md-card>

              <md-snackbar :md-active.sync="conditionAdded">Your condition has been deployed with success!</md-snackbar>
            </form>
          </div>
        </md-drawer>
    </div>
</template>

<script>
  import { StatsCard } from "@/components";

  // import ConditionCard from '@/components/Cards/ConditionCard';

  import hgBinding from '@/utils/hgBinding';
  import Chain from '@/Blockchain';
  import state from '@/state';
  import { utils } from 'ethers';

  export default {
    name: "conditions-dashboard",
    data: function () {
        return {
              options: [
                { name: 'Yes' },
                { name: 'No' }
              ],
            conditions: state.conditions,
            showSidepanel: false,
            form: {
              question: null,
              oracle: null,
              outcomesSlotsCount: 2,
            },
            sending: false,
            success: false,
            conditionAdded: false

        }
    },
    components: {
      StatsCard,
    },
    methods: {
      getContract: async function() {
          await hgBinding.getContract();
      },
      getConditions: async function() {
          await hgBinding.getConditions();
          this.conditions = state.conditions;
          console.log(this.conditions);
      },
      prepareCondition: async function() {
          this.sending = true;
          await hgBinding.prepareCondition(this.form);

          this.conditionAdded = true;
          this.sending = false;
          this.showSidepanel = false;
          this.success = true;
          this.getConditions();
      },
    },
    beforeMount() {
      this.getContract();
      this.getConditions();
    },
    filters: {
        getQuestion: function (questionId) {
            if (!questionId) return 'Question name unknown';
            let question = utils.parseBytes32String(questionId);
            return question;
        }
    }
  }
</script>

<style media="screen">
    .md-table, .md-table-content {
        width: 100%;
    }
    .oracle-address {
        word-break: break-all !important;
    }
    .condition-option {
        /* width: 33% !important; */
        height: 40px;
    }
</style>
