<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <slot name="tab-pane">

    </slot>

  </el-tabs>
</template>

<script>
    export default {
        name: "tabs",
      data(){
          return {
            activeName: 'first'
          }
      },
      methods:{
        handleClick(tab, event) {
          console.log(tab, event);
        }
      }
    }
</script>

<style scoped>

</style>
