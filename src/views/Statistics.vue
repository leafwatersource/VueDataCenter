<template>
    <div class="wrap" :class="{'WrapShow':WrapShow}" v-if="[v-cloak]">

        <div class="inputBox">请输入设备名称 <input type="text" placeholder="请输入设备名称"></div>
        <div class="top">
            <div class="topCon">
                <div class="res" v-for="item in resStatus" :key="item.resname"
                     @click="resClick(item)"
                     :data="item"
                     :class="{'resK':item.resType=='0'?true:false,'Error':item.resType=='3'?true:false}">
                    <span v-text="'设备名称:'+item.resname" />
                    <span v-if="item.resorderstate" v-text="item.resstate+':'+item.resorderstate" />
                    <span v-else v-text="item.resstate" />
                </div>

            </div>
        </div>
        <div class="main">
            <h2 v-if="curRes.resname" v-text="'当前设备:'+curRes.resname" />
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
                resStatus:[],
                curRes:''
            }
        },
        computed: {
            /**
             * @return {boolean}
             */
            ...mapState(['UserMessage']),
            WrapShow() {
                return !this.$store.state.NavShow;
            }
        },
        mounted() {
            this.GetResStatus();
        },
        methods: {
            GetResStatus(){
                //获取设备状态
                console.log(this.UserMessage);
                this.$http({
                    url:"GetResStatus",
                    data:{
                        'empid':cookie.get('empID')
                    }
                }).then(res=>{
                    this.resStatus = [];
                    this.resStatus = res;
                    this.curRes = res[0];
                })
            },
            resClick(item){
                //设备的点击事件
                this.curRes = item;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .top {
        width: 100%;
        height: 400px;
        overflow-y: hidden;
        padding: 10px 0;
        .topCon {
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
           align-content: flex-start;
            scrollbar-width: none; /* Firefox */
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
                span {
                    font-size: 12px;
                    color: white;
                    font-weight: 600;
                }
            }
            .Error {
                background-color: #cd2626;
            }
            .resK{
                background-color: #bababa;
            }
            .res:hover {
                background-color: #343a40;
                color: white;
            }
        }

        .topCon::-webkit-scrollbar {
            display: none; /* Chrome Safari */
        }
    }

    .main {
        background-color: green;
    }
</style>
