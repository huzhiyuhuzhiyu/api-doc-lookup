<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType ? `查看${productName}档案` : title" />
        <div class="options" v-if="!btnType">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">{{ $t('common.submitButton')
          }}</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <!-- 使用对象结合自定义组件渲染内容 -->
        <el-tabs v-model="activeName">
          <!-- 普通属性 -->
          <template v-for="item in tabs">
            <el-tab-pane :label="item.tabName" :name="item.tabCode" :key="item.tabCode">
              <JNPF-Col v-model="dataForm" :tabContent="item.tabContent" ref="dataForm" :openMode="openMode" />
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { detailProduct, addProduct, updateProductData, checkCodeExist, checkDrawExist,  } from "@/api/masterDataManagement/productManage"
import { getByCode} from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值

import tabs from './params'
export default {
  props:{
    productName:{
      type:String,
      default:""
    },
    classAttribute:{
       type:String,
       default:"raw_material"
    },
    busSetId:{
      type:String,
      default:""
    }
  },
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
        classAttribute: this.classAttribute,
      },
      businessType:'', //  参数设置  自动  还是 手输
    }
  },
  created() {
    this.tabs.forEach((tab, tabInd) => {
      tab.tabContent.forEach(tc => {
        this.dataForm[tc.prop] = tc.value || ""; // 设置默认value
        if (this.classAttribute !== 'semi_finished'){
          if (tc.prop === 'saleFlag' || tc.prop === 'tradeFlag'){
            tc.render = false
          }
        }
        // 添加自定义表单元素方法和参数
        if (tc.type == "custom") {
          // 产品分类
          if (tc.prop === 'productCategoryName') {
            tc.method = getcategoryTree
            tc.dataFormatting = (res) => res.data[0].childrenList
            tc.change = (val, data) => {
              // dom更新后重新校验此元素
              this.$nextTick(() => { this.$refs['dataForm'][0].$children[0].validateField('productCategoryName') })
              if (!val && data.length) return
              if (!data || !data.length) return
              this.dataForm['productCategoryId'] = data[0].id
              this.dataForm['productCategoryName'] = data[0].name
            }
            tc.requestObj = { classAttribute: this.classAttribute}
            tc.dialogTitle = '选择产品分类'
          } else { console.warn(tc.prop + "不在判断条件内") }
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
      return this.title === `新建${this.productName}档案` ? '新建' : this.title === `编辑${this.productName}档案` ? '编辑' : '只读'
    }
  },
  methods: {
    init(id, btnType = false) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.dataForm.id = id || ''
      getByCode(this.busSetId).then(res=>{
        this.businessType = res.data.configValue1
        if (this.businessType !== 'input'){
          let target = this.tabs[0].tabContent.find(tc => tc.prop === 'code')
          target.render = false
        }
      })
      if (!!id) {
        this.title = btnType ? `查看${this.productName}档案` : `编辑${this.productName}档案`
        // 获取详情
        detailProduct(id).then(res => {
          // 记录编码和图号，用于校验唯一性
          this.autoCode = res.data.code
          this.autoDrawingNo = res.data.drawingNo

          // 处理普通属性
          let detailObj = res.data
          for (const key in detailObj) { this.dataForm[key] = detailObj[key] }
        })
      } else {
        this.title = `新建${this.productName}档案`
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

      // 判断条件后发送请求
      if (submitFlag) {
        this.dataForm.documentStatus="submit"
        const formMethod = this.dataForm.id ? updateProductData : addProduct
        formMethod(this.dataForm).then(res => {
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