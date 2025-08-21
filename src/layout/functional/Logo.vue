<template>
  <div class="functional-logo-container">
    <router-link  class="sidebar-logo-link" to="/">
      <div class="expand" :style="{ backgroundColor: head }">
        <el-tooltip content="返回工作台" placement="bottom">
          <i class="icon-ym icon-ym-nav-home workspace" @click="goBackWorkspace"></i>
        </el-tooltip>
        <div class="logo-title">
          <img v-if="systemVO.iconUrl" :src="apiBaseUrl + systemVO.iconUrl" class="imagesClass" :style="{ backgroundColor: head }" />
          <img src="$store.state.jx.logo" class="imagesClass" :style="{backgroundColor:head}" v-else/>
          <div  class="logo-text" :title="systemVO.shortName || '轴管通'">{{systemVO.shortName || '轴管通' }}</div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {windowOpen} from "echarts/lib/util/format";
import {workspacePath,DHK_API} from "@/utils/define";
export default {
  name: 'SidebarLogo',
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
    }),
    systemVO() {
      return this.$store.state.settings.systemVO
    },
    apiBaseUrl() {
      return DHK_API
    }
  },
  methods: {
    goBackWorkspace(){
      windowOpen(workspacePath,'_self')
    }
  }
}
</script>

<style lang="scss" scoped>
.functional-logo-container {
  width: 210px;
  height: 50px;
  line-height: 50px;
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
.imagesClass {
  height: 42px;
  width: 42px;
}
.logo-text {
  width: 100px;
  font-size: 24px !important;
  font-weight: bold;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
