<template>
  <div>
    <el-drawer title="超链接" :visible.sync="drawer" direction="rtl" class="contacts-drawer JNPF-common-drawer"
      size="280px" :modal="true" :before-close="handleClose" ref="drawer">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="收藏" name="reply">
          <div class="userList replyList" v-loading="replyLoading && listQuery.currentPage == 1">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" style="margin: 0 10px;">
              <el-form-item label="名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="路由">
                <el-input v-model="ruleForm.router" disabled></el-input>
              </el-form-item>
              <el-form-item>
                <div style="display: flex;justify-content: flex-end">
                  <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                </div>

              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="列表" name="contacts">
          <!-- <el-button type="primary" @click="enterRouter">主要按钮</el-button> -->
          <el-input v-model="listQuery.keyword" placeholder="搜索：请输入关键词" clearable @keyup.enter.native="search()"
            class="search-input">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search" title="搜索" />
          </el-input>
          <div class="userList" v-loading="loading && listQuery.currentPage == 1" ref="userList">
            <div v-if="userList.length">
              <div v-for="(item, i) in userList" :key="i" class="userList-item" @click="readInfo(item)">
                <el-avatar :size="36" :src="define.comUrl + item.headIcon">
                </el-avatar>
                <div class="userList-txt">
                  <p class="title">{{ item.realName }}/{{ item.account }}</p>
                  <p class="name">
                    <span>{{ item.department }}</span>
                  </p>
                </div>
              </div>
            </div>
            <p class="noData-txt" v-else>{{ $t('common.noData') }}</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getImUser } from '@/api/permission/user'
import dragDialog from "@/directive/el-drag-dialog";
import { getIMReply, deleteChatRecord, relocation } from '@/api/system/message'
export default {
  name: 'RouterList',
  components: {},
  data() {
    return {
      ruleForm: {
        name: '',
        router: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],

      },
      top: 0,
      left: 0,
      selectedTag: {},
      visitedViews: '',
      drawer: false,
      activeTab: 'reply',
      userList: [],
      replyList: [],
      loading: false,
      replyLoading: false,
      visibleMenu: false,
      visible: false,
      finish: false,
      listQuery: {
        keyword: '',
        currentPage: 1,
        pageSize: 20
      }
    }
  },
  created() {

  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    activeTab(val) {
      if (val === 'contacts' && !this.userList.length) {
        this.getUserList()
      }
    },
    visibleMenu(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    enterRouter() {
      this.$router.push({
        path: "/basicData/supplierManagement/supplierProfile",

      })
    },
    closeMenu() {
      this.visibleMenu = false
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 30 // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.clientY - 95
      this.visibleMenu = true
      this.selectedTag = tag
    },


    init() {
      this.finish = false
      this.drawer = true
      this.listQuery.currentPage = 1
      this.listQuery.keyword = ''
      this.activeTab = 'reply'
      this.ruleForm.name = ''
      this.ruleForm.router = window.location.pathname
      console.log(this.ruleForm, 'jjj')
      this.userList = []
      this.replyList = []
      this.getReplyList()
      this.$nextTick(() => {
        this.bindScroll()
      })
    },
    bindScroll() {
      let _this = this,
        vBody = _this.$refs.userList;
      vBody.addEventListener("scroll", function () {
        if (vBody.scrollHeight - vBody.clientHeight - vBody.scrollTop <= 300 && !_this.loading && !_this.finish) {
          _this.listQuery.currentPage += 1
          _this.getUserList()
        }
      });
    },
    getReplyList() {
      this.replyLoading = true
      getIMReply().then(res => {
        this.replyList = res.data.list
        this.replyLoading = false
      })
    },
    getUserList() {
      this.loading = true
      getImUser(this.listQuery).then(res => {
        if (res.data.list.length < this.listQuery.pageSize) this.finish = true
        this.userList = [...this.userList, ...res.data.list]
        this.loading = false
      })
    },
    search() {
      this.userList = []
      this.finish = false
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = 20
      this.getUserList()
    },

    toggleBlink() {
      const boo = this.replyList.some(o => o.unreadMessage)
      this.$emit('changeTwinkle', boo)
    },
    readInfo(item, isReply) {
      let socket = this.$store.getters.socket
      let updateReadMessage = {
        method: "UpdateReadMessage",
        formUserId: item.id,
        token: this.$store.getters.token
      }
      socket.send(JSON.stringify(updateReadMessage));
      if (isReply) {
        item.unreadMessage = 0
      } else {
        for (let i = 0; i < this.replyList.length; i++) {
          if (item.id === this.replyList[i].id) {
            this.replyList[i].unreadMessage = 0
            break
          }
        }
      }
      this.toggleBlink()
      this.$refs.JNPFIm.list = []
      //获取消息列表
      var messageList = {
        method: "MessageList",
        toUserId: item.id,
        formUserId: this.userInfo.userId,
        token: this.$store.getters.token,
        currentPage: 1,
        pageSize: 30,
        sord: "desc"
      }
      socket.send(JSON.stringify(messageList));
      this.$refs.JNPFIm.init(item)
    },
    getMsgText(text, type) {
      let message = ''
      switch (type) {
        case 'voice':
          message = '[语音]'
          break;
        case 'image':
          message = '[图片]'
          break;
        default:
          message = text
          break;
      }
      return message
    },
    handleClose(done) {
      let vBody = this.$refs.userList;
      vBody.removeEventListener("scroll", function () { });
      done();
    }
  }
}
</script>

