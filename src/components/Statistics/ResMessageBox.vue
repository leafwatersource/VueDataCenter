<template>
 <el-drawer
         :title="resMessage['resname']"
         @open="handleopen"
         :visible.sync="drawer"
         size="40%"
         :direction="direction"
         :before-close="handleClose">
  <ul>
   <template v-for="(value,key) in resMessageData">
    <li :key="key">{{key}}  {{value}}</li>
   </template>
  </ul>
 </el-drawer>
</template>

<script>
 export default {
  name: "ResMessageBox",
  props:['drawer','resMessage','AttrMessageZh'],
  data() {
   return {
    direction: 'rtl',
    resMessageData:{},
    value: '',
   };
  },
  watch:{
   resMessage(){
    this.value = this.resMessage;
    this.handleopen();
   },
   AttrMessageZh(){
    this.handleopen();
   }
  },
  methods: {
   handleopen(){
    this.resMessageData = {};
    if(Object.keys(this.resMessage).length>0){
    for (let [key,value] of Object.entries(this.resMessage) ) {
     if (value!==null && typeof value =="object") {

      for(let [itemKey,itemValue] of Object.entries(value)){
        if(this.AttrMessageZh['resorderbean']) {
         this.resMessageData[this.AttrMessageZh['resorderbean'][itemKey]] = itemValue.toString();
        }
      }
     }else{
      if (value!==null) {
       this.resMessageData[this.AttrMessageZh[key]] = value.toString();

      }
     }
    }
    }
   },
   handleClose() {
    //设备详细信息的框关闭
    this.$emit('closeDrawer');
   }
  }
 }
</script>

<style lang="scss" scoped>
 /deep/ :focus {
  outline: 0;
 }

 /deep/.el-drawer__body{
  height: 100% !important;
  overflow: hidden !important;
 ul{
  height: calc(100% - 43px);
  overflow-y: scroll;
  li{
   padding: 10px 15px;
   border-bottom: 1px solid #cccccc;
   font-size: 12px;
  }
 }
 ul::-webkit-scrollbar{
  width: 0;
  height: 0;
 }
 }
</style>
