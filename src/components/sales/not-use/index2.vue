<template>
  <div class="salcesWrap">
    <filterHtml></filterHtml>
    <chartsHtml></chartsHtml>
    <tablesHtml></tablesHtml>
  </div>
</template>

<script>
import filterHtml from './filters.vue'
import chartsHtml from './lineCharts.vue'
import tablesHtml from './tableBlock.vue'
export default {
  name: 'salces',
  components: {
    filterHtml,
    chartsHtml,
    tablesHtml
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    exportPPT () {
      console.log(2)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .salcesWrap {
    padding: 10px
  }
  .operaBtn {
    text-align: right;
  }
  .selectBox {
    margin-top: 20px;
    border: 1px solid #2C3E50;
    padding: 10px;
    overflow: hidden;
    border-radius: 5px;
  }
</style>
