<template>
    <div class="about wrap" :class="{'WrapShow':WrapShow}">
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
            <span v-if="resource" v-text="'&gt; '+resource" />
            <span v-text="'&gt; 换模计划'" v-if="changeModelFlag"></span>
            <span style="position: absolute;right: 15px;" @click="ChangeModel">换模计划</span>
        </div>
        <div id="table">
            <!--<input type="text" class="fuzzyInp" placeholder="模糊筛选" v-model="fuzzyFilter" @input="fuzzyInp">-->
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
                changeModelFlag:false
            }
        },
        computed: {
            ...mapState(['CurImplementationResGroup']),
            /**
             * @return {boolean}
             */
            WrapShow() {
                return !this.$store.state.NavShow;
            },

        },
        watch: {
            CurImplementationResGroup() {
                this.GetResView();
                this.Serachres = '';
                this.changeModelFlag = false;
            },
        },
        mounted() {
            let offsetTop = document.getElementById('table').offsetTop - 50 || document.body.scrollTop - 50;
            let wrapH = document.getElementsByClassName('wrap')[0].clientHeight - 50;
            this.tableOffset = wrapH - offsetTop - 32 - 60;
            this.GetResView();
            this.getTableColumn();
        },
        methods: {
            GetResView(resName) {
                this.currentPage = 1;
                this.$http({
                    url: 'ResView',
                    data: {
                        'resGroup': this.CurImplementationResGroup,
                        'resName': resName
                    }
                }).then(res => {
                    if (res.resCount > 0) {
                        this.ImplementationResView = JSON.parse(res.resView);
                        if (document.getElementsByClassName('active').length>0) {
                            document.getElementsByClassName('active')[0].classList.remove('active');
                        }
                        this.resource = this.ImplementationResView[0].resName;
                        this.ResWorkView(this.resource);
                    }
                });
                return this.ImplementationResView;
            },
            more() {
                this.resBodyShow = this.resBodyShow ? false : true
            },
            resClick(e) {
                if (document.getElementsByClassName('active').length>0) {
                    document.getElementsByClassName('active')[0].classList.remove('active');
                }
                e.target.setAttribute('class', 'active');
                this.changeModelFlag = false;
                let resource = e.target.innerText;
                this.resource = resource;
                this.ResWorkView(resource);
                this.tableData = [];
                this.currentPage = 1;
            },
            ResWorkView(resource, pageSize, curPage,changeModel) {
                this.$http({
                    url: 'ResWorkView',
                    data: {
                        "PageSize": pageSize ? pageSize : "20",
                        "CurPage": curPage ? curPage : "1",
                        "Resource": resource,
                        'GroupName':this.CurImplementationResGroup,
                        'ChangeModel':changeModel?changeModel:false,
                    }
                }).then(res => {
                    this.tableCount = res.ImplementationCount;
                    res.ImplementationData = JSON.parse(res.ImplementationData);
                    res.ImplementationData.forEach(item => {
                        item['需求日期'] = this.$Fun.foramateDate(item['需求日期']);
                        item['计划开始'] = this.$Fun.formateTime(item['计划开始']);
                        item['计划结束'] = this.$Fun.formateTime(item['计划结束']);
                        item['切换开始'] = this.$Fun.formateTime(item['切换开始']);
                    });
                    this.tableData = res.ImplementationData;
                });
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.ResWorkView(this.resource, this.pagesize, this.currentPage,this.changeModelFlag);
            },
            handleSizeChange: function (size) {
                //table的页数发生改变触发事件
                this.pagesize = size;
                this.currentPage = 1;
                this.ResWorkView(this.resource, this.pagesize, this.currentPage,this.changeModelFlag);
            },
            getTableColumn() {
                this.columnsData = [];
                //获取表格的列
                this.$http({
                    url: "TableFiled",
                    data: {
                        "tableName": "WorkPlan"
                    }
                }).then(res => {
                    this.columnsData = res;
                })
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
            ChangeModel(){
                this.currentPage = 1;
                this.pagesize = 20;
                this.changeModelFlag = true;
                this.ResWorkView(this.resource, this.pagesize, this.currentPage,this.changeModelFlag);
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
    }

    @media screen and (max-width: 767px) {
        .wrap {
            width: 100% !important;
            margin-left: 0 !important;
        }
    }
</style>
