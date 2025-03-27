<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <el-page-header @back="goBack" :content="dialogTitle + `产量与耗料`" />
          <div class="options" v-if="type != 'look'">
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main" ref="main" v-loading="responseLoading">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="产品信息" name="processInfo">
              <el-col :span="24">
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form"
                  :rules="productRules">
                <JNPF-table hasNO style="border: 1px solid #e3e7ee;" ref="processRef"
                  @selection-change="handeleProductInfoData" :data="dataFormTwo.data" size="mini" id="table" row-key="code"
                  :height="customStyleData">
                  <el-table-column prop="projectName" label="所属项目" width="120"
                    v-if="abProjectSwitchVisible"></el-table-column>
                  <el-table-column prop="productName" label="产品名称" width="180" show-overflow-tooltip>
                    <template slot="header">
                      <span class="required">*</span>
                      产品名称
                    </template>
                    <template slot-scope="scope">
                      {{ scope.row.productName }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="productCode" label="产品编码" min-width="140" />
                  <el-table-column prop="drawingNo" label="品名规格" min-width="140" />
                  <el-table-column prop="productCategoryName" label="产品分类" min-width="140" />
                  <el-table-column prop="unit" label="单位" min-width="140" />
                  <el-table-column prop="consumeQuantity" label="耗料数量" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item >
                        <el-input v-model="scope.row.consumeQuantity" :disabled="type === 'look' ? true : scope.row.consumeFlag"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="output" label="产量" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item >
                        <el-input v-model="scope.row.output" :disabled="type === 'look' ? true : scope.row.outFlag"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </JNPF-table>
                </el-form>
              </el-col>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { getCooperativeData, getBimBusinessDetail } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getBimProcessList, getBimProcessDetail } from '@/api/bimProcess/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
import { detailProductionLineOutput, confirmProductionLineOutputData } from '@/api/productOrdes/index.js'
export default {
  components: {},
  mixins: [AbProjectMixin],
  props: [],
  data() {
    return {
      projectIdData: [],
      responseLoading:false,
      activeName: 'jcInfo',
      activeNames: ['modelInfo', 'processInfo'],
      datafilelist: [],
      getBimProcessList,
      options: [
        {
          value: true,
          label: '是'
        },
        {
          value: false,
          label: '否'
        }
      ],



      getCooperativeData,
      activeName: 'jcInfo',
      dialogTitle: '',
      visible: false,
      processVisibled: false,
      sourceVisibled: false,
      loading: false,
      btnLoading: false,
      organizeIdTree: [],
      index: null,
      needDisabled: false,
      dataForm: {
        id: '',
      },
      type: '',
      dataFormTwo: {
        data:[]
      },
      codeConfig: {},
      productRules: {
        consumeQuantity: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  console.log(index)
                  if (this.dataFormTwo.data[index].consumeFlag) {
                  } else {
                    this.$message.error(`产品信息第${index + 1}行：耗料数量${errMsg}`)
                  }
                }
              ]
            }),
            trigger: ['blur']
          },
        ],
        output: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index,arr) => {
                  console.log(index)
                  if (this.dataFormTwo.data[index].outputFlag) {
                  } else {
                    this.$message.error(`产品信息第${index + 1}行：产量${errMsg}`)
                  }
                }
              ]
            }),
            trigger: ['blur']
          },
        ],
      },
      
      customStyleData: null,
    }
  },
  mounted() {
    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.processRef) return
      this.$nextTick(() => {
        this.$refs.processRef.doLayout()
      })
    }
    window.addEventListener('resize', this.clientResize)
  },
  async created() {
      this.responseLoading = true
      // await this.switchStyleheight()
      this.responseLoading = false
  },
  methods: {
    switchStyleheight() {
      console.log(123)
      const mainRegion1 = this.$refs.main // 表单页面区域
      console.log(mainRegion1,'看看')
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight
      if (this.type === 'look') {
        maxHeight = mainHeight1 
      } else {
        maxHeight = mainHeight1 - 380
      }
      console.log(maxHeight, 'maxHeight')
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },
    handleNodeClick(value) { },

    handeleProductInfoData(val) {
      this.processArr = val
    },
    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type, approvalFlag) {
      // rowData = JSON.parse(rowData)
    
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      console.log(this.dataForm.id, 'pooo')
      this.visible = true
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '确定' : `查看`
      this.type = type
      this.$nextTick(() => {
        if (!this.dataForm.id) {
          this.clearData()

        } else {
          this.loading = true
          // 获取当前项详情
          detailProductionLineOutput(this.dataForm.id).then((res) => {
            this.dataFormTwo.data = res.data
            this.loading = false
          })
        }
      })
    },
    // 表单提交
    handleSubmit(type) {
      this.request(type)
    },

    request(type) {
      this.btnLoading = true
      let submitFlag = true
 
      console.log(this.$refs['productForm'], 'kkkk')
      let APItem = this.abProjectList.find(item => item.code === "AP");
      console.log(APItem)
      this.dataFormTwo.data.forEach((item,index)=>{
          if (!item.consumeFlag && !item.consumeQuantity) {
            submitFlag = false
            this.btnLoading = false
            this.$message({
              message: '请输入第' + (index + 1) + '行产品的收货数量',
              type: 'error',
              duration: 1500
            })
            return
          }
          if (!item.outputFlag && !item.output) {
            submitFlag = false
            this.btnLoading = false
            this.$message({
              message: '请输入第' + (index + 1) + '行产品的产量',
              type: 'error',
              duration: 1500
            })
            return
          }
        })
      this.btnLoading = false


      this.dataForm.documentStatus = type
      let _data = {
        projectId:this.abProjectId,
        list:this.dataFormTwo.data
      }

      let msgs = ''
      if (type === 'draft') {
        msgs = '保存成功'
      } else {
        msgs = '提交成功'
      }
      if (submitFlag) {
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.length === 0) {
              this.$message.error('请至少选择一条数据')
              this.btnLoading = false
            } else {

              confirmProductionLineOutputData(_data)
                .then((res) => {
                  if (res.msg === 'Success') res.msg = '修改成功'
                  this.$message({
                    message: msgs,
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.visible = false
                      this.btnLoading = false
                      this.$emit('close', true)
                    }
                  })
                })
                .catch(() => {
                  this.btnLoading = false
                })

            }
          } else {
            this.dataForm.documentStatus = ''
            this.btnLoading = false
          }
        })
      }
    },
  }
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.main {
  padding: 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
}

/* ::v-deep .el-table__body-wrapper.is-scrolling-left {
  height: auto !important;
} */

::v-deep .JNPF-preview-main .el-table--mini td {
  padding: 8px 0 !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}
</style>
<style lang="scss" scoped>
// .main {
//   padding: 0px 20px;
// }

.el-button--small {
  padding: 1;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  // padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}

.JNPF-preview-main .main {
  padding-top: 5px;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep #sleeve .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  // margin-bottom: 10px;
  border-bottom: none !important;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
</style>
