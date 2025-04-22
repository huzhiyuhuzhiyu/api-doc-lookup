<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <!-- <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading"
            @click="handleConfirm('draft')">保存草稿</el-button> -->
          <!-- <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
            @click="handleConfirm('submit')">保存并提交</el-button> -->
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
              :element-loading-text="loadingText">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入单号" maxlength="300" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="业务类型" prop="documentType">
                          <el-select v-model="dataForm.businessType" placeholder="业务类型" clearable style="width: 100%;"
                            disabled filterable @change="selectDocutementType">
                            <el-option v-for="(item, index) in list" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="12" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2" disabled
                            maxlength="200" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="产品信息" name="productInfo" class="productInfo">


                  <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="false"
                    @selection-change="handeleProductInfoData" border :key="165" style="width: 100%;">
                    <el-table-column prop="drawingNo" label="品名规格" min-width="300" />
          <el-table-column prop="productName" label="产品名称"  v-if="productNameFlag==='1'" min-width="160" sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
          <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111"></el-table-column>
                    <el-table-column prop="mainUnit" label="单位" width="80" :key="88" />

                    <el-table-column prop="num" :label="dataForm.businessType == 'inbound_transfer' ? '入库数量' : '出库数量'"
                      width="140" :key="8088">
                    </el-table-column>


                    <el-table-column prop="warehouseName"
                      :label="dataForm.businessType == 'inbound_transfer' ? '入库仓库' : '出库仓库'" width="160"
                      :key="889"></el-table-column>
                    <el-table-column prop="standardValue" label="规值" width="120" :key="211"> </el-table-column>
                    <el-table-column prop="colour" :label="$store.getters.colour"  width="120" :key="216"> </el-table-column>
                    <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  width="140" :key="2111"></el-table-column>
                    <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  width="120" :key="123"></el-table-column>
                    <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17"></el-table-column>
                    <el-table-column prop="oil" label="油脂" width="120" :key="61"></el-table-column>
                    <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51"></el-table-column>
                    <el-table-column prop="clearance" label="游隙" width="120" :key="100"></el-table-column>
                    <el-table-column prop="aperture" label="孔径" width="120" :key="200"></el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="900"></el-table-column>
                    <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  width="120" :key="101"></el-table-column>
                    <el-table-column prop="processName" label="工序" width="120" :key="105"></el-table-column>

                    <el-table-column prop="remark" label="备注" width="200" :key="128"></el-table-column>
                  </JNPF-table>

                </el-collapse-item>

              </el-collapse>

            </div>
          </div>
        </div>
      </div>

    </div>
  </transition>
</template>

<script>
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getStockGoodsShelvesList, getProductionLotList, getBimBusinessSwitchConfigList, getBatchNumber, getStockGoodsShelves } from '@/api/basicData/index'

export default {

  data() {
    return {
      getWarehouseList,
      dataForm: {

      },
      activeNames: ["productInfo", "basicInfo"],
      productData: [],
      selectRows: [],
      listLoading: false,
      currentProductIndex: "",
      btnType: false,
      title: "",
      list: [
        { label: "调拨出库", value: "outbound_transfer" },
        { label: "调拨入库", value: "inbound_transfer" },
        { label: "直接领料入库", value: "inbound_receive_material" },
        { label: "直接领料出库", value: "outbound_receive_material" },
      ],      
    }
  },
  created() {
  },

  methods: {
    goBack() {
      this.$emit('close', true)
    },
    init(id) {
      detailWarehouseData(id).then(res => {
        if (res.data.stockMove.businessType == 'inbound_transfer') {
          this.title = '查看调拨入库单'
        } else {
          this.title = '查看调拨出库单'
        }
        this.dataForm = res.data.stockMove
        this.productData = res.data.spaceLines
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
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
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

::v-deep.JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body {
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



.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}

.JNPF-common-layout-main.JNPF-flex-main {
  padding-top: 5px;
}

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
}
</style>