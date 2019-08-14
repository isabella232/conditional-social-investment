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
                                    <div v-if="selectedProject !== null"
                                         class="md-layout-item
                                                md-medium-size-50
                                                md-xsmall-size-100
                                                md-size-100
                                                wallet-view">
                                        <conditions-panel :active="showPanel" :project="selectedProject"></conditions-panel>

                                        <!--
                                        <stats-card data-background-color="blue"
                                                    class="md-layout-item md-size-50">
                                            <template slot="header">
                                                <md-icon>account_balance_wallet</md-icon>
                                            </template>

                                            <template slot="content">
                                                <p class="category">Funds for this project</p>
                                                <h3 class="title">
                                                    <span class="md-prefix">$</span>
                                                    {{ balance }}
                                                </h3>
                                            </template>
                                            <template slot="footer">
                                                <md-button class="md-round md-alignment-centre-right md-lightblue"
                                                           @click="test()">Deposit cash</md-button>
                                            </template>
                                        </stats-card>
                                        -->

                                        <div>
                                            <div class="md-layout md-size-100 md-alignment-top-center">
                                                <md-button @click="openConditionsPanel"
                                                           class="md-round md-alignment-centre-right md-lightblue">Hedge against a risk</md-button>
                                            </div>
                                        </div>

                                        <div v-for="position in positions" class="positions-view">
                                            <div class="md-layout">
                                                <div class="tree-view">
                                                    <!-- <tree-chart :json="" -->
                                                </div>
                                                <position-card :position="position"
                                                               :project="selectedProject"
                                                               v-on:open-conditions-panel="splitFromPosition"></position-card>
                                            </div>
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
  import hgBinding from "@/utils/hgBinding";
  import { projects } from "@/utils/social-projects.js";
  import TreeChart from "vue-tree-chart";
  import ConditionsPanel from "./ConditionsPanel";
  import PositionCard from "./PositionCard";

  export default {
    components: {
      NavTabsCard,
      StatsCard,
      TreeChart,
      ConditionsPanel,
      PositionCard,
    },
    methods: {
      getContract: async function() {
          await hgBinding.getContract();
      },
      selectProject: function(project) {
          this.selectedProject = project;
          this.balance = this.selectedProject.holdings;
      },
      fetchProjects: async function() {
          await projects.fetchProjects();
          this.projects = state.projects;
      },
      fetchPositions: async function() {
          await hgBinding.getConditions();
          await hgBinding.getPositions();
          this.positions = state.positions;
      },
      splitFromPosition: function(position, index) {
          this.openConditionsPanel();
          this.selectedPosition = position[index];
          console.log(this.selectedPosition);
      },
      openConditionsPanel: function() {
          this.showPanel = !this.showPanel;
      }
    },
    data() {
      return {
        projects: [],
        positions: [],
        selectedPosition: null,
        balance: null,
        selectedProject: null,
        options: ['Overview', 'Conditions'],
        showPanel: false,
      }
    },
    beforeMount() {
        this.getContract();
        this.fetchProjects();
        this.fetchPositions();
    },
    filters: {
        parseQuestion: function (questionId) {
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
    .wallet-view {
        min-height: 75vh;
    }
    .positions-view {
        margin-top:40px;
    }
</style>
