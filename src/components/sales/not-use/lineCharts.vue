<template>
  <div class="chartsBox" ref='chartsBox'>
    <div id="main" style="width: this.allWidth;height:400px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'bar',
  data () {
    return {
      allWidth: '',
      option: {
        tooltip: {},
        legend: {
          data: ['2016', '2017', '2018']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          label: {
            show: true,
            position: 'top'
          },
          name: '2016',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        }, {
          label: {
            show: true,
            position: 'top'
          },
          name: '2017',
          type: 'line',
          data: [53, 220, 346, 120, 110, 230]
        }, {
          label: {
            show: true,
            position: 'top'
          },
          name: '2018',
          type: 'line',
          data: [45, 205, 366, 130, 140, 260]
        }]
      }
    }
  },
  mounted () {
    let chart = echarts.init(document.getElementById('main'))
    this.allWidth = this.$refs.chartsBox.offsetWidth
    this.initChart(chart)
    this.resetSize(chart)
  },
  methods: {
    initChart (chart) {
      chart.setOption(this.option)
    },
    resetSize (chart) {
      window.onresize = function () {
        chart.resize()
      }
    }
  }
}
</script>

<style scoped>
  .chartsBox {
    margin-top: 20px;
    border: 1px solid #2C3E50;
    padding: 10px;
    overflow: hidden;
    border-radius: 5px;
  }
</style>
