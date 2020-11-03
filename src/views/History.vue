<template>
    <div class="wrap" :class="{'WrapShow':!NavShow}">
        <h1>手机报工操作记录</h1>
        <p>
            <span @click="TodayData">查询今天的数据</span>
            <span @click="WeekData">查询最近七天</span>
            <span @click="MonthData">查询最近一个月</span>
            <span @click="ThreeMonthData">查询最近三个月</span>
            <span @click="HalfYearData">查询最近半年</span>
            <span @click="AllData" class="active">全部数据</span>
        </p>
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
                            :key="item.key"
                            :prop="item.value"
                            :label="item.value"
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
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                columnsData: [],
                tableCount: 0,
                currentPage: 1,
                pageSize: 20,
                curPage: 1,
                pagesize: 20,
                tableData: [],
                tableOffset: null,
                filter: '',
            }
        },
        computed: {
            ...mapState(['NavShow']),
        },
        mounted() {
            this.getTableCounmns();
            let offsetTop = document.getElementById('table').offsetTop - 50 || document.body.scrollTop - 50;
            let wrapH = document.getElementsByClassName('wrap')[0].clientHeight - 50;
            this.tableOffset = wrapH - offsetTop - 32;
        },
        methods: {
            getTableCounmns() {
                this.$http({
                    url: "TableFiled",
                    data: {
                        "tableName": "History",
                        "filter": this.filter
                    }
                }).then(res => {
                    this.columnsData = [];
                    res.forEach(item=>{
                       for(let prop in item){
                           if(prop !== 'type'){
                               let obj = {};
                               obj['key'] = prop;
                               obj['value'] = item[prop];
                               this.columnsData.push(obj);
                           }
                       }
                    });
                    this.getTableData();
                });
            },
            getTableData() {
                this.$http({
                    url: 'History',
                    data: {
                        "PageSize": this.pagesize,
                        "CurPage": this.currentPage,
                        "filter": this.filter,
                    }
                }).then(res => {
                    this.tableCount = res.data['total'];
                    this.tableData = [];
                    res.data['rows'] = JSON.parse(res.data['rows']);
                    this.tableData = res.data['rows'];
                })
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.getTableData(this.pagesize, this.currentPage);
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.currentPage = 1;
                this.getTableData(this.pagesize, this.currentPage);
            },
            TodayData(e) {
                this.filter = this.$Fun.getCusDateTime('today');
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            ThreeMonthData(e) {
                this.filter = this.$Fun.getCusDateTime('ThreeMonth');
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            WeekData(e) {
                this.filter = this.$Fun.getCusDateTime('week');
                console.log(this.filter);
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            MonthData(e) {
                this.filter = this.$Fun.getCusDateTime('month');
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            HalfYearData(e) {
                this.filter = this.$Fun.getCusDateTime('HalfYear');
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            AllData(e) {
                this.filter = "";
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            }
        }
    }
</script>
<style scoped lang="scss">
    .wrap {
        p {
            display: flex;
            flex-wrap: wrap;

            span {
                margin: 2px 4px;
                color: #007bff;
                cursor: pointer;
                border: 1px solid #007bff;
                padding: 2px 6px;
                border-radius: 4px;
            }

            .active {
                color: gray;
                border: 1px solid gray;
            }
        }
    }
</style>
