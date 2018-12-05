<template>
  <div class="filters-wrap">
    <el-row class="operaBtn">
      <h1>销量对比分析</h1>
      <el-button type="primary" class="title-btn">返回主页</el-button>
    </el-row>
    <div class="selectAndConditionBox">
      <div class="selectBox">
        <el-row>
          <condition-block :condition="condition"></condition-block>
        </el-row>
        <el-row>
          <div class="select-label">
            <span class="red-star">*</span>
            <span class="select-label-text">数据来源</span>
          </div>
          <div class="select-ele">
            <el-select v-model="source" placeholder="请选择数据来源">
              <el-option
                v-for="item in sourceArr"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </div>
          <div class="select-label">
            <span class="red-star">*</span>
            <span class="select-label-text">起止时间</span>
          </div>
          <div class="select-ele">
            <el-date-picker
              v-model="datetimerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              @change="timeChange">
            </el-date-picker>
          </div>
        </el-row>
        <el-row class="filter-row">
          <div class="select-label">
            <span>&nbsp;</span>
            <span class="select-label-text">区域选择</span>
          </div>
          <div class="select-ele select-right">
            <div class="row-20">
              <el-select v-model="area" filterable placeholder="请选择区域">
                <el-option
                  v-for="item in areaArr"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
            <div class="row-20">
               <el-select v-model="province" filterable placeholder="请选择省份">
                <el-option
                  v-for="item in provinceArr"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
            <div class="row-20">
              <el-select v-model="city" filterable placeholder="请选择城市">
                <el-option
                  v-for="item in cityArr"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-row>
        <el-row class="filter-row">
          <div class="select-label">
            <span>&nbsp;</span>
            <span class="select-label-text">属性选择</span>
          </div>
          <div class="select-ele select-right">
            <div class="row-20">
              <el-select v-model="attrPX"  placeholder="请选择派系" @change="attrPXChange">
                <el-option
                  v-for="item in attrPXArr"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
            <div class="row-20">
              <el-select v-model="attrCS"  placeholder="请选择厂商" @change="attrCSChange">
                <el-option
                  v-for="item in attrCSArr"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
            <div class="row-20">
              <el-select v-model="attrCarType"  placeholder="请选择车辆类型" @change="attrCarTypeChange">
                <el-option
                  v-for="item in attrCarTypeArr"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
            <div class="row-20">
              <el-select v-model="attrCarLevel"  placeholder="请选择车辆级别" @change="attrCarLevelChange">
                <el-option
                  v-for="item in attrCarLevelArr"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
            <div class="row-20">
              <el-select v-model="attrCX"  placeholder="请选择车型" @change="attrCXChange">
                <el-option
                  v-for="item in attrCXArr"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-row>
      </div>
    </div>
    <!--
      <div class="conditionBox">
          <condition :condition='condition' @deleteEvent="deleteEvent"></condition>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import store from '@/vuex/store'
