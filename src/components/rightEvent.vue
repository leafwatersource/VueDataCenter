<template>
    <div class="rightBox" :style="{'left':X+'px','top':Y+'px'}">
        <ul>
            <li>查看设备的数据统计</li>
            <li>查看设备的数据统计</li>
            <li>查看设备的数据统计</li>
            <li>查看设备的数据统计</li>
            <li>查看设备的数据统计</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "right-event",
        props: ['clientX','clientY','rightShow'],
        data(){
            return {
                X:this.clientX,
                Y:this.clientY,
                show:this.rightShow
            }
        },
        watch: {
            // 监听父组件传入的数据，更新到本地
            clientX(newVal){
                this.X = newVal;
            },
            clientY(newVal){
                this.Y = newVal;
            },
            rightShow(newVal){
                this.show = newVal;
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss" scoped>
    .rightBox{
        position: absolute;
        background-color: #292a2d;
        width: 200px;
        ul{
            box-shadow: 1px 1px 5px #2b2b2b;
            li{
                list-style: none;
                font-size: 14px;
                color: white;
                text-align: center;
                padding: 2px 0;
            }
            li:hover{
                background-color: #4b4c4f;
            }
        }
    }
</style>
