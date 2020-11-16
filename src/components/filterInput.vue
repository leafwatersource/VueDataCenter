<template>
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
</template>

<script>
    export default {
        name: "filterInput",
    }
</script>

<style scoped>

</style>
