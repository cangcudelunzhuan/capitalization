<template>
<div class="condition-wrap">
  <div class="condition-title">&nbsp;&nbsp;已选条件:</div>
  <div class="condition-content">
    <span class="single-condition">2018/09/15-2018/10/10<em>x</em></span>
  </div>
</div>
</template>

<script>
export default {
  name: 'ConditionBlock',
  props: ['condition'],
  data () {
    return {
    }
  },
  mounted () {
    console.log(this.condition)
  },
  watch: {
    condition () {
      console.log(this.condition)
    }
  }
}
</script>

<style scoped>
.condition-wrap {
  line-height: 30px;
  padding-bottom: 4px;
}
.condition-title {
  font-weight: bold;
  display: inline-block;
  padding: 0 10px;
}
.condition-content {
  display: inline-block;
  width: calc(100% - 95px);
  vertical-align: top;
}
.condition-content .single-condition {
  display: inline-block;
  font-size: 12px;
  line-height: 20px;
  vertical-align: .2ex;
  border: 1px solid #ff7700;
  color: #FF7700;
  padding-left: 3px;
}
em {
  font-style: normal;
}
.single-condition em {
  display: inline-block;
  padding: 0 3px;
  font-size: 16px;
  cursor: pointer;
  border-left: 1px solid;
  margin-left: 5px;
  padding-bottom: 1px;
}
</style>
