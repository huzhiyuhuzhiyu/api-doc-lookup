<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack"
            :content="btnType == 'add' ? '新建领料通知单' : btnType == 'edit' ? '编辑领料通知单' : btnType == 'look' ? '查看领料通知单' : '新建领料通知单'" />
          <div class="options">
            <el-button type="success" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('draft')">
              保存草稿</el-button>
            <el-button type="primary" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('submit')">
              保存并提交</el-button>
            <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="通知单信息" name="orderInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">

                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="领料单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="领料类型" prop="receiveType">
                          <el-select v-model="dataForm.receiveType" placeholder="领料类型" style="width: 100%;"
                            :disabled="btnType == 'look'" @change="checkSelection">
                            <el-option v-for="(item, index) in receiveTypeList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="生产任务" prop="productionOrderNo">
                          <el-input v-model="dataForm.productionOrderNo" :disabled="btnType == 'look' ? true : false"
                            readonly placeholder="生产任务" @focus="openProductTaskFun" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="领料日期" prop="operationDate">
                          <el-date-picker v-model="dataForm.operationDate" :default-value="new Date()" type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择领料日期"
                            :disabled="btnType == 'look' ? true : false">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="领料人" prop="personId">
                          <user-select v-model="dataForm.personId" placeholder="请选择领料人" clearable style="width: 100%;"
                            :disabled="btnType == 'look'" @change="hangleSelectSales">
                          </user-select>

                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" placeholder="请输入备注"
                            :disabled="btnType == 'look' ? true : false" type="textarea" maxlength="200" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="领料清单" name="productInfo" class="productInfo">

                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                    <div v-if="btnType != 'look'">
                      <el-button type="text" style="margin-right:8px;margin-left:8px;  font-size:14px!important"
                        icon="el-icon-plus" @click="openSeleceMaterDialog()">选择物料</el-button>||
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
                    </div>
                    <JNPF-table ref="product" :data="dataFormTwo.data" fixedNo v-loading="tableloading"
                      :hasC="btnType != 'look'" @selection-change="handeleProductInfoData">
                      <el-table-column prop="productDrawingNo" label="品名规格" min-width="130"></el-table-column>
                      <el-table-column prop="productCode" label="产品编码" min-width="130"></el-table-column>
                      <el-table-column prop="processName" label="工序名称" min-width="130" />
                      <el-table-column prop="mainUnit" label="单位" min-width="130"></el-table-column>
                      <el-table-column prop="materialsUsedQuantity" label="投料数量" min-width="130"
                        v-if="btnType != 'look' && dataForm.receiveType == 'order'"></el-table-column>
                      <el-table-column prop="waitReceiveQuantity" label="待领料数量" min-width="130"
                        v-if="btnType != 'look' && dataForm.receiveType == 'order'"></el-table-column>
                      <el-table-column prop="num" label="领料数量" min-width="130" v-if="dataForm.receiveType == 'order'">
                        <template slot="header">
                          <span class="required">*</span>领料数量
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'num'" :rules="productRules.rules">
                            <el-input v-model="scope.row.num" placeholder="领料数量" :disabled="btnType == 'look'" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="waitReceiveQuantity" label="可领料数量" min-width="130"
                        v-if="btnType != 'look' && dataForm.receiveType == 'order'"></el-table-column>
                      <el-table-column prop="num" label="领料数量" min-width="130" v-if="dataForm.receiveType == 'order'">
                        <template slot="header">
                          <span class="required">*</span>领料数量
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'num'" :rules="productRules.rules">
                            <el-input v-model="scope.row.num" placeholder="领料数量" :disabled="btnType == 'look'" />
                          </el-form-item>
                        </template>
                      </el-table-column>

                    </JNPF-table>

                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
            </el-tab-pane>
          </el-tabs>
        </div>

        <ProductTaskForm v-if="productTaskVisible" ref="ProductTaskForm" @selectProductTask="selectProductTaskFun" />
        <OrderMaterialForm v-if="orderMaterialFormVisible" ref="orderMaterialForm"
          @selectOrderMaterial="selectOrderMaterialFun" />
        <ProcessMaterialForm v-if="processMaterialFormVisible" ref="processMaterialForm"
          @selectProcessMaterial="selectProcessMaterialFun" />
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getprodOrderList,
  prodOrderInfo,
  addProdOrder,
  updateprodOrderFinished,
  prodOrderDispatch,
  dispatchListMap,
} from "@/api/productOrdes/finishedProductOrders";
import { detailordershengchan, detailWithdrawal, addWithdrawal, updateWithdrawal, getWorkList } from '@/api/productOrdes/index.js'
import { excelExport, getProductionLineInfo, getProductionLineList } from "@/api/basicData/index";
import { getbimProductAttributesList } from '@/api/masterDataManagement/index'
import { detailProcess, getProcessList, getWorkListMap, addProdPlanArrange } from '@/api/basicData/processSettingss.js'
import ProductTaskForm from './ProductTaskForm.vue'
import OrderMaterialForm from './OrderMaterialForm.vue'
import ProcessMaterialForm from './ProcessMaterialForm.vue'
export default {
  components: {
    ProductTaskForm,
    OrderMaterialForm,
    ProcessMaterialForm
  },
  data() {
    return {
      orderMaterialFormVisible: false,
      processMaterialFormVisible: false,
      receiveTypeList: [
        { label: "订单物料", value: "order" },
        { label: "工序物料", value: "process" },
      ],
      codeConfig: {},
      sourceType: "",
      productTaskVisible: false,
      dataFormTwo: {
        data: [],
      },
      productRules: {
        rules: [
          { validator: this.formValidate({ type: 'noEmtry', params: ['', (errMsg, index) => { this.$message.error(`领料清单第${index + 1}行：领料数量${errMsg}`) }] }), trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, '', (errMsg, index) => { this.$message.error(`领料清单第${index + 1}行：领料数量${errMsg}`) }] }), trigger: ['blur'] },
          { validator: this.formValidate('positiveNumber', false, (errMsg, index) => { this.$message.error(`领料清单第${index + 1}行：领料数量${errMsg}`) }), trigger: 'blur' },
          { required: true, trigger: ['blur'] }
        ]
      },
      btnType: "",


      activeNames: ["productInfo", "basicInfo"],
      routingVisible: false,
      dataForm: {
        orderNo: "",
        receiveType: "",
        classAttribute: "semi_finished",
        documentStatus: "",
        notifyType: "picking",
        operationDate: "",
        personId: "",
        productionOrderId: "",
        productionOrderNo: "",
        remark: "",
      },
      dataFormTwo: {
        data: [],
      },
      listLoading: false,
      activeName: "orderInfo",
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      pickDataRule: {

      },
      dataRule: {
        receiveType: [
          { required: true, message: '领料类型不能为空', trigger: 'change' }
        ],
        productionOrderNo: [
          { required: true, message: '生产任务不能为空', trigger: 'change' }
        ],
        orderNo: [
          { required: true, message: '领料单号不能为空', trigger: 'blur' }
        ],
        operationDate: [
          { required: true, message: '领料日期不能为空', trigger: 'change' }
        ],
        personId: [
          { required: true, message: '领料人不能为空', trigger: 'change' }
        ],

      },
      selectArr: [],

      totalData: [],

      lineList: [],

      detailDataList: [],
      detailDiaFlag: false,
      previousReceiveType: null,  // 存储上一次选择的领料类型  
      isSame: false,
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {
    checkSelection() {
      this.isSame = this.dataForm.receiveType === this.previousReceiveType; // 判断是否相同  
      this.previousReceiveType = this.dataForm.receiveType; // 更新上一次选择
      if (!this.isSame && this.dataForm.productionOrderNo) {
        console.log(666);
        this.dataForm.productionOrderId = ""
        this.dataForm.productionOrderNo = ""
        this.dataFormTwo.data = []
      }
    },
    // 打开选择生产任务弹框
    openProductTaskFun() {
      if (!this.dataForm.receiveType) return this.$message.error("请先选择领料类型")
      this.productTaskVisible = true
      this.$nextTick(() => {
        this.$refs.ProductTaskForm.init()
      })
    },
    // 所选的生产任务数据
    selectProductTaskFun(data) {
      console.log("选择的生产任务", data);
      if (data.orderNo != this.dataForm.productionOrderNo || data.id != this.dataForm.productionOrderId) {
        this.dataFormTwo.data = []
      }
      this.dataForm.productionOrderNo = data.orderNo

      this.dataForm.productionOrderId = data.id
      if (this.dataForm.receiveType == 'order') {
        this.getCollectFun(this.dataForm.productionOrderId)
      } else {
      }


    },

    //领料人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('personId')
      })
      this.dataForm.personId = e
    },
    // 领料清单  多选
    handeleProductInfoData(val) {
      this.selectArr = val
    },
    // 批量删除物料
    batchDelete() {
      if (!this.selectArr.length) return this.$message.error("请选择您要删除的物料数据")
      // 遍历选中的行的数据
      if (this.selectArr.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectArr.length; i++) {
        const row = this.selectArr[i];
        const index = this.dataFormTwo.data.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectArr = []; // 清空选中的行的数据
    },
    // 打开选择物料的弹框
    openSeleceMaterDialog() {
      if (!this.dataForm.receiveType) return this.$message.error("请先选择领料类型")
      if (!this.dataForm.productionOrderNo) return this.$message.error("请先选择生产任务")
      if (this.dataForm.receiveType == 'order') {
        this.orderMaterialFormVisible = true
        this.$nextTick(() => {
          this.$refs.orderMaterialForm.init(this.dataForm.productionOrderId)

        })
        // 订单物料
      } else {
        // 工序物料
        this.processMaterialFormVisible = true
        this.$nextTick(() => {

          this.$refs.processMaterialForm.init(this.dataForm.productionOrderId)
        })
      }
    },
    // 所选的订单物料
    selectOrderMaterialFun(data) {
      console.log("所选的订单物料", data);
      data.forEach(item => {
        this.$set(item, 'num', JSON.parse(JSON.stringify(item.waitReceiveQuantity)))
      });
      if (this.dataFormTwo.data.length) {
        let uniqueArr = [];
        let idSet = new Set();

        data.forEach(item => {
          if (!idSet.has(item.id)) {
            uniqueArr.push(item);
            idSet.add(item.id);
          }
        });
        this.dataFormTwo.data = uniqueArr
      } else {
        this.dataFormTwo.data = data
      }
    },

    // 所选的工序物料
    selectProcessMaterialFun(data) {
      console.log("所选的工序物料", data);
      data.forEach(item => {
        this.$set(item, 'num', JSON.parse(JSON.stringify(item.waitReceiveQuantity)))
      });
      if (this.dataFormTwo.data.length) {
        let uniqueArr = [];
        let idSet = new Set();

        arr.forEach(item => {
          if (!idSet.has(item.id)) {
            uniqueArr.push(item);
            idSet.add(item.id);
          }
        });
        this.dataFormTwo.data = uniqueArr
      } else {
        this.dataFormTwo.data = data
      }

    },
    // 根据生产任务 查找领料清单
    getCollectFun(id) {
      detailordershengchan(id).then(res => {
        console.log("清单信息", res);
        let arr = []
        let filteredData = res.data.materialList.filter(item => item.reduceType === 'picking');
        filteredData.forEach(item => {
          this.$set(item, 'num', JSON.parse(JSON.stringify(item.waitReceiveQuantity)))
          arr.push(item)
        });
        if (this.dataFormTwo.data.length) {
          let uniqueArr = [];
          let idSet = new Set();

          arr.forEach(item => {
            if (!idSet.has(item.id)) {
              uniqueArr.push(item);
              idSet.add(item.id);
            }
          });
          this.dataFormTwo.data = uniqueArr
        } else {
          this.dataFormTwo.data = filteredData
        }

      })
    },
    dateFormat(dateData) {
      var date = new Date(dateData);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");
      var hours = date.getHours().toString().padStart(2, "0");
      var minutes = date.getMinutes().toString().padStart(2, "0");
      var seconds = date.getSeconds().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedDate
    },













    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },







    search() {
      this.form.pageNum = 1
      this.initData()
    },

    initData() {
      this.listLoading = true
      getCooperativeData(this.form).then(res => {
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 获取通知单详情
    getDetailWithdrawal(id) {
      detailWithdrawal(id).then(res => {
        console.log("通知单详情", res);
        this.dataFormTwo.data = res.data.collectLineList
        this.dataForm = res.data.collect
      })
    },
    init(id, btnType, sourceType) {
      if (sourceType == 'pick') {
        console.log("传递数据", id, btnType);
        this.sourceType = sourceType
        if (id) {
          this.getDetailWithdrawal(id)
        }
      }
      if (sourceType == 'awit') {
        console.log("传递数据", id);
      }
      this.btnType = btnType

      // let num=JSON.parse(JSON.stringify(this.dataForm.availableArrangeQuantity))
      // this.$set(this.dataForm,'productionQuantity',num)


      if (btnType == 'add') {
        this.fetchData("PODH", true)
        const end = new Date();//获取当前的日期
        this.dataForm.operationDate = this.dateFormat(end)
      }
      if (btnType == 'edit') {
        this.fetchData("PODH", false)
      }
    },

    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.orderNo = data.number

        }
      } catch (error) {
      }
    },

    goBack() {
      this.$emit('close', true)
    },
    async handleConfirm(value) {
      let submitFlag = true // 自动聚焦是否可用

      let form_1 = this.$refs['dataForm']
      let valid_1 = await form_1.validate().catch((err) => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      if (submitFlag) {
        this.dataForm.documentStatus = value
        let obj = {
          ccList: null,
          flowData: null,
          form: null,
          formNodeList: null,
          nodeCondList: null,
          collect: this.dataForm,
          collectLineList: this.dataFormTwo.data
        }
        let method = this.btnType == 'add' ? addWithdrawal : updateWithdrawal
        console.log(obj);
        method(obj).then(res => {
          this.btnLoading = false
          if (value == 'submit') {
            this.$message.success("提交成功")
          } else {
            this.$message.success("保存草稿成功")

          }
          setTimeout(() => {
            this.$emit('close')
          }, 1500);
        }).catch(error => {
          this.btnLoading = false

        })
      }



    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0;
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

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>
<style lang="scss" scoped>
$footerPadding: '10px';

::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
}

::v-deep .el-dialog__body {
  margin-bottom: 10px;
}

::v-deep .el-dialog__footer {
  padding: 0 20px 10px;
}

::v-deep .even-row,
::v-deep .odd-row {
  cursor: pointer;
}

.killPadding {
  padding: 0;
}

.killPaddingLeft {
  padding-left: 0 !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding: 2px 10px 2px 0;
}

::v-deep .JNPF-common-search-box.noSearchList {
  padding: 3px 0;
}

::v-deep .has-gutter .el-table__cell.gutter {
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.JNPF-common-search-box {
  padding: 8px 0px 0;
}

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
  padding: 0px 10px;
  border-top: none !important;

}

.productInfo ::v-deep .el-collapse-item__wrap {
  padding: 0px;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}


.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important
}

::v-deep.routingProRes .el-dialog__body {
  height: 500px;
}

::v-deep .applySelect .el-icon-arrow-up:before {
  content: "";
}

.underline-button {
  text-decoration: underline;
}



.personBox p {
  text-align: center;
}

.personBox:nth-child(n + 6) {
  margin-top: 12px;
}

::v-deep .elbutton span {
  font-size: 14px !important;
}

.personBox {
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  /* background-color: #1890ff; */
  margin-left: 26px;
  height: 150px;
  border-radius: 5px;
}

.active {
  background-color: #5d9bd5;
  color: #fff;
}
</style>