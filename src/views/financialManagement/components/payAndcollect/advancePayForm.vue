<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="dialogTitle" />
          <div class="options" v-if="type != 'look'">
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提 交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-tabs v-model="activeName">
            <!-- <el-tab-pane label="基础信息" name="jcInfo"> -->
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15">
                    <el-form ref="elForm" :model="dataForm" :rules="dataRules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :span="12">
                        <el-form-item label="供应商名称" prop="partnerName" ref="partnerName">
                          <ComSelect-page :treeNodeClick="treeNodeClick" :isdisabled="type === 'look'"
                            v-model="dataForm.partnerName" ref="ComSelect-page" @change="supplierdata"
                            :tableItems="PartnerTableItems" :placeholder="'请选择供应商'" title="选择供应商" treeTitle="供应商分类"
                            :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                            :listRequestObj="PartnerListRequestObj" :paramsObj="{}"
                            :searchList="PartnerTableSearchList" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="showLabel + '款金额(元)'" prop="paymentAmount">
                          <el-input v-model="dataForm.paymentAmount" :placeholder="'请输入' + showLabel + '款金额'"
                            :disabled="type === 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="showLabel + '款方式'" prop="paymentMethod">
                          <el-select v-model="dataForm.paymentMethod" :placeholder="'请选择' + showLabel + '款方式'"
                            style="width: 100%;" :disabled="type === 'look' ? true : false">
                            <el-option v-for="(item, index) in paymentMethodList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item :label="showLabel + '款日期'" prop="paymentDate">
                          <el-date-picker v-model="dataForm.paymentDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" :placeholder="'请选择' + showLabel + '款日期'"
                            :disabled="type == 'look' ? true : false"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200"
                            :disabled="type === 'look' ? true : false" :placeholder="type === 'look' ? '' : '请输入备注'" />
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            <!-- </el-tab-pane> -->
            <el-tab-pane :label="showLabel + '款抵扣'" name="pay" v-if="type === 'look' && showTab">
              <div style="display: flex;flex-direction: column;height: 100%;">
                <JNPF-table fixedNO :partentOrChild="'child'" v-loading="formLoading" :data="payData" custom-column
                  ref="payRef" show-summary :summary-method="getSummaries">
                  <el-table-column prop="orderNo" label="对账单号" min-width="160" />
                  <el-table-column prop="paymentAmount" label="抵扣金额(元)" min-width="160" />
                  <el-table-column prop="paymentDate" label="抵扣日期" min-width="180" />
                  <el-table-column prop="remark" label="备注" min-width="160" />
                  <el-table-column prop="createTime" label="创建时间" min-width="160" />
                  <el-table-column prop="createByName" label="创建人" min-width="140" />
                </JNPF-table>
                <pagination :total="total" :page.sync="payForm.pageNum" :background="background"
                  :limit.sync="payForm.pageSize" @pagination="initData()" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getCooperativeData, getcategoryTree } from '@/api/basicData/index' //供应商数据

