<template id="">
  <div class="">
    <el-form ref="form" :model="formData" label-width="200px">
      <el-form-item :label="item.lable"
      v-if= "item.prop!=='rowKey' && item.prop !==resData.autoUser && item.prop!==resData.autoDate && item.prop!=='STATUS'"
      v-for = "(item, index) in formItem">
        <el-input v-model="formData[item.prop]"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('add')" v-if="title==='新增内容'">创建</el-button>
        <el-button type="primary" @click="onSubmit('update')" v-else>修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
  export default {
    props: ['data', 'inputData', 'dialogTitle', 'resData'],
    data () {
      return {
      }
    },
    computed: {
      formItem () {
        return this.data
      },
      formData () {
        let vm = this
        let form = {}
        vm.data.map((item, i) => {
          form[item.prop] = this.inputData[item.prop]
        })
        return form
      },
      title () {
        return this.dialogTitle
      }
    },
    methods: {
      onSubmit (type) {
        let arr = this.formData
        let newob = {}
        for (let k in arr) {
          if (arr[k] !== '') {
            newob[k] = arr[k]
          }
        }
        if (type === 'add') {
          this.$emit('addImportRecord', newob)
        } else if (type === 'update') {
          this.$emit('update', newob)
        }
      }
    }
  }
</script>
<style media="screen">

</style>
