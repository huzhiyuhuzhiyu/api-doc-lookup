<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          :content="btnType == 'add' ? '新建成品领料通知单' : btnType == 'edit' ? '编辑成品领料通知单' : btnType == 'copy' ? '新建成品领料通知单' : '查看成品领料通知单'" />
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
                <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="通知单号" prop="orderNo">
                    <el-input readonly placeholder="请输入通知单号" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.orderNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24" v-if="btnType !== 'look'">
                  <el-form-item label="生产订单号" prop="productionOrderId">
                    <el-input readonly placeholder="请选择生产订单号" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.productionOrderNo" @focus="openSeleceproduction"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="领料人" prop="personId">
                    <user-select v-model="dataForm.personId" placeholder="请选择领料人" clearable style="width: 100%;"
                      :disabled="btnType == 'look'" @change="hangleSelectSales">
                    </user-select>

                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="领料人" prop="llr">
                    <el-input readonly placeholder="请选择领料人" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.llr"></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="8" :xs="24">
                  <el-form-item label="领料日期" prop="operationDate">
                    <el-date-picker v-model="dataForm.operationDate" type="date" value-format="yyyy-MM-dd"
                      style="width: 100%;" placeholder="请选择领料日期" :disabled="btnType == 'look' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false"
                      type="textarea" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>
            <div v-if="btnType == 'edit' || btnType == 'add'">
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择产品</el-button>| -->
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO
                @selection-change="handeleProductInfoData">
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'"
                  key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="productCode" label="产品编码" width="auto" show-overflow-tooltip>
                  <template slot="header">
                    <span class="required">*</span>产品编码
                  </template>
                </el-table-column>
                <el-table-column prop="productName" label="产品名称" width="auto" show-overflow-tooltip>
                  <template slot="header">
                    <span class="required">*</span>产品名称
                  </template>
                </el-table-column>
                <el-table-column prop="productDrawingNo" label="产品图号" width="auto" show-overflow-tooltip>
                  <template slot="header">
                    <span class="required">*</span>产品图号
                  </template>
                </el-table-column>
                <el-table-column prop="routingName" label="工艺路线名称" width="auto" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="processName" label="工序名称" width="auto" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="materialsUsedQuantity" label="计划用料数量" width="auto" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="outboundQuantity" label="已出库数量" width="auto" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="num" label="领料数量" width="170">
                  <template slot="header">
                    <span class="required">*</span>领料数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                      <el-input v-model="scope.row.num" placeholder="请输入领料数量" :disabled="btnType == 'look'" maxlength="11"
                        @input="watchnums(scope.row, scope.$index)" style="width: 145px;">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="120" show-overflow-tooltip>
                  <template slot="header">
                    <span class="required">*</span>单位
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'edit' || btnType == 'add' || btnType == 'copy'"
                  key="24">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-pages ref="ComSelect-page" @change="submitCustomerProduct" title="选择订单" :renderTree="false"
        :listMethod="ordershengchanList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList"
        :elementShow="false" />
    </div>
  </transition>
</template>

