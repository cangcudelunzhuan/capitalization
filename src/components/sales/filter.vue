<template>
<div class="filter-wrap">
  <div class="radio-item-wrap">
    <div class="source-wrap">
      <span class="radio-title">数据来源:</span>
      <span>
        <el-select v-model="source" placeholder="请选择">
          <el-option
            v-for="item in sourceArr"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
        </el-select>
      </span>
    </div>
    <div class="timeRange-wrap">
      <span class="radio-title">起止时间:</span>
      <span>
        <el-date-picker
          v-model="startTime"
          type="month"
          placeholder="选择月"
          @change="monthChange">
        </el-date-picker>
        <span>至</span>
        <el-date-picker
          v-model="endTime"
          type="month"
          placeholder="选择月"
          @change="monthChange">
        </el-date-picker>
      </span>
    </div>
    <div class="confirm-btn">
      <el-button type="primary" @click="confirmFn">确定</el-button>
    </div>
  </div>
  <div class="checkbox-item-wrap">
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <p>
            <span class="checkbox-title">省份</span>
            <div class="checked-tips" :title="provinceList.join(',')">
              <el-tag v-for="(tag,index) in provinceList" :key="tag" closable @close="closeTag(index, 'province')">{{tag}}</el-tag>
            </div>
          </p>
        </template>
        <div class="checkbox-content">
          <div class="checkbox-btns">
            <el-button class="check-all-btn" @click="checkAllFn('province')">全选</el-button>
            <el-button class="clear-btn" @click="provinceList = []">清空</el-button>
          </div>
          <alphabet-classify
            :originData="provinceArr"
            :checkedData="provinceList"
            @checkedChange="checkedProvinceChanged"
          >
          </alphabet-classify>
        </div>
      </el-collapse-item>
      <!--城市-->
      <el-collapse-item>
        <template slot="title">
          <p>
            <span class="checkbox-title">城市</span>
            <div class="checked-tips" :title="cityList.join(',')">
              <el-tag v-for="(tag,index) in cityList" :key="tag" closable @close="closeTag(index, 'city')">{{tag}}</el-tag>
            </div>
          </p>
        </template>
        <div class="checkbox-content">
          <div class="checkbox-btns">
            <el-button class="check-all-btn" @click="checkAllFn('city')">全选</el-button>
            <el-button class="clear-btn" @click="cityList = []">清空</el-button>
          </div>
          <alphabet-classify
            :originData="cityArr"
            :checkedData="cityList"
            @checkedChange="checkedCityChanged"
          >
          </alphabet-classify>
        </div>
      </el-collapse-item>
      <!--派系-->
      <el-collapse-item>
        <template slot="title">
          <p>
            <span class="checkbox-title">派系</span>
            <div class="checked-tips" :title="seriesList.join(',')">
              <el-tag v-for="(tag,index) in seriesList" :key="tag" closable @close="closeTag(index, 'series')">{{tag}}</el-tag>
            </div>
          </p>
        </template>
        <div class="checkbox-content">
          <div class="checkbox-btns">
            <el-button class="check-all-btn" @click="checkAllFn('series')">全选</el-button>
            <el-button class="clear-btn" @click="seriesList = []">清空</el-button>
          </div>
          <el-checkbox-group v-model="seriesList" class="check-group-wrap">
            <el-checkbox v-for="item in seriesArr" :label="item.value" :key="item.value"></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-collapse-item>
      <!--厂商-->
      <el-collapse-item>
        <template slot="title">
          <p>
            <span class="checkbox-title">厂商</span>
            <div class="checked-tips" :title="dealerList.join(',')">
              <el-tag v-for="(tag,index) in dealerList" :key="tag" closable @close="closeTag(index, 'dealer')">{{tag}}</el-tag>
            </div>
          </p>
        </template>
        <div class="checkbox-content">
          <div class="checkbox-btns">
            <el-button class="check-all-btn" @click="checkAllFn('dealer')">全选</el-button>
            <el-button class="clear-btn" @click="dealerList = []">清空</el-button>
          </div>
          <alphabet-classify
            :originData="dealerArr"
            :checkedData="dealerList"
            @checkedChange="checkedDealerChanged"
          >
          </alphabet-classify>
        </div>
      </el-collapse-item>
      <!--新能源类型-->
      <el-collapse-item>
        <template slot="title">
          <p>
            <span class="checkbox-title">新能源类型</span>
            <div class="checked-tips" :title="newEnergyTypeList.join(',')">
              <el-tag v-for="(tag,index) in newEnergyTypeList" :key="tag" closable @close="closeTag(index, 'newEnergyType')">{{tag}}</el-tag>
            </div>
          </p>
        </template>
        <div class="checkbox-content">
          <div class="checkbox-btns">
            <el-button class="check-all-btn" @click="checkAllFn('newEnergyType')">全选</el-button>
            <el-button class="clear-btn" @click="newEnergyTypeList = []">清空</el-button>
          </div>
          <el-checkbox-group v-model="newEnergyTypeList" class="check-group-wrap">
            <el-checkbox v-for="item in newEnergyTypeArr" :label="item.value"></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-collapse-item>
      <!--车辆类型-->
      <el-collapse-item>
        <template slot="title">
          <p>
            <span class="checkbox-title">车辆类型</span>
            <div class="checked-tips" :title="vehicleTypeList.join(',')">
              <el-tag v-for="(tag,index) in vehicleTypeList" :key="tag" closable @close="closeTag(index, 'vehicleType')">{{tag}}</el-tag>
            </div>
          </p>
        </template>
        <div class="checkbox-content">
          <div class="checkbox-btns">
            <el-button class="check-all-btn" @click="checkAllFn('vehicleType')">全选</el-button>
            <el-button class="clear-btn" @click="vehicleTypeList = []">清空</el-button>
          </div>
          <el-checkbox-group v-model="vehicleTypeList" class="check-group-wrap">
            <el-checkbox v-for="item in vehicleTypeArr" :label="item.value" :key="item.value"></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-collapse-item>
      <!--车辆级别-->
      <el-collapse-item>
        <template slot="title">
          <p>
            <span class="checkbox-title">车辆级别</span>
            <div class="checked-tips" :title="vehicleLevelList.join(',')">
              <el-tag v-for="(tag,index) in vehicleLevelList" :key="tag" closable @close="closeTag(index, 'vehicleLevel')">{{tag}}</el-tag>
            </div>
          </p>
        </template>
        <div class="checkbox-content">
          <div class="checkbox-btns">
            <el-button class="check-all-btn" @click="checkAllFn('vehicleLevel')">全选</el-button>
            <el-button class="clear-btn" @click="vehicleLevelList = []">清空</el-button>
          </div>
          <el-checkbox-group v-model="vehicleLevelList" class="check-group-wrap">
            <el-checkbox v-for="item in vehicleLevelArr" :label="item.value"></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-collapse-item>
      <!--车型-->
      <el-collapse-item>
        <template slot="title">
          <p>
            <span class="checkbox-title">车型</span>
            <div class="checked-tips" :title="carTypeList.join(',')">
              <el-tag v-for="(tag,index) in carTypeList" :key="tag" closable @close="closeTag(index, 'carType')">{{tag}}</el-tag>
            </div>
          </p>
        </template>
        <div class="checkbox-content">
          <div class="checkbox-btns">
            <el-button class="check-all-btn" @click="checkAllFn('carType')">全选</el-button>
            <el-button class="clear-btn" @click="carTypeList = []">清空</el-button>
          </div>
          <alphabet-classify
            :originData="carTypeArr"
            :checkedData="carTypeList"
            @checkedChange="checkedCarTypeChanged"
          >
          </alphabet-classify>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</div>
