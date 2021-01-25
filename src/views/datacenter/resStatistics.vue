<template>
  <LayOut>
    <template v-slot:main>
      <div class="wrap" :class="{'WrapShow':!NavShow}">
        <div class="resBox" v-if="resData.length!='0'">
          <div class="resWrap">
            <div class="resCon">
              <div class="res" v-for="item in resData" :key="item.ViewName"
                   @click="resGroupClick(item)"
                   v-text="'设备:'+item.ViewName"></div>
            </div>
          </div>
        </div>
        <div class="messageBox" v-else>产能分析没有数据</div>

        <div class="echartBox" v-if="resData.length!=='0'">
          <p v-if="curResGroup.ViewName " v-text="'设备组:'+curResGroup.ViewName"></p>
          <div class="tableBox">
            <p>
              <el-select v-model="CurResName" filterable placeholder="请选择" @change="resChange" value="">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </p>
            <div class="chart" id="chart" v-if="echartsxAxis.length!=='0'"></div>
            <div class="chart" v-else>
              <span class="messageText">当前没有统计信息</span>
            </div>
            <div id="table" v-show="resListData.length!='0'">
              <el-table
                :data="resListData"
                border
                size="mini"
                ref="filterTable"
                :fit="true"
                style="width: 100%"
                height="500"
                :cell-style="{padding:'0px'}"
              >
                <template v-for="(item,key) in columns">
                  <el-table-column
                    :key="key"
                    :prop="key"
                    :label="item"
                    show-overflow-tooltip
                    :min-width="120"
                    align="center"
                  />
                </template>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </LayOut>
</template>

