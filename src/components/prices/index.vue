<template>
  <div class="pricesWrap">
    <bannerHtml :titleName="titleTemp"></bannerHtml>
    <filterHtml></filterHtml>
    <dotchartsHtml></dotchartsHtml>
    <tablesHtml></tablesHtml>
  </div>
</template>

<script>
import bannerHtml from './banner.vue'
import filterHtml from './filters.vue'
import dotchartsHtml from './dotcharts.vue'
import tablesHtml from './tableBlock.vue'
import { mapState } from 'vuex'
export default {
  name: 'prices',
  components: {
    bannerHtml,
    filterHtml,
    dotchartsHtml,
    tablesHtml
  },
  computed: mapState({
    pageType: (state) => state.msg.pageType
  }),
  data () {
    return {
      titleTemp: '价格对比分析'
    }
  },
  watch: {
    pageType () {
      if (this.pageType === 'contrast') {
        this.titleTemp = '价格对比分析'
      } else if (this.pageType === 'trend') {
        this.titleTemp = '价格趋势分析'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pricesWrap {
    min-width: 905px;
    overflow-x: scroll !important;
    background: #F5F5F5;
    padding-bottom: 40px;
  }
  </style>
