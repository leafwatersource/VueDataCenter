<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="home wrap" :class="{'WrapShow':WrapShow}" v-if="[v-cloak]">
        <div class="title" v-text="'当前计划发布日期：'+ReleaseTime+'，最后计划发布人：'+Owner+'，计划发布名称：'+WorkPlanName"/>
        <div class="flexBox">
            <div class="primaryBox" @click="changeWorkType('EarlyPlan','提前交货订单')">
                <span class="card-header" v-text="'提前交货订单:'+Percentage.EarlyPercentage+'%'"/>
                <h2 v-text="Percentage.EarlyConunt+'张'"/>
            </div>
            <div class="successBox" @click="changeWorkType('OnTimePlan','正常交货订单')"><span class="card-header" v-text="'正常交货订单:'+Percentage.OnTimePercentage+'%'"/>
                <h2 v-text="Percentage.OnTimeCount+'张'"/></div>
            <div class="warningBox" @click="changeWorkType('LatePlan','延迟订单')"><span class="card-header" v-text="'延迟订单:'+Percentage.LatePercentage+'%'"/>
                <h2 v-text="Percentage.LateCount+'张'"/></div>
            <div class="dangerBox" @click="changeWorkType('ErrorPlan','异常排程订单')"><span class="card-header" v-text="'异常排程订单:'+Percentage.ErrorPercentage+'%'"/>
                <h2 v-text="Percentage.ErrorCount+'张'"/></div>
        </div>
        <div class="titleL"><i class="fa fa-table"/>
            客户订单详情 <span @click="changeWorkType('','')">=》{{workType.title}}</span>
            <span v-if="workItemType.title"> =》{{workItemType.title}}</span>
        </div>
        <div id="table">
            <button class="filterBtn" @click="filterShow">高级筛选</button>
            <button class="exportBtn">导出数据</button>
            <div class="filterBox" :class="{'show':filterBox}">
                <p>* 请选择筛选条件 <i class="fa fa-times" aria-hidden="true" @click="closeFilter"></i></p>
                <div class="conMain">
                    <div class="con" v-for="(value,key) in columnsJson" :key="key">
                        <div class="cLeft" v-text="value+':'"/>
                        <div class="cRight" v-if="key==='planStartTime'?true:false">
                            <input type="text" :data="key">
                        </div>
                        <div class="cRight" v-else>
                            <input type="text" :data="key">
                        </div>
                    </div>
                </div>
                <div class="filterBtnGroup">
                    <div class="btnCon">
                        <button class="reset" @click="filterReset" v-text="'重置'"/>
                        <button class="confirm" @click="confirm" v-text="'搜索'"/>
                    </div>
                </div>

            </div>
            <input type="text" class="fuzzyInp" placeholder="模糊筛选" v-model="fuzzyFilter" @input="fuzzyInp">
            <el-table
                    :data="tableData"
                    border
                    size="mini"
                    ref="filterTable"
                    :fit="true"
                    :default-sort="{prop: 'date', order: 'descending'}"
                    style="width: 100%"
                    :cell-style="{padding:'0px'}"
                    :height="tableOffset"
            >
                <el-input
                        v-model="search"
                        size="mini"
                        placeholder="输入关键字搜索"/>
                <template v-for="item in columnsData">
                    <el-table-column
                            :key="item"
                            :prop="item"
                            :label="item"
                            sortable
                            show-overflow-tooltip
                            :min-width="120"
                            align="center"
                    />
                </template>
            </el-table>
            <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[ 10, 20, 50,100]"
                    :page-size="pagesize"
                    :total="tableCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Home",
        data() {
            return {
                ReleaseTime: '',
                Owner: '',
                WorkPlanName: '',
                workType:{type:'',title:'全部工单'},
                workItemType:{type:'',title:''},
                Percentage: {
                    EarlyConunt: '',
                    EarlyPercentage: '',
                    ErrorCount: '',
                    ErrorPercentage: '',
                    LateCount: '',
                    LatePercentage: '',
                    OnTimeCount: '',
                    OnTimePercentage: ''
                },
                tableCount: 0,
                currentPage: 1,
                columnsData: [],
                columnsJson: {},
                pageSize: 20,
                curPage: 1,
                pagesize: 20,
                filter: "",
                tableOffset: null,
                loading: false,
                tableData: [],
                value: '',
                search: '',
                filterBox: false,//是否显示精确筛选的框
                fuzzyFilter: '',//模糊筛选
                filterjs: null,//精确筛选的对象
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
            this.getPlanMessage();
            //计算表格的高度
            let offsetTop = document.getElementById('table').offsetTop - 50 || document.body.scrollTop - 50;
            let wrapH = document.getElementsByClassName('wrap')[0].clientHeight - 50;
            this.tableOffset = wrapH - offsetTop - 32 - 60;
        },
        methods: {

            //获取工单的描述
            getPlanMessage() {
                this.$http({
                    url: 'PlanMessage',
                }).then(res => {
                    this.Owner = res.Owner;
                    this.WorkPlanName = res.WorkPlanName;
                    this.ReleaseTime = res.ReleaseTime;
                    this.getPercentage();
                });
            },
            //获取的百分比
            getPercentage() {
                this.$http({
                    url: 'GetPercentage',
                }).then(res => {
                    this.Percentage = res;
                    this.getTableColumn();
                });
            },
            getDataCenterData(pageSize, curPage, filter,) {

                //获取表格的数据
                this.tableData = [];
                this.$http({
                    url: 'DataCenter',
                    data: {
                        "PageSize": pageSize ? pageSize : "20",
                        "CurPage": curPage ? curPage : "1",
                        "filter": filter ? JSON.stringify(filter) : null,
                        "fuzzyFilter": this.fuzzyFilter,
                        "workType":this.workItemType.type?this.workItemType.type:''
                    },
                }).then(res => {
                    res.data = JSON.parse(res.data);
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i]['需求日期'] = this.$Fun.foramateDate(res.data[i]['需求日期']);
                        res.data[i]['计划开始时间'] = this.$Fun.formateTime(res.data[i]['计划开始时间']);
                        res.data[i]['计划结束时间'] = this.$Fun.formateTime(res.data[i]['计划结束时间']);
                    }
                    this.tableData.push(...res.data);
                    this.tableCount = res.total;
                });

            },
            getTableColumn() {
                //获取表格的列
                this.$http({
                    url: "TableFiled",
                    data: {
                        "tableName": "WorkOrder"
                    }
                }).then(res => {
                    let data = JSON.stringify(res).split(',');
                    this.columnsData = [];
                    this.columnsJson = res;
                    data.forEach(item => {
                        let itemData = item.split(':')[1];
                        var reg = new RegExp('"', "g");
                        itemData = itemData.replace(reg, '');
                        if (itemData.indexOf('}') !== -1) {
                            itemData = itemData.replace('}', '');
                        }
                        this.columnsData.push(itemData);
                    });
                    this.getDataCenterData();
                })
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.getDataCenterData(this.pagesize, this.currentPage, this.filterjs);
            },
            handleSizeChange: function (size) {
                //table的页数发生改变触发事件
                this.pagesize = size;
                this.currentPage = 1;
                this.getDataCenterData(this.pagesize, this.currentPage, this.filterjs);
            },
            filterShow() {
                //高级筛选的按钮的点击事件
                this.filterBox = this.filterBox ? false : true;
            },
            closeFilter() {
                //高级筛选框的关闭按钮
                this.filterBox = false;
            },
            filterReset() {
                //高级筛选的重置按钮
                let cRight = document.querySelectorAll('.cRight');
                cRight.forEach(item => {
                    item.children[0].value = ''
                });
                this.filterjs = null;
                this.getDataCenterData();
                this.closeFilter();
            },
            confirm() {
                //高级筛选的确定按钮
                let cRight = document.querySelectorAll('.cRight');
                this.filterjs = {};
                cRight.forEach(item => {
                    let inputVal = item.children[0].value.trim();
                    let inputAttr = item.children[0].attributes['data'].value;
                    if (inputVal != '') {
                        this.filterjs [inputAttr] = inputVal;
                    }
                });
                this.currentPage = 1;
                console.log(this.filterjs);
                this.getDataCenterData(this.pagesize, this.currentPage, this.filterjs, this.fuzzyFilter);
                this.closeFilter();
            },
            fuzzyInp() {
                //模糊筛选的input事件
                this.currentPage = 1;
                console.log(this.fuzzyFilter);
                this.getDataCenterData(this.pagesize, this.currentPage, this.filterjs, this.fuzzyFilter.trim());
            },
            changeWorkType(type,title){
                this.workItemType.title = title;
                this.workItemType.type = type;
                this.currentPage = 1;
                this.getDataCenterData();
            }
        }
    }