<script>
  import LayOut from '../../components/datacenterComponents/public/layout'
  import {mapState, mapMutations} from 'vuex'
  import echarts from 'echarts'

  export default {
    name: "resStatistics",
    components: {
      LayOut
    },
    data() {
      return {
        resData: [],//所有的设备组
        timeType: 'W',//时间的类型
        echartsxAxis: [],//echart的横轴
        resStatisticsData: [],//
        resListData: [],//设备的事件记录
        resList: [],//所有的设备
        curResGroup: '',//当前的设备组
        options: [],//下拉框设备选项
        CurResName: '',//当前的设备名称
        columns: {},//表格的列名称
      }
    },
    computed: {
      ...mapState({
        'NavShow':state=>state.datacenterStore.NavShow
      }),
    },
    mounted() {
      this.ChangeNavTitle('统计中心');
      this.renderPage();
      this.GetColumns();
    },
    methods: {
      ...mapMutations(['ChangeNavTitle']),
      renderPage() {
        this.GetResGroupPromise().then(res => {
          this.resData = [];
          if (res.resGroup != "[]") {
            res.resGroup = JSON.parse(res.resGroup);
            this.resData = res.resGroup;
            this.curResGroup = res.resGroup[0];

          }
          return this.GetResListPromise(this.curResGroup)
        }).then(res => {
          this.options = [];
          this.resList = [];
          if (res.resList) {
            res.resList = JSON.parse(res.resList);
            res.resList.forEach(item => {
              let obj = {
                value: item['resName'],
                label: item['resName']
              };
              this.options.push(obj);
              this.resList.push(item['resName']);
            });
            this.GetResGroupTable();
          }
          return this.resGroupClickPromise(this.curResGroup);
        }).then(res => {
          res.resData = JSON.parse(res.resData);
          this.setEchartOptions(res);
          if (this.resStatisticsData.length > 0) {
            return this.initChart(this.curResGroup['ViewName']);
          }
        });
      },
      GetColumns() {
        this.$http({
          url: 'TableFiled',
          data: {
            "tableName": "ResStatisticsTable"
          }
        }).then(res => {
          this.columns = res;
          console.log(res)
        })
      },
      GetResGroupPromise() {
        return new Promise(resolve => {
          //获取设备组
          this.$http({
            url: 'GetResGroup'
          }).then(res => {
            resolve(res);
          })
        });
      },
      GetResListPromise(resGroup) {
        return new Promise(resolve => {
          //获取设备组下所有的设备
          this.$http({
            url: 'GetResList',
            data: {
              "viewId": resGroup.ViewID
            }
          }).then(res => {
            resolve(res);

          })
        });
      },
      resGroupClickPromise(resGroupItem) {
        return new Promise(resolve => {
          //设备组的点击事件
          this.curResGroup = resGroupItem;
          //设备的统计信息
          this.GetResListPromise(resGroupItem);
          this.CurResName = '';
          this.$http({
            url: 'GetResStatistics',
            data: {
              "resName": resGroupItem.ViewName,
              "timeType": 'W'
            }
          }).then(res => {
            resolve(res)
          })
        })

      },


      // GetResGroup() {
      //   //获取设备组
      //   this.$http({
      //     url: 'GetResGroup'
      //   }).then(res => {
      //     this.resData = [];
      //     if (res.resGroup != "[]") {
      //       res.resGroup = JSON.parse(res.resGroup);
      //       this.resData = res.resGroup;
      //       this.curResGroup = res.resGroup[0];
      //       this.GetResList(this.curResGroup);
      //       this.resGroupClick(this.curResGroup);
      //     }
      //   })
      // },
      // GetResList(resGroup) {
      //   //获取设备组下所有的设备
      //   this.$http({
      //     url: 'GetResList',
      //     data: {
      //       "viewId": resGroup.ViewID
      //     }
      //   }).then(res => {
      //     this.options = [];
      //     this.resList = [];
      //     if (res.resList) {
      //       res.resList = JSON.parse(res.resList);
      //       res.resList.forEach(item => {
      //         let obj = {
      //           value: item['resName'],
      //           label: item['resName']
      //         };
      //         this.options.push(obj);
      //         this.resList.push(item['resName']);
      //       });
      //       this.GetResGroupTable();
      //     }
      //   })
      // },
      initChart(resName) {
        //初始化echart统计图
        var myChart = echarts.init(document.getElementById('chart'));
        var option = {
          title: {
            text: resName
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['资源工时', '任务工时', '工时比例']
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: this.echartsxAxis
            }
          ],
          yAxis: [
            {
              type: 'value'
            },
            {
              type: 'value',
            },
          ],
          series: this.resStatisticsData
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, true);
        window.onresize = function () {
          myChart.resize();
        }
      },
      resGroupClick(resGroupItem) {
        //设备组的点击事件
        this.curResGroup = resGroupItem;
        //设备的统计信息
        this.GetResListPromise(resGroupItem);

        this.CurResName = '';
        this.$http({
          url: 'GetResStatistics',
          data: {
            "resName": resGroupItem.ViewName,
            "timeType": 'W'
          }
        }).then(res => {
          this.echartsxAxis = [];
          res.resData = JSON.parse(res.resData);
          this.resStatisticsData = [];
          this.setEchartOptions(res);
          this.initChart(resGroupItem['ViewName']);
        })
      },
      GetResGroupTable() {
        //获取设备列表点击后的事件记录
        this.$http({
          url: 'GetResGroupTable',
          data: {
            'resList': this.resList.toString()
          }
        }).then(res => {
          this.resListData = [];
          if (res.resGroupData) {
            res.resGroupData = JSON.parse(res.resGroupData);
            res.resGroupData.forEach(item => {
              item['fromDay'] = this.$Fun.foramateDate(item['fromDay']);
              item['toDay'] = this.$Fun.foramateDate(item['toDay']);
            });
            this.resListData = res.resGroupData;
          }
        });
      },
      resClick() {
        //设备的统计信息
        this.resStatisticsData = [];
        this.echartsxAxis = [];
        this.$http({
          url: 'GetResStatistics',
          data: {
            "resName": this.CurResName,
            "timeType": 'W'

          }
        }).then(res => {
          res.resData = JSON.parse(res.resData);
          this.setEchartOptions(res);
          this.initChart(this.CurResName);
        })
      },
      setEchartOptions(echartData) {
        if (echartData.resData.length > 0) {
          this.resStatisticsData.push({
            name: '资源工时',
            type: 'bar',
            data: [],
            yAxisIndex: 0,
            color: '#CC0066',
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: 'black',
                    fontSize: 12
                  }
                }
              }
            }
          });
          this.resStatisticsData.push({
            name: '任务工时',
            type: 'bar',
            data: [],
            yAxisIndex: 0,
            color: '#009999', itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: 'black',
                    fontSize: 12
                  }
                }
              }
            }

          });
          this.resStatisticsData.push({
            name: '工时比例',
            type: 'line',
            data: [],
            yAxisIndex: 1,
            color: '#FFCC33',
            itemStyle: {
              normal: {
                label: {
                  show: false, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: 'black',
                    fontSize: 16
                  }
                }
              }
            }
          });
          echartData.resData.forEach(item => {
            item['fromDay'] = this.$Fun.foramateDate(item['fromDay']);
            item['toDay'] = this.$Fun.foramateDate(item['toDay']);
            let column = item['fromDay'] + '/' + item['toDay'];
            this.echartsxAxis.push(column);
            this.resStatisticsData[0].data.push(item['resNeedHour']);
            this.resStatisticsData[1].data.push(item['resWorkHour']);
            this.resStatisticsData[2].data.push(item['hourRatio']);
          });
        } else {
          this.resStatisticsData = [];
        }
      },
      GetResDetail() {
        this.$http({
          url: "GetResDetail",
          data: {
            "resName": this.CurResName
          }
        }).then(res => {
          res.resData = JSON.parse(res.resData);
          this.resListData = [];
          if (res.resData.length > 0) {
            res.resData.forEach(item => {
              item['fromDay'] = this.$Fun.foramateDate(item['fromDay']);
              item['toDay'] = this.$Fun.foramateDate(item['toDay']);
            });
            this.resListData = res.resData;
          }
        })
      },
      resChange(value) {
        this.CurResName = value;
        this.GetResDetail();
        this.resClick();
      }
    }
  }
</script>

<style scoped>
  .wrap {
    position: relative;
    height: 100%;
  }
  .wrap .resBox {
    width: 100%;
    overflow-y: hidden;
    padding: 10px 0;
  }
  .wrap .resBox .resWrap {
    width: 100%;
    max-height: 300px;
    overflow-y: scroll;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
  }
  .wrap .resBox .resWrap .resCon {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    min-height: 0px;
    max-height: 300px;
    align-content: flex-start;
    box-sizing: border-box;
  }
  .wrap .resBox .resWrap .resCon .res {
    width: 316px;
    height: 50px;
    margin: 4px 0;
    margin-right: 10px;
    background-color: #018578;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 1px 1px 5px #cccccc;
    cursor: pointer;
    color: white;
    font-size: 14px;
  }
  .wrap .resBox .resWrap .resCon .active {
    background-color: gray;
    color: #018578;
  }
  .wrap .resBox .resWrap::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
  .wrap .messageBox {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 30px;
  }
  .wrap .echartBox .tableBox {
    width: 100%;
    /*height: 500px;*/
    /*float: left;*/
  }
  .wrap .echartBox .chart {
    position: relative;
    width: 100%;
    height: 500px;
    /*float: right;*/
  }
  .wrap .echartBox .chart .messageText {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    font-size: 20px;
  }
  .wrap .echartBox::after {
    display: block;
    content: "";
    clear: both;
  }
</style>
