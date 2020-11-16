<template>
    <div class="SelectWrap">
        <div class="selectBox">
            <img src="../assets/image/logo.png" alt="">
            <p class="title" v-text="'PlanMateAPS您身边更专业的计划专家'"/>
            <div class="AuthorityBox">
                <div id="datacenter" @click="datacenterClick">
                    <i class="fa fa-bar-chart"/>
                    数据中心
                </div>
                <div id="reportsystem" @click="reportsystemClick">
                    <i class="fa fa-tachometer"/>
                    报工系统
                </div>
                <div id="systemsetting" @click="systemsettingClick">
                    <i class="fa fa-cogs"/>
                    系统管理
                </div>
                <div id="planboard" @click="planboardClick">
                    <i class="fa fa-desktop"/>
                    计划看板
                </div>
            </div>
            <div class="messageBox" :class="{'show':messageShow}">
                <h5 v-text="'当前账号没有'+clickText+'权限'"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                funList: [],
                clickText: "",
                messageShow: false
            }
        },
        mounted() {
            this.renderPage().then(()=>{
                this.getFunc();
            });
        },
        methods: {
            renderPage(){
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
            getFunc(){
                this.$http({
                    url: 'FunctionList',
                }).then(funList => {
                    this.funList.push(...funList);
                });
            },
            datacenterClick() {

                if (this.funList.indexOf('datacenter') !== -1) {
                    this.$router.replace('/DataCenter')
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
                // if (this.funList.indexOf('reportsystem')!==-1) {
                //     this.$router.replace('/DataCenter')
                // }else{
                //     //没有权限

                this.clickText = '系统管理';
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
    };
</script>

<style lang="scss" scoped>
    @import '../assets/font-awesome-4.7.0/css/font-awesome.min.css';

    .SelectWrap {
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, #0052d4, #65c7f7, #9cecfb);

        .selectBox {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;

            img {
                width: 150px;
                display: block;
                margin: 15px auto;
            }

            .title {
                font-size: 18px;
                font-weight: 400;
                text-align: center;
            }

            .AuthorityBox {
                display: flex;
                max-width: 1920px;
                width: 90%;
                margin: 15px auto;

                div {
                    flex-grow: 1;
                    text-align: center;
                    background-color: rgba(255, 255, 255, .4);
                    margin: 0 1px;
                    padding: 50px 0;
                    border-radius: 4px;
                }
            }

            .messageBox {
                opacity: 0;

                h5 {
                    color: red;
                    text-align: center;
                }
            }

            .messageBox.show {
                animation: ChangeOpacity 1s forwards;
                -moz-animation: ChangeOpacity 1s forwards; /* Firefox */
                -webkit-animation: ChangeOpacity 1s forwards; /* Safari and Chrome */
                -o-animation: ChangeOpacity 1s forwards; /* Opera */
            }

            @keyframes ChangeOpacity {
                from {
                    display: block !important;
                    opacity: 0
                }
                to {
                    display: block !important;
                    opacity: 1
                }
            }
        }
    }

    @media screen and (max-width: 767px) {
        .selectBox .title {
            font-size: 14px;

        }

        .selectBox .AuthorityBox div {
            font-size: 12px;
        }
    }
</style>
