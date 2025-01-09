<template>
  <div>
    <el-dialog title="收藏夹" :visible.sync="dialogVisible" width="60%" :fullscreen="editShow" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false">
      <template v-if="editShow">
        <el-table :data="userFavoritesList" style="width: 100%;height: 77vh;" v-loading="loading">
          <el-table-column prop="urlName" label="名称" min-width="180">
            <template slot-scope="scope">
              <el-input @change="switchShow(scope.row, 'sort')" @blur="urlNameBlur(scope.row)"
                v-model="scope.row.urlName"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="urlAddress" label="地址" min-width="180">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="80" align="center">
            <template slot-scope="scope">
              <tableOpts :hasEdit="false" @del="handleDel(scope.row.id)">
              </tableOpts>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </template>

      <template v-else>
        <div style="display: flex;flex-wrap: wrap;">
          <div v-for="item in userFavoritesList" :key="item.id">
            <div style="margin: 10px;">
              <el-button type="primary" round @click="enterRouter(item.urlAddress)">
                {{ item.urlName }}
              </el-button>
            </div>
          </div>
        </div>

      </template>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeState">{{ editShow ? '路由跳转' : '编辑' }}</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserFavorites, updateUserFavorites, delUserFavorites } from '@/api/permission/user'
export default {
  name: 'RouterList',
  components: {},
  data() {
    return {
      dialogVisible: false,
      loading: false,
      menuVisible: false,
      userFavoritesList: [],
      editShow: false,
      listQuery: {
        keyword: '',
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  created() { },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {},
  methods: {
    enterRouter(urlAddress) {
      this.dialogVisible = false
      this.$router.push({
        path: urlAddress
      })
    },
    changeState() {
      this.editShow = !this.editShow
    },
    switchShow(row) {
      if (!row.urlName) return this.$message.error('请修改名称')
      let obj = row
      updateUserFavorites(obj)
        .then((response) => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getUserFavoritesList()
            }
          })
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    urlNameBlur(row) {
      if (!row.urlName) this.getUserFavoritesList()
    },
    handleDel(id) {
      this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
        type: "warning",
      })
        .then(() => {
          delUserFavorites(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功",
              duration: 1500,
              onClose: () => {
                this.getUserFavoritesList()
              },
            })
          })
        })
        .catch(() => { })
    },
    init() {
      this.finish = false
      this.dialogVisible = true
      this.editShow = false
      this.listQuery.pageNum = 1
      this.listQuery.keyword = ''
      this.listQuery.userId = this.userInfo.userId
      this.activeTab = 'reply'
      this.userFavoritesList = []
      this.replyList = []
      this.getUserFavoritesList()
    },

    getUserFavoritesList() {
      this.loading = true
      getUserFavorites(this.listQuery).then((res) => {
        this.userFavoritesList = res.data.records
        this.loading = false
      })
    },
    search() {
      this.userFavoritesList = []
      this.finish = false
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 20
      this.getUserFavoritesList()
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
<style>
.contextmenu__item {
  display: block;
  line-height: 34px;
  text-align: center;
}

.contextmenu__item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.menu {
  position: absolute;
  background-color: #fff;
  width: 100px;
  /*height: 106px;*/
  font-size: 12px;
  color: #444040;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  white-space: nowrap;
  z-index: 1000;
}

.contextmenu__item:hover {
  cursor: pointer;
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
</style>