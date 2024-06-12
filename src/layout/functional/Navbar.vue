<template>
  <div class="navbar" :class="headClass" :style="{backgroundColor:head}">
    <logo />
    <!-- <template v-if="device !== 'mobile'">
      <template v-if="showSearch" class="hamburger-container">
        <search id="header-search" class="right-menu-item" />
      </template>
    </template> -->
    <Menu class="main-menu top-menu" />
    <NavbarRight />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import Menu from './menu'
import NavbarRight from '../components/NavbarRight'
import Search from '@/components/HeaderSearch'
export default {
  components: { Logo, Menu, NavbarRight, Search },
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
      showSearch: state => state.settings.showSearch,
    }),
    ...mapGetters(['device',])
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
  display: flex;
  align-items: center;
  .main-menu {
    flex: 1;
    overflow: hidden;
    height: 60px;
  }
}
</style>