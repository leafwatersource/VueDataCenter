<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <div class="grid-content primaryBox flexItem" @click="changeWorkType('EarlyPlan','提前交货订单')">
                <span class="card-header" v-text="'提前交货订单:'+Percentage.EarlyPercentage+'%'"/>
                <h2 v-text="Percentage.EarlyConunt+'张'"/>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content successBox flexItem" @click="changeWorkType('OnTimePlan','正常交货订单')">
                <span class="card-header" v-text="'正常交货订单:'+Percentage.OnTimePercentage+'%'"/>
                <h2 v-text="Percentage.OnTimeCount+'张'"/>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content warningBox flexItem" @click="changeWorkType('LatePlan','延迟订单')">
                <span class="card-header" v-text="'延迟订单:'+Percentage.LatePercentage+'%'"/>
                <h2 v-text="Percentage.LateCount+'张'"/>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content dangerBox flexItem" @click="changeWorkType('ErrorPlan','异常排程订单')">
                <span class="card-header" v-text="'异常排程订单:'+Percentage.ErrorPercentage+'%'"/>
                <h2 v-text="Percentage.ErrorCount+'张'"/>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "WorkNumMessage",
        props:['Percentage'],
        methods:{
            changeWorkType(type,text){
                this.$emit('changeWorkType',[type,text])
            },
        }
    }
</script>

<style scoped lang="scss">
    //工单的统计信息的框
    .flexItem{
        padding: 8px;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        cursor: pointer;
        margin: 20px 0;
        .card-header {
            color: white;
            font-size: 14px;
        }
        h2 {
            color: white;
            text-align: right;
        }
    }
    .primaryBox {
        background-color: #007bff;
    }
    .successBox {
        background-color: #28a745;
    }

    .warningBox {
        background-color: #ffc107;
    }

    .dangerBox {
        background-color: #dc3545;
    }

</style>
