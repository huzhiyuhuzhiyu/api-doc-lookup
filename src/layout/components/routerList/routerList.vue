<template>
  <div>
    <el-dialog title="收藏夹" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false" class="JNPF-dialog JNPF-dialog_center selectPro">
      <el-dialog title="收藏修改" :visible.sync="innerVisible" width="30%" :close-on-click-modal="false"
        :close-on-press-escape="false" :show-close="false" class="JNPF-dialog JNPF-dialog_center selectPro"
        append-to-body>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" style="margin: 0 10px;">
          <el-form-item label="名称" prop="urlName">
            <el-input v-model="ruleForm.urlName"></el-input>
          </el-form-item>
          <el-form-item label="路由">
            <el-input v-model="ruleForm.urlAddress"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <div class="card-list" v-loading="listLoading">
        <div v-for="(line, index) in userFavoritesList" :key="line.id">
          <el-card shadow="hover" class="box-card">
            <div @click="enterRouter(line.urlAddress)"> {{ line.urlName }} </div>
            <div style="text-align:right">
              <el-button size="mini" type="text" @click="editSate(line)">编辑</el-button>
              <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(line.id)">删除</el-button>
            </div>
          </el-card>
        </div>

      </div>

      <span slot="footer" class="dialog-footer">
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
      innerVisible: false,
      listLoading: false,
      loading: false,
      menuVisible: false,
      userFavoritesList: [],
      listQuery: {
        keyword: '',
        pageNum: 1,
        pageSize: -1
      },
      ruleForm: {
        urlName: '',
        urlAddress: ''
      },
      rules: {
        urlName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        urlAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
      },
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateUserFavorites(this.ruleForm).then(res => {
            this.innerVisible = false
            this.getUserFavoritesList()
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editSate(row) {
      this.ruleForm = { ...row }
      this.innerVisible = true
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
      this.listQuery.pageNum = 1
      this.listQuery.keyword = ''
      this.listQuery.userId = this.userInfo.userId
      this.userFavoritesList = []
      this.getUserFavoritesList()
    },

    getUserFavoritesList() {
      this.loading = true
      getUserFavorites(this.listQuery).then((res) => {
        this.userFavoritesList = res.data.records

        this.loading = false
      })
    },
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
<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;

  .box-card-add {
    ::v-deep .el-card__body {
      display: flex;
      align-items: center;
    }
  }

  .box-card {
    width: 260px;
    height: 80px;
    box-sizing: border-box;
    margin: 5px 8px 0 0;
    position: relative;
    font-size: 18px;
    cursor: pointer;

    ::v-deep .el-card__body {
      position: relative;
      height: 100%;

      div {
        white-space: nowrap;
        text-overflow: ellipsis;
        // overflow: hidden;
      }
    }

    .icon-checked {
      display: block;
      width: 12px;
      height: 12px;
      border: 12px solid #409eff;
      border-left: 12px solid transparent;
      border-top: 12px solid transparent;
      border-bottom-right-radius: 4px;
      position: absolute;
      right: 0px;
      bottom: 0px;

      i {
        position: absolute;
        top: -2px;
        left: -2px;
        font-size: 12px;
        color: #fff;
      }
    }

    &.box-card-active {
      background-color: #3fb9f8;
      color: #fff;
    }

    .template-item__delete-btn {
      display: none;
      position: absolute;
      top: -3px;
      right: -3px;
      width: 20px;
      height: 20px;
      padding: 2px;
      transition: display .3s linear;

      .icon-delete {
        width: 16px;
        height: 16px;
        background: url(~@/assets/images/delete.png) center center no-repeat no-repeat;
        background-size: cover;
      }
    }

    &:hover {
      .template-item__delete-btn {
        display: block;
      }
    }
  }
}
</style>