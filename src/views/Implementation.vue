<template>
    <div class="about wrap" :class="{'WrapShow':WrapShow}">
        <h1>这个是关于页面</h1>
    </div>
</template>
<script>
    export default {
        computed: {
            /**
             * @return {boolean}
             */
            WrapShow() {
                return !this.$store.state.NavShow;
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss" scoped>
    @media screen and (max-width: 767px) {
        .wrap {
            width: 100% !important;
            margin-left: 0 !important;
        }
    }
</style>
