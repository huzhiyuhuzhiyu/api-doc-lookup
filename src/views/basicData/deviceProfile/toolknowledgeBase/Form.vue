<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btnType=='look' ? '查看工具维修知识库' : btnType=='add'?'新建工具维修知识库':'编辑工具维修知识库'" />
        <div class="options">
          <el-button type="primary" v-if="btnType!='look'" :loading="btnLoading" @click="handleConfirm()">
            提交
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                <el-collapse-item title="工具故障信息" name="basicInfo">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="工具名称" prop="equipmentId">
                        <el-input v-model="dataForm.equipmentIdName" placeholder="请选择工具名称" :disabled="btnType=='look'" readonly @focus="openSeleceProductDialogss">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="故障类型名称" prop="faultTypeId">
                        <el-input v-model="dataForm.faultTypeName" placeholder="请选择故障类型名称" :disabled="btnType=='look'" @focus="openSeleceProductDialog" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="故障部位名称" prop="faultLocationId">
                        <el-input v-model="dataForm.faultLocationName" placeholder="请选择故障部位名称" :disabled="btnType=='look'" @focus="openSeleceProductDialogs" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="故障描述" prop="faultDescription">
                        <el-input v-model="dataForm.faultDescription" placeholder="请输入故障描述" :disabled="btnType=='look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="故障情况照片" prop="frontPicList">
                        <UploadImg v-model="dataForm.frontPicList" :disabled="btnType == 'look'"></UploadImg>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
                <el-collapse-item title="维修信息" name="wxxx">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="解决措施" prop="solutionMeasures">
                        <el-input v-model="dataForm.solutionMeasures" placeholder="请输入解决措施" :disabled="btnType=='look'" type="textarea" :rows="2" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="维修完成照片" prop="afterPicList">
                        <UploadImg v-model="dataForm.afterPicList" :disabled="btnType == 'look'"></UploadImg>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-form>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'">
            </UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-pages" @change="submitfaultLocationName" :tableItems="faultLocationNameItems" title="故障部位" placeholder="请选择故障部位名称" :renderTree="false" :listMethod="parametersShelveslist" :paramsObj="{ index }" :listRequestObj="faultLocationNameRequestObj" :searchList="ProductfaultLocationName" :elementShow="false" />
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="故障类型" placeholder="请选择故障类型名称" :renderTree="false" :listMethod="parametersShelveslist" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" />
      <ComSelect-page ref="ComSelect-pagesb" @change="changeWarehouse" :tableItems="ProductTableItemss" title="选择工具" treeTitle="工具分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'tool' } }" :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObjs" :searchList="ProductTableSearchLists" :elementShow="false" />
    </div>
  </transition>
