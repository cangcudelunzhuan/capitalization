<template>
  <div class="chartsBox" ref='chartsBox'>
    <div class="group-wrap">
      <span>维度：</span>
      <el-select class="group-select" v-model="groupNameTemp">
        <el-option
          v-for="item in groupOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div id="main" style="width: this.allWidth; height: 400px;"></div>
    <div class="no-data-tip" v-if="tipShow">
      <p>请选择查询条件</p>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
import store from '@/vuex/store'
import salesApi from '@/api/sales'
export default {
  name: 'SalesChart',
  computed: mapState({
    salesQueryInfo: (state) => {
      return state.sales.salesQueryInfo
    },
    pageType: (state) => state.msg.pageType,
    groupName: (state) => state.msg.groupName
  }),
  watch: {
    // 时间维度特殊刷新
    pageType () {
      if (!this.salesQueryInfo.hasOwnProperty('source')) return
      if (this.pageType === 'contrast') {
        this.refreshContrastChart()
      } else if (this.pageType === 'trend') {
        if (this.groupNameTemp === 'ZMONTH') {
          this.refreshTrendChart()
        } else {
          this.refreshTrendChart1()
        }
      }
    },
    salesQueryInfo () {
      if (this.pageType === 'contrast') {
        this.refreshContrastChart()
      } else if (this.pageType === 'trend') {
        if (this.groupNameTemp === 'ZMONTH') {
          this.refreshTrendChart()
        } else {
          this.refreshTrendChart1()
        }
      }
    },
    groupName () {
      if (this.pageType === 'contrast') {
        this.refreshContrastChart()
      } else if (this.pageType === 'trend') {
        if (this.groupNameTemp === 'ZMONTH') {
          this.refreshTrendChart()
        } else {
          this.refreshTrendChart1()
        }
      }
    },
    groupNameTemp () {
      store.dispatch('groupName', this.groupNameTemp)
    }
  },
  data () {
    return {
      tipShow: true,
      chart: null,
      allWidth: '',
      groupNameTemp: 'NICK_NAME',
      groupOptions: [{
        value: 'ZMONTH',
        label: '时间'
      }, {
        value: 'PROVINCE',
        label: '省份'
      }, {
        value: 'CITY',
        label: '城市'
      }, {
        value: 'CARFACTIONS',
        label: '派系'
      }, {
        value: 'NICK_NAME',
        label: '厂商'
      }, {
        value: 'VEHICLE_CATEGORY',
        label: '车辆类型'
      }, {
        value: 'NEW_ENERGY_TYPE',
        label: '新能源类型'
      }, {
        value: 'VEHICLE_CLASS',
        label: '车辆级别'
      }, {
        value: 'VEHICLE_TYPE',
        label: '车型'
      }],
      constrastSelected: {
        '本期销量': true, '同期销量': true, '上期销量': false, '同比': true, '环比': false, '市占率': false
      },
      color: ['#41C4B3', '#EB9600', '#F44759', '#296AB4', '#B3ACF2', '#99CE6A']
    }
  },
  mounted () {
    this.chart = echarts.init(document.getElementById('main'))
    this.allWidth = this.$refs.chartsBox.offsetWidth
    this.resetSize(this.chart)
    this.chart.on('legendselectchanged', (params) => {
      if (this.pageType === 'contrast') {
        this.constrastSelected = params.selected
      }
    })
  },
  methods: {
    refreshContrastChart () {
      let vm = this
      this.tipShow = false
      this.chart.showLoading({
        text: '加载中...'
      })
      salesApi.GetCompareAnalyze(this.salesQueryInfo, {'groupName': this.groupName})
        .then((res) => {
          res.data = res.data.slice(0, 15)
          let xAxisData = []
          let curTermSale = []
          let beTermSale = []
          let upTermSale = []
          let betheCompare = []
          let loopCompare = []
          let makeRatio = []
          for (let i = 0; i < res.data.length; i++) {
            xAxisData.push(res.data[i].key)
            curTermSale.push(res.data[i].curTermSale)
            beTermSale.push(res.data[i].beTermSale)
            upTermSale.push(res.data[i].upTermSale)
            betheCompare.push(res.data[i].betheCompare)
            loopCompare.push(res.data[i].loopCompare)
            makeRatio.push(res.data[i].makeRatio)
          }
          let option = {
            // color: ['#c23531', '#2f4554', '#61a0a8', '#91c7ae', '#d48265', '#6e7074', '#546570', '#c4ccd3'],
            color: this.color,
            tooltip: {
            },
            legend: {
              data: ['本期销量', '同期销量', '上期销量', '同比', '环比', '市占率'],
              selected: this.constrastSelected
            },
            xAxis: {
              data: xAxisData,
              axisLabel: {
                interval: 0,
                rotate: -20,
                margin: 10
              }
            },
            yAxis: [{
              position: 'left',
              name: '/ 辆'
            }, {
              position: 'right',
              name: '%'
            }],
            series: [{
              label: {
                show: true,
                position: 'top',
                formatter: (params) => {
                  return vm.toThousands(params.data)
                }
              },
              name: '本期销量',
              type: 'bar',
              yAxisIndex: 0,
              data: curTermSale
            }, {
              label: {
                show: true,
                position: 'top',
                formatter: (params) => {
                  return vm.toThousands(params.data)
                }
              },
              name: '同期销量',
              type: 'bar',
              yAxisIndex: 0,
              data: beTermSale
            }, {
              label: {
                show: true,
                position: 'top',
                formatter: (params) => {
                  return vm.toThousands(params.data)
                }
              },
              name: '上期销量',
              type: 'bar',
              yAxisIndex: 0,
              data: upTermSale
            }, {
              label: {
                show: true,
                position: 'top',
                formatter: (params) => {
                  return params.data + '%'
                }
              },
              name: '同比',
              type: 'line',
              yAxisIndex: 1,
              data: betheCompare,
              tooltip: {
                formatter: (params) => {
                  return vm.tooltipFormatter(params)
                }
              }
            }, {
              label: {
                show: true,
                position: 'top',
                formatter: (params) => {
                  return params.data + '%'
                }
              },
              name: '环比',
              type: 'line',
              yAxisIndex: 1,
              data: loopCompare,
              tooltip: {
                formatter: (params) => {
                  return vm.tooltipFormatter(params)
                }
              }
            }, {
              label: {
                show: true,
                position: 'top',
                formatter: (params) => {
                  return params.data + '%'
                }
              },
              name: '市占率',
              type: 'line',
              yAxisIndex: 1,
              data: makeRatio,
              tooltip: {
                formatter: (params) => {
                  return vm.tooltipFormatter(params)
                }
              }
            }]
          }
          this.chart.clear()
          this.chart.hideLoading()
          this.chart.setOption(option)
        })
        .catch(() => {})
    },
    // 格式化图表中的tooltip显示，后面增加%号
    tooltipFormatter (params) {
      let color = this.color[params.seriesIndex]
      let str = `<p>${params.seriesName}</p>
                 <p>
                   <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>
                   <span>${params.name}: ${params.data} %</span>
                 </p>`
      return str
    },
    // 为数字添加千分符
    toThousands (num) {
      num = (num || 0).toString()
      let result = ''
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
      }
      if (num) { result = num + result }
      return result
    },
    // 非时间维度，图表中的
    refreshTrendChart1 () {
      this.tipShow = false
      this.chart.showLoading({
        text: '加载中...'
      })
      salesApi.GetTendencyAnalyze(this.salesQueryInfo, {'groupName': this.groupName})
        .then((res) => {
          let vm = this
          let chartData = res.data.table
          let monthRange = this.calcDateRange(this.salesQueryInfo.startDate, this.salesQueryInfo.endDate).monthRange
          // 计算table数据, 省份，城市，厂商，车型的取排行前五，其余取全部
          let legendData = []
          for (let attr in chartData) {
            let item = attr.split('_')[0]
            if (legendData.indexOf(item) === -1) legendData.push(item)
          }
          if (['PROVINCE', 'CITY', 'NICK_NAME', 'VEHICLE_TYPE'].indexOf(this.groupName) !== -1) {
            legendData = legendData.slice(0, 5)
          }
          let seriesData = []
          // 遍历lengendData生成时间对应的数据
          for (let i = 0; i < legendData.length; i++) {
            let item = legendData[i]
            let singleSeries = {
              label: {
                show: true,
                position: 'top',
                formatter: (params) => {
                  return vm.toThousands(params.data)
                }
              },
              name: item,
              type: 'line',
              data: null
            }
            let singleSeriesData = []
            // 遍历chartData有对应的年的数据，再遍历年下面有对应月的数据
            for (let j = 0; j < monthRange.length; j ++) {
              let year = monthRange[j].substring(0, 4)
              let attr = item + '_' + year
              if (chartData.hasOwnProperty(attr)) {
                let month = monthRange[j].substring(4, 6)
                let flag = false
                for (let m = 0; m < chartData[attr].length; m++) {
                  if (chartData[attr][m].key === month) {
                    singleSeriesData.push(chartData[attr][m].value)
                    flag = true
                  }
                }
                if (!flag) singleSeriesData.push(null)
              } else {
                singleSeriesData.push(null)
              }
            }
            singleSeries.data = singleSeriesData
            seriesData.push(singleSeries)
          }
          // 初始化已选中lengend
          let selectedLegend = {}
          legendData.forEach((legend, index) => {
            selectedLegend[legend] = (index === 0)
          })
          
          let option = {
            color: this.color,
            tooltip: {},
            legend: {
              data: legendData,
              selected: selectedLegend
            },
            xAxis: {
              data: monthRange,
              axisLabel: {
                interval: 0,
                rotate: -30,
                margin: 10
              }
            },
            yAxis: [{
              position: 'left',
              name: '/ 辆'
            }],
            series: seriesData
          } 
          this.chart.clear()
          this.chart.hideLoading()
          this.chart.setOption(option)
          
        })
        .catch(() => {})
    },
    // 传入一个时间范围‘201704’ - ‘201806’，计算区间年、月份名称数组
    calcDateRange (startMonth, endMonth) {
      let startYear = Number(startMonth.substring(0, 4))
      let endYear = Number(endMonth.substring(0, 4))
      let startM = Number(startMonth.substring(4, 6))
      let endM = Number(endMonth.substring(4, 6))

      let yearRange = []
      for (let y = startYear; y <= endYear; y++) {
        yearRange.push(y.toString())
      }

      let rangeResult = []
      for (; startYear <= endYear; startYear++) {
        for (; startM <= 12; startM++) {
          let monthStr = startM < 10 ? '0' + startM.toString() : startM.toString()
          rangeResult.push(startYear.toString() + monthStr)
          if (startYear === endYear && startM === endM) {
            break
          }
        }
        startM = 1
      }
      return { monthRange: rangeResult, yearRange: yearRange }
    },
    refreshTrendChart () {
      this.tipShow = false
      this.chart.showLoading({
        text: '加载中...'
      })
      salesApi.GetTendencyAnalyze(this.salesQueryInfo, {'groupName': 'NICK_NAME'})
        .then((res) => {
          let vm = this
          let chartData = res.data.chart
          let legendData = []
          let seriesData = []
          for (let attr in chartData) {
            legendData.push(attr + '年')
            let singleSeries = {
              label: {
                show: true,
                position: 'top',
                formatter: (params) => {
                  return vm.toThousands(params.data)
                }
              },
              name: attr + '年',
              type: 'line',
              data: null
            }
            let singleSeriesData = []
            for (let i = 1; i < 13; i++) {
              let hasMonthFlag = false
              for (let j = 0; j < chartData[attr].length; j++) {
                if (Number(chartData[attr][j].key) === i) {
                  singleSeriesData[i - 1] = chartData[attr][j].value
                  hasMonthFlag = true
                }
              }
              if (!hasMonthFlag) singleSeriesData[i - 1] = null
            }
            singleSeries.data = singleSeriesData
            seriesData.push(singleSeries)
          }
          let option = {
            color: this.color,
            tooltip: {},
            legend: {
              data: legendData,
              selected: this.constrastSelected
            },
            xAxis: {
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: [{
              position: 'left',
              name: '/ 辆'
            }],
            series: seriesData
          }
          this.chart.clear()
          this.chart.hideLoading()
          this.chart.setOption(option)
        })
        .catch(() => {})
    },
    resetSize (chart) {
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }
  }
}
</script>

<style scoped>
  .chartsBox {
    margin-top: 20px;
    padding: 40px 10px 10px;
    overflow: hidden;
    position: relative;
    background-color: #fff;
  }
  .group-wrap {
    font-size: 14px;
    line-height: 30px;
    position: absolute;
    top: 10px;
  }
  .group-wrap span {
    font-weight: bold;
  }
  .group-wrap .group-select .el-input__inner {
    height: 30px;
    line-height: 30px;
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
  .chart-tooltip-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    vertical-align: middle;
    border-radius: 50%;
    background-color: #0086B3;
  }
</style>
