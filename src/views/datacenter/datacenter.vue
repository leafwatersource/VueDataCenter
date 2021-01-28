<template>
  <Layout>
    <template v-slot:main>
      <PlanMessage></PlanMessage>
      <WorkNum :Percentage="Percentage" @changeWorkType="WorkType"></WorkNum>
      <div id="table">
        <filterInput :columnsJson="columnsJson" :filterBox="filterBox" @UpdatefilterBox="UpdatefilterBox"
                     @updateData="updateData" />
        <button class="exportBtn">导出数据</button>
        <input type="text" class="fuzzyInp" placeholder="模糊筛选" v-model="fuzzyFilter" @input="fuzzyInp">
        <el-date-picker
          type="dates"
          popper-class="datePicker"
          size="mini"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          v-model="filterFirstDemandDay"
          @change="getDataCenter"
          placeholder="选择一个或多个需求日期">
        </el-date-picker>

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
          @row-dblclick="rowClick"
        >
          <template v-for="item in columnsJson">
            <el-table-column v-if="item.key==='jobFinished'"
                             :key="item.key"
                             :prop="item.value"
                             :label="item.value"
                             sortable
                             show-overflow-tooltip
                             :width="item.width"
                             align="center"
            >
              <template slot-scope="scope">
                <i class="el-icon-video-play finishStatus"
                   :class="{'finishStatusColorGreen':scope.row['延迟天数'] =='0' || scope.row['延迟天数']<'0',
                                    'finishStatusColorRed':scope.row['延迟天数']>0,
                                    'finishStatusColorOrange':scope.row['延迟天数'] ==null,
                                }"
                   v-if="scope.row['生产状态']=='0'||scope.row['生产状态']==null||scope.row['生产状态']=='-1'"
                ></i>
                <i class="el-icon-video-pause finishStatus"
                   :class="{'finishStatusColorGreen':scope.row['延迟天数'] =='0' || scope.row['延迟天数']<'0',
                                    'finishStatusColorRed':scope.row['延迟天数']>0,
                                    'finishStatusColorOrange':scope.row['延迟天数'] ==null,
                                }"
                   v-else-if="scope.row['生产状态']=='1'"
                ></i>
                <i class="el-icon-circle-check finishStatus"
                   :class="{'finishStatusColorGreen':scope.row['延迟天数'] =='0' || scope.row['延迟天数']<'0',
                                    'finishStatusColorRed':scope.row['延迟天数']>0,
                                    'finishStatusColorOrange':scope.row['延迟天数']==null,
                                }"
                   v-else
                ></i>
                {{scope.row['生产状态']=='0'||!scope.row['生产状态']||scope.row['生产状态']=='-1'?'未生产':(scope.row['生产状态']=='1'?'生产中':'已完成')}}
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.value==='完成比例'"
                             :key="item.key"
                             :prop="item.value"
                             :label="item.value"
                             sortable
                             show-overflow-tooltip
                             :width="item.width"
                             align="center"
            >
              <template slot-scope="scope">
                <div v-if="scope.row['完成比例']==null">
                  <el-progress :text-inside="true" :stroke-width="20" :percentage="0" color="#000"></el-progress>
                </div>
                <div v-else style="font-size: 12px">
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="scope.row['完成比例']"
                               color="#28A745"></el-progress>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="item.key"
              :prop="item.value"
              :label="item.value"
              sortable
              show-overflow-tooltip
              :width="item.width"
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
      <GanteWrap :drawer="GanteWrapFlag" @GanTeClose="GanTeClose" :OpMessage="OpMessage"
                 :SelectWorkItem="SelectWorkItem"/>
    </template>
  </Layout>
</template>