</template>

<script>
import salesApi from '@/api/sales'
import alphabetClassify from './alphabetClassify'
import store from '@/vuex/store'
export default {
  name: 'FilterBlock',
  components: {
    alphabetClassify
  },
  data () {
    return {
      source: '',
      sourceArr: null,
      startTime: null,
      endTime: null,
      // 省-市
      provinceList: [],
      provinceArr: null,
      provinceArrAll: null,
      cityList: [],
      cityArr: null,
      cityArrAll: null,
      // 派系-厂商-车辆类型-新能源类型-车辆级别-车型
      seriesList: [],
      seriesArr: null,
      seriesArrAll: null,
      dealerList: [],
      dealerArr: null,
      dealerArrAll: null,
      vehicleTypeList: [],
      vehicleTypeArr: null,
      vehicleTypeArrAll: null,
      newEnergyTypeList: [],
      newEnergyTypeArr: null,
      newEnergyTypeArrAll: null,
      vehicleLevelList: [],
      vehicleLevelArr: null,
      vehicleLevelArrAll: null,
      carTypeList: [],
      carTypeArr: null,
      carTypeArrAll: null
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    // 根据数据来源source的不同
    source () {
      let parentKey = this.source
      // 筛选出数据来源的省份
      let provinceArr = []
      for (let i = 0; i < this.provinceArrAll.length; i++) {
        if (this.provinceArrAll[i].parentKey === parentKey) {
          provinceArr.push(this.provinceArrAll[i])
        }
      }
      this.provinceArr = provinceArr
      // 筛选出数据来源的 派系
      let seriesArr = []
      this.seriesArrAll.forEach((series) => {
        if (series.parentKey === parentKey) {
          seriesArr.push(series)
        }
      })
      this.seriesArr = seriesArr
      // 筛选出数据来源的 厂商
      let dealerArr = []
      this.dealerArrAll.forEach((dealer) => {
        if (dealer.parentKey === parentKey) {
          dealerArr.push(dealer)
        }
      })
      this.dealerArr = dealerArr
      // 筛选出数据来源的 新能源类型
      let newEnergyTypeArr = []
      this.newEnergyTypeArrAll.forEach((newEnergyType) => {
        if (newEnergyType.parentKey === parentKey) {
          newEnergyTypeArr.push(newEnergyType)
        }
      })
      this.newEnergyTypeArr = newEnergyTypeArr
      // 筛选出数据来源的 车辆类型
      let vehicleTypeArr = []
      this.vehicleTypeArrAll.forEach((vehicleType) => {
        if (vehicleType.parentKey === parentKey) {
          vehicleTypeArr.push(vehicleType)
        }
      })
      this.vehicleTypeArr = vehicleTypeArr
      // 车辆级别
      let vehicleLevelArr = []
      this.vehicleLevelArrAll.forEach((vehicleLevel) => {
        if (vehicleLevel.parentKey === parentKey) {
          vehicleLevelArr.push(vehicleLevel)
        }
      })
      this.vehicleLevelArr = vehicleLevelArr
      // 车型
      let carTypeArr = []
      this.carTypeArrAll.forEach((carType) => {
        if (carType.parentKey === parentKey) {
          carTypeArr.push(carType)
        }
      })
      this.carTypeArr = carTypeArr
    }
  },
  methods: {
    init () {
      salesApi.GetComboBoxList()
        .then(res => {
          this.provinceArrAll = res.data.province
          this.sourceArr = res.data.sources
          this.cityArr = res.data.citys
          this.seriesArrAll = res.data.seriess
          this.dealerArrAll = res.data.dealers
          this.vehicleTypeArrAll = res.data.vehicleTypes
          this.newEnergyTypeArrAll = res.data.newEnergyType
          this.vehicleLevelArrAll = res.data.vehicleLevels
          this.carTypeArr = res.data.catTypes
          this.carTypeArrAll = res.data.catTypes
          this.source = 'JQX'
        })
        .catch(error => {
          console.log(error)
        })
    },
    timeChange () {
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
      let dateStr = startTime + '-' + endTime
      this.dateRangeStr = dateStr
    },
    monthChange () {
      if (this.startTime === null || this.endTime === null) return
      if (this.startTime > this.endTime) {
        let temp = this.startTime
        this.startTime = this.endTime
        this.endTime = temp
      }
    },
    closeTag (index, attrName) {
      switch (attrName) {
        case 'province':
          this.provinceList.splice(index, 1)
          break
        case 'city':
          this.cityList.splice(index, 1)
          break
        case 'series':
          this.seriesList.splice(index, 1)
          break
        case 'dealer':
          this.dealerList.splice(index, 1)
          break
        case 'vehicleType':
          this.vehicleTypeList.splice(index, 1)
          break
        case 'newEnergyType':
          this.newEnergyTypeList.splice(index, 1)
          break
        case 'vehicleLevel':
          this.vehicleLevelList.splice(index, 1)
          break
        case 'carType':
          this.carTypeList.splice(index, 1)
          break
      }
    },
    checkedCityChanged (checkedList) {
      this.cityList = checkedList
    },
    checkedProvinceChanged (checkedList) {
      this.provinceList = checkedList
    },
    checkedDealerChanged (checkedList) {
      this.dealerList = checkedList
    },
    checkedCarTypeChanged (checkedList) {
      this.carTypeList = checkedList
    },
    checkAllFn (attrName) {
      let listAll = []
      switch (attrName) {
        case 'province':
          this.provinceArr.forEach((item) => {
            listAll.push(item.value)
          })
          this.provinceList = this.deleteArrRepeatFn(this.provinceList.concat(listAll))
          break
        case 'city':
          this.cityArr.forEach((item) => {
            listAll.push(item.value)
          })
          this.cityList = this.deleteArrRepeatFn(this.cityList.concat(listAll))
          break
        case 'series':
          this.seriesArr.forEach((item) => {
            listAll.push(item.value)
          })
          this.seriesList = this.deleteArrRepeatFn(this.seriesList.concat(listAll))
          break
        case 'dealer':
          this.dealerArr.forEach((item) => {
            listAll.push(item.value)
          })
          this.dealerList = this.deleteArrRepeatFn(this.dealerList.concat(listAll))
          break
        case 'vehicleType':
          this.vehicleTypeArr.forEach((item) => {
            listAll.push(item.value)
          })
          this.vehicleTypeList = this.deleteArrRepeatFn(this.vehicleTypeList.concat(listAll))
          break
        case 'newEnergyType':
          this.newEnergyTypeArr.forEach((item) => {
            listAll.push(item.value)
          })
          this.newEnergyTypeList = this.deleteArrRepeatFn(this.newEnergyTypeList.concat(listAll))
          break
        case 'vehicleLevel':
          this.vehicleLevelArr.forEach((item) => {
            listAll.push(item.value)
          })
          this.vehicleLevelList = this.deleteArrRepeatFn(this.vehicleLevelList.concat(listAll))
          break
        case 'carType':
          this.carTypeArr.forEach((item) => {
            listAll.push(item.value)
          })
          this.carTypeList = this.deleteArrRepeatFn(this.carTypeList.concat(listAll))
          break
      }
    },
    deleteArrRepeatFn (arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            arr.splice(j, 1)
            j--
          }
        }
      }
      return arr
    },
    confirmFn () {
      if (this.source === '') {
        this.$message({
          showClose: true,
          message: '请选择数据来源',
          type: 'warning'
        })
        return
      }
      if (this.startTime === null || this.endTime === null) {
        this.$message({
          showClose: true,
          message: '请选择时间',
          type: 'warning'
        })
        return
      }
      function formateTime (d) {
        let y = d.getFullYear().toString()
        let m = (d.getMonth() + 1).toString()
        if (m.length < 2) {
          m = '0' + m
        }
        return y + m
      }
      function formateSituation (a) {
        if (a.length === 0) {
          return ''
        } else {
          return "'" + a.join("','") + "'"
        }
      }
      let queryInfo = {
        source: this.source,
        startDate: formateTime(this.startTime),
        endDate: formateTime(this.endTime),
        province: formateSituation(this.provinceList),
        city: formateSituation(this.cityList),
        series: formateSituation(this.seriesList),
        dealer: formateSituation(this.dealerList),
        vehicleType: formateSituation(this.vehicleTypeList),
        newEnergyType: formateSituation(this.newEnergyTypeList),
        vehicleLevel: formateSituation(this.vehicleLevelList),
        carType: formateSituation(this.carTypeList)
      }
      store.dispatch('salesQueryInfo', queryInfo)
    }
  }
}
</script>

