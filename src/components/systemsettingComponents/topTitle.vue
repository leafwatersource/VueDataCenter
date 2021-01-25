<template>
  <div class="headerContent">
    <h1>{{navTitle}}</h1>
    <el-dropdown trigger="click" class="userBox">
      <span class="el-dropdown-link userName">{{Name}}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item class="clearfix">
          <router-link to="/select">权限选项</router-link>
        </el-dropdown-item>
        <el-dropdown-item class="clearfix">
          <span @click="Quit">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "topTItle",
    data() {
      return {
        Name: ''
      }
    },
    computed: {
      ...mapState({
        UserMessage: state => state.datacenterStore.UserMessage,
        navTitle:state => state.systemsettingStore.navTitle
      })
    },
    mounted() {
      this.Name = this.UserMessage['empName'] || this.$cookie.get('empName');
    },
    methods: {
      Quit() {
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
  .headerContent {
    line-height: 82px;
    padding: 0 15px;
    height: 82px;
    /*border-bottom: 1px solid #000;*/
  }

  .headerContent h1 {
    float: left;
  }

  .userBox {
    float: right;

  }
  .userBox .userName{
    cursor: pointer;
  }
 .el-dropdown-menu__item a{
    text-decoration: none;
   color: #606266;
  }
  .el-dropdown-menu__item a:hover{
    background-color: #ecf5ff;
    color: #66b1ff;
  }
</style>
