<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="addBox">
        <topOpts @add="addOrUpdateHandle()" />

      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="item.fullName" :name="item.enCode" v-for="(item, index) in applicationTypeList"
          :key="index">

          <div v-if="item.enCode == 'PC'" class="PC ">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item label="关键词">
                    <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                      @keyup.enter.native="initData()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="initData()">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset')
                      }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
              <div class="JNPF-common-head" style="float: right;margin-right: 10px;padding:8px 10px;">

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
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>

                </div>
              </div>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main ccc">

              <JNPF-table v-loading="listLoading" :data="pcList" v-if="!switchlist">
                <el-table-column prop="fullName" label="应用名称" min-width="120" key="fullName" />
                <el-table-column prop="enCode" label="应用编码" min-width="120" key="enCode" />


                <el-table-column prop="sortCode" label="排序" width="70" align="center" key="sortCode" />
                <el-table-column prop="enabledMark" label="状态" width="80" align="center" key="enabledMark">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                      {{ scope.row.enabledMark == 1 ? '启用' : '禁用' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="120" key="111">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id,scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)"
                      :disabled="scope.row.isMain == 1 ? true : false">
                      删除
                    </el-button>
                    <el-button size="mini" type="text" @click.native="preview(scope.row)">
                      菜单管理
                    </el-button>
                    <el-button size="mini" type="text" @click.native="copy(scope.row.id)">
                      复制应用
                    </el-button>

                  </template>
                </el-table-column>
              </JNPF-table>
              <el-scrollbar class="column-list" v-else>
                <div class="card-wrapper cardGrobal">
                  <el-card class="box-card" shadow="hover" v-for="item in pcList" :key="item.id">
                    <div class="card-item">
                      <div class="card-icon">
                        <i :class="item.icon" />
                      </div>
                      <div class="card-body">
                        <div style="color: #172b4d;font-size:16px;font-weight:600">{{
                          item.fullName }}</div>
                        <div style="color: #505f79;font-size:14x;">{{ item.enCode }}</div>
                      </div>
                      <div class="card-enabledMark">
                        <div>
                          <el-switch v-model="item.enabledState" :disabled="item.isMain == 1" active-color="#13ce66"
                            inactive-color="#ff4949" @change="changeState(item)">
                          </el-switch>
                        </div>
                      </div>
                    </div>
                    <div class="card-btn">
                      <el-button size="mini" type="text" round @click="addOrUpdateHandle(item.id,item)">编辑
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
          <div v-if="item.enCode == 'YDD'" class="PC ">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item label="关键词">
                    <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                      @keyup.enter.native="initData()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="initData()">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset')
                      }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
              <div class="JNPF-common-head" style="float: right;margin-right: 10px;padding:8px 10px;">

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
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>

                </div>
              </div>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main ccc">

              <JNPF-table v-loading="listLoading" :data="appList" v-if="!switchlist">
                <el-table-column prop="fullName" label="应用名称" min-width="120" key="fullName" />
                <el-table-column prop="enCode" label="应用编码" min-width="120" key="enCode" />


                <el-table-column prop="sortCode" label="排序" width="70" align="center" key="sortCode" />
                <el-table-column prop="enabledMark" label="状态" width="80" align="center" key="enabledMark">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                      {{ scope.row.enabledMark == 1 ? '启用' : '禁用' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="120" key="111">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id,scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)"
                      :disabled="scope.row.isMain == 1 ? true : false">
                      删除
                    </el-button>
                    <el-button size="mini" type="text" @click.native="preview(scope.row)">
                      菜单管理
                    </el-button>
                    <el-button size="mini" type="text" @click.native="copy(scope.row.id)">
                      复制应用
                    </el-button>

                  </template>
                </el-table-column>
              </JNPF-table>
              <el-scrollbar class="column-list" v-else>
                <div class="card-wrapper cardGrobal">
                  <el-card class="box-card" shadow="hover" v-for="item in appList" :key="item.id">
                    <div class="card-item">
                      <div class="card-icon">
                        <i :class="item.icon" />
                      </div>
                      <div class="card-body">
                        <div style="color: #172b4d;font-size:16px;font-weight:600">{{
                          item.fullName }}</div>
                        <div style="color: #505f79;font-size:14x;">{{ item.enCode }}</div>
                      </div>
                      <div class="card-enabledMark">
                        <div>
                          <el-switch v-model="item.enabledState" :disabled="item.isMain == 1" active-color="#13ce66"
                            inactive-color="#ff4949" @change="changeState(item)">
                          </el-switch>
                        </div>
                      </div>
                    </div>
                    <div class="card-btn">
                      <el-button size="mini" type="text" round @click="addOrUpdateHandle(item.id,item)">编辑
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
          <div v-if="item.enCode == 'GWZD'" class="PC ">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item label="关键词">
                    <el-input v-model="listQuery.keyword" placeholder="请输入关键词查询" clearable
                      @keyup.enter.native="initData()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="initData()">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset')
                      }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
              <div class="JNPF-common-head" style="float: right;margin-right: 10px;padding:8px 10px;">

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
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>

                </div>
              </div>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main ccc">

              <JNPF-table v-loading="listLoading" :data="gwzdList" v-if="!switchlist">
                <el-table-column prop="fullName" label="应用名称" min-width="120" key="fullName" />
                <el-table-column prop="enCode" label="应用编码" min-width="120" key="enCode" />


                <el-table-column prop="sortCode" label="排序" width="70" align="center" key="sortCode" />
                <el-table-column prop="enabledMark" label="状态" width="80" align="center" key="enabledMark">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                      {{ scope.row.enabledMark == 1 ? '启用' : '禁用' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="120" key="111">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id,scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)"
                      :disabled="scope.row.isMain == 1 ? true : false">
                      删除
                    </el-button>
                    <el-button size="mini" type="text" @click.native="preview(scope.row)">
                      菜单管理
                    </el-button>
                    <el-button size="mini" type="text" @click.native="copy(scope.row.id)">
                      复制应用
                    </el-button>

                  </template>
                </el-table-column>
              </JNPF-table>
              <el-scrollbar class="column-list" v-else>
                <div class="card-wrapper cardGrobal">
                  <el-card class="box-card" shadow="hover" v-for="item in gwzdList" :key="item.id">
                    <div class="card-item">
                      <div class="card-icon">
                        <i :class="item.icon" />
                      </div>
                      <div class="card-body">
                        <div style="color: #172b4d;font-size:16px;font-weight:600">{{
                          item.fullName }}</div>
                        <div style="color: #505f79;font-size:14x;">{{ item.enCode }}</div>
                      </div>
                      <div class="card-enabledMark">
                        <div>
                          <el-switch v-model="item.enabledState" :disabled="item.isMain == 1" active-color="#13ce66"
                            inactive-color="#ff4949" @change="changeState(item)">
                          </el-switch>
                        </div>
                      </div>
                    </div>
                    <div class="card-btn">
                      <el-button size="mini" type="text" round @click="addOrUpdateHandle(item.id,item)">编辑
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
        </el-tab-pane>
      </el-tabs>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />

    <menuManage v-if="previewVisible" ref="menuManage" @close="closeForm" />

  </div>
</template>
<script>
import Form from './Form'
import MenuManage from './menuManage'
import { delSystem, getSystem, copy, info, update } from '@/api/system/system'
import { login, logout, getInfo, unlock } from '@/api/user'
import { Copy } from '@/api/onlineDev/visualDev'
import {
  getDictionaryDataList,
} from '@/api/systemData/dictionary'
export default {
  name: 'system-menu',
  components: {
    Form,
    MenuManage
  },
  data() {
    return {
      activeName: "",
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
      switchlist: true,
      form: {
        keyword: '',
        isTree: 0
      },
      applicationTypeList: [],
      gwzdList: [],
      pcList: [],
      appList: [],
    }
  },
  created() {
    this.initData()
    this.getDictionaryList()
  },
  methods: {


    
    handleClick(e) {
      console.log("e", e);
    },

    // 获取应用类型(数据字典)
    getDictionaryList() {
      this.listLoading = true
      getDictionaryDataList('578184163824249989', this.form).then(res => {
        console.log("应用类型", res);
        this.applicationTypeList = res.data.list
        this.activeName = this.applicationTypeList[0].enCode
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    closeForm(isRefresh) {
      this.previewVisible = false
      this.formVisible = false
      if (isRefresh){
        this.initData()
        window.location.reload()

      }
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
        this.pcList = this.list.filter(item => item.applicationType === "Web");
        this.appList = this.list.filter(item => item.applicationType === "App");
        this.gwzdList = this.list.filter(item => item.applicationType === "Terminal");
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
    addOrUpdateHandle(id,data) {
      console.log(id,data,this.activeName);
      let title=""
      if(id){
        title=data.fullName
      }else{
        title=this.activeName=='PC'?'PC端应用':this.activeName=='YDD'?'移动端应用':"工位终端应用"
      }
       
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id,title,this.activeName)
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
          window.location.reload()

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
  /*  行高度 */
  // grid-template-rows: 300px;
  /*  列宽度 */
  grid-template-columns: repeat(2, calc(50% - 12px));
  /*  行间距和列间距 */
  grid-gap: 10px;
  padding: 10px;
  padding-top:0px;
  .box-card {
    position: relative;
    //  cursor: pointer;
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

::v-deep .el-tabs__header {
  margin-bottom: 0;
  /* padding: 10px; */
  background: #fff;
}

::v-deep .el-tabs__nav-scroll {
  padding: 10px;
  padding-bottom: 0;
}

.addBox {
  position: absolute;
  right: 0px;
  z-index: 99;
  top: 8px;
  right: 20px;
}

::v-deep .tableContainer {
  overflow: visible
}

.JNPF-common-layout {
  // background-color: #fff
}

::v-deep .JNPF-common-search-box {
  margin-bottom: 5px
}

::v-deep .el-tabs,
::v-deep .el-tabs__content,
::v-deep #pane-PC,
::v-deep #pane-GWZD,
::v-deep #pane-YDD,
::v-deep .PC {
  height: 100%
}

.ccc {
  height: calc(100% - 105px);
  overflow: auto;
}

::v-deep .el-tabs__item {
  padding: 0 10px;
}
.JNPF-common-search-box{
  margin-bottom: 0;
  padding-top:10px
}
.el-button--small{
  padding-top: 7px;
  padding-bottom:7px;
}
.JNPF-common-search-box ::v-deep .el-form-item{
  margin-bottom:0!important
}
</style>