<template>
  <div class="sidebar-logo-container" >
    <router-link class="sidebar-logo-link" to="/" :class="headClass" :style="{backgroundColor:head}">
      <div class="expand">
        <el-tooltip content="返回工作台" placement="bottom">
          <i class="icon-ym icon-ym-nav-home workspace" @click="goBackWorkspace"></i>
        </el-tooltip>
        <el-image class="sidebar-logo" :src="define.DHK_API+systemVO.iconUrl"
          v-if="systemVO && systemVO.iconUrl">
          <template slot="error">
            <img class="sidebar-logo" src="@/assets/images/jnpf.png" alt="">
          </template>
        </el-image>
        <img src="@/assets/images/jnpf.png" class="sidebar-logo" v-else/>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {windowOpen} from "echarts/lib/util/format";
import {workspacePath} from "@/utils/define";
export default {
  name: 'SidebarLogo',
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
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #29384a;
  text-align: center;
  overflow: hidden;
  border-bottom: 1px solid #29384a;
  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      height: 50px;
      width: auto;
    }
  }
}
.expand {
  display: flex;
  align-items: center;
  padding: 0 6px;

  .workspace {
    color: white;
    font-size: 28px;
  }

  .logo-title {
    display: flex;
    align-items: center;
  }
}
</style>
