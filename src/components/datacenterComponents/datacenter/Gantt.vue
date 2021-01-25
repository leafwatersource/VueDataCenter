<template>
        <div id="Content">
            <div class="OpWrap">
                <ul class="OpName">
                    <li v-for="item in OpMessage" :title="item.pmOpName" :key="item.UID">{{item.pmOpName}}</li>
                </ul>
            </div>

            <div class="MessageWrap">

                <ul class="Message">
                    <li v-for="item in PlanLine" :key="item.uid">
                        <div class="plan" @mouseleave="leafEvent" @mousemove="moveEvent" @mouseenter="enterEvent(item)" :style="{'left':item.left+'px','width':item.width+'px'}">
                            <div v-if="item.finishWidth!==0" class='finish' :style="{'width':item.finishWidth+'%'}">
                                {{item.finishedQty}}
                            </div>
                            <div v-if="item.unFinishWidth!==0" class="unFinish"
                                 :style="{'width':item.unFinishWidth+'%'}">
                                {{item.plannedQty - item.finishedQty }}
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="Ganttmode">
                    <span>实际开始&nbsp;/&nbsp;实际结束:{{' / '}}</span>
                    <span>已完成&nbsp;/&nbsp;正在生产:{{' / '}}</span>
                </div>
            </div>
            <div class="TimerWrap">
                <ul class="Timer" :style="{'width':TimerData.length*80+'px'}">
                    <li v-for="item in TimerData" :key="item"><p>{{item}}</p></li>
                </ul>
            </div>
        </div>
</template>

<script>
    import fun from '../../../util/publicFun'
    export default {
        name: "GanTe",
        props: ['OpMessage'],
        data() {
            return {
                TimerData: [],//甘特图的时间轴
                PlanLine: [],//甘特图的条
                left:0,
                top:0,
            }
        },
        watch: {
            OpMessage() {
                console.log(this.OpMessage);
                this.getTimerData().then(() => {
                    this.getPlanLine();
                })
            }
        },
        mounted() {
          console.log(this.OpMessage);
            this.binEvent();
        },
        methods: {
            moveEvent(e){
                this.left = e.target.offsetLeft;
                this.top = e.pageY+10-30-43.64;
                let option = {
                    left:e.pageX-e.path[7].offsetLeft-e.path[4].offsetLeft-e.offsetX,
                    top:e.pageY+10-30-43.64,
                    display:'block'
                };
                this.$emit("updateGanttPosition",option);
            },
            leafEvent(){
                let option = {
                    left:0,
                    top:0,
                    display:'none'
                };
                this.$emit("updateGanttPosition",option);
                this.$emit("updateOpMessage",{});
            },
            enterEvent(data){
                let option = {
                    startDateTime:fun.formateTime(data['startDateTime']),
                    endDateTime:fun.formateTime(data['endDateTime']),
                    finishedQty:data['finishedQty'],
                    unFinishQty:data['plannedQty'] - data['finishedQty']
                };
                this.$emit("updateOpMessage",option);
            },
            binEvent() {
                //绑定事件(滚动事件)
                let op = document.getElementsByClassName('OpWrap')[0];
                let Message = document.getElementsByClassName('Message')[0];
                let Timer = document.getElementsByClassName('TimerWrap')[0];
                op.onscroll = function (e) {
                    Message.style.top = -e.target.scrollTop + 'px';
                };
                Message.onscroll = function (e) {
                    op.scrollTop = e.target.scrollTop;
                };
                Timer.onscroll = function (e) {
                    Message.style.left = -e.target.scrollLeft + 'px';
                };
            },
            getTimerData() {
                //设置时间轴
                this.TimerData = [];
                return new Promise(resolve => {
                    for (let i = 0; i < this.OpMessage.length; i++) {
                        this.TimerData.push(fun.foramateDate(this.OpMessage[i]['startDateTime']));
                        this.TimerData.push(fun.foramateDate(this.OpMessage[i]['endDateTime']));
                    }
                    this.TimerData = fun.sortData(fun.Deduplication(this.TimerData), 'order')
                    resolve('')
                });
            },
            getPlanLine() {
                //获取甘特图的横块
                this.PlanLine = [];
                for (let i = 0; i < this.OpMessage.length; i++) {
                    let planQty = this.OpMessage[i]['plannedQty'];
                    let finishQty = this.OpMessage[i]['finishedQty'];
                    let start = this.TimerData.indexOf(fun.foramateDate(this.OpMessage[i]['startDateTime']));
                    let end = this.TimerData.indexOf(fun.foramateDate(this.OpMessage[i]['endDateTime']));
                    let left = start * 80;
                    let width = (end - start + 1) * 80;
                    let unFinishWidth = 0;
                    let finishWidth = 0;
                    if (finishQty === 0) {
                        left = 0;
                        width = 0
                    }
                    if (finishQty === planQty) {

                        finishWidth = 100;
                        unFinishWidth = 0;
                    }
                    if (finishQty < planQty) {
                        finishWidth = finishQty ? finishQty / planQty * 100 : 0;
                        unFinishWidth = (planQty - finishQty) / planQty * 100;
                    }
                    let obj = {
                        left,
                        width,
                        unFinishWidth,
                        finishWidth,
                        ...this.OpMessage[i]
                    };
                    this.PlanLine.push(obj)
                }
            },
        }
    }
