<template>
  <Layout>
    <template v-slot:main>
      <Tabs>
        <template v-slot:tab-pane>
          <el-tab-pane label="用户字段管理" name="first">
            <div class="adminMain">
              <div>
                <el-switch
                  v-model="switchVal"
                  active-text="显示换模计划按钮"
                  @change="switchValChange"
                >
                </el-switch>
              </div>
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
        </template>
      </Tabs>
    </template>
  </Layout>
</template>

<script>
  import Layout from '../../components/systemsettingComponents/layout'
  import Tabs from '../../components/systemsettingComponents/tabs'
  import {mapMutations} from 'vuex'
  export default {
    name: "implementationConfig",
    components: {
      Layout,
      Tabs,
    },
    data() {
      return {
        tableData: [],//table里面的数据
        dialogFormVisible: false,//修改属性的模态框
        curChangeData: {},//要改变的属性名称
        targetChange: '',//对应属性的sqlNameT
        edit: true,
        newDialogFormVisible: false,//新增属性的模态模框
        newColumn: {
          sqlNameT: '',//数据库里面对应的字段名称
          showNameT: '',//前端表格要展示的名称
          width: '',//前端表格要展示的宽度
        },
        switchVal:''//换模按钮是否显示
      }
    },
    computed:{
    },
    mounted() {
      this.TableFiled();
      this.setNavTitle('执行计划配置');
      this.readShowChangePlan();
    },
    methods: {
      ...mapMutations(['setNavTitle','setSwitchVal']),
      TableFiled() {
        //获取表格的数据
        this.$http({
          url: 'TableFiled',
          data: {
            'tableName': 'WorkPlan'
          }
        }).then(res => {
          res.forEach(item=>{
            item['switchNameT'] = item['switchNameT'] !== "False";
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
          url: 'DelTableFiled',
          data: {
            'tableName': 'SQLWorkPlanFiled',
            'delData': row['sqlNameT']
          }
        }).then(() => {
          this.tableData.splice(index, 1);
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
            'tableName': 'SQLWorkPlanFiled',
            'targetChange': this.targetChange,
            'changeData': JSON.stringify(this.curChangeData)
          }
        }).then(() => {
          this.dialogFormVisible = false;
          this.curChangeData = {};
          this.targetChange = '';
        });
      },
      cancelAdd() {
        //取消添加新的列展示
        this.newColumn = {};
        this.newDialogFormVisible = false;
      },
      addColumn() {
        //添加新的列展示
        this.newColumn[this.newColumn['sqlNameT']] = this.newColumn['sqlNameT'];
        this.newColumn['type'] = "string";
        this.$http({
          url: 'AddTableFiled',
          data: {
            'tableName': "SQLWorkPlanFiled",
            'newData': JSON.stringify(this.newColumn)
          }
        }).then(() => {
          this.tableData.push(this.newColumn);
          this.newColumn = {};
          this.newDialogFormVisible = false;
        });
      },
      switchNameTChange(row){
        this.curChangeData = row;
        this.targetChange = row['sqlNameT'];
        this.confirmChange();
      },//修改是否精确筛选的按钮
      readShowChangePlan(){
        this.$http({
          url:'readShowChangePlan'
        }).then(res=>{
          this.switchVal = res;
        })
      },//查看换模计划是否显示
      switchValChange(val){
          this.$http({
            url:'switchValChange',
            data:{
              "switchVal":val.toString()
            }
          }).then(()=>{
            this.setSwitchVal(val);
          })
      },//显示或隐藏按钮的点击事件
    }
  }
</script>

<style scoped>

</style>
