<template>
    <div class="content">
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25">
                <stats-card data-background-color="orange">
                    <template slot="header">
                        <md-icon>content_copy</md-icon>
                    </template>

                    <template slot="content">
                        <p class="category">Used Space</p>
                        <h3 class="title">
                            49/50
                            <small>GB</small>
                        </h3>
                    </template>

                    <template slot="footer">
                        <div class="stats">
                            <md-icon class="text-danger">warning</md-icon>
                            <a href="#pablo">Get More Space...</a>
                        </div>
                    </template>
                </stats-card>
            </div>
            <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
            >
                <stats-card data-background-color="red">
                    <template slot="header">
                        <md-icon>info_outline</md-icon>
                    </template>

                    <template slot="content">
                        <p class="category">Fixed Issues</p>
                        <h3 class="title">75</h3>
                    </template>

                    <template slot="footer">
                        <div class="stats">
                            <md-icon>local_offer</md-icon>
                            Tracked from Github
                        </div>
                    </template>
                </stats-card>
            </div>
        </div>
    </div>
</template>

<script>
  import {
    StatsCard,
    // NavTabsTable
  } from "@/components";

  // import ConditionCard from '@/components/Cards/ConditionCard';

  import State from '@/state';
  import Chain from '@/Blockchain';

  export default {
    name: "conditions-dashboard",
    data () {
        return {
            conditions: State.state.conditions,
        }
    },
    components: {
      StatsCard,
      // NavTabsTable,
      // 'condition-card': ConditionCard
    },
    methods: {
      getContract: State.getContract(),
    },
    beforeMount() {
      this.getContract();
    },
  }
</script>
