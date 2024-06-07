<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType ? '查看原材料档案' : title" />
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
          <template v-for="item in tabs">
            <el-tab-pane :label="item.tabName" :name="item.tabCode" :key="item.tabCode"
              v-if="item.tabName !== '胶管属性' ? true : dataForm.productType === 'pt003'">
              <JNPF-Col v-model="dataForm" :tabContent="item.tabContent" ref="dataForm" :openMode="openMode" />
            </el-tab-pane>
          </template>
          <!-- 自定义属性 -->
          <el-tab-pane :label="attributeLine.tabName" :name="attributeLine.tabCode">
            <JNPF-Col v-if="attributeFlag" v-model="attributeForm[pid]" :tabContent="attributeLine.tabContent"
              ref="attributeLine" :openMode="openMode" />
          </el-tab-pane>
          <!-- 套筒属性 -->
          <el-tab-pane label="套筒属性" name="sleeve" id="sleeve">
            <JNPF-col-table v-model="sleeveList" ref="sleeveForm" :tableItems="sleeveItems" :openMode="openMode"
              @addth="addSleeveList" @deleteth="deleteth" />
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="!!btnType" :detailed="!!btnType"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { detailProductData, addProductData, updateProductData, checkCodeExist, checkDrawExist, productsCalculateGross } from "@/api/basicData/materialFiles"

import { getcategoryTree, detailArrange } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getMaterialList } from '@/api/basicData/index' // 材质
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表

