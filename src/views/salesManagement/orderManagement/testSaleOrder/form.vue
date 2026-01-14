<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="$emit('close',true)" :content="title" />
        <div class="options">
          <el-button type="success" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
            @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
            @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="$emit('close',true)">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <template v-for="item in basicData">
            <el-tab-pane :label="item.title" :name="item.title" :key="item.title">
              <template v-if="item.title === '基本信息'">
                <template v-if="item.children.length">
                  <template v-for="child in item.children">
                    <template v-if="child.jnpfKey === 'collapse'">
                      <el-collapse v-model="child.active" :key="child.renderKey">
                        <template v-for="colItem in child.children">
                          <el-collapse-item :title="colItem.title" :name="colItem.name" :key="colItem.title">
                            <JNPF-Col v-if="colItem.children.length && colItem.title === '基本信息'" v-model="dataForm"
                              :tabContent="masterList" ref="dataForm" :openMode="openMode" />
                            <JNPF-tableFormProduct @selection-change="handeleProductInfoData" :hasC="btnType === 'look' ? false : true" ref="linesForm"
                              :btnList="btnList"
                              v-if="colItem.children.length && colItem.title === '产品信息' && linesList.length" :hasA="btnType === 'look' ? false : true"
                              :tableItems="linesListItems" :value="linesList" hasDel :hasEdit="false" @delData="delData"
                              @input="linesChange" :lineBottomList="lineBottomList" :key="renderKey" />
                          </el-collapse-item>
                        </template>
                      </el-collapse>
                    </template>
                  </template>
                </template>

              </template>
              <template v-if="item.title === '附件'">
                <!-- <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" /> -->
                <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
              </template>
              <template v-if="item.title === '流程信息'">
                <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
              </template>
            </el-tab-pane>
          </template>

        </el-tabs>
      </div>
      <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
        <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
          drag :on-change="handleFileChange" ref="uploadRef">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text"><em>点击选取文件上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton"
              icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

        </el-upload>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="submit()">
            提交</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="$emit('close', true)">返回列表</el-button>
          <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()"> {{ btnText }}</el-button>
          <el-button v-else type="primary" @click="continueAdd()"> {{ btnText }}</el-button>
        </span>
      </el-dialog>
      <ComSelect-product ref="comSelect-product" @change="submitCustomerProduct" :dialogTitle="dialogTitle"
        :tableItems="tableItems" :listRequestObj="listRequestObj" :searchList="ProductTableSearchList"
        :elementShow="false" :multiple="true" :renderTree="renderTree" />
    </div>
  </transition>
</template>

