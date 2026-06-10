<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType ? `查看${productName}档案` : title" />
        <div class="options" v-if="!btnType">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            {{ $t('common.submitButton') }}
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <!-- 使用对象结合自定义组件渲染内容 -->
        <el-tabs v-model="activeName">
          <!-- 普通属性 -->
          <template v-for="item in tabs">
            <el-tab-pane :label="item.tabName" :name="item.tabCode" :key="item.tabCode">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" :class="['finish_product', 'semi_finished', 'raw_material', 'accessories'].includes(classAttribute)
                  ? orderInfo
                  : ''
                  ">
                  <JNPF-col v-model="dataForm" :tabContent="item.tabContent" ref="dataForm" :openMode="openMode" />
                </el-collapse-item>
                <el-collapse-item title="其他信息" name="otherInfo"
                  v-if="['finish_product', 'semi_finished', 'raw_material', 'accessories'].includes(classAttribute)">
                  <JNPF-col v-model="dataForm" :tabContent="otherItems" ref="dataForm" :openMode="openMode" />
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="btnType" :detailed="btnType"></UploadWj>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  detailProduct,
  addProduct,
  updateProductData,
  checkCodeExist,
  checkDrawExist
} from '@/api/masterDataManagement/productManage'
import { getByCode } from '@/api/basicData/index'
import { getcategoryTree, getUnitData, detailUnitData } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getbimProductAttributesList, getbimProductsModelList } from '@/api/masterDataManagement/index'
import { getProjectList } from '@/api/system/projectManagement'
import {  getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import tabs from './params'
import { mapGetters } from "vuex"
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
export default {
  props: {
    productName: {
      type: String,
      default: ''
    },
    classAttribute: {
      type: String,
      default: 'raw_material'
    },
    busSetId: {
      type: String,
      default: ''
    }
  },
  mixins: [AbProjectMixin],
  data() {
    return {
      materList: [],
      getbimProductAttributesList, // 产品类别属性列表请求api
      datafilelist: [],
      activeName: 'basicInfo',
      activeNames: ['basicInfo', 'otherInfo'],
      tabs: tabs(),
      tempRules: {}, // 动态判断是否必填项
      btnType: false,
      visible: true,
      btnLoading: false,
      formLoading: false,
      title: '',
      autoCode: undefined,
      autoDrawingNo: undefined,
      tempCodeRules: [],
      tempDrawingNoRules: [],
      dataForm: {
        classAttribute: this.classAttribute
      },
      businessType: '', //  参数设置  自动  还是 手输
      otherItems: [
        {
          prop: 'saleFlag',
          label: '是否可销售',
          value: true,
          type: 'select',
          options: [{ label: '是', value: true }, { label: '否', value: false }],
          clearable: false,
          itemRules: [{ required: true, trigger: 'change' }]
        },
        {
          prop: 'tradeFlag',
          label: '是否贸易件',
          value: false,
          type: 'select',
          options: [{ label: '是', value: true }, { label: '否', value: false }],
          clearable: false,
          itemRules: [{ required: true, trigger: 'change' }]
        }
      ],
      unitRelList: []
    }
  },
   created() {
    this.tabs.forEach((tab, tabInd) => {
      tab.tabContent.forEach((tc) => {
        this.dataForm[tc.prop] = tc.value || '' // 设置默认value
        if (this.classAttribute !== 'semi_finished') {
          if (tc.prop === 'saleFlag' || tc.prop === 'tradeFlag') {
            tc.render = false
          }
        }
         if (this.classAttribute !== 'raw_material') {
          if (tc.prop === 'material' ) {
            tc.render = false
          }
        }
        if (!['finish_product', 'semi_finished', 'raw_material', 'accessories'].includes(this.classAttribute)) {
          console.log(33333);
          if (tc.prop === 'productCategoryName') {
            tc.label = `${this.productName.slice(0, 4)}分类`
            tc.itemRules = [{ required: true, message: `请选择${this.productName.slice(0, 4)}分类`, trigger: 'no' }]
          } else if (tc.prop === 'code') {
            tc.label = `${this.productName.slice(0, 4)}编码`
          } else if (tc.prop === 'name') {
            tc.label = `${this.productName.slice(0, 4)}名称`
          } else if (tc.prop === 'drawingNo') {
            tc.label = `${this.productName.slice(0, 4)}型号`
          } else if (tc.prop === 'productSource') {
            tc.label = `${this.productName.slice(0, 4)}来源`
            tc.options = [{ label: '采购', value: 'purchase' }]
            tc.value = 'purchase'
            tc.itemDisabled = true
          } else if (tc.prop === 'productStatus') {
            tc.label = `${this.productName.slice(0, 4)}状态`
          } else if (tc.prop === 'mainUnit') {
            tc.label = '单位'
          } else if (['deputyUnit', 'ratio', 'calculationDirection', 'brand'].includes(tc.prop)) {
            tc.render = false
          }

        }
        if (['spare_parts', 'accessories'].includes(this.classAttribute)) {

          if (tc.prop === 'productSource') {
            tc.options = [{ label: '采购', value: 'purchase' }]
            tc.value = 'purchase'
          }
        }
        // 添加自定义表单元素方法和参数
        if (tc.type == 'custom') {
          // 产品分类
          if (tc.prop === 'productCategoryName') {
            tc.method = getcategoryTree
            tc.dataFormatting = (res) => res.data[0].childrenList || res.data
            tc.change = (val, data) => {
              // dom更新后重新校验此元素
              this.$nextTick(() => {
                this.$refs['dataForm'][0].$children[0].validateField('productCategoryName')
              })
              if (!val && data.length) return
              if (!data || !data.length) return
              this.dataForm['productCategoryId'] = data[0].id
              this.dataForm['productCategoryName'] = data[0].name
            }
            tc.requestObj = { classAttribute: this.classAttribute }
            tc.dialogTitle = '选择产品分类'
          } else {
            console.warn(tc.prop + '不在判断条件内')
          }
        }
        // 若干需要选择的产品
        if (tc.prop === 'brand'||tc.prop=='material') {
          let data = []
          getbimProductAttributesList({ typeCode: tc.typeCode }).then((res) => {
            data = res.data.records.map((item) => {
              return { label: item.name, value: item.name }
            })
            tc.options = data
          })

          tc.clearable = true
        }
        // 添加校验编码和图号唯一性的规则
        if (tc.prop === 'code') {
          if (!tc.itemRules) {
            tc.itemRules = []
          }
          tc.itemRules.push({
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (this.dataForm.code === this.autoCode) {
                callback()
              } else {
                checkCodeExist({ id: this.dataForm.id, code: this.dataForm.code })
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('此产品编码已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              }
            },
            trigger: 'blur'
          })
        } else if (tc.prop === 'drawingNo') {
          if (!tc.itemRules) {
            tc.itemRules = []
          }
          tc.itemRules.push({
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (this.dataForm.drawingNo === this.autoDrawingNo) {
                callback()
              } else {
                // this.jnpf.specialCodeUrl 对浏览器无法解析的url字符进行手动转码
                checkDrawExist({
                  id: this.dataForm.id || '',
                  drawingNo: this.jnpf.specialCodeUrl(this.dataForm.drawingNo)
                })
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('此型号已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              }
            },
            trigger: 'blur'
          })
          // tc.itemDisabled = true
        }

        if (tc.prop === 'mainUnit' || tc.prop === 'deputyUnit') {
          let obj = {
            pageNum: 1,
            pageSize: -1
          }
          getUnitData(obj).then((res) => {
            tc.options = res.data.records.map((item) => {
              return { label: item.name, value: item.name }
            })
          })

          if (tc.prop === 'mainUnit') {
            tc.change = (val) => {
              this.$nextTick(() => {
                this.$refs.dataForm[0].$refs.main.clearValidate('calculationDirection')
              })
              this.dataForm.ratio = ''
              this.dataForm.calculationDirection = ''
              if (val) {
                if (val == this.dataForm.deputyUnit) {
                  this.dataForm.ratio = 1
                  this.dataForm.calculationDirection = 'multiplication'
                } else {
                  detailUnitData(val).then((res) => {
                    this.unitRelList = res.data.unitRelList
                    this.unitRelList.forEach((it) => {
                      if (it.targetName == this.dataForm.deputyUnit) {
                        this.dataForm.ratio = it.ratio
                        this.dataForm.calculationDirection = it.calculationDirection
                      }
                    })
                  })
                }
              }
            }
          }

          if (tc.prop === 'deputyUnit') {
            tc.change = (val) => {
              this.$nextTick(() => {
                this.$refs.dataForm[0].$refs.main.clearValidate('calculationDirection')
              })
              this.dataForm.ratio = ''
              this.dataForm.calculationDirection = ''
              if (val == this.dataForm.mainUnit) {
                this.dataForm.ratio = 1
                this.dataForm.calculationDirection = 'multiplication'
              } else {
                if (this.unitRelList && this.unitRelList.length !== 0) {
                  this.unitRelList.forEach((item) => {
                    if (item.targetName === val) {
                      this.dataForm.ratio = item.ratio
                      this.dataForm.calculationDirection = item.calculationDirection
                    }
                  })
                }
              }
            }
          }
        }
      })
    })
    this.otherItems.forEach((tc) => {
      if (tc.prop == 'tradeFlag') {
        tc.change = (val, data) => {
          if (!val) {
            this.tabs[0].tabContent.forEach((ele) => {
              if (
                [
                  'sealingCoverStructure',
                  // 'sealingCoverTyping',
                  'structureType',
                  'clearance',
                  'steelBallManufacturer',
                  'oil',
                  // 'oilQuantity',
                  'noise',
                  'holder'
                  // 'vibrationLevel',
                  // 'accuracyLevel',
                  // 'colour',
                  // 'aperture'
                ].includes(ele.prop)
              ) {
                ele.itemRules[0].required = true
              }
              if (ele.prop == 'productSource') {
                ele.options = [
                  { label: '组装', value: 'assemble' },
                  { label: '生产', value: 'produce' },
                  { label: '采购', value: 'purchase' },
                  { label: '外协', value: 'out' }
                ]
              }
            })
          } else {
            this.tabs[0].tabContent.forEach((ele) => {
              if (
                [
                  'sealingCoverStructure',
                  // 'sealingCoverTyping',
                  'structureType',
                  'clearance',
                  'steelBallManufacturer',
                  'oil',
                  // 'oilQuantity',
                  'noise',
                  'holder'
                  // 'vibrationLevel',
                  // 'accuracyLevel',
                  // 'colour',
                  // 'aperture'
                ].includes(ele.prop)
              ) {
                ele.itemRules[0].required = false
              }
              if (ele.prop == 'productSource') {
                ele.options = [{ label: '采购', value: 'purchase' }]
              }
            })
          }
        }
      }
    })
  },
  computed: {
    openMode() {
      return this.title === `新建${this.productName}档案`
        ? '新建'
        : this.title === `编辑${this.productName}档案`
          ? '编辑'
          : '只读'
    },
    ...mapGetters(['userInfo'])
  },
  methods: {

    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        let target = this.tabs[0].tabContent.find((tc) => tc.prop === 'code')
        this.$set(target,'itemDisabled',!this.codeConfig.modifyFlag)
        if (flag) {
          this.dataForm.code = data.number

        }
      } catch (error) { }
    },
   async init(id, btnType = false,row,isProjectSwitch ) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.isProjectSwitch = isProjectSwitch
      console.log(this.btnType,'看')
      this.dataForm.id = id || ''
      if (this.isProjectSwitch === '1') {
        this.tabs[0].tabContent.forEach((ele) => {
          if (ele.prop == 'projectId') {

            ele.render = true
            let obj = {
              pageNum: 1,
              pageSize: -1
            }
            getProjectList(obj).then((res) => {
              ele.options = res.data.records.map((item) => {
                return { label: item.name, value: item.id }
              })
              if (this.dataForm.classAttribute === 'semi_finished') {
                ele.options = ele.options.filter(item => item.value !== '1')
              }
            })
            if (!this.userInfo.projectId) {
              this.dataForm.projectId = this.userInfo.projectId
              ele.itemDisabled = false
            } else {
              if (this.userInfo.projectId === '1') {
                if (this.dataForm.classAttribute !== 'semi_finished') {
                  this.dataForm.projectId = this.userInfo.projectId
                }
                ele.itemDisabled = false
              } else {
                this.dataForm.projectId = this.userInfo.projectId
                ele.itemDisabled = true
              }
            }
          }
        })
      } else {
        this.tabs[0].tabContent.forEach((ele) => {
          if (ele.prop == 'projectId') {
            ele.render = false
          }
        })
      }
      if (!!id) {
        this.title = btnType ? `查看${this.productName}档案` : `编辑${this.productName}档案`
        // 获取详情
        detailProduct(id).then((res) => {
          // 记录编码和图号，用于校验唯一性
          this.autoCode = res.data.code
          this.autoDrawingNo = res.data.drawingNo
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
          // 处理普通属性
          let detailObj = res.data
          for (const key in detailObj) {
            this.dataForm[key] = detailObj[key]
          }
          if (this.btnType) {
            this.tabs[0].tabContent.forEach((tc) => {
              if (
                [
                  'productCategoryName',
                  'code',
                  'drawingNo',
                  'name',
                  'model',
                  'sealingCoverStructure',
                  'structureType',
                  'sealingCoverTyping',
                  'clearance',
                  'steelBallManufacturer',
                  'oil',
                  'noise',
                  'holder',
                  'productSource',
                  'projectId'
                ].includes(tc.prop)
              ) {
                tc.itemDisabled = true
              }
            })
          } else {
            this.fetchData(this.busSetId, false)
             // 编辑时，如果已经型号那些，不允许修改
            this.tabs[0].tabContent.forEach((tc) => {
              if (
                [
                  // 'productCategoryName',
                  'code',
                  'drawingNo',
                  'model',
                  'sealingCoverStructure',
                  'structureType',
                  'sealingCoverTyping',
                  'clearance',
                  'steelBallManufacturer',
                  'oil',
                  'noise',
                  'holder',
                  'productSource',
                  'projectId'
                ].includes(tc.prop)
              ) {
                tc.itemDisabled = true
              }
            })
          }

        })
      } else {
        this.title = `新建${this.productName}档案`
        if (row) {
          console.log(row,'订单')
          // 获取详情
        detailProduct(row.id).then((res) => {
          // 记录编码和图号，用于校验唯一性

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
          // 处理普通属性
          let detailObj = res.data
          for (const key in detailObj) {
            this.dataForm[key] = detailObj[key]
          }
          this.dataForm.id = ''
          this.dataForm.code = ''
          this.dataForm.drawingNo = ''
        })
        }
        this.fetchData(this.busSetId, true)
      }
      this.formLoading = false
    },
    async handleConfirm() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断

      // 校验tabs渲染表单
      for (let i = 0; i < this.$refs['dataForm'].length; i++) {
        const item = this.$refs['dataForm'][i]
        const form = item.$refs.main
        const valid_1 = await form.validate().catch(() => false)
        if (!valid_1 && submitFlag) {
          submitFlag = false
          this.activeName = this.tabs[i].tabCode
          this.jnpf.focusErrValidItem(form.fields)
        }
      }
      if (!['finish_product', 'semi_finished', 'raw_material', 'accessories'].includes(this.classAttribute)) {

        this.dataForm.mainUnit = this.dataForm.mainUnit
        this.dataForm.deputyUnit = this.dataForm.mainUnit
        this.dataForm.ratio = 1
        this.dataForm.calculationDirection = 'multiplication'
        this.dataForm.saleFlag = true
        this.dataForm.tradeFlag = false
      }

      // 判断条件后发送请求
      if (submitFlag) {
        this.dataForm.documentStatus = 'submit'
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: '',
              configKey: '',
              categoryId: this.categoryId,
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        this.dataForm.attachmentList = this.datafilelist

        const formMethod = this.dataForm.id ? updateProductData : addProduct
        formMethod(this.dataForm)
          .then((res) => {
            let msg = res.msg
            if (res.msg === 'Success') {
              msg = formMethod == addProduct ? '新建成功' : '修改成功'
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
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
      } else {
        this.btnLoading = false
      }
    },
    goBack() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 0px 30px 10px;
// }

::v-deep .el-tabs__header {
  padding: 0 !important;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
}

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
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
