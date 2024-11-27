<template>
  <div class="navbar" :class="headClass" :style="{ backgroundColor: head }">
    <div>
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
        @toggleClick="toggleSideBar" />
      <!-- <template v-if="device !== 'mobile'">
        <template v-if="showSearch" class="hamburger-container">
          <search id="header-search" class="right-menu-item" />
        </template>
</template> -->
    </div>
    <template class="hamburger-container">
      <project-select class="right-menu-item hover-effect" />
    </template>
    <Menu class="main-menu" />
    <NavbarRight />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'
import NavbarRight from '../components/NavbarRight'
import Menu from './menu'
import Search from '@/components/HeaderSearch'
import ProjectSelect from '../components/ProjectSelect'

export default {
  components: { Hamburger, NavbarRight, Menu, Search, ProjectSelect },
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
      showSearch: state => state.settings.showSearch,
    }),
    ...mapGetters(['sidebar', 'device',])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
  
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

  .hamburger-container {
    line-height: 42px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .top-menu {
    flex: 1;
    overflow: hidden;
    height: 60px;
    color: #fff;
  }
}
::v-deep .system {
  width: 20%;
  height: 100vh;
  position: fixed;
  z-index: 99999;
  background-color: #fff;
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2), 0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12);
  overflow: auto;
  outline: 0;

  .system-header {
    height: 62px !important;
    border-bottom: 1px solid #dcdfe6;
    padding: 0 20px;
    margin-bottom: 0;
    align-items: center;
    color: #fff;
    display: flex;
  }
}
</style>
