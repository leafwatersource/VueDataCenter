<template>
  <el-tabs v-model="activeName" type="card">
    <slot name="tab-pane"></slot>
  </el-tabs>
</template>
<script>
  export default {
    name: "tabs",
    data() {
      return {
        activeName: 'first'
      }
    },
  }
</script>


