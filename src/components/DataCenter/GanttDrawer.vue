<template>
    <el-drawer v-if="SelectWorkItem"
            :title="'工单号码:'+SelectWorkItem['工单号码']+',工序进度'"
            :visible.sync="drawer"
            :direction="direction"
            size="60%"
            :before-close="handleClose">
        <div class="OpTitle">
            <div class="OPDesc">
                <div class="circleYellow"></div><span>已完成</span>
            </div>
            <div class="OPDesc">
                <div class="circleGreen"></div>
                <span>正在生产</span>
            </div>
        </div>
        <Gante :OpMessage="OpMessage" @updateGanttPosition="updateGanttPosition" @updateOpMessage="updateOpMessage"></Gante>
        <div class="Ganttmode">
           <span>实际开始&nbsp;/&nbsp;实际结束:{{opMessage['startDateTime']+' / '+opMessage['endDateTime']}}</span>
            <span>已完成&nbsp;/&nbsp;正在生产:{{opMessage['finishedQty']+' / '+opMessage['unFinishQty']}}</span>
        </div>
    </el-drawer>
</template>

<script>
    import Gante from './Gantt'
    export default {
        name: "GanTeDrawer",
        props:['drawer','OpMessage','SelectWorkItem'],
        components:{
            Gante
        },
        data() {
            return {
                direction: 'rtl',//模态框展示的方向
                opMessage:{},//鼠标移上的时候工序的信息
            };
        },
        updated(){
        },
        methods: {
            updateOpMessage(data){
                this.opMessage = data;
            },
            updateGanttPosition(positionMessage){
                //更新鼠标hover时候信息块的位置
                let Ganttmode = document.getElementsByClassName('Ganttmode')[0];
                Ganttmode.style.left = positionMessage.left+'px';
                Ganttmode.style.top = positionMessage.top+'px';
                if (Ganttmode.style.display !== positionMessage.display) {
                    Ganttmode.style.display = positionMessage.display;
                }
            },
            handleClose() {
                    //抽屉关闭的事件
                this.$emit('GanTeClose',false)
            }
        }
    }
</script>

<style scoped>
    /deep/ :focus {
        outline: 0;
    }
    /deep/ .el-drawer__body{
        position: relative;
    }
    .OpTitle{
        position: absolute;
        height: 30px;
        left:50%;
        top: 0;
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
    }
    .OpTitle .OPDesc{
        float: left;
        margin-right: 12px;
    }
    .OPDesc div{
        width: 20px;
        height: 20px;

        border-radius: 4px;
        float: left;
        margin-right: 6px;
        position: relative;
        top: 15px;
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        transform: translateY(-50%);
    }
    .OPDesc .circleYellow{
        background-color: yellow;
    }
    .OPDesc .circleGreen{
        background-color: green;
    }
    .OPDesc span{
        font-size: 12px;
        color: #cccccc;
        vertical-align:bottom;
        line-height: 30px;
    }
    .OpTitle::after{
        display: block;
        content: '';
        clear: both;
    }
    .Ganttmode{
        padding: 15px;
        width: 260px;
        position: absolute;
        left: 0;
        top: 0;
        -webkit-transform: translateX(50%);
        -moz-transform: translateX(50%);
        -ms-transform: translateX(50%);
        -o-transform: translateX(50%);
        transform: translateX(50%);
        display: none;
        background-color: rgba(0,0,0,.4);
        transition: all .2s linear;
        border-radius: 4px;
    }
    .Ganttmode span{
        color: white;
        font-size: 12px;
        font-weight: 600;
        display: block;
    }
</style>
