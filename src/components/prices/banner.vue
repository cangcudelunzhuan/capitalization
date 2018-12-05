<template>
  <div class="banner-wrap">
    <div class="bannerTitle">
      <h1 class="title">{{titleName}}</h1>
    </div>
    <div class="toggleContrastAndTrend">
      <el-button type="primary" @click="skipContrast" :class="contrastStyle" class="left-btn">对比</el-button>
      <el-button type="primary" @click="skipTrend" :class="trendStyle" class="right-btn">趋势</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/vuex/store'
export default {
  name: 'BannerHtml',
  props: ['titleName'],
  data () {
    return {
      contrastStyle: 'nav',
      trendStyle: 'title-btn'
    }
  },
  computed: mapState({
    pageType: (state) => state.msg.pageType
  }),
  mounted () {
    if (this.pageType === 'contrast') {
      this.skipContrast()
    } else {
      this.skipTrend()
    }
  },
  methods: {
    skipContrast () {
      store.dispatch('pageType', 'contrast')
      this.contrastStyle = 'nav'
      this.trendStyle = 'title-btn'
    },
    skipTrend () {
      store.dispatch('pageType', 'trend')
      this.contrastStyle = 'title-btn'
      this.trendStyle = 'nav'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .banner-wrap {
    position: relative;
  }
  .title {
    text-align: left;
    font-size: 24px;
    line-height: 50px;
    color: #fff;
    background-color: #0869b4;
    padding-left: 80px;
    background: #0869b4 url('../../../static/logo.png') no-repeat 5px center;
  }
  .toggleContrastAndTrend {
    position: absolute;
    top: 10px;
    right: 40px;
    font-size: 0;
    border: 1px solid #174988;
    border-radius: 5px;
  }
  .toggleContrastAndTrend .title-btn {
    background-color: #0869b4;
    color: rgba(255,255,255,.6);
  }
  .nav {
    background-color: #174988;
    color: #fff;
  }
  .toggleContrastAndTrend .left-btn {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    padding: 8px 15px;
  }
  .toggleContrastAndTrend .right-btn {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 8px 15px;
  }
</style>
