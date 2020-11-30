<template>
    <div class="home wrap" :class="{'WrapShow':!NavShow}" v-if="[v-cloak]">
        <div class="title" v-text="'当前计划发布日期：'+ReleaseTime+'，最后计划发布人：'+Owner+'，计划发布名称：'+WorkPlanName"/>
        <WorkNumMessage :Percentage="Percentage" @changeWorkType="WorkType" />
        <div class="titleL">
            <i class="fa fa-table"/>
            客户订单详情 <span @click="changeWorkType('','')">=》{{workType.title}}</span>
            <span v-if="workItemType.title"> =》{{workItemType.title}}</span>
        </div>
        <div id="table">
            <button class="exportBtn">导出数据</button>
            <filterInput :columnsJson="columnsJson" :filterBox="filterBox" @UpdatefilterBox="UpdatefilterBox" @updateData="updateData" />
            <input type="text" class="fuzzyInp" placeholder="模糊筛选" v-model="fuzzyFilter" @input="fuzzyInp">
            <el-table
                    :data="tableData"
                    border
                    size="mini"
                    ref="filterTable"
                    :fit="true"
                    :default-sort="{prop: 'date', order: 'descending'}"
                    style="width: 100%;min-height:500px;"
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
    import filterInput from '../components/public/FilterInput'//精确筛选
    import WorkNumMessage from '../components/DataCenter/WorkNumMessage'//展示工单信息的四个框
    export default {
        name: "Home",
        components:{
            filterInput,
            WorkNumMessage
        },
        data() {
            return {
                ReleaseTime: '',//计划发布的日期
                Owner: '',//计划发布人
                WorkPlanName: '',//计划发布的名称
                workType:{type:'',title:'全部工单'},//工单的类型（全部工单，异常工单，延迟工单，正常工单，提前工单）
                workItemType:{type:'',title:''},
                Percentage: {
                    EarlyConunt: '',//提前工单的数量
                    EarlyPercentage: '',//提前工单的百分比
                    ErrorCount: '',//异常工单的数量
                    ErrorPercentage: '',//异常工单的百分比
                    LateCount: '',//延迟工单的数量
                    LatePercentage: '',//延迟工单的百分比
                    OnTimeCount: '',//正常工单的数量
                    OnTimePercentage: ''//正常工单的百分比
                },//提前、异常、延迟、正常工单的统计值
                tableCount: 0,//表格的数据量
                currentPage: 1,//表格的当前选择的页数
                columnsData: [],//表格的列名
                columnsJson: {},//表格的列名(用于精确筛选)
                curPage: 1,//当前表格的页数
                pagesize: 20,//一页多少条数据
                filter: "",//表格的筛选条件
                tableOffset: null,//table的高度
                loading: false,//是否加载动画
                tableData: [],//表格的数据
                value: '',
                search: '',
                filterBox: false,//是否显示精确筛选的框
                fuzzyFilter: '',//模糊筛选
                filterjs: null,//精确筛选的对象
            }
        },
        computed: {
            ...mapState(['NavShow']),
        },
        mounted() {
            this.renderPage();
            //计算表格的高度
            let offsetTop = document.getElementById('table').offsetTop;
            let wrapH = document.getElementsByClassName('wrap')[0].clientHeight;
            this.tableOffset = wrapH - offsetTop;
        },
        methods: {
            WorkType(data){
                //子组件修改父组件的工单类型
                this.changeWorkType(...data)
            },
            UpdatefilterBox(val){
                //筛选框子组件向父组件传递是否隐藏
                this.filterBox = val;
            },
            updateData(filterjs){
                //根据子组件传来的筛选值更新数据
                this.currentPage = 1;
                this.filterjs = filterjs;
                this.getDataCenter(this.pagesize, this.currentPage, this.filterjs, this.fuzzyFilter);
            },
            getPlanMessage(){
                //获取工单的描述
                return new Promise(resolve=>{
                    this.$http({
                        url: 'PlanMessage',
                    }).then(res => {
                        resolve(res);
                    });
                })
            },
            getPercentage(){
                //获取的百分比
                return new Promise(resolve => {
                    this.$http({
                        url: 'GetPercentage',
                    }).then(res => {
                        resolve(res);
                    });
                })
            },
            getTableColumn(){
                //获取表格的列名
                return new Promise(resolve => {
                    this.$http({
                        url: "TableFiled",
                        data: {
                            "tableName": "WorkOrder"
                        }
                    }).then(res => {
                        resolve(res);
                    })
                })
            },
            getDataCenter(pageSize, curPage, filter){
                //获取表格的数据
                return new Promise(resolve => {
                    this.tableData = [];
                    this.$http({
                        url: 'DataCenter',
                        data: {
                            "PageSize": this.pagesize,
                            "CurPage": curPage ? curPage : "1",
                            "filter": filter ? JSON.stringify(filter) : null,
                            "fuzzyFilter": this.fuzzyFilter,
                            "workType":this.workItemType.type?this.workItemType.type:''
                        },
                    }).then(res => {
                        res.data = JSON.parse(res.data);
                        this.tableData.push(...res.data);
                        this.tableCount = res.total;
                        resolve(res);
                    });
                })
            },
            renderPage(){
                //初始化数据
                this.getPlanMessage().then(result=>{
                    //获取工单的信息
                    this.Owner = result.Owner;
                    this.WorkPlanName = result.WorkPlanName;
                    this.ReleaseTime = result.ReleaseTime;
                    return this.getPercentage();
                }).then(result=>{
                    //处理工单的统计信息
                    this.Percentage = result;
                    return this.getTableColumn();
                }).then(result=>{
                    //处理表格列
                    this.columnsData = [];
                    this.columnsJson = [];
                    result.forEach(item=>{
                        for(let props in item){
                            if(props!='type'){
                                this.columnsData.push(item[props]);
                                let arr = {};
                                arr['key'] = props;
                                arr['value'] = item[props];
                                this.columnsJson.push(arr);
                            }
                        }
                    });
                    return this.getDataCenter();
                }).catch(error=>{
                    //异常操作
                    console.log(error);
                })
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.getDataCenter(this.pagesize, this.currentPage, this.filterjs);
            },
            handleSizeChange: function (size) {
                //table的页数发生改变触发事件
                this.pagesize = size;
                this.currentPage = 1;
                this.getDataCenter(this.pagesize, this.currentPage, this.filterjs);
            },
            filterShow() {
                //高级筛选的按钮的点击事件
                this.filterBox = this.filterBox ? false : true;
            },
            fuzzyInp() {
                //模糊筛选的input事件
                this.currentPage = 1;
                this.getDataCenter(this.pagesize, this.currentPage, this.filterjs, this.fuzzyFilter.trim());
            },
            changeWorkType(type,title){
                //选择工单类型发生变化，比如刚开始的全部工单选择了正常交货订单
                this.workItemType.title = title;
                this.workItemType.type = type;
                this.currentPage = 1;
                this.getDataCenter();
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
        //工单信息展示的样式
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
        //表格的样式
        #table {
            position: relative;
            margin-top: 15px;

            .exportBtn {
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
                margin-right: 12px;
                float: right;
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
