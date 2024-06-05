<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          :content="btnType == 'add' ? '新建领料通知单' : btnType == 'edit' ? '编辑领料通知单' : btnType == 'look' ? '查看领料通知单' : ''" />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="通知单信息" name="orderInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="生产订单" prop="productionOrderNo">
                    <el-input readonly placeholder="请选择生产订单" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.productionOrderNo" @focus="openOrderDia"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="领料人" prop="llr">
                    <el-input readonly placeholder="请选择领料人" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.llr"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="领料日期" prop="orderDate">
                    <el-date-picker v-model="dataForm.orderDate" type="date" value-format="yyyy-MM-dd"
                      style="width: 100%;" placeholder="请选择领料日期" :disabled="btnType == 'fp' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="申请理由" prop="applyReason">
                    <el-input v-model="dataForm.applyReason" placeholder="请输入申请理由"
                      :disabled="btnType == 'look' ? true : false" maxlength="200" />
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false"
                      maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>
            <el-table ref="product" :data="productData" :fixedNO="true">
              <el-table-column type="index" width="60" fixed="left" label="序号">
              </el-table-column>
              <el-table-column prop="productCode" label="产品编码"  />
              <el-table-column prop="productName" label="产品名称" ></el-table-column>
              <el-table-column prop="drawingNo" label="产品图号" />
              <el-table-column prop="drawingNo" label="工序名称" />
              <el-table-column prop="drawingNo" label="领料数量" />
              <el-table-column prop="drawingNo" label="单位" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
          </el-tab-pane>
          <el-tab-pane label="审批流" name="approval">
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="选择生产订单" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="orderVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="handleClose">

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.orderNo" placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.workOrderNo" placeholder="请输入工作令号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.productName" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="orderData" :fixedNO="true">
                <el-table-column prop="orderNo" label="订单号" min-width="200">
                  <template slot-scope="scope">
                    <span
                      style="background-color: rgb(255, 102, 0); color: rgb(255, 255, 255); line-height: 16px; height: 16px; font-size: 12px!important; border-radius: 4px; display: inline-block; padding: 0 2px; margin-right: 4px;"
                      v-if="scope.row.insertOrderFlag">插</span>
                    {{ scope.row.orderNo }}
                  </template>
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="120"></el-table-column>
                <el-table-column prop="productName" label="产品名称" width="120"></el-table-column>
                <el-table-column prop="productDrawingNo" label="产品图号" width="120"></el-table-column>
                <el-table-column prop="orderType" label="订单类型" width="120">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderList" :key="index">
                      <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="planStartDate" label="计划开始日期" width="160"></el-table-column>
                <el-table-column prop="planEndDate" label="计划结束日期" width="160"></el-table-column>
                <el-table-column prop="productionQuantity" label="生产数量" width="120"></el-table-column>
                <el-table-column prop="completedQuantity" label="已完成数量" width="120"></el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="120"></el-table-column>
                <el-table-column prop="productionStatus" label="生产状态" width="120">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in productionStatusList" :key="index">
                      <span v-if="item.value == scope.row.productionStatus">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="orderStatus" label="订单状态" width="120">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderStatusList" :key="index">
                      <span v-if="item.value == scope.row.orderStatus">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="receiveStatus" label="接收状态" width="120">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in receiveStatusList" :key="index">
                      <span v-if="item.value == scope.row.receiveStatus">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="selectOrder(scope.row)"> 选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="getOrderData" />
            </div>
          </div>
        </div>

      </el-dialog>
    </div>
  </transition>
</template>

<script>

