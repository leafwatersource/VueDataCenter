<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="home wrap" :class="{'WrapShow':WrapShow}" v-if="[v-cloak]">
        <div class="title" v-text="'当前计划发布日期：'+ReleaseTime+'，最后计划发布人：'+Owner+'，计划发布名称：'+WorkPlanName"/>
        <div class="flexBox">
            <div class="primaryBox">
                <span class="card-header" v-text="'提前交货订单:'+Percentage.EarlyPercentage+'%'"/>
                <h2 v-text="Percentage.EarlyConunt+'张'"/>
            </div>
            <div class="successBox"><span class="card-header" v-text="'正常交货订单:'+Percentage.OnTimePercentage+'%'"/>
                <h2 v-text="Percentage.OnTimeCount+'张'"/></div>
            <div class="warningBox"><span class="card-header" v-text="'延迟订单:'+Percentage.LatePercentage+'%'"/>
                <h2 v-text="Percentage.LateCount+'张'"/></div>
            <div class="dangerBox"><span class="card-header" v-text="'异常排程订单:'+Percentage.ErrorPercentage+'%'"/>
                <h2 v-text="Percentage.ErrorCount+'张'"/></div>
        </div>
        <div class="titleL"><i class="fa fa-table"/> 客户订单详情</div>
        <div id="table" style="margin-top: 15px;">
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
                <template v-for="item in columnsData">
                    <el-table-column
                            :key="item"
                            :prop="item"
                            :label="item"
                            sortable
                            show-overflow-tooltip
                            :min-width="120"
                            align="center"
                            v-if="item == '工单号码'"
                    />
                    <el-table-column
                            :key="item"
                            :prop="item"
                            :label="item"
                            sortable
                            show-overflow-tooltip
                            :min-width="120"
                            align="center"
                            v-else
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
                pageSize: 20,
                curPage: 1,
                pagesize: 20,
                filter: "",
                tableOffset: null,
                loading: false,
                tableData: [],
                value: ''
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
            let offsetTop = document.getElementById('table').offsetTop - 50 || document.body.scrollTop - 50;
            let wrapH = document.getElementsByClassName('wrap')[0].clientHeight - 50;
            this.tableOffset = wrapH - offsetTop - 32;


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
            getDataCenterData(pageSize, curPage) {
                this.tableData = [];
                this.$http({
                    url: 'DataCenter',
                    data: {
                        "PageSize": pageSize ? pageSize : "20",
                        "CurPage": curPage ? curPage : "1"
                    },
                }).then(res => {
                    res.data = JSON.parse(res.data);
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i]['需求日期'] = this.foramateDate(res.data[i]['需求日期']);
                        res.data[i]['计划开始时间'] = this.formateTime(res.data[i]['计划开始时间']);
                        res.data[i]['计划结束时间'] = this.formateTime(res.data[i]['计划结束时间']);
                    }
                    this.tableData.push(...res.data);
                    this.tableCount = res.total;
                });

            },
            getTableColumn() {
                this.$http({
                    url: "TableFiled",
                    data: {
                        "tableName": "WorkOrder"
                    }
                }).then(res => {
                    let data = JSON.stringify(res).split(',');
                    this.columnsData = [];
                    data.forEach(item => {
                        let itemData = item.split(':')[1];
                        var reg = new RegExp('"', "g")
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
                this.getDataCenterData(this.pagesize, this.currentPage);
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.currentPage = 1;
                this.getDataCenterData(this.pagesize, this.currentPage);
            },
            foramateDate(time) {
                if (time) {
                    var datetime = new Date(time);
                    var year = datetime.getFullYear();
                    var month = datetime.getMonth() + 1;
                    var date = datetime.getDate();
                    return year + '/' + month + '/' + date;
                }
            },
            formateTime(time) {
                if (time) {
                    var datetime = new Date(time);
                    var year = datetime.getFullYear();
                    var month = datetime.getMonth() + 1;
                    var date = datetime.getDate();
                    var hour = datetime.getHours() > 9 ? datetime.getHours() : '0' + datetime.getHours();
                    var min = datetime.getMinutes() > 9 ? datetime.getMinutes() : '0' + datetime.getMinutes();
                    return year + '/' + month + '/' + date + ' ' + hour + ':' + min;
                }
            }
        }
    };
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
