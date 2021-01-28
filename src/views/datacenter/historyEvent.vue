<template>
  <Layout>
    <template v-slot:main>
      <div class="wrap" :class="{'WrapShow':!NavShow}">
        <h2>手机报工操作记录</h2>
        <div id="table" style="margin-top: 15px;">
          <filterInput :columnsJson="columnsData" :filterBox="filterBox" @UpdatefilterBox="UpdatefilterBox"
                       @updateData="updateData" />
          <!--<input type="text" class="fuzzyInp" placeholder="" v-model="" >-->
          <el-input
            placeholder="请输入产品或工单"
            size="mini"
            v-model.trim="fuzzyFilter"
            @input="getTableData"
            clearable>
          </el-input>
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
              <el-table-column v-if="item.key==='TaskFinishState'"
                               :key="item.key"
                               :prop="item.value"
                               :label="item.value"
                               sortable
                               show-overflow-tooltip
                               :width="item.width"
                               align="center"
              >
                <template slot-scope="scope">
                  {{scope.row['完成状态']=='1'?'正在切换':(scope.row['完成状态']=='2'?'正在生产':(scope.row['完成状态']=='3'?
                  '订单暂停':(scope.row['完成状态']=='4' || scope.row['完成状态']=='5')?'订单完成':''))}}
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
      </div>
    </template>
  </Layout>
</template>

<script>
  import Layout from '../../components/datacenterComponents/public/layout'
  import {mapState,mapMutations} from 'vuex'
  import filterInput  from '../../components/datacenterComponents/public/filterInput'

  export default {
    name: "history",
    components: {
      Layout,
      filterInput
    },
    data() {
      return {
        columnsData: [],//表格的列名
        tableCount: 0,//表格的数据量
        currentPage: 1,//当前选择的页数
        curPage: 1,//当前的页数
        pagesize: 20,//一页多少条数据
        tableData: [],//表格的数据
        tableOffset: null,//表格的高度
        filter: {},//表格精确筛选条件
        filterBox: false,//是否显示精确筛选的框
        fuzzyFilter:'',//模糊筛选
      }
    },
    computed: {
      ...mapState({
        'NavShow':state=>state.datacenterStore.NavShow
      }),
    },
    mounted() {
      this.ChangeNavTitle('事件记录');
      this.renderPage();
      this.setTableHeight();
    },
    methods: {
      ...mapMutations(['ChangeNavTitle']),
      renderPage(){
        //页面初始化
        this.getTableCounmns().then(res=>{
          //key: "jobFinished"
          // switchNameT: false
          // value: "生产状态"
          // width: "120"
          res = res.sort((a,b)=>a['indexNameT']-b['indexNameT']);
          this.columnsData = [];
          res.forEach(item=>{
            for(let prop in item){
              let obj = {};
              if(prop !== 'type' && prop !== 'width' && prop.indexOf('NameT')===-1){
                obj['key'] = prop;
                obj['value'] = item[prop];
                obj['switchNameT'] = item['switchNameT'] !== "False";
                obj['width'] = item['width'];
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
        let wrapH = document.getElementsByClassName('el-main')[0].clientHeight;
        this.tableOffset = wrapH - offsetTop-30;
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
              "filter":JSON.stringify(this.filter),
              "fuzzyFilter": this.fuzzyFilter,
            }
          }).then(res => {
            this.tableCount = res.data['total'];
            this.tableData = [];
            res.data['rows'] = JSON.parse(res.data['rows']);
            this.tableData = res.data['rows'];
            const time = this.columnsData.filter(item=>item['key'] === 'dailyDate')[0];
            this.tableData.forEach(item=>{
              item[time['value']] = this.$Fun.foramateDate(item[time['value']]);
            })
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
      UpdatefilterBox(val) {
        //筛选框子组件向父组件传递是否隐藏
        this.filterBox = val;
      },
      updateData(filterjs) {
        //根据子组件传来的筛选值更新数据
        this.currentPage = 1;
        this.filter= filterjs||{};
        this.getTableData();
      },
      fuzzyInp(){
        //模糊筛选

      }
    }
  }
</script>
<style scoped>
  .wrap p {
    display: flex;
    flex-wrap: wrap;
  }

  .wrap .active {
    color: gray;
    border: 1px solid gray;
  }
  .wrap span {
    margin: 2px 4px;
    color: #007bff;
    cursor: pointer;
    border: 1px solid #007bff;
    padding: 2px 6px;
    border-radius: 4px;
  }
  #table {
    position: relative;
  }
  /deep/ .el-table .cell{
    height: 28px !important;
    white-space: nowrap;
  }
  /deep/ #table .el-input {
    width: auto;
  }
</style>
