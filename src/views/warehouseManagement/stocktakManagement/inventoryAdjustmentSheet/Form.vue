<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">

          <el-button v-if="this.pageType == 'Form' || pageType == 'table'" type="primary" :loading="btnLoading"
            @click="handleConfirm('submit')">提交</el-button>
          <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
              :element-loading-text="loadingText">
              <el-tabs v-model="activeName" v-if="!approvalFlag && dataForm.approvalFlag">
                <el-tab-pane label="基础信息" name="orderInfo" class="orderInfo">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px"
                        label-position="top">
                        <el-row :gutter="30" class="custom-row">
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="单号" prop="orderNo">
                              <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                                :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                                maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="调整日期" prop="orderDate">
                              <el-date-picker v-model="dataForm.orderDate" type="date" value-format="yyyy-MM-dd"
                                style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择盘点日期" disabled>
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="调整人员" prop="personName">
                              <el-input v-model="dataForm.personName" placeholder="请选择盘点人员" disabled maxlength="300" />
                            </el-form-item>
                          </el-col>

                          <el-col :sm="6" :xs="24">
                            <el-form-item label="仓库" prop="warehouseName">
                              <ComSelect-list :requestObj="warehouseRequestObj" :dialogTitle="'选择盘点仓库'" isdisabled
                                v-model="dataForm.warehouseName" :method="getWarehouseList" placeholder="请选择仓库"
                                @change="changeWarehousex"></ComSelect-list>
                            </el-form-item>
                          </el-col>
                        </el-row>


                      </el-form>
                    </el-collapse-item>



                    <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                      <div v-if="btnType !== 'look'">
                        <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                          :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-plus"
                          @click="importFun">导入</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-download"
                          @click="exportForm">导出</el-button>
                      </div>

                      <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="btnType != 'look'"
                        @selection-change="handeleProductInfoData" border :key="165" style="width: 100%;">

                        <el-table-column prop="productName" label="产品名称" v-show="productNameFlag" min-width="160" />
                        <el-table-column prop="productCode" label="产品编码" width="160" :key="4" show-overflow-tooltip />
                        <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="stockNum" label="调整前库存" width="150" :key="6" show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column prop="num" label="调整数量" width="120" :key="10112">
                          <template slot="header">
                            <span class="required">*</span>调整数量
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.num" disabled @blur="computedDiffNum(scope.row, scope.$index,)"
                              placeholder="调整数量">
                            </el-input>

                          </template>
                        </el-table-column>
                        <el-table-column prop="diffNum" label="差额数量" width="120" :key="8" />
                        <el-table-column prop="warehouseName" label="当前仓库" width="160" :key="10112">
                          <template slot="header">
                            <span class="required">*</span>当前仓库
                          </template>
                          <template slot-scope="scope">
                            <ComSelect-list :requestObj="warehouseRequestObj" :dialogTitle="'选择盘点仓库'" isdisabled
                              v-model="scope.row.warehouseName" :method="getWarehouseList" :currentIndex="scope.$index"
                              placeholder="请选择仓库" @change="changeCurrentWarehousex"></ComSelect-list>

                          </template>
                        </el-table-column>
                        <el-table-column prop="shelfSpaceName" label="库位" width="120" :key="10112">

                          <template slot-scope="scope" v-if="scope.row.allocationFlag">
                            <el-input v-model="scope.row.shelfSpaceName" disabled
                              @focus="openSeleceWareDialog(scope.row, scope.$index, 'table')" placeholder="库位">
                            </el-input>

                          </template>

                        </el-table-column>

                        <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111">

                          <template slot-scope="scope">
                            <el-input v-model="scope.row.batchNumber" readonly disabled
                              @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                              {{ scope.row.batchNumber }}
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="diffAmount" label="差值金额" width="120" :key="88" />

                      </JNPF-table>



                    </el-collapse-item>

                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                  <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                </el-tab-pane>
                <el-tab-pane v-if="btnType == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
                  <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                </el-tab-pane>
              </el-tabs>
              <el-collapse v-model="activeNames" style="margin-top: 5px;">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                            maxlength="300" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="盘点日期" prop="orderDate">
                          <el-date-picker v-model="dataForm.orderDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择盘点日期" disabled>
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="盘点人员" prop="personName">
                          <el-input v-model="dataForm.personName" placeholder="请选择盘点人员" disabled maxlength="300" />
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="盘点仓库" prop="warehouseName">
                          <ComSelect-list :requestObj="warehouseRequestObj" :dialogTitle="'选择盘点仓库'" isdisabled
                            v-model="dataForm.warehouseName" :method="getWarehouseList" placeholder="请选择仓库"
                            @change="changeWarehousex"></ComSelect-list>
                        </el-form-item>
                      </el-col>
                    </el-row>


                  </el-form>
                </el-collapse-item>



                <el-collapse-item title="产品信息" name="productInfo" class="productInfo">


                  <JNPF-table ref="product" :data="productData" :fixedNO="true" border :key="165" style="width: 100%;">

                    <el-table-column prop="productName" label="产品名称" v-show="productNameFlag" min-width="160" />
                    <el-table-column prop="productCode" label="产品编码" width="160" :key="4" show-overflow-tooltip />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="stockNum" label="当前库存" width="120" :key="6" show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column prop="num" label="盘点数量" width="120" :key="10112">
                      <template slot="header">
                        <span class="required">*</span>盘点数量
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.num" disabled @blur="computedDiffNum(scope.row, scope.$index,)"
                          placeholder="盘点数量">
                        </el-input>

                      </template>
                    </el-table-column>
                    <el-table-column prop="diffNum" label="差额数量" width="120" :key="8" />
                    <el-table-column prop="warehouseName" label="当前仓库" width="160" :key="10112">
                      <template slot="header">
                        <span class="required">*</span>当前仓库
                      </template>
                      <template slot-scope="scope">
                        <ComSelect-list :requestObj="warehouseRequestObj" :dialogTitle="'选择盘点仓库'" isdisabled
                          v-model="scope.row.warehouseName" :method="getWarehouseList" :currentIndex="scope.$index"
                          placeholder="请选择仓库" @change="changeCurrentWarehousex"></ComSelect-list>

                      </template>
                    </el-table-column>
                    <el-table-column prop="shelfSpaceName" label="库位" width="120" :key="10112">

                      <template slot-scope="scope" v-if="scope.row.allocationFlag">
                        <el-input v-model="scope.row.shelfSpaceName" disabled
                          @focus="openSeleceWareDialog(scope.row, scope.$index, 'table')" placeholder="库位">
                        </el-input>

                      </template>

                    </el-table-column>

                    <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111">

                      <template slot-scope="scope">
                        <el-input v-model="scope.row.batchNumber" readonly disabled
                          @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                          {{ scope.row.batchNumber }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="diffAmount" label="差值金额" width="120" :key="88" />

                  </JNPF-table>
                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
                    <span style="font-weight:500;margin-right:10px">当前库存总数：{{ totalStock }}</span>
                    <!-- <span style="font-weight:500;margin-right:10px">总副数量：{{ totalAssistantNum }}</span> -->
                    <span style="font-weight:500;margin-right:10px">盘点数量总数：{{ totalCount }}</span>
                    <span style="font-weight:500;margin-right:10px">差额数量总数：{{ totalDiff }}</span>
                  </div>

                </el-collapse-item>

              </el-collapse>
            </div>
          </div>
        </div>
      </div>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center tips"
        width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>


        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>

        </span>
      </el-dialog>


    </div>
  </transition>
</template>

<script>


import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import { mapGetters, mapState } from 'vuex'
import { getWarehouseList } from '@/api/basicData/index'

import { getProduct, addStocktak, detailStocktak, editStocktak, deleteStocktak, productExport, productImport, stockTakingToAdjus, addstockTakingAdjustList, getstockTakingAdjustDetail } from '@/api/warehouseManagement/stocktak.js'
import Process from '@/components/Process/Preview'
import flowMixin from '@/mixins/generator/flowMixin'
import recordList from '@/views/workFlow/components/RecordList.vue'
import busFlow from '@/mixins/generator/busFlow';
export default {
  // components: { CustomerForm, WareHouseForm, BatchNumberForm, Process, recordList },
  components: { Process, recordList },
  mixins: [flowMixin, busFlow],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      warehouseRequestObj: {
        type: 'normal', state: 'enable'
      },
      allocationFlag: false,
      selectSaleProductArr: [],
      dataRule: {
        orderNo: [{ required: true, message: "请输入单号", trigger: 'blur' }],
      },
      dataForm: {  //表单信息
        orderNo: "",
        warehouseName: "",
        warehouseId: "",
        warehouseType: "",
        approvalFlag: false,
        personId: "",
        personName: "",
      },
      productForm: {
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }],
      },
      exportFormVisible: false,





      batchNumVisible: false,
      wareHouseVisible: false,

      btnText: "",
      submitmethodsTitle: "",
      tipsvisible: false,
      CustomerForm: false,
      activeNames: ["productInfo", "basicInfo"],
      codeConfig: {},//单号配置信息(单据规则)

      customerInfo: {},//所选客户信息
      getWarehouseList,



      productList: [],
      productTotal: 0,
      deliveryDateArr: [],
      productVisible: false,
      productData: [],
      selectRows: [],
      listLoading: false,
      currentProductIndex: "",



      title: "",
      visible: true,
      btnType: false,
      wareVisibled: false,
      btnLoading: false,
      formLoading: false,


      spaceLines: [],
      loadingText: '',
      copyLinesData: [],
      previousValue: "",
      activeName: "orderInfo",
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      productNameFlag: null,
      uploadVisib: false,
    }
  },
  created() {

  },

  computed: {
    totalStock() {
      return this.productData.reduce((total, item) => Number(total) + Number(item.stockNum), 0);
    },
    totalCount() {
      return this.productData.reduce((total, item) => Number(total) + Number(item.num), 0);
    },
    totalDiff() {
      return this.productData.reduce((total, item) => Number(total) + Number(item.diffNum), 0);
    },
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },

  methods: {

    getDetailFun(id) {
      getstockTakingAdjustDetail(id).then(res => {
        console.log("详情", res);
        this.dataForm = res.data
        res.data.stockTakingAdjustLineVOList.forEach(item => {
          this.$set(item, 'productName', item.productsName)
          this.$set(item, 'productCode', item.productsCode)
          this.$set(item, 'allocationFlag', item.locationStatus == 'disabled' ? false : true)

        });
        this.productData = res.data.stockTakingAdjustLineVOList
      })
    },
    goBack() {
      this.$emit('close', true)
    },
    init(data, pageType) {
      console.log("page",pageType);
      this.pageType = pageType
      if (pageType == 'Form') {
        this.dataForm = data
        this.dataForm.stockTakingAdjustLineVOList.forEach(item => {
          this.$set(item, 'productName', item.productsName)
          this.$set(item, 'productCode', item.productsCode)
          this.$set(item, 'allocationFlag', item.locationStatus == 'disabled' ? false : true)

        });
        this.productData = data.stockTakingAdjustLineVOList
      }  else {
        this.getDetailFun(data)

      }
      if (pageType == 'Form' || pageType == 'table') {
        this.title = '盘点单转库存调整单'
        this.fetchData('KCTZDH', true)
      } else {
        this.title = '查看库存调整单'
        if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
        this.fetchData('KCTZDH', false)
      }






      // if (btnType == 'look') {
      //   this.title = '查看盘点单'


      //   // 流程信息和流转记录
      // } else {
      //   this.getBusInfo('b045')
      //   this.title = btnType == 'add' ? '新建盘点单' : '编辑盘点单'
      //   if (btnType == 'add') {
      //     this.dataForm.personName = this.userInfo.userName
      //     this.dataForm.personId = this.userInfo.userId


      //     this.getDateFun()
      //   }
      // }




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
    async handleConfirm(submitModel) {
      console.log(this.productData);
      let submitFlag = true // 自动聚焦是否可用
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          // 判断子表是否有效
          if (!this.productData.length && submitFlag) {
            submitFlag = false
            this.$message.error('请至少选择一个产品')
          }


          if (this.productData.length) {
            console.log(this.productData);
            let totals = {};
            let totalNum = {};
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行盘点数量不能为空")
                break
              }
            }


          }




          // 自动聚焦未使用则提交
          if (submitFlag) {
            this.dataForm.documentStatus = submitModel
            let arr = []
            this.productData.forEach(item => {
              let obj = {
                batchNumber: item.batchNumber,
                diffNum: item.diffNum,
                num: item.num,
                productsId: item.productsId,
                shelfSpaceId: item.shelfSpaceId,
                stockNum: item.stockNum,
                warehouseId: item.warehouseId,
                diffAmount: "",
                takingLineId: item.takingLineId
              }
              arr.push(obj)
            });
            let obj = {
              adjust: this.dataForm,
              adjustLineList: arr
            }




            // // 提交确认
            // if (submitModel === 'submit') {
            //   let flag = await this.$confirm('请确认信息是否正确，提交后不允许修改，是否提交！', '提交确认', { type: 'warning' }).catch(err => false)
            //   if (!flag) {
            //     console.log(dataObj)
            //     return this.btnLoading = false
            //   }
            // }
            console.log("this.productData", obj);
            this.btnLoading = true
            addstockTakingAdjustList(obj).then(res => {
              this.$message.success("盘点单转库存调整单成功")
              this.$router.push({
                path: '/warehouseManagement/stocktakManagement/inventoryAdjustmentSheet'
              })
              this.btnLoading = false

            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            this.btnLoading = false
          }
        }
      })

    },

  },
}
</script>
<style lang="scss" scoped>
.contain {
  position: relative;
  height: calc(100% - 47px);
  overflow-y: auto;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px 10px;
  padding-top: 0;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 5px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}

::v-deep.tips .JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 !important;
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
  padding: 0 10px 0px;
  border-top: none !important;

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

.JNPF-common-search-box {
  margin-bottom: 5px;
}

// .orderInfo ::v-deep .el-collapse-item__wrap {
//   border-bottom: none !important
// }
.JNPF-common-table {
  border: 1px solid #ebeef5 !important;
}

.JNPF-common-layout-main {
  padding-top: 0;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
}
</style>