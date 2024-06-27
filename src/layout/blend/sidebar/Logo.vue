<template>
  <div class="sidebar-logo-container" :class="{ 'collapse': collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <el-image class="sidebar-logo imagesClass" :style="{ backgroundColor: head }" :src="define.comUrl + systemVO.iconUrl" v-if="systemVO && systemVO.iconUrl">
          <template slot="error">
            <img class="sidebar-logo" :class="headClass" :style="{ backgroundColor: head }" src="@/assets/images/jnpf.png"
              alt="">
          </template>
        </el-image>
        <img src="@/assets/images/jnpf.png" :class="headClass" :style="{ backgroundColor: head }" class="sidebar-logo"
          v-else />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <el-image class="imagesClass" :style="{ backgroundColor: head }" :src="define.comUrl + systemVO.iconUrl"
          v-if="systemVO && systemVO.iconUrl">
          <template slot="error">
            <img :src="$store.state.jx.logo" :class="headClass" :style="{ backgroundColor: head }" class="sidebar-logo" />
          </template>
        </el-image> -->
        <!-- <img :src="$store.state.jx.logo" :class="headClass" :style="{backgroundColor:head}" class="sidebar-logo" v-else /> -->
        <div style="display:flex;align-items: center" :style="{ backgroundColor: head }">
          <img v-if="systemVO.iconUrl" :src="define.comUrl + systemVO.iconUrl" class="imagesClass" />
          <img src="@/assets/images/jnpf.png" class="imagesClass" v-else />
          <span class="logo-text">{{ systemVO.shortName || '轴管通' }}</span>
        </div>
      </router-link>
    </transition>
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
    },
    systemVO() {
      return this.$store.state.settings.systemVO
    },
  },
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #29384a;
  text-align: center;
  overflow: hidden;

  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      height: 100%;
      width: 100%;
    }
  }
}
.imagesClass {
  height: 60px;
  width: 60px;
}
.logo-text {
  font-size: 24px !important;
  font-weight: bold;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
