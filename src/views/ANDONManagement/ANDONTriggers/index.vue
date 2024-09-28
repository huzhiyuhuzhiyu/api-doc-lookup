<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form" ref="main">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <div style="font-size: 20px;">异常上报</div>
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
        </div>
      </div>
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-common-layout-main JNPF-flex-main" style="padding: 10px 5px;">
            <el-tabs @tab-click="changeTab" v-model="activeName" type="border-card" tab-position="left"
              style="height:100%;padding:5px;font-size: 20px;">
              <el-tab-pane disabled label="异常类型:"></el-tab-pane>
              <el-tab-pane :label="item.name" :name="item.code" v-for="item in list" :key="item.id">
                <div
                  style="height:60px;line-height:60px;font-weight:bold;border-bottom:1px solid #dcdfe6;font-size: 20px;">
                  异常内容：
                </div>
                <div class="card-list" v-loading="listLoading">
                  <div v-for="line in dataDetail" :key="line.id" @click="handleCard(line)"
                    @mousemove.native="showRemark(line)">
                    <el-tooltip class="item" effect="light" :content="line.remark" placement="bottom" :disabled="!line.remark">
                      <el-card :shadow="line.code === currentCard ? 'always' : 'hover'" class="box-card"
                        :class="line.code === currentCard ? 'box-card-active' : ''">
                        <div> {{ line.name }} </div>
                        <div class="icon-checked" v-if="line.code === currentCard">
                          <i class="el-icon-check"></i>
                        </div>
                      </el-card>
                    </el-tooltip>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <el-dialog title="单号" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
        <el-row :gutter="20">
          <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="120px" label-position="left">
            <el-col :span="16">
              <el-form-item label="申请单号：" prop="orderNo">
                <el-input v-model="dataForm.orderNo" placeholder="请输入申请单号"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="handleSubmit()">
            确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            提交成功啦！</span><span class="import_b">您还可以进行如下操作：</span></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回首页</el-button>
          <el-button type="primary" @click="continueAdd()">继续上报</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import { getAbnoramlTypeData, detailAbnoramlTypeData, addAbnoramlData } from '@/api/abnormalManagement/index.js'
import { getBusinessFlowInfo } from '@/api/workFlow/FlowEngine'
export default {
  data() {
    return {
      tipsvisible: false,
      btnLoading: false,
      visible: false,
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
      dataForm: {
        abnormalContentId: '',
        abnormalDescription: '',
        abnormalTypeId: '',
        equipmentId: '',
        id: '',
        orderNo: '',
        personId: '',
        processDate: '',
        processDescription: '',
        processStatus: 'processing',
        productionOrderId: '',
        abnormalType: '',
        abnormalContent: '',
        type: 'custom',
        flowData: {},
        module: ''
      },
      dataRule: {
        orderNo: [{ required: true, message: '请输入申请单号', trigger: 'blur' }]
      },
      codeConfig: {}
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
    this.fetchData('ABARDH', true)
  },
  methods: {
    getBusInfo(id) {
      getBusinessFlowInfo(id).then(res => {
        if (res.data) {
          this.dataForm.flowData = res.data
        }
        this.formLoading = false
      }).catch(() => { })
    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.orderNo = data.number
          this.setDataFormItems()
        }
      } catch (error) {
      }
    },
    handleCard(item) {
      this.currentCard = item.code
      if (this.dataForm.abnormalContentId === item.id) return
      this.dataForm.abnormalContentId = item.id
      this.dataForm.abnormalContent = item.name

      this.getBusInfo(this.dataForm.abnormalContentId)
    },
    changeTab(pane) {
      this.tabCode = pane.name
      let current = this.list.find(item => item.code === this.tabCode)
      this.dataForm.abnormalTypeId = current.id || ''
      this.dataForm.abnormalType = current.name || ''
      this.dataForm.module = current.module
      if (!this.dataForm.abnormalTypeId) return
      this.listLoading = true
      detailAbnoramlTypeData(current.id).then((res) => {
        this.dataDetail = res.data.contentList || []
        this.listLoading = false
      }).catch(() => this.listLoading = false)
    },
    initData() {
      this.dataDetail = []
      getAbnoramlTypeData(this.listQuery).then((res) => {
        this.list = res.data.records || []
        this.total = res.data.total
        if (this.list.length !== 0) {
          this.dataForm.abnormalTypeId = this.list[0].id
          this.dataForm.abnormalType = this.list[0].name
          this.dataForm.module = this.list[0].module
          detailAbnoramlTypeData(this.list[0].id).then((res) => {
            this.dataDetail = res.data.contentList || []
            this.activeName = this.list[0].code
          })
        }
      })
    },
    goBack() {
      this.$router.push('/ANDONManagement/homePage')
    },
    // 继续新增
    continueAdd() {
      this.initData()
      this.btnLoading = false
      this.tipsvisible = false
    },
    handleSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.visible = false
          this.handleConfirm()
        }
      })
    },
    handleConfirm() {
      this.btnLoading = true
      if (this.codeConfig.codeWay !== 'auto') {
        this.visible = true
      } else {
        let flowObj = JSON.parse(JSON.stringify(this.dataForm.flowData))
        const flowList = Object.getOwnPropertyNames(flowObj)
        if (!flowList.length) {
          this.btnLoading = false
          return this.$message.error('请检查所选异常是否设置模版！')
        }
        if (!this.dataForm.abnormalContentId && !this.dataForm.abnormalTypeId) {
          this.btnLoading = false
          return this.$message.error('请先选择需要上报的异常！')
        }
        addAbnoramlData(this.dataForm).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '提交成功'
          // })
          this.tipsvisible = true
          // this.initData()
          this.fetchData('ABARDH', true)
          this.btnLoading = false
          this.visible = false
        }).catch(() => { this.btnLoading = false })

      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card-list {
  display: flex;
  flex-wrap: wrap;

  .box-card {
    width: 210px;
    margin: 5px 8px 0 0;
    position: relative;
    font-size: 18px;

    .icon-checked {
      display: block;
      width: 12px;
      height: 12px;
      border: 12px solid #409eff;
      border-left: 12px solid transparent;
      border-top: 12px solid transparent;
      border-bottom-right-radius: 4px;
      position: absolute;
      right: -1px;
      bottom: -1px;

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
</style>