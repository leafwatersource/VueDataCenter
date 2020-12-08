<template>
    <div class="wrapper" v-if="[v-cloak]">
        <div class="wrapBox">
            <div class="left">
                <div class="imgBox">
                    <img src="../assets/image/logo-white.png" alt/>
                    <p class="imgdesc" v-text="'您身边更专业的计划专家'"></p>
                </div>
            </div>
            <div class="right">
                <div class="inputBox">
                    <p class="title" v-text="'用户登陆'"></p>
                    <input type="text" placeholder="用户名" v-model="EmpID"/>
                        <input type="password" placeholder="密码" v-model="UserPass" @keyup.13="handleEvent($event)" />
                    <button @click="LoginClick" v-text="'登陆'" v-if="LoginState"></button>
                    <div class="fouceOut" v-else>
                        <button v-text="'强制登录'" @click="LogOut"></button>
                        <button v-text="'取消'" class="cancel" @click="cancel"></button>
                    </div>
                    <div class="errorBox" v-text="ErrorMessage"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                EmpID: "",//用户的id
                UserPass: "",//用户的密码
                ErrorMessage: "",//模态框错误信息
                LoginState: true//登录状态
            };
        },
        methods: {
            handleEvent(e){
                //esc键抬起事件
                if(e.keyCode==27){
                    if(!this.LoginState){
                        this.cancel();
                    }
                }
                //确定键抬起事件
                if(e.keyCode == 13){
                    if(this.LoginState){
                        this.LoginClick();
                    }else{
                        this.LogOut();
                    }
                }
            },
            hasLogin() {
                //判断是否是登录了
                return new Promise( (resolve, reject)=> {
                    if (this.EmpID == "") {
                        // 判断用户名是否为空
                        this.ErrorMessage = "请输入用户名";
                        reject('请输入用户名');
                        return;
                    }
                    if (this.UserPass == "") {
                        // 判断密码是否为空
                        this.ErrorMessage = "请输入密码";
                        reject('请输入密码');
                        return;
                    }
                    //根据cookie值获取token值
                    let token = this.$cookie.get('token');
                    //根据cookie值获取empid
                    let empid = this.$cookie.get('empID');
                    if (typeof token === "string" && empid&&empid==this.EmpID) {
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
                    }else{
                        //用户没有登陆过,或者用户清除了缓存
                        resolve(0);
                    }
                });
            },
            LoginClick() {
                // 登录按钮的点击事件
                this.hasLogin().then(res => {
                    if(res===0){
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
                                    this.$router.push("/Select");
                                    return;
                                } else {
                                    //登录失败
                                    this.LoginState = false;
                                }
                            }
                            this.ErrorMessage = res.message;
                        }, err => {
                            console.log(err);
                            this.ErrorMessage = "服务器繁忙,请稍后重试";
                        });
                    }else{
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
                        this.ErrorMessage = res.message;
                    }
                }, () => {
                    this.ErrorMessage = "服务器繁忙,请稍后重试";
                });
            },
            GetUserMessage() {
                //获取用户的信息
                this.$http({url: 'UserMessage'}).then(res => {
                    this.$store.state.UserMessage = res[0];
                    this.$cookie.set("empName", res[0].empName, 1);
                    this.$cookie.set("sysID", res[0].sysID, 1);
                    this.$router.push('Select')
                })
            },
            cancel() {
                //取消按钮的点击事件
                this.LoginState = true;
                this.ErrorMessage = '';
                this.EmpID = '';
                this.UserPass = '';
            },
        },
    };
</script>

<style lang="scss" scoped>
    [v-cloak] {
        display: none;
    }

    .wrapper {
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);
        .wrapBox {
            width: 60%;
            max-width: 1200px;
            height: 18.75rem;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: #bdebfc;
            box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.5);
            border-radius: 20px;

            .left,
            .right {
                position: relative;
                width: 50%;
                float: left;
                height: 100%;

                .imgBox,
                .inputBox {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                .inputBox {
                    padding: 8px 0;
                    width: 100%;
                    .title {
                        color: #212549;
                        font-size: 1.25rem;
                        letter-spacing: 0.125rem;
                        text-align: center;
                        margin-bottom: 0.75rem;
                        font-weight: 500;
                    }
                    input,
                    button,
                    .errorBox {
                        width: 90%;
                        display: block;
                        margin: 0.3125rem auto;
                        height: 2.5rem;
                        border-radius: 0.25rem;
                        outline: none;
                        font-size: 0.875rem;
                    }

                    input {
                        margin: 10px auto;
                    }

                    .errorBox {
                        margin: 0 auto;
                        text-align: right;
                        color: red;
                        font-size: 0.75rem;
                    }

                    input {
                        border: none;
                        padding: 4px 8px;
                        box-sizing: border-box;
                        color: #495057;
                    }

                    button {
                        color: #fff;
                        padding: 4px 8px;
                        background-color: #007bff;
                        border: none;
                        font-size: 16px;

                        button:hover {
                            background-color: #0069d9;
                        }
                    }

                    .fouceOut {
                        display: flex;
                        width: 90%;
                        margin: 15px auto;

                        button:nth-child(1) {
                            margin-right: 12px;
                        }

                        .cancel {
                            background-color: #6c757d;
                        }
                    }
                }
            }

            .left {
                background: url("../assets/image/timg.jpg") no-repeat 0px 0px;
                background-size: cover;
                background-position: center;
                border-radius: 20px 0 0 20px;

                .imgdesc {
                    color: white;
                    font-size: 14px;
                    text-align: center;
                }
            }
        }
    }

    @media screen and (max-width: 767px) {
        .wrapBox {
            width: 90% !important;

            .left {
                display: none !important;
            }

            .right {
                width: 100% !important;
            }
        }
        .wrap {
            width: 80%;
        }
    }
</style>
