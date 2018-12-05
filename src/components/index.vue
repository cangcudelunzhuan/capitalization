<template>
  <div>
    <router-link :to="{path: '/sales/index'}" class="link">/sales/index</router-link>
    <router-link :to="{path: '/prices/index'}" class="link">/prices/index</router-link>
  </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<style scoped>
  .link {
    display: block;
    font-size: 14px;
    line-height: 30px;
  }
</style>
