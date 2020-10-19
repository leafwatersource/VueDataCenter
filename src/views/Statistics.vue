<template>
    <div class="wrap" :class="{'WrapShow':WrapShow}" v-if="[v-cloak]">
        <div class="inputBox">请输入设备名称 <input type="text" placeholder="请输入设备名称"></div>
        <div class="top">
            <div class="topCon">展示所有的设备</div>
        </div>
        <div class="main">展示所选设备的详细信息</div>
    </div>
</template>

<script>
    export default {
        name: "Statistics",
        computed: {
            /**
             * @return {boolean}
             */
            WrapShow() {
                return !this.$store.state.NavShow;
            }
        },
        mounted() {
            console.log('页面加载')
        }
    }
</script>

<style lang="scss" scoped>
    .top {
        width: 100%;
        height: 400px;

        .topCon {
            width: 100%;
            height: 100%;
            background-color: red;
            overflow-y: scroll;
        }
    }

    .main {
        background-color: green;
    }
</style>
