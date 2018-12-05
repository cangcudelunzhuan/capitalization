<template>
  <div class="salcesWrap">
    <bannerHtml :titleName="titleName"></bannerHtml>
    <filter-block></filter-block>
    <chartsHtml></chartsHtml>
    <tablesHtml></tablesHtml>
  </div>
</template>

<script>
import bannerHtml from '@/components/prices/banner'
import filterBlock from './filter'
import chartsHtml from './charts.vue'
import tablesHtml from './tableBlock.vue'
import { mapState } from 'vuex'
export default {
  name: 'salces',
  components: {
    bannerHtml,
    filterBlock,
    chartsHtml,
    tablesHtml
  },
  computed: mapState({
    pageType: (state) => state.msg.pageType
  }),
  data () {
    return {
      titleName: '销量对比分析'
    }
  },
  watch: {
    pageType () {
      if (this.pageType === 'contrast') {
        this.titleTemp = '销量对比分析'
      } else if (this.pageType === 'trend') {
        this.titleTemp = '销量趋势分析'
      }
    }
  }
}
</script>

<style scoped>
.salcesWrap {
  /*min-width: 940px;*/
  background-color: #F5F5F5;
  padding-bottom: 40px;
}
</style>