<script>
  import PlanMessage from '../../components/datacenterComponents/datacenter/PlanMessage'
  import WorkNum from '../../components/datacenterComponents/datacenter/WorkNumMessage'
  import Layout from '../../components/datacenterComponents/public/layout'
  import GanteWrap from '../../components/datacenterComponents/datacenter/TableRowDrawer'
  import filterInput  from '../../components/datacenterComponents/public/filterInput'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "datacenter",
    components: {
      PlanMessage,
      WorkNum,
      Layout,
      GanteWrap,
      filterInput,
    },
    data() {
      return {
        workType: {type: '', title: '全部工单'},//工单的类型（全部工单，异常工单，延迟工单，正常工单，提前工单）
        workItemType: {type: '', title: ''},
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
        columnsJson: {},//表格的列名
        curPage: 1,//当前表格的页数
        pagesize: 20,//一页多少条数据
        filter: "",//表格的筛选条件
        tableOffset: null,//table的高度
        loading: false,//是否加载动画
        tableData: [],//表格的数据
        value: '',
        filterBox: false,//是否显示精确筛选的框
        fuzzyFilter: '',//模糊筛选
        filterjs: null,//精确筛选的对象
        GanteWrapFlag: false,//甘特图的模态框是否显示
        OpMessage: null,//按工单搜索出来的所有工序的信息
        SelectWorkItem: null,//双击后选择的工单信息
        filterFirstDemandDay: '',//筛选交货日期
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }],//交货日期的快捷选项
        },
      }
    },
    computed: {
      ...mapState({
        'NavShow':state=>state.datacenterStore.NavShow
      }),
    },
    mounted() {
      this.renderPage();
      //计算表格的高度
      let offsetTop = document.getElementById('table').offsetTop;
      let wrapH = document.getElementsByClassName('el-main')[0].clientHeight;
      this.tableOffset = wrapH - offsetTop - 30;
      this.ChangeNavTitle('订单查询');
    },
    methods: {
      ...mapMutations(['ChangeNavTitle']),
      GanTeClose(arg) {
        //甘特图抽屉的关闭事件
        this.GanteWrapFlag = arg;
      },
      rowClick(row,) {
        //表格内所有的行的双击事件,根据工单号码获取工单下的所有的工序的进度
        const workid = row['工单号码'];
        this.getOpdata(workid);
        this.GanteWrapFlag = true;
        this.SelectWorkItem = row;
      },
      getOpdata(workid) {
        //根据工单号码搜索工单下所有的工序的进度
        this.$http({
          url: 'GetAllOP',
          data: {
            "workID": workid
          }
        }).then(res => {
          this.OpMessage = res;
        });
      },
      WorkType(data) {
        //子组件修改父组件的工单类型
        this.changeWorkType(...data)
      },
      UpdatefilterBox(val) {
        //筛选框子组件向父组件传递是否隐藏
        this.filterBox = val;
      },
      updateData(filterjs) {
        //根据子组件传来的筛选值更新数据
        this.currentPage = 1;
        this.filterjs = filterjs;
        this.getDataCenter(this.pagesize, this.currentPage, this.filterjs, this.fuzzyFilter);
      },
      getPlanMessage() {
        //获取工单的描述
        return new Promise(resolve => {
          this.$http({
            url: 'PlanMessage',
          }).then(res => {
            resolve(res);
          });
        })
      },
      getPercentage() {
        //获取的百分比
        return new Promise(resolve => {
          this.$http({
            url: 'GetPercentage',
          }).then(res => {
            resolve(res);
          });
        })
      },
      getTableColumn() {
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
      getDataCenter(pageSize, curPage, filter) {
        //获取表格的数据
        return new Promise(resolve => {
          this.tableData = [];
          this.$http({
            url: 'DataCenter',
            data: {
              "PageSize": this.pagesize,
              "CurPage": curPage ? curPage : "1",
              "filter": filter ? JSON.stringify(filter) : null,
              "fuzzyFilter": this.fuzzyFilter.trim(),
              "workType": this.workItemType.type ? this.workItemType.type : '',
              "filterFirstDemandDay":this.filterFirstDemandDay?JSON.stringify(this.filterFirstDemandDay):this.filterFirstDemandDay
            },
          }).then(res => {
            res.data = JSON.parse(res.data);
            this.tableData.push(...res.data);
            this.tableCount = res.total;
            const planStartTime = this.columnsJson.filter(item=>item['key']==="planStartTime")[0];
            const planFinishTime = this.columnsJson.filter(item=>item['key']==="planFinishTime")[0];
            const firstDemandDay = this.columnsJson.filter(item=>item['key']==="firstDemandDay")[0];
            this.tableData.forEach(item=>{
              item[planStartTime['value']] = this.$Fun.formateTime(item[planStartTime['value']],true);
              item[planFinishTime['value']] = this.$Fun.formateTime(item[planFinishTime['value']],true);
              item[firstDemandDay['value']] = this.$Fun.foramateDate(item[firstDemandDay['value']]);
            });
            resolve(res);
          });
        })
      },
      renderPage() {
        //初始化数据
        this.getPlanMessage().then(result => {
          //获取工单的信息
          this.Owner = result.Owner;
          this.WorkPlanName = result.WorkPlanName;
          this.ReleaseTime = result.ReleaseTime;
          return this.getPercentage();
        }).then(result => {
          //处理工单的统计信息
          this.Percentage = result;
          return this.getTableColumn();
        }).then(result => {
          result = result.sort((a,b)=>a['indexNameT']-b['indexNameT']);
          //处理表格列
          this.columnsJson = [];
          result.forEach(item => {
            for (let props in item) {
              let arr = {};
              if (props !== 'type' && props !== 'width'&& props.indexOf('NameT')===-1) {
                arr['key'] = props;
                arr['value'] = item[props];
                arr['width'] = item['width'];
                arr['switchNameT'] = item['switchNameT'] !== "False";
                this.columnsJson.push(arr);
              }

            }
          });
          return this.getDataCenter();
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
      changeWorkType(type, title) {
        //选择工单类型发生变化，比如刚开始的全部工单选择了正常交货订单
        this.workItemType.title = title;
        this.workItemType.type = type;
        this.currentPage = 1;
        this.getDataCenter();
      },

    }
  }
</script>

<style scoped>
  #table {
    position: relative;
    margin-top: 15px;
  }

  #table .exportBtn {
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

  #table .fuzzyInp {
    margin-left: 10px;
    padding: 4px;
  }

  #table .finishStatus {
    font-size: 1rem;
    font-weight: bolder;
  }

  #table .finishStatusColorGreen {
    color: green;
  }

  #table .finishStatusColorRed {
    color: red;
  }

  #table .finishStatusColorOrange {
    color: orange;
  }

  .el-table /deep/ .el-progress-bar__innerText {
    color: #000;
  }
  /deep/ .el-table .cell{
    height: 28px !important;
    white-space: nowrap;
  }
</style>
