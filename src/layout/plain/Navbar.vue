<template>
  <div class="navbar" :class="headClass" :style="{ backgroundColor: head }">
    <!-- <span class="navbar-platform">快速开发平台</span> -->
    <template v-if="device !== 'mobile'">
      <!-- <template v-if="showSwitch" id="hamburger-container" class="hamburger-container">
        <system-select class="right-menu-item hover-effect" />
      </template> -->
      <!-- <template v-if="showSearch" class="hamburger-container">
        <search id="header-search" class="right-menu-item" />
      </template> -->
    </template>
    <template class="hamburger-container" v-if="selectFlag">
      <el-select style="margin-top: 15px;" v-model="autoProjectId" placeholder="请选择"
        :disabled="userInfo.userProjectId !== '1' && userInfo.userProjectId" @change="projectIChange">
        <el-option v-for="item in projectIdData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </template>
    <NavbarRight />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import NavbarRight from '../components/NavbarRight'
import Search from '@/components/HeaderSearch'
import SystemSelect from '@/components/SystemSelect'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: { NavbarRight, Search, SystemSelect },
  mixins: [getProjectList],
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
  data() {
    return {
      autoProjectId: '',
      isProjectSwitch: '',
      tableDataFlag: false,
      selectFlag: false,
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
    console.log(this.projectIdData, 'oj')
    this.tableDataFlag = true
    console.log(this.isProjectSwitch, 'piii')
    console.log(localStorage.getItem('autoProjectId'), 'pkkkll')
    if (this.isProjectSwitch === '1') {
      this.userInfo.systemIds.forEach(item => {
        if (item.name === "后台管理系统" && item.currentSystem) {
          this.selectFlag = false
        } else {
          this.selectFlag = true
        }
      })

      if (this.userInfo.userProjectId === '1') {
        if (this.userInfo.projectId === '1') {
          this.autoProjectId = localStorage.getItem('autoProjectId')
          this.$store.commit('user/SET_USERINFO_PROJECTID', this.autoProjectId)
        } else {
          this.autoProjectId = localStorage.getItem('autoProjectId')
          this.$store.commit('user/SET_USERINFO_PROJECTID', this.autoProjectId)
        }
      } else {
        this.autoProjectId = this.userInfo.userProjectId
      }

    } else {

    }
  },
  methods: {
    projectIChange(val) {
      console.log(val, 'kkk')
      this.autoProjectId = val
      localStorage.setItem('autoProjectId', val)
      this.$store.commit('user/SET_USERINFO_PROJECTID', val)
      // location.reload();
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
}
</style>