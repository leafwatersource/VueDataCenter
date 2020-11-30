<template>
    <div class="wrap" :class="{'WrapShow':!NavShow}" v-if="[v-cloak]">
        <el-input
                placeholder="请输入设备名称"
                v-model="input"
                clearable>
        </el-input>
        <div class="top">
            <el-row :gutter="20">
                <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" v-for="item in resStatus"
                        :key="item.resname"
                        :title="item.description"
                >
                    <div class="grid-content res"
                         :class="{'resK':item.resstate=='2'?true:false,'Error':item.resstate=='3'?true:false}"
                         @click="resClick(item)"
                    >
                        <span v-text="'设备名称:'+item.resname"/>
                        <span v-if="item.resorderbean" v-text="item.resComment+':'+item.resorderbean.workID"/>
                        <span text="item.resComment"/>
                        <span v-if="item.resorderbean" v-text="'描述:'+item.resorderbean.itemDesp"/>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="main">
            <el-row :gutter="10" style="padding: 10px 0;">
                <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="3">
                    <div class="grid-content">
                            <el-tag effect="dark"  @click="drawer = true">
                                {{ curRes.resname }}
                            </el-tag>
                            <ResMessageBox :drawer="drawer" :resMessage="curRes" :AttrMessageZh="AttrMessageZh" @closeDrawer="closeDrawer"></ResMessageBox>

                    </div>
                </el-col>
                <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="2">
                    <div class="grid-content bg-purple-light">
                        <SelectDate :nowDate="nowDate" />
                    </div>
                </el-col>
            </el-row>

            <Tabs :dayShiftList="dayShift"/>
            <!--<div class="ChartBox">功能即将上线Loading...-->
            <!--<span v-if="Equipment!=null" v-text="'设备负载率:'+Equipment+'%'"></span>-->
            <!--<span v-if="ResFinishNum!=null" v-text="'设备达成率:'+ResFinishNum+'%'"></span>-->
            <!--<span v-if="curDayShift!=null" v-text="'curDayShift:'+curDayShift"></span>-->
            <!--&lt;!&ndash;<span  v-text="'dayShift:'+dayShift[0]['ResCalShift']"></span>&ndash;&gt;-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Tabs from '../components/Statistics/Tabs'//选择班次
    import SelectDate from '../components/Statistics/SelectDate'//选择日期
    import ResMessageBox from '../components/Statistics/ResMessageBox'//设备详细信息的展示
    export default {
        name: "Statistics",
        components: {
            Tabs,
            SelectDate,
            ResMessageBox
        },
        data() {
            return {
                resStatus: [],//所有的设备
                curRes: '',//当前的设备
                curResProductAttr: {},//设备的生产信息展示，如果是生产中的设备就有这个属性
                Equipment: null,//设备负载率
                ResFinishNum: null,//设备达成率
                dayShift: [],//当前设备一共有多少个班次
                curDayShift: null,//当前的班次
                filterStartTime: null,//筛选的开始时间
                filterEndTime: null,//筛选的结束时间
                input: '',//搜索框的内容
                AttrMessageZh: {},//鼠标hover展示的中文
                drawer:false,//设备详细信息的展示
                nowDate:new Date().toLocaleDateString(),//设备使用记录的日期
            }
        },
        computed: {
            //判断导航栏是否展示
            ...mapState(['UserMessage', 'NavShow']),
        },

        mounted() {
            this.renderPage();
        },
        methods: {
            renderPage() {
                this.GetResStatus().then(res => {
                    this.resStatus = [];
                    this.resStatus = res;
                    this.curRes = res[0];
                    this.curResProductAttr = this.curRes['resorderbean'] == null ? {} : this.curRes['resorderbean'];
                    return this.GetStatisticsHover();
                }).then((res) => {
                    this.AttrMessageZh = res;
                    return this.GetDataShift();
                }).then(() => {
                    //鼠标hover展示的中文
                    this.$http({
                        url: 'TableFiled',
                        data: {
                            "tableName": "StatisticsHover"
                        }
                    }).then(res => {
                        this.AttrMessageZh = res;
                    })
                });
            },
            GetStatisticsHover(){
              //获取设备要展示的列
                return new Promise(resolve => {
                    this.$http({
                        url: 'TableFiled',
                        data: {
                            "tableName": "StatisticsHover"
                        }
                    }).then(res => {
                        resolve(res);
                    });
                });
            },
            closeDrawer(){
                //关闭设备详细信息展示
                this.drawer = false;
            },
            GetDataShift() {
                //获取设备有多少个班次，和当前是什么班次，如果当前班次为0表示没有没有排班
                return new Promise(resolve => {
                    this.$http({
                        url: 'GetDataShift',
                        data: {
                            "ResName": this.curRes['resname']
                        }
                    }).then(res => {
                        res['dayShift'] = JSON.parse(res['dayShift']);
                        this.curDayShift = res['curdayshift'];
                        this.dayShift = [];
                        this.dayShift = [...res['dayShift']];
                        console.log(this.dayShift);
                        resolve(res)
                    });
                })
            },
            GetResStatus() {
                //获取所有的设备
                return new Promise(resolve => {
                    this.$http({
                        url: "GetResStatus",
                        data: {
                            'empid': this.$cookie.get('empID')
                        }
                    }).then(res => {
                        console.log(res);
                        resolve(res);
                    })
                })
            },
            GetCurResProduct() {
                return new Promise(resolve => {
                    this.$http({
                        url: "GetCurResProduct",
                        data: {
                            "CurResName": this.curRes['resname']
                        }
                    }).then(res => resolve(res));
                })
            },
            resClick(item) {
                //设备的点击事件
                this.curRes = item;
                this.curResProductAttr = this.curRes['resorderbean'] == null ? {} : this.curRes['resorderbean'];
                console.log(this.curResProductAttr);
                this.GetCurResProduct().then(res => {
                    this.Equipment = res;
                    return this.GetProductFinish();
                }).then(() => {
                    this.GetDataShift();
                })

            },
            GetProductFinish() {

                this.$http({
                    url: 'GetProductFinish',
                    data: {
                        "ResName": this.curRes['resname']
                    }
                }).then(res => this.ResFinishNum = res);
            },
        }
    }
</script>
<style lang="scss" scoped>

    .top {
        width: 100%;
        min-height: 0px;
        max-height: 228px;
        padding: 10px 0;
        overflow-y: scroll;
        scrollbar-width: none; /* Firefox */
        padding: 10px 0;
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
                width: 100%;
                white-space: nowrap; /*强制在一行显示*/
                text-overflow: ellipsis; /*设置超出内容显示...*/
                overflow: hidden;
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

    .top::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    }

    .main {
        .ChartBox {
            width: 100%;
            /*height: 380px;*/
        }

    }
    #resHover,#resProductHover{
            li{
                list-style: none !important;
                padding: 5px 0;
            }
    }
</style>




