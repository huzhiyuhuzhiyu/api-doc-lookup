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
          <!-- <el-tab-pane v-for="item in tabs" :key="item.tabCode" :label="item.tabName" :name="item.tabCode"> -->
          <el-collapse v-model="activeNames" v-for="item in tabs" :key="item.tabCode">
            <el-collapse-item v-if="flag" title="型号信息" name="modelInfo" class="orderInfo">
              <JNPF-col v-model="modelForm" ref="modelForm" :tabContent="modelItems" :openMode="openMode" />
            </el-collapse-item>
            <el-collapse-item title="产品信息" name="basicInfo" class="orderInfo">
              <JNPF-col v-model="dataForm" :tabContent="item.tabContent" ref="dataForm" :openMode="openMode" />
            </el-collapse-item>
            <el-collapse-item title="其他信息" name="otherInfo">
              <JNPF-col v-model="dataForm" :tabContent="otherItems" ref="dataForm" :openMode="openMode" />
            </el-collapse-item>
          </el-collapse>
          <!-- </el-tab-pane> -->
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
import { getcategoryTree, getUnitData, detailUnitData } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getbimProductAttributesList, getbimProductsModelList } from '@/api/masterDataManagement/index'

import tabs from './params'
export default {
  data() {
    return {
      datafilelist: [],
      activeName: 'basicInfo',
      activeNames: ['modelInfo', 'basicInfo', 'otherInfo'],
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
        classAttribute: 'finish_product',
        sealingCoverStructure: ''
      },
      steelBallManufacturerOption: [],
      unitRelList: [],
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
      modelForm: {
        model: '',
        innerCircle: '',
        outerCircle: '',
        steelBall: '',
        steelBallNum: '',
        oilNum: '',
        holderNum: '',
        createTime: '',
        createByName: ''
      },
      modelItems: [
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
          itemRules: [{ required: true, trigger: 'change' }],
          itemDisabled: false
        },
        { prop: 'innerCircle', label: '内圈', type: 'input', itemDisabled: true },
        { prop: 'outerCircle', label: '外圈', type: 'input', itemDisabled: true },
        { prop: 'steelBall', label: '钢球型号', type: 'input', itemDisabled: true },
        { prop: 'steelBallNum', label: '钢球用量(粒)', type: 'input', itemDisabled: true },
        { prop: 'oilNum', label: '油脂用量(毫克)', type: 'input', itemDisabled: true },
        { prop: 'holderNum', label: '保持架用量(个)', type: 'input', itemDisabled: true }
      ],
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
        },
        {
          prop: 'bomFlag',
          label: '是否生成BOM',
          value: false,
          type: 'select',
          options: [{ label: '是', value: true }, { label: '否', value: false }],
          clearable: false,
          itemRules: [{ required: true, trigger: 'change' }],
          itemDisabled: false
        }
      ]
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
              classAttribute: 'finish_product'
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
          } else if (tc.prop === 'steelBallManufacturerName') {
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
        // 若干需要选择的产品
        if (
          tc.prop === 'brand' || // 品牌
          tc.prop === 'sealingCoverStructure' ||
          tc.prop === 'sealingCoverTyping' ||
          tc.prop === 'structureType' || // 结构型
          tc.prop === 'clearance' ||
          // || tc.prop === "steelBallManufacturerName" // 钢球家
          tc.prop === 'oil' || //
          tc.prop === 'oilQuantity' || // 油脂量
          tc.prop === 'noise' || // 噪音
          tc.prop === 'holder' || // 保持架
          tc.prop === 'vibrationLevel' || // 振动等级
          tc.prop === 'accuracyLevel' || // 精度等级
          tc.prop === 'colour' || // 颜色
          tc.prop === 'aperture' // 孔径
        ) {
          // tc.dialogTitle = '选择' + tc.label
          // tc.method = getbimProductAttributesList
          // tc.requestObj = { typeCode: tc.typeCode }
          let data = []
          getbimProductAttributesList({ typeCode: tc.typeCode }).then((res) => {
            data = res.data.records.map((item) => {
              return { label: item.name, value: item.name }
            })
            tc.options = data
          })

          tc.clearable = true
          tc.change = (val) => {
            if (this.flag) {
              if (this.dataForm.steelBallManufacturer) {
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
              } else {
                this.dataForm.drawingNo =
                  this.dataForm.model +
                  this.dataForm.sealingCoverStructure +
                  this.dataForm.structureType +
                  '.' +
                  this.dataForm.clearance +
                  this.dataForm.oil +
                  this.dataForm.noise +
                  this.dataForm.holder
              }
            }
          }
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
        }
        if (tc.prop === 'productSource') {
          tc.change = (val) => {
            if (val == 'assemble') {
              this.dataForm.bomFlag = true
            } else {
              this.dataForm.bomFlag = false
            }
          }
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
    this.modelItems.forEach((tc) => {
      if (tc.prop == 'model') {
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
        tc.change = (val, data, paramsObj) => {
          this.modelForm.model = data[0].all.model
          this.dataForm.model = data[0].all.model
          const obj = {
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
            model: this.modelForm.model
          }
          getbimProductsModelList(obj).then((res) => {
            this.modelForm = res.data.records[0]
          })
        }
      }
    })
    this.otherItems.forEach((tc) => {
      if (tc.prop == 'tradeFlag') {
        tc.change = (val, data) => {
          if (this.flag) {
            if (!val) {
              this.tabs[0].tabContent.forEach((ele) => {
                if (
                  [
                    'sealingCoverStructure',
                    // 'sealingCoverTyping',
                    'structureType',
                    'clearance',
                    'steelBallManufacturerName',
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
                    'steelBallManufacturerName',
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
      }
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
        if (this.flag) {
          if (this.dataForm.steelBallManufacturer) {
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
          } else {
            this.dataForm.drawingNo =
              this.dataForm.model +
              this.dataForm.sealingCoverStructure +
              this.dataForm.structureType +
              '.' +
              this.dataForm.clearance +
              this.dataForm.oil +
              this.dataForm.noise +
              this.dataForm.holder
          }
        }
      } else {
        // 不选择任何内容，置空绑定的值
        this.dataForm[paramsObj.prop] = ''
      }
    },
    ProductChange(val, data, paramsObj) {
      this.$nextTick(() => {
        this.$refs['dataForm'][paramsObj.tabInd].$children[0].validateField(paramsObj.prop)
      })
      if (data && data.length) {
        // 数据有效，进行更新

        this.dataForm[paramsObj.prop] = data[0].all.name
      } else {
        // 不选择任何内容，置空绑定的值
        this.dataForm[paramsObj.prop] = ''
      }
    },
    // 钢球厂家
    steelBallChange(val, data, paramsObj) {
      this.$nextTick(() => {
        this.$refs['dataForm'][paramsObj.tabInd].$children[0].validateField(paramsObj.prop)
      })
      if (data && data.length) {
        // 数据有效，进行更新
        this.dataForm[paramsObj.prop] = data[0].all.name
        this.dataForm.steelBallManufacturer = data[0].all.code
        if (this.flag) {
          if (this.dataForm.steelBallManufacturer) {
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
          } else {
            this.dataForm.drawingNo =
              this.dataForm.model +
              this.dataForm.sealingCoverStructure +
              this.dataForm.structureType +
              '.' +
              this.dataForm.clearance +
              this.dataForm.oil +
              this.dataForm.noise +
              this.dataForm.holder
          }
        }
      } else {
        // 不选择任何内容，置空绑定的值
        this.dataForm[paramsObj.prop] = ''
      }
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (!data.modifyFlag && data.codeWay == 'auto') {
          this.dataForm.code = data.number
          let target = this.tabs[0].tabContent.find((tc) => tc.prop === 'code')
          target.itemDisabled = true
        }
      } catch (error) { }
    },
    async init(id, btnType = false, flag) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.flag = flag
      if (flag) {
        this.tabs[0].tabContent.forEach((ele) => {
          if (
            [
              'sealingCoverStructure',
              // 'sealingCoverTyping',
              'structureType',
              'clearance',
              'steelBallManufacturerName',
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
          if (ele.prop == 'model') {
            ele.render = true
            ele.itemDisabled = true
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
              'steelBallManufacturerName',
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
            ele.options = [
              { label: '组装', value: 'assemble' },
              { label: '生产', value: 'produce' },
              { label: '采购', value: 'purchase' },
              { label: '外协', value: 'out' }
            ]
          }
          if (ele.prop == 'model') {
            ele.render = false
          }
        })
      }
      // getByCode('CPBM').then((res) => {
      //   this.businessType = res.data.codeWay
      //   if (this.businessType !== 'input') {
      //     let target = this.tabs[0].tabContent.find((tc) => tc.prop === 'code')
      //     target.render = false
      //   }
      // })
      if (!!id) {
        this.dataForm.id = id
        this.title = btnType ? '查看成品档案' : '编辑成品档案'
        const steelBallRes = await getCooperativeData(this.PartnerListRequestObj)

        this.steelBallManufacturerOption = steelBallRes.data.records

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

          this.steelBallManufacturerOption.forEach((item) => {
            if (item.code == this.dataForm.steelBallManufacturer) {
              this.dataForm.steelBallManufacturerName = item.name
            }
          })
          if (btnType) {
            this.tabs[0].tabContent.forEach((tc) => {
              if (
                [
                  'productCategoryName',
                  'code',
                  'drawingNo',
                  'model',
                  'sealingCoverStructure',
                  'structureType',
                  'sealingCoverTyping',
                  'clearance',
                  'steelBallManufacturerName',
                  'oil',
                  'noise',
                  'holder',
                  'productSource'
                ].includes(tc.prop)
              ) {
                tc.itemDisabled = true
              }
              this.jnpf.getBillRuleConfigFun('CPBM').then((res) => {
                if (!res.modifyFlag) {
                  if (tc.prop === 'code') tc.itemDisabled = true
                }
              })
            })
          } else {
            // 编辑时，如果已经品名规格那些，不允许修改
            this.tabs[0].tabContent.forEach((tc) => {
              if (
                [
                  'productCategoryName',
                  'code',
                  'drawingNo',
                  'model',
                  // 'sealingCoverStructure',
                  // 'structureType',
                  // 'sealingCoverTyping',
                  // 'clearance',
                  // 'steelBallManufacturerName',
                  // 'oil',
                  // 'noise',
                  // 'holder',
                  'productSource'
                ].includes(tc.prop)
              ) {
                tc.itemDisabled = true
              }

              this.jnpf.getBillRuleConfigFun('CPBM').then((res) => {
                if (!res.modifyFlag) {
                  if (tc.prop === 'code') tc.itemDisabled = true
                }
              })
            })
          }

          this.modelForm.model = this.dataForm.model
          const obj = {
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
            model: this.modelForm.model
          }
          getbimProductsModelList(obj).then((res) => {
            this.modelForm = res.data.records[0]
          })
          let target = this.modelItems.find((tc) => tc.prop === 'model')
          target.itemDisabled = true

          let targetOther = this.otherItems.find((tc) => tc.prop === 'bomFlag')
          targetOther.itemDisabled = true

          this.formLoading = false
        })
      } else {
        this.title = '新建成品档案'

        this.fetchData('CPBM')
        this.formLoading = false
      }
    },
    async handleConfirm() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断
      if (this.$refs['modelForm']) {
        for (let i = 0; i < this.$refs['modelForm'].length; i++) {
          const item = this.$refs['modelForm'][i]

          const form = item.$refs.main
          const valid_1 = await form.validate().catch(() => false)
          if (!valid_1 && submitFlag) {
            submitFlag = false
            this.activeName = this.tabs[i].tabCode
            this.jnpf.focusErrValidItem(form.fields)
          }
        }
      }

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
        if (this.flag) {
          if (this.dataForm.steelBallManufacturer) {
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
          } else {
            this.dataForm.drawingNo =
              this.dataForm.model +
              this.dataForm.sealingCoverStructure +
              this.dataForm.structureType +
              '.' +
              this.dataForm.clearance +
              this.dataForm.oil +
              this.dataForm.noise +
              this.dataForm.holder
          }
        }
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
// .main {
//   padding: 0px 20px;
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
</style>
