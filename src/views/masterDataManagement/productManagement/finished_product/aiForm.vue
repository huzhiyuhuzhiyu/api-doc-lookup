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
          <!-- <el-tab-pane label="基础信息" name="basicInfo"> -->
          <JNPF-col-table
            v-model="sleeveList"
            ref="sleeveForm"
            :tableItems="sleeveItems"
            :openMode="openMode"
            @addth="addSleeveList"
            @deleteth="deleteth"
          />
          <!-- </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  detailProduct,
  cpAiAddProduct,
  updateProductData,
  checkCodeExist,
  checkModelExist
} from '@/api/masterDataManagement/productManage'
import { getCooperativeData, getcategoryTree as getcategoryCoop, getBimBusinessInfo } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getbimProductAttributesList, getbimProductsModelList } from '@/api/masterDataManagement/index'
import formValidate from '@/utils/formValidate'
export default {
  data() {
    return {
      datafilelist: [],
      activeName: 'basicInfo',
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
      businessType: '', //  参数设置  自动  还是 手输
      productCategoryList: [],
      // 下拉框联想数据项
      productionLotList: [],
      sleeveList: [
        {
          id: '',
          productCategoryName: '',
          productCategoryId: '',
          code: '',
          drawingNo: '',
          name: '',
          mainUnit: '套',
          deputyUnit: '套',
          ratio: 1,
          calculationDirection: 'multiplication',
          productSource: 'assemble',
          productStatus: 'enable',
          brand: '',
          model: '',
          sealingCoverStructure: '',
          sealingCoverTyping: '',
          structureType: '',
          clearance: '',
          steelBallManufacturer: '',
          oil: '',
          oilQuantity: '',
          noise: '',
          holder: '',
          vibrationLevel: '',
          accuracyLevel: '',
          colour: '',
          aperture: '',
          remark: '',
          classAttribute: 'finish_product'
        }
      ],
      sleeveItems: [
         // 选择型号 带出 密封盖 结构 打字 结构类型 游隙 钢球厂家 油脂 噪音 保持架
         {
          prop: 'model',
          label: '型号',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-list',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}行：型号${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' }
          ],
          itemDisabled: false
        },
        {
          prop: 'sealingCoverStructure',
          label: '密封盖-结构',
          typeCode: 'pa012',
          value: '',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}行：密封盖-结构${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' }
          ],
          itemDisabled: false
        },
        {
          prop: 'sealingCoverTyping',
          label: '密封盖-打字',
          value: '',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur,
          typeCode: 'pa007'
        },
        {
          prop: 'structureType',
          label: '结构类型',
          value: '',
          typeCode: 'pa013',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}行：结构类型${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' }
          ],
          itemDisabled: false
        },
        {
          prop: 'clearance',
          label: '游隙',
          value: '',
          type: 'select',
          typeCode: 'pa001',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 120,
          blur: this.elementBlur,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}行：游隙${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' }
          ],
          itemDisabled: false
        },
        {
          prop: 'steelBallManufacturer',
          label: '钢球厂家',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-page',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}行：钢球厂家${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' }
          ],
          itemDisabled: false,
          minWidth: 180
        },
        {
          prop: 'oil',
          label: '油脂',
          value: '',
          typeCode: 'pa002',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}行：油脂${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' }
          ],
          itemDisabled: false
        },
        {
          prop: 'oilQuantity',
          label: '油脂量',
          value: '',
          typeCode: 'pa003',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur
        },
        {
          prop: 'noise',
          label: '噪音',
          value: '',
          typeCode: 'pa014',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}行：噪音${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' }
          ],
          itemDisabled: false
        },
        {
          prop: 'holder',
          label: '保持架',
          value: '',
          typeCode: 'pa004',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}行：保持架${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' }
          ],
          itemDisabled: false
        },
      
        {
          prop: 'drawingNo',
          label: '品名规格',
          value: '',
          type: 'input',
          maxlength: '1000',
          itemDisabled: true,
          minWidth: 220,
          placeholder: '品名规格自动生成'
        },
        {
          prop: 'code',
          label: '产品编码',
          minWidth: 180,
          value: '',
          type: 'input',
          itemRules: [
            { required: true, trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                let temp = rule.field.match(/\d+/)
                let tempIndex = temp ? Number(temp[0]) : undefined
                if (!value) {
                  callback()
                } else if (this.sleeveList.some((item, index) => item.code === value && tempIndex !== index)) {
                  this.$message.error(`第${tempIndex + 1}行产品编码重复`)
                  callback(new Error(`第${tempIndex + 1}行产品编码重复`))
                } else {
                  checkCodeExist({ id: this.sleeveList[tempIndex].id || '', code: value })
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        this.$message.error(`第${tempIndex + 1}行产品编码重复`)
                        callback(new Error(`第${tempIndex}行产品编码重复`))
                      }
                    })
                    .catch((err) => {
                      callback(new Error(' '))
                    })
                }
              },
              trigger: 'blur'
            }
          ],
          render: true,
          itemDisabled:false
        },
        {
          prop: 'productCategoryName',
          label: '产品分类',
          value: '',
          type: 'custom',
          customComponent: 'ComSelect-list',
          change: this.remoteProductMethod,
          requestObj: { classAttribute: 'finish_product' },
          method: getcategoryTree,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '不能为空',
                  (errMsg, index) => {
                    this.$message.error(`基础信息第${index + 1}行：产品分类${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, message: '请选择产品分类', trigger: 'no' }
          ],
          minWidth: 180
        },
       
        {
          prop: 'name',
          label: '产品名称',
          value: '',
          type: 'input',
          maxlength: 100,
          itemRules: [{ required: true, trigger: 'blur' }],
          minWidth: 180
        },
        {
          prop: 'mainUnit',
          label: '主单位',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          minWidth: 180
        },
        {
          prop: 'deputyUnit',
          label: '副单位',
          value: '',
          type: 'input',
          itemRules: [{ required: true, trigger: 'blur' }],
          minWidth: 180
        },
        {
          prop: 'ratio',
          label: '转换系数',
          value: '',
          type: 'input',
          itemRules: [
            { required: true, trigger: 'blur' },
            { validator: formValidate({ type: 'decimal', params: [10, 6] }), trigger: 'blur' },
            { validator: formValidate('positiveNumber'), trigger: 'blur' }
          ],
          minWidth: 180
        },
        {
          prop: 'calculationDirection',
          label: '计算方向',
          value: '',
          type: 'select',
          options: [{ label: '乘', value: 'multiplication' }, { label: '除', value: 'division' }],
          itemRules: [{ required: true, trigger: 'change' }],
          minWidth: 180
        },
        {
          prop: 'productSource',
          label: '产品来源',
          value: '',
          type: 'select',
          options: [
            { label: '组装', value: 'assemble' },
            { label: '自制', value: 'produce' },
            { label: '采购', value: 'purchase' },
            { label: '外协', value: 'out' }
          ],
          itemRules: [{ required: true, trigger: 'change' }],
          minWidth: 180
        },
        {
          prop: 'productStatus',
          label: '产品状态',
          value: 'enable',
          type: 'select',
          options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }],
          itemRules: [{ required: true, trigger: 'change' }],
          minWidth: 180,
          render:true
        },

        //  一下全部都是 custom，组件选择
        {
          prop: 'brand',
          label: '品牌',
          value: '',
          typeCode: 'pa011',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 220,
          blur: this.elementBlur,
          minWidth: 180
        },
       
       
        {
          prop: 'vibrationLevel',
          label: '振动等级',
          value: '',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          minWidth: 180,
          blur: this.elementBlur,
          typeCode: 'pa005',
          minWidth: 180
        },
        {
          prop: 'accuracyLevel',
          label: '精度等级',
          value: '',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          blur: this.elementBlur,
          typeCode: 'pa006',
          minWidth: 180
        },
        {
          prop: 'colour',
          label: '颜色',
          value: '',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          blur: this.elementBlur,
          typeCode: 'pa010',
          minWidth: 180
        },
        {
          prop: 'aperture',
          label: '孔径',
          value: '',
          type: 'select',
          options: [],
          filterable: true,
          remote: true,
          maxlength: 50,
          blur: this.elementBlur,
          typeCode: 'pa009',
          minWidth: 180
        },

        { prop: 'remark', label: '备注', value: '', type: 'input', sm: 24, minWidth: 220 }
      ]
    }
  },
  created() {
    this.sleeveItems.forEach((tc) => {
      // this.dataForm[tc.prop] = tc.value || '' // 设置默认value
      // 添加自定义表单元素方法和参数
      if (tc.type == 'custom') {
        // 产品分类
        if (tc.prop === 'productCategoryName') {
          tc.method = getcategoryTree
          tc.requestObj = {
            classAttribute: 'finish_product'
          }
          getcategoryTree(tc.requestObj).then((res) => {
            if (res.data && !res.data[0].childrenList.length) {
              // this.$nextTick(() => {
              //   this.$refs['dataForm'][0].$children[0].validateField('productCategoryName')
              // })
              this.sleeveList.forEach((item) => {
                item['productCategoryId'] = res.data[0].id
                item['productCategoryName'] = res.data[0].name
              })
            } else {
              this.sleeveList.forEach((item) => {
                item['productCategoryId'] = ''
                item['productCategoryName'] = ''
              })
              tc.dataFormatting = (res) => res.data[0].childrenList
            }
          })
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
          // tc.paramsObj = { prop: tc.prop, tabInd }
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
          // tc.paramsObj = { prop: tc.prop, tabInd }
        } else {
          console.warn(tc.prop + '不在判断条件内')
        }
      }
      // 若干需要选择的产品
      if (
        tc.prop === 'brand' || // 品牌
        tc.prop === 'sealingCoverStructure' ||
        tc.prop === 'sealingCoverTyping' ||
        tc.prop === 'structureType' || // 结构型
        tc.prop === 'clearance' ||
        // || tc.prop === "steelBallManufacturer" // 钢球家
        tc.prop === 'oil' || //
        tc.prop === 'oilQuantity' || // 油脂量
        tc.prop === 'noise' || // 噪音
        tc.prop === 'holder' || // 保持架
        tc.prop === 'vibrationLevel' || // 振动等级
        tc.prop === 'accuracyLevel' || // 精度等级
        tc.prop === 'colour' || // 颜色
        tc.prop === 'aperture' // 孔径
      ) {
        let data = []
        getbimProductAttributesList({ typeCode: tc.typeCode }).then((res) => {
          data = res.data.records.map((item) => {
            return { label: item.name, value: item.name }
          })
          tc.options = data
        })

        tc.clearable = true

        this.sleeveList[0][tc.prop] = tc.options[0]
        // tc.change = this.ProductChange
        // tc.paramsObj = { prop: tc.prop, tabInd }
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
      if (
        tc.prop === 'name' || 
        tc.prop === 'brand' || // 品牌
        tc.prop === 'mainUnit' || 
        tc.prop === 'deputyUnit' || 
        tc.prop === 'ratio' || 
        tc.prop === 'calculationDirection' || 
        tc.prop === 'productSource' || 
        tc.prop === 'productStatus' || 
        tc.prop === 'vibrationLevel' || // 振动等级
        tc.prop === 'accuracyLevel' || // 精度等级
        tc.prop === 'colour' || // 颜色
        tc.prop === 'aperture' || // 孔径
        tc.prop === 'remark'
      ){
        tc.render = false
      }

    })
  },
  computed: {
    openMode() {
      return this.title === '新建成品档案' ? '新建' : this.title === '编辑成品档案' ? '编辑' : '只读'
    }
  },
  methods: {
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (!data.modifyFlag && data.codeWay == 'auto') {
          let target = this.sleeveItems.find((tc) => tc.prop === 'code')
          this.sleeveList[0].code = data.number
          target.itemDisabled = true
        }
      } catch (error) {}
    },
    // 选择型号 带出 密封盖 结构 打字 结构类型 游隙 钢球厂家 油脂 噪音 保持架
    modelChange(val, data, paramsObj) {
      if (data && data.length) {
        // 数据有效，进行更新

        // this.dataForm[paramsObj.prop] = data[0].all.model
        this.sleeveList.forEach((item) => {
          item['model'] = data[0].all.model
        })
      } else {
        // 不选择任何内容，置空绑定的值
        this.sleeveList.forEach((item) => {
          item['model'] = ''
        })
      }
    },
    // 钢球厂家
    steelBallChange(val, data, paramsObj) {
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
      // getBimBusinessInfo('460907390338859014').then(res => {
      //   this.businessType = res.data.configValue1
      //   if (this.businessType === '1') {
      //     let target = this.sleeveItems.find(tc => tc.prop === 'code')
      //     target.render = false
      //   }
      // })
      this.fetchData('bm_cp_cp')
      this.title = '新建成品档案'
      this.formLoading = false
    },
    async handleConfirm() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断
      if (!this.sleeveList.length) {
        this.$message.error('请至少添加一条产品信息')
        this.btnLoading = false
        submitFlag = false
        return
      }
      // 校验表格表单（
      let form = this.$refs['sleeveForm'].$refs.main
      let valid_3 = await form.validate().catch((err) => false)
      if (!valid_3 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form.fields)
      }
      // 判断条件后发送请求
      if (submitFlag) {
        let _data = this.sleeveList.map((item) => {
          return {
            ...item,
            drawingNo:
              item.model +
              item.sealingCoverStructure +
              item.structureType +
              '.' +
              item.clearance +
              item.steelBallManufacturer +
              item.oil +
              item.noise +
              item.holder
          }
        })
        const formMethod = this.dataForm.id ? updateProductData : cpAiAddProduct
        formMethod(_data)
          .then((res) => {
            let msg = res.msg
            if (res.msg === 'Success') {
              msg = formMethod == cpAiAddProduct ? '新建成功' : '修改成功'
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
      this.$emit('close', true)
    },
    // 对应套筒新增行
    async addSleeveList() {
      let index = this.sleeveList.length
      const data = await this.jnpf.getBillRuleConfigFun('bm_cp_cp')
      this.sleeveList.push({
        index,
        id: '',
        productCategoryName: '',
        productCategoryId: '',
        code: data.number,
        drawingNo: '',
        name: '',
        mainUnit: '套',
        deputyUnit: '套',
        ratio: 1,
        calculationDirection: 'multiplication',
        productSource: 'assemble',
        productStatus: 'enable',
        brand: '',
        model: '',
        sealingCoverStructure: '',
        sealingCoverTyping: '',
        structureType: '',
        clearance: '',
        steelBallManufacturer: '',
        oil: '',
        oilQuantity: '',
        noise: '',
        holder: '',
        vibrationLevel: '',
        accuracyLevel: '',
        colour: '',
        aperture: '',
        remark: '',
        classAttribute: 'finish_product'
      })
    },
    // 对应套筒删除当前行
    deleteth(row, index) {
      this.sleeveList.splice(row.$index, 1)
    },
    elementBlur(e) {
      setTimeout(() => {
        this.sleeveItems.forEach((o) => {
          if (o.type === 'filterable') {
            o.options = []
          }
        })
      }, 100)
    },
    // 选择产品分类
    remoteProductMethod(val, data, paramsObj) {
      if (!data || !data.length) {
        this.sleeveList[paramsObj.scope.$index].productCategoryName = ''
        this.sleeveList[paramsObj.scope.$index].productCategoryId = ''
      } else {
        this.sleeveList[paramsObj.scope.$index].productCategoryName = data[0].all.name
        this.sleeveList[paramsObj.scope.$index].productCategoryId = data[0].all.id
      }
    },
    // 选择密封盖 结构 打字 结构类型 游隙 ��球厂家 油脂 噪音 保持架
    remoteMethod(query, scope) {
      getbimProductAttributesList({
        keyword: query,
        pageNum: 1,
        pageSize: -1,
        typeCode: scope.typeCode
      }).then((res) => {
        this.productionLotList = res.data.records.map((item) => {
          return { label: item.code, value: item.code }
        })
        let option = this.sleeveItems.find((o) => o.typeCode === scope.typeCode)
        option.options = this.productionLotList
      })
    },
    // 型号
    modelRemoteMethod(query, scope) {
      getbimProductsModelList({
        keyword: query,
        pageNum: 1,
        pageSize: -1
      }).then((res) => {
        this.productionLotList = res.data.records.map((item) => {
          return { label: item.model, value: item.model }
        })
        let option = this.sleeveItems.find((o) => o.prop === 'model')
        option.options = this.productionLotList
      })
    },
    steelRemoteMethod(query, scope) {
      getCooperativeData({
        keyword: query,
        pageNum: 1,
        pageSize: -1,
        type: 'supplier'
      }).then((res) => {
        this.productionLotList = res.data.records.map((item) => {
          return { label: item.code, value: item.code }
        })
        let option = this.sleeveItems.find((o) => o.prop === 'steelBallManufacturer')
        option.options = this.productionLotList
      })
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
