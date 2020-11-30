<template>
    <div class="filterWrap">
        <button class="filterBtn" @click="filterShow">高级筛选</button>
        <div class="filterBox" :class="{'show':filterBox}">
            <p>* 请选择筛选条件 <i class="fa fa-times" aria-hidden="true" @click="closeFilter"></i></p>
            <div class="conMain">
                <div class="con" v-for="item in columnsJson" :key="item.key">
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
    </div>
</template>

<script>
    export default {
        name: "filterInput",
        props: ['columnsJson', 'filterBox'],
        // filterBox: false,精确筛选框是否展示
        // columnsJson: {},//表格的列名(用于精确筛选)
        data() {
            return {
                filterjs: null,//精确筛选的对象
            }
        },
        mounted() {
        },
        methods: {
            closeFilter() {
                //高级筛选框的关闭按钮
                this.$emit('UpdatefilterBox', false);
            },
            filterReset() {
                //高级筛选的重置按钮
                let cRight = document.querySelectorAll('.cRight');
                cRight.forEach(item => {
                    item.children[0].value = ''
                });
                this.filterjs = null;
                //更新父级的筛选条件
                this.$emit("updateData", this.filterjs);
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
                //更新父级的筛选条件
                this.$emit("updateData", this.filterjs);
                this.closeFilter();
            },
            filterShow(){
                let flag = this.filterBox?false:true;
                this.$emit('UpdatefilterBox', flag);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .filterWrap{
        display: inline-block;
        .filterBtn {
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
</style>
