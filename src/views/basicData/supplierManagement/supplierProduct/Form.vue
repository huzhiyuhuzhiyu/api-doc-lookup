<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <el-page-header @back="goBack" :content="dialogTitle + '供应商产品'" />
          <div class="options" v-if="type != 'look'">
            <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
              保存草稿
            </el-button> -->
            <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main">
          <el-collapse v-model="activeNames" v-if="!approvalFlag">
            <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
              <el-row :gutter="15" class="">
                <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :span="6">
                    <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                      <ComSelect-page clearable :treeNodeClick="treeNodeClick" :isdisabled="type === 'look'"
                        :value="dataForm.cooperativePartnerName" @change="supplierdata" :tableItems="PartnerTableItems"
                        :placeholder="'请选择供应商'" title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                        :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj" :paramsObj="{}"
                        :searchList="PartnerTableSearchList" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="产品" prop="drawingNo" ref="drawingNo">
                      <ComSelect-page clearable @change="addth" :tableItems="ProductTableItems" title="选择产品"
                        :value="dataForm.drawingNo" treeTitle="产品分类" :methodArr="ProductMethodArr"
                        :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
                        :searchList="ProductTableSearchList" :renderTree="false"
                        :listDataFormatting="listDataFormatting" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="协议价(含税)" prop="price">
                      <el-input v-model="dataForm.price" placeholder="协议价(含税)" :disabled="type === 'look'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="协议价(不含税)" prop="excludingTaxPrice">
                      <el-input v-model="dataForm.excludingTaxPrice" placeholder="协议价(不含税)"
                        :disabled="type === 'look'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="税率" prop="taxRate">
                      <el-select v-model="dataForm.taxRate" placeholder="请选择税率" style="width: 100%;"
                        :disabled="type === 'look' ? true : false">
                        <el-option v-for="item in taxRateList" size="small" :key="item.enCode" :label="item.fullName"
                          :value="item.enCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="有效起始时间" prop="effectiveTimeStart">
                      <el-date-picker v-model="dataForm.effectiveTimeStart" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择有效起始时间"
                        :disabled="type == 'look' ? true : false"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="有效结束时间" prop="effectiveTimeEnd">
                      <el-date-picker v-model="dataForm.effectiveTimeEnd" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择有效结束时间"
                        :disabled="type == 'look' ? true : false"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="备注">
                      <el-input v-model="dataForm.remark" type="textarea" placeholder="备注"
                        :disabled="type === 'look'"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {
  getCooperativeData,
  getcategoryTree,
  addPartnerOrProductData
} from '@/api/basicData/index' //供应商数据

