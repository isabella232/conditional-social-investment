<template lang="html">
  <TreeChart :json="treeData"/>
</template>

<script>
import TreeChart from "vue-tree-chart";

export default {
  components: {
    	TreeChart
    },
    data() {
        return {
            treeData: {

            }
        }
    }
}
</script>

<style lang="css">
</style>