</template>
<script>
import UploadImg from "@/components/Generator/components/Upload/UploadImg.vue";
import { addequEquipmentRepairKnowledge, updateequEquipmentRepairKnowledge, detailequEquipmentRepairKnowledge } from '@/api/dailyManagement/Maintenance'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getEquEquipmentList, parametersShelveslist } from '@/api/basicData/index'
export default {
  components: { UploadImg },
  data() {
    return {
      formLoading: false,
      btnLoading: false,
      ProductTableSearchLists: [
        { prop: "code", label: "工具编码", type: 'input' },
        { prop: "name", label: "工具名称", type: 'input' },
      ],
      ProductListRequestObjs: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "create_time"
          }
        ],
        code: "",
        name: "",
        state: 'normal',
        deviceType: 'normal',
        classAttribute: "tool",
      },
      getEquEquipmentList,
      getcategoryTree,
      ProductTableItemss: [
        { prop: 'code', label: '工具编码', fixed: 'left' },
        { prop: 'name', label: '工具名称', fixed: 'left' },
        { prop: 'categoryName', label: '工具分类' },
        { prop: 'specModel', label: '工具规格' },
      ],
      ProductListRequestObj: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "createTime"
          }
        ],
        code: "",
        name: "",
        typeCode: "faultType"
      },
      ProductfaultLocationName: [
        { prop: "code", label: "故障部位编码", type: 'input' },
        { prop: "name", label: "故障部位名称", type: 'input' },
      ],
      faultLocationNameRequestObj: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "createTime"
          }
        ],
        code: "",
        name: "",
        typeCode: "faultLocation"
      },
      parametersShelveslist,
      ProductTableSearchList: [
        { prop: "code", label: "故障类型编码", type: 'input' },
        { prop: "name", label: "故障类型名称", type: 'input' },
      ],
      ProductTableItems: [
        { prop: 'code', label: '故障类型编码', fixed: 'left' },
        { prop: 'name', label: '故障类型名称', fixed: 'left' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'createByName', label: '创建人' },
      ],
      ProductfaultLocationName: [
        { prop: "code", label: "故障部位编码", type: 'input' },
        { prop: "name", label: "故障部位名称", type: 'input' },
      ],
      faultLocationNameItems: [
        { prop: 'code', label: '故障部位编码', fixed: 'left' },
        { prop: 'name', label: '故障部位名称', fixed: 'left' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'createByName', label: '创建人' },
      ],
      activeNames: ["basicInfo", "wxxx"],
      activeName: "orderInfo",
      datafilelist: [],
      dataForm: {
        classAttribute: "tool",
        equipmentIdName: '',
        equipmentId: '',
        faultTypeName: '',
        faultTypeId: '',
        faultLocationId: '',
        faultLocationName: '',
        faultDescription: '',
        solutionMeasures: '',
        frontPicList: [],
        afterPicList: []
      },
      dataFormTwo: {
        productData: []
      },
      selectRows: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      dataRule: {
        equipmentId: [
          { required: true, message: '工具不能为空', trigger: 'blur' }
        ],
        faultTypeId: [
          { required: true, message: '故障类型名称不能为空', trigger: 'blur' }
        ],
        faultLocationId: [
          { required: true, message: '故障部位名称不能为空', trigger: 'blur' }
        ],
        faultDescription: [
          { required: true, message: '故障描述不能为空', trigger: 'blur' }
        ],
        solutionMeasures: [
          { required: true, message: '解决措施不能为空', trigger: 'blur' }
        ],
      },
      tipsvisible: false
    }
  },
  methods: {
    init(id, type) {
      this.dataForm.id = id || ''
      this.btnType = type
      if (id) {
        this.formLoading = true
        detailequEquipmentRepairKnowledge(id).then(res => {
          if (res.data.afterPic) res.data.afterPicList = res.data.afterPicList.map(item => {
            return JSON.parse(`{${item}}`)
          })
          if (res.data.frontPic) res.data.frontPicList = res.data.frontPicList.map(item => {
            return JSON.parse(`{${item}}`)
          })
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push({
                name: item.document.fullName,
                fileSize: item.document.fileSize,
                filename: item.document.filePath,
                id: item.document.id,
                url: item.url
              })
            })
          }
          this.dataForm = res.data
          this.formLoading = false
        })
      }
    },
    //选择工具
    changeWarehouse(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('equipmentId') })
      if (!val && !data.length) return
      if (data && data.length) {
        this.dataForm.equipmentId = data[0].id
        this.dataForm.equipmentIdName = data[0].name
      } else {
        this.dataForm.equipmentId = ''
        this.dataForm.equipmentIdName = ''
      }
    },
    //故障部位选择
    submitfaultLocationName(selectedIds, selectedList) {
      this.dataForm.faultLocationId = selectedList[0].all.id
      this.dataForm.faultLocationName = selectedList[0].all.name
      this.$nextTick(() => { this.$refs['dataForm'].validateField('faultLocationId') })
    },
    //故障类型选择
    submitCustomerProduct(selectedIds, selectedList) {
      this.dataForm.faultTypeId = selectedList[0].all.id
      this.dataForm.faultTypeName = selectedList[0].all.name
      this.$nextTick(() => { this.$refs['dataForm'].validateField('faultTypeId') })

    },
    // 打开故障部位
    openSeleceProductDialogs() {
      this.$refs['ComSelect-pages'].openDialog()
    },
    // 打开故障类型
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    openSeleceProductDialogss() {
      this.$refs['ComSelect-pagesb'].openDialog()
    },
    goBack() {
      this.$emit('close')
    },
    async handleConfirm() {
      let submitFlag = true
      const form_1 = this.$refs.dataForm
      const valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        let formItems = form_1.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }
      if (submitFlag) {
        this.dataForm.frontPicList = Array.isArray(this.dataForm.frontPicList) ?
          this.dataForm.frontPicList.map(item => {
            return JSON.stringify(item)
              .replace("{", "")
              .replace("}", "")
          }) : []
        this.dataForm.afterPicList = Array.isArray(this.dataForm.afterPicList) ?
          this.dataForm.afterPicList.map(item => {
            return JSON.stringify(item)
              .replace("{", "")
              .replace("}", "")
          }) : []
        let obj = {
          attachmentList: this.datafilelist,
          ...this.dataForm
        }
        this.btnLoading = true;
        const formMethod = this.dataForm.id ? updateequEquipmentRepairKnowledge : addequEquipmentRepairKnowledge
        formMethod(obj).then(res => {
          this.$message({
            message: '新建成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 9px 10px;
}
</style>
<style scoped lang="scss">
::v-deep .data-form {
  margin-bottom: 18px;
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}

.el-table__footer {
  display: none;
}

::v-deep.has-gutter {
  display: none;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
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

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important;
}

.options {
  display: inline-block;
  float: right;
}

.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}
</style>