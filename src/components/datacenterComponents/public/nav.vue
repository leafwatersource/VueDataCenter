<template>
  <el-menu
    :default-active="defaultActiveIndex"
    class="el-menu-vertical-demo"
    @close="handleClose"
    background-color="#212529"
    text-color="#fff"
    id="Nav"
    router
    @select="handleSelect"
    :collapse="NavShow"
    :collapse-transition="false"
    active-text-color="#007bff">
    <img src="../../../assets/image/logo-white.png" style="" v-if="!NavShow" alt/>
    <el-menu-item index="1" route="/datacenter">
      <i class="el-icon-menu"></i>
      <span slot="title">订单查询</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>执行计划</span>
      </template>
      <el-menu-item-group>
        <el-menu-item :index="'/Implementation/'+item.viewname"
                      :route="'/Implementation/'+item.viewname"
                      v-for="item in ImplementationResGroup"
                      :key="item.viewname"
                      v-text="item.viewname"
                      :data="item.viewname"
                      @click="ChangeCurImplementationResGroup(item.viewname)"
        />
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="/history">
      <i class="el-icon-setting"></i>
      <span slot="title">事件记录</span>
    </el-menu-item>
    <el-submenu index="4">
      <template slot="title">
        <i class="fa fa-bar-chart MyIcon"/>
        <span>统计中心</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/statistics">设备状态</el-menu-item>
        <!--<el-menu-item index="/Statistics">设备负载</el-menu-item>-->
        <!--<el-menu-item index="/Statistics">生产达成</el-menu-item>-->
        <!--<el-menu-item index="/Statistics">订单生产进度</el-menu-item>-->
        <el-menu-item index="/resStatistics">产能分析</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  export default {
    name: "Nav",
    data(){
      return {
        // ImplementationResGroup:[],//执行计划设备组
        defaultActiveIndex:"1"
      }

    },
    computed:{
      ...mapState({
        'NavShow':state=>state.datacenterStore.NavShow,
        'ImplementationResGroup':state=>state.datacenterStore.ImplementationResGroup,
      }),
    },
    mounted(){
      this.defaultActiveIndex = this.$cookie.get('defaultActiveRouter')? this.$cookie.get('defaultActiveRouter'):'1';
      this.GetImplementationData()
    },
    methods: {
      ...mapMutations(['GetImplementationData','ChangeCurImplementationResGroup']),
      //菜单按钮的点击事件
      handleSelect(index){
        this.defaultActiveIndex = index;
        this.$cookie.set('defaultActiveRouter',index);
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      // GetImplementationData() {
      //   this.$http({
      //     url: "ViewGroup"
      //   }).then(res => {
      //     if (res.status == 1) {
      //       res.groupList = JSON.parse(res.groupList);
      //     }
      //     this.ImplementationResGroup = res.groupList;
      //     console.log(this.ImplementationResGroup)
      //   });
      //
      // },
    }
  }
</script>

<style scoped>
  @import "../../../assets/font-awesome-4.7.0/css/font-awesome.min.css";
  #Nav {
    background-color: #212529;
    height: 100%;
    z-index: 10;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  #Nav::-webkit-scrollbar {
    display: none;
  }
  img {
    display: block;
    width: 70%;
    height: 80px;
    margin: 20px auto;
    box-sizing: border-box;
  }

  .MyIcon {
    margin: 0 6px;
    margin-right: 8px;
  }

</style>
