<template>
  <div class="tablesBox">
    <div><el-button type="primary" icon="el-icon-document" @click="export2Excel" class="exportExcel">导出</el-button></div>
    <el-table
      v-loading="loading.active"
      stripe
      :element-loading-text="loading.text"
      :data="tableData"
      style="width: 100%;"
      empty-text="暂无数据"
      :height="tableHeight"
      @sort-change="tableSortFn">
      <el-table-column
        prop="catType"
        label="车型"
        align="center">
      </el-table-column>
      <el-table-column
        prop="catStyles"
        label="款型"
        align="center"
        width="460px">
      </el-table-column>
      <el-table-column
        v-for="item in tableHeaderData"
        :sortable="item.sortable"
        :prop="item.prop"
        :label="item.label"
        align="center"
        :key="item.prop">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import pricesApi from '../../api/pricesApiLxl.js'
export default {
  name: 'tableBlock',
  computed: mapState({
    pricesQueryInfo: (state) => {
      return state.prices.pricesQueryInfo
    },
    pageType: (state) => state.msg.pageType
  }),
  data () {
    return {
      // 加载提示状态
      loading: {
        active: false,
        text: ''
      },
      tableHeight: 400,
      tableHeaderData: [{
        prop: 'saleRatio',
        label: '销量占比',
        sortable: 'custom'
      }, {
        prop: 'guidancePrice',
        label: '指导价',
        sortable: 'custom'
      },{
        prop: 'transactionPrice',
        label: '成交价',
        sortable: 'custom'
      }, {
        prop: 'weightingTransactionPrice',
        label: '加权成交价',
        sortable: 'custom'
      }, {
        prop: 'discounts',
        label: '优惠力度',
        sortable: 'custom'
      }],
      tableData: []
    }
  },
  watch: {
    pricesQueryInfo () {
      if (this.pageType === 'contrast') {
        this.refreshContrastTable()
      } else if (this.pageType === 'trend') {
        this.refreshTrendTable()
      }
    },
    pageType () {
      if (this.pageType === 'contrast') {
        this.tableHeaderData = [{
          prop: 'saleRatio',
          label: '销量占比',
          sortable: 'custom'
        }, {
          prop: 'guidancePrice',
          label: '指导价',
          sortable: 'custom'
        },{
          prop: 'transactionPrice',
          label: '成交价',
          sortable: 'custom'
        }, {
          prop: 'weightingTransactionPrice',
          label: '加权成交价',
          sortable: 'custom'
        }, {
          prop: 'discounts',
          label: '优惠力度',
          sortable: 'custom'
        }]
        this.tableData = []
      } else if (this.pageType === 'trend') {
        this.tableHeaderData = [
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
          { label: '总计', prop: 'sum', sortable: 'custom' }
        ]
        this.tableData = []
      }
    }
  },
  mounted () {
  },
  methods: {
    refreshContrastTable () {
      pricesApi.GetComparePrice(this.pricesQueryInfo)
        .then((res) => {
          let contrastTableHead = [{
            prop: 'saleRatio',
            label: '销量占比',
            sortable: 'custom'
          }, {
            prop: 'guidancePrice',
            label: '指导价',
            sortable: 'custom'
          }, {
            prop: 'transactionPrice',
            label: '成交价',
            sortable: 'custom'
          }, {
            prop: 'weightingTransactionPrice',
            label: '加权成交价',
            sortable: 'custom'
          }, {
            prop: 'discounts',
            label: '优惠力度',
            sortable: 'custom'
          }]
          this.tableHeaderData = contrastTableHead
          let arr = []
          for (let i = 0; i < res.data.table.length; i++) {
            for (let k in res.data.table[i]) {
              arr.push(res.data.table[i][k])
            }
          }
          this.tableData = arr
        })
        .catch(() => {})
    },
    refreshTrendTable () {
      pricesApi.GetTrendPrice(this.pricesQueryInfo)
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
            { label: '总计', prop: 'sum', sortable: 'custom' }
          ]
          this.tableHeaderData = trendTableHead
          let arr = []
          for (let styleType in res.data.table) {
            let obj = {
              catType: styleType.split('##')[0],
              catStyles: styleType.split('##')[1],
              year: styleType.split('##')[2],
              '01': '0',
              '02': '0',
              '03': '0',
              '04': '0',
              '05': '0',
              '06': '0',
              '07': '0',
              '08': '0',
              '09': '0',
              '10': '0',
              '11': '0',
              '12': '0',
              sum: 0
            }
            for (let i = 0; i < res.data.table[styleType].length; i++) {
              obj[res.data.table[styleType][i].key] = res.data.table[styleType][i].value
              obj.sum += parseInt(res.data.table[styleType][i].value)
            }
            arr.push(obj)
          }
          this.tableData = arr
        })
        .catch(() => {})
    },
    showLoading: function (text) {
      this.loading = {
        active: true,
        text: text
      }
    },
    hideLoading: function () {
      this.loading = {
        active: false,
        text: ''
      }
    },
    // 表格的排序功能，sortInfo={column, prop, order}包含排序方式信息，根据这个重排tableData
    tableSortFn (sortInfo) {
      let prop
      let order
      if (sortInfo.prop === null) {
        for (let i = 0; i < this.tableHeaderData.length; i++) {
          if (this.tableHeaderData[i].sortable === 'custom') {
            prop = this.tableHeaderData[i].prop
            break
          }
        }
        order = 'descending'
      } else {
        prop = sortInfo.prop
        order = sortInfo.order
      }
      this.tableData.sort((a, b) => {
        let valueA = a[prop] ? Number(a[prop].toString().split(',').join('')) : -Infinity
        let valueB = b[prop] ? Number(b[prop].toString().split(',').join('')) : -Infinity
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
          const tHeader = ['车型', '款型', '销量占比', '指导价', '成交价', '加权成交价', '优惠力度']
          const filterVal = ['catType', 'catStyles', 'saleRatio', 'guidancePrice', 'transactionPrice', 'weightingTransactionPrice', 'discounts']
          const list = this.tableData
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '列表excel')
        })
      } else if (this.pageType === 'trend') {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../excel/Export2Excel')
          const tHeader = ['车型', '款型', '年', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '总计']
          const filterVal = ['catType', 'catStyles', 'year', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'sum']
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
  .tablesBox {
    margin-top: 20px;
    padding: 10px;
    overflow: hidden;
    background: #FFF;
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
