<template>
  <div class="loginWrap" v-if="[v-cloak]">
    <div class="wrapBox">
      <el-row>
        <el-col class="hidden-xs-only hidden-sm-only" :md="12" :lg="12" :xl="12">
          <div class="left">
            <div class="imgBox">
              <img src="../../assets/image/logo-white.png" alt/>
              <p class="imgdesc" v-text="'您身边更专业的计划专家'"></p>
            </div>
          </div>

        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="right">
            <div class="inputBox">
              <p class="title" v-text="'用户登陆'"></p>
              <input type="text" placeholder="用户名" v-model="EmpID"/>
              <input type="password" placeholder="密码" v-model="UserPass" @keyup.13="handleEvent($event)"/>
              <el-button type="primary" class="loginBtn" @click="LoginClick" v-show="LoginState">登陆</el-button>
              <div class="fouceOut" v-show="!LoginState">
                <el-row :gutter="10">
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-button type="primary" class="logOut" @click="LogOut">强制登录</el-button>
                  </el-col>
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-button type="info" class="cancel" @click="cancel">取消</el-button>
                  </el-col>
                <!--<button v-text="'强制登录'" @click="LogOut"></button>-->
                <!--<button v-text="'取消'" class="cancel" @click="cancel"></button>-->
                </el-row>
              </div>
            </div>
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
        EmpID: "",//用户的id
        UserPass: "",//用户的密码
        LoginState: true//登录状态
      };
    },
    methods: {
      ...mapMutations(['setUserMessage']),
      handleEvent(e) {
        //esc键抬起事件
        if (e.keyCode == 27) {
          if (!this.LoginState) {
            this.cancel();
          }
        }
        //确定键抬起事件
        if (e.keyCode == 13) {
          if (this.LoginState) {
            this.LoginClick();
          } else {
            this.LogOut();
          }
        }
      },
      hasLogin() {
        //判断是否是登录了
        return new Promise((resolve, reject) => {
          if (this.EmpID == "") {
            // 判断用户名是否为空
            this.$message.error('请输入用户名');
            reject('请输入用户名');
            return;
          }
          if (this.UserPass == "") {
            // 判断密码是否为空
            this.$message.error('请输入密码');
            reject('请输入密码');
            return;
          }
          //根据cookie值获取token值
          let token = this.$cookie.get('token');
          //根据cookie值获取empid
          let empid = this.$cookie.get('empID');
          if (typeof token === "string" && empid && empid == this.EmpID) {
            //判断用户是否是上次登录了
            this.$http({
              url: "HasLogin",
              data: {
                "empid": this.EmpID,
                "userGuid": token
              }
            }).then(result => {
              resolve(result.LoginStatus)
            })
          } else {
            //用户没有登陆过,或者用户清除了缓存
            resolve(0);
          }
        });
      },
      LoginClick() {
        // 登录按钮的点击事件
        this.hasLogin().then(res => {
          if (res === 0) {
            this.$http({
              //这里是你自己的请求方式、url和data参数
              url: 'login',
              data: {
                "empID": this.EmpID,
                "pwd": this.UserPass
              }
            }).then(res => {
              if (res.loginState !== "0") {
                if (res.loginState == "1") {
                  //登录成功
                  this.$router.push("/select");
                  return;
                } else {
                  //登录失败
                  this.LoginState = false;
                  this.$message({
                    message: res.message,
                    type: 'warning'
                  });
                }
              }
            }, err => {
              console.log(err);
              this.$message.error('服务器繁忙,请稍后重试');
            });
          } else {
            // 登录成功
            this.LogOut();
          }
        });
      },
      LogOut() {
        //强制登录
        this.$http({
          url: 'LogOut',
          data: {
            "empID": this.EmpID,
            "userPass": this.UserPass
          }
        }).then(res => {
          if (res.loginState === "1") {
            this.$cookie.set("token", res.userGuid, 1);
            this.$cookie.set("empID", res.empID, 1);
            this.GetUserMessage();
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            });
          }
        }, () => {
          this.$message.error('服务器繁忙,请稍后重试');
        });
      },
      GetUserMessage() {
        //获取用户的信息
        this.$http({url: 'UserMessage'}).then(res => {
          this.setUserMessage(res[0]);
          this.$cookie.set("empName", res[0].empName, 1);
          this.$cookie.set("sysID", res[0].sysID, 1);
          this.$router.push('select')
        })
      },
      cancel() {
        //取消按钮的点击事件
        this.LoginState = true;
        this.EmpID = '';
        this.UserPass = '';
      },
    },
  };
</script>
<style>

  .loginWrap {
    width: 100%;
    height: 100%;
    background-color: #0052d4;
    background: -webkit-linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    background: -moz-linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    background: -o-linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    background: -ms-linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    background: linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
    box-sizing: border-box;
  }

  .wrapBox {
    width: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    -webkit-border-radius: 20px;
    -ms-border-radius: 20px;
    -o-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    -moz-box-shadow:0 0.5rem 1rem 0 rgba(0, 0, 0, 0.5); /*firefox*/

    -webkit-box-shadow:0 0.5rem 1rem 0 rgba(0, 0, 0, 0.5); /*webkit*/

    box-shadow:0 0.5rem 1rem 0 rgba(0, 0, 0, 0.5); /*opera或ie9*/
    background-color: #bdebfc;
    overflow: hidden;
    box-sizing: border-box;
  }

  .wrapBox .left {
    position: relative;
    background: url('../../assets/image/timg.jpg') no-repeat 0 0;
    background-size: cover;
    background-position: 50%;
    padding: 2rem;
    min-height: 200px;
  }

  .imgBox {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .imgBox .imgdesc {
    font-size: 12px;
    text-align: center;
    color: #ffffff;
  }

  .wrapBox .right {
    height: 100%;
    padding: 2rem;
  }
  .inputBox .title{
    color: #212549;
    font-size: 1.25rem;
    letter-spacing: .125rem;
    text-align: center;
    margin-bottom: .75rem;
    font-weight: 500;
  }
  .inputBox input{
    border: none;
    padding: 4px 8px;
    box-sizing: border-box;
    color: #495057;
    width: 98%;
    display: block;
    margin: .3125rem auto;
    height: 2.5rem;
    border-radius: .25rem;
    outline: none;
    font-size: .875rem;
  }
  .inputBox .loginBtn{
    width: 98%;
    display: block;
    margin:1rem auto;
  }
  .fouceOut .logOut,  .fouceOut .cancel{
    width: 100%;
  }

  @media screen and (max-width: 776px){
    .wrapBox {
      width: 90%;
    }
  }
</style>

