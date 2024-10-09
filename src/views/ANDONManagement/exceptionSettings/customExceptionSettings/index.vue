<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-common-layout">
      <div class="JNPF-preview-main org-form" ref="main">
        <div :class="['JNPF-common-page-header', 'noButtons']">
          <div style="font-size: 20px;">自定义异常</div>
        </div>
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" style="padding: 10px 5px;">
              <el-tabs @tab-click="changeTab" v-model="activeName" type="border-card" tab-position="left"
                style="height:100%;padding:5px;font-size: 20px;">
                <el-tab-pane disabled label="异常类型:">
                  <span slot="label">
                    异常类型
                    <el-dropdown style="margin-left: 5px;">
                      <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleTypeManage()">类型管理</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown></span>
                </el-tab-pane>
                <el-tab-pane :label="item.name" :name="item.code" v-for="item in list" :key="item.id">
                  <div
                    style="height:60px;line-height:60px;font-weight:bold;border-bottom:1px solid #dcdfe6;font-size: 20px;">
                    异常内容：
                  </div>
                  <div class="card-list" v-loading="listLoading">
                    <div v-for="line in dataDetail" :key="line.id" @click="handleCard(line)">
                      <el-card :shadow="line.code === currentCard ? 'always' : 'hover'" class="box-card">
                        <div> {{ line.name }} </div>
                        <div>
                          <el-button size="mini" type="text" @click="addOrUpdateHandle(line.id, 'edit')">编辑</el-button>
                          <el-button size="mini" type="text" @click="flowSet(line.id, line.name)">流程设置</el-button>
                        </div>

                        <!-- <div class="icon-checked" v-if="line.code === currentCard">
                          <i class="el-icon-check"></i>
                        </div> -->
                        <div class="template-item__delete-btn" @click="handleDel(line.id)">
                          <div class="icon-delete"></div>
                        </div>
                      </el-card>
                    </div>
                    <!-- <div> -->
                    <el-card class="box-card box-card-add"
                      style="display:flex;justify-content: center;align-items: center;font-size:22px"
                      @click.native="addOrUpdateHandle('', 'add')">
                      <span class="el-icon-plus"></span>
                    </el-card>
                    <!-- </div> -->
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>

        <TypeIndex v-if="drawer" ref="TypeList" @refreshDataList="initData" />
        <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="initData" :category="'content'" :parentId="parentId" />
        <FlowForm v-if="flowFormVisible" ref="FlowForm" @close="initData" />
      </div>
    </div>
  </transition>
</template>

<script>
import { getAbnoramlTypeData, detailAbnoramlTypeData, addAbnoramlData, deleteAbnoramlTypeData } from '@/api/abnormalManagement/index.js'
import TypeIndex from './TypeIndex.vue'
import JNPFForm from './Form'
import FlowForm from './FlowForm'
export default {
  name: 'customExceptionSettings',
  components: { TypeIndex, JNPFForm, FlowForm },
  data() {
    return {
      flowFormVisible: false,
      formVisible: false,
      drawer: false,
      btnLoading: false,
      listLoading: false,
      activeName: '',
      list: [],
      dataDetail: [],
      total: 0,
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: -1,
        category: "type",
        code: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        name: "",
        parentId: '',
        startTime: "",
        startUpdateTime: "",
        superQuery: {},
        totalRowFlag: false,
      },
      tabCode: '',
      currentCard: '',
      parentId: ''
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    // 新增数据
    addOrUpdateHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, btnType)
      })
    },
    flowSet(id, name) {
      this.flowFormVisible = true
      this.$nextTick(() => {
        this.$refs.FlowForm.init(id, name)
      })
    },
    handleCard(item) {
      this.currentCard = item.code
      // if (this.parentId === item.id) return
      // this.dataForm.abnormalContentId = item.id
      // this.dataForm.abnormalContent = item.name
    },
    changeTab(pane) {
      this.tabCode = pane.name
      let current = this.list.find(item => item.code === this.tabCode)
      this.parentId = current.id
      if (!this.parentId) return
      this.listLoading = true
      detailAbnoramlTypeData(current.id).then((res) => {
        this.dataDetail = res.data.contentList || []
        this.listLoading = false
      }).catch(() => this.listLoading = false)
    },
    initData() {
      this.formVisible = false
      this.flowFormVisible = false
      this.dataDetail = []
      getAbnoramlTypeData(this.listQuery).then((res) => {
        this.list = res.data.records || []
        this.total = res.data.total
        if (this.list.length !== 0) {
          this.parentId = this.list[0].id
          detailAbnoramlTypeData(this.list[0].id).then((res) => {
            this.dataDetail = res.data.contentList || []
            this.activeName = this.list[0].code
          })
        }
      })
    },
    // 分类管理
    handleTypeManage() {
      this.drawer = true
      this.$nextTick(() => {
        this.$refs.TypeList.init()
      })
    },
    // 删除数据
    handleDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteAbnoramlTypeData(id).then((res) => {
          if (res.msg === 'Success') res.msg = '删除成功'
          this.initData()
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
      }).catch(() => { })
    },
  },
}
</script>

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

::v-deep .el-tabs--left.el-tabs--border-card {
  .el-tabs__header.is-left {
    border: 1px solid #DCDFE6;
  }

  .el-tabs__item.is-left {
    border: 1px solid #DCDFE6;
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-size: 20px;

    &.is-active {
      border-color: #d1dbe5;
      background-color: #3fb9f8;
      color: #fff;
    }

    &.is-disabled {
      color: #000;
      font-weight: bold;
      font-size: 20px;
    }
  }

  .el-tabs__content {
    padding: 0px;
  }
}

.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}</style>