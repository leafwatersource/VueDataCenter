<template>
    <el-row :gutter="20">
        <el-col :span="4">
            <div class="grid-content infoBox flexItem" @click="changeWorkType('','')">
                <span class="card-header" v-text="'全部工单'"/>
                <h2 v-text="Percentage.EarlyConunt+Percentage.LateCount+Percentage.OnTimeCount+Percentage.ErrorCount+'张'"/>
            </div>
        </el-col>
    <el-col :span="5">
        <div class="grid-content primaryBox flexItem" @click="changeWorkType('EarlyPlan','提前交货订单')">
            <span class="card-header" v-text="'提前交货订单:'+Percentage.EarlyPercentage+'%'"/>
            <h2 v-text="Percentage.EarlyConunt+'张'"/>
        </div>
    </el-col>
    <el-col :span="5">
        <div class="grid-content successBox flexItem" @click="changeWorkType('OnTimePlan','正常交货订单')">
        <span class="card-header" v-text="'正常交货订单:'+Percentage.OnTimePercentage+'%'"/>
            <h2 v-text="Percentage.OnTimeCount+'张'"/>
        </div>
    </el-col>
    <el-col :span="5">
        <div class="grid-content warningBox flexItem" @click="changeWorkType('LatePlan','延迟订单')">
            <span class="card-header" v-text="'延迟订单:'+Percentage.LatePercentage+'%'"/>
            <h2 v-text="Percentage.LateCount+'张'"/>
        </div>
    </el-col>
    <el-col :span="5">
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

<style scoped>
    /*工单的统计信息的框*/
    .flexItem{
        padding: 0.5rem;
        -webkit-border-radius: 0.5rem;
        -moz-border-radius: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        margin: 1.25rem 0;


    }
    .flexItem .card-header {
      color: white;
      font-size: 0.875rem;
    }
    .flexItem h2 {
      color: white;
      text-align: right;
    }
    .infoBox{
        background-color: #17a2b8;
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
