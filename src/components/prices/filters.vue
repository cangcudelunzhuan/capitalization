<template>
  <div>
    <div class="box">
      <div class="selectBox">
        <el-form :inline="true">
          <el-form-item label="日期" v-if="contrast">
            <el-date-picker
              v-model="startTime"
              type="month"
              placeholder="请选择日期"
              @change="monthChange">
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="endTime"
              type="month"
              placeholder="请选择日期"
              @change="monthChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="日期" v-else>
            <el-date-picker
              v-model="datetime"
              type="month"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="城市">
            <el-select v-model="selectedCity" placeholder="请选择城市">
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格类型">
            <el-select v-model="priceType" placeholder="请选择价格类型">
              <el-option
                v-for="item in priceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchFn">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="checkAndSearchAndTagsBox">
        <div class="carType">
          <div class="searchAndTagsBox">
            <div class="searchBox">
              <h1>请选择需要搜索的车型：</h1>
            </div>
            <div class="tagsBox" v-if="!contrast">
              <el-tag
                :key="tag"
                v-for="tag in checkedCarType"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-button class="clear-btn" @click="checkedCarType = []">清空</el-button>
            </div>
          </div>
          <div class="checkBox">
            <alphabet-classify
              :originData="carTypeBox"
              :checkedData="checkedCarType"
              @checkedChange="checkedCityChanged">
            </alphabet-classify>
          </div>
        </div>
        <div class="styleType" v-if="contrast">
          <div class="searchAndTagsBox searchAndTagsStyleTypeBox">
            <div class="searchBox">
              <h1>请选择需要搜索的款型：</h1>
            </div>
            <div class="tagsBox">
              <el-tag
                :key="tag"
                v-for="tag in checkedStyleTags"
                closable
                :disable-transitions="false"
                @close="handleCloseStyleType(tag)">
                {{tag}}
              </el-tag>
              <el-button class="clear-btn" @click="checkedStyle = []">清空</el-button>
            </div>
          </div>
          <div class="checkBox styleTypeCheckBox">
            <el-checkbox-group v-model="checkedStyle" @change="checkedStyleChanged">
              <el-checkbox v-for="item in styleTypeBox" :label="item.key" :key="item.key">
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import alphabetClassify from '../sales/alphabetClassify'
import ComboBoxListApi from '../../api/pricesApiLxl.js'
import store from '../../vuex/store'
import { mapState } from 'vuex'
export default {
  name: 'filters',
  components: {
    alphabetClassify
  },
  computed: {
    checkedStyleTags () {
      return this.checkedStyle.slice(0, 5)
    },
    ...mapState({
      pageType: (state) => state.msg.pageType
    })
  },
  data () {
    return {
      trend: true,
      contrast: false,
      datetime: null,
      startTime: null,
      endTime: null,
      selectedCity: '',
      cityOptions: [],
      priceType: '',
      priceTypeOptions: [{
        value: '1',
        label: '指导价'
      }, {
        value: '2',
        label: '成交价'
      }, {
        value: '4',
        label: '加权成交价'
      }, {
        value: '5',
        label: '优惠力度'
      }],
      checkedCarType: null,
      carTypeBox: [],
      checkedStyle: [],
      styleTypeBox: null
    }
  },
  mounted () {
    this.initData()
    if (this.pageType === 'contrast') {
      this.contrast = false
      this.trend = true
    } else if (this.pageType === 'trend') {
      this.contrast = true
      this.trend = false
    }
  },
  watch: {
    checkedCarType () {
      let checkableStyle = []
      for (let i = 0; i < this.checkedCarType.length; i++) {
        for (let j = 0; j < this.styleTypeBoxAll.length; j++) {
          if (this.styleTypeBoxAll[j].parentKey === this.checkedCarType[i]) {
            checkableStyle.push(this.styleTypeBoxAll[j])
          }
        }
      }
      this.styleTypeBox = checkableStyle
      // 存储需要删除的车款的index位置
      /* let needDelIndex = []
      for (let i = 0; i < this.checkedStyle.length; i++) {
        let currentStyle = this.checkedStyle[i]
        let currentStyleParentKey = ''
        for (let j = 0; j < checkableStyle.length; j++) {
          if (checkableStyle[j].key === currentStyle) {
            currentStyleParentKey = checkableStyle[j].parentKey
            break
          }
        }
        // 标记车型中是否有该车款parentKey
        let flag = false
        this.checkedCarType.forEach((carType) => {
          if (carType === currentStyleParentKey) flag = true
        })
        if (!flag) needDelIndex.push(i)
      }
      // 根据需要删除的标记数组，产生新的checkedStyle数据
      let checkedStyle = []
      for (let i = 0; i < this.checkedStyle.length; i++) {
        if (needDelIndex.indexOf(i) === -1) {
          checkedStyle.push(this.checkedStyle[i])
        }
      }
      this.checkedStyle = checkedStyle */
    },
    pageType () {
      if (this.pageType === 'contrast') {
        this.selectedCity = ''
        this.priceType = ''
        this.checkedCarType = []
        this.checkedStyle = []
        this.datetime = null
        this.startTime = null
        this.endTime = null
        this.contrast = false
        this.trend = true
      } else if (this.pageType === 'trend') {
        this.selectedCity = ''
        this.priceType = ''
        this.checkedCarType = []
        this.checkedStyle = []
        this.datetime = null
        this.startTime = null
        this.endTime = null
        this.contrast = true
        this.trend = false
      }
    },
    checkedStyle () {
      let checkableStyleAll = []
      for (let i = 0; i < this.checkedStyle.length; i++) {
        for (let j = 0; j < this.styleTypeBoxAll.length; j++) {
          if (this.styleTypeBoxAll[j].value === this.checkedStyle[i]) {
            checkableStyleAll.push(this.styleTypeBoxAll[j].parentKey)
          }
        }
      }
      this.checkableStyleAll = checkableStyleAll
    }
  },
  methods: {
    // 加载下拉框城市
    initData () {
      ComboBoxListApi.GetComboBoxList()
        .then(res => {
          let arr = []
          for (let i = 0; i < res.data.citys.length; i++) {
            let obj = {}
            obj.value = res.data.citys[i].key
            obj.label = res.data.citys[i].value
            arr.push(obj)
          }
          this.cityOptions = arr
          this.carTypeBox = res.data.catTypes
          this.styleTypeBoxAll = res.data.catStyles
        })
        .catch(() => {
        })
    },
    // checkBox数据
    handleTypeNum (value) {
      if (value.length > 1) {
        value.splice(0, 1)
      }
    },
    handleTypeChangeNum (value) {
      if (value.length > 5) {
        this.$message({
          message: '最多只能选择5个类型',
          type: 'warning'
        })
        value.splice(5, 1)
      }
    },
    handleClose (tag) {
      this.checkedCarType.splice(this.checkedCarType.indexOf(tag), 1)
    },
    handleCloseStyleType (tag) {
      this.checkedStyle.splice(this.checkedStyle.indexOf(tag), 1)
    },
    checkedCityChanged (checkedList) {
      this.checkedCarType = checkedList
      if (this.pageType === 'trend') {
        this.handleTypeNum(checkedList)
      }
      if (this.pageType === 'contrast') {
        this.handleTypeChangeNum(checkedList)
      }
    },
    checkedStyleChanged (checkedList) {
      this.handleTypeChangeNum(checkedList)
      this.checkedStyle = checkedList
    },
    searchFn () {
      if (this.pageType === 'contrast') {
        if (this.datetime === null) {
          this.$message({
            message: '请选择日期',
            type: 'warning'
          })
          return
        }
      }
      if (this.pageType === 'trend') {
        if (this.startTime === null) {
          this.$message({
            message: '请选择日期',
            type: 'warning'
          })
          return
        }
      }
      if (this.pageType === 'trend') {
        if (this.endTime === null) {
          this.$message({
            message: '请选择日期',
            type: 'warning'
          })
          return
        }
      }
      if (this.selectedCity === '') {
        this.$message({
          message: '请选择城市',
          type: 'warning'
        })
        return
      }
      if (this.priceType === '') {
        this.$message({
          message: '请选择价格类型',
          type: 'warning'
        })
        return
      }
      if (Object.prototype.toString.call(this.checkedCarType) === '[object Array]' && this.checkedCarType.length === 0) {
        this.$message({
          message: '请选择车型',
          type: 'warning'
        })
        return
      }
      if (this.pageType === 'trend') {
        if (Object.prototype.toString.call(this.checkedStyle) === '[object Array]' && this.checkedStyle.length === 0) {
          this.$message({
            message: '请选择款型',
            type: 'warning'
          })
          return
        }
      }
      function formateTime (d) {
        if (d === null) return
        let y = d.getFullYear().toString()
        let m = (d.getMonth() + 1).toString()
        if (m.length < 2) {
          m = '0' + m
        }
        return y + m
      }
      // 数组去重
      function uniq (array) {
        var temp = [] // 一个新的临时数组
        for (var i = 0; i < array.length; i++) {
          if (temp.indexOf(array[i]) === -1) {
            temp.push(array[i])
          }
        }
        return temp
      }
      let catType = ''
      if (this.pageType === 'contrast') {
        catType = uniq(this.checkedCarType).join(',')
      }
      if (this.pageType === 'trend') {
        catType = uniq(this.checkableStyleAll).join(',')
      }
      let queryInfo = {
        date: formateTime(this.datetime),
        city: this.selectedCity,
        priceType: this.priceType,
        catType: catType,
        catStyle: this.checkedStyle.join(','),
        startDate: formateTime(this.startTime),
        endDate: formateTime(this.endTime)
      }
      store.dispatch('pricesQueryInfo', queryInfo)
    },
    monthChange () {
      if (this.startTime === null || this.endTime === null) return
      if (this.startTime > this.endTime) {
        let temp = this.startTime
        this.startTime = this.endTime
        this.endTime = temp
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .box {
    margin-top: 10px;
    padding: 5px 0 5px 10px;
    overflow: hidden;
    margin-bottom: 20px;
    background: #FFF;
  }
  .box .selectBox {
    width: 100%;
    min-width: 352px;
    height: 40px;
  }
  .box .checkAndSearchAndTagsBox {
    float: left;
    width: 100%;
  }
  .box .checkAndSearchAndTagsBox .searchAndTagsBox {
    float: left;
    line-height: 40px;
  }
  .box .checkAndSearchAndTagsBox .searchAndTagsStyleTypeBox {
    line-height: 40px;
  }
  .box .checkAndSearchAndTagsBox .searchAndTagsBox .searchBox {
    float: left;
    width: 200px;
  }
  .box .checkAndSearchAndTagsBox .searchAndTagsBox .searchBox h1 {
    font-size: 15px;
    color: #606266;
    font-weight: normal;
  }
  .box .checkAndSearchAndTagsBox .searchAndTagsBox .tagsBox {
    float: left;
  }
  .box .checkAndSearchAndTagsBox .searchAndTagsBox .tagsBox .el-tag{
    margin-right: 5px;
    height: 25px;
    line-height: 25px;
  }
  .box .checkAndSearchAndTagsBox .checkBox{
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    margin-bottom: 5px;
  }
  .box .checkAndSearchAndTagsBox .styleTypeCheckBox {
    width: 100%;
    height: 100%;
    max-height: 100px;
    overflow-y: scroll;
  }
  .box .checkAndSearchAndTagsBox .styleTypeCheckBox .el-checkbox__label {
    width: 300px;
  }
  .box .checkAndSearchAndTagsBox .checkBox .el-checkbox {
    margin-left: 0;
    margin-right: 15px;
  }
  .box .el-input {
    width: 150px;
  }
  .box .el-button {
    width: 64px;
    margin-top: 5px;
    height: 30px;
    padding: 0;
  }
</style>
