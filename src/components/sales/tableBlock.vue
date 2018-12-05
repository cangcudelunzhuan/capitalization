<template>
  <div class="table-wrap-hsq" ref="tableWrap">
    <div><el-button type="primary" icon="el-icon-document" @click="export2Excel" class="exportExcel">导出</el-button></div>
    <el-table
      :data="tableData"
      @sort-change="tableSortFn"
      stripe
      height="400">
      <el-table-column
        align="center"
        prop="key"
        :label="groupNameLabel"
        >
      </el-table-column>
      <el-table-column
        v-for="item,index in tableHead"
        align="center"
        :sortable="tableHead[index].sortable"
        :prop="item.prop"
        :label="item.label"
        :width="thWidth"
        :key="item.label">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import salesApi from '@/api/sales'
export default {
  name: 'tableBlock',
  data () {
    return {
      thWidth: 40,
      tableData: [],
      groupNameLabel: '厂商',
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
      tableHead: [{label: '', prop: ''}]
    }
  },
  computed: mapState({
    salesQueryInfo: (state) => {
      return state.sales.salesQueryInfo
    },
    pageType: (state) => state.msg.pageType,
    groupName: (state) => state.msg.groupName
  }),
  watch: {
    salesQueryInfo () {
      if (this.pageType === 'contrast') {
        this.refreshContrastTable()
      } else {
        this.refreshTrendTable()
      }
    },
    pageType () {
      if (!this.salesQueryInfo.hasOwnProperty('source')) return
      if (this.pageType === 'contrast') {
        this.refreshContrastTable()
      } else if (this.pageType === 'trend') {
        this.refreshTrendTable()
      }
    },
    groupName () {
      for (let i = 0; i < this.groupOptions.length; i++) {
        if (this.groupOptions[i].value === this.groupName) {
          this.groupNameLabel = this.groupOptions[i].label
        }
      }
      if (!this.salesQueryInfo.hasOwnProperty('source')) return
      if (this.pageType === 'contrast') {
        this.refreshContrastTable()
      } else if (this.pageType === 'trend') {
        this.refreshTrendTable()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getThWidth()
    })
    window.addEventListener('resize', () => {
      let dom = document.querySelector('.table-wrap-hsq')
      if (!dom) return
      let w = dom.clientWidth - 20 - 180
      if (this.salesQueryInfo.hasOwnProperty('source')) {
        if (this.pageType === 'contrast') {
          this.thWidth = parseInt(w / 6)
        } else {
          this.thWidth = parseInt(w / 14)
        }
      } else {
        this.thWidth = w
      }
    })
  },
  methods: {
    getThWidth () {
      // 宽度减去padding 20 , 首列180
      let w = document.querySelector('.table-wrap-hsq').clientWidth - 20 - 180
      if (this.salesQueryInfo.hasOwnProperty('source')) {
        if (this.pageType === 'contrast') {
          this.thWidth = parseInt(w / 6)
        } else {
          this.thWidth = parseInt(w / 14)
        }
      } else {
        this.thWidth = w
      }
    },
    refreshContrastTable () {
      salesApi.GetCompareAnalyze(this.salesQueryInfo, {'groupName': this.groupName})
        .then((res) => {
          let contrastTableHead = [{
            label: '本期销量',
            prop: 'curTermSale',
            sortable: 'custom'
          }, {
            label: '同期销量',
            prop: 'beTermSale',
            sortable: 'custom'
          }, {
            label: '上期销量',
            prop: 'upTermSale',
            sortable: 'custom'
          }, {
            label: '同比(%)',
            prop: 'betheCompare',
            sortable: 'custom'
          }, {
            label: '环比(%)',
            prop: 'loopCompare',
            sortable: 'custom'
          }, {
            label: '市占率(%)',
            prop: 'makeRatio',
            sortable: 'custom'
          }]
          this.getThWidth()
          this.tableHead = contrastTableHead
          let tableData = res.data
          tableData.forEach(item => {
            item.curTermSale = this.toThousands(item.curTermSale)
            item.beTermSale = this.toThousands(item.beTermSale)
            item.upTermSale = this.toThousands(item.upTermSale)
          })
          this.tableData = tableData
        })
        .catch(() => {})
    },
    refreshTrendTable () {
      salesApi.GetTendencyAnalyze(this.salesQueryInfo, {'groupName': this.groupName})
        .then((res) => {
          let trendTableHead = [
            { label: '年', prop: 'year', sortable: false },
            { label: '1月', prop: '01', sortable: 'custom' },
            { label: '2月', prop: '02', sortable: 'custom' },
            { label: '3月', prop: '03', sortable: 'custom' },
            { label: '4月', prop: '04', sortable: 'custom' },
            { label: '5月', prop: '05', sortable: 'custom' },
            { label: '6月', prop: '06', sortable: 'custom' },
            { label: '7月', prop: '07', sortable: 'custom' },
            { label: '8月', prop: '08', sortable: 'custom' },
            { label: '9月', prop: '09', sortable: 'custom' },
            { label: '10月', prop: '10', sortable: 'custom' },
            { label: '11月', prop: '11', sortable: 'custom' },
            { label: '12月', prop: '12', sortable: 'custom' },
            { label: '合计', prop: 'sum', sortable: 'custom' }
          ]
          this.getThWidth()
          this.tableHead = trendTableHead
          let origin = res.data.table
          let tableData = []
          for (let attr in origin) {
            let singleLine = {
              'key': attr.split('_')[0],
              'year': attr.split('_')[1]
            }
            let sum = 0
            for (let i = 0; i < origin[attr].length; i++) {
              singleLine[origin[attr][i].key] = this.toThousands(origin[attr][i].value)
              sum += Number(origin[attr][i].value)
            }
            singleLine.sum = this.toThousands(sum)
            tableData.push(singleLine)
          }
          this.tableData = tableData
        })
        .catch(() => {})
    },
    // 给数字添加千分符
    toThousands (num) {
      num = (num || 0).toString()
      var result = ''
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
      }
      if (num) result = num + result
      return result
    },
    // 表格的排序功能，sortInfo={column, prop, order}包含排序方式信息，根据这个重排tableData
    tableSortFn (sortInfo) {
      let prop
      let order
      if (sortInfo.prop === null) {
        for (let i = 0; i < this.tableHead.length; i++) {
          if (this.tableHead[i].sortable === 'custom') {
            prop = this.tableHead[i].prop
            break
          }
        }
        order = 'descending'
      } else {
        prop = sortInfo.prop
        order = sortInfo.order
      }
      this.tableData.sort((a, b) => {
        let valueA = a[prop] ? Number(a[prop].split(',').join('')) : -Infinity
        let valueB = b[prop] ? Number(b[prop].split(',').join('')) : -Infinity
        if (order === 'descending') {
          return valueB - valueA
        } else {
          return valueA - valueB
        }
      })
    },
    export2Excel () {
      if (this.pageType === 'contrast') {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../excel/Export2Excel')
          const tHeader = [this.groupNameLabel, '本期销量', '同期销量', '上期销量', '同比(%)', '环比(%)', '市占率(%)']
          const filterVal = ['key', 'curTermSale', 'beTermSale', 'upTermSale', 'betheCompare', 'loopCompare', 'makeRatio']
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          console.log(data)
          export_json_to_excel(tHeader, data, '列表excel')
        })
      } else if (this.pageType === 'trend') {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../excel/Export2Excel')
          const tHeader = [this.groupNameLabel, '年', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '总计']
          const filterVal = ['key', 'year', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'sum']
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '列表excel')
        })
      }
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped>
.table-wrap-hsq {
  margin-top: 20px;
  padding: 10px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
}
.exportExcel {
  float: right;
  height: 26px;
  line-height: 1;
  text-align: center;
  padding: 5px 12px;
  margin-right: 18px;
  font-size: 12px;
}
</style>
