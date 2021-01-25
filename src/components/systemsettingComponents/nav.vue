<template>
  <el-menu
    :default-active="defaultActiveIndex"
    class="el-menu-vertical-demo"
    background-color="#212529"
    text-color="#fff"
    id="adminNav"
    router
    @select="handleSelect"
    :collapse-transition="false"
    active-text-color="#007bff">
    <div class="logoBox">
      <div class="logoContent">
      </div>
      <p class="logoMessage">AdminConfig</p>
    </div>
    <el-menu-item index="1" route="/datacenterConfig">
      <i class="el-icon-menu"></i>
      <span slot="title">订单查询配置</span>
    </el-menu-item>
    <el-menu-item index="2" route="/implementationConfig">
      <i class="el-icon-menu"></i>
      <span slot="title">执行计划配置</span>
    </el-menu-item>
    <el-menu-item index="3" route="/historyEventConfig">
      <i class="el-icon-menu"></i>
      <span slot="title">事件记录配置</span>
    </el-menu-item>
    <el-menu-item index="4" route="/userSetting">
      <i class="el-icon-menu"></i>
      <span slot="title">用户账号管理</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  export default {
    data(){
      return {
        defaultActiveIndex:"1",
      }
    },
    computed:{
      ...mapState({
        systemDefaultActive:state=>state.systemsettingStore.systemDefaultActive,
      })
    },
    mounted(){
      this.defaultActiveIndex = this.systemDefaultActive|| this.$cookie.get('systemDefaultActive')||'1';
      console.log(this.defaultActiveIndex)
    },

    methods: {
      ...mapMutations(['setSystemDefaultActive']),
      handleSelect(index){
        this.defaultActiveIndex = index;
        this.setSystemDefaultActive(index);
        this.$cookie.set('systemDefaultActive',index);
      }
    }
  }
</script>

<style scoped>
  #adminNav {
    background-color: #212529;
    height: 100%;
    z-index: 10;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  #adminNav::-webkit-scrollbar {
    display: none;
  }
  .logoBox{
    display: flex;
    padding: 15px;
    border-bottom: 1px solid rgba(54,62,70,1);
  }
  .logoBox .logoContent{
    width: 50px;
    height: 50px;
    border: 1px solid #ffffff;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    overflow: hidden;
    background: url("../../assets/image/logo-white.png");
    background-size:cover;
    background-position: 50% 20%;
  }
  .logoBox .logoMessage{
    padding-left: 12px;
    text-align: center;
    color: #ffffff;
    line-height: 52px;
  }

</style>