import ComboBoxListApi from '../../api/sales.js'
import conditionBlock from './conditionBlock'
export default {
  name: 'filters',
  components: {
    conditionBlock
  },
  data () {
    return {
      datetimerange: '',
      source: '',
      area: '',
      province: '',
      city: '',
      attrPX: '',
      attrCS: '',
      attrCarType: '',
      attrCarLevel: '',
      attrCX: '',
      sourceArr: null,
      // 区域选择数据，区域省市
      areaArr: null,
      areaArrAll: null,
      provinceArr: null,
      provinceArrAll: null,
      cityArr: null,
      cityArrAll: null,
      // 派系
      attrPXArr: null,
      attrPXArrAll: null,
      // 厂商
      attrCSArr: null,
      attrCSArrAll: null,
      // 车辆类型
      attrCarTypeArr: null,
      attrCarTypeArrAll: null,
      // 车辆级别
      attrCarLevelArr: null,
      attrCarLevelArrAll: null,
      // 车型
      attrCXArr: null,
      attrCXArrAll: null,
      // 条件容器
      // condition: [],
      // 表格数据
      tableData: []
    }
  },
  mounted () {
    this.initData()
  },
  computed: {
    condition () {
      return [{
        'attrName': 'source',
        'label': this.getSelectLabel(this.sourceArr, this.source)
      }, {
        'attrName': 'datetimerange',
        'label': this.timeChange(this.datetimerange)
      }, {
        'attrName': 'area',
        'label': this.getSelectLabel(this.areaArr, this.area)
      }, {
        'attrName': 'province',
        'label': this.getSelectLabel(this.provinceArr, this.province)
      }, {
        'attrName': 'city',
        'label': this.getSelectLabel(this.cityArr, this.city)
      }, {
        'attrName': 'attrPX',
        'label': this.getSelectLabel(this.attrPXArr, this.attrPX)
      }, {
        'attrName': 'attrCS',
        'label': this.getSelectLabel(this.attrCSArr, this.attrCS)
      }, {
        'attrName': 'attrCarType',
        'label': this.getSelectLabel(this.attrCarTypeArr, this.attrCarType)
      }, {
        'attrName': 'attrCarLevel',
        'label': this.getSelectLabel(this.attrCarLevelArr, this.attrCarLevel)
      }, {
        'attrName': 'attrCX',
        'label': this.getSelectLabel(this.attrCXArr, this.attrCX)
      }]
    }
  },
  methods: {
    initData () {
      ComboBoxListApi.GetComboBoxList()
        .then(res => {
          this.sourceArr = res.data.sources
          this.areaArr = res.data.regions
          this.provinceArr = res.data.provinceCitys
          this.cityArr = res.data.citys
          this.attrPXArr = res.data.seriess
          this.attrCSArr = res.data.dealers
          this.attrCarTypeArr = res.data.vehicleTypes
          this.attrCarLevelArr = res.data.vehicleLevels
          this.attrCXArr = res.data.catTypes
        })
        .catch(error => {
          console.log(error)
        })
    },
    timeChange () {
      console.log(this.datetimerange)
      let startTime = time(this.datetimerange[0])
      let endTime = time(this.datetimerange[1])
      function time (data) {
        let date = new Date(data)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let time = year + '/' + month + '/' + day
        return time
      }
      let data = startTime + '-' + endTime
      return data
    },
    cityCascaderChange (data) {
      this.isTrueCondition('区域', data.join('/'))
    },
    attrCSChange (data) {
      this.isTrueCondition('厂商', data)
      this.sendCharData('厂商', data)
    },
    attrCarTypeChange (data) {
      this.isTrueCondition('车辆类型', data)
      this.sendCharData('车辆类型', data)
    },
    attrCarLevelChange (data) {
      this.isTrueCondition('车辆级别', data)
      this.sendCharData('车辆级别', data)
    },
    attrCXChange (data) {
      this.isTrueCondition('车系', data)
      this.sendCharData('车系', data)
    },
    attrPXChange (data) {
      this.isTrueCondition('派系', data)
      this.sendCharData('派系', data)
    },
    getSelectLabel (optionArr, key) {
      console.log(optionArr, key)
      if (optionArr === null) return ''
      for (let i = 0; i < optionArr.length; i++) {
        if (optionArr[i].key === key) {
          return optionArr[i].value
        }
      }
    },
    changeCondition (attrName, label) {
    },
    // 判断回显的条件是否存在
    isTrueCondition (condition, data) {
      let _this = this
      if (this.condition.indexOf(condition) < 0) {
        this.condition.push(condition)
        let obj = {
          label: condition,
          value: []
        }
        obj.value.push(data)
        this.conditionData.push(obj)
      }
      if (_this.condition.indexOf(condition) >= 0) {
        this.conditionData.forEach(function (item, index) {
          if (item.label === condition) {
            if (condition === '时间' || condition === '数据') {
              item.value = []
            }
            if (item.value.indexOf(data) >= 0) return
            item.value.push(data)
          }
        })
      } else {
        let obj = {
          label: condition,
          value: []
        }
        obj.value.push(data)
        this.conditionData.push(obj)
      }
      this.$store.dispatch('conditionData', this.conditionData)
    },
    // 删除回显条件
    deleteEvent (index) {
      switch (this.condition[index]) {
        case '数据':
          this.formLabelAlign.source = ''
          break
        case '时间':
          this.datetimerange = ''
          break
        case '厂商':
          this.formLabelAlign.attrCS = ''
          break
        case '车辆类型':
          this.formLabelAlign.attrCarType = ''
          break
        case '车辆级别':
          this.formLabelAlign.attrCarLevel = ''
          break
        case '派系':
          this.formLabelAlign.attrPX = ''
          break
        case '车系':
          this.formLabelAlign.attrCX = ''
          break
        case '区域':
          this.selectedCityCascader = []
          break
      }
      this.condition.splice(index, 1)
    },
    // 请求图表数据
    sendCharData (attr, data) {
      let source
      let startDate
      let endDate
      let dealer
      let vehicleType
      let vehicleLevel
      let series
      let carType
      let region
      let province
      let city
      switch (attr) {
        case '数据':
          source = data
          break
        case '时间':
          startDate = data
          endDate = data
          break
        case '厂商':
          dealer = data
          break
        case '车辆类型':
          vehicleType = data
          break
        case '车辆级别':
          vehicleLevel = data
          break
        case '派系':
          series = data
          break
        case '车系':
          carType = data
          break
        case '区域':
          region = data
          province = data
          city = data
          break
      }
      ComboBoxListApi.GetCompareAnalyze(source, dealer, vehicleType, vehicleLevel, series, carType, startDate, endDate, region, province, city)
        .then(res => {
          this.tableData.push(res.data.table)
          store.dispatch('tableData', this.tableData)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .filters-wrap {
    text-align: left;
    font-size: 14px;
  }
  .operaBtn {
    text-align: right;
    background-color: #0869b4;
    height: 50px;
    padding-right: 20px;
  }
  .operaBtn h1 {
    float: left;
    font-size: 24px;
    line-height: 50px;
    padding-left: 80px;
    background: url('../../../static/logo.png') no-repeat 5px center;
    color: #fff;
  }
  .operaBtn .title-btn {
    margin-top: 8px;
    background-color: #fff;
    color: #000;
    padding: 8px;
    border-color: none;
  }
  .selectAndConditionBox {
    margin-top: 20px;
    border: 1px solid #2C3E50;
    border-radius: 5px;
    overflow: hidden;
  }
  .filter-row {
    padding-top: 10px;
  }
  .selectAndConditionBox .select-label {
    display: inline-block;
    padding: 0 10px;
    font-weight: bold;
  }
  .select-label .red-star {
    color: #f00;
  }
  .selectAndConditionBox .select-ele {
    display: inline-block;
  }
  .selectAndConditionBox .select-right {
    width: calc(100% - 90px);
    font-size: 0;
  }
  .select-right .row-20 {
    display: inline-block;
    width: 20%;
    box-sizing: border-box;
    padding-right: 10px;
  }
</style>
