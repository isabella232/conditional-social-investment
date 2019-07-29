<template>
    <div class="content">
        <div class="md-layout">
            <div
                    class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
            >
                <nav-tabs-card>
                    <template slot="content">
                        <span class="md-nav-tabs-title">Projects:</span>
                        <md-tabs class="md-success" md-alignment="left">
                            <md-tab id="tab-home" md-label="Bugs" md-icon="bug_report">
                                <nav-tabs-table></nav-tabs-table>
                            </md-tab>

                            <md-tab id="tab-pages" md-label="Website" md-icon="code">
                                <nav-tabs-table></nav-tabs-table>
                            </md-tab>

                            <md-tab id="tab-posts" md-label="server" md-icon="cloud">
                                <nav-tabs-table></nav-tabs-table>
                            </md-tab>
                        </md-tabs>
                    </template>
                </nav-tabs-card>
            </div>
        </div>
    </div>
</template>

<script>
  import {

    NavTabsCard,
    NavTabsTable,

  } from "@/components";

  export default {
    components: {
      NavTabsCard,
      NavTabsTable
    },
    data() {
      return {

      };
    }
  };
</script>
