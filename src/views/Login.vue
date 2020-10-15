<template>
    <div class="wrapper" v-if="[v-cloak]">
        <div class="wrapBox">
            <div class="left">
                <div class="imgBox">
                    <img src="../assets/image/logo-white.png" alt/>
                    <p class="imgdesc" v-text="'您身边更专业的计划专家'"/>
                </div>
            </div>
            <div class="right">
                <div class="inputBox">
                    <p class="title" v-text="'用户登陆'"/>
                    <input type="text" placeholder="用户名" v-model="EmpID"/>
                    <form>
                    <input type="password" placeholder="密码" v-model="UserPass"/>
                    </form>
                    <button @click="LoginClick" v-text="'登陆'" v-if="LoginState"/>
                    <div class="fouceOut" v-else>
                        <button v-text="'强制登录'" @click="LogOut"/>
                        <button v-text="'取消'" class="cancel" @click="cancel" />
                    </div>
                    <div class="errorBox" v-text="ErrorMessage"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                EmpID: "",
                UserPass: "",
                ErrorMessage: "",
                LoginState: true
            };
        },
        mounted() {

        },
        methods: {
            LoginClick() {
                // 登录按钮的点击事件
                if (this.EmpID == "") {
                    // 判断用户名是否为空
                    this.ErrorMessage = "请输入用户名";
                    return;
                }
                if (this.UserPass == "") {
                    // 判断密码是否为空
                    this.ErrorMessage = "请输入密码";
                    return;
                } else {
                    this.$http({
                        //这里是你自己的请求方式、url和data参数
                        url: 'login',
                        data: {
                            "empID": this.EmpID,
                            "pwd": this.UserPass
                        }
                    }).then(res => {
                        if (res.loginState !== "0") {
                            this.LoginState = false;
                        }
                        this.ErrorMessage = res.message;
                    }, err => {
                        console.log(err);
                        this.ErrorMessage = "服务器繁忙,请稍后重试";
                    });
                    //登录查询
                    // 设置cookie默认过期时间单位是1d(1天)

                    // 跳转到选择页面
                    // this.$router.push("/Select");
                }
            },
            LogOut() {
                this.$http({
                    //这里是你自己的请求方式、url和data参数
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
                }, err => {
                    console.log(err);
                    this.ErrorMessage = "服务器繁忙,请稍后重试";
                });
            },
            GetUserMessage() {
                this.$http({url: 'UserMessage'}).then(res => {
                    this.$store.state.UserMessage = res[0];
                    this.$cookie.set("empName",res[0].empName,1);
                    this.$cookie.set("sysID",res[0].sysID,1);
                    this.$router.push("/Select");
                })
            },
            cancel(){
                this.LoginState = true;
                this.ErrorMessage = '';
                this.EmpID = '';
                this.UserPass = '';
            }
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
            height: 300px;
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
                        font-size: 20px;
                        letter-spacing: 2px;
                        text-align: center;
                        margin-bottom: 12px;
                        font-weight: 500;
                    }

                    input,
                    button,
                    .errorBox {
                        width: 90%;
                        display: block;
                        margin: 5px auto;
                        height: 40px;
                        border-radius: 4px;
                        outline: none;
                        font-size: 14px;
                    }

                    input {
                        margin: 10px auto;
                    }

                    .errorBox {
                        margin: 0 auto;
                        text-align: right;
                        color: red;
                        font-size: 12px;
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
