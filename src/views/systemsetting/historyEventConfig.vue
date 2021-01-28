<template>
  <Layout>
    <template v-slot:main>
      <Tabs>
        <template v-slot:tab-pane>
          <el-tab-pane label="用户字段管理" name="first">
            <div class="adminMain">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  label="数据库字段"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.sqlNameT }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="展示字段"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.showNameT }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="展示顺序"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.indexNameT }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否精确筛选"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.switchNameT?"是":"否" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="展示宽度"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.width }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" class="addColumn" @click="newDialogFormVisible=true">新增展示列</el-button>
              <el-dialog title="字段的信息" :visible.sync="dialogFormVisible">
                <el-form :model="curChangeData">
                  <el-form-item label="数据库字段" label-width="120px">
                    <el-input v-model="curChangeData.sqlNameT" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="展示字段" label-width="120px">
                    <el-input v-model="curChangeData.showNameT" autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item label="展示宽度" label-width="120px">
                    <el-input v-model="curChangeData.width" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelChange ">取 消</el-button>
                  <el-button type="primary" @click="confirmChange">确 定</el-button>
                </div>
              </el-dialog>
              <el-dialog title="新增字段的信息" :visible.sync="newDialogFormVisible">
                <el-form :model="newColumn">
                  <el-form-item label="数据库字段" label-width="120px">
                    <el-input v-model="newColumn.sqlNameT" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="展示字段" label-width="120px">
                    <el-input v-model="newColumn.showNameT" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="展示顺序" label-width="120px">
                    <el-input v-model="newColumn.indexNameT" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="展示宽度" label-width="120px">
                    <el-input v-model="newColumn.width" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancelAdd">取 消</el-button>
                  <el-button type="primary" @click="addColumn">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </el-tab-pane>
          <el-tab-pane label="精确筛选字段管理" name="second">
            <div class="adminMain">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  label="展示字段"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.showNameT }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否精确筛选"
                  width="180">
                  <template slot-scope="scope">
                  <span style="margin-left: 10px">
                    <el-switch
                      v-model="scope.row.switchNameT"
                      @change="switchNameTChange(scope.row)"
                    >
                    </el-switch>
                  </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="修改字段顺序" name="third">
            <div class="adminMain">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  label="展示字段"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.showNameT }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="展示顺序"
                  width="180">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.indexNameT }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="success"
                      @click="changeOrder(scope.$index, scope.row)">修改顺序
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-dialog title="修改字段的顺序" :visible.sync="changeOrderVisible">
            <el-form :model="changeOrderColumn">
              <el-form-item label="数据库字段" label-width="120px">
                <el-input :placeholder="changeOrderColumn.sqlNameT" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="展示字段" label-width="120px">
                <el-input :disabled="true" :placeholder="changeOrderColumn.showNameT"></el-input>
              </el-form-item>
              <el-form-item label="显示顺序" label-width="120px">
                <el-input v-model="changeOrderColumnNew.indexNameT" :placeholder="changeOrderColumn.indexNameT"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelChangeOrder">取 消</el-button>
              <el-button type="primary" @click="confirmChangeOrder">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </Tabs>

    </template>
  </Layout>
</template>

