<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType ? '查看成品' : title" />
        <div class="options" v-if="!btnType">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">{{ $t('common.submitButton')
            }}</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <!-- 使用对象结合自定义组件渲染内容 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
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
import { detailProduct, addProduct, updateProductData, checkCodeExist, checkDrawExist,  } from "@/api/masterDataManagement/productManage"

import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getbimProductAttributesList } from "@/api/masterDataManagement/index";

import tabs from './params'
export default {
  data() {
    return {
      datafilelist: [],
      activeName: "basicInfo",
      tabs: tabs(),
      tempRules: {}, // 动态判断是否必填项
      btnType: false,
      visible: true,
      btnLoading: false,
      formLoading: false,
      title: "",
      autoCode: undefined,
      autoDrawingNo: undefined,
      tempCodeRules: [],
      tempDrawingNoRules: [],
      dataForm: {
        classAttribute: "finish_product",
      },
      getbimProductAttributesList, // 产品类别属性列表请求api

    }
  },
  created() {
    this.tabs.forEach((tab, tabInd) => {
      tab.tabContent.forEach(tc => {
        this.dataForm[tc.prop] = tc.value || ""; // 设置默认value
        // 添加自定义表单元素方法和参数
        if (tc.type == "custom") {
          // 产品分类
          if (tc.prop === 'productCategoryName') {
            tc.method = getcategoryTree
            tc.dataFormatting = (res) => res.data[0].childrenList
            tc.requestObj = { classAttribute: "finished_product" }
            getcategoryTree(tc.requestObj).then(res=>{
              if (res.data && !res.data[0].childrenList.length) {
                this.$nextTick(() => { this.$refs['dataForm'][0].$children[0].validateField('productCategoryName') })
                this.dataForm['productCategoryId'] = res.data[0].id
                this.dataForm['productCategoryName'] = res.data[0].name
              }else{
                this.dataForm['productCategoryId'] = ''
                this.dataForm['productCategoryName'] = ''
              }
            })
            tc.change = (val, data) => {
              // dom更新后重新校验此元素
              this.$nextTick(() => { this.$refs['dataForm'][0].$children[0].validateField('productCategoryIdText') })
              if (!val && data.length) return
              if (!data || !data.length) return
              this.dataForm['productCategoryId'] = data[0].id
            }
            tc.dialogTitle = '选择产品分类'
          }
          // 若干需要选择的产品
          else if (tc.prop === 'brand' // 品牌
            || tc.prop === 'sealingCoverStructure' // 密封盖-结构
            || tc.prop === 'sealingCoverTyping' // 密封盖-打字
            || tc.prop === 'structureType' // 结构类型
            || tc.prop === 'clearance' // 游隙
            || tc.prop === 'steelBallManufacturer' // 钢球厂家
            || tc.prop === 'oil' // 油脂
            || tc.prop === 'oilQuantity' // 油脂量
            || tc.prop === 'noise' // 噪音
            || tc.prop === 'holder' // 保持架
            || tc.prop === 'vibrationLevel' // 振动等级
            || tc.prop === 'accuracyLevel' // 精度等级
            || tc.prop === 'colour' // 颜色
            || tc.prop === 'aperture' // 孔径
            ) {
            tc.dialogTitle = '选择' + tc.label
            tc.method = getbimProductAttributesList
            tc.requestObj = {typeCode:tc.typeCode}
            tc.clearable = true
            tc.change = this.ProductChange
            tc.paramsObj = { prop: tc.prop, tabInd, oldVal: this.dataForm[tc.prop.slice(0, -4)] }
          }
          else { console.warn(tc.prop + "不在判断条件内") }
        }

        // 添加校验编码和图号唯一性的规则
        if (tc.prop === 'code') {
          if (!tc.itemRules) { tc.itemRules = [] }
          tc.itemRules.push({
            validator: (rule, value, callback) => {
              if (!value) { callback() }
              else if (this.dataForm.code === this.autoCode) { callback() }
              else {
                checkCodeExist({ id: this.dataForm.id, code: this.dataForm.code }).then((res) => {
                  if (!res.data) { callback() }
                  else { callback(new Error('此产品编码已存在')) }
                }).catch((err) => { callback(new Error(" ")) })
              }
            },
            trigger: 'blur'
          })
        } else if (tc.prop === 'drawingNo') {
          if (!tc.itemRules) { tc.itemRules = [] }
          tc.itemRules.push({
            validator: (rule, value, callback) => {
              if (!value) { callback() }
              else if (this.dataForm.drawingNo === this.autoDrawingNo) { callback() }
              else {
                // this.jnpf.specialCodeUrl 对浏览器无法解析的url字符进行手动转码
                checkDrawExist({id:this.dataForm.id,drawingNo:this.jnpf.specialCodeUrl(this.dataForm.drawingNo)}).then((res) => {
                  if (!res.data) { callback() }
                  else { callback(new Error('此规格型号已存在')) }
                }).catch((err) => { callback(new Error(" ")) })
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
      return this.title === '新建标准配件档案' ? '新建' : this.title === '编辑标准配件档案' ? '编辑' : '只读'
    }
  },
  methods: {

    init(id, btnType = false) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      if (!!id) {
        this.dataForm.id = id
        this.title = btnType ? '查看标准配件档案' : '编辑标准配件档案'
        // 获取详情
        detailProduct(id).then(res => {
          // 记录编码和图号，用于校验唯一性
          this.autoCode = res.data.product.code
          this.autoDrawingNo = res.data.product.drawingNo

          // 处理普通属性
          let detailObj = res.data.product
          for (const key in detailObj) { this.dataForm[key] = detailObj[key] }
          // 如果检验方式为抽检，显示抽检比例
          if (this.dataForm.inspectionMethod === 'spot_check') {
            let target = this.tabs[0].tabContent.find(tc => tc.prop === 'spotCheckRatio')
            target.render = true
          }
          // 编辑时，如果已经设置了产品类别，不允许修改
          if (this.dataForm.productType || this.openMode === '只读') {
            let target = this.tabs[0].tabContent.find(tc => tc.prop === 'productType')
            target.itemDisabled = true
          }

        })
      } else {
        this.title = '新建成品'
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
        const formMethod = this.dataForm.id ? updateProductData : addProduct
        // 处理普通属性
        this.dataForm.purchasingUnit = this.dataForm.mainUnit // 采购单位设为主单位
        this.dataForm.salesUnit = this.dataForm.mainUnit // 销售单位设为主单位
        this.dataForm.procurementConversionCoefficient = 1 // 采购单位转换系数=1
        this.dataForm.salesConversionCoefficient = 1 // 销售单位转换系数=1

       
        let dataObj = {
          product: this.dataForm,
        }
        formMethod(dataObj).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { msg = formMethod == addProduct ? "新建成功" : "修改成功" }
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
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }

    },
    goBack() {
      this.$emit('close')
    },
    ProductChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'][paramsObj.tabInd].$children[0].validateField(paramsObj.prop) })
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm[paramsObj.prop.slice(0, -4)] = data[0].id
        this.dataForm[paramsObj.prop] = data[0].all.drawingNo
        // 如果此产品是包材
        if (paramsObj.prop === 'packagingMaterialsText') {
          this.dataForm[paramsObj.prop] = `${data[0].all.name} - ${data[0].all.drawingNo}`
        }
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm[paramsObj.prop.slice(0, -4)] = ''
        this.dataForm[paramsObj.prop] = ''
      }
    },
    // 套筒改变回调
    sleeveNameChange(val, data, paramsObj) {
      let prop = this.$refs['sleeveForm'].$children[0].fields[paramsObj.scope.$index * this.sleeveItems.length].labelFor
      this.$nextTick(() => { this.$refs['sleeveForm'].$children[0].validateField(prop) })
      if (!data || !data.length) return
      let index = paramsObj.scope.$index
      this.sleeveList[index].sleeveId = data[0].id
      this.sleeveList[index].sleeveName = data[0].name
      this.sleeveList[index].drawingNo = data[0].all.drawingNo
    },
  },
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