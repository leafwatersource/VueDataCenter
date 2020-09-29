<template>
  <div class="NotFound">
      <p class="back" v-text="time+'秒钟后返回首页'" />
      <a class="back_on" href="/" v-text="'返回首页'" />
  </div>
</template>

<script>
export default {
  data(){
    return {
      time:5
    }
  },
  mounted(){
    let timer = setInterval(() => {
      this.time--;
      if(this.time == 0){
        clearInterval(timer);
       this.$router.replace("/");
      }
    }, 1000);
  }
}
</script>

<style>
.NotFound{
  width:100%;
  height:100%;
  background: url('../assets/image/404.jpg') no-repeat;
   background-position: center center;
    background-size: cover;
}
.back{
  font-size: 20px;
  text-align: center;
  padding: 20px 0;
}
.back_on{
  font-size: 20px;
  display: block;
  text-align: center;
  color: red;
}
</style>