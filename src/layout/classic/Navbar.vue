<template>
  <div class="navbar" :class="headClass" :style="{backgroundColor:head}">
    <div>
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
        @toggleClick="toggleSideBar" />
      <!-- <template v-if="device !== 'mobile'">
        <template v-if="showSearch" class="hamburger-container">
          <search id="header-search" class="right-menu-item" />
        </template>
      </template> -->
    </div>
    <NavbarRight />
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'
import NavbarRight from '../components/NavbarRight'
import Search from '@/components/HeaderSearch'
import SystemSelect from '@/components/SystemSelect'
export default {
  components: { Hamburger, NavbarRight, SystemSelect, Search },
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
      showSearch: state => state.settings.showSearch,
      showSwitch: state => state.settings.showSwitch,
    }),
    ...mapGetters(['sidebar', 'device',])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
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
}
</style>