<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="dialogTitle + `账单`" />
          <!-- <div class="options" v-if="type != 'look'">
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div> -->
        </div>
        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>基本信息</h5>
              </div>
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="对账流水号" prop="orderNo" ref="orderNo">
                      <el-input v-model="dataForm.orderNo" placeholder="请输入对账单号"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="客户" prop="cooperativePartnerName" ref="cooperativePartnerName">
                      <el-input v-model="dataForm.cooperativePartnerName" placeholder="请输入客户名称"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>



                  <el-col :sm="8" :xs="24">
                    <el-form-item label="对账日期" prop="reconciliationDate" ref="reconciliationDate">
                      <!-- <el-input v-model="dataForm.reconciliationDate" placeholder="请选择报价有效期" clearable
                        :style='{ "width": "100%" }' maxlength="20" :disabled="type == 'look'"></el-input> -->

                      <el-date-picker v-model="dataForm.reconciliationDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择对账日期" :disabled="type == 'look' ? true : false">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="订单金额" prop="includingTaxAmount" ref="includingTaxAmount">
                      <el-input v-model="dataForm.includingTaxAmount" placeholder="请输入订单金额"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="对账应收金额" prop="totalReconciliationAmount" ref="totalReconciliationAmount">
                      <el-input v-model="dataForm.totalReconciliationAmount" :placeholder="dataForm.totalReconciliationAmount ? dataForm.totalReconciliationAmount : 0"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="已收款金额" prop="totalPaymentAmount" ref="totalPaymentAmount">
                      <el-input v-model="dataForm.totalPaymentAmount" :placeholder="dataForm.totalPaymentAmount ? dataForm.totalPaymentAmount : 0"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="未收款金额" prop="totalUnpaidAmount" ref="totalUnpaidAmount">
                      <el-input v-model="dataForm.totalUnpaidAmount" :placeholder="dataForm.totalUnpaidAmount ? dataForm.totalUnpaidAmount : 0"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="已开票金额" prop="totalInvoicingAmount" ref="totalInvoicingAmount">
                      <el-input v-model="dataForm.totalInvoicingAmount" :placeholder="dataForm.totalInvoicingAmount ? dataForm.totalInvoicingAmount : 0"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="未开票金额" prop="totalNotInvoicedAmount" ref="totalNotInvoicedAmount">
                      <el-input v-model="dataForm.totalNotInvoicedAmount" :placeholder="dataForm.totalNotInvoicedAmount ? dataForm.totalNotInvoicedAmount : 0"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="type === 'look'">
                    <el-form-item label="创建时间" prop="createTime" ref="createTime">
                      <el-time-select style="width: 100%;" :disabled="type == 'look' ? true : false"
                        v-model="dataForm.createTime" placeholder="创建时间">
                      </el-time-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="type === 'look'">
                    <el-form-item label="创建人" prop="createByName" ref="createByName">
                      <el-input type="text" v-model="dataForm.createByName" placeholder="请输入创建人" maxlength="20"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注" prop="remark" ref="remark">
                      <el-input :disabled="type == 'look' ? true : false" type="textarea" :rows="3" maxlength="200"
                        v-model="dataForm.remark" placeholder="请输入备注">
                      </el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>对账信息</h5>
              </div>

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" hasC hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table">
                  <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

                  <el-table-column prop="ordersNo" label="订单号" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'ordersNo'">
                        <div class="viewData">
                          <span>{{ scope.row.ordersNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="confirmReceiptRecordsOrderNo" label="发退货通知单号" min-width="180"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'confirmReceiptRecordsOrderNo'">
                        <div class="viewData">
                          <span>{{ scope.row.confirmReceiptRecordsOrderNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                        <div class="viewData">
                          <span>{{ scope.row.productCode?scope.row.productCode:"调价" }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                        <div class="viewData">
                          <span>{{ scope.row.productName?scope.row.productName:"调价" }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drawingNo" label="产品图号" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">

                        <div class="viewData">
                          <span>{{ scope.row.drawingNo?scope.row.drawingNo:"调价" }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="reconciliationUnitPrice" label="数量" min-width="140">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'reconciliationUnitPrice'">

                        <div class="viewData">
                          <span>{{ scope.row.reconciliationUnitPrice }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位(主)" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">

                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="taxRate" label="税率%" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                        <div class="viewData">
                          <span>{{ scope.row.taxRate }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="includingTaxAmount" label="含税金额" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'includingTaxAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.includingTaxAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>



                  <el-table-column prop="remark" label="备注" min-width="180">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" :disabled="type === 'look'" maxlength="20"
                        placeholder="请输入备注">{{
                          scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>
                  <!-- 
                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="type === 'look'"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>

                    </template>
                  </el-table-column> -->
                </el-table>
              </el-form>

              <!-- <div style="height: 40px; line-height: 40px; background: #f5f7fa;">
                <span style="font-size:17px;font-weight:500;margin-right:10px">订单不含税总金额：{{
                  dataForm.excludingTaxAmount }}</span>
                <span style="font-size:17px;font-weight:500;margin-right:10px">订单税额：{{ dataForm.taxAmount }}</span>
                <span style="font-size:17px;font-weight:500;margin-right:10px">订单含税总金额：{{ dataForm.includingTaxAmount
                }}</span>

              </div> -->
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>

  </div>
</template>
<script>
import { getfinAccountList, getfinAccountDetail } from '@/api/ReconciliaRePayments/index'
import { detailfinSelfReceivable } from '@/api/financialManagement/index'

export default {
  components: {
  },
  data() {
    return {
      activeName: 'jcInfo',
      dialogTitle: '',
      loading: false,
      btnLoading: false,
      index: null,

      dataFormTwo: {
        data: []
      },
      dataForm: {
        id: "",
        orderNo: "",        // 单号
        cooperativePartnerName: '',
        reconciliationEndDate: '',
        excludingTaxAmount: '',
        includingTaxAmount: '',
        taxAmount: '',
        submitDate: '',
        createTime: '',
        createByName: '',
        remark: "",
        totalReconciliationAmount: '',
        totalPaymentAmount: '',
        totalInvoicingAmount: '',
        totalNotInvoicedAmount: '',
        totalUnpaidAmount:''
      },
      type: "",
      rules: {
      },
      productRules: {
      },
      productArr: [],

    }
  },
  created() {
  },
  methods: {

    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      console.log(id, type);
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''

      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          getfinAccountDetail(this.dataForm.id).then(res => {
            console.log(res, '详情');
            // return
            this.dataForm = {
              id: res.data.id,
              orderNo: res.data.orderNo,
              cooperativePartnerName: res.data.cooperativePartnerName,
              excludingTaxAmount: res.data.excludingTaxAmount,
              includingTaxAmount: res.data.includingTaxAmount,
              taxAmount: res.data.taxAmount,
              reconciliationDate: res.data.reconciliationDate,
              totalReconciliationAmount: res.data.totalReconciliationAmount,
              totalPaymentAmount: res.data.totalPaymentAmount,
              totalInvoicingAmount: res.data.totalInvoicingAmount,
              totalNotInvoicedAmount: res.data.totalNotInvoicedAmount,
              createTime:res.data.createTime,
              createByName:res.data.createByName,
              totalUnpaidAmount:res.data.totalUnpaidAmount
            }
            this.dataFormTwo.data = res.data.reconciliationLines
          })
        }
      })
    },
    // 表单提交
    // dataFormSubmit() {
    //   this.request()
    // },

    // async request() {
    //   let _data
    //   this.btnLoading = true
    //   if (this.type == 'add') {
    //     _data = {
    //       buyInquirySheet: this.dataForm,
    //       buyInquirySheetLineList: this.dataFormTwo.data
    //     }
    //   }
    //   if (this.type === 'edit' || this.type === 'look') {
    //     this.dataFormTwo.data.forEach((item, index) => {
    //       this.dataFormTwo.data[index].inquirySheetId = this.dataForm.id
    //     })
    //     _data = {
    //       buyInquirySheet: this.dataForm,
    //       buyInquirySheetLineList: this.dataFormTwo.data
    //     }
    //   }
    //   console.log(_data, '参数')

    //   let form_2 = this.$refs['productForm']
    //   let valid_2 = await form_2.validate().catch(err => false)
    //   // if (!valid_2) {
    //   //   console.log(1);
    //   //   this.btnLoading = false
    //   //   return
    //   // } else {
    //   //   this.btnLoading = true
    //   // }
    //   this.$refs['elForm'].validate((valid) => {
    //     if (valid ) {
    //       if (this.dataFormTwo.data.length === 0) {
    //         this.$message.error('请至少选择一项产品')
    //         this.btnLoading = false
    //       } else {
    //         if (!valid_2) {
    //           this.btnLoading = false
    //             for (let i = 0; i < this.dataFormTwo.data.length; i++) {
    //               const item = this.dataFormTwo.data[i]
    //               if (!item.materialPrice) {
    //                 this.$message({
    //                   type: 'error',
    //                   message: '请输入第' + (i + 1) + '行的产品价格',
    //                   duration: 1500,
    //                 })
    //                 break
    //               } 
    //               if (!item.taxRate) {
    //                 this.$message({
    //                   type: 'error',
    //                   message: '请输入第' + (i + 1) + '行的税率',
    //                   duration: 1500,
    //                 })
    //                 break
    //               }           

    //             }
    //             return
    //         } else{
    //           this.btnLoading = true
    //           if (!this.dataForm.id) {
    //             addbuyInquirySheet(_data).then(res => {
    //               if (res.msg === 'Success') res.msg = '提交成功'
    //               this.$message({
    //                 message: res.msg,
    //                 type: 'success',
    //                 duration: 1000,
    //                 onClose: () => {

    //                   this.btnLoading = false
    //                   this.$emit('close', true)
    //                 }
    //               })

    //             }).catch(() => {
    //               this.btnLoading = false
    //             })
    //           } else {
    //             editbuyInquirySheet(_data).then((res) => {
    //               if (res.msg === 'Success') res.msg = '提交成功'
    //               this.$message({
    //                 message: res.msg,
    //                 type: 'success',
    //                 duration: 1000,
    //                 onClose: () => {

    //                   this.btnLoading = false
    //                   this.$emit('close', true)

    //                 }
    //               })
    //             }).catch(() => {
    //               this.btnLoading = false
    //             })
    //           }
    //         }
    //       }
    //     } else {
    //       this.btnLoading = false
    //     }

    //   })
    // },

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
        const deletedArray = [];
        data = data.filter(item1 => {
          const index = this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId);
          if (index !== -1) {
            deletedArray.push(item1.productsName);
            if (deletedArray.length) {
              this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
            }
            return false;
          }
          return true;
        });
        console.log(data, '删除后的数据');
        console.log(deletedArray, '被删掉的数据');
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data,]
      console.log(this.dataFormTwo.data, '传递数据');
    },

  },
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

::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
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
</style>