<style scoped>
.filter-wrap {
  background-color: #fff;
  text-align: left;
  height: 300px;
  margin-top: 10px;
  overflow-y: scroll;
  padding-left: 4px;
  padding-bottom: 10px;
}
.radio-item-wrap {
  padding: 5px;
  position: relative;
}
.source-wrap,
.timeRange-wrap {
  display: inline-block;
  font-size: 13px;
}
.source-wrap {
  margin-right: 20px;
}
.radio-title {
  font-weight: bold;
}
.radio-title:before {
  display: inline-block;
  color: #f00;
  content: '*';
  padding-right: 4px;
}
.confirm-btn {
  position: absolute;
  right: 20px;
  top: 5px;
}
.checkbox-title {
  display: inline-block;
  font-weight: bold;
  padding-left: 14px;
  position: relative;
}
.checked-tips {
  position: absolute;
  right: 50px;
  top: 0;
  width: calc(100% - 150px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}
.checkbox-content .check-group-wrap {
  padding-left: 20px;
  max-height: 200px;
  overflow: auto;
  margin-right: 20px;
}
.search-input {
  width: 150px;
}
.checkbox-btns {
  padding-right: 20px;
  text-align: right;
}
.checkbox-btns:after {
  content: '';
  display: block;
  clear: both;
}
.checkbox-btns .clear-btn,
.checkbox-btns .check-all-btn {
  padding: 5px 8px;
  float: right;
}
.checkbox-btns .clear-btn {
  margin-right: 5px;
  margin-left: 5px;
}
</style>
