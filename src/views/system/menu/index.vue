<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable @keyup.enter.native="initData()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="initData()">
                {{ $t('common.search') }}
              </el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle()" />
          <div class="JNPF-common-head-right" style="display:flex;justify-content: center;">
            <div style="display:flex;align-items:center;">
              <el-tooltip class="item" content="列表模式" placement="bottom" effect="light" v-if="!switchlist">
                <div class="getSwitchList-p" @click="switchlist = !switchlist" style="margin-bottom: 2px">
                  <img src="@/assets/images/a2.png" alt="">
                </div>
              </el-tooltip>
              <el-tooltip class="item" content="图文模式" placement="bottom" effect="light" v-else>
                <div class="getSwitchList-p" @click="switchlist = !switchlist" style="margin-bottom: 2px">
                  <img src="@/assets/images/a1.png" alt="">
                </div>
              </el-tooltip>
            </div>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" v-if="!switchlist">
          <el-table-column prop="fullName" label="应用名称" min-width="130" key="fullName" />
          <el-table-column prop="enCode" label="应用编码" min-width="130" key="enCode" />
          <!-- <el-table-column prop="description" label="应用说明" min-width="140" key="description" /> -->
          <!-- <el-table-column prop="applicationType" label="应用类型" min-width="100" key="applicationType">
            <template slot-scope="scope">
              <div v-if="scope.row.applicationType == 'Web'">
                <span>PC端应用</span>
              </div>
              <div v-else-if="scope.row.applicationType == 'App'">
                <span>移动端应用</span>
              </div>
              <div v-else-if="scope.row.applicationType == 'Terminal'">
                <span>工位终端应用</span>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="defaultSorting" label="默认选中顺序" width="120" key="defaultSorting" /> -->
          <!-- <el-table-column prop="icon" label="图标" width="70" align="center" key="icon">
            <template slot-scope="scope">
              <i :class="scope.row.icon + ' table-icon'" />
            </template>
          </el-table-column> -->
          <el-table-column prop="sortCode" label="排序" width="70" align="center" key="sortCode" />
          <el-table-column prop="enabledMark" label="状态" width="80" align="center" key="enabledMark">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.enabledMark == 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180" key="111">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
              </el-button>
              <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)"
                :disabled="scope.row.isMain == 1 ? true : false">
                删除
              </el-button>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">{{ $t('common.moreBtn') }}<i
                      class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="preview(scope.row)">
                    菜单管理
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="copy(scope.row.id)">
                    复制应用
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <el-scrollbar class="column-list" v-else>
          <div class="card-wrapper cardGrobal">
            <el-card class="box-card" shadow="hover" v-for="item in list" :key="item.id">
              <div class="card-item">
                <div class="card-icon">
                  <i :class="item.icon" />
                </div>
                <div class="card-body">
                  <div style="color: #172b4d;font-size:16px;font-weight:600">{{ item.fullName }}</div>
                  <div style="color: #505f79;font-size:14x;">{{ item.enCode }}</div>
                </div>
                <div class="card-enabledMark">
                  <div>
                    <el-tooltip :content="'状态: ' + item.enabledMark" placement="top">
                      <el-switch v-model="item.enabledState" active-color="#13ce66" inactive-color="#ff4949"
                        @change="changeState(item)">
                      </el-switch>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div class="card-btn">
                <el-button size="mini" type="text" round @click="addOrUpdateHandle(item.id)">编辑
                </el-button>
                <el-button size="mini" type="text" round @click="handleDel(item.id)"
                  :disabled="item.isMain == 1 ? true : false">
                  删除
                </el-button>
                <el-button size="mini" type="text" round @click.native="preview(item)">菜单管理
                </el-button>
                <el-button size="mini" type="text" round @click.native="copy(item.id)">复制应用
                </el-button>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <menuManage v-if="previewVisible" ref="menuManage" @close="closeForm" />
  </div>
</template>
<script>
import Form from './Form'
import MenuManage from './menuManage'
import { delSystem, getSystem, copy, info, update } from '@/api/system/system'
import { Copy } from '@/api/onlineDev/visualDev'

export default {
  name: 'system-menu',
  components: {
    Form,
    MenuManage
  },
  data() {
    return {
      options: [],
      listQuery: {
        keyword: ''
      },
      list: [],
      btnLoading: false,
      listLoading: false,
      formVisible: false,
      expands: true,
      refreshTable: true,
      previewVisible: false,
      total: 0,
      switchlist: true
    }
  },
  created() {
    this.initData()
  },
  methods: {
    closeForm(isRefresh) {
      this.previewVisible = false
      this.formVisible = false
      if (isRefresh) this.initData()
    },
    reset() {
      this.listQuery.keyword = ''
      this.initData()
    },
    initData() {
      this.listLoading = true
      getSystem(this.listQuery).then((res) => {
        this.list = res.data.list.map(item => {
          return {
            ...item,
            enabledState: item.enabledMark ? true : false,
          }
        })
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    preview(row) {
      this.previewVisible = true
      this.$nextTick(() => {
        this.$refs.menuManage.init(row)
      })
    },
    copy(id) {
      this.$confirm('您确定要复制该菜单, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        copy(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => {
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delSystem(id).then((res) => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => {
      })
    },
    changeState(row) {
      let data = {
        ...row,
        enabledMark: row.enabledState ? 1 : 0,
      }
      update(data).then(res => {
        if (res.msg === '更新成功') {
          this.$message.success(res.msg)
          this.initData()
        }
      }).catch(() => { })
    },
  }
}
</script>
<style lang="scss" scoped>
.menu-list {
  .table-icon {
    vertical-align: middle;
    font-size: 16px;
  }

  .JNPF-common-layout-main {
    padding: 0;
  }

  .menu-tab {
    height: 100%;

    >>>.el-tabs__content {
      padding: 0;
      height: calc(100% - 40px);

      .box {
        flex: 1;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
      }
    }
  }
}

.getSwitchList-p {
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
}

.column-list {
  height: 100%;
}

.card-wrapper {
  // grid 二维布局
  display: grid;
  /*  行高度  */
  // grid-template-rows: 300px;
  /*  列宽度  */
  grid-template-columns: repeat(2, calc(50% - 12px));
  /*  行间距和列间距  */
  grid-gap: 10px;
  padding: 10px;

  .box-card {
    position: relative;
    //   cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    ::v-deep .el-card__body {
      width: 100%;
      padding-bottom: 10px;

      .card-item {
        display: flex;

        .card-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          margin-right: 16px;
          // color: #fff;
          // background-color: #0052cc;
          border-radius: 3px;

          .table-icon {
            vertical-align: middle;
            font-size: 16px;
          }
        }

        .card-body {
          flex: 1;
          margin-right: 6px;
          overflow: hidden;

          div {
            padding: 0 0 5px 0;
          }
        }

        .card-enabledMark {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .card-btn {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        float: right;
        text-align: right
      }
    }
  }
}

::v-deep .is-round {
  padding-right: 0 !important;
  padding-left: 0 !important;
}
</style>
