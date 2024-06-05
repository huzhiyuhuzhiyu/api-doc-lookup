<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack"
            :content="type == 'add' ? '新建外协退货通知单' : type == 'edit' ? '编辑外协退货通知单' : type == 'look' ? '查看外协退货通知单' : '新建外协退货通知单'" />
          <div class="options" v-if="type != 'look'">
            <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿</el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="mainListLoading">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>基本信息</h5>
              </div>
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :span="8" v-if="type === 'look'">
                    <el-form-item label="通知单号" prop="orderNo" ref="orderNo">
                      <el-input type="text" v-model="dataForm.orderNo" placeholder="通知单号"
                        :disabled="type != 'add' ? true : false">
                      </el-input>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="外协订单" prop="purchaseOrderNo" ref="purchaseOrderNo">
                      <el-input type="text" v-model="dataForm.purchaseOrderNo" placeholder="请选择外协订单" readonly
                        @focus="openOrderDialog" :disabled="type != 'add' ? true : false">
                      </el-input>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="业务员" prop="salesman" ref="salesman">
                      <el-input type="text" v-model="dataForm.salesman" placeholder="请输入业务员" maxlength="20"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="退货日期" prop="deliverDate" ref="deliverDate">
                      <el-date-picker v-model="dataForm.deliverDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择退货日期" :disabled="type == 'look' ? true : false">
                      </el-date-picker>
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
                    <el-form-item label="创建人" prop="createBy" ref="createBy">
                      <el-input type="text" v-model="dataForm.createBy" placeholder="请输入创建人" maxlength="20"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="type === 'look'">
                    <el-form-item label="检验状态" prop="inspectionStatus" ref="inspectionStatus">
                      <el-input type="text" v-model="dataForm.inspectionStatus === 'unInspect' ? '待检验' : '已检验'"
                        placeholder="检验状态" :disabled="type != 'add' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="12" :xs="24">
                    <el-form-item label="备注" prop="remark" ref="remark">
                      <el-input type="textarea" :row="3" v-model="dataForm.remark" placeholder="请输入备注" maxlength="200"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table">
                  <!-- <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" /> -->
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

                  <el-table-column prop="productCode" label="产品编码" min-width="200" fixed="left" show-overflow-tooltip>

                    <template slot-scope="scope">
                      <el-form-item prop="productCode">
                        <!-- <el-input :title="scope.row.productCode" v-model="scope.row.productCode"
                              :disabled="type != 'add'" readonly maxlength="20" placeholder="产品编码">{{
                                scope.row.productCode }}
                            </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.productCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productName" label="产品名称" min-width="200" fixed="left" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="productName">
                        <!-- <el-input :title="scope.row.productName" v-model="scope.row.productName" :disabled="type != 'add'"
                          readonly maxlength="20" placeholder="产品名称">{{
                            scope.row.productName }}
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.productName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <!-- <el-table-column prop="warehouse" label="收货仓库" min-width="200" fixed="left">
                    <template slot="header">
                      <span class="required">*</span>收货仓库
                    </template>
                    <template slot-scope="scope">
                      <el-form-item ref="warehouseRef" :prop="'data.' + scope.$index + '.' + 'warehouse'"
                        :rules='productRules.warehouse'>
                        <ComSelect-list :requestObj="{}" :dialogTitle="'选择仓库'" v-model="scope.row.warehouse"
                          :isdisabled="type === 'look'" :method="getWarehouseList" :paramsObj="{ scope }"
                          @change="changeWarehouse"></ComSelect-list>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                  <el-table-column prop="purchaseQuantity" label="外协订单数量" min-width="200">

                    <template slot-scope="scope">
                      <el-form-item prop="purchaseQuantity">
                        <!-- <el-input v-model="scope.row.purchaseQuantity"
                          @input="changePlanQuantity(scope.$index, scope.row.purchaseQuantity)" readonly
                          :disabled="type != 'add'" maxlength="20" placeholder="请输入外协订单数量">{{
                            scope.row.purchaseQuantity }}
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.purchaseQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>



                  <el-table-column prop="receiptQuantity" :label="type === 'look' ? '已出库数量' : '已入库数量'" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item prop="receiptQuantity">

                        <div class="viewData">
                          <span>{{ scope.row.receiptQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="returnQuantity" label="已退货数量" min-width="180" v-if="type !== 'look'">
                    <template slot-scope="scope">
                      <el-form-item prop="returnQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.returnQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="receivedQuantity" label="退货数量" min-width="180">
                    <template slot="header">
                      <span class="required">*</span>退货数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'receivedQuantity'"
                        :rules='productRules.receivedQuantity'>
                        <el-input v-model="scope.row.receivedQuantity" :disabled="type === 'look'" maxlength="20"
                          placeholder="请输入退货数量">{{
                            scope.row.receivedQuantity }}
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位(主)" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="mainUnit">
                        <!-- <el-input v-model="scope.row.mainUnit" :disabled="type != 'add'" readonly maxlength="20"
                          placeholder="请输入主单位">{{
                            scope.row.mainUnit }}
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="200"
                        :disabled="type === 'look'" placeholder="请输入备注">{{
                          scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="180" fixed="right" v-if="dataFormTwo.data.length > 1">
                    <template slot-scope="scope">
                      <el-button v-if="type != 'look'" type="text" class="JNPF-table-delBtn"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>

                    </template>
                  </el-table-column>
                </el-table>
              </el-form>



            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
    <!-- <OrderDialog v-if="orderVisibled" ref="orderRef" @changeOrder="changeOrder"></OrderDialog> -->
  </div>
</template>
<script>


import { getpurPurchaseReceiptReturnGoodsdetail, addpurPurchaseReceiptReturnGoods, editpurPurchaseReceiptReturnGoods, detailpurPurchaseReceiptReturnGoods } from '@/api/purchasingManagement/purchaseInquirySheet'  // 询价单
import { getWarehouseList } from '@/api/basicData/index' // 默认仓库 材质

import { insertPurchaseOrder, purPurchaseOrderdetail } from '@/api/purchasingAndOutsourcingOrders/index'

// import OrderDialog from './order-dialog.vue'
import formValidate from "@/utils/formValidate";
export default {
  components: {
    // OrderDialog
  },
  data() {
    return {
      orderVisibled: false,
      getWarehouseList,
      activeName: 'jcInfo',
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      mainListLoading: true,
      dataForm: {
        deliverDate: '',
        approvalCompletionDate: "",       // 审批完成时间
        approvalStatus: "",               // 审批状态
        documentStatus: "",               // 单据状态
        purchaseOrderNo: "",              //采购单号
        orderNo: '',                       //收货单号
        reasonRejection: "",              //驳回理由
        submitDate: "",                  //提交时间
        deliveryCompletionDate: "",       //	收货完成时间
        id: 0,
        inspectionStatus: "unInspect",               // 检验状态
        notificationType: "external",             //	通知单类型 外协通知 external、销售通知 sale,可用值:external,sale           
        purchaseOrderId: '',              // 采购单id
        receiptReturnType: "back",            //类型（收货 receipt、退货 return）
        receivingStatus: "receiving",              //收货状态
        remark: "",
        salesman: "",
        createTime: '',
      },
      orderNoId: '',
      type: "",
      dataFormArr: [],
      rules: {
        salesman: [
          { required: true, message: '请输入业务员', trigger: ['blur'] },
          { validator: formValidate('fullName'), trigger: 'blur' },
        ],
        purchaseOrderNo: [{ required: true, message: '请选择外协单号', trigger: ['change'] }],

        deliverDate: [{ required: true, message: '请选择退货日期', trigger: ['change'] }],
      },
      productRules: {
        // warehouse: [{ required: true, trigger: ['change'] },],
        receivedQuantity: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('退货数量：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('退货数量：不能为0') }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [this.numCalcMethod, "退货数量不能超过已入库数量-已退货数量", (errMsg) => { this.$message.error('退货数量：' + errMsg) }] }), trigger: 'blur' },

          // { validator: this.maxLength(), trigger: ['blur'] }
        ],
      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },


    }
  },
  created() {
  },
  methods: {
    numCalcMethod(rowIndex) {
      let row = this.dataFormTwo.data[rowIndex]
      let flag = Number(row.receivedQuantity) <= Number(row.receiptQuantity) - Number(row.returnQuantity)
      console.log(row.receiptQuantity);
      return flag
    },
    // changeWarehouse(val, data, params) {
    //   console.log(data);
    //   console.log(params);
    //   this.$nextTick(() => {
    //     this.$refs.productForm.validateField('data.' + index + '.' + 'warehouse')
    //     console.log(this.dataFormTwo.data[index]);
    //   })
    //   let index = params.scope.$index
    //   if (data.length == 0) {
    //     console.log(this.$refs.productForm);
    //     this.$set(this.dataFormTwo.data[index], 'warehouse', '')
    //     this.$set(this.dataFormTwo.data[index], 'warehouseId', '')

    //   } else {
    //     this.$set(this.dataFormTwo.data[index], 'warehouse', data[0].name)
    //     this.$set(this.dataFormTwo.data[index], 'warehouseId', data[0].id)
    //     this.$set(this.dataFormTwo.data[index], 'notificationType', 'external')
    //     console.log(this.dataFormTwo.data[index]);
    //     // this.dataFormTwo.data[index].warehouse = data.name
    //     // this.dataFormTwo.data[index].warehouseId = data.id

    //   }

    // },
    // 去除系数后两位的小数位

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

      // this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
          this.mainListLoading = false
        } else {
          this.loading = true
          getpurPurchaseReceiptReturnGoodsdetail(this.dataForm.id).then(res => {
            console.log(res, '详情');
            this.dataForm = res.data
            if (this.type === 'copy') {
              this.dataForm.approvalCompletionDate = ''
              this.dataForm.approvalStatus = ''
              this.dataForm.submitDate = ''
              this.dataForm.inspectionStatus = "unInspect"
              this.dataForm.receivingStatus = "receiving"
              purPurchaseOrderdetail(this.dataForm.purchaseOrderId).then(res => {
                console.log(res, '通过采购单id 拿到明细数据');
                this.dataFormTwo.data = res.data.purchaseOrderLineVOList.map(item => {
                  return {
                    ...item,
                    ordersLineId: item.id,
                    returnQuantity: item.returnQuantity ? item.returnQuantity : 0,
                    receiptQuantity: item.receiptQuantity ? item.receiptQuantity : 0
                  }
                })
              })
            } else {
              console.log(this.dataForm.id);
              detailpurPurchaseReceiptReturnGoods(this.dataForm.id).then(res => {
                console.log(res, '明细');
                this.dataFormTwo.data = res.data
                this.dataFormTwo.data.forEach(item => {
                  item.returnQuantity = item.returnQuantity ? item.returnQuantity : 0
                  item.receiptQuantity = item.receiptQuantity ? item.receiptQuantity : 0
                })
                this.dataFormTwo.data = this.dataFormTwo.data.reduce((result, obj) => {
                  let existingObj = result.find(item => item.productCode === obj.productCode && item.routingLineId == obj.routingLineId);
                  if (existingObj) {
                    existingObj.receivedQuantity = this.jnpf.math('add', [existingObj.receivedQuantity, obj.receivedQuantity]);
                    existingObj.receiptQuantity = this.jnpf.math('add', [existingObj.receiptQuantity, obj.receiptQuantity]);
                    existingObj.ordersLineId = '';
                  } else {
                    result.push(obj);
                  }
                  return result;
                }, []);
                this.mainListLoading = false
              })
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit(type) {
      this.request(type)
    },

    async request(type) {
      let _data
      let hasCostPrice = true
      this.btnLoading = true
      this.dataForm.documentStatus = type

      // if (this.type == 'add') {
      _data = {
        returnGoods: this.dataForm,
        lines: this.dataFormTwo.data
      }
      // }
      // if (this.type === 'edit' || this.type === 'look') {
      //   this.dataFormTwo.data.forEach((item, index) => {
      //     this.dataFormTwo.data[index].purchaseReceiptReturnGoodsId = this.dataForm.id
      //   })
      //   _data = {
      //     returnGoods: this.dataForm,
      //     lines: this.dataFormTwo.data
      //   }
      // }
      let msg = ''
      if (this.dataForm.documentStatus === 'draft') {
        msg = '保存成功'
      } else {
        msg = '提交成功'
      }
      console.log(_data, '参数')
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      console.log(valid_2, '1111');
      if (hasCostPrice) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.data.length === 0) {
              this.btnLoading = false
              this.$message.error('请至少选择一项产品')
            } else {
              if (!valid_2) {
                console.log(1);
                this.btnLoading = false
                for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                  const item = this.dataFormTwo.data[i]
                  // if (!item.warehouse) {
                  //   this.$message({
                  //     type: 'error',
                  //     message: '请选择第' + (i + 1) + '行的收货仓库',
                  //     duration: 1500,
                  //   })
                  //   break
                  // }
                  if (!item.receivedQuantity) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的退货数量',
                      duration: 1500,
                    })
                    break
                  }

                }
                return
              } else {
                this.btnLoading = true

                if (this.type === 'add' || this.type === 'copy') {
                  addpurPurchaseReceiptReturnGoods(_data).then(res => {
                    if (res.msg === 'Success') res.msg = '新建成功'
                    this.$message({
                      message: msg,
                      type: 'success',
                      duration: 1000,
                      onClose: () => {

                        this.btnLoading = false
                        this.$emit('close', true)
                      }
                    })

                  }).catch(() => {
                    this.btnLoading = false
                  })
                } else {
                  editpurPurchaseReceiptReturnGoods(_data).then((res) => {
                    if (res.msg === 'Success') res.msg = '修改成功'
                    this.$message({
                      message: msg,
                      type: 'success',
                      duration: 1000,
                      onClose: () => {

                        this.btnLoading = false
                        this.$emit('close', true)

                      }
                    })
                  }).catch(() => {
                    this.btnLoading = false
                  })
                }

              }
            }
          } else {
            this.btnLoading = false
          }

        })
      }
    },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 打开选择订单弹窗
    openOrderDialog() {
      this.orderVisibled = true
      this.$nextTick(() => {

        this.$refs.orderRef.initData2(this.dataFormTwo.data)
      })
    },
    changeOrder(data) {
      console.log(data);
      this.dataForm.purchaseOrderId = data[0].id
      this.dataForm.purchaseOrderNo = data[0].orderNo
      purPurchaseOrderdetail(this.dataForm.purchaseOrderId).then(res => {
        console.log(res, '通过采购单id 拿到明细数据');
        this.dataFormTwo.data = res.data.purchaseOrderLineVOList.map(item => {
          return {
            ...item,
            ordersLineId: item.id,
            returnQuantity: item.returnQuantity ? item.returnQuantity : 0,
            receiptQuantity: item.receiptQuantity ? item.receiptQuantity : 0
          }
        })
      })
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