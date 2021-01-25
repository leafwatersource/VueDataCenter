<template>
  <div class="title" v-text="'当前计划发布日期：'+ReleaseTime+'，最后计划发布人：'+Owner+'，计划发布名称：'+WorkPlanName"/>
</template>

<script>
    export default {
        name: "PlanMessage",
      data(){
          return {
            ReleaseTime:'',
            Owner:'',
            WorkPlanName:''
          }
      },
      mounted(){
        this.getPlanMessage().then(result => {
          //获取工单的信息
          this.Owner = result.Owner;
          this.WorkPlanName = result.WorkPlanName;
          this.ReleaseTime = result.ReleaseTime;
        })
      },
      methods:{
        getPlanMessage(){
          return new Promise(resolve => {
            this.$http({
              url: 'PlanMessage',
            }).then(res => {
              resolve(res);
            });
          })
        }
      }
    }
</script>

<style scoped>
.title{
  height: 30px;
  line-height: 30px;
  text-align: right;
  background-color: #e2e3e5;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
}
</style>
