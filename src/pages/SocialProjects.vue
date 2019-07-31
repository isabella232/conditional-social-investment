<template>
    <div class="content">
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
                <md-card>
                    <md-card-header data-background-color="green">
                        <h4 class="title">Social Projects</h4>
                        <p class="category">Here is a list of social projects that you've invested</p>
                    </md-card-header>
                    <md-card-content>
                        <md-table v-model="projects" :table-header-color="tableHeaderColor">
                            <md-table-row slot="md-table-row" slot-scope="{ item }">
                                <md-table-cell md-label="Code">{{ item.code }}</md-table-cell>
                                <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
                                <md-table-cell md-label="Country">{{ item.country }}</md-table-cell>
                                <md-table-cell md-label="Holdings">{{ item.balance }}</md-table-cell>
                                <md-table-cell md-label="Interests">{{ item.interests }}</md-table-cell>
                            </md-table-row>
                        </md-table>
                    </md-card-content>
                </md-card>
            </div>

        </div>
    </div>
</template>

<script>
  import { SimpleTable, OrderedTable } from "@/components";
  import {state} from "../state.js";

  export default {
    components: {
      OrderedTable,
      SimpleTable
    },
    data() {
      return {
        projects: state.projects
      };
    }
  };
</script>