<script>
  import Layout from '../../components/systemsettingComponents/layout'
  import Tabs from '../../components/systemsettingComponents/tabs'
  import {mapMutations}from 'vuex'
  export default {
    name: "historyEventConfig",
    components: {
      Layout,
      Tabs
    },
    data(){
      return {
        tableData: [],//table里面的数据
        dialogFormVisible: false,//修改属性的模态框
        curChangeData: {},//要改变的属性名称
        targetChange: '',//对应属性的sqlNameT
        edit:true,
        newDialogFormVisible:false,//新增属性的模态模框
        newColumn:{
          sqlNameT:'',//数据库里面对应的字段名称
          showNameT:'',//前端表格要展示的名称
          width:'',//前端表格要展示的宽度
          indexNameT:'',//展示顺序
        },
        changeOrderColumn:{},//修改展示顺序的字段
        changeOrderColumnNew:{
          indexNameT:'',
        },//修改后展示顺序的字段
        changeOrderVisible:false,//修改展示顺序的模态框是否显示
        changeOrderIndex:'',//修改哪一条数据
      }
    },
    mounted() {
      this.TableFiled();
      this.setNavTitle('事件记录配置');
    },

    methods:{
      ...mapMutations(['setNavTitle']),
      TableFiled(){
        //获取表格的数据
        this.$http({
          url: 'TableFiled',
          data: {
            'tableName': 'History'
          }
        }).then(res => {
          this.tableData = res;
          this.tableData.forEach(item=>{
            item['switchNameT'] = item['switchNameT'].toUpperCase()!=="FALSE";
          });
          this.tableData = res.sort((a,b)=>a['indexNameT']-b['indexNameT']);
        })
      },
      handleEdit(index, row) {
        //编辑按钮的点击事件
        this.dialogFormVisible = true;
        this.curChangeData = row;
        this.targetChange = row['sqlNameT'];
      },
      handleDelete(index, row) {
        //取消展示列展示,谨慎操作，会删除后端appsetting.xml 文件里面的内容
        this.$http({
          url:'DelTableFiled',
          data:{
            'tableName':'HistoryTableFiled',
            'delData':row['sqlNameT']
          }
        }).then(()=>{
          this.tableData.splice(index,1);
        })
      },
      cancelChange() {
        //取消修改数据
        this.dialogFormVisible = false;
        this.curChangeData = {};
        this.targetChange = '';
      },
      confirmChange() {
        //修改过后的数据
        this.$http({
          url: 'SetTableFiled',
          data: {
            'tableName': 'HistoryTableFiled',
            'targetChange': this.targetChange,
            'changeData': JSON.stringify(this.curChangeData)
          }
        }).then(() => {
          this.dialogFormVisible = false;
          this.curChangeData = {};
          this.targetChange = '';
        });
      },
      cancelAdd(){
        //取消添加新的列展示
        this.newColumn ={};
        this.newDialogFormVisible = false;
      },
      addColumn(){
        //添加新的列展示
        this.newColumn[this.newColumn['sqlNameT']] = this.newColumn['sqlNameT'];
        this.newColumn['type'] = "string";
        this.$http({
          url:'AddTableFiled',
          data:{
            'tableName':"HistoryTableFiled",
            'newData':JSON.stringify(this.newColumn)
          }
        }).then(()=>{
          this.tableData.push(this.newColumn);
          this.newColumn ={};
          this.newDialogFormVisible = false;
        });
      },
      changeOrder(index,row){
        this.changeOrderColumn = row;
        this.changeOrderIndex = index;
        this.changeOrderVisible = true;
      },
      cancelChangeOrder(){
        //取消修改顺序
        this.changeOrderVisible = false;
        this.changeOrderColumn = {};
        this.changeOrderIndex = '';
        this.changeOrderColumnNew['indexNameT'] = '';
      },
      confirmChangeOrder(){
        //确定修改展示顺序
        this.tableData[this.changeOrderIndex]['indexNameT'] = this.changeOrderColumnNew['indexNameT'];
        this.$http({
          url:'SetTableFiled',
          data:{
            'tableName': 'HistoryTableFiled',
            'targetChange': this.changeOrderColumn['sqlNameT'],
            'changeData': JSON.stringify(this.tableData[this.changeOrderIndex])
          }
        }).then(()=>{
          this.changeOrderVisible = false;
          this.changeOrderColumn = {};
          this.tableData[this.changeOrderIndex]['indexNameT'] = this.changeOrderColumnNew['indexNameT'];
          this.changeOrderColumnNew['indexNameT'] = '';
          this.tableData = this.tableData.sort((a,b)=>a["indexNameT"]-b["indexNameT"]);
        });
      },
      switchNameTChange(row){
        this.curChangeData = row;
        this.targetChange = row['sqlNameT'];
        this.confirmChange();
      },//修改是否精确筛选的按钮
    }
  }
</script>

<style scoped>

</style>