</script>
<style lang="scss" scoped>
    [v-cloak] {
        display: none;
    }

    html, body {
        width: 100%;
        height: 100%;
    }

    .wrap {
        .title, .titleL {
            height: 30px;
            line-height: 30px;
            text-align: right;
            background-color: #E2E3E5;
            padding: 6px 10px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            font-size: 14px;
            overflow: hidden;
        }
        .titleL {
            text-align: left;
        }

        .flexBox {
            display: flex;
            margin: 20px 0;

            div {
                flex-grow: 1;
                margin: 0 12px;
                -webkit-border-radius: 8px;
                -moz-border-radius: 8px;
                border-radius: 8px;
                padding: 8px;
                background-color: red;
                border-bottom: 1px solid rgba(0, 0, 0, .125);

                .card-header {
                    color: white;
                    font-size: 14px;
                }
            }

            div:nth-child(1), .wrap .flexBox div:nth-last-child(1) {
                margin: 0;
            }

            .primaryBox {
                background-color: #007bff;
            }

            .successBox {
                background-color: #28a745;
            }

            .warningBox {
                background-color: #ffc107;
            }

            .dangerBox {
                background-color: #dc3545;
            }

            h2 {
                color: white;
                text-align: right;
            }
        }

        #table {
            position: relative;
            margin-top: 15px;

            .filterBtn, .exportBtn {
                padding: 6px;
                font-size: 12px;
                background-color: #007bff;
                color: white;
                border: none;
                cursor: pointer;
                font-weight: 400;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                margin-bottom: 8px;
                outline: none;
            }

            .exportBtn {
                margin-right: 12px;
                float: right;
            }

            .filterBox {
                display: none;
                position: absolute;
                left: 0;
                top: 30px;
                z-index: 10000;
                height: 260px;
                background-color: white;
                border: 1px solid #808080;
                width: 300px;
                border-radius: 4px;

                p {
                    width: 100%;
                    padding: 4px;
                    color: #17a2b8;
                    border-bottom: 1px solid #808080;
                    font-size: 14px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;

                    i {
                        float: right;
                    }
                }

                .conMain {
                    height: 190px;
                    overflow-x: hidden;
                    overflow-y: scroll;

                    .con {
                        width: 100%;
                        margin: 4px 0;

                        .cLeft {
                            width: 40%;
                            float: left;
                            padding: 4px;
                            font-size: 12px;
                            white-space: nowrap;
                            box-sizing: border-box;
                        }

                        .cRight {
                            float: right;
                            width: 60%;
                            box-sizing: border-box;
                            padding: 0 4px;

                            input {
                                border: 1px solid #ced4da;
                                border-radius: 4px;
                                box-sizing: border-box;
                                width: 100%;
                                padding: 4px;
                            }
                        }
                    }

                    .con:after {
                        display: block;
                        content: '';
                        clear: both;
                    }
                }

                .conMain::-webkit-scrollbar {
                    display: none;
                }

                .filterBtnGroup {
                    background-color: white;
                    position: absolute;
                    bottom: 0;
                    border-top: 1px solid #808080;
                    width: 100%;
                    padding: 4px 0;

                    .btnCon {
                        display: block;
                        width: 50%;
                        margin: 0 auto;

                        .reset {
                            color: #fff;
                            background-color: #dc3545;
                            border-color: #dc3545;
                            outline: none;
                            border: none;
                            font-size: 12px;
                            width: 50px;
                            padding: 4px 0;
                        }

                        .confirm {
                            color: #fff;
                            background-color: #28a745;
                            border-color: #28a745;
                            outline: none;
                            border: none;
                            font-size: 12px;
                            width: 50px;
                            padding: 4px 0;
                            float: right;
                        }
                    }

                }
            }

            .show {
                display: block;
            }

            .fuzzyInp {
                margin-left: 10px;
                padding: 4px;
            }
        }
    }

    @media screen and (max-width: 767px) {
        .wrap {
            width: 100% !important;
            margin-left: 0 !important;

            .flexBox {
                display: block;

                div {
                    width: 100%;
                    box-sizing: border-box;
                    margin: 12px 0;

                    .card-header {
                        font-size: 12px;
                    }
                }
            }
        }
    }
</style>