import formValidate from '@/utils/formValidate'
import {
  getbuyFixedPointPricingDetail,
  addbuyFixedPointPricing,
  editbuyFixedPointPricing,
  buyFixedPointPricingUploadData
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getcategoryTree as productCategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表

import {
  getApprovalTemplate,
  getApprovalDetailTree,
  busApprovalFlowTree,
  getSaleBusDetail,
  getBusDetail,
  approvalTransferList
} from '@/api/basicData/approvalAdministrator'
import { getbimProductAttributes, getbimProductAttributesList } from '@/api/masterDataManagement/index'
import { getBimProcessList } from '@/api/bimProcess/index'
import { getclassAttributeList } from '@/api/masterDataManagement/index'
import { mapGetters, mapState } from 'vuex'
import { getLabel } from '@/utils/index'
Vue.prototype.$getLabel = getLabel
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'

export default {
  data() {
    return {
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      activeNames: ['productInfo', 'basicInfo'],
      datafilelist: [],
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'supplier' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'name', label: '供应商名称' },
        { prop: 'code', label: '供应商编码' },
        { prop: 'partnerCategoryIdText', label: '所属分类' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'name', label: '供应商名称', type: 'input' },
        { prop: 'code', label: '供应商编码', type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier',
        orderItems: [
          {
            asc: false,
            column: 'code'
          }
        ]
      },
      getCooperativeData,
      activeName: 'jcInfo',
      dialogTitle: '',

      loading: false,
      btnLoading: false,
      organizeIdTree: [],
      index: null,
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        {
          label: '物料分类',
          classAttribute: 'material',
          method: productCategoryTree,
          requestObj: { classAttribute: 'material' }
        }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: 'other',
        productSource: 'purchase',
        productCategoryId: '',
        code: '',
        name: '',
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
        productStatus: 'enable',
        pageNum: 1,
        pageSize: 20,
        queryType: 7
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'drawingNo', label: '品名规格', minWidth: 140 },
        { prop: 'code', label: '产品编码', minWidth: 140 },

        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeName', label: '所属分类', minWidth: 140 },
        { prop: 'mainUnit', label: '单位' },
        { prop: 'colour', label: '颜色' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
        { prop: 'productCode', label: '产品编码', type: 'input' }
      ], // 产品选择弹出框搜索条件

      inquirySheetId: '', //询价单id
      dataForm: {
        approvalCompletionDate: '', //审批完成时间
        approvalStatus: '', // 审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerId: 0, //  供应商id
        cooperativePartnerName: '', //  供应商名称
        cooperativePartnerCode: '',
        drawingNo: '',
        productCode: '',
        productId: '',
        price: '',
        excludingTaxPrice: '',
        taxRate: '',
        effectiveTimeStart: '',
        effectiveTimeEnd: '',
        createBy: '', //
        documentStatus: '', //  单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
        id: 0, //
        listPriceFlag: 0, //是否设置牌价:0否1是
        orderNo: '', //
        reasonRejection: '', //驳回理由
        submitDate: '' //
      },
      codeConfig: {},
      taxRateList: [],
      requestObj2: {
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: -1,
        type: 'supplier'
      },
      type: '',
      dataFormArr: [],
      rules: {
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }],
        drawingNo: [{ required: true, message: '请选择产品', trigger: ['change'] }],
        effectiveTimeStart: [
          { required: true, message: '请选择有效起始日期', trigger: ['change'] },
          { validator: this.checkDate(), trigger: 'change' }
        ],
        effectiveTimeEnd: [
          { required: true, message: '请选择有效结束日期', trigger: ['change'] },
          { validator: this.checkDate2(), trigger: 'change' }
        ],
        taxRate: [
          { required: true, message: '请选择税率', trigger: ['blur'] },
          {
            validator: this.checktaxRate(),
            trigger: 'blur'
          }
        ],
        excludingTaxPrice: [
          { required: true, message: '请输入协议价(不含税)', trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                8,
                '',
                (errMsg) => {
                  this.$message.error('不含税价' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('noZero', '', (errMsg) => {
              this.$message.error('不含税价不能为0')
            }),
            trigger: 'blur'
          }
        ],
        price: [
          { required: true, message: '请输入协议价(含税)', trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('协议价' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('noZero', '', (errMsg) => {
              this.$message.error('协议价不能为0')
            }),
            trigger: 'blur'
          }
        ]
      },

      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },

      formLoading: false,
      pool: '',
      list0: [],
      classAttributeList: [],
      uploadVisib: false,
      isattachmentswitch: ''
    }
  },
  mounted() {
    this.getclassAttributeList()
  },
  created() {

  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token'])
  },
  watch: {},
  methods: {
    checkDate() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：有效起始日期不能超过有效结束日期`
        if (!value) {
          callback()
        } else {
          if (new Date(value) > new Date(this.dataForm.effectiveTimeEnd)) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },
    checkDate2() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：有效结束日期不能超过有效起始日期`
        if (!value) {
          callback()
        } else {
          if (new Date(value) < new Date(this.dataForm.effectiveTimeStart)) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },

    handleFileChange(file) {
      this.file = file.raw
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },

    checktaxRate() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `税率不能超过100`
        if (!value || value == 0) {
          callback()
        } else {
          if (value * 1 > 100) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },

    supplierdata(id, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('cooperativePartnerName')
      })
      if (data.length === 0) {
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
      } else {
        this.dataForm.cooperativePartnerName = data[0].name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].id
      }
    },
    addth(id, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('drawingNo')
      })
      if (data.length === 0) {
        this.dataForm.drawingNo = ''
        this.dataForm.productCode = ''
        this.dataForm.productsId = ''
      } else {
        console.log(data, 'pkkk')
        this.dataForm.drawingNo = data[0].all.drawingNo
        this.dataForm.productCode = data[0].all.code
        this.dataForm.productId = data[0].id
      }
    },

    clearData() {
      this.dataForm.id = ''
    },
    goBack() {
      this.$emit('close')
      if (this.pool == 'fixPool') {
        this.$emit('closePool', true)
      }
    },

    init(id, type, approvalFlag, classAttributeFlag) {
      console.log(id, 'o')
      console.log(type, 'ty')
      console.log(approvalFlag, 'fl')
      console.log(classAttributeFlag, 'class')
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      // this.pool = pool
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type

      this.approvalFlag = approvalFlag

      console.log(this.dataForm, 'form')
      this.getProductClassFun()
    },

    getclassAttributeList() {
      let obj = {
        pageNum: 1,
        pageSize: 20
      }
      getclassAttributeList(obj).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.code
          }
          arr.push(obj)
        })
        this.classAttributeList = arr
      })
    },

    listDataFormatting(res) {
      res.data.records.forEach((item, index) => {
        item.classAttributeName = this.$getLabel(this.classAttributeList, item.classAttribute, 'value', 'label')
      })

      return res.data.records
    },

    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    // 表单提交
    handleConfirm(type) {
      this.request(type)
    },

    async request(type) {
      this.btnLoading = true
      this.dataForm.documentStatus = type

      let msg = ''
      if (this.dataForm.documentStatus === 'draft') {
        msg = '保存成功'
      } else {
        msg = '提交成功'
      }

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(valid, 'cc')
          if (!this.dataForm.id) {
            addPartnerOrProductData(this.dataForm)
              .then((res) => {
                if (res.msg === 'Success') res.msg = '新建成功'
                this.$message({
                  message: msg,
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.btnLoading = false
                    this.$emit('close', true)
                    if (this.pool == 'fixPool') {
                      this.$emit('closePool', true)
                    }
                  }
                })
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            editbuyFixedPointPricing(_data)
              .then((res) => {
                if (res.msg === 'Success') res.msg = '修改成功'
                this.$message({
                  message: msg,
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.btnLoading = false
                    this.$emit('close', true)
                    if (this.pool == 'fixPool') {
                      this.$emit('closePool', true)
                    }
                  }
                })
              })
              .catch(() => {
                this.btnLoading = false
              })
          }
        } else {
          this.btnLoading = false
        }
      })
    },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    //  选择产品弹框传递的数据
    productsSubmit(data) {
      if (this.dataFormTwo.data.length) {
        // this.dataFormTwo.data = this.dataFormTwo.data.filter(item => {
        //   return !data.some(element => element.productsId === item.productsId);
        // });

        // data = data.filter(item1 => this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId) === -1);

        const deletedArray = []
        data = data.filter((item1) => {
          const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
          if (index !== -1) {
            deletedArray.push(item1.productsName)
            if (deletedArray.length) {
              this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
            }
            return false
          }
          return true
        })
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data]
    },

    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b002')
        .then((res) => {
          if (res.data) {
            if (res.data.enabledMark) {
              this.flowData = res.data
              this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
              this.dataForm.approvalFlag = res.data.enabledMark
            } else {
              this.flowTemplateJson = {}
              this.dataForm.approvalFlag = false
              this.$message.error('未找到审批流程！')
            }
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
          }
        })
        .catch(() => { })
    },
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id)
        .then((res) => {
          if (res.data) {
            this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson
              ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson)
              : null
            this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
            this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
            let flowTaskNodeList = res.data.flowTaskNodeList
            if (flowTaskNodeList.length) {
              for (let i = 0; i < flowTaskNodeList.length; i++) {
                const nodeItem = flowTaskNodeList[i]
                const loop = (data) => {
                  if (Array.isArray(data)) data.forEach((d) => loop(d))
                  if (data.nodeId === nodeItem.nodeCode) {
                    if (nodeItem.type == 0) data.state = 'state-past'
                    if (nodeItem.type == 1) data.state = 'state-curr'
                    if (
                      nodeItem.nodeType === 'approver' ||
                      nodeItem.nodeType === 'start' ||
                      nodeItem.nodeType === 'subFlow'
                    )
                      data.content = nodeItem.userName
                    if (nodeItem.nodeType === 'approver') data.processingTime = nodeItem.processingTime
                    return
                  }
                  if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                  if (data.childNode) loop(data.childNode)
                }
                loop(this.flowTemplateJson)
              }
            }
          }
        })
        .catch(() => { })
    }
  }
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  padding-top: 5px;
  /* padding: 0 20px; */
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .workNode {
  background-color: #f5f5f7 !important;
}

.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
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

.JNPF-preview-main .main {
  padding-top: 5px;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
