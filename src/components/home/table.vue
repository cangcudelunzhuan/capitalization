<template id="">
  <div class="tableContent" v-loading="loading">
    <input type="hidden" name="" value="" v-model="router">
    <input type="hidden" name="" value="" v-model="crumbs">
    <div class="tableToolbox clearfix">
      <el-input placeholder="查询" v-model="searchText" class="tableSearchBox floatRight">
        <el-button slot="append" icon="el-icon-search" @click="searchList()"></el-button>
      </el-input>
      <el-button type="primary" @click="add({}, false)">新增</el-button>
      <div class="" class="filebox">
        <el-button type="primary" @click="exportIn()" >
          导入
        </el-button>
        <input type="file" ref="file" @change="fileChange"  class="files" />
      </div>
      <el-button type="primary" @click="excelOut">导出</el-button>
    </div>
    <el-table ref="multipleTable"
      :data="resData.dataList"
      :height="heightT - 217"
      stripe class="tableBox" >
      <el-table-column v-for="(item, index) in resData.columnInfoList"
      v-if= "item.prop!=='rowKey' && item.prop !==resData.autoUser && item.prop!==resData.autoDate"
        :prop="item.prop"  :show-overflow-tooltip="true" :fit="true" :min-width="item.lable.length<5?180:item.lable.length*35"
        :label="item.lable">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="add(scope.row, true)" type="text" size="small" >修改</el-button>
          <el-button @click="dele(scope.row)" type="text" size="small" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagebox">
      <el-pagination
        layout="total,sizes,prev, pager, next"
        :page-sizes="[10,20]"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :total="resData.dataListCount">
      </el-pagination>
    </div>
    <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogShow" custom-class="confirmDialog hastitle" :lock-scroll="true"
    width="800px" :center="true" :show-close="false" ref="dialog" >
      <el-scrollbar :style="{height:heightT-260+'px'}" ref="scrollbar">
        <formBox  v-if="dialogShow"
        :data="resData.columnInfoList"
        :resData = "resData"
        :inputData="inputData"
        :dialogTitle="dialogTitle"
        @addImportRecord="addImportRecord"
        @update="update"></formBox>
      </el-scrollbar>
  </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import dialog from '@/util/dialog'
  import toas from '@/util/message'
  import formBox from '@/components/home/formbox'
  export default {
    components: {
      formBox
    },
    computed:{
      heightT () {
        return this.$store.getters.contentH - 50
      },
      router () {
        let router = this.$route.params.id
        this.setRouterData()
        this.id = router
        this.getList()
        return router
      },
      crumbs () {
        let crumbs = this.$route.query.crumbs === 'true'
        this.$store.commit('CRUMBSTATUS', {crumbStatus: crumbs})
        return crumbs
      }
    },
    mounted () {
      // this.getList(this.router)
    },
    data () {
      return {
        id: null,
        searchText:'',
        dialogShow: false,
        numPerPage: 10,
        currentPage: 1,
        audit_status: 0,
        dialogTableVisible: true,
        loading:false,
        resData:{
          deatilData: {
            total: 5,
            item: [{
              name:'sdsds',
              age:'22'
            },{
              name:'xxxsdsds',
              age:'22xxx'
            }]
          },
          columnData:['name','age'],
          titleData:['姓名','年龄'],
          searchName:'请输入编号',
          auditKey:'',
          auditStausList:[]
        },
        showFlag: false,
        inputData: {},
        dialogTitle: '',
        file: ''
      }
    },
    // watch:{
    //   id (newval, oldval) {
    //     this.audit_status = 0
    //   }
    // },
    methods: {
      setRouterData () {
        let vm = this
        let routerdata = {keyPath: this.$route.query.router}
        vm.$store.commit('ROUTERDATA', {routerData: routerdata})
      },
      async getList (page) {
        let vm = this
        let Page = page || 1
        vm.loading = true
        let params = {
          id: vm.id,
          key: vm.searchText,
          pageNum: Page,
          numPerPage: vm.numPerPage
        }
        let res = await this.$store.dispatch('getSearch', params)
        vm.resData = res.data
        // vm.currentPage = page
        vm.loading = false
        vm.$refs.multipleTable.bodyWrapper.scrollTop = 0
        vm.$refs.multipleTable.bodyWrapper.scrollLeft = 0
      },
      async dele (row) {
        let vm = this
        let params = {
          msg: '删除后不可修复,确定删除吗？',
          title: '你确定要移除吗'
        }
        let res = await this.$store.dispatch('checkSure', params)
        this.loading = true
        let pass = {
          formCode: vm.id,
          mainkeys: row.mainKey
        }
        try {
          let dele = await this.$store.dispatch('deleteRecordLists', pass)
          this.loading = false
          toas.message({
            type: 'success',
            msg: '操作成功'
          })
          this.getList()
        } catch (e) {
          this.loading = false
        }
      },
      async update (data) {
        let vm = this
        let getParam = vm.getParam(data)
        let ci = await this.$store.dispatch('checkCity', getParam)
        vm.loading = true
        data.mainKey = vm.inputData.mainKey
        data.STATUS = data.STATUS || '1'
        let dataListString = `[${JSON.stringify(data)}]`
        let params = {
          formCode: vm.id,
          dataListString: dataListString,
          mainKey: vm.resData.mainKey
        }
        try {
          let res = await this.$store.dispatch('updateRecord', params)
          vm.loading = false
          this.dialogShow = false
          toas.message({
            type: 'success',
            msg: '操作成功'
          })
          vm.getList()
        } catch (e) {
          vm.loading = false
        }
      },
      handleCurrentChange (val) {
        this.getList(val)
      },
      handleSizeChange (val) {
        this.numPerPage = val
      },
      searchList () {
        this.getList()
      },
      add (row, flag) {
        this.dialogShow = true
        this.inputData = row || {}
        this.dialogTitle = flag ? '修改内容':'新增内容'
        setTimeout(() => {
          let div = this.$refs['scrollbar'].$refs['wrap']
          div.scrollTop= 0
        }, 500)
      },
      async addImportRecord (data) {
        let vm = this
        let getParam = vm.getParam(data)
        let ci = await this.$store.dispatch('checkCity', getParam)
        vm.loading = true
        data.STATUS = data.STATUS || '1'
        let dataListString = `[${JSON.stringify(data)}]`
        let params = {
          formCode: vm.id,
          dataListString: dataListString,
          createUser: '',
        }
        try {
          let res = await this.$store.dispatch('addImportRecord', params)
          vm.loading = false
          this.dialogShow = false
          toas.message({
            type: 'success',
            msg: '操作成功'
          })
          vm.getList()
        } catch (e) {
          vm.loading = false
        }
      },
      async exportIn () {
        let vm = this
        if (!this.file) {
          toas.message({
            type: 'error',
            msg: '请选择一个表格文件'
          })
          return
        }
        vm.loading = true
        let formData = new FormData()
        formData.append('file', this.file)
        let params = {
          formCode: vm.id,
          file: formData
        }
        try {
          let res = await this.$store.dispatch('importExcle', params)
          vm.loading = false
          toas.message({
            type: 'success',
            msg: '操作成功'
          })
          vm.getList()
        } catch (e) {
          vm.loading = false
        }
      },
      fileChange (e) {
        this.file = e.target.files[0]
        this.exportIn()
      },
      getParam (data) {
        let vm = this
        let keyV = ''
        if (vm.id === '1' || vm.id === '2' || vm.id === '3') {
          keyV = 'YEAR'
        } else if (vm.id === '4') {
          keyV = 'YEAR_MONTH'
        } else if (vm.id === '5') {
          keyV = 'JD'
        }
        let param = {
          city: data.CITY,
          formCode: vm.id,
          date: data[keyV] || ''
        }
        return param
      },
      async excelOut () {
        let vm = this
        vm.loading = true
        let a = document.createElement('a')
        a.style.display = 'none'
        a.href = '/capitalization/import/getDataReportExcle?formCode=' + vm.id
        document.body.appendChild(a)
        a.click()
        vm.loading = false
        // try {
        //   let params = {
        //     formCode: vm.id
        //   }
        //   await this.$store.dispatch('ReportExcle', params)
        //   vm.loading = false
        // } catch (e) {
        //   vm.loading = false
        // }
      }
    }
  }
</script>
<style media="screen">
  .tableContent{
    margin-top: 45px
  }
</style>