<script>
import { detailVisualDevInfo } from '@/api/system/system'
import formValidate from "@/utils/formValidate";
import request from "@/utils/request";
import { getProducts, getDetailByDrawNo } from '@/api/masterDataManagement/index.js' // 产品列表
import { getcooperativeProduct, getWorkOrderNo, getOrderDetail, addOrders, editOrders, uploadProduct, getCopyOrders } from '@/api/salesManagement/assemblyOrders'
import { mapGetters, mapState } from 'vuex'
import { getscheduleList , excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import Process from '@/components/Process/Preview'
export default {
  components:{ ExportForm ,Process},
  data() {
    return {
      getProducts,
      getcooperativeProduct,
      request,
      formValidate,
      renderKey: +new Date(),
      valType: false,
      title: '',
      activeName: "基本信息",
      dataForm: {},
      basicData: [],
      flowTemplateJson: {},
      btnType: '',
      btnLoading: false,
      formLoading: false,
      masterList: [],
      linesList: [],
      linesListItems: [],
      btnList: [
        { icon: 'el-icon-plus', btnText: '选择客户产品', render: true, disabled: false, click: this.openSeleceProductDialog, type: 'customer' },
        { icon: 'el-icon-plus', btnText: '选择产品', render: true, disabled: false, click: this.openSeleceProductDialog, type: 'product' },
        { icon: 'el-icon-plus', btnText: '导入产品', render: true, disabled: false, click: this.importProductFun },
        { icon: 'el-icon-delete', btnText: '批量删除', render: true, disabled: false, click: this.batchDelete },
      ],
      lineBottomList: [
        { label: '总主数量：', value: '' },
        { label: '总金额(含税)：', value: '' },
        { label: '总金额(不含税)：', value: '' },
      ],
      datafilelist: [],
      renderTree: true,  // 默认渲染树
      listRequestObj: {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        productStatus: 'enable',
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      // 选择客户产品参数
      ProductListRequestObjs: {
        contractId: null,
        customerProductNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
        productStatus: 'enable',
        partnerType: "customer",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      dialogTitle: '选择产品',
      ProductTableSearchList: [
        { prop: 'code', label: '产品编码', type: 'input' },
        { prop: 'name', label: '产品名称', type: 'input' },
        { prop: 'productDrawingNo', label: '型号', type: 'input' },
      ],
      tableItems: [
        { prop: 'code', label: '产品编码' },
        { prop: 'name', label: '产品名称' },
        { prop: 'productDrawingNo', label: '型号' },
      ],
      listMethod: null,
      createdData: {},
      codeConfig: {},
      uploadVisib: false,
      file: null,
      selectRows: [],
      btnText: '',
      submitmethodsTitle: '',
      tipsvisible: false,
      scheduleData: [],
      scheduleForm: {},
      scheduleForm1: {
        ordersId: '',
        productsName: '',
        productsCode: '',
        customerProductNo: '',
        customerProductDrawingNo: '',
        productsDrawingNo: '',
        orderItems: [{
          "asc": true,
          "column": ""
        }],
        pageNum: 1,
        pageSize: 20,
      },
      background: true,
      total:0,
      visible: false,
      exportFormVisible: false,
    }
  },
  created() {
    this.fetchData("SHDD")
  },
  computed: {
    openMode() {
      return this.title === '新建销售订单' ? '新建' : this.title === '编辑销售订单' ? '编辑' : '只读'
    },
    totalNum: function () {
      var totalNums = 0;
      for (var i = 0; i < this.linesList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.linesList[i].num])
      }
      return totalNums
    },
    totalAmount: function () {
      var totalAmounts = 0;
      for (var i = 0; i < this.linesList.length; i++) {
        totalAmounts = this.jnpf.math('add', [totalAmounts, this.linesList[i].totalAmount])
      }
      return totalAmounts
    },
    excludingTaxAmount: function () {
      var excludingTaxAmounts = 0;
      for (var i = 0; i < this.linesList.length; i++) {
        excludingTaxAmounts = this.jnpf.math('add', [excludingTaxAmounts, this.linesList[i].excludingTaxAmount])
      }
      return excludingTaxAmounts
    },
    ...mapGetters(['userInfo']),
  },
  watch: {
    'linesList': {
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          if (item.price && item.taxRate) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1 / 100)), 4)
          }
          if (item.num && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat((item.num * item.excludingTaxPrice), 4)
          }
          if (item.price && item.num) {
            item.totalAmount = this.jnpf.numberFormat((item.price * item.num), 4)
          }
          if (item.calculationDirection == 'multiplication') {
            item.assistantNum = this.jnpf.numberFormat(item.num * item.ratio, 4)
          } else {
            item.assistantNum = this.jnpf.numberFormat(item.num / item.ratio, 4)
          }
        })
        this.lineBottomList[0].value = this.totalNum
        this.lineBottomList[1].value = this.totalAmount
        this.lineBottomList[2].value = this.excludingTaxAmount

      },
      deep: true
    },
  },
  methods: {
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      this.formLoading = true
      if (this.dataForm.id) {
        this.title = btnType === 'look' ? '查看销售订单' : btnType === 'copy' ? '新建销售订单' : '编辑销售订单'
        this.getDevDetail()
        getOrderDetail(this.dataForm.id).then(res => {
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push(
                {
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                }
              )
            })
          }
          this.dataForm = res.data.order
          this.linesList = res.data.orderLines
          if (btnType === 'copy') {
            this.dataForm.orderState = "not_finish"
            this.dataForm.deliveryCompletionDate = ""
            this.ProductListRequestObjs.partnerId = this.dataForm.cooperativePartnerId
            this.dataForm.id = ''
            this.linesList.forEach(item=>item.id = '')
            this.fetchData("SHDD")
          }
          if (btnType === 'look') {
            this.btnList.forEach(item => item.render = false)
            this.searchDetail()
          }
          this.formLoading = false
        })
      } else {
        this.title = '新建销售订单'
        this.formLoading = false
        this.getWorkOrderNoFun()
        this.getDevDetail()
      }
    },
    getDevDetail() {
      let queryString = this.jnpf.getQueryString()
      let useComppont = ['comSelect', 'comSelect2', 'comSelectList', 'comselectPage', 'depSelect', 'posSelect', 'userSelect', 'roleSelect', 'groupSelect', 'treeSelect', 'address', 'ComSelectPartner']
      detailVisualDevInfo(queryString).then(res => {
        let formData = JSON.parse(res.data.formData)
        console.log(formData, 'formData');

        this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
        console.log(this.flowTemplateJson)
        this.flowTemplateJson.content = this.userInfo.userName
        // return
        let fields = formData.fields[0].__config__.children
        let that = this

        /**传入的方法花括号内容从this中解构，并返回 */
        function vEvalTransfer(params) {
          let copyparams = params
          let match = copyparams.substring(copyparams.indexOf('{'), copyparams.indexOf('}') + 1)
          copyparams = copyparams.replace(match, '')
          function insertString(originalStr, newStr, index) {
            // 在索引位置插入新字符串
            return `${originalStr.slice(0, index)}${newStr}${originalStr.slice(index)}`;
          }
          var index1 = copyparams.indexOf('{') + 1;
          // 示例使用
          const newStr = '\nvar ' + match + ' = that;\n';

          const result = insertString(copyparams, newStr, index1);
          return result
        }
        function expandConfig(data) {
          return data.map(item => {
            // 如果有 __config__ 属性，展开它
            if (item.__config__) {
              const { __config__, ...rest } = item;
              const newItem = { ...rest, ...__config__ };

              // 递归处理 children
              if (newItem.children) {
                newItem.children = expandConfig(newItem.children);
                // 为 children 中的每个项添加 type 字段
                newItem.children.forEach(child => {
                  if (child.jnpfKey) {
                    child.type = useComppont.includes(child.jnpfKey) ? 'custom' : child.jnpfKey
                    child.customComponent = child.type == 'custom' ? child.jnpfKey : null
                    child.prop = child.__vModel__ ? that.jnpf.getToLowerCase(child.__vModel__) : child.label
                    child.sm = child.span ? child.span : '8'
                    child.style = {}
                    child.itemRules = []
                    child.value = child.defaultValue || ''
                    child.render = !child.noShow
                    child.disabled = that.btnType === 'look' ? true : child.disabled
                    if (child.prop === 'customerProductNo') {
                      child.keyup = that.searchCustomerProduct
                    }
                    if (child.prop === 'drawingNo') {
                      child.keyup = that.searchDrawingNoProduct
                    }
                    if (child.hasOwnProperty('value-format') && child.prop === 'orderDate') {
                      child['value-format'] = child.hasOwnProperty('value-format') ? 'yyyy-MM-dd' : null
                      child.value = that.jnpf.getToday()
                    }
                    if (child.jnpfKey === 'select') child.options = child.__slot__.options.map(item => { return { label: item.fullName, value: child.prop === 'taxRate' ? item.enCode : item.id } })
                  }
                  if (child.regList && Array.isArray(child.regList)) {
                    child.regList.forEach(item => {
                      if (item.validate) {
                        that.valType = false
                        // 如果是formValidate开头的自定义校验，把formValidate添加that标记
                        if (item.validate.trim().startsWith('formValidate')) {
                          // item.validate = item.validate.replace('formValidate', 'that.formValidate')
                          that.valType = true
                          var functionName = item.validate.substring(0, item.validate.indexOf('('));
                          var parameter = item.validate.substring(item.validate.indexOf('(') + 1, item.validate.lastIndexOf(')'));
                          const isEnclosedInBraces = /^\{.*\}$/.test(parameter);
                          if (isEnclosedInBraces) {
                            const createObjectFromStr = new Function(`return ${parameter}`);
                            const obj = createObjectFromStr.bind(that)();
                            item.validate = that.formValidate(obj)
                          } else {
                            if (typeof that[functionName] === 'function') {
                              item.validate = that[functionName](parameter)
                            } else {
                              console.log(functionName + ' is not defined in Vue instance');
                            }
                          }
                        } else { // 传入的方法花括号内容从this中解构，并返回
                          item.validate = vEvalTransfer(item.validate)
                        }
                        child.itemRules.push(
                          { validator: that.valType ? item.validate : eval(item.validate), trigger: child.trigger }
                        )
                      }
                      if (item.pattern) {
                        child.itemRules.push(
                          { pattern: `${eval(item.pattern)}`, message: item.message, trigger: 'blur' },
                        )
                      }
                    })
                  }
                  if (child.required) {
                    child.itemRules.push(
                      { required: child.required, message: child.placeholder, trigger: child.trigger }
                    )
                  }
                });
              }

              // 如果 jnpfKey 为 table，处理其子级
              if (newItem.jnpfKey === 'table' && newItem.children) {
                newItem.children.forEach(child => {
                  if (child.__config__ && child.__config__.children) {
                    child.children = expandConfig(child.__config__.children);

                    // 为子级的 children 添加 type 字段
                    child.children.forEach(subChild => {
                      console.log(subChild.prop, 'subChild.prop');
                      if (subChild.jnpfKey) {
                        subChild.type = useComppont.includes(subChild.jnpfKey) ? 'custom' : subChild.jnpfKey
                        subChild.prop = subChild.__vModel__ ? that.jnpf.getToLowerCase(subChild.__vModel__) : subChild.label
                        subChild.customComponent = subChild.type == 'custom' ? subChild.jnpfKey : null
                        subChild.sm = subChild.span ? subChild.span : '8'
                        subChild.style = {}
                        subChild.itemRules = []
                        subChild.value = subChild.defaultValue || ''
                        subChild.render = !subChild.noShow
                        subChild.disabled = that.btnType === 'look' ? true : subChild.disabled
                        if (subChild.jnpfKey === 'select') subChild.options = subChild.__slot__.options.map(item => { return { label: item.fullName, value: subChild.prop === 'taxRate' ? item.enCode : item.id } })
                      }
                      if (subChild.required) {
                        subChild.itemRules.push(
                          { required: subChild.required, message: subChild.placeholder + subChild.label, trigger: subChild.trigger }
                        )
                      }
                      if (subChild.regList && Array.isArray(subChild.regList)) {
                        subChild.regList.forEach(item => {
                          if (item.pattern) {
                            subChild.itemRules.push(
                              { pattern: `${eval(item.pattern)}`, message: item.message, trigger: 'blur' },
                            )
                          }
                          if (item.validate) {
                            that.valType = false
                            // 如果是formValidate开头的自定义校验，把formValidate添加that标记
                            if (item.validate.trim().startsWith('formValidate')) {
                              // item.validate = item.validate.replace('formValidate', 'that.formValidate')
                              that.valType = true
                              var functionName = item.validate.substring(0, item.validate.indexOf('('));
                              var parameter = item.validate.substring(item.validate.indexOf('(') + 1, item.validate.lastIndexOf(')'));
                              const isEnclosedInBraces = /^\{.*\}$/.test(parameter);
                              if (isEnclosedInBraces) {
                                const createObjectFromStr = new Function(`return ${parameter}`);
                                const obj = createObjectFromStr.bind(that)();
                                item.validate = that.formValidate(obj)
                              } else {
                                if (typeof that[functionName] === 'function') {
                                  item.validate = that[functionName](parameter)
                                } else {
                                  console.log(functionName + ' is not defined in Vue instance');
                                }
                              }
                            } else { // 传入的方法花括号内容从this中解构，并返回
                              item.validate = vEvalTransfer(item.validate)
                            }
                            subChild.itemRules.push(
                              { validator: that.valType ? item.validate : eval(item.validate), trigger: subChild.trigger }
                            )
                          }
                        })
                      }
                    });
                  }
                });
              }

              return newItem;
            }

            // 处理 item 的 children
            if (item.children) {
              item.children = expandConfig(item.children);
            }

            return item;
          });
        }
        let devData = expandConfig(fields)

        that.basicData = devData
        console.log(that.basicData);
        let items = devData[0].children[0].children[1].children[0].children
        let masterList = devData[0].children[0].children[0].children
        this.masterList = JSON.parse(JSON.stringify(masterList))
        this.linesListItems = items
        console.log(this.linesListItems, 'this.linesListItems');
        this.createdData = items.reduce((acc, item) => {
          acc[item.prop] = item.value; // 使用 prop 作为对象的键
          return acc;
        }, {});
        this.$set(this.createdData, 'productsId', '')
        console.log(this.createdData, 'this.createdData');
        this.linesList.push(this.createdData)
        console.log(this.linesList, 'this.linesList');

        console.log(this.masterList, 'this.masterList')
        this.masterList.forEach(item => {
          if (item.prop === 'orderNo') {
            item.disabled = this.btnType === 'look' ? true : (this.codeConfig.codeWay == 'auto' && this.codeConfig.modifyFlag == true) ? false : true
          }
          if (item.on && item.on.change) {
            let formatterFunction = new Function('return ' + item.on.change)
            item.change = formatterFunction.bind(that)()
          }
        })
      })

    },
    openSeleceProductDialog(type) {
      console.log(this.dataForm);

      if (type === 'customer') {
        if (this.dataForm.cooperativePartnerId) {
          this.listRequestObj.partnerId = this.dataForm.cooperativePartnerId
          this.listRequestObj.partnerType = 'customer'
          this.renderTree = false
          this.dialogTitle = '选择客户产品'
          this.ProductTableSearchList = [
            { prop: "customerProductNo", label: "客户料号", type: 'input' },
            { prop: "productName", label: "产品名称", type: 'input' },
            { prop: "drawingNo", label: "型号", type: 'input' },
            { prop: "productCode", label: "产品编码", type: 'input' },
          ]
          this.tableItems = [
            { prop: 'customerProductNo', label: ' 客户料号', fixed: 'left' },
            { prop: 'productCode', label: '产品编码' },
            { prop: 'productName', label: '产品名称' },
            { prop: 'drawingNo', label: '型号' },
            { prop: 'mainUnit', label: '单位(主)' },
          ]
          this.$refs["comSelect-product"].openDialog()
        } else {
          this.$message({
            message: "请先选择客户",
            type: 'error',
            duration: 1500,
          })
        }
      } else {
        this.listRequestObj.partnerId = ''
        this.listRequestObj.partnerType = ''
        this.renderTree = true
        this.dialogTitle = '选择产品'
        this.ProductTableSearchList = [
          { prop: 'code', label: '产品编码', type: 'input' },
          { prop: 'name', label: '产品名称', type: 'input' },
          { prop: 'productDrawingNo', label: '型号', type: 'input' },
        ]
        this.tableItems = [
          { prop: 'code', label: '产品编码' },
          { prop: 'name', label: '产品名称' },
          { prop: 'drawingNo', label: '型号' },
          { prop: 'mainUnit', label: '单位(主)' }
        ]
        this.$refs["comSelect-product"].openDialog()
      }
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        this.dataForm.orderNo = data.number
      } catch (error) {
      }
    },
    // 获取工作令号
    getWorkOrderNoFun() {
      getWorkOrderNo("ZC").then(res => {
        this.dataForm.workOrderNo = res.data
      })
    },
    // 导入产品
    importProductFun() {
      // 导入产品，获取数据渲染
      if (this.linesList.length) {
        this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).then(() => {
          this.uploadVisib = true
        }).catch(() => { })
      } else {
        this.uploadVisib = true
      }
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    submit() {
      this.UploadProduct(this.file)
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data)
      formData.append("partnerId", this.dataForm.cooperativePartnerId)
      //调用上传文件接口
      uploadProduct(formData).then(res => {
        if (!res.data.url) {
          this.$message.success(`导入成功`)
          if (res.data.list.length > 0) {
            res.data.list.forEach(item => {
              item.productCode = item.productsCode
              item.totalAmount = item.amounts
              item.excludingTaxAmount = item.excludingTaxAmounts
              if (this.dataForm.deliveryDate) {
                item.deliveryDate = this.dataForm.deliveryDate
              }
            });
          }
          this.productData = res.data.list
          this.formLoading = false
          this.loadingText = ''
          this.uploadVisib = false
        } else {
          this.handleMessage(res.data)
          this.$refs['uploadRef'].clearFiles();
        }
        // this.tipsvisible=true

        this.$refs['uploadRef'].clearFiles();
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: "error",
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h('div',
          {
            style: "padding-right:20px;display:flex;align-items:center;color:#f56c6c;"
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在产品相关信息错误！'),
            h('el-button', {
              props: {
                type: 'text',
                size: "mini",
                icon: 'el-icon-download'
              },
              on: {
                click: () => {
                  this.downNoProduct(data)
                }
              },
              style: {
                border: "none",
                textAlign: "center",
                // width:"20%",
                margin: "0 5px 0 5px ",
              },
            }, '下载导入错误数据')
          ]
        ),
      })
      return
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/销售订单导入模板.xlsx')
      a.click()
    },
    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.linesList.indexOf(row);
        if (index > -1) {
          this.linesList.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 单个删除
    delData(data) {
      this.linesList.splice(data.$index, 1)
    },

    submitCustomerProduct(id, data, paramsObj) {
      if (data.length) {
        let selectArr = []
        let list = data.map(item => item.all)
        // 产品 && 客户产品
        list.forEach((item, index) => {
          selectArr.push({
            productsId: item.id || item.productsId,                 // 产品id
            productName: item.name || item.productName,              // 产品名称
            productCode: item.code || item.productCode,                // 产品编码
            drawingNo: item.drawingNo,             // 型号
            availableQuantity: item.availableQuantity || 0,   // 可用库存
            customerProductNo: item.customerProductNo || '',
            price: item.costPrice || item.price,              // 含税单价
            num: item.num || 0,
            assistantNum: item.assistantNum || 0,
            sealingCoverTyping: item.sealingCoverTyping,
            accuracyLevel: item.accuracyLevel,
            vibrationLevel: item.vibrationLevel,
            oil: item.oil,
            oilQuantity: item.oilQuantity,
            clearance: item.clearance,
            packagingMethod: item.packagingMethod || '',
            contractNo: item.contractNo || '',
            ratio: item.ratio,                     // 转换系数
            calculationDirection: item.calculationDirection,  // 计算方向
            mainUnit: item.mainUnit,                   // 主单位
            remark: item.remark,
            deliveryDate: '',                          // 交期
          })
        })
        if (this.linesList.length) {
          let index = this.linesList.findIndex(item =>
            item.drawingNo === "" &&
            item.productsId === "" &&
            item.num === "" &&
            item.price === "" &&
            item.deliveryDate === ""
          )
          if (index !== -1) {
            // 使用 splice 插入 newDataArray
            this.linesList.splice(index, 0, ...selectArr);
          }
        }
      }
    },
    // 子表数据更改
    linesChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    searchDrawingNoProduct($event, scope, options) {
      getDetailByDrawNo(scope.row.drawingNo).then(res => {
        if (res.data) {
          this.linesList[scope.$index].productsId = res.data.id
          this.linesList[scope.$index].productCode = res.data.code
          this.linesList[scope.$index].mainUnit = res.data.mainUnit
          this.linesList[scope.$index].availableQuantity = res.data.availableQuantity || 0
          this.linesList[scope.$index].price = res.data.costPrice || 0
          this.linesList[scope.$index].sealingCoverTyping = res.data.sealingCoverTyping
          this.linesList[scope.$index].accuracyLevel = res.data.accuracyLevel
          this.linesList[scope.$index].vibrationLevel = res.data.vibrationLevel
          this.linesList[scope.$index].oil = res.data.oil
          this.linesList[scope.$index].oilQuantity = res.data.oilQuantity
          this.linesList[scope.$index].clearance = res.data.clearance
          this.linesList[scope.$index].remark = res.data.remark
          let exists = options.some(item => item.taxRate === parseInt(res.data.taxRate));
          if (!exists && res.data.taxRate) {
            let obj = {
              id: res.data.taxRate * 1,
              fullName: res.data.taxRate + '%',
            }
            options.push(obj)
          }
        } else {
          this.$message.error("您输入的型号未匹配到对应的产品，请重新输入")
        }
      })
    },
    // 按下enter键  根据输入的客户料号(客户物料号)查找客户产品
    searchCustomerProduct($event, scope, options) {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error("请先选择客户")
      let index = scope.$index
      let query = JSON.parse(JSON.stringify(this.ProductListRequestObjs))
      query.customerProductNo = scope.row.customerProductNo
      query.partnerId = this.ProductListRequestObjs.parentId
      if (scope.row.customerProductNo) {
        getcooperativeProduct(query).then(res => {
          if (res.data.records.length) {
            this.$set(this.linesList, index, res.data.records[0])
            this.$set(this.linesList[index], 'num', '')
            this.$set(this.linesList[index], 'totalAmount', '')
            this.$set(this.linesList[index], 'excludingTaxAmount', '')
            this.$set(this.linesList[index], 'deliveryDate', '')
            this.$set(this.linesList[index], 'contractNo', '')
            this.$set(this.linesList[index], 'packagingMethod', '')
            this.linesList[index].availableQuantity = res.data.records[0].availableQuantity || 0
            let exists = options.some(item => item.taxRate === parseInt(res.data.records[0].taxRate));
            if (!exists && res.data.taxRate) {
              let obj = {
                id: res.data.records[0].taxRate * 1,
                fullName: res.data.records[0].taxRate + '%'
              }
              options.push(obj)
            }
          }

        })
      }
      let obj = JSON.parse(JSON.stringify(this.createdData))
      this.linesList.push(obj)
      console.log(this.linesList);
    },
    // 继续修改
    continueEdit() {
      this.init(this.dataForm.id, this.btnType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.init('', 'add')
      this.tipsvisible = false
      this.btnLoading = false
    },
    async handleConfirm(value) {
      let submitFlag = true
      this.btnLoading = true
      this.formLoading = true
      // 校验表单
      console.log(this.$refs['dataForm']);

      let dataForm = this.$refs['dataForm'][0].$refs.main
      let valid = await dataForm.validate().catch(err => false)
      if (!valid && submitFlag) {
        submitFlag = false
        this.btnLoading = false
        this.formLoading = false
        this.jnpf.focusErrValidItem(dataForm.fields)
      }

      if (this.linesList.length < 1) {
        this.$message({
          message: "请至少添加一条产品",
          type: 'error',
          duration: 1500,
        })
        submitFlag = false
        this.btnLoading = false
        this.formLoading = false
      }
      // let orderLineList = []
      if (this.linesList.length === 1) {
        // 空行校验表格表单
        let linesForm = this.$refs['linesForm'][0].$refs.main
        let valid_3 = await linesForm.validate().catch(err => false)
        if (!valid_3 && submitFlag) {
          submitFlag = false
          this.btnLoading = false
          this.formLoading = false
          this.jnpf.focusErrValidItem(linesForm.fields)
        }
      } else {
        let index = this.linesList.findIndex(item =>
          item.drawingNo === "" &&
          item.productsId === "" &&
          item.num === "" &&
          item.price === "" &&
          item.deliveryDate === ""
        )
        if (index !== -1) {
          // 删除空行
          this.linesList.splice(index, 1);
          // 校验表格表单
          this.$nextTick(async () => {
            let linesForm = this.$refs['linesForm'][0].$refs.main
            let valid_3 = await linesForm.validate().catch(err => false)
            if (!valid_3 && submitFlag) {
              submitFlag = false
              this.btnLoading = false
              this.formLoading = false
              this.jnpf.focusErrValidItem(linesForm.fields)
            }

            if (submitFlag) {
              this.submit(value)
            } else {
              this.btnLoading = false
              this.formLoading = false
              this.linesList.push(this.createdData)
            }
          })
        }
      }

    },
    submit(value) {
      this.dataForm.documentStatus = value
      this.dataForm.excludingTaxTotalAmount = this.excludingTaxAmount
      this.dataForm.totalAmount = this.totalAmount
      this.dataForm.taxAmount = this.jnpf.numberFormat(this.totalAmount - this.excludingTaxAmount, 2)
      if (this.datafilelist.length) {
        this.datafilelist.map((item, index) => {
          item.bimAttachments = {
            businessType: '',
            documentId: item.id,
            fileFlag: '',
            sort: index
          }
        })
      }
      let _data = {
        order: this.dataForm,
        attachmentList: this.datafilelist,
        orderLineList: this.linesList
      }
      let formMethod = null;
      if (this.btnType == 'edit') {
        formMethod = editOrders
        this.btnText = "继续修改"
      } else if (this.btnType == 'add' || this.btnType == 'copy') {
        formMethod = addOrders
        this.btnText = "继续新增"
      }
      formMethod(_data).then(res => {
        this.submitmethodsTitle = value == "draft" ? "保存成功" : "提交成功"
        this.tipsvisible = true
        this.formLoading = false
      }).catch(() => {
        this.btnLoading = false
        this.formLoading = false
        this.linesList.push(this.createdData)
      })
    },
    searchDetail() {
      this.formLoading = true
      this.scheduleForm.ordersId = this.dataForm.id
      Object.keys(this.scheduleForm).forEach(key => {
        let item = this.scheduleForm[key]
        this.scheduleForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.total = 0
      getscheduleList(this.scheduleForm).then(res => {
        this.scheduleData = res.data.records
        this.total = res.data.total
        this.formLoading = false
        this.visible = false
      }).catch(() => {
        this.visible = false
        this.formLoading = false
      })
    },
    resetDetail() {
      this.scheduleForm = JSON.parse(JSON.stringify(this.scheduleForm1))
      this.scheduleForm.pageNum = 1
      this.searchDetail()
    },
    switchStyleheight() {
      const mainRegion = this.$refs.orderInfos.$parent.$parent.$el // 表单页面区域
      const mainHeight = mainRegion.clientHeight;
      const TableFormTitle = mainRegion.querySelector('.TableForm_title') // 获取TableForm头部操作栏
      const TableFormTitleHeight = TableFormTitle ? TableFormTitle.clientHeight : 0
      let maxHeight = mainHeight - TableFormTitleHeight - 65 - 154
      maxHeight = maxHeight > 500 ? maxHeight : 500
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100);
      };
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.scheduleRef.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.scheduleForm,
          exportType: '1105',
          exportName: '销售订单进度跟踪',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.scheduleForm.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
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
  padding-bottom: 0px
}
/* 进度跟踪样式 */
::v-deep #pane-schedule {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}
::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  // padding: 0 20px;
}
::v-deep .el-tabs {
  height: 100% !important;
}
</style>
