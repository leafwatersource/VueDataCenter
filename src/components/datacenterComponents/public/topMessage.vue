<template>
  <div class="MessageBox">
    <span class="title">{{NavTitle}}-PlanMate-APS</span>
    <i class="fa fa-bars menu" title="隐藏/显示导航" @click="ChangeNavShow(!NavShow)"></i>
    <el-dropdown trigger="click" class="userBox">
      <span class="el-dropdown-link" v-text="Name" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item class="clearfix">
          <router-link to="/datacenterConfig">用户设置</router-link>
        </el-dropdown-item>
        <el-dropdown-item class="clearfix">
          <span @click="Quit">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  export default {
    name: "topMessage",
    data(){
      return {
        Name:''
      }
    },
   computed:{
     ...mapState({
       'NavShow':state=>state.datacenterStore.NavShow,
       'NavTitle':state=>state.datacenterStore.NavTitle,
       'UserMessage':state=>state.datacenterStore.UserMessage,
     }),
   },
    mounted(){
      this.Name = this.UserMessage['empName'] || this.$cookie.get('empName');
    },
    methods:{
      ...mapMutations(['ChangeNavShow']),
      Quit(){
        //退出登录
        this.$cookie.delete("empName");
        this.$cookie.delete("sysID");
        this.$cookie.delete("defaultActiveRouter");
        this.$router.replace('/');
        console.log('退出登录');
      }
    }
  }
</script>

<style scoped>
  @import "../../../assets/font-awesome-4.7.0/css/font-awesome.min.css";
  .MessageBox {
    padding: 0 20px;
    color: #fff;
    line-height: 60px;
  }
  .MessageBox .title{
    font-size: 14px;
    margin-right: .5rem;

  }
  .menu{
    cursor: pointer;
    font-size: 14px;
  }
  .userBox{
    float: right;
    font-size: 12px;

  }
  .userBox .el-dropdown-link{
    color: #fff;
    cursor: pointer;
  }
</style>
