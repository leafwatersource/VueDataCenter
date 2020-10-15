<template>
    <div class="about wrap" :class="{'WrapShow':WrapShow}">
        <h1>这个是关于页面</h1>
        <p>{{ImplementationResView}}</p>
    </div>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                ImplementationResView: []
            }
        },
        computed: {
            ...mapState(['CurImplementationResGroup']),
            /**
             * @return {boolean}
             */
            WrapShow() {
                return !this.$store.state.NavShow;
            },

        },
        watch: {
            CurImplementationResGroup() {
                this.GetResView();
            },
        },
        mounted() {
            this.GetResView();
        },
        methods: {
            GetResView() {
                this.$http({
                    url: 'ResView',
                    data: {'resGroup': this.CurImplementationResGroup}
                }).then(res => {
                    if (res.resCount > 0) {
                        this.ImplementationResView = JSON.parse(res.resView);

                    }
                });
                return this.ImplementationResView;
            }
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
