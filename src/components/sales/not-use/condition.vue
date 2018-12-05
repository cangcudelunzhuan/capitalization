<template>
  <div>
    <ul>
      <li v-for="(cd,index) in conditionData" :key="index">{{cd.label}} : <span class="condition">{{cd.value.toString()}}<i @click="deleteCondition(cd.label)"></i></span></li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'condition',
  props: ['condition'],
  data () {
    return {
    }
  },
  computed: mapState({
    conditionData: state => state.msg.conditionData
  }),
  methods: {
    deleteCondition (data) {
      let _this = this
      this.conditionData.forEach(function (item, index) {
        if (item.label === data) {
          _this.conditionData.splice(index, 1)
          _this.$store.dispatch('conditionData', _this.conditionData)
          _this.$emit('deleteEvent', index)
        }
      })
    }
  }
}
</script>

<style scoped>
   li {
    margin: 10px 0;
    list-style: none;
  }
  .condition {
    background: #eee;
    border: 1px solld #2C3E50;
    padding: 5px 30px 5px 10px;
    border-radius: 10px;
    position: relative;
  }
  .condition i:after {
    content: '';
    background: url(../../../static/close_icon.png) no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -7.5px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
</style>
