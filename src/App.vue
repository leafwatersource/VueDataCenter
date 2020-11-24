<template>
    <div id="app">
        <el-container id="topWrap" height="100%"
                      v-if="($route.name!=='Login')&&($route.name!=='Select')&&($route.name!=='NotFound')&&($route.name!=='Error')">
            <el-header id="top">
                <span class="message" v-text="'订单查询-PlanMate-APS'"/>
                <span class="fa fa-bars menu" @click="MenuShow"/>
                <el-dropdown trigger="click" class="Me">
                    <span class="el-dropdown-link" v-text="Name" style="color: white;"/>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="clearfix">
                            用户设置
                        </el-dropdown-item>
                        <el-dropdown-item class="clearfix">
                            <span @click="Quit">退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container class="Conent" height="">
                <el-aside :class="{'asideShow':true,'asideHide':NavShow}"
                          v-if="($route.name!=='Login')&&($route.name!=='Select')&&($route.name!=='NotFound')&&($route.name!=='Error')"
                >
                    <el-menu
                            :default-active="defaultActiveIndex"
                            v-if="($route.name!=='Login')&&($route.name!=='Select')&&($route.name!=='NotFound')&&($route.name!=='Error')"
                            class="el-menu-vertical-demo"
                            @close="handleClose"
                            background-color="#212529"
                            text-color="#fff"
                            id="nav"
                            router
                            :collapse="NavShow"
                            :collapse-transition="false"
                            active-text-color="#007bff">
                        <img src="./assets/image/logo-white.png" style="height: 80px;" v-if="!NavShow" alt/>
                        <el-menu-item index="1" route="/DataCenter">
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
                                              @click="ImplementationClick"
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
                                <el-menu-item index="/Statistics">设备状态</el-menu-item>
                                <!--<el-menu-item index="/Statistics">设备负载</el-menu-item>-->
                                <!--<el-menu-item index="/Statistics">生产达成</el-menu-item>-->
                                <!--<el-menu-item index="/Statistics">订单生产进度</el-menu-item>-->
                                <!--<el-menu-item index="/ResStatistics">产能分析</el-menu-item>-->
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
        <template v-else>
            <router-view/>
        </template>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'

    export default {
        data() {
            return {
                defaultActiveIndex: '1',
                //判断用户是否点击了右上角的用户选项
                userBox: false,
            }
        },
        computed: {
            ...mapState(['ImplementationResGroup']),
            NavShow() {
                return this.$store.state.NavShow ? false : true;
            },
            Name() {
                return this.$store.state.UserMessage['empName'] || this.$cookie.get('empName');
            },
        },
        created() {
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchData()
        },
        watch: {
            $route(to) {
                if (to.path != '#/Select' && to.path != '#/' && to.path != '/') {
                    this.GetImplementationData();
                }
            }
        },
        mounted() {
            if (window.location.hash != '#/Select' && window.location.hash != '#/' && window.location.hash != '/') {
                this.GetImplementationData();
            }
        }
        ,
        methods: {
            ...mapMutations(['ChangeImplementationResGroup', 'ChangeCurImplementationResGroup']),
            GetImplementationData() {
                this.$http({
                    url: "ViewGroup"
                }).then(res => {
                    if (res.status == 1) {
                        res.groupList = JSON.parse(res.groupList);
                    }
                    this.ChangeImplementationResGroup(res.groupList);
                });

            }
            ,
            ImplementationClick(e) {
                this.ChangeCurImplementationResGroup(e.$attrs.data);
            },
            //用户点击用户选项
            UserClick() {
                this.userBox = this.userBox === false;
            }
            ,
            //退出的点击事件
            Quit() {
                this.$cookie.set("empName", null, 1);
                this.$cookie.set("sysID", null, 1);
                this.$router.replace('/');
                this.userBox = false;
            }
            ,
            MenuShow() {
                this.$store.state.NavShow = this.$store.state.NavShow ? false : true;
            }
            ,
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            }
            ,
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            fetchData() {
                var cur_path = this.$route.path; //获取当前路由
                this.defaultActiveIndex = cur_path;
            },
        }
    }
</script>
<style lang="scss">
    @import './assets/font-awesome-4.7.0/css/font-awesome.min.css';

    * {
        margin: 0;
        padding: 0;
    }

    html,
    body {
        width: 100%;
        height: 100%;
        user-select: none;

        #app {
            font-family: Avenir, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            width: 100%;
            height: 100%;

            #topWrap {
                height: 100%;

                #top {
                    position: relative;
                    background-color: #343a40;
                    color: white;
                    z-index: 10;

                    .message {
                        position: absolute;
                        left: 15px;
                        top: 50%;
                        transform: translateY(-50%);
                    }

                    .menu {
                        position: absolute;
                        left: 200px;
                        top: 50%;
                        transform: translateY(-50%);
                        cursor: pointer;
                    }

                    .Me {
                        position: absolute;
                        right: 15px;
                        top: 60%;
                        transform: translateY(-50%);
                    }

                    .userBox {
                        position: fixed;
                        right: 15px;
                        top: 50px;
                        background-color: #212529;
                        font-size: 14px;
                        display: none;
                        height: 0;

                        ul {
                            li {
                                list-style: none;
                                height: 30px;
                                line-height: 30px;
                                color: white;
                                text-align: center;
                                padding: 0 15px;
                            }
                        }
                    }
                }

                .userBox.show {
                    animation: height .2s linear forwards;
                    -moz-animation: height .2s linear forwards; /* Firefox */
                    -webkit-animation: height .2s linear forwards; /* Safari and Chrome */
                    -o-animation: height .2s linear forwards; /* Opera */
                }

                @keyframes height {
                    from {
                        height: 0px;
                        display: block;
                    }
                    to {
                        height: 60px;
                    }
                }
            }

            .Conent {
                overflow: hidden;
                height:calc(100% - 60px);
                .asideShow {
                    width: 200px !important;

                    #nav {
                        background-color: #212529;
                        height: 100%;
                        z-index: 10;
                        overflow-y: scroll;

                        img {
                            display: block;
                            width: 70%;
                            margin: 20px auto;
                            box-sizing: border-box;
                        }

                        .MyIcon {
                            margin: 0 6px;
                            margin-right: 8px;
                        }
                    }
                }

                .asideHide {
                    width: 65px !important;
                }

                #nav::-webkit-scrollbar {
                    display: none;
                }

                .hide {
                    display: none;
                }

                .wrap {
                    min-height: 100%;
                    box-sizing: border-box;
                }
            }
        }
    }

    @media screen and (max-width: 767px) {
        #top {
            .Me, .message {
                font-size: 14px;
            }

            .menu {
                left: 178px !important;
            }
        }
        .wrap {
            width: 100% !important;
            margin-left: 0 !important;
        }
    }
</style>