import { getArrange } from "@/api/basicData/materialSettings"; // 编排属性列表
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
        classAttribute: "raw_material",
      },
      sleeveItems: [
        { prop: "sleeveName", label: "套筒", value: "", type: 'custom', customComponent: "ComSelect-page", itemRules: [{ required: true, trigger: "blur" }] },
        { prop: "drawingNo", label: "套筒图号", value: "", type: 'input', itemDisabled: true, placeholder: ' ' },
        { prop: "withhold", label: "扣压量", value: "", type: "input", itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [10, 2, false, (errMsg) => { this.$message.error(`扣压量：${errMsg}`) }] }), trigger: 'blur' }] },
        { prop: "drawLineLength", label: "画线长", value: "", type: "input", itemRules: [{ validator: this.formValidate({ type: 'decimal', params: [10, 2, false, (errMsg) => { this.$message.error(`画线长：${errMsg}`) }] }), trigger: 'blur' }] },
        { prop: "innerRubberLength", label: "剥内胶长", value: "", type: "input", itemRules: [{ validator: this.formValidate({ type: 'decimal', params: [10, 2, false, (errMsg) => { this.$message.error(`剥内胶长：${errMsg}`) }] }), trigger: 'blur' }] },
        { prop: "externalAdhesive", label: "剥外胶长", value: "", type: "input", itemRules: [{ validator: this.formValidate({ type: 'decimal', params: [10, 2, false, (errMsg) => { this.$message.error(`剥外胶长：${errMsg}`) }] }), trigger: 'blur' }] },
        { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200 },
      ],
      sleeveList: [],
      attributeId: "", // 编排属性id
      attributeForm: { default: {} }, // 存放自定义属性的表单
      pid: "default", // 记录当前产品分类id，区分应该存在的自定义属性
      attributeLine: { tabCode: "customAttribute", tabName: "自定义属性", tabContent: [] }, // 渲染自定义属性元素的对象
      attributeLines: [],
      attributeFlag: true, // 控制自定义属性pid发生改变tab重新渲染
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ], // 产品选择弹出框树状列表
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
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号' },
        { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeText', label: '产品类别' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input', },
        { prop: "name", label: "产品名称", type: 'input', },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      productTypeDictionary: [] // 产品类型列表
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
              // 添加自定义属性
              this.pid = this.dataForm.productCategoryId ? "pid_" + this.dataForm.productCategoryId : 'default'
              if (!this.attributeForm[this.pid]) { this.$set(this.attributeForm, this.pid, {}) }
              this.getSpecialAttributes(true)
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
          else if (tc.prop === 'steelWireJointText' // 钢丝接头
            || tc.prop === 'copperTubeText' // 铜管
            || tc.prop === 'wireText' // 钢丝
            || tc.prop === 'whiteXiumingNylonSheathText' // 钢丝白色透明尼龙护套PNS
            || tc.prop === 'stainlessSteelSheathText' // 不锈钢护套WS
            || tc.prop === 'spiralNylonSheathText' // 螺旋尼龙护套RNL
            || tc.prop === 'protectiveSpringText' // 保护簧Rs
            || tc.prop === 'fireproofSleeveText' // 防火套FJ
            || tc.prop === 'zrtSheathText' // ZRT护套
            || tc.prop === 'baojia1Text' // 保甲1（卡箍固定）
            || tc.prop === 'baojia2Text' // 保甲2（铝套扣压）
            || tc.prop === 'baojia3Text' // 保甲3（C环扣压）
            || tc.prop === 'baojia4Text' // 保甲4
            || tc.prop === 'clampText' // 卡箍
            // || tc.prop === 'clamp1Text' //卡箍1
            // || tc.prop === 'clamp2Text' // 卡箍2
            // || tc.prop === 'clamp3Text' // 卡箍3
            // || tc.prop === 'clamp4Text' // 卡箍4
            || tc.prop === 'pipeClampText' // 管夹
          ) {
            tc.dialogTitle = '选择产品'
            tc.treeTitle = '产品分类'
            tc.methodArr = this.ProductMethodArr
            tc.listMethod = getProductList
            tc.listRequestObj = this.ProductListRequestObj
            tc.tableItems = this.ProductTableItems
            tc.searchList = this.ProductTableSearchList
            tc.clearable = true
            tc.change = this.ProductChange
            tc.paramsObj = { prop: tc.prop, tabInd, oldVal: this.dataForm[tc.prop.slice(0, -4)] }
          }else if(tc.prop === 'packagingMaterialsText'){//包材
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

        // 理论重量计算功能
        if (tc.prop === 'grossWeightCoefficient') {
          this.$nextTick(() => {
            const style = {
              backgroundColor: '#f5f7fa',
              color: '#909399',
              borderTopLeftRadius: 'unset',
              borderBottomLeftRadius: 'unset',
              transform: 'translate(0px, 1px)'
            }
            if (this.openMode === '编辑') {
              style.backgroundColor = '#409eff'
              style.color = '#fff'
            }
            tc.itemSlot = {
              position: 'append', content: '计算并保存', click: async (e, item) => {
                if (this.openMode === '只读') return
                if (!this.dataForm.grossWeightCoefficient) return this.$message.error('理论重量不能为空')
                this.$refs.dataForm[0].$refs.main.validateField('grossWeightCoefficient', (error) => {
                  if (!error) {
                    if (this.flag) return
                    this.flag = true
                    productsCalculateGross({
                      id: this.dataForm.id,
                      grossWeightCoefficient: this.dataForm.grossWeightCoefficient,
                      drawingNo: this.dataForm.drawingNo
                    }).then(res => {
                      this.flag = false
                      this.$message.success('操作成功')
                    })
                  } else {
                    this.flag = false
                  }
                })
              }, style, size: 'mini'
            }
          })
        }

        // 添加校验编码和图号唯一性的规则
        if (tc.prop === 'code') {
          if (!tc.itemRules) { tc.itemRules = [] }
          tc.itemRules.push({
            validator: (rule, value, callback) => {
              if (!value) { callback() }
              else if (this.dataForm.code === this.autoCode) { callback() }
              else {
                checkCodeExist({ classAttribute: "raw_material", code: this.dataForm.code }).then((res) => {
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
          this.$store.dispatch('base/getDictionaryData', { sort: 'productType' }).then(async res => {
            tc.options = res.map(item => { return { label: item.fullName, value: item.enCode } })
            tc.change = this.productTypeChange
            this.productTypeDictionary = res
          })
        }

        // 特殊处理(毛重系数、最小库存、最大库存、安全库存、版本、检验方式在页面新建时不渲染)
        if (['grossWeightCoefficient', 'minInventory', 'maxInventory', 'safeInventory', 'version', 'inspectionMethod'].includes(tc.prop)) {
          this.$nextTick(() => { tc.render = this.openMode !== '新建' })
        }
        // 标准单价是从原材料标准价格设置页面查看才显示的
        if (['standardPrice'].includes(tc.prop)) {
          this.$nextTick(() => { tc.render = this.priceFlag })
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
      return this.title === '新建原材料档案' ? '新建' : this.title === '编辑原材料档案' ? '编辑' : '只读'
    }
  },
  methods: {
    // 渲染自定义属性表单
    getSpecialAttributes() {
      if (!this.dataForm.productCategoryId) return
      this.formLoading = true
      let listQuery = {
        businessCode: "product",
        classAttribute: "material",
        businessCategoryId: this.dataForm.productCategoryId,
        orderItems: [{ asc: false, column: "createTime" }],
        pageNum: 1,
        pageSize: -1
      }
      getArrange(listQuery).then(res => { // 获取指定分类编排属性元素
        if (!res.data.records.length) {
          this.attributeLine.tabContent = []
          this.formLoading = false
        }
        res.data.records.forEach(item => {
          this.attributeId = item.id // 编排属性id
          detailArrange(item.id).then(res2 => { // 获取编排子属性
            this.attributeLine.tabContent = []
            this.attributeLines = res2.data.lines
            this.attributeLines.forEach(line => {
              // 整合渲染参数
              let prop = line.attributeColumn
              let label = line.name
              let type = line.type === 'text' ? 'input' : line.type === 'select' ? 'select' : 'multiple'
              let value = this.attributeForm[this.pid][prop] || ""
              let options = []
              if (line.attributeItemName) {
                let nameList = line.attributeItemName.split(',')
                let valList = line.attributeItemVal.split(',')
                nameList.forEach((item2, index2) => { options.push({ label: nameList[index2], value: valList[index2] }) })
              }

              let itemRules = []
              let trigger = line.type === 'text' || line.type === 'textarea' ? 'blur' : 'change'
              // 是否必填
              if (line.requiredFlag) { itemRules.push({ required: true, trigger }) }

              let formItem = { prop, label, value, type, options, itemRules }
              this.attributeLine.tabContent.push(formItem)
            })
            let arr = this.attributeLine.tabContent
            let obj = this.attributeForm[this.pid]
            let newObj = {};
            arr.forEach(item => {
              if (obj.hasOwnProperty(item.prop)) { newObj[item.prop] = obj[item.prop]; }
              else { newObj[item.prop] = "" }
            });
            function extractValues(str) {
              let keyValuePairs = str.split(",");
              let values = [];
              for (let pair of keyValuePairs) {
                let [key, value] = pair.split(":");
                values.push(value);
              }
              return values;
            }
            Object.keys(newObj).forEach(item => {
              let column = this.attributeLines.find(obj => obj.attributeColumn === item);
              let type = column.type
              if (newObj[item]) {
                if (type === 'select') {
                  newObj[item] = newObj[item].split(":")[1]
                } else if (type === 'multiple') {
                  if (typeof newObj[item] === 'String') newObj[item] = extractValues(newObj[item]);
                }
              }
            })
            this.attributeForm[this.pid] = newObj
            this.formLoading = false
            this.$nextTick(() => { this.$refs['attributeLine'].$children[0].clearValidate() })
          })
        })
      })
    },
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

    init(id, btnType = false, priceFlag = false) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.priceFlag = priceFlag
      if (!!id) {
        this.dataForm.id = id
        this.title = btnType ? '查看原材料档案' : '编辑原材料档案'
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

          // 判断产品类型，定制校验规则
          this.productTypeChange(this.dataForm.productType)

          // 处理套筒属性
          this.sleeveList = res.data.sleeveList || []
          if (this.sleeveList.length > 0) {
            this.sleeveList.forEach((item, index) => { item.index = index; });
          }
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

          // 处理自定义属性
          let attributeLineList = res.data.attributeLineList ? res.data.attributeLineList : []
          this.pid = "pid_" + detailObj.productCategoryId
          this.$set(this.attributeForm, this.pid, {})

          function extractValue(data) {
            var pairs = data.split(",");
            var result = [];
            pairs.forEach(function (pair) {
              var parts = pair.split(":");
              var value = parts[1].trim();
              result.push(value);
            });
            return result;
          }
          attributeLineList.forEach(item => {
            if (item.type === 'multiple' && item.attributeValue.includes(':')) { item.attributeValue = extractValue(item.attributeValue); }
            this.attributeForm[this.pid][item.attributeColumn] = item.attributeValue
          })
          this.getSpecialAttributes() // 获取自定义属性表单元素
        })
      } else {
        this.title = '新建原材料档案'
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

      // 校验自定义属性
      let attributeForm = this.$refs['attributeLine'].$refs.main
      let valid_2 = await attributeForm.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.activeName = 'customAttribute'
        let formItems = attributeForm.fields
        this.jnpf.focusErrValidItem(attributeForm.fields)
      }

      // 校验表格表单（套筒属性）
      let sleeveForm = this.$refs['sleeveForm'].$refs.main
      let valid_3 = await sleeveForm.validate().catch(err => false)
      if (!valid_3 && submitFlag) {
        submitFlag = false
        this.activeName = 'sleeve'
        this.jnpf.focusErrValidItem(sleeveForm.fields)
      }

      // 判断条件后发送请求
      if (submitFlag) {
        const formMethod = this.dataForm.id ? updateProductData : addProductData
        // 处理普通属性
        this.dataForm.purchasingUnit = this.dataForm.mainUnit // 采购单位设为主单位
        this.dataForm.salesUnit = this.dataForm.mainUnit // 销售单位设为主单位
        this.dataForm.procurementConversionCoefficient = 1 // 采购单位转换系数=1
        this.dataForm.salesConversionCoefficient = 1 // 销售单位转换系数=1

        // 处理自定义属性
        function getKeyByValue(array, value) {
          for (let i = 0; i < array.length; i++) {
            let obj = array[i];
            if (obj.value === value) { return obj.label; }
          }
          return null; // 如果没有找到匹配的值，返回null
        }
        // 自定义属性进行排序与排空
        function sortMethod(fields) {
          let newFields = fields.filter(item => (item.attributeValue !== "" && item.attributeValue !== "[]"))
          newFields.forEach(item => {
            const attributeValue = item.attributeValue;
            const keyValuePairs = attributeValue.split(',').map(item => item.split(':'));
            const sortedKeyValuePairs = keyValuePairs.sort((a, b) => a[1].charCodeAt() - b[1].charCodeAt());
            const sortedData = sortedKeyValuePairs.map(item => item.join(':')).join(',');
            item.attributeValue = sortedData;
          })
          return newFields
        }
        let attributeFormList = []
        Object.keys(this.attributeForm[this.pid]).forEach(attributeColumn => {
          let valueAll = this.attributeForm[this.pid][attributeColumn]
          // 数据对应编排子属性和其type
          let line = this.attributeLines.find(item => item.attributeColumn === attributeColumn);
          if (!line) return
          let type = line.type
          // 如果数据包含选择项，进行处理
          let options = []
          if (line.type !== 'text') {
            let nameList = line.attributeItemName.split(',')
            let valList = line.attributeItemVal.split(',')
            nameList.forEach((item2, index2) => { options.push({ label: nameList[index2], value: valList[index2] }) })
          }
          let attributeValue = ""
          if (valueAll == "" || valueAll == undefined) {
          } else if (type === 'text') {
            attributeValue = valueAll
          } else if (type === 'select') {
            let label = getKeyByValue(options, valueAll);
            attributeValue = `${label}:${valueAll}`
          } else if (type === 'multiple') {
            valueAll.forEach(item => {
              let label = getKeyByValue(options, item);
              if (!!attributeValue) attributeValue += ","
              attributeValue += `${label}:${item}`
            })
          }
          attributeFormList.push({ attributeColumn, attributeValue, type })
        })

        attributeFormList = sortMethod(attributeFormList)
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'customer',
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        let dataObj = {
          attachmentList: this.datafilelist,
          attributeId: this.attributeId, // 编排属性ID
          attributeLineList: attributeFormList, // 自定义属性列表
          businessCode: "product", // 业务编码
          product: this.dataForm,
          sleeveList: this.sleeveList
        }

        // 如果产品类型不是胶管，则清除胶管属性填写的数据
        if (dataObj.product.productType !== 'pt003') {
          const rubberTubeTab = this.tabs.find(tab => tab.tabCode === 'rubberTube')
          const fields = rubberTubeTab.tabContent.map(item => item.prop)
          fields.forEach(prop => { this.dataForm[prop] = '' })
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
    // 对应套筒新增行
    addSleeveList() {
      let index = this.sleeveList.length
      this.sleeveList.push({
        index,
        sleeveId: "",
        sleeveName: "",
        withhold: "",
        externalAdhesive: "",
        drawLineLength: "",
        innerRubberLength: "",
        serialNumber: "",
        remark: "",
      })
    },
    // 对应套筒删除当前行
    deleteth(row, index) {
      this.sleeveList.splice(row.$index, 1)
    },
    async productTypeChange(val) {
      if (!this.productTypeDictionary.length) { // 避免触发时未从数据字典获取完成产品类型
        this.productTypeDictionary = await this.$store.dispatch('base/getDictionaryData', { sort: 'productType' }).catch(err => [])
      }
      // this.formLoading = true
      let option = this.productTypeDictionary.find(item => { return item.enCode === val })
      // 恢复所有rules至初始状态
      Object.keys(this.tempRules).forEach(key => {
        const keyItem = this.tabs.flatMap(tab => tab.tabContent).find(content => content.prop === key);
        keyItem.itemRules = this.tempRules[key]
        delete this.tempRules[key]
      })
      if (option) {
        // 一些定制必填字段的选项：如果选择后的产品类型是label，则把对应的ruleProps设为必填
        let determineList = [
          { label: "胶管", ruleProps: ["compressionElongation", "layerCount", "hoseNo"] },
          { label: "套筒", ruleProps: ["economize"] },
          { label: "软管接头总成", ruleProps: ["shoulderLength"] },
          { label: "钢管接头总成", ruleProps: ["shoulderLength"] }
        ]
        let witchItem = determineList.find(o2 => o2.label === option.fullName) // 找到需要哪个必填项
        if (witchItem) {
          const targetFields = this.tabs.flatMap(tab => tab.tabContent).filter(field => witchItem.ruleProps.includes(field.prop)); // 找到要添加必填校验的字段
          targetFields.forEach(field => {
            this.tempRules[field.prop] = [...field.itemRules] // 存储初始状态的rules
            const trigger = ['input', 'textarea'].includes(field.type) ? 'blur' : 'change'
            field.itemRules.push({ required: true, trigger }) // 添加新的rules
          })
        }
      }
      // this.formLoading = false
    }
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