<style lang="scss" scoped>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
  }
}

.contacts-drawer {
  .el-tabs {
    height: 100%;

    .el-tabs__header {
      margin-bottom: 0 !important;
    }

    .el-tabs__item {
      width: 50%;
      text-align: center;
      color: #303133 !important;
    }

    .el-tabs__nav {
      width: 100%;
    }

    .el-tabs__content {
      height: calc(100% - 40px);
    }

    .el-tab-pane {
      height: 100%;
      overflow: hidden;
    }
  }

  .noData-txt {
    font-size: 14px;
    color: #909399;
    line-height: 20px;
    text-align: center;
    padding-top: 20px;
  }

  .search-input {
    .el-input__inner {
      border-radius: 0;
      border-right: none;
      border-left: none;
      border-top: none;
    }

    .el-input__icon {
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .el-drawer__header {
    border: none;
  }

  .el-drawer__body {
    overflow: hidden;

    .userList {
      overflow: auto;
      overflow-x: hidden;
      position: relative;
      height: calc(100% - 32px);

      &.replyList {
        height: 100%;

        .title {
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 20px;
        }
      }

      .el-badge {
        margin-top: 10px;
      }

      .el-loading-mask {
        top: 100px;
      }
    }

    .userList-item {
      position: relative;
      display: block;
      padding: 0 20px;
      background-color: #fff;
      border-bottom: 1px solid #f5f7f9;
      height: 60px;
      display: flex;
      align-items: center;
      cursor: pointer;

      .offLine {
        filter: grayscale(1);
      }

      &:hover {
        background-color: #f5f7f9;
      }

      .userList-txt {
        margin-left: 14px;
        overflow: hidden;
        flex: 1;
        padding-top: 1px;

        .title {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
          line-height: 20px;
        }

        .name {
          font-size: 12px;
          color: #999;

          .content {
            display: inline-block;
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .time {
            float: right;
          }
        }
      }
    }
  }
}
</style>
<style scoped>
.el-input__inner {
  font-size: inherit !important;
}

.el-drawer__body {
  padding: 0;
}

/deep/.el-drawer__header {
  border: none;
}

/deep/ .el-tabs__item {
  width: 50%;
  text-align: center;
}

/deep/.el-tabs__nav {
  width: 100%;
}

/deep/.el-tabs__active-bar {
  width: 120px;
}
</style>