<script>
import { ordershengchanList, detailordershengchan, addWithdrawal, updateWithdrawal, detailWithdrawal } from '@/api/productOrdes/index'
import ComSelectPages from './ComSelect-pages/index.vue'
export default {
  components: { ComSelectPages },
  data() {
    return {
      //搜素条件列表
      ProductTableSearchList: [
        { prop: "orderNo", label: "生产单号", type: 'input' },
        { prop: "orderType", label: "订单类型", type: 'select', options: [{ label: '正常订单', value: 'normal' }, { label: '返工订单', value: 'rework' }] }
      ],
      ProductListRequestObj: {
        demandType: 'finish_product',
        pickingFlag: 1,
        receiveStatus: 'received',
        orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }],
        pageNum: 1,
        pageSize: 20,
      },
      dataFormTwo: { productData: [] },
      ProductTableItems: [
        { prop: 'orderNo', label: '生产单号' },
        { prop: 'orderType', label: '订单类型' },
        { prop: 'productionQuantity', label: '生产数量' },
        { prop: 'mainUnit', label: '单位' },
      ],
      ordershengchanList,
      orderVisible: false,
      listLoading: false,
      total: 0,
      dataForm: {
        inspectionStatus: 'inspected',
        pickingStatus: 'not_picked',
        demandType: 'finish_product',
        notifyType: 'picking',
        processId: '',
        productionOrderId: '',
        productionOrderNo: '',
        personId: '',
        operationDate: '',
        id: '',
        remark: ''
      },
      iszhi: false,
      btnType: undefined,
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      productRules: {
        num: [{ required: true, trigger: 'blur' }, { validator: this.calcValidate(), trigger: 'blur' }],
      },
      dataRule: {
        productionOrderId: [
          { required: true, message: '生产订单不能为空', trigger: 'change' }
        ],
        personId: [
          { required: true, message: '领料人不能为空', trigger: 'change' }
        ],
        operationDate: [
          { required: true, message: '领料时间不能为空', trigger: 'change' }
        ],
      },
      selectRows: []
    }
  },
  // created() {
  //   this.dataForm.orderDate = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  // },
  methods: {
    //数量单价不能为0
    calcValidate() {
      return (rule, value, callback) => {
        let msg = `领料数量不能为'0'`
        if (value == 0) { callback(new Error(msg)), this.$message.error(msg) } else {
          callback()
        }
      };
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.productData.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      this.dataFormTwo.productData.splice(data.$index, 1)
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    openSeleceproduction() {
      this.$refs['ComSelect-page'].openDialog()
    },
    handleClick() { },
    //生产订单
    submitCustomerProduct(selectedIds, selectedList) {
      console.log('订单信息', selectedList);
      detailordershengchan(selectedIds).then(res => {
        console.log('订单详情', res.data.materialList);
        if (this.dataForm.productionOrderId && res.msg == 'Success') {
          this.$confirm('此操作将切换产品数据,是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '切换成功'
            })
            this.dataForm.productionOrderNo = selectedList[0].all.orderNo
            this.dataForm.productionOrderId = selectedIds
            this.dataForm.processId = res.data.materialList.processId,
              this.dataFormTwo.productData = []
            res.data.materialList.forEach(item => {
              item.productionOrderId = selectedIds
              item.materialListId = item.id
              item.num = ''
              item.outboundQuantity = item.receivedQuantity
              this.dataFormTwo.productData.push(item)
            });
            this.$refs['ComSelect-page'].isvisible()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        } else {
          this.dataForm.productionOrderNo = selectedList[0].all.orderNo
          this.dataForm.productionOrderId = selectedIds
          this.dataForm.processId = res.data.materialList.processId,
            this.dataFormTwo.productData = []
          res.data.materialList.forEach(item => {
            item.productionOrderId = selectedIds
            item.materialListId = item.id
            item.num = ''
            item.outboundQuantity = item.receivedQuantity
            this.dataFormTwo.productData.push(item)
          });
          this.$refs['ComSelect-page'].isvisible()
        }
      })
    },
    //领料数量
    watchnums(row, index) {
      console.log("主数量", row, index);
      if (!row.num) {
        return
      }
      row.num = row.num.replace(/[^0-9.]/g, '');

      if (row.num.length == 1 && row.num == '.') {
        // 如果第一位是小数点，则清空输入框
        row.num = '';
      } else if (row.num.length == 2 && row.num[0] == '0' && row.num[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.num = row.num.slice(0, 1) + '.' + row.num.slice(1);
      } else if (row.num.length > 2 && row.num[0] == '0' && row.num[1] != '.') {
        row.num = row.num.substring(1, row.num.length)
      }
      if (row.num.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.num.length; i++) {
          const char = row.num[i];
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char;
              dotCount++;
            }
          } else {
            result += char;
          }
        }
        row.num = result;
        let arr = row.num.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.num = arr[0] + '.' + arr[1]
      } else {
        if (row.num.length > 8) {
          row.num = row.num.substring(0, 8);
        }
      }
    },
    //领料人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('personId')
      })
      this.dataForm.personId = e
    },
    goBack() {
      this.$emit('close')
    },
    dateFormat(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      const time = y + '-' + m + '-' + d
      return time
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType == 'add') {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.operationDate = this.dateFormat(end)
      }
      if (this.dataForm.id) {
        detailWithdrawal(this.dataForm.id).then(res => {
          console.log("订单详情", res);
          this.$nextTick(() => {
            this.dataForm = res.data.collect
            if (this.btnType == 'copy') {
              this.dataForm.id = ''
              detailordershengchan(res.data.collect.productionOrderId).then(row => {
                row.data.materialList.map((item) => {
                  res.data.collectLineList.map((item1) => {
                    if (item.productsId == item1.productsId) {
                      item1.materialsUsedQuantity = item.materialsUsedQuantity
                      item1.outboundQuantity = item.receivedQuantity
                      item1.num = ''
                    }
                  })
                })
                this.dataFormTwo.productData = res.data.collectLineList
              })
              const end = new Date();//获取当前的日期
              end.setTime(end.getTime())
              //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
              this.dataForm.operationDate = this.dateFormat(end)
            } else if (this.btnType == 'edit') {
              detailordershengchan(res.data.collect.productionOrderId).then(row => {
                row.data.materialList.map((item) => {
                  res.data.collectLineList.map((item1) => {
                    if (item.productsId == item1.productsId) {
                      item1.materialsUsedQuantity = item.materialsUsedQuantity
                      item1.outboundQuantity = item.receivedQuantity
                    }
                  })
                })
                this.dataFormTwo.productData = res.data.collectLineList
              })
            } else {
              this.dataFormTwo.productData = res.data.collectLineList
            }
          })
        })
      }
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.dataFormTwo.productData.length) {
          this.$message({
            message: '产品信息不能为空',
            type: 'error',
            duration: 1500,
          })
          return
        }
        this.dataFormTwo.productData.forEach((item, index) => {
          if (!item.num) {
            this.iszhi = true
            this.$message({
              message: `第${index + 1}行领料数量不能为空`,
              type: 'error',
              duration: 1500,
            })
          }
        })
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            if (this.iszhi) return this.iszhi = false
            this.dataForm.documentStatus = value
            this.dataForm.inspectionStatus = 'inspected'
            this.dataFormTwo.productData.map((item) => {
              item.qualifiedQuantity = item.num
              item.inspectionResults = 'qualified'
            })
            let obj = {
              collect: this.dataForm,
              collectLineList: []
            }
            this.dataFormTwo.productData.map((item1) => {
              let dep = { ...item1 }
              dep.outboundQuantity = 0
              obj.collectLineList.push(dep)
            })
            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'edit') {
              formMethod = updateWithdrawal
            } else if (this.btnType == 'add' || this.btnType == 'copy') {
              formMethod = addWithdrawal
            }
            formMethod(obj).then(res => {
              console.log(res);
              let msg = "";
              if (formMethod == addWithdrawal) {
                msg = "新建成功"
              } else if (value == 'draft') {
                msg = "保存成功"
              } else if (value == 'submit') {
                msg = '提交成功'
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

::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
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

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>