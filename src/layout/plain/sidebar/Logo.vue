<template>
  <div class="sidebar-logo-container" >
    <router-link class="sidebar-logo-link" to="/" :class="headClass" :style="{backgroundColor:head}">
      <el-image class="sidebar-logo" :src="define.comUrl+sysConfig.logoIcon"
        v-if="sysConfig && sysConfig.logoIcon">
        <template slot="error">
          <img class="sidebar-logo" src="@/assets/images/jnpf2.png" alt="">
        </template>
      </el-image>
      <img src="@/assets/images/jnpf2.png" class="sidebar-logo" v-else />
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'SidebarLogo',
  computed: {
    sysConfig() {
      return this.$store.state.settings.sysConfig
    },
    ...mapState({
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
    }),
  }
}
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #29384a;
  text-align: center;
  overflow: hidden;
  border-bottom: 1px solid #29384a;
  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      height: 60px;
      width: auto;
    }
  }
}
</style>