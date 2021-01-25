<template>
  <Layout>
    <template v-slot:main>
      <div class="userSetting">
        用户的设置选项
      </div>
    </template>
  </Layout>
</template>
<script>
  import Layout from '../../components/systemsettingComponents/layout'
  import {mapMutations} from 'vuex'

  export default {
    name: "userSetting",
    components: {
      Layout
    },
    mounted() {
      this.setNavTitle('用户账号配置');
    },
    methods: {
      ...mapMutations(['setNavTitle']),
    }
  }
</script>

<style scoped>

</style>
