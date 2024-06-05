<template>
  <div class="navbar" :class="headClass" :style="{backgroundColor:head}">
    <!-- <span class="navbar-platform">快速开发平台</span> -->
    <template v-if="device !== 'mobile'">
      <!-- <template v-if="showSwitch" id="hamburger-container" class="hamburger-container">
        <system-select class="right-menu-item hover-effect" />
      </template> -->
      <template v-if="showSearch" class="hamburger-container">
        <search id="header-search" class="right-menu-item" />
      </template>
    </template>
    <NavbarRight />
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
import NavbarRight from '../components/NavbarRight'
import Search from '@/components/HeaderSearch'
import SystemSelect from '@/components/SystemSelect'
export default {
  components: { NavbarRight,Search,SystemSelect },
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
      showSearch: state => state.settings.showSearch,
      showSwitch: state => state.settings.showSwitch,
    }),
    ...mapGetters(['sidebar', 'device',])
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #dcdfe6;
  box-sizing: border-box;
}
</style>