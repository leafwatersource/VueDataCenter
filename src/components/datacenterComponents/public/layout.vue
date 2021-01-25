<template>
  <el-container class="ContentWrap">
    <el-header class="header">
      <TopMessage></TopMessage>
    </el-header>
    <el-container id="MainContent">
      <el-aside>
        <Nav></Nav>
      </el-aside>
      <el-main>
        <slot name="main"></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    import Nav from './nav'
    import TopMessage from './topMessage'
    import {mapState} from 'vuex'
    export default {
      name: "layout",
      components: {
        Nav,
        TopMessage
      },
      data() {
        return {
        }
      },
      computed: {
        ...mapState({
          'NavShow':state=>state.datacenterStore.NavShow,
        }),
      },
      mounted() {

      },
      methods: {

      }
    }
</script>

<style scoped>
  .ContentWrap {
    height: 100%;
    overflow: hidden;
  }
#MainContent{
  height: calc(100% - 60px);
  overflow: hidden;
}
  .header {
    padding: 0;
    background-color: #343A40;
  }
  /deep/ .el-aside{
    width: auto !important;
  }
</style>
