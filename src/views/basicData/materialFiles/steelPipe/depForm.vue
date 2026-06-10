<template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" v-loading="formLoading"
      :openMode="title === '新建钢管物料' ? '新建' : title === '编辑钢管物料' ? '编辑' : '只读'" />
    <span slot="footer" class="dialog-footer" v-show="!btntype">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { addSteelData, updateSteelData, detailSteelData, checkSteelCodeExist } from "@/api/basicData/materialFiles";
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings'

export default {
  data() {
    return {
      title: "",
      visible: false,
      formLoading: false,
      btnLoading: false,
      // 保存编辑时已有的项目编码
      autoCode: undefined,
      dataForm: {},
      btntype: false,
      dataFormItems: [
        { prop: "outsideDiameter", label: "钢管外径", value: "", type: "input", itemRules: [{ required: true, trigger: "blur" }], sm: 12 },
        { prop: "nutName", label: "螺母", value: "", type: 'custom', customComponent: "ComSelect-page", itemRules: [{ required: true, trigger: "blur" }], sm: 12 },
        { prop: "ferruleName", label: "卡套", value: "", type: 'custom', customComponent: "ComSelect-page", itemRules: [{ required: true, trigger: "blur" }], sm: 12 },
        { prop: "sealingRingName", label: "密封圈", value: "", type: 'custom', customComponent: "ComSelect-page", itemRules: [{ required: true, trigger: "blur" }], sm: 12 },
        { prop: "plasticCapName", label: "塑料帽", value: "", type: 'custom', customComponent: "ComSelect-page", itemRules: [{ required: true, trigger: "blur" }], sm: 12 },
        { prop: "remark", label: "备注", value: "", type: 'textarea', sm: 24 },
      ],
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
      { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
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
        // { prop: 'classAttributeText', label: '产品分类' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input', },
        { prop: "name", label: "产品名称", type: 'input', },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
    }
  },
  created() {
    this.dataFormItems.forEach(tc => {
      this.dataForm[tc.prop] = tc.value || ""; // 设置默认value
      // 添加自定义表单元素方法和参数
      if (tc.type == "custom") {
        // 若干需要选择的产品
        if (tc.prop === 'nutName' // 螺母
          || tc.prop === 'ferruleName' // 卡套
          || tc.prop === 'sealingRingName' // 密封圈
          || tc.prop === 'plasticCapName' // 塑料帽
        ) {
          tc.dialogTitle = '选择产品'
          tc.treeTitle = '产品分类'
          tc.methodArr = this.ProductMethodArr
          tc.listMethod = getProductList
          tc.listRequestObj = this.ProductListRequestObj
          tc.tableItems = this.ProductTableItems
          tc.searchList = this.ProductTableSearchList
          tc.change = this.ProductChange
          tc.paramsObj = { prop: tc.prop, oldVal: this.dataForm[tc.prop.slice(0, -4)] }
        }
        else { console.warn(tc.prop + "不在判断条件内") }
      }
    })
  },
  watch: {
    visible(val) {
      !val ? this.$refs['dataForm'].$children[0].resetFields() : ""
    }
  },
  methods: {
    init(id, type) {
      this.autoCode = undefined
      this.visible = true
      this.btntype = false
      this.dataForm.id = id || ''
      this.formLoading = true
      if (type == "edit") {
        this.btntype = false
      } else if (type == "look") {
        this.btntype = true
      }
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.title = this.btnType ? '查看钢管物料' : '编辑钢管物料'
          detailSteelData(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
          })
        } else {
          this.title = '新建钢管物料'
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.btnLoading = true;
      let focusFlag = false // 自动聚焦是否已经使用过
      let form = this.$refs['dataForm'].$children[0]
      form.validate((valid) => {
        if (valid) {
          let formMethod = this.dataForm.id ? updateSteelData : addSteelData;
          formMethod(this.dataForm).then(res => {
            let msg = formMethod == updateSteelData ? '修改成功' : '新建成功'
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
          }).catch(() => { this.btnLoading = false })
        } else {
          if (!focusFlag) {
            let formItems = form.$children[0].$children
            formItems.some(item => {
              let formItem = item.$children[0].$children[0]
              if (formItem.validateState === 'error') {
                focusFlag = true
                this.jnpf.focusItem(formItem.$children[1].$el)
                this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
                return true
              }
            });
          }
        }
        this.btnLoading = false
      })

    },
    ProductChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField(paramsObj.prop) })
      if (!data || !data.length) return
      this.dataForm[paramsObj.prop.slice(0, -4) + 'Id'] = data[0].id
      this.dataForm[paramsObj.prop] = data[0].name
    },
  }
}
</script>
<style scoped>
::v-deep #table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>