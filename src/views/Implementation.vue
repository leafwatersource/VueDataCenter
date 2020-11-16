<template>
    <div class="about wrap" :class="{'WrapShow':!NavShow}">
        <!--<h1>这个是关于页面</h1>-->
        <div class="resBox">
            <div class="resTitle">
                <i class="fa fa-laptop"/>
                <p v-text="'当前设备组:'+CurImplementationResGroup"/>
                <input type="text" class="SerachRes" placeholder="请输入设备" @input="SerachRes" v-model="Serachres">
                <div class="more" @click="more">展开</div>
            </div>
            <div class="resBody" :class="{'resBodyShow':resBodyShow}">
                <ul>
                    <li v-for="(item,index) in ImplementationResView" :class="{'active':index==0?true:false}"
                        :key="item.resName" v-text="item.resName" @click="resClick"/>
                </ul>
            </div>
        </div>
        <div class="CurResDetail" style="position">
            <i class="fa fa-table"></i>
            <span>当前计划详情</span>
            <p class="all" @click="allRes">所有设备</p>
            <span v-if="resource" v-text="'&gt; '+resource"/>
            <span v-text="'&gt; 换模计划'" v-if="changeModelFlag"></span>
            <span style="position: absolute;right: 15px;" @click="ChangeModel">换模计划</span>
        </div>
        <div id="table">
            <button class="filterBtn" @click="filterShow">高级筛选</button>
            <button class="exportBtn">导出数据</button>
            <div class="filterBox" :class="{'show':filterBox}">
                <p>* 请选择筛选条件 <i class="fa fa-times" aria-hidden="true" @click="closeFilter"></i></p>
                <div class="conMain">
                    <div class="con" v-for="item in columnsData" :key="item.key">
                        <div class="cLeft" v-text="item.value+':'"/>
                        <div class="cRight">
                            <input type="text" :data="item.key">
                        </div>
                    </div>
                </div>
                <div class="filterBtnGroup">
                    <div class="btnCon">
                        <button class="reset" @click="filterReset" v-text="'重置'"/>
                        <button class="confirm" @click="confirm" v-text="'搜索'"/>
                    </div>
                </div>

            </div>
            <input type="text" class="fuzzyInp" placeholder="模糊筛选" v-model="fuzzyFilter" @input="fuzzyInp">
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
    import {mapState, mapMutations} from 'vuex'

    export default {
        data() {
            return {
                ImplementationResView: [],
                resBodyShow: false,
                resource: '',//当前设备
                curPage: 1,
                pagesize: 20,
                currentPage: 1,
                tableCount: 0,
                tableData: [],
                columnsData: {},
                tableOffset: null,
                Serachres: '',
                changeModelFlag: false,
                filterBox: false,
                filterjs: {},
                fuzzyFilter: ''
            }
        },
        computed: {
            ...mapState(['CurImplementationResGroup', 'NavShow']),
        },
        watch: {
            CurImplementationResGroup() {
                this.GetResView();
                this.Serachres = '';
                this.filterjs = null;
                this.changeModelFlag = false;
                this.fuzzyFilter = '';
                this.filterReset();
            },
        },
        mounted() {
            let offsetTop = document.getElementById('table').offsetTop - 50 || document.body.scrollTop - 50;
            let wrapH = document.getElementsByClassName('wrap')[0].clientHeight - 50;
            this.tableOffset = wrapH - offsetTop - 32 - 60;
            this.renderPage();
        },
        methods: {
            ...mapMutations(['ChangeCurImplementationResGroup']),
            renderPage() {
                this.GetResView().then(() => {
                    return this.ResWorkView(this.resource);
                });
                this.getTableColumn().then(res => {
                    res.forEach(item => {
                        let obj = {};
                        for (let prop in item) {
                            if (prop !== "type") {
                                obj['key'] = prop;
                                obj['value'] = item[prop];
                            }
                        }
                        this.columnsData.push(obj);
                    });
                    return this.ResWorkView(this.$route.params.name)
                });
            },
            GetResView(resName) {
                return new Promise(resolve => {
                    this.currentPage = 1;
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
                        }
                        resolve('');
                    });
                })
            },
            ResWorkView(resource, pageSize, curPage, changeModel) {
                return new Promise(resolve => {
                    this.$http({
                        url: 'ResWorkView',
                        data: {
                            "PageSize": pageSize ? pageSize : "20",
                            "CurPage": curPage ? curPage : "1",
                            "Resource": resource,
                            'GroupName': this.CurImplementationResGroup,
                            'ChangeModel': changeModel ? changeModel : false,
                            'filter': this.filterjs ? JSON.stringify(this.filterjs) : null,
                            'fuzzyFilter': this.fuzzyFilter ? this.fuzzyFilter : "",
                        }
                    }).then(res => {
                        this.tableCount = res.ImplementationCount;
                        res.ImplementationData = JSON.parse(res.ImplementationData);
                        this.tableData = res.ImplementationData;
                        resolve(res);
                    });
                });

            },
            getTableColumn() {
                return new Promise(resolve => {
                    this.columnsData = [];
                    //获取表格的列
                    this.$http({
                        url: "TableFiled",
                        data: {
                            "tableName": "WorkPlan"
                        }
                    }).then(res => {
                        resolve(res)
                    })
                })
            },


            more() {
                this.resBodyShow = this.resBodyShow ? false : true
            },
            resClick(e) {
                if (document.getElementsByClassName('active').length > 0) {
                    document.getElementsByClassName('active')[0].classList.remove('active');
                }
                e.target.setAttribute('class', 'active');
                this.changeModelFlag = false;
                let resource = e.target.innerText;
                this.resource = resource;
                this.filterjs = null;
                this.fuzzyFilter = '';
                this.filterReset();
                this.ResWorkView(resource);
                this.tableData = [];
                this.currentPage = 1;
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.ResWorkView(this.resource, this.pagesize, this.currentPage, this.changeModelFlag);
            },
            handleSizeChange: function (size) {
                //table的页数发生改变触发事件
                this.pagesize = size;
                this.currentPage = 1;
                this.ResWorkView(this.resource, this.pagesize, this.currentPage, this.changeModelFlag);
            },

            allRes() {
                this.pagesize = 20;
                this.currentPage = 1;
                this.resource = '';
                this.changeModelFlag = false;
                this.ResWorkView(this.resource, this.pagesize, this.currentPage);
            },
            SerachRes() {
                this.GetResView(this.Serachres);
            },
            ChangeModel() {
                this.currentPage = 1;
                this.pagesize = 20;
                this.changeModelFlag = true;
                this.ResWorkView(this.resource, this.pagesize, this.currentPage, this.changeModelFlag);
            },
            filterShow() {
                //高级筛选的按钮的点击事件
                this.filterBox = this.filterBox ? false : true;
            },
            closeFilter() {
                //高级筛选框的关闭按钮
                this.filterBox = false;
            },
            filterReset() {
                //高级筛选的重置按钮
                let cRight = document.querySelectorAll('.cRight');
                cRight.forEach(item => {
                    item.children[0].value = ''
                });
                this.filterjs = null;
                this.ResWorkView(this.resource);
                this.closeFilter();
            },
            confirm() {
                //高级筛选的确定按钮
                let cRight = document.querySelectorAll('.cRight');
                this.filterjs = {};
                cRight.forEach(item => {
                    let inputVal = item.children[0].value.trim();
                    let inputAttr = item.children[0].attributes['data'].value;
                    if (inputVal != '') {
                        this.filterjs [inputAttr] = inputVal;
                    }
                });
                this.currentPage = 1;
                this.ResWorkView(this.resource, this.pagesize, this.currentPage, this.changeModelFlag);
                this.closeFilter();
            },
            fuzzyInp() {
                //模糊筛选的input事件
                this.currentPage = 1;
                this.ResWorkView(this.resource, this.pagesize, this.currentPage, this.changeModelFlag);
            },
        }
    }
