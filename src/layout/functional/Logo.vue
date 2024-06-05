<template>
  <div class="functional-logo-container">
    <router-link class="sidebar-logo-link" to="/">
      <el-image class="sidebar-logo" :src="define.comUrl+sysConfig.navigationIcon"
        v-if="sysConfig && sysConfig.navigationIcon">
        <template slot="error">
            <img :src="$store.state.jx.logo1" :class="headClass" :style="{backgroundColor:head}" class="sidebar-logo"  />
        </template>
      </el-image>
        <img :src="$store.state.jx.logo1" :class="headClass" :style="{backgroundColor:head}" class="sidebar-logo" v-else />
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SidebarLogo',
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
    }),
    sysConfig() {
      return this.$store.state.settings.sysConfig
    }
  },
}
</script>

<style lang="scss" scoped>
.functional-logo-container {
  width: 210px;
  height: 60px;
  line-height: 60px;
  background: #fff;
  text-align: center;
  overflow: hidden;
  flex-shrink: 0;
  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
