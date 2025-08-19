<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <el-image class="sidebar-logo 8" :src="define.DHK_API+systemVO.iconUrl" :style="{ backgroundColor: head }" v-if="systemVO && systemVO.iconUrl">
          <template slot="error">
            <img class="sidebar-logo 9" :class="headClass" :style="{backgroundColor:head}" src="@/assets/images/jnpf.png" alt="">
          </template>
        </el-image>
        <img src="@/assets/images/jnpf.png" :class="headClass" :style="{backgroundColor:head}" class="sidebar-logo 10" v-else />
      </router-link>
      <!-- <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <el-image class="sidebar-logo 11" :src="define.DHK_API+sysConfig.navigationIcon" v-if="sysConfig && sysConfig.navigationIcon">
          <template slot="error">
            <img class="sidebar-logo 12" :class="headClass" :style="{backgroundColor:head}" :src="$store.state.jx.logo1" alt="">
          </template>
        </el-image>
        <img :src="$store.state.jx.logo1" :class="headClass" :style="{backgroundColor:head}" class="sidebar-logo 13" v-else />
      </router-link> -->
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div class="expand" :style="{ backgroundColor: head }">
          <el-tooltip content="返回工作台" placement="bottom">
            <i class="icon-ym icon-ym-nav-home workspace" @click="goBackWorkspace"></i>
          </el-tooltip>
          <div class="logo-title">
            <img v-if="systemVO.iconUrl" :src="define.DHK_API + systemVO.iconUrl" class="imagesClass" :style="{ backgroundColor: head }" />
            <img src="$store.state.jx.logo" class="imagesClass" :style="{backgroundColor:head}" v-else />
            <div class="logo-text" :title="systemVO.shortName || '轴管通'">{{systemVO.shortName || '轴管通' }}</div>
          </div>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {workspacePath} from "@/utils/define";
import {windowOpen} from "echarts/lib/util/format";
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    sysConfig() {
      return this.$store.state.settings.sysConfig
    },
    systemVO() {
      return this.$store.state.settings.systemVO
    },
    ...mapState({
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
    }),
  },
  methods: {
    goBackWorkspace(){
      windowOpen(workspacePath,'_self')
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
  height: 50px;
  line-height: 50px;
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
  height: 50px;
  width: 50px;
}
.logo-text {
  width: 100px;
  font-size: 24px !important;
  font-weight: bold;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // margin-left: -11px;
  // margin-top:-20px;
}

.expand {
  display: flex;
  align-items: center;
  padding: 0 6px;

  .workspace {
    color: white;
    font-size: 36px;
    margin-right: 12px;
  }

  .logo-title {
    display: flex;
    align-items: center;
  }
}
</style>
