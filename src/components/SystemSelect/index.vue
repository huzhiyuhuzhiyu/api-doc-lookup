<template>
  <!-- <div @keyup.native="close">

    <div class="international">
      <span @click="showSystem" style="cursor:pointer;">
        <i class="iconfont icon-caidan ym yc"></i>
        <span class="ym yc">{{ systemName }}</span>
      </span>


    </div>
    <transition name="fade">
      <div v-show="systemShow" class="system">
        <div class="system-header" :class="headClass" :style="{backgroundColor:head}">
          <span style="flex: 1; font-size: 18px;" class="yc text">切换系统</span>
          <span @click="closeSystem" style="line-height: 60px; cursor: pointer; font-size: 18px;"><i
              class="el-dialog__close el-icon el-icon-close"></i></span>
        </div>
        <div style="height:50px;box-sizing:border-box;">
          <span class="ant-input-group-wrapper ant-input-search"><span class="ant-input-wrapper ant-input-group"><span
                class="ant-input-affix-wrapper"><input @input="search(searchValue)" @compositionstart="onCompositionStart"
                  @compositionend="onCompositionEnd" v-model="searchValue" placeholder="搜索：请输入关键词" type="text"
                  class="ant-input"><span class="ant-input-suffix"><span @click="clearSearch" v-show="searchValue"
                    role="button" aria-label="close-circle" tabindex="-1"
                    class="  ant-input-clear-icon-hidden ant-input-clear-icon-has-suffix ant-input-clear-icon"><svg
                      focusable="false" class="" data-icon="close-circle" width="1em" height="1em" fill="currentColor"
                      aria-hidden="true" fill-rule="evenodd" viewBox="64 64 896 896">
                      <path
                        d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z">
                      </path>
                    </svg></span></span></span><span class="ant-input-group-addon"><button
                  class="ant-btn ant-input-search-button ant-btn-icon-only" type="button"><span role="img"
                    aria-label="search" class="anticon anticon-search"><svg focusable="false" class="" data-icon="search"
                      width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
                      <path
                        d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z">
                      </path>
                    </svg></span></button></span></span></span>
        </div>
        <div class="JNPF-flex-main" v-loading="systemLoading">
          <el-scrollbar class="column-list">
            <ul>
              <li class="text" v-for="(item, index) in list" :key="index"
                @click="changeMajor(item.id, 'System', item.name)">
                <span> {{ item.name }}</span>
                <span role="img" aria-label="check-circle"
                  :class="['anticon-check-circle', item.currentSystem ? 'active' : '']"><svg focusable="false" class=""
                    data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"
                    viewBox="64 64 896 896">
                    <path
                      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z">
                    </path>
                  </svg></span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </transition>
  </div> -->
  <el-dropdown class="international" placement="bottom-start" trigger="click">
    <span>
      <i class="icon-ym icon-ym-systemToggle ym yc"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item in userInfo.systemIds" :key="item.id"
        @click.native="changeMajor(item.id, 'System', item.name)" :disabled="item.currentSystem"> <i
          :class="item.icon"></i>{{ item.name }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import jnpf from '@/utils/jnpf'
import {
  mapGetters,
  mapState
} from 'vuex'
import {
  setMajor, getSystem
} from '@/api/permission/userSetting'
export default {
  computed: {
    ...mapGetters(['device', 'userInfo']),
    language() {
      return this.$store.getters.language
    },
    ...mapState({
      headClass: state => state.settings.headClass,
      head: state => state.settings.head,
    }),
  },
  data() {
    return {
      systemName: '',
      systemShow: false,
      searchValue: '',
      list: [],
      isComposition: false,
      systemQuery: {
        name: '',
        type: 'web'
      },
      timer: null,
      systemLoading: false,
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.closeSystem()
      },
      // 深度观察监听
      deep: true
    }
  },
  created() {
    this.userInfo.systemIds.forEach(item => {
      if (item.currentSystem) { this.systemName = item.name }
    })
    this.list = this.userInfo.systemIds
  },
  mounted() {
    document.addEventListener("keydown", this.close);
  },
  beforeDestroy() {
    // 页面销毁的时候清除监听事件
    document.removeEventListener("keydown", this.close);
  },
  methods: {
    changeMajor(majorId, majorType, name) { //切换系统
      localStorage.setItem("qhxt",true)
      if (name === this.systemName) return
      let query = {
        majorId,
        majorType
      }
      this.systemShow = false
      setMajor(query).then(res => {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$store.commit('user/SET_TOAST', false)
            if (name == "ERP（企业资源计划管理）") {
              location.href = location.origin + "/portal/ERPsystem"
            } else if (name == "MES（生产制造执行系统）") {
              location.href = location.origin + "/portal/MESsystem"
            } else if (name == "WMS（仓储物流系统）") {

              location.href = location.origin + "/portal/WMSsystem"
            } else if (name == "基础管理系统" || name == "BI（报表分析系统）" || name == "电子看板系统" || name == "消息推送系统" || name == "后台管理系统" || name == "开发管理系统") {
              location.href = location.origin + "/portal/home"
            } else {
              location.href = location.origin
            }

          }
        })

      })
    },
    showSystem() {
      this.systemShow = true
    },
    closeSystem() {
      this.searchValue = ''
      this.systemShow = false
    },
    clearSearch() {
      this.searchValue = ''
      this.list = this.userInfo.systemIds
    },
    async search() {
      if (this.isComposition) return
      // 防抖 避免频繁调接口
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.systemLoading = true
        this.searchData()
      }, 300);
    },
    // 防止输入中文时频繁触发
    onCompositionStart() { this.isComposition = true },
    onCompositionEnd() {
      this.isComposition = false
      this.search()
    },
    async searchData() {
      if (this.searchValue) {
        this.systemQuery.name = this.searchValue
        let res = await getSystem(this.systemQuery)
        this.list = res.data
      } else {
        this.list = this.userInfo.systemIds
      }
      this.systemLoading = false
    },
    close(e) {
      if (e.keyCode === 27 && this.systemShow) {
        this.closeSystem()
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.international {
  // float: left;
  padding: 0 8px;
  height: 100vh;

  .icon-caidan {
    line-height: 60px;
    margin-left: 20px;

  }

  .ym {
    margin-left: 5px;
  }

  .yc {
    font-size: 17px;
    color: #fff;
  }
}

::v-deep .JNPF-common-drawer .el-drawer__header>span {
  text-align: center !important;
}

.el-dropdown-menu {
  transform-origin: left top !important;
  margin: 5px 0px !important;
  top: 50px !important;
}

.system {
  width: 20%;
  height: 100vh;
  position: fixed;
  z-index: 99999;
  background-color: #fff;
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, .2), 0 16px 24px 2px rgba(0, 0, 0, .14), 0 6px 30px 5px rgba(0, 0, 0, .12);
  overflow: auto;
  outline: 0;

  .system-header {
    height: 60px;
    border-bottom: 1px solid #dcdfe6;
    padding: 0 20px;
    margin-bottom: 0;
    align-items: center;
    color: #fff;
    display: flex;

  }

  .ant-input-search {
    display: flex;
    width: 100%;
    height: 100%;
    text-align: start;
    vertical-align: top;
    border-bottom: 1px solid #f0f0f0;
    outline: none;
    padding: 0 5px;

    .ant-input-group {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: #000000d9;
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: tnum;
      position: relative;
      display: flex;
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;

      .ant-input-affix-wrapper {
        position: relative;
        display: inline-block;
        width: 100%;
        min-width: 0;
        padding: 4px 11px;
        color: #000000d9;
        font-size: 14px;
        line-height: 1.5715;
        background-color: #fff;
        background-image: none;
        // border: 1px solid #d9d9d9;
        border-radius: 2px;
        transition: all .3s;
        display: inline-flex;

        .ant-input {
          padding: 0;
          border: none;
          outline: none;
          float: left;
          width: 100%;
          margin-bottom: 0;
          text-align: inherit;

          &:focus {
            outline: none;
            box-shadow: none;
          }

        }

        .ant-input-prefix,
        .ant-input-suffix {
          display: flex;
          flex: none;
          align-items: center;
          margin-left: 4px;

          .ant-input-clear-icon-hidden {
            color: #bdbdbd;
            cursor: pointer;
          }
        }

      }

      .ant-input-group-addon {
        position: relative;
        padding: 0 11px;
        color: #000000d9;
        font-weight: 400;
        font-size: 14px;
        text-align: center;
        border-radius: 2px;
        transition: all .3s;
        top:10px;
        .ant-input-search-button {
          background: none;
          border: none;
          color: rgb(140, 137, 137);
          font-size: 18px;
          margin-top: 4px;
        }
      }

      .ant-input-affix-wrapper:not(:last-child) {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

      }
    }
  }

  .JNPF-flex-main {
    overflow: hidden;

    .column-list {
      height: 100%;
      padding: 0px 10px 0;
    }
  }

  ul {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    li {
      height: 60px;
      box-sizing: border-box;
      padding: 14px 8px;
      list-style: none;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      align-items: center;
      color: #666;
      .anticon-check-circle {
        color: #bdbdbd;
        font-size: 22px;
      }

      .active {
        color: #1890ff;
      }
    }
  }
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .8s;
}
</style>
<style lang="scss">
.classic .lightWhite,
.plain .lightWhite,
{
.ym {
  margin-left: 5px;
  color: #fff;
}

.yc {
  color: #fff;
}
.syst{
  background-image: linear-gradient(to right, #1890ff, #3FB9F8);
}
}
</style>