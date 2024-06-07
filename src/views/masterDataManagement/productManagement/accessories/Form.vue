<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType ? '查看辅料' : title" />
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
import { detailProductData, addProductData, updateProductData, checkCodeExist, checkDrawExist } from "@/api/basicData/materialFiles"

import { getcategoryTree, detailArrange } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getMaterialList } from '@/api/basicData/index' // 材质
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表

import tabs from '../raw_material/params'
export default {
  data() {
    return { 
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
      dataForm: { },  
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj1: {
        productCategoryType: "packaging",
        classAttribute: "material",
        // classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
      },
      ProductListRequestObj: {
        classAttribute: "material",
        // classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号' },
        { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeText', label: '产品分类' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input', },
        { prop: "name", label: "产品名称", type: 'input', },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
    }
  },
  created() {
    function getQueryString(name) {
      const url_string = location.href;
      const url = new URL(url_string);
      return url.searchParams.get(name) || void (0);
    }
    this.tabs.forEach((tab, tabInd) => {
      tab.tabContent.forEach(tc => {
        this.dataForm[tc.prop] = tc.value || ""; // 设置默认value
        // 添加自定义表单元素方法和参数
        if (tc.type == "custom") {
          // 产品分类
          if (tc.prop === 'productCategoryIdText') {
            tc.method = getcategoryTree
            tc.dataFormatting = (res) => res.data[0].childrenList
            tc.change = (val, data) => {
              // dom更新后重新校验此元素
              this.$nextTick(() => { this.$refs['dataForm'][0].$children[0].validateField('productCategoryIdText') })
              if (!val && data.length) return
              if (!data || !data.length) return
              this.dataForm['productCategoryId'] = data[0].id
              this.dataForm['productCategoryIdText'] = data[0].name

            }
            tc.requestObj = { classAttribute: "material", code: getQueryString('productCategoryCode') }
            tc.dialogTitle = '选择物料分类'
          }
          // 材质
          else if (tc.prop === 'materialQualityText') {
            tc.method = getMaterialList
            tc.change = (val, data) => {
              this.$nextTick(() => { this.$refs['dataForm'][0].$children[0].validateField('materialQualityText') })
              if (!val && data.length) return
              if (!data || !data.length) return
              this.dataForm['materialQuality'] = data[0].id
              this.dataForm['materialQualityText'] = data[0].name
            }
            tc.requestObj = {
              pageNum: 1,
              pageSize: -1,
              orderItems: [{
                "asc": false,
                "column": "createTime"
              }],
            }
            // 数据格式化方法
            tc.dataFormatting = (res) => {
              let treeData = res.data.records.map(item => {
                item.name = item.description;
                return item;
              });
              return treeData
            }
          }
          // 若干需要选择的产品
          else if (tc.prop === 'packagingMaterialsText') {
            tc.dialogTitle = '选择产品'
            tc.treeTitle = '产品分类'
            tc.renderTree = false
            tc.methodArr = this.ProductMethodArr
            tc.listMethod = getProductList
            tc.listRequestObj = this.ProductListRequestObj1
            tc.tableItems = this.ProductTableItems
            tc.searchList = this.ProductTableSearchList
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
                checkCodeExist({ classAttribute: "accessories", code: this.dataForm.code }).then((res) => {
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
                checkDrawExist(this.jnpf.specialCodeUrl(this.dataForm.drawingNo)).then((res) => {
                  if (!res.data) { callback() }
                  else { callback(new Error('此图号已存在')) }
                }).catch((err) => { callback(new Error(" ")) })
              }
            },
            trigger: 'blur'
          })
        }

        // 产品类别的选项需要从数据字典中获取
        if (tc.prop === 'productType') {
          this.$store.dispatch('base/getDictionaryData', { sort: 'productType' }).then(res => {
            tc.options = res.map(item => { return { label: item.fullName, value: item.enCode } })
            tc.change = e => {
              this.formLoading = true
              let option = res.find(item => { return item.enCode === e })
              // 恢复所有rules至初始状态
              Object.keys(this.tempRules).forEach(key => {
                const keyItem = this.tabs.flatMap(tab => tab.tabContent).find(content => content.prop === key);
                keyItem.itemRules = this.tempRules[key]
                delete this.tempRules[key]
              })
              if (option) {
                // 如果选择后的产品类型是label，则对应的ruleProp的rules设为必填
                let determineList = [{ label: "胶管", ruleProp: "compressionElongation" }, { label: "套筒", ruleProp: "economize" }, { label: "软管接头总成", ruleProp: "shoulderLength" }, { label: "钢管接头总成", ruleProp: "shoulderLength" }]
                let witchItem = determineList.find(o2 => o2.label === option.fullName)
                if (witchItem) {
                  const item = this.tabs.flatMap(tab => tab.tabContent).find(content => content.prop === witchItem.ruleProp); // 找到要添加必填校验的项
                  if (item) {
                    this.tempRules[witchItem.ruleProp] = [...item.itemRules] // 存储初始状态的rules
                    item.itemRules.push({ required: true, trigger: "blur" }) // 添加新的rules
                  }
                }
              }
              this.formLoading = false
            }
          })
        }

        // 特殊处理(最小库存、最大库存、安全库存、检验方式在页面新建时不渲染)
        if (['minInventory', 'maxInventory', 'safeInventory', 'inspectionMethod'].includes(tc.prop)) {
          this.$nextTick(() => { tc.render = this.openMode !== '新建' })
        }

        // 长宽高输入自动计算单位体积
        if (tc.prop === 'extent' || tc.prop === 'width' || tc.prop === 'height') {
          tc.input = (val) => {
            this.$nextTick(() => {
              const extent = this.dataForm.extent || 0
              const width = this.dataForm.width || 0
              const height = this.dataForm.height || 0
              if (!extent || !width || !height) return this.dataForm.unitVolume = ''
              this.dataForm.unitVolume = this.jnpf.numberFormat((extent * width * height) / 1000)
            })
          }
        }
      })
    })

    this.sleeveItems.forEach(tc => {
      // 添加自定义表单元素方法和参数
      if (tc.type == "custom") {
        // 若干需要选择的产品
        if (tc.prop === 'sleeveName') {
          tc.dialogTitle = '选择产品'
          tc.treeTitle = '产品分类'
          tc.methodArr = this.ProductMethodArr
          tc.listMethod = getProductList
          tc.listRequestObj = this.ProductListRequestObj
          tc.tableItems = this.ProductTableItems
          tc.searchList = this.ProductTableSearchList
          tc.change = this.sleeveNameChange
          // tc.paramsObj = { row: scope.row, oldVal: { code: scope.row.code || '', name: scope.row.name || '' } }
        }
        else { console.warn(tc.prop + "不在判断条件内") }
      }
    })

  },
  computed: {
    openMode() {
      return this.title === '新建辅料' ? '新建' : this.title === '编辑辅料' ? '编辑' : '只读'
    }
  },
  methods: {
    // 切换table
    handleClick(tab, event) {
      if (tab.name === "customAttribute") {
        if (!this.dataForm.productCategoryId || !this.dataForm.productCategoryIdText) {
          this.$nextTick(() => {
            this.activeName = "basicInfo"
            this.$message.warning('请先选择产品分类')
            // this.$refs.dataForm[0].validateField('businessCategoryText')
          })
        }
      }
    },

    init(id, btnType = false) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      if (!!id) {
        this.dataForm.id = id
        this.title = btnType ? '查看辅料' : '编辑辅料'
        // 获取详情
        detailProductData(id).then(res => {
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
        this.title = '新建辅料'
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
        const formMethod = this.dataForm.id ? updateProductData : addProductData
        // 处理普通属性
        this.dataForm.purchasingUnit = this.dataForm.mainUnit // 采购单位设为主单位
        this.dataForm.salesUnit = this.dataForm.mainUnit // 销售单位设为主单位
        this.dataForm.procurementConversionCoefficient = 1 // 采购单位转换系数=1
        this.dataForm.salesConversionCoefficient = 1 // 销售单位转换系数=1


        let dataObj = {
          businessCode: "product", // 业务编码
          product: this.dataForm,
          sleeveList: this.sleeveList
        }
        formMethod(dataObj).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { msg = formMethod == addProductData ? "新建成功" : "修改成功" }
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