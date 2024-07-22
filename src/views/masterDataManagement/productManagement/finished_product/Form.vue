<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType ? '查看成品' : title" />
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
          <el-tab-pane v-for="item in tabs" :key="item.tabCode" :label="item.tabName" :name="item.tabCode">
            <JNPF-col v-model="dataForm" :tabContent="item.tabContent" ref="dataForm" :openMode="openMode" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  detailProduct,
  cpAddProduct,
  updateProductData,
  checkCodeExist,
  checkModelExist
} from '@/api/masterDataManagement/productManage'
import { getCooperativeData, getcategoryTree as getcategoryCoop, getByCode } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getbimProductAttributesList, getbimProductsModelList } from '@/api/masterDataManagement/index'

import tabs from './params'
export default {
  data() {
    return {
      datafilelist: [],
      activeName: 'basicInfo',
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
        classAttribute: 'finish_product'
      },
      modelQuery: {
        startTime: '',
        endTime: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        model: ''
      },
      getbimProductAttributesList, // 产品类别属性列表请求api
      getbimProductsModelList, // 型号管理属性列表
      getCooperativeData, // 供应商列表
      getcategoryCoop, // 供应商分类
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      },
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryCoop, requestObj: { type: 'supplier' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '钢球厂家编码', fixed: 'left' },
        { prop: 'name', label: '钢球厂家名称', fixed: 'left' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '钢球厂家编码', type: 'input' },
        { prop: 'name', label: '钢球厂家名称', type: 'input' }
      ],
      businessType: '' //  参数设置  自动  还是 手输
    }
  },
  created() {
    this.tabs.forEach((tab, tabInd) => {
      tab.tabContent.forEach((tc) => {
        this.dataForm[tc.prop] = tc.value || '' // 设置默认value
        // 添加自定义表单元素方法和参数
        if (tc.type == 'custom') {
          // 产品分类
          if (tc.prop === 'productCategoryName') {
            tc.method = getcategoryTree
            tc.requestObj = {
              classAttribute: 'material',
              code: 'finishedProduct'
            }
            getcategoryTree(tc.requestObj).then((res) => {
              if (res.data && !res.data[0].childrenList.length) {
                this.$nextTick(() => {
                  this.$refs['dataForm'][0].$children[0].validateField('productCategoryName')
                })
                this.dataForm['productCategoryId'] = res.data[0].id
                this.dataForm['productCategoryName'] = res.data[0].name
              } else {
                this.dataForm['productCategoryId'] = ''
                this.dataForm['productCategoryName'] = ''
                tc.dataFormatting = (res) => res.data[0].childrenList
              }
            })
            tc.change = (val, data) => {
              console.log('data', data)
              // dom更新后重新校验此元素
              this.$nextTick(() => {
                this.$refs['dataForm'][0].$children[0].validateField('productCategoryName')
              })
              if (!val && data.length) return
              if (!data || !data.length) return
              this.dataForm['productCategoryId'] = data[0].id
              this.dataForm['productCategoryName'] = data[0].name
            }
            tc.dialogTitle = '选择产品分类'
          }
          //  选择型号 会带出 一部分信息
          else if (tc.prop === 'model') {
            tc.dialogTitle = '选择' + tc.label
            // 选择型号的api
            tc.method = getbimProductsModelList
            tc.requestObj = this.modelQuery
            tc.dataFormatting = (res) => {
              let data = res.data.records.map((item) => {
                return {
                  ...item,
                  name: item.model
                }
              })
              return data
            }
            tc.clearable = true
            tc.change = this.modelChange
            tc.paramsObj = { prop: tc.prop, tabInd }
          }
          // 若干需要选择的产品
          else if (
            tc.prop === 'brandName' || // 品牌
            tc.prop === 'sealingCoverStructureName' ||
            tc.prop === 'sealingCoverTypingName' ||
            tc.prop === 'structureTypeName' || // 结构型
            tc.prop === 'clearanceName' ||
            // || tc.prop === "steelBallManufacturer" // 钢球家
            tc.prop === 'oilName' || //
            tc.prop === 'oilQuantityName' || // 油脂量
            tc.prop === 'noiseName' || // 噪音
            tc.prop === 'holderName' || // 保持架
            tc.prop === 'vibrationLevelName' || // 振动等级
            tc.prop === 'accuracyLevelName' || // 精度等级
            tc.prop === 'colourName' || // 颜色
            tc.prop === 'apertureName' // 孔径
          ) {
            tc.dialogTitle = '选择' + tc.label
            tc.method = getbimProductAttributesList
            tc.requestObj = { typeCode: tc.typeCode }
            tc.clearable = true
            tc.change = this.ProductChange
            tc.paramsObj = { prop: tc.prop, tabInd }
          } else if (tc.prop === 'steelBallManufacturer') {
            tc.dialogTitle = '选择' + tc.label
            tc.treeTitle = '钢球厂家分类'
            // 选择钢球厂家的api
            tc.methodArr = this.PartnerMethodArr
            tc.listMethod = getCooperativeData
            tc.listRequestObj = this.PartnerListRequestObj
            tc.tableItems = this.PartnerTableItems
            tc.searchList = this.PartnerTableSearchList
            tc.clearable = true
            tc.change = this.steelBallChange
            tc.paramsObj = { prop: tc.prop, tabInd }
          } else {
            console.warn(tc.prop + '不在判断条件内')
          }
        }

        // 添加校验编码和图号唯一性的规则
        if (tc.prop === 'code') {
          if (this.businessType === '1') {
            tc.render = false
          } else {
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
                  checkCodeExist({ id: this.dataForm.id || '', code: this.dataForm.code })
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
          }
        } else if (tc.prop === 'model') {
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
                checkModelExist({ id: this.dataForm.id || '', model: this.dataForm.model })
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
        }
      })
    })
  },
  computed: {
    openMode() {
      return this.title === '新建成品档案' ? '新建' : this.title === '编辑成品档案' ? '编辑' : '只读'
    }
  },
  methods: {
    // 选择型号 带出 密封盖 结构 打字 结构类型 游隙 钢球厂家 油脂 噪音 保持架
    modelChange(val, data, paramsObj) {
      this.$nextTick(() => {
        this.$refs['dataForm'][paramsObj.tabInd].$children[0].validateField(paramsObj.prop)
      })
      if (data && data.length) {
        // 数据有效，进行更新
        this.dataForm[paramsObj.prop] = data[0].all.model
      } else {
        // 不选择任何内容，置空绑定的值
        this.dataForm[paramsObj.prop] = ''
      }
    },
    ProductChange(val, data, paramsObj) {
      console.log(paramsObj, 'oooo')
      this.$nextTick(() => {
        this.$refs['dataForm'][paramsObj.tabInd].$children[0].validateField(paramsObj.prop)
      })
      if (data && data.length) {
        // 数据有效，进行更新
        console.log(data, 'lkkk')
        this.dataForm[paramsObj.prop] = data[0].all.name
        this.dataForm[paramsObj.prop.slice(0, -4)] = data[0].all.code
      } else {
        // 不选择任何内容，置空绑定的值
        this.dataForm[paramsObj.prop] = ''
      }
      console.log(this.dataForm, 'form')
    },
    // 钢球厂家
    steelBallChange(val, data, paramsObj) {
      this.$nextTick(() => {
        this.$refs['dataForm'][paramsObj.tabInd].$children[0].validateField(paramsObj.prop)
      })
      if (data && data.length) {
        // 数据有效，进行更新
        this.dataForm[paramsObj.prop] = data[0].all.code
      } else {
        // 不选择任何内容，置空绑定的值
        this.dataForm[paramsObj.prop] = ''
      }
    },
    init(id, btnType = false) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      getByCode('bm_cp_cp').then((res) => {
        this.businessType = res.data.codeWay
        if (this.businessType !== 'input') {
          let target = this.tabs[0].tabContent.find((tc) => tc.prop === 'code')
          target.render = false
        }
      })
      if (!!id) {
        this.dataForm.id = id
        this.title = btnType ? '查看成品档案' : '编辑成品档案'
        // 获取详情
        detailProduct(id).then((res) => {
          // 记录编码和图号，用于校验唯一性
          this.autoCode = res.data.code
          this.autoDrawingNo = res.data.drawingNo

          // 处理普通属性
          let detailObj = res.data
          for (const key in detailObj) {
            this.dataForm[key] = detailObj[key]
          }
          // 编辑时，如果已经规格型号那些，不允许修改
          this.tabs[0].tabContent.forEach((tc) => {
            if (
              [
                'model',
                'sealingCoverStructure',
                'structureType',
                'clearance',
                'steelBallManufacturer',
                'oil',
                'noise',
                'holder'
              ].includes(tc.prop)
            ) {
              tc.itemDisabled = true
            }
          })
          this.formLoading = false
        })
      } else {
        this.title = '新建成品档案'
        this.formLoading = false
      }
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

      // 判断条件后发送请求
      if (submitFlag) {
        this.dataForm.drawingNo =
          this.dataForm.model +
          this.dataForm.sealingCoverStructure +
          this.dataForm.structureType +
          '.' +
          this.dataForm.clearance +
          this.dataForm.steelBallManufacturer +
          this.dataForm.oil +
          this.dataForm.noise +
          this.dataForm.holder
        const formMethod = this.dataForm.id ? updateProductData : cpAddProduct
        formMethod(this.dataForm)
          .then((res) => {
            let msg = res.msg
            if (res.msg === 'Success') {
              msg = formMethod == cpAddProduct ? '新建成功' : '修改成功'
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
.main {
  padding: 0px 30px 10px;
}

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

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
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
</style>
