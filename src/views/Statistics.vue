<template>
    <div class="wrap" :class="{'WrapShow':!NavShow}" v-if="[v-cloak]">

        <div class="inputBox">请输入设备名称 <input type="text" placeholder="请输入设备名称"></div>
        <div class="top">
            <div class="topCon">
                <div class="res" v-for="item in resStatus" :key="item.resname"
                     @click="resClick(item)"
                     :data="item"
                     :title="item.description"
                     :class="{'resK':item.resstate=='2'?true:false,'Error':item.resstate=='3'?true:false}">
                    <span  v-text="'设备名称:'+item.resname"/>
                    <span v-if="item.resorderbean" v-text="item.resComment+':'+item.resorderbean.workID"/>
                    <span text="item.resComment"/>
                    <span v-if="item.resorderbean" v-text="'描述:'+item.resorderbean.itemDesp"/>
                </div>
            </div>
        </div>
        <div class="main">
            <h2 v-if="curRes.resname" v-text="'当前设备:'+curRes.resname"/>
            <div class="ChartBox">功能即将上线Loading...</div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import cookie from 'vue-cookie'
    export default {
        name: "Statistics",
        data() {
            return {
                resStatus: [],
                curRes: ''
            }
        },
        computed: {
            ...mapState(['UserMessage', 'NavShow']),
        },

        mounted() {
            this.GetResStatus();
        },
        methods: {
            GetResStatus() {
                //获取设备状态
                this.$http({
                    url: "GetResStatus",
                    data: {
                        'empid': cookie.get('empID')
                    }
                }).then(res => {
                    this.resStatus = [];
                    this.resStatus = res;
                    this.curRes = res[0];
                })
            },
            resClick(item) {
                //设备的点击事件
                this.curRes = item;
            },
        }
    }
</script>
<style lang="scss" scoped>
    .top {
        width: 100%;
        min-height: 0px;
        max-height: 400px;
        padding: 10px 0;
        overflow-y: scroll;
        scrollbar-width: none; /* Firefox */

        .topCon {
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            align-content: flex-start;

            .res {
                height: 50px;
                background-color: #018578;
                margin: 4px 0;
                margin-right: 10px;
                padding: 10px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                border-radius: 4px;
                box-shadow: 1px 1px 5px #cccccc;
                cursor: pointer;
                width: 296px;
                span {
                    font-size: 12px;
                    color: white;
                    font-weight: 600;
                    width: 100%;
                    white-space: nowrap; /*强制在一行显示*/
                    text-overflow: ellipsis; /*设置超出内容显示...*/
                    overflow: hidden; /*一定不能少 超出的内容进行隐藏*/
                }

            }
            .Error {
                background-color: #cd2626;
            }

            .resK {
                background-color: #bababa;
            }

            .res:hover {
                background-color: #343a40;
                color: white;
            }
        }


    }
    .top::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }
    .main {
        .ChartBox {
            width: 100%;
            height: 380px;
        }
    }
</style>





