<template>
 <Layout>
   <template v-slot:main>
     <div class="about wrap" :class="{'WrapShow':!NavShow}">
       <div class="resBox">
         <div class="resTitle">
           <i class="fa fa-laptop"/>
           <!--<p v-text="'当前设备组:'+CurImplementationResGroup"/>-->
           <p>
             <el-tag
               effect="plain">
               {{ CurImplementationResGroup }}
             </el-tag>
           </p>
           <input type="text" class="SerachRes" placeholder="请输入设备" @input="SerachRes" v-model="Serachres">
           <div class="more" @click="more">展开</div>
         </div>
         <div class="resBody" :class="{'resBodyShow':resBodyShow,'resHide':!resBodyShow}">
           <ul>
             <li v-for="(item,index) in ImplementationResView" :class="{'active':index==0?true:false}"
                 :key="item.resName" v-text="item.resName" @click="resClick"/>
           </ul>
         </div>
       </div>
       <div class="CurResDetail">
         <i class="fa fa-table"></i>
         <span>当前计划详情</span>
         <p class="all" @click="allRes">所有设备</p>
         <span v-if="resource" v-text="'&gt; '+resource"/>
         <span v-text="'&gt; 换模计划'" v-if="changeModelFlag && switchVal"></span>
         <span style="position: absolute;right: 7px;" @click="ChangeModel" v-if="switchVal">换模计划</span>
       </div>
       <div id="table">
         <filterInput :columnsJson="columnsData" :filterBox="filterBox" @UpdatefilterBox="UpdatefilterBox" @updateData="updateData" />
         <button class="exportBtn">导出数据</button>

         <input type="text" class="fuzzyInp" placeholder="模糊筛选" v-model="fuzzyFilter" @input="fuzzyInp">
         <el-date-picker
           size="mini"
           popper-class="datePicker"
           v-model="filterFirstDemandDay"
           type="date"
           align="right"
           unlink-panels
           range-separator="至"
           placeholder="选择交货日期"
           format="yyyy 年 MM 月 dd 日"
           value-format="yyyy-MM-dd"
           @change="ResWorkView"
           :picker-options="pickerOptions">
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
         >
           <template v-for="(item,index) in columnsData">
             <el-table-column
               :key="item.key+index"
               :prop="item.value"
               :label="item.value"
               sortable
               show-overflow-tooltip
               :width="item.width"
               class-name="column"
               align="center"
             />
           </template>
         </el-table>
         <el-pagination
           background
           layout="total, sizes, prev, pager, next, jumper"
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
           :current-page="curPage"
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
  import {mapState, mapMutations} from 'vuex'
  import filterInput from '../../components/datacenterComponents/public/filterInput'
    export default {
        name: "implementation",
      components:{
        Layout,
        filterInput,
      },
      data() {
        return {
          ImplementationResView: [],//所有的设备
          resBodyShow: false,//主体内容是否大屏展示
          resource: '',//当前设备
          curPage: 1,//当前的页数
          pagesize: 20,//表格一页展示多少条数据
          currentPage: 1,//选择那一页数据
          tableCount: 0,//表格的数据量
          tableData: [],//表格内的数据
          columnsData: {},//表格的列名
          tableOffset: null,//表格的高度
          Serachres: '',//搜索的内容
          changeModelFlag: false,//是否点击了换模计划
          filterBox: false,//筛选的元素是否展开
          filterjs: {},//筛选的条件
          fuzzyFilter: '',//模糊筛选的内容
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
          'NavShow':state=>state.datacenterStore.NavShow,
          'CurImplementationResGroup':state=>state.datacenterStore.CurImplementationResGroup,
          'NavTitle':state=>state.datacenterStore.NavTitle,
          'switchVal':state=>state.datacenterStore.switchVal
        }),
      },
      watch: {
        CurImplementationResGroup() {
          this.Serachres = '';
          this.filterjs = null;
          this.filterFirstDemandDay = '';
          this.changeModelFlag = false;
          this.fuzzyFilter = '';
          this.renderPage();
        },
      },
      mounted() {
        //计算表格的高度
        let offsetTop = document.getElementById('table').offsetTop;
        let wrapH = document.getElementsByClassName('el-main')[0].clientHeight;
        this.tableOffset = wrapH - offsetTop - 90;
        this.ChangeNavTitle('执行计划');
        this.renderPage();
      },
      methods: {
        ...mapMutations(['ChangeCurImplementationResGroup','ChangeNavTitle','setSwitchVal']),
        UpdatefilterBox(val){
          //筛选框子组件向父组件传递是否隐藏
          this.filterBox = val;
        },
        updateData(filterjs){
          //根据子组件传来的筛选值更新数据
          this.curPage = 1;
          this.filterjs = filterjs;
          this.ResWorkView();
        },
        renderPage() {
          //初始化页面
          this.GetResView().then(() => {
            return this.getTableColumn().then(res=>{
              this.readShowChangePlan();
              this.columnsData = [];
              res.forEach(item => {
                for (let props in item) {
                  if (props !== 'type' && props !== 'width'&& props.indexOf('NameT')===-1) {
                    let arr = {};
                    arr['key'] = props;
                    arr['value'] = item[props];
                    arr['width'] = item['width'];
                    arr['switchNameT'] = item['switchNameT'] !== "False";
                    this.columnsData.push(arr);
                  }
                }
              });
              return this.ResWorkView()
            })
          });
        },
        GetResView(resName) {
          //获取设备组下的所有的设备
          return new Promise(resolve => {
            this.curPage = 1;
            if (!this.CurImplementationResGroup) {
              this.ChangeCurImplementationResGroup(this.$route.params.name);
            }
            this.$http({
              url: 'ResView',
              data: {
                'resGroup': this.CurImplementationResGroup,
                'resName': resName
              }
            }).then(res => {
              if (res.resCount > 0) {
                this.ImplementationResView = JSON.parse(res.resView);
                if (document.getElementsByClassName('active').length > 0) {
                  document.getElementsByClassName('active')[0].classList.remove('active');
                }
                this.resource = this.ImplementationResView[0].resName;
                resolve('');
              }

            });
          })
        },
        ResWorkView() {
          return new Promise(resolve => {
            this.$http({
              url: 'ResWorkView',
              data: {
                "PageSize": this.pagesize,
                "CurPage": this.curPage,
                "Resource":this.resource,
                'GroupName': this.CurImplementationResGroup,
                'ChangeModel': this.changeModelFlag,
                'filter': this.filterjs ? JSON.stringify(this.filterjs) : null,
                'fuzzyFilter': this.fuzzyFilter ? this.fuzzyFilter : "",
                'filterFirstDemandDay':this.filterFirstDemandDay
              }
            }).then(res => {
              this.tableCount = res.ImplementationCount;
              res.ImplementationData = JSON.parse(res.ImplementationData);
              this.tableData = res.ImplementationData;
              this.tableData.forEach(item=>{
                item['生产时长'] = (item['生产时长']/3600).toFixed(1);//把秒数换成小时保留一位小数
                item['切换开始'] = this.$Fun.formateTime(item['切换开始'],true);//格式化日期对象不显示年
                item['计划开始'] = this.$Fun.formateTime(item['计划开始'],true);
                item['计划结束'] = this.$Fun.formateTime(item['计划结束'],true);
                item['切换时间'] = parseInt(item['切换时间']/60);
              });
              resolve(res);
            });
          });
        },
        getTableColumn() {
          //获取表格的列
          return new Promise(resolve => {
            this.columnsData = [];
            this.$http({
              url: "TableFiled",
              data: {
                "tableName": "WorkPlan"
              }
            }).then(res => {
              resolve(res)
            })
          });
        },
        more() {
          //展示更多
          this.resBodyShow = this.resBodyShow ? false : true
        },
        resClick(e) {
          //设备的点击事件
          if (document.getElementsByClassName('active').length > 0) {
            document.getElementsByClassName('active')[0].classList.remove('active');
          }
          e.target.setAttribute('class', 'active');
          this.changeModelFlag = false;
          let resource = e.target.innerText;
          this.resource = resource;
          this.filterjs = null;
          this.filterFirstDemandDay = '';
          this.fuzzyFilter = '';
          this.ResWorkView();
          this.tableData = [];
          this.curPage = 1;
        },
        handleCurrentChange: function (currentPage) {
          //表格的页数发生改变
          this.curPage = currentPage;
          this.ResWorkView();
        },
        handleSizeChange: function (size) {
          //表格一页展示的数据量发生改变
          this.pagesize = size;
          this.curPage = 1;
          this.ResWorkView();
        },

        allRes() {
          //所有设备的数据
          this.pagesize = 20;
          this.curPage = 1;
          this.resource = '';
          this.changeModelFlag = false;
          this.ResWorkView();
        },
        SerachRes() {
          //搜索设备
          this.GetResView(this.Serachres);
        },
        ChangeModel() {
          this.curPage = 1;
          this.pagesize = 20;
          this.changeModelFlag = true;
          this.ResWorkView();
        },
        filterShow() {
          //高级筛选的按钮的点击事件
          this.filterBox = this.filterBox ? false : true;
        },
        closeFilter() {
          //高级筛选框的关闭按钮
          this.filterBox = false;
        },
        fuzzyInp() {
          //模糊筛选的input事件
          this.curPage = 1;
          this.ResWorkView();
        },
        readShowChangePlan(){
          this.$http({
            url:'readShowChangePlan'
          }).then(data=>{
            this.setSwitchVal(data);
          })
        }
      }
    }
