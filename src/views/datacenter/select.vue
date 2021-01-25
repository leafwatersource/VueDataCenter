<template>
  <div class="selectWrap">
    <div class="content">
      <img src="../../assets/image/logo.png" alt="PlanMateAPS您身边更专业的计划专家">
      <p class="selectTitle">PlanMateAPS您身边更专业的计划专家</p>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="datacenter" @click="datacenterClick">
            <i class="fa fa-bar-chart myIcon"></i>数据中心
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="reportsystem" @click="reportsystemClick">
            <i class="fa fa-tachometer myIcon"></i>报工系统
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="systemsetting" @click="systemsettingClick">
            <i class="fa fa-cogs myIcon"></i>系统管理
          </div>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
          <div class="planboard" @click="planboardClick">
            <i class="fa fa-desktop myIcon"></i>计划看板
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  export default {
    data() {
      return {
        funList: [],
        clickText: "",
        messageShow: false
      }
    },
    mounted() {
      //删除导航栏的默认缓存
      this.$cookie.delete("defaultActiveRouter");
      //配置页面的路由高亮为第一个
      this.setSystemDefaultActive("1");
      this.renderPage().then(() => {
        this.getFunc();
      });
    },
    methods: {
      ...mapMutations(['setSystemDefaultActive']),
      renderPage() {
        return new Promise(resolve => {
          this.$http({
            //这里是你自己的请求方式、url和data参数
            url: 'SelectFuncs',
          }).then(res => {
            if (!res) {
              this.getFunc();
            }
          }, () => {
            this.ErrorMessage = "服务器繁忙,请稍后重试";
          });
          resolve('');
        });
      },
      getFunc() {
        this.$http({
          url: 'FunctionList',
        }).then(funList => {
          if (Object.keys(funList).length > 0) {
            for (var item in funList) {
              if (funList[item].toUpperCase() === "ADMIN") {
                this.funList.push('datacenter');
                this.funList.push('systemsetting');
              }
            }
          }
          // this.funList.push(...funList);
        });
      },
      datacenterClick() {
        if (this.funList.indexOf('datacenter') !== -1) {
          this.$router.replace('/datacenter')
        } else {
          //没有权限
          this.clickText = '数据中心';
        }
      },
      reportsystemClick() {
        // if (this.funList.indexOf('reportsystem')!==-1) {
        //     this.$router.replace('/DataCenter')
        // }else{
        //     //没有权限
        // }
        this.clickText = '报工系统';
        this.messageShow = true;
      },
      systemsettingClick() {
        if (this.funList.indexOf('systemsetting') !== -1) {
          this.$router.replace('/datacenterConfig')
        } else {
          //没有权限
          this.clickText = '系统管理';
        }
        // if (this.funList.indexOf('reportsystem')!==-1) {
        //     this.$router.replace('/DataCenter')
        // }else{
        //     //没有权限

        this.messageShow = true;

      },
      planboardClick() {
        // if (this.funList.indexOf('reportsystem')!==-1) {
        //     this.$router.replace('/DataCenter')
        // }else{
        //     //没有权限
        // }
        this.clickText = '计划看板';
        this.messageShow = true;
      }
    }
  }
</script>

<style scoped>
  @import "../../assets/font-awesome-4.7.0/css/font-awesome.min.css";
  .selectWrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #0052d4;
    background: -webkit-linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    background: -moz-linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    background: -o-linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    background: -ms-linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    background: linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .content {
    width: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    box-sizing: border-box;
  }

  .content img {
    width: 9rem;
    display: block;
    margin: 1rem auto;
  }

  .content .selectTitle {
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 400;
  }

  .content .datacenter, .content .reportsystem, .content .systemsetting, .content .planboard {
    cursor: pointer;
    text-align: center;
    background-color: hsla(0, 0%, 100%, .4);
    padding: 2rem 0;
    font-size: 14px;
    -webkit-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }
.myIcon{
  margin-right: 4px;
}
  @media screen and(max-width: 776px) {
    .content {
      width: 90%;
    }
  }
</style>