import formValidate from '@/utils/formValidate'
import { addfinPaymentRecords, getfinPaymentReport } from '@/api/financialManagement/index'
import { mapGetters, mapState } from 'vuex'
export default {
  props: {
    reconciliationType: {
      type: String,
      required: true
    },
    PartnerMethodArr: {
      type: Object,
      default: () => { }
    },
    PartnerTableItems: {
      type: Array,
      default: () => []
    },
    PartnerTableSearchList: {
      type: Array,
      default: () => []
    },
    PartnerListRequestObj: {
      type: Object | Function,
      required: true
      /* 
        对象写法：{ code: "", name: "", orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        函数写法：(rowIndex) => {
          let id = this.linesList[rowIndex].id
          return { id, orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
        }
      */
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    showLabel() {
      let label = this.reconciliationType !== 'receivable' ? '付' : '收'
      return label
    },
    showTitle() {
      let title =
        this.reconciliationType === 'receivable'
          ? '销售预收款'
          : this.reconciliationType === 'payable'
            ? '采购预付款'
            : '外协预付款'
      return title
    }
  },
  data() {
    return {
      formLoading: false,
      background: true, //分页器背景颜色
      getCooperativeData,
      activeName: 'jcInfo',
      activeNames: ['basicInfo'],
      dialogTitle: '',
      loading: false,
      btnLoading: false,
      // 提交参数
      dataForm: {
        cooperativePartnerId: '',
        id: '',
        paymentAmount: '', //	收付款金额    新增时 收付款金额 = 预收付剩余金额
        paymentDate: '',
        paymentMethod: '',
        reconciliationType: '',
        sourcePaymentRecordsId: '',
        remainingAmount: '', // 预收付剩余金额
        partnerName: '',
        partnerCode: '',
        remark: ''
      },
      paymentMethodList: [{ label: '转账', value: 'transfer_accounts' }, { label: '汇票', value: 'draft' }],
      type: '',
      dataRules: {
        partnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }],
        paymentMethod: {
          required: true,
          message: this.reconciliationType != 'receivable' ? '请选择付款方式' : '请选择收款方式',
          trigger: 'change'
        },
        paymentDate: [
          {
            required: true,
            message: this.reconciliationType != 'receivable' ? '请选择付款日期' : '请选择收款日期',
            trigger: 'change'
          }
        ],
        paymentAmount: [
          {
            required: true,
            message: this.reconciliationType != 'receivable' ? '请输入付款金额' : '请输入收款金额',
            trigger: 'blur'
          },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, ''] }), trigger: 'blur' },
          // { validator: this.numCalcMethod(), trigger: 'blur' },
          {
            validator: this.formValidate(
              'noZero',
              `${this.reconciliationType != 'receivable' ? '付' : '收'}款金额不能为0`
            ),
            trigger: 'blur'
          }
        ]
      },
      payData: [],
      payForm: {
        cooperativePartnerId: '',
        createByName: '',
        endTime: '',
        keyword: '',
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
        orderNo: '',
        pageNum: 1,
        pageSize: 20,
        reconciliationDate: '',
        paymentEndDate: '',
        paymentStartDate: '',
        reconciliationType: '',
        startTime: '',
        paymentDateArr: [],
        createTimeArr: [],
        sourcePaymentRecordsId: ''
      },
      totalList: [],
      total: 0,
      showTab: false
    }
  },

  methods: {
    // 供应商树节点点击事件
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    goBack() {
      this.$emit('close', true)
    },
    // 合计处理
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = this.totalList.map((item) => (item[column.property] ? Number(item[column.property]) : ''))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          })
          // sums[index] += '';
        } else {
          sums[index] = null
        }
      })
      return sums
    },
    init(row, type) {
      console.log(row)
      this.showTab = false // 展示是否有抵扣列表
      this.payForm.sourcePaymentRecordsId = row.id || ''
      this.dialogTitle = type === 'look' ? '查看' + this.showTitle : '新建' + this.showTitle
      this.type = type
      this.formLoading = true
      if (row) {
        this.dataForm = row
      }
      this.$refs['elForm'].resetFields()
      if (this.type === 'look' && row.paymentAmount != row.remainingAmount) {
        this.showTab = true
        this.initData()
      } else {
        this.formLoading = false
      }
    },
    // 供应商传递数据
    supplierdata(id, data) {
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('partnerName')
      })
      if (data.length === 0) {
      } else {
        this.dataForm.cooperativePartnerId = id
        this.dataForm.partnerName = data[0].name
        this.dataForm.partnerCode = data[0].all.code
      }
    },
    // 详情页面  有预抵扣金额时 需看到抵扣列表数据
    initData() {
      this.totalList = []
      getfinPaymentReport(this.payForm).then((res) => {
        this.payData = res.data.page ? res.data.page.records : []
        res.data.total ? this.totalList.push(res.data.total) : ''
        this.total = res.data.page ? res.data.page.total : 0
        this.formLoading = false
      })
    },
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true // 校验
      let elForm = this.$refs['elForm']
      // 检验必填项
      let valid = await elForm.validate().catch((err) => false)
      if (!valid && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(elForm.fields)
      }
      if (submitFlag) {
        this.dataForm.reconciliationType = this.reconciliationType
        this.payForm.reconciliationType = this.reconciliationType
        this.dataForm.remainingAmount = this.dataForm.paymentAmount
        let _data = {
          paymentRecords: this.dataForm
        }
        const res = await addfinPaymentRecords(_data)
        if (res.msg === 'Success') {
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.formLoading = false
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        } else {
          this.btnLoading = false
        }
      }
    }
  }
}
</script>

<style scoped>
.main {
  padding: 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  /* padding: 0 20px; */
}

::v-deep .el-tabs__header {
  /* padding-left: 10px !important; */
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep #pane-pay {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
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
</style>
