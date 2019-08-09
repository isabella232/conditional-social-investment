<template>
    <div class="content">
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
                <h2>Your wallet</h2>
            </div>
        </div>
        <div class="md-layout">
            <div class="md-layout-item">
                <nav-tabs-card>
                    <template slot="content">
                        <span class="md-nav-tabs-title">Projects: </span>
                        <md-tabs class="md-deep-purple" md-alignment="left">
                            <md-tab v-for="project in projects"
                                    :md-label="project.code"
                                    @click="selectProject(project)">
                                    <div class="md-layout md-gutter">
                                        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
                                            <stats-card data-background-color="lightblue">
                                                <template slot="header">
                                                    <md-icon>content_copy</md-icon>
                                                </template>

                                                <template slot="content">
                                                    <p class="category">Amount deposited into this project</p>
                                                    <h3 class="title">
                                                        <!-- {{ selectedProject.holdings }} -->
                                                        <small>GBP</small>
                                                    </h3>
                                                </template>
                                            </stats-card>
                                        </div>
                                        <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
                                            <stats-card data-background-color="lightblue">
                                                <template slot="header">
                                                    <md-icon>content_copy</md-icon>
                                                </template>

                                                <template slot="content">
                                                    <p class="category">Amount approved for hedging</p>
                                                    <h3 class="title">
                                                        <!-- {{ selectedProject.coupon.balanceOf() }} -->
                                                        <small>GBP</small>
                                                    </h3>
                                                </template>

                                                <template slot="footer">
                                                    <md-button>Add</md-button>
                                                </template>
                                            </stats-card>
                                        </div>
                                    </div>
                                    <div v-if="conditions.length > 0" class="md-layout">
                                        <div v-for="condition in conditions"
                                             class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
                                            <md-card class="md-layout md-elevation-2">
                                                <md-card-header data-background-color="blue" class="md-layout-item">
                                                    <div>
                                                        <div class="md-title">{{ condition.questionId | getQuestion }}</div>
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
                                                                       v-bind:class="{ 'md-lightblue': (condition.splitAmount && condition.splitAmount.length > 0) }">
                                                                       Split</md-button>
                                                            <md-button>Merge</md-button>
                                                        </md-card-content>
                                                    </md-card-expand-content>
                                                </md-card-expand>
                                            </md-card>
                                        </div>
                                    </div>
                            </md-tab>
                        </md-tabs>
                    </template>
                </nav-tabs-card>
            </div>
        </div>
    </div>
</template>

<script>
  import { NavTabsCard, NavTabsTable, StatsCard } from "@/components";
  import state from "@/state";
  import { utils } from "ethers";
  import Vue from "vue";
  import hgBinding from "@/utils/hgBinding";
  import { projects } from "@/utils/social-projects.js";
  import UserCard from "../UserProfile/UserCard";
  import TreeChart from "vue-tree-chart";

  export default {
    components: {
      NavTabsCard,
      NavTabsTable,
      StatsCard,
      TreeChart
    },
    methods: {
      selectCondition: function(condition) {
          if(this.selectedCondition && condition === this.selectedCondition) {
              this.selectedCondition = null;
              Vue.condition.open = !condition.open;
          }
          else {
              this.selectedCondition = condition;
              condition.open = !condition.open;
          }
          console.log(this.selectedCondition);
      },
      fullSplit: async function () {
          console.log('trying to split');
          if(this.selectedCondition && this.selectedProject) {
              await this.selectedProject.token.approve(state.hgContract.contract.address, this.selectedCondition.splitAmount);
              // console.log(this.selectedCondition);
              let position = await this.selectedCondition.fullSplit(this.selectedProject.contract.address, 10);
              console.log(position);
          }
      },
      getContract: async function() {
        await hgBinding.getContract();
      },
      getConditions: async function() {
          await hgBinding.getConditions();
          // Convert the event to condition
          this.conditions = state.conditions;
      },
      selectProject: function(project) {
          this.selectedProject = project;
          console.log(this.wallet);
          console.log(this.selectedProject);
          let projectToken = this.selectedProject.coupon;
      },
      fetchProjects: async function() {
          await projects.fetchProjects();
          this.projects = state.projects;
          this.selectedProject = this.projects[0];
      }
    },
    data() {
      return {
        projects: [],
        conditions: [],
        modalOpen: false,
        selectedProject: null,
        options: ['Overview', 'Conditions'],
        selectedCondition: null,
        projectToken: null,
        wallet: state.wallet,
      }
    },
    beforeMount() {
        this.getContract();
        this.fetchProjects();
        this.getConditions();
    },
    filters: {
        getQuestion: function (questionId) {
            if (!questionId) return 'Question name unknown';
            let question = utils.parseBytes32String(questionId);
            return question;
        }
    }
  };
</script>
<style media="screen" lang="scss">
    .md-card {
        box-shadow: none !important;
    }
    .md-divider.md-theme-default {
        margin: 10px 0;
        background-color: rgba(255, 255, 255, 0.4) !important;
    }
    .md-elevation-2 {
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.1), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 6px 0 rgba(0,0,0,.12) !important;
    }
    .md-tabs-navigation {

    }
</style>
