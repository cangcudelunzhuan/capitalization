<template>
  <div class="chartsBox" ref='chartsBox'>
    <div id="main" style="width: this.allWidth; height: 420px;"></div>
    <div class="no-data-tip" v-if="tipShow">
      <p>请选择查询条件</p>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
import pricesApi from '../../api/pricesApiLxl.js'
export default {
  name: 'bar',
  computed: mapState({
    pricesQueryInfo: (state) => {
      return state.prices.pricesQueryInfo
    },
    pageType: (state) => state.msg.pageType
  }),
  data () {
    return {
      tipShow: true,
      chart: null,
      allWidth: '',
      dotdata: null,
      color: ['#41C4B3', '#EB9600', '#F44759', '#296AB4', '#B3ACF2']
    }
  },
  watch: {
    pricesQueryInfo () {
      if (this.pageType === 'contrast') {
        this.refreshDotCharts()
      } else if (this.pageType === 'trend') {
        this.refreshTrendChart()
      }
    },
    pageType () {
      if (this.pageType === 'contrast') {
        this.tipShow = true
      } else if (this.pageType === 'trend') {
        this.tipShow = true
      }
    }
  },
  mounted () {
    this.chart = echarts.init(document.getElementById('main'))
    this.allWidth = this.$refs.chartsBox.offsetWidth
    this.resetSize(this.chart)
  },
  methods: {
    resetSize (chart) {
      window.onresize = function () {
        chart.resize()
      }
    },
    refreshDotCharts () {
      let vm = 55
      this.tipShow = false
      this.chart.showLoading({
        text: '加载中...'
      })
      pricesApi.GetComparePrice(this.pricesQueryInfo)
        .then((res) => {
          let seriesArr = []
          let maxSalesNum = 0
          for (let k in res.data.chart) {
            let singleSeries = {
              data: null,
              type: 'scatter',
              symbolSize: function (data) {
                return data[2] / vm
              },
              label: {
                emphasis: {
                  color: '#000',
                  show: true,
                  formatter: function (param) {
                    return param.data[3]
                  },
                  position: 'top'
                }
              }
            }
            let singleData = []
            for (let i = 0; i < res.data.chart[k].length; i++) {
              let arr = []
              if (res.data.chart[k][i].saleNum > maxSalesNum) {
                maxSalesNum = res.data.chart[k][i].saleNum
              }
              arr.push(res.data.chart[k][i].catType)
              if (this.pricesQueryInfo.priceType === '1') {
                arr.push(res.data.chart[k][i].guidancePrice)
              } else if (this.pricesQueryInfo.priceType === '2') {
                arr.push(res.data.chart[k][i].transactionPrice)
              } else if (this.pricesQueryInfo.priceType === '4') {
                arr.push(res.data.chart[k][i].weightingTransactionPrice)
              } else if (this.pricesQueryInfo.priceType === '5') {
                arr.push(res.data.chart[k][i].discounts)
              }
              arr.push(res.data.chart[k][i].saleNum)
              arr.push(res.data.chart[k][i].catStyles)
              singleData.push(arr)
            }
            singleSeries.data = singleData
            seriesArr.push(singleSeries)
          }
          vm = maxSalesNum / 100
          this.dotdata = seriesArr
          let option = {
            color: ['#41C4B3', '#EB9600', '#F44759', '#296AB4', '#B3ACF2'],
            tooltip: {
              formatter: function (param) {
                return '价格：' + param.data[1] + '<br />销量：' + param.data[2]
              }
            },
            legend: {},
            xAxis: {
              type: 'category',
              axisPointer: {
                type: 'shadow'
              },
              axisLabel: {
                show: true,
                interval: 0,
                rotate: 40
              }
            },
            yAxis: {
              scale: true,
              position: 'left'
            },
            series: this.dotdata
          }
          this.chart.clear()
          this.chart.hideLoading()
          this.chart.setOption(option)
        })
        .catch(() => {})
    },
    refreshTrendChart () {
      this.tipShow = false
      this.chart.showLoading({
        text: '加载中...'
      })
      pricesApi.GetTrendPrice(this.pricesQueryInfo)
        .then((res) => {
          let legendData = []
          let seriesData = []
          let seriesDataObj = {}
          let xNumArr = []
          for (let month in res.data.chart) {
            xNumArr.push(month)
            for (let styleType in res.data.chart[month]) {
              legendData.push(styleType)
            }
          }
          // 得到所有车款
          legendData = [...new Set(legendData)]
          for (let i = 0; i < legendData.length; i++) {
            seriesDataObj[legendData[i]] = []
          }
          for (let month in res.data.chart) {
            for (let i = 0; i < legendData.length; i++) {
              if (res.data.chart[month].hasOwnProperty(legendData[i])) {
                // 遍历月下有这个车型
                let monthStyleInfo = res.data.chart[month][legendData[i]][0]
                if (this.pricesQueryInfo.priceType === '1') {
                  seriesDataObj[legendData[i]].push(monthStyleInfo.guidancePrice)
                } else if (this.pricesQueryInfo.priceType === '2') {
                  seriesDataObj[legendData[i]].push(monthStyleInfo.transactionPrice)
                } else if (this.pricesQueryInfo.priceType === '4') {
                  seriesDataObj[legendData[i]].push(monthStyleInfo.weightingTransactionPrice)
                } else if (this.pricesQueryInfo.priceType === '5') {
                  seriesDataObj[legendData[i]].push(monthStyleInfo.discounts)
                }
              } else {
                // 遍历的月下面没有该车型
                seriesDataObj[legendData[i]].push(0)
              }
            }
          }
          for (let styleType in seriesDataObj) {
            let singleSeries = {
              label: {
                show: true,
                position: 'top'
              },
              name: styleType,
              type: 'line',
              data: seriesDataObj[styleType]
            }
            seriesData.push(singleSeries)
          }
          let option = {
            color: this.color,
            tooltip: {
              formatter: '{b}: {c}'
            },
            legend: {
              data: legendData
            },
            xAxis: {
              data: xNumArr
            },
            yAxis: [{
              position: 'left',
              min: function (value) {
                let maxNum = parseInt(parseInt(value.min).toString()[0])
                let min = Math.pow(10, parseInt(value.min).toString().length - 1)
                return min === 1 ? 0 : min * maxNum
              }
            }],
            series: seriesData
          }
          this.chart.clear()
          this.chart.hideLoading()
          this.chart.setOption(option)
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
  .chartsBox {
    position: relative;
    padding: 10px;
    overflow: hidden;
    background: #FFF;
  }
  .no-data-tip {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff url(../../../static/noData.png) no-repeat center 30%;
  }
  .no-data-tip p {
    text-align: center;
    font-size: 14px;
    line-height: 30px;
    color: #0086B3;
    position: relative;
    top: 70%;
  }
</style>
