<template>
  <div class="navbar" :class="headClass" :style="{ backgroundColor: head }">
    <logo />
    <!-- <template v-if="device !== 'mobile'">
      <template v-if="showSearch" class="hamburger-container">
        <search id="header-search" class="right-menu-item" />
      </template>
</template> -->
    <template class="hamburger-container" v-if="selectFlag">
      <el-select style="margin-top: 5px;" v-model="autoProjectId" placeholder="请选择"
        :disabled="userInfo.userProjectId !== '1' && userInfo.userProjectId" @change="projectIChange">
        <el-option v-for="item in projectIdData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </template>
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
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: { Logo, Menu, NavbarRight, Search },
  mixins: [getProjectList],
  computed: {
    ...mapState({
      slideClass: state => state.settings.slideClass,
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
      showSearch: state => state.settings.showSearch,
    }),
    ...mapGetters(['device',])
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
      console.log(this.userInfo, 'this.userInfo.projectId ')
      console.log(this.autoProjectId, '11111')
      if (this.userInfo.userProjectId === '1') {
        if (this.userInfo.projectId === '1') {
          if (localStorage.getItem('autoProjectId')) {
            this.autoProjectId = localStorage.getItem('autoProjectId')
          } else {
            this.autoProjectId = this.userInfo.projectId
          }
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
      this.$router.push({ name: 'commonPage' })
      location.reload();
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

  .main-menu {
    flex: 1;
    overflow: hidden;
    height: 60px;
  }
}
</style>