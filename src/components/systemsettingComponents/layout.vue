<template>
  <el-container class="ContentWrap">
    <el-aside width="200px"><Nav></Nav></el-aside>
    <el-main class="adminContent">
      <TopTitle></TopTitle>
      <slot name="main" class="adminMain"></slot>
    </el-main>
  </el-container>
</template>

<script>
  import TopTitle from './topTitle'
  import Nav from './nav'
    export default {
        name: "layout",
      components:{
        TopTitle,
        Nav
      }
    }
</script>

<style>
  .ContentWrap {
    height: 100%;
    overflow: hidden;
  }
  .adminContent{
    padding: 0;
  }
  .adminMain{
    box-sizing: border-box;
    height: calc(100% - 83px);
    background-color: #f4f4f4;
    padding: 15px;
  }
  /*/deep/ .el-aside{*/
    /*width: auto !important;*/
  /*}*/
</style>
