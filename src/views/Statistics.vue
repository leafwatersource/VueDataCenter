<template>
    <div class="wrap" :class="{'WrapShow':WrapShow}" v-if="[v-cloak]">

        <div class="inputBox">请输入设备名称 <input type="text" placeholder="请输入设备名称"></div>
        <div class="top">
            <div class="topCon">
                <div class="res" @contextmenu.prevent="show($event)">
                    <span>设备名称：外发厂</span>
                    <span>生产中：7641546578652153467465416754</span>
                </div>
                <div class="res" @contextmenu.prevent="show($event)">
                    <span>98645346545645456</span>
                    <span>换线中</span>
                </div>
                <div class="res">
                    <span>98645346545645456</span>
                    <span>异常设备</span>
                </div>
            </div>
        </div>
        <div class="main">
            设备的统计图
        </div>
    </div>
</template>

<script>
    export default {
        name: "Statistics",
        data(){
           return {
               clientX:null,
               clientY:null,
               rightShow:false,
           }
        },
        computed: {
            /**
             * @return {boolean}
             */
            WrapShow() {
                return !this.$store.state.NavShow;
            }
        },
        mounted() {
        },
        methods:{

        }
    }
</script>

<style lang="scss" scoped>
    .top {
        width: 100%;
        height: 400px;
        .topCon {
            width: 100%;
            height: 100%;
            padding: 10px 0;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            scrollbar-width: none; /* Firefox */
            .res{
                height: 50px;
                background-color: #018578;
                margin-right: 10px;
                padding: 10px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                border-radius: 4px;
                box-shadow: 1px 1px 5px #cccccc;
                cursor: pointer;
                span{
                    font-size: 12px;
                    color:white;
                    font-weight: 600;
                }
            }
            .Error{
                background-color:red;
            }
            .res:hover{
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