import { addApplyStopOrders, editApplyStopOrders, getApplyStopOrders } from '@/api/salesManagement/stopTicket'
import { getOrderDetail, getsaleOrderList, } from '@/api/salesManagement/assemblyOrders'
export default {
  data() {
    return {
      orderVisible: false,
      listLoading: false,
      total: 0,
      productData: [],
      dataForm: {
        saleOrderNo: "",
        llr:"",
        orderNo: "",
        applyReason: "",
        applyReason:"",
        remark: "",
        id: "",
        documentStatus: "",
        orderDate: "",
      },
        // 选择生产订单的查询条件
        orderForm: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        orderNo: "",
        workOrderNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        orderType: "",
        planSsd: "",
        planSed: "",
        planEsd: "",
        planEed: "",
        receiveStatus: "received",
        productionStatus: "",
        orderStatus: "normal",
        insertOrderFlag: "",
        demandType: "finish_product"

      },
      btnType: undefined,
      activeName: "orderInfo",
      nodeId: -1,
      btnLoading: false,
      formLoading: false,
      parentId: '',
      dataRule: {
        // productionOrderNo,llr,orderDate
        productionOrderNo: [
          { required: true, message: '生产订单不能为空', trigger: 'change' }
        ],
        applyReason: [{ required: true, message: "请输入申请理由", trigger: 'blur' }],
      },
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.dataForm.orderDate = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  mounted() {

  },
  methods: {
    handleClick() {

    },
    // 弹框中选择订单
    selectOrder(row) {
      console.log(row);
      this.dataForm.saleOrderNo = row.orderNo
      this.dataForm.ordersId = row.id
      getOrderDetail(row.id).then(res => {
        console.log("详情数据", res);
        this.orderVisible = false
        res.data.orderLines.forEach(item => {
          item.ordersLineId = item.id
        });
        this.orderDetailData = res.data.orderLines
      })
    },
    handleClose() {
      this.orderVisible = false
    },
    search() {
      this.orderForm.pageNum = 1
      this.getOrderData()
    },
    reset() {
      this.orderForm = {
        ordersNo: "",
        code: "",
        name: "",
        orderState: "not_finish",
        pageNum: 1,
        pageSize: 20,
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
      this.search()
    },
    openOrderDia() {
      this.orderVisible = true
      // 获取销售订单的数据
      this.getOrderData()
    },
    getOrderData() {
      getsaleOrderList(this.orderForm).then(res => {
        console.log("销售订单数据", res);
        this.orderData = res.data.records
        this.total = res.data.total
      })
    },
    goBack() {
      this.$emit('close')
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      console.log("00000", id, btnType);
      if (this.dataForm.id) {
        getApplyStopOrders(this.dataForm.id).then(res => {
          console.log("订单详情", res);
          this.$nextTick(() => {
            this.dataForm = res.data.stop
            res.data.lines.forEach(item => {
              item.drawingNo = item.productDrawingNo
            })
            this.orderDetailData = res.data.lines

          })

        })

      }
    },
    goBack() {
      this.$emit('close')
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = null;
          let submitFlag = null;
          if (this.btnType == 'edit') {
            formMethod = editApplyStopOrders
          } else if (this.btnType == 'add') {
            formMethod = addApplyStopOrders
          }
          this.dataForm.documentStatus = value
          let obj = {
            lines: this.orderDetailData,
            stop: this.dataForm,
          }
          let num = 0;
          for (let index = 0; index < this.orderDetailData.length; index++) {
            const item = this.orderDetailData[index];
            console.log("item.stopQuantity", item.stopQuantity);
            num += Number(item.stopQuantity)
            if (Number(item.stopQuantity) > Number(item.num)) {
              submitFlag = false
              this.btnLoading = false
              this.$message({
                message: "第" + (index + 1) + "行产品的停止数量不能大于订单数量",
                type: 'error',
                duration: 1500,
              })
              break
            }
            console.log("num", num);
            // if (this.orderDetailData.length - index == 1) {
            //   if (num == 0) {
            //     submitFlag = false
            //     this.btnLoading = false
            //     this.$message({
            //       message: "停止数量总数量不能为0",
            //       type: 'error',
            //       duration: 1500,
            //     })
            //     break
            //   }

            // }
            if (!item.stopReason) {
              submitFlag = false
              this.btnLoading = false
              this.$message({
                message: "请输入第" + (index + 1) + "行产品的停止原因",
                type: 'error',
                duration: 1500,
              })
              break
            }
            if (!item.stopDate) {
              submitFlag = false
              this.btnLoading = false
              this.$message({
                message: "请选择第" + (index + 1) + "行产品的停止日期",
                type: 'error',
                duration: 1500,
              })
              break
            }


          }

          if (submitFlag === false) return
          formMethod(obj).then(res => {
            let msg = "";
            if (formMethod == editApplyStopOrders) {
              msg = "修改成功"
            } else {
              msg = "新建成功"
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
          }).catch(() => {
            this.btnLoading = false
          })

        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

.el-button--small {
  // padding: 1;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>