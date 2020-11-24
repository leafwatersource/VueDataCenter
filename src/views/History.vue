<template>
    <div class="wrap" :class="{'WrapShow':!NavShow}">
        <h2>手机报工操作记录</h2>
        <p>
            <span @click="TodayData">查询今天的数据</span>
            <span @click="WeekData">查询最近七天</span>
            <span @click="MonthData">查询最近一个月</span>
            <span @click="ThreeMonthData">查询最近三个月</span>
            <span @click="HalfYearData">查询最近半年</span>
            <span @click="AllData" class="active">全部数据</span>
        </p>
        <!--<p>-->
            <!--<input type="text" placeholder="模糊查询">-->
        <!--</p>-->
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
                columnsData: [],//表格的列名
                tableCount: 0,//表格的数据量
                currentPage: 1,//当前选择的页数
                curPage: 1,//当前的页数
                pagesize: 20,//一页多少条数据
                tableData: [],//表格的数据
                tableOffset: null,//表格的高度
                filter: '',//表格筛选条件
            }
        },
        computed: {
            ...mapState(['NavShow']),
        },
        mounted() {
            this.renderPage();
            this.setTableHeight();
        },
        methods: {
            renderPage(){
                //页面初始化
                this.getTableCounmns().then(res=>{
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
                    return this.getTableData();
                })
            },
            setTableHeight(){
                //设置表格的高度
                let offsetTop = document.getElementById('table').offsetTop;
                let wrapH = document.getElementsByClassName('wrap')[0].clientHeight;
                this.tableOffset = wrapH - offsetTop;
                window.onresize = ()=>{
                    let offsetTop = document.getElementById('table').offsetTop;
                    let wrapH = document.getElementsByClassName('wrap')[0].clientHeight;
                    this.tableOffset = wrapH - offsetTop;
                }
            },
            getTableCounmns(){
                //获取表格的列名
              return new Promise(resolve => {
                  this.$http({
                      url: "TableFiled",
                      data: {
                          "tableName": "History",
                          "filter": this.filter
                      }
                  }).then(res => {
                      resolve(res);
                  });
              })
            },
            getTableData(){
                //获取表格数据
                return new Promise(() => {
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
                })
            },
            handleCurrentChange: function (currentPage) {
                //点击下一页，获取点击某一页
                this.currentPage = currentPage;
                this.getTableData(this.pagesize, this.currentPage);
            },
            handleSizeChange: function (size) {
                //改变一页展示的数据量
                this.pagesize = size;
                this.currentPage = 1;
                this.getTableData();
            },
            TodayData(e) {
                //获取今天的数据
                this.filter = this.$Fun.getCusDateTime('today');
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            ThreeMonthData(e) {
                //获取近三个月的数据
                this.filter = this.$Fun.getCusDateTime('ThreeMonth');
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            WeekData(e) {
                //获取一周内的数据
                this.filter = this.$Fun.getCusDateTime('week');
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            MonthData(e) {
                //获取一个月内的数据
                this.filter = this.$Fun.getCusDateTime('month');
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            HalfYearData(e) {
                //获取半年内的数据
                this.filter = this.$Fun.getCusDateTime('HalfYear');
                this.currentPage = 1;
                document.getElementsByClassName('active')[0].classList.remove('active');
                e.target.classList.add('active');
                this.getTableData();
            },
            AllData(e) {
                //获取所有的数据
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
