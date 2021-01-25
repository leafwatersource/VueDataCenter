<template>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-if="dayShiftList.length!=0">
        <el-tab-pane v-for="item in dayShiftList" :key="item['ResCalShift']" :label="item['ResCalStartTime']+'至'+item['ResCalEndTime']" :name="item['ResCalShift']+item['ResCalStartTime']">
            {{item['ResCalStartTime']+'-'+item['ResCalEndTime']}}
        </el-tab-pane>
    </el-tabs>
    <div v-else>
        没有班次信息
    </div>
</template>
<script>
    export default {
        props:['dayShiftList'],
        data() {
            return {
                activeName: ''
            };
        },
        watch:{
            dayShiftList(){
                this.activeName = '';
            }
        },
        mounted(){
            if (this.dayShiftList.length>0) {
                this.activeName = this.dayShiftList[0]['ResCalStartTime']+'-'+this.dayShiftList[0]['ResCalEndTime'];
            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