</script>

<style scoped>
    #Content {
        width: 100%;
        /*height: 300px;*/
        max-width: 1080px;
        position: absolute;
        left: 50%;
        top: 50%;
        max-height: calc(100% - 30px);
        transform: translate(-50%, -50%);
    }

    #Content .title {
        float: right;
        height: 50px;
        border: 1px solid black;
        width: 100px;

    }

    #Content p {
        text-align: center;
        font-size: 18px;
        padding: 12px 0;
    }

    #Content .OpWrap {
        float: left;
        border-right: 1px solid red;
        /*height: 300px;*/
        overflow-y: scroll;
    }

    #Content .OpWrap::-webkit-scrollbar {
        width: 2px;
        height: 5px;
        /**/
    }

    #Content .OpWrap::-webkit-scrollbar-track {
        background: rgb(239, 239, 239);
        border-radius: 2px;
    }

    #Content .OpWrap::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 10px;
    }

    #Content .OpWrap::-webkit-scrollbar-thumb:hover {
        background: #333;
    }

    #Content .OpWrap::-webkit-scrollbar-corner {
        background: #179a16;
    }

    #Content .OpName {
        padding: 0;
        list-style: none;
        user-select: none;
    }

    .OpName li {
        font-size: 12px;
        width: 80px;
        height: 40px;
        text-align: center;
        box-sizing: border-box;
        position: relative;
        line-height: 40px;
        cursor: pointer;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .OpName li::after {
        display: block;
        content: "";
        width: 5px;
        height: 1px;
        background-color: #999;
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .MessageWrap {
        position: relative;
        float: right;
        left: 0;
        width: calc(100% - 83px);
        overflow: hidden;
    }

    .MessageWrap::after {
        display: block;
        content: "";
        clear: both;
    }

    .Message {
        width: 1080px;
        position: relative;
        left: 0;
        list-style: none;
    }

    .Message li {
        width: 100%;
        height: 40px;
        position: relative;
    }

    .Message li:last-child(1) {
        border-bottom: none;
    }

    .Message li:hover {
        background-color: #efefef;
    }

    .Message li .plan {
        position: absolute;
        left: 80px;
        top: 50%;
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 160px;
        height: 35px;
        float: left;
        text-align: center;
        font-size: 12px;
        line-height: 35px;
        color: black;
        border-radius: 4px;
        overflow: hidden;
    }

    .plan .finish {
        width: 20%;
        height: 100%;
        background-color: yellow;
        float: left;
    }

    .plan .unFinish {
        float: right;
        width: 80%;
        height: 100%;
        background-color: green;
    }

    .TimerWrap {
        width: calc(100% - 83px);
        margin-left: 80px;
        overflow: scroll;
    }

    #Content .TimerWrap::-webkit-scrollbar {
        width: 2px;
        height: 5px;
    }

    .TimerWrap::-webkit-scrollbar-track {
        background: rgb(239, 239, 239);
        border-radius: 2px;
    }

    .TimerWrap::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 10px;
    }

    .TimerWrap::-webkit-scrollbar-thumb:hover {
        background: #333;
    }

    .TimerWrap::-webkit-scrollbar-corner {
        background: #179a16;
    }

    .Timer {
        list-style: none;
        float: left;
        border-top: 1px solid #f50;
    }

    .Timer::after {
        display: block;
        content: "";
        clear: both;
    }

    .Timer li {
        float: left;
        font-size: 12px;
        color: #999;
        width: 80px;
        text-align: center;
        position: relative;
    }

    #Content .Timer li p {
        width: 100%;
        height: 100%;
        font-size: 12px;
        padding: 0;
    }

    #Content .Timer li:not(:first-child) p::before {
        display: block;
        position: absolute;
        content: "";
        width: 1px;
        height: 5px;
        background-color: #000;
        left: 0;
        top: 0px;
    }

    .Timer:after {
        display: block;
        content: "";
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