</script>
<style lang="scss" scoped>
    .wrap {
        .resBox {
            width: 100%;
            border: 1px solid rgba(0, 0, 0, .125);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            padding: 0 8px;
            box-sizing: border-box;
            background-color: #f7f7f7;

            .resTitle {
                border-bottom: 1px solid rgba(0, 0, 0, .125);
                height: 30px;
                padding: 6px;

                i {
                    font-size: 22px;
                    line-height: 30px;
                    float: left;
                }

                p {
                    font-size: 14px;
                    padding: 0 8px;
                    float: left;
                    line-height: 30px;
                    font-weight: 600;
                    color: #888b92;
                }

                .SerachRes {
                    float: left;
                    outline: none;
                    font-size: 14px;
                    padding: 2px;
                    margin-top: 2px;
                }

                .more {
                    float: right;
                    font-size: 14px;
                    line-height: 30px;
                    cursor: pointer;
                }

                .more:hover {
                    color: #3a8ee6;
                }
            }

            .resBody {
                padding: 8px 0;
                height: 66px;
                overflow: hidden;
                -webkit-transition: all 1s;
                -moz-transition: all 1s;
                -ms-transition: all 1s;
                -o-transition: all 1s;
                transition: all 1s;

                ul {
                    display: flex;
                    flex-wrap: wrap;

                    li {
                        list-style: none;
                        white-space: nowrap;
                        margin: 4px;
                        font-size: 14px;
                        padding: 2px;
                        cursor: pointer;
                    }

                    li.active {
                        color: #007bff;
                    }
                }
            }

            .resBodyShow {
                height: auto;
                overflow: inherit;
            }
        }

        .CurResDetail {
            height: 30px;
            background-color: #e2e3e5;
            width: 100%;
            margin-top: 10px;
            padding: 0 8px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            font-size: 14px;

            i {
                font-size: 22px;
                line-height: 30px;
            }

            span {

                margin: 0 8px;
            }

            .all {
                color: limegreen;
                cursor: pointer;
            }
        }

        #table {
            position: relative;
            margin-top: 15px;

            .filterBtn, .exportBtn {
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

            .fuzzyInp {
                margin-left: 10px;
                padding: 4px;
                outline: none;
            }

            .exportBtn {
                margin-right: 12px;
                float: right;
            }

            .filterBox {
                display: none;
                position: absolute;
                left: 0;
                top: 30px;
                z-index: 10000;
                height: 260px;
                background-color: white;
                border: 1px solid #808080;
                width: 300px;
                border-radius: 4px;

                p {
                    width: 100%;
                    padding: 4px;
                    color: #17a2b8;
                    border-bottom: 1px solid #808080;
                    font-size: 14px;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;

                    i {
                        float: right;
                    }
                }

                .conMain {
                    height: 190px;
                    overflow-x: hidden;
                    overflow-y: scroll;

                    .con {
                        width: 100%;
                        margin: 4px 0;

                        .cLeft {
                            width: 40%;
                            float: left;
                            padding: 4px;
                            font-size: 12px;
                            white-space: nowrap;
                            box-sizing: border-box;
                        }

                        .cRight {
                            float: right;
                            width: 60%;
                            box-sizing: border-box;
                            padding: 0 4px;

                            input {
                                border: 1px solid #ced4da;
                                border-radius: 4px;
                                box-sizing: border-box;
                                width: 100%;
                                padding: 4px;
                            }
                        }
                    }

                    .con:after {
                        display: block;
                        content: '';
                        clear: both;
                    }
                }

                .conMain::-webkit-scrollbar {
                    display: none;
                }

                .filterBtnGroup {
                    background-color: white;
                    position: absolute;
                    bottom: 0;
                    border-top: 1px solid #808080;
                    width: 100%;
                    padding: 4px 0;

                    .btnCon {
                        display: block;
                        width: 50%;
                        margin: 0 auto;

                        .reset {
                            color: #fff;
                            background-color: #dc3545;
                            border-color: #dc3545;
                            outline: none;
                            border: none;
                            font-size: 12px;
                            width: 50px;
                            padding: 4px 0;
                        }

                        .confirm {
                            color: #fff;
                            background-color: #28a745;
                            border-color: #28a745;
                            outline: none;
                            border: none;
                            font-size: 12px;
                            width: 50px;
                            padding: 4px 0;
                            float: right;
                        }
                    }

                }
            }

            .show {
                display: block;
            }
        }
    }

    @media screen and (max-width: 767px) {
        .wrap {
            width: 100% !important;
            margin-left: 0 !important;
        }
    }
</style>