</script>

<style scoped>
  .wrap .resBox {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.125);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    padding: 0 8px;
    box-sizing: border-box;
    background-color: #f7f7f7;
  }
  .wrap .resBox .resTitle {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    height: 30px;
    padding: 6px;
  }
  .wrap .resBox .resTitle i {
    font-size: 22px;
    line-height: 30px;
    float: left;
  }
  .wrap .resBox .resTitle p {
    font-size: 14px;
    padding: 0 8px;
    float: left;
    line-height: 30px;
    font-weight: 600;
    color: #888b92;
  }
  .wrap .resBox .resTitle .SerachRes {
    float: left;
    outline: none;
    font-size: 14px;
    padding: 2px;
    margin-top: 2px;
  }
  .wrap .resBox .resTitle .more {
    float: right;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
  }
  .wrap .resBox .resTitle .more:hover {
    color: #3a8ee6;
  }
  .wrap .resBox .resBody {
    padding: 8px 0;
    min-height: 0px;
    overflow: hidden;
    -webkit-transition: all 1s;
    -moz-transition: all 1s;
    -ms-transition: all 1s;
    -o-transition: all 1s;
    transition: all 1s;
  }
  .wrap .resBox .resBody ul {
    display: flex;
    flex-wrap: wrap;
  }
  .wrap .resBox .resBody ul li {
    list-style: none;
    white-space: nowrap;
    margin: 4px;
    font-size: 14px;
    padding: 2px;
    cursor: pointer;
  }
  .wrap .resBox .resBody ul li.active {
    color: #007bff;
  }
  .wrap .resBox .resHide {
    max-height: 60px;
  }
  .wrap .resBox .resBodyShow {
    height: auto;
    overflow: inherit;
  }
  .wrap .CurResDetail {
    position: relative;
    height: 30px;
    background-color: #e2e3e5;
    width: 100%;
    margin-top: 10px;
    padding: 0 8px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .wrap .CurResDetail i {
    font-size: 22px;
    line-height: 30px;
  }
  .wrap .CurResDetail span {
    margin: 0 8px;
  }
  .wrap .CurResDetail .all {
    color: limegreen;
    cursor: pointer;
  }
  .wrap #table {
    position: relative;
    margin-top: 15px;
  }
  .wrap #table .filterBtn, .wrap #table .exportBtn {
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
  .wrap #table .fuzzyInp {
    margin-left: 10px;
    padding: 4px;
    outline: none;
  }
  .wrap #table .exportBtn {
    margin-right: 12px;
    float: right;
  }
  /deep/ .el-table .cell{
    height: 28px !important;
    white-space: nowrap;
  }
</style>
