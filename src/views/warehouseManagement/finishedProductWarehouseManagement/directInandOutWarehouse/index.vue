<template>
  <div class="JNPF-preview-main org-form">
    <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
      <div class="pageTitle">{{ btnType == 'look' ? '查看直接出入库单' : btnType == 'edit' ? '编辑直接出入库单' : '新建直接出入库单' }}</div>
      <div class="options">
        <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading"
          @click="handleConfirm('draft')">保存草稿</el-button>
        <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
          @click="handleConfirm('submit')">保存并提交</el-button>
        <el-button
          v-if="btnType !== 'look' && (dataForm.businessType == 'inbound_purchase' || dataForm.businessType == 'inbound_sale_return' || dataForm.businessType == 'outbound_sale_send' || dataForm.businessType == 'outbound_external_send' || dataForm.businessType == 'outbound_purchase')"
          type="primary" :loading="btnLoading" @click="handleConfirm('submit', 'print')">提交并打印</el-button>
        <el-button v-if="btnType == 'look' || btnType == 'edit'" @click="goBack">{{ $t('common.cancelButton')
        }}</el-button>
      </div>
    </div>
    <div class="contain">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
            :element-loading-text="loadingText">
            <el-tabs v-model="activeName">
              <el-tab-pane label="基本信息" name="orderInfo" class="orderInfo">
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px"
                      label-position="top">
                      <el-row :gutter="30" class="custom-row">
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="单号" prop="orderNo">
                            <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                              :disabled="JSON.stringify(codeConfig) == '{}' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                              maxlength="300" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="业务类型" prop="documentType">
                            <el-select v-model="dataForm.businessType" placeholder="业务类型" clearable style="width: 100%;"
                              :disabled="btnType == 'look'" filterable @change="selectDocutementType">
                              <el-option v-for="(item, index) in list" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" v-if="partnerFlag">
                          <el-form-item :label="partnerTitle" prop="cooperativePartnerIdText">
                            <ComSelect-page key="partner" ref="ComSelect-page"
                              v-model="dataForm.cooperativePartnerIdText" @change="partnerChange"
                              :tableItems="partnerTableItems" :dialogTitle="partnerDialogTitle"
                              :treeTitle="partnerTreeTitle" :placeholder="partnerPlaceholder"
                              :methodArr="getCooperativeMethodArr" :listMethod="getCooperativeData"
                              :listRequestObj="partnerRequestObj" :searchList="partnerSearchList"
                              :treeNodeClick="yxPartnerTreeNodeClick" :isdisabled="btnType === 'look'" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24"
                          v-if="dataForm.businessType === 'outbound_sale_send' && $store.getters.configGlobal.customerContractNo === '1'">
                          <el-form-item label="客户合同号" prop="contractNo">
                            <el-input v-model="dataForm.contractNo" placeholder="请输入客户合同号"
                              :disabled="btnType === 'look'" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24"
                          v-if="['inbound_sale_return', 'inbound_purchase', 'inbound_external', 'inbound_return_materials', 'inbound_order_production', 'inbound_production', 'inbound_flip', 'inbound_return'].includes(dataForm.businessType)">
                          <el-form-item label="批次号生成规则" prop="diffBatchNumFlag">
                            <el-select v-model="dataForm.diffBatchNumFlag" placeholder="请选择批次号生成规则" style="width: 100%;"
                              :disabled="btnType == 'look'">
                              <el-option v-for="(item, index) in diffBatchList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="仓库" prop="warehouseName">
                            <ComSelect-list
                              :requestObj="{ type: 'normal', state: 'enable', projectId: isProjectSwitch === '1' ? dataForm.projectId || '' : '' }"
                              :dialogTitle="'选择仓库'" :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName"
                              :method="getWarehouseList" placeholder="请选择仓库"
                              @change="changeWarehousex"></ComSelect-list>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24"
                          v-if="dataForm.businessType == 'outbound_pick_out' || dataForm.businessType == 'inbound_return_materials'">
                          <el-form-item :label="dataForm.businessType == 'outbound_pick_out' ? '领料人' : '退料人'"
                            prop="recipientBy">
                            <user-select v-model="dataForm.recipientBy"
                              :placeholder="dataForm.businessType == 'outbound_pick_out' ? '请选择领料人' : '请选择退料人'"
                              clearable style="width: 100%;" :disabled="btnType == 'look'" @change="hangleSelectSales">
                            </user-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" v-if="dataForm.documentType == 'inbound'">
                          <el-form-item label="检验结果" prop="inspectionResults">
                            <el-select v-model="dataForm.inspectionResults" placeholder="请选择检验结果" style="width: 100%;"
                              :disabled="btnType == 'look'">
                              <el-option v-for="(item, index) in inspectionResultsList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <!-- v-if="dataForm.businessType == 'inbound_purchase' || dataForm.businessType == 'outbound_purchase' || dataForm.businessType == 'outbound_external_send' || dataForm.businessType == 'inbound_external'"> -->
                        <el-col :sm="6" :xs="24"
                          v-if="dataForm.businessType == 'inbound_purchase' || dataForm.businessType == 'outbound_purchase' || dataForm.businessType == 'outbound_external_send' || dataForm.businessType == 'inbound_external'">
                          <el-form-item label="是否显示比重折扣" prop="weightFlag">
                            <el-select v-model="dataForm.weightFlag" placeholder="是否显示比重折扣" style="width: 100%;"
                              :disabled="btnType == 'look' ? true : false" @change="selectWeight">
                              <el-option v-for="(item, index) in weightFlagList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="单据日期" prop="orderDate">
                            <el-date-picker v-model="dataForm.orderDate" type="date" :clearable="false"
                              :disabled="btnType == 'look' ? true : false" value-format="yyyy-MM-dd"
                              style="width: 100%;" placeholder="请选择单据日期"></el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="12" :xs="24">
                          <el-form-item label="备注" prop="remark">
                            <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2"
                              :disabled="btnType == 'look'" maxlength="200" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </el-collapse-item>
                  <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                    <div  :class="btnType!='look'?'JNPF-common-head':''">
                      <div v-if="btnType != 'look'">
                        <el-button type="text" style="margin-right:8px;font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" @click="scanFun()"><i
                            class="iconfont-menu icon-saoma"></i>扫码录入</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>
                      </div>
                      <div class="JNPF-common-head-right fixedRight">

                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                          <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                            @click="columnSetFun()" />
                        </el-tooltip>
                      </div>
                    </div>

                    <JNPF-table ref="products" :data="productData" custom-column :fixedNO="true"
                      :hasC="btnType != 'look'" v-if="tableDataFlag" @selection-change="handeleProductInfoData" border
                        :height="customStyleData" :setColumnDisplayList="columnList" customKey="JNPFTableKey_628407">
                      <el-table-column prop="partnerName" label="供应商名称" width="140" key="partnerName" />
                      <el-table-column prop="productCode" label="产品编码" width="140" key="productCode" />
                      <el-table-column prop="productName" label="产品名称" min-width="160" key="productName"
                        v-if="productNameFlag == '1'" />
                      <el-table-column prop="productCategoryName" label="产品分类" width="140"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" key="productDrawingNo"
                        v-if="dataForm.documentType == 'outbound'" />
                      <el-table-column prop="drawingNo" label="品名规格" min-width="300" key="drawingNo"
                        v-if="dataForm.documentType == 'inbound'"> </el-table-column>
                      <el-table-column prop="contractNo" label="客户合同号" width="160" key="contractNo"
                        v-if="dataForm.businessType === 'outbound_sale_send' && $store.getters.configGlobal.customerContractNo === '0'">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.contractNo" :disabled="btnType == 'look'"
                            placeholder="请输入客户合同号" />
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="productCategoryName" label="产品分类" width="140" key="productCode" /> -->
                      <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                      <el-table-column prop="batchNumber" label="批次号" min-width="200" :key="101132"
                        v-if="dataForm.documentType == 'inbound'">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.batchNumber" :disabled="btnType == 'look'" placeholder="批次号">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="batchNumber" label="批次号" width="200" key="batchNumber"
                        v-if="dataForm.documentType == 'outbound'">
                        <template slot="header">
                          <span class="required">*</span>批次号
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.batchNumber" readonly :disabled="btnType == 'look'"
                            @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                            {{ scope.row.batchNumber }}
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="inventoryQuantity" label="批次库存" width="200" key="inventoryQuantity"
                        v-if="dataForm.documentType == 'outbound' && btnType != 'look'">
                      </el-table-column>
                      <el-table-column prop="shelfSpaceName" label="库位" width="140" key="shelfSpaceName"
                        v-if="allocationFlag">
                        <template slot="header" v-if="dataForm.documentType == 'inbound'">
                          <span class="required">*</span>库位
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.shelfSpaceName" readonly :disabled="btnType == 'look'"
                            v-if="dataForm.documentType == 'inbound'"
                            @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="库位">
                          </el-input>
                          <div v-if="dataForm.documentType == 'outbound'"> {{ scope.row.shelfSpaceName }}</div>
                        </template>
                      </el-table-column>

                      <el-table-column prop="weight" label="重量(kg)" width="140" :key="737"
                        v-if="dataForm.weightFlag === true">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                            v-model="scope.row.weight" placeholder="重量"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="proportion" label="比重" width="140" :key="727"
                        v-if="dataForm.weightFlag === true">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                            v-model="scope.row.proportion" placeholder="比重"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="discount" label="折扣(0~1)" width="140" :key="717"
                        v-if="dataForm.weightFlag === true">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                            v-model="scope.row.discount" placeholder="折扣(0~1)"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="pairingModeName" label="配对方式" min-width="160">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.pairingModeId" placeholder="请选择配对方式" style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false"
                            @change="(value) => changePairingMode(value, scope)">
                            <el-option v-for="item in pairingModeList" size="small" :key="item.id" :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120">

                      </el-table-column>

                      <el-table-column prop="num" :label="mainUnitFlag == 1 ? '数量(主)' : '数量'" min-width="160">
                        <template slot="header">
                          <span class="required">*</span>{{ mainUnitFlag == 1 ? '数量(主)' : '数量' }}
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.num" placeholder="数量" :disabled="btnType == 'look'"
                            @input="watchNum(scope.row, scope.$index)">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1">

                      </el-table-column>
                      <el-table-column prop="deputyNum" label="数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
                      <!-- <el-table-column prop="mainUnit" label="单位" width="80" key="8" />
                      <el-table-column prop="num" label="数量" width="140" key="77">
                        <template slot="header">
                          <span class="required">*</span>数量
                        </template>
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'"
                            v-model="scope.row.num" placeholder="数量"></el-input>
                        </template>
                      </el-table-column> -->
                      <el-table-column prop="costPrice" label="单价(含税)" width="120" key="110">
                        <template slot="header" v-if="$store.getters.configData.warehouse.unitPriceSetting">
                          <span class="required">*</span>单价(含税)
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.costPrice" :disabled="btnType == 'look' ? true : false"
                            @input="watchPrice(scope.row, scope.$index)" placeholder="请输入"
                            @blur="checkPrice(scope.row, scope.$index)">{{
                              scope.row.costPrice }}
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taxRate" label="税率" width="120" key="171">
                        <template slot="header">
                          <span class="required">*</span>税率
                        </template>
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;"
                            :disabled="btnType == 'look'" @change="changeTaxRate(scope.row, scope.$index)">
                            <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                              :value="item.taxRate"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taxAmount" label="税额" width="120" key="1721"></el-table-column>
                      <el-table-column prop="totalAmount" label="总金额(含税)" width="120" key="125"></el-table-column>
                      <!-- <el-table-column prop="originalBatchNumber" label="原批次号" width="140" key="1255"
                        v-if="dataForm.documentType == 'inbound'">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" v-model="scope.row.originalBatchNumber"
                            placeholder="原批次号"></el-input>
                        </template>
                      </el-table-column> -->
                      <el-table-column prop="productCategoryName" label="产品分类" width="140" key="productCode" />

                      <el-table-column prop="standardValue"
                      v-if="['inbound_purchase', 'outbound_sale_send', 'inbound_sale_return','outbound_purchase','outbound_pick_out','outbound_other','inbound_other'].includes(dataForm.businessType)"
                        label="规值" width="120" key="211">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.standardValue" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>

                      <el-table-column prop="sealingCoverTyping" v-if="sealingCoverTypingFlag == 1"
                        :label="$store.getters.sealingCoverTyping" width="140" key="2111">
                        <!-- <template slot="header">
                            <span class="required">*</span>打字内容
                          </template> -->
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable
                            :disabled="btnType == 'look'" style="width: 100%;">
                            <el-option v-for="(item, index) in list1" key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="accuracyLevel" v-if="accuracyLevelFlag == 1" :label="$store.getters.accuracyLevel" width="120"
                        key="123">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list2" key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="wireHeatNumber" v-if="isXY || isJR" label="钢丝炉号" width="120"
                        key="123">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.wireHeatNumber" placeholder="请选择" clearable
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa026" key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="rawStockMill" v-if="isXY || isJR" label="原材料厂家" width="120"
                        key="123">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.rawStockMill" placeholder="请选择" clearable
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa027" key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="vibrationLevel" v-if="vibrationLevelFlag == 1" label="振动等级" width="120"
                        key="17">
                        <!-- <template slot="header">
                            <span class="required">*</span>振动等级
                          </template> -->
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable
                            :disabled="btnType == 'look'" style="width: 100%;">
                            <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="oil" label="油脂" v-if="oilFlag == 1" width="120" key="61">

                        <template slot-scope="scope">
                          <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="oilQuantity" label="油脂量" v-if="oilQuantityFlag == 1" width="120" key="61">

                        <template slot-scope="scope">
                          <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list13" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="holder" label="保持架" v-if="$store.getters.configData.orderField.holder" width="120" key="61">

                        <template slot-scope="scope">
                          <el-select v-model="scope.row.holder" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa004" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="clearance" label="游隙" v-if="clearanceFlag == 1" width="120" key="1055">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="aperture" label="孔径" v-if="apertureFlag == 1" width="120" key="106">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.aperture" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list10" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="packagingMethod" label="包装方式" v-if="packagingMethodFlag == 1" width="120"
                        key="101">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable
                            :disabled="btnType == 'look'" style="width: 100%;">
                            <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"
                        v-if="specialRequireFlag == 1" width="160" key="202">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable
                            :disabled="btnType == 'look'" style="width: 100%;">
                            <el-option v-for="(item, index) in list9" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="material" label="保持架材质" width="120" key="2118">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.material" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list12" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column> -->
                      <el-table-column prop="colour" :label="$store.getters.colour" width="120" key="210">
                        <!-- <template slot="header">
                            <span class="required">*</span>打字内容
                          </template> -->
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.colour" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list11" key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="processName" label="工序" width="160" key="103">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.processId" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in processList" :key="index" :label="item.name"
                              :value="item.id"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <template v-if="['inbound_purchase', 'outbound_sale_send', 'inbound_sale_return','outbound_purchase','inbound_other','outbound_other','inbound_order_production'].includes(dataForm.businessType)">
                      <el-table-column prop="specSize" label="规格/尺寸" width="120" key="2115" v-if="$store.getters.configData.orderField.specSize">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.specSize" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa017" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="logo" label="Logo" width="120" key="2116" v-if="$store.getters.configData.orderField.logo">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.logo" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa019" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="divideEqually" :label="$store.getters.divideEqually"  min-width="120" key="2117" v-if="$store.getters.configData.orderField.divideEqually">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.divideEqually" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa020" :key="index"
                              :label="item.name" :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="material" label="材质" min-width="120" key="2118" v-if="$store.getters.configData.orderField.material">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.material" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa021" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="brand" label="品牌" min-width="120" key="2118" v-if="$store.getters.configData.orderField.brand">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.brand" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa011" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="sealingCoverStructure" label="密封盖" min-width="120" key="2118" v-if="$store.getters.configData.orderField.sealingCoverStructure">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.sealingCoverStructure" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa012" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                       <el-table-column prop="structureType" label="结构类型" min-width="120" key="2118" v-if="$store.getters.configData.orderField.structureType">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.structureType" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa013" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="noise" label="噪音" min-width="120" key="2118" v-if="$store.getters.configData.orderField.noise">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.noise" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa014" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="aperture" label="孔径" min-width="120" key="2118" v-if="$store.getters.configData.orderField.aperture">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.aperture" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa009" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      </template>
                      <el-table-column prop="protrusion" :label="$store.getters.protrusion"  width="120" :key="103"
                        v-if="$store.getters.configData.orderField.protrusion">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.protrusion" placeholder="请选择" filterable allow-create clearable style="width: 100%;">
                          <el-option v-for="(item, index) in bimProductAttributesList.pa023" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                      <el-table-column prop="preload" label="预负荷" min-width="120" key="2118" v-if="$store.getters.configData.orderField.preload">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.preload" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa024" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="angle" label="角度" min-width="120" key="2118" v-if="$store.getters.configData.orderField.angle">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.angle" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa025" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="remark" label="备注" width="200" key="128">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" v-model="scope.row.remark"
                            placeholder="备注"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="remark2" label="备注2（LOT NO）" width="200" key="128">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" v-model="scope.row.remark2"
                            placeholder="备注"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="remark3" label="备注3（客户批次号）" width="200" key="128">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" v-model="scope.row.remark3"
                            placeholder="备注"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" fixed="right" :width="$store.getters.configData.product.enable_symbol ? 120 : 100"
                        v-if=" btnType != 'look'">
                        <template slot-scope="scope">
                          <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                          <el-button type="text" v-if="$store.getters.configData.product.enable_symbol && ['inbound_order_production','inbound_purchase','inbound_other'].includes(dataForm.businessType)" :disabled="!scope.row.productsId ? true : btnType === 'look'"
                                       @click="selectProductSymbol(scope,productData)" style=" color: #3fb9f8">选择代号</el-button>
                        </template>
                      </el-table-column>
                    </JNPF-table>
                    <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
                      <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ totalAmount }}</span>
                      <span style="font-weight:500;margin-right:10px">总数量：{{ totalNum }}</span>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'">
                </UploadWj>
              </el-tab-pane>
              <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择产品 产品信息 -->
    <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" @close="productVisible = false"
      :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
      append-to-body>
      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                <el-form-item>
                  <el-input v-model="orderForm.partnerName" placeholder="请输入供应商"
                  @keyup.enter.native="searchProductFun" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'outbound' && productNameFlag == '1'">
                <el-form-item>
                  <el-input v-model="orderForm.productName" placeholder="请输入产品名称" @keyup.enter.native="searchProductFun"
                    clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                <el-form-item>
                  <el-input v-model="orderForm.productDrawingNo" placeholder="请输入品名规格"
                    @keyup.enter.native="searchProductFun" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                <el-form-item>
                  <el-input v-model="listQuery.partnerName" placeholder="请输入供应商"
                  @keyup.enter.native="searchProductFun" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'inbound' && productNameFlag == '1'">
                <el-form-item>
                  <el-input v-model="listQuery.productName" placeholder="请输入产品名称" @keyup.enter.native="searchProductFun"
                    clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                <el-form-item>
                  <el-input v-model="listQuery.productDrawingNo" placeholder="请输入品名规格"
                  @keyup.enter.native="searchProductFun" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductFun()">
                    {{ $t('common.search') }}</el-button>
                  <el-button size="mini" icon="el-icon-refresh-right" @click="resetProductFun()">{{
                    $t('common.reset') }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <div class="JNPF-common-head">
              <div></div>
              <div class="JNPF-common-head-right">

                <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                  <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                    @click="productColumnSetFun()" />
                </el-tooltip>
              </div>
            </div>
            <JNPF-table ref="productVisibles" :partentOrChild="'child'" custom-column v-loading="listLoading"
              :data="productList" hasC :fixedNO="true" @selection-change="handleSelectionChangeAllPruduct"
              @sort-change="sortChange" @row-click="handleRowClick">
              <el-table-column prop="partnerName" label="供应商名称" width="140" key="partnerName" sortable="custom"
                v-if="dataForm.businessType !== 'inbound_sale_return'" />
              <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="productCode" />
              <el-table-column prop="code" label="产品编码" min-width="130" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" key="code" />
              <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && productNameFlag == '1'" />
              <el-table-column prop="name" label="产品名称" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'inbound' && productNameFlag == '1'" />
              <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="productDrawingNo" />
              <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" key="drawingNo" />
              <el-table-column prop="pairingModeName" label="配对方式" width="160" />


              <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                v-if="isProjectSwitch == 1" />
              <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" width="120" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="mainUnit" />
              <el-table-column prop="deputyUnit" label="单位(副)" width="120" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && mainUnitFlag == 1" key="mainUnit" />
              <el-table-column prop="inventoryQuantity" label="库存数量" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="inventoryQuantity" />
              <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="availableQuantity" />
              <el-table-column prop="occupancyQuantity" label="占用库存数量" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="occupancyQuantity" />
              <el-table-column prop="batchNumber" label="批次号" width="180" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="batchNumber" />
              <el-table-column prop="warehouseName" label="仓库名称" width="180" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="warehouseName" />
              <el-table-column prop="shelfSpaceName" label="库位名称" width="180" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="shelfSpaceName" />
              <el-table-column prop="standardValue" label="规值" width="80" sortable="custom"
                v-if="standardValueFlag == 1" key="standardValue" />
              <el-table-column prop="colour" :label="$store.getters.colour" width="80" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && colourFlag == 1" key="colour" />
              <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping" width="140"
                sortable="custom" v-if="dataForm.documentType == 'outbound' && sealingCoverTypingFlag == 1"
                key="sealingCoverTyping" />
              <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel" width="110" sortable="custom"
                v-if=" accuracyLevelFlag == 1" key="accuracyLevel" />
                <el-table-column prop="wireHeatNumber" v-if="isXY" label="钢丝炉号" width="120" />
                <el-table-column prop="rawStockMill" v-if="isXY" label="原材料厂家" width="120" />

              <el-table-column prop="vibrationLevel" label="振动等级" width="110" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && vibrationLevelFlag == 1" key="vibrationLevel" />
              <el-table-column prop="oil" label="油脂" width="80" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && oilFlag == 1" key="oil" />
              <el-table-column prop="clearance" label="游隙" width="80" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && clearanceFlag == 1" key="clearance" />
              <el-table-column prop="aperture" label="孔径" width="80" :key="102" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && apertureFlag == 1" key="aperture"></el-table-column>
              <el-table-column prop="packagingMethod" label="包装方式" width="110" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && packagingMethodFlag == 1" key="packagingMethod" />
              <el-table-column prop="specialRequire" :label="$store.getters.specialRequire" width="110"
                sortable="custom" v-if="dataForm.documentType == 'outbound' && specialRequireFlag == 1"
                key="specialRequire" />
              <el-table-column prop="remark" label="备注" width="100"
                v-if="dataForm.documentType == 'outbound'" key="remark" />
              <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" key="createTime" />
            </JNPF-table>
            <pagination :total="productTotal" v-if="dataForm.documentType == 'outbound'" :page.sync="orderForm.pageNum"
              :limit.sync="orderForm.pageSize" @pagination="searchProductFun" />
            <pagination :total="productTotal" v-if="dataForm.documentType == 'inbound'" :page.sync="listQuery.pageNum"
              :limit.sync="listQuery.pageSize" @pagination="searchProductFun" />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" productVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="seleBtnLoading" :disabled="seleBtnLoading===true" @click="submitAllProduct()">
          确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
      <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
          {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="continueAdd()"> 继续新增</el-button>
      </span>
    </el-dialog>
    <el-dialog title="扫码录入" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="true" :visible.sync="scanDialog" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px"
      @close="closeScanDiaFun()">
      <div class="scand">
        <div class="box">
          <el-input v-model="scanResult" ref="inputRef" placeholder="请扫产品码" @keyup.enter.native="getProductFun()">
          </el-input>
          <div class="tip">说明：根据产品码自动添加对应的产品</div>
        </div>
      </div>
    </el-dialog>
    <!-- 选客户 -->
    <CustomerForm v-if="CustomerForm" ref="CustomerForms" @selectCustomer="handleSelectCustomer"></CustomerForm>
    <!-- 选库位 -->
    <WareHouseForm v-if="wareHouseVisible" ref="WareHouseForms" @selectWareHouseFun="selectWareHouseFun">
    </WareHouseForm>
    <!-- 选批次号 -->
    <BatchNumberForm v-if="batchNumVisible" ref="BatchNumberForms" @selectBatchNumberFun="selectBatchNumberFun">
    </BatchNumberForm>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
    <productSymbolForm v-if="productSymbolVisible" ref="productSymbolForm" :productId="currentProductId" @selectProductSymbolData="selectProductSymbolData"></productSymbolForm>
  </div>
</template>
<script>
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList, stockWarehouseBusinessTypeList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getWarehouseInfo, getStockGoodsShelvesList, getProductionLotList, getBimBusinessSwitchConfigList, getBatchNumber, getStockGoodsShelves } from '@/api/basicData/index'
import { getProductList } from '@/api/masterDataManagement/productManage'
import { getBimProcessList } from '@/api/bimProcess/index'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import WareHouseForm from './wareHouseForm.vue'
import CustomerForm from './customerForm.vue'
import BatchNumberForm from './batchNumberForm.vue'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import { getclassAttributelistByCode } from '@/api/masterDataManagement/index'
import { getCooperativeData, getOrderFiledMap, getBimBusinessDetail } from '@/api/basicData/index'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import flowMixin from '@/mixins/generator/flowMixin'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo } from '@/api/system/printDev'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import tenantMinix from "@/mixins/generator/TenantMinix";
import ProductSymbolForm from '@/views/salesManagement/orderManagement/orderList/productSymbol.vue'
import ProductSymbolMixin from '@/mixins/generator/ProductSymbolMixin'

export default {
  components: { ProductSymbolForm, WareHouseForm, BatchNumberForm, CustomerForm, Process, PrintBrowse, PrintDialog },
  mixins: [flowMixin, getProjectList,tenantMinix,ProductSymbolMixin],
  props: {
    warehouseCode: "",
  },
  name: "directInandOutWarehouse",
  data() {
    return {
      seleBtnLoading:false,
      customStyleData:0,
      columnList:[],
      datafilelist: [],
      isattachmentswitch: '',
      attachmentData: {},
      printVisible: false,
      isProjectSwitch: '',
      prindId: '',
      formId: '',
      enCode: "",
      weightFlagList: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      scanResult: "",
      scanDialog: false,
      processList: [],
      documentTypeList: [
        { label: "直接出库", value: "outbound", },
        { label: "直接入库", value: "inbound", },
      ],
      businessType2Title: Object.freeze(new Map([
        ["outbound_sale_send", "销售发货"],
        ["inbound_sale_return", "销售退货"],
        ["inbound_purchase", "采购收货"],
        ["outbound_purchase", "采购退货"],
        ["outbound_external_send", "外协发料"],
        ["inbound_external", "外协收货"],
        ["inbound_order_production", "生产产品入库"],
        ["inbound_production", "生产工单入库"],
        ["outbound_pick_out", "生产领料"],
        ["inbound_return_materials", "生产退料"],
        ["inbound_mock_production", "生产入库"],
        ["outbound_use", "资产领用"],
        ["inbound_return", "资产归还"],
        ["inbound_receive_material", "直接领料入库"],
        ["outbound_receive_material", "直接领料出库"],

      ])),
      list: [],
      batchNumVisible: false,
      wareHouseVisible: false,
      // 选择批次号请求条件
      batchNOForm: {
        batchNumber: "",
        shelfSpaceName: "",
        orderItems: [{
          "asc": false,
          "column": ""
        },],
        productsId: "",
        pageNum: 1,
        pageSize: 20,
        warehouseId: "",
      },
      btnText: "",
      submitmethodsTitle: "",
      tipsvisible: false,
      CustomerForm: false,
      activeNames: ["productInfo", "basicInfo"],
      jyFlag: false,//是否显示检验标志
      codeConfig: {},//单号配置信息(单据规则)
      dataForm: {  //表单信息
        orderNo: "",
        warehouseName: "",
        warehouseId: "",
        documentType: "",
        businessType: "",
        sourceType: "direct",
        id: "",
        warehouseType: "",
        inspectionResults: "",
        partnerName: "",
        cooperativePartnerId: "",
        cooperativePartnerIdText:"",
        approvalFlag: false,
        weightFlag: false,
        orderDate: this.jnpf.getToday(),
        recipientBy: "",
        diffBatchNumFlag: true,
      },
      weightFlagList: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      customerInfo: {},//所选客户信息
      getWarehouseList,
      inspectionResultsList: [//检验下拉框数据
        { label: "待检验", value: "unInspect" },
        { label: "合格", value: "qualified" },
      ],
      dataRule: {
        documentType: [{ required: true, message: "单据类型不能为空", trigger: 'change' }],
        inspectionResults: [{ required: true, message: "检验结果不能为空", trigger: 'change' }],
        orderDate: [
          { required: true, message: '单据日期不能为空', trigger: 'change' }
        ],
        orderNo: [{ required: true, message: "请输入单号", trigger: 'blur' }],
        cooperativePartnerIdText: [
          { required: true, message: '客户不能为空', trigger: 'change' }
        ],
        warehouseName: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
        weightFlag: [
          { required: true, message: '是否显示比重折扣不能为空', trigger: 'change' }
        ],
        recipientBy: [
          { required: true, message: '领(退)料人不能为空', trigger: 'change' }
        ],
      },
      orderForm: { //获取产品数据
        productDrawingNo: "",        // customerProductNo: "",
        customerProductDrawingNo: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        partnerName:"",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
        productName: "",
      },
      productList: [],
      productTotal: 0,
      productVisible: false,
      selectSaleProductArr: [],
      productData: [],
      selectRows: [],
      listLoading: false,
      currentProductIndex: "",
      title: "",
      visible: true,
      btnType: 'add',
      wareVisibled: false,
      btnLoading: false,
      formLoading: false,
      allocationFlag: false,
      dataFormItems: [/* 通过 this.refeshDataFormItems() 动态更改 */],
      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      spaceLines: [],
      productionLotList: [],
      loadingText: '',
      copyLinesData: [],
      previousValue: "",
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
      list9: [],
      list10: [],
      list11: [],
      list12: [],
      taxRateList: [],
      listQuery: {
        productName: '',
        productCode: '',
        productDrawingNo: '', // 图号
        partnerName:"",
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
        classAttribute: ''
      },
      activeName: "orderInfo",
      flowTemplateJson: {},
      flowData: {},
      classAttributeList: [],
      // 客户
      partnerFlag: false,
      getcategoryTrees, // 客户列表
      getCooperativeData, // 客户列表
      getCooperativeMethodArr: { method: getcategoryTrees, requestObj: { type: 'customer' } },
      partnerRequestObj: {
        code: "",
        name: "",
        taxId: "",
        mobilePhone: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }, // 意向客户列表入参
      partnerSearchList: [
        { prop: 'code', label: '客户编码', type: 'input' },
        { prop: 'name', label: '客户名称', type: 'input' },
        { prop: 'taxId', label: '税号', type: 'input' }
      ], // 客户搜索条件
      partnerTableItems: [
        { prop: 'code', label: '客户编码' },
        { prop: 'name', label: '客户名称' },
        { prop: 'taxId', label: '税号' },
      ], // 客户列表字段
      partnerTitle: '',
      partnerDialogTitle: '',
      partnerTreeTitle: '',
      partnerPlaceholder: '',
      productNameFlag: null,
      printBrowseVisible: false,
      mainUnitFlag: null,
      tableDataFlag: true,
      arr: [
        {
          businessType: 'inbound_purchase',
          code: "p017",
          fullName: "采购收货单"
        },
        {
          businessType: 'outbound_purchase',
          code: "p008",
          fullName: "采购退货"
        },
        {
          businessType: 'outbound_external_send',
          code: "p013",
          fullName: "外协发料单"
        },
        {
          businessType: 'outbound_sale_send',
          code: "p031",
          fullName: "销售发货单"
        },
        {
          businessType: 'inbound_sale_return',
          code: "p031",
          fullName: "销售退货单"
        },
      ],
      calculateQuantityFlag: "",
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      bimProductAttributesList: [],
      standardValueFlag: "",
      apertureFlag: "",
      colourFlag: "",
      processFlag: "",
      pairingModeList: [],
      diffBatchList: [
        { label: '产品生成同批次号', value: false },
        { label: '产品生成不同批次号', value: true },
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    totalAmount: function () {
      var totalAmounts = 0;
      for (var i = 0; i < this.productData.length; i++) {
        totalAmounts = this.jnpf.math('add', [totalAmounts, this.productData[i].totalAmount])
      }
      return totalAmounts
    },
    totalNum: function () {
      var totalNums = 0;
      for (var i = 0; i < this.productData.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.productData[i].num])
      }
      return totalNums
    },

  },
  async created() {
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    await this.getpairingModeListFun()
    await this.getWarehouseListFun()
    await this.switchStyleheight()

    this.getprocessList()
    this.getclassAttributeList()
    this.getBusInfo('b046')
    let objs = { "pageSize": -1, "businessCode": "product" }
    await getBimBusinessSwitchConfigList(objs).then(res => {
      this.productNameFlag = res.data.product[1].configValue1
    })
    this.$nextTick(() => { this.$refs.products.doLayout() })
  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        this.getBusinessTypeList();
        if (oldVal) this.spaceLines = []
      },
    }
  },
  async mounted() {
    this.getBimBusinessDetail()
  },
  methods: {
    selectWeight() {
      this.$nextTick(() => { this.$refs.products.doLayout() })

    },
    changePairingMode(value, scope) {
      if (value) {
        this.productData[scope.$index].deputyUnit = this.productData[scope.$index].mainUnit = this.pairingModeList.filter(items => items.id === value)[0].unit;
      }
    },
    // 获取配对方式
    async getpairingModeListFun() {
      try {
        this.pairingModeList = await this.jnpf.getpairingModeListFun()
        console.log("this.par", this.pairingModeList);
      } catch (error) { }
    },
    async getBusinessTypeList() {
      const res = await stockWarehouseBusinessTypeList(this.dataForm.warehouseId)
      const list = [{ label: "直接入库", value: "inbound_other" }, { label: "直接出库", value: "outbound_other" },]
      let resList = list
      if (res.data.records.length) {
        const temp = res.data.records.map(item => {
          return {
            label: this.businessType2Title.get(item.businessType),
            value: item.businessType
          }
        })
        resList = temp.filter(item => item.value !== 'inbound_flip').concat(list)
      }
      this.list = resList
      if(this.btnType=='look'){
        this.list=[...this.list,...[{ label: "组装入库", value: "inbound_merge", },
            { label: "拆卸入库", value: "inbound_split", },
            { label: "形态转换入库", value: "inbound_shift", },
            { label: "组装出库", value: "outbound_merge", },
            { label: "拆卸出库", value: "outbound_split", },
            { label: "形态转换出库", value: "outbound_shift", },
            { label: "调拨出库", value: "outbound_transfer", },
            { label: "调拨入库", value: "inbound_transfer", },
            { label: "直接领料入库", value: "inbound_receive_material", },
            { label: "直接领料出库", value: "outbound_receive_material", }],]
      }
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_outAndInWarehouse'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.attachmentData = res.data
      })
    },
    async getOrderFiledMap() {
      await getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
          console.log(this.sealingCoverTypingFlag,'thissealingCoverTypingFlag')
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
      await getOrderFiledMap('purchase').then(res => {
        this.standardValueFlag = res.data.standardValue
          console.log(this.standardValueFlag,'standardValueFlag')
        this.processFlag = res.data.process
      })
    },
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })
      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log("税率", this.taxRateList);
      })
      // 工序
      let obj8 = {
        pageNum: -1,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getBimProcessList(obj8).then((res) => {
        this.processList = res.data.records
      })
    },
    advancedQueryFuns() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式
      //     specialRequire //特殊要求
      console.log(this.dataForm.businessType, this.bimProductAttributesList);
      // if (this.dataForm.businessType == 'inbound_purchase') {
        if (this.standardValueFlag === '1') {
          this.list8 = this.bimProductAttributesList.pa008.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }

      // }
      if (this.materialFlag === '1') {
        this.list12 = this.bimProductAttributesList.pa021.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })

      }
      if (this.colourFlag === '1') {
        this.list11 = this.bimProductAttributesList.pa010.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })

      }
      if (this.specialRequireFlag === '1') {
        this.list9 = this.bimProductAttributesList.pa016.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.packagingMethodFlag === '1') {
        this.list7 = this.bimProductAttributesList.pa015.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.clearanceFlag === '1') {
        this.list6 = this.bimProductAttributesList.pa001.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })

      }

      if (this.oilFlag === '1') {
        this.list4 = this.bimProductAttributesList.pa002.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.oilQuantityFlag === '1') {
        this.list13 = this.bimProductAttributesList.pa003.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.vibrationLevelFlag === '1') {
        this.list3 = this.bimProductAttributesList.pa005.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.accuracyLevelFlag === '1') {
        this.list2 = this.bimProductAttributesList.pa006.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.sealingCoverTypingFlag === '1') {
        this.list1 = this.bimProductAttributesList.pa007.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }

    },
    async getMainUnitFun(code, type, flag) {
      this.listLoading = true
      this.tableDataFlag = false
      try {
        if (flag == 'unitFlag') this.mainUnitFlag = await this.jnpf.getMainUnitFun(code, type);
        if (flag == 'proportionFlag') this.calculateQuantityFlag = await this.jnpf.getMainUnitFun(code, type);
        this.dataForm.weightFlag = this.calculateQuantityFlag == 1 ? true : false
        console.log("this.dataForm.weightFlag ", this.dataForm.weightFlag);
        this.tableDataFlag = true
        this.listLoading = false
      } catch (error) {
      }
    },
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.printVisible = false
          this.prindId = res.data.id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    closePrint() {
      this.printVisible = false
      this.$message.warning("取消打印")
    },
    computedNumFun(data, index) {
      if (data.discount && data.proportion && data.weight) {
        if (Number(data.discount) > 1 || Number(data.discount) < 0) return this.$message.error("请输入合理的折扣值，0~1范围内")
        this.productData[index].num = Math.floor(data.proportion * data.weight * data.discount)
        this.watchNum(data, index)
      }
    },
    getclassAttributeList() {
      getclassAttributelistByCode({ code: this.warehouseCode }).then(res => {
        console.log("类别属性", res);
        this.classAttributeList = res.data
      })
    },
    getProductFun() {
      if (!this.scanResult) return
      let obj = {
        productName: "",
        productCode: this.scanResult,
        productDrawingNo: '', // 图号
        classAttributeList: this.classAttributeList,
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
      }
      getProductList(obj).then(res => {
        res.data.records.forEach(item => {
          item.productCode = item.code
          item.productDrawingNo = item.drawingNo
          this.$set(item, 'num', '')
          if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'inbound_external') {
            this.$set(item, 'discount', '')
            this.$set(item, 'proportion', '')
            this.$set(item, 'weight', '')
          }
        });
        this.$nextTick(() => {
          if (res.data.records.length) {
            this.productData.push(res.data.records[0])
          }
          this.scanResult = ""
        })
      })
    },
    scanFun() {
      this.scanDialog = true
      this.$nextTick(() => {
        this.$refs.inputRef.$refs.input.focus();
      });
    },
    closeScanDiaFun() {
      this.scanDialog = false
      this.scanResult = ""
    },
    getprocessList() {
      let obj = {
        "name": "",
        "code": "",
        "processingType": "",
        "orderItems": [{ "asc": false, "column": "" }, { "asc": false, "column": "create_time" }],
        "pageNum": -1,
        "pageSize": -1,
        "productCategoryId": ""
      };
      obj.projectId = this.isProjectSwitch === '1' ? this.dataForm.projectId || '' : ''
      getBimProcessList(obj).then(res => {
        this.processList = res.data.records
      })
    },
    // 所选择的客户数据
    handleSelectCustomer(data) {
      this.dataForm['cooperativePartnerId'] = data.id
      this.dataForm['partnerName'] = data.name
      this.customerInfo = data
    },
    changeTaxRate(row, index) {
      let productArr = [...this.productData]
      productArr[index].excludingTaxCostPrice = this.jnpf.numberFormat(row.costPrice / (1 + (row.taxRate * 1 / 100)), 4)
      productArr[index].excludingTaxTotalAmount = this.jnpf.numberFormat((row.excludingTaxCostPrice * row.num), 4)
      productArr[index].taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [row.costPrice, row.excludingTaxCostPrice]), 6)]), 6)
      this.productData = productArr
    },
    // 打开选择批次号弹框
    openSeleceBatchNumberDialog(data, index) {
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库")
      this.batchNumVisible = true
      data.warehouseId = this.dataForm.warehouseId
      this.$nextTick(() => {
        this.$refs.BatchNumberForms.init(data, index)
      })
    },
    // 选择批次
    selectBatchNumberFun(data, index) {
      console.log("data", data, index);
      this.$set(this.productData[index], 'cooperativePartnerId', data.cooperativePartnerId)  // 供应商Id
      this.$set(this.productData[index], 'partnerName', data.partnerName) // 供应商名称
      this.$set(this.productData[index], 'warehouseId', data.warehouseId)
      this.$set(this.productData[index], 'shelfSpaceId', data.shelfSpaceId)
      this.$set(this.productData[index], 'shelfSpaceName', data.shelfSpaceName)
      let num = this.jnpf.numberFormat(this.jnpf.math('subtract', [data.availableQuantity, data.occupancyQuantity]), 6)
      this.$set(this.productData[index], 'availableBatchNumber', num)
      this.$set(this.productData[index], 'batchNumber', data.batchNumber)
      this.$set(this.productData[index], 'inventoryQuantity', data.inventoryQuantity)
      this.$set(this.productData[index], 'costPrice', data.price)
      this.$set(this.productData[index], 'taxRate', data.taxRate * 1)
      this.$set(this.productData[index], 'excludingTaxCostPrice', data.excludingTaxPrice * 1)
      if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'inbound_external') {
        this.$set(this.productData[index], 'discount', '')
        this.$set(this.productData[index], 'proportion', '')
        this.$set(this.productData[index], 'weight', '')
      }
    },
    // 打开选择库位弹框
    openSeleceWareDialog(row, index) {
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库!")
      this.wareHouseVisible = true
      this.$nextTick(() => {
        this.$refs.WareHouseForms.initData(this.dataForm.warehouseId)
      })
      this.currentProductIndex = index
    },
    // 所选的库位信息
    selectWareHouseFun(data) {
      let index = this.currentProductIndex
      this.$set(this.productData[index], 'shelfSpaceName', data.name)
      this.$set(this.productData[index], 'shelfSpaceId', data.id)
      this.$set(this.productData[index], 'warehouseId', data.warehouseId)
    },
    // 产品信息列表复制功能
    copyFun(row, index) {
      let data = JSON.parse(JSON.stringify(row))
      this.productData.splice(index + 1, 0, data);
    },
    // 点击选择产品
    openSeleceProductDialog() {
      if (!this.dataForm.documentType) return this.$message.error("请先选择业务类型")
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库")
      this.productVisible = true
    this.seleBtnLoading=false
      this.orderForm.productName = ""
      this.listQuery.productName = ""
      this.listQuery.pageNum = 1
      this.listQuery.pageNum = 1
      this.advancedQueryFuns()
      this.resetProductFun()
      this.$nextTick(() => { this.$refs.productVisibles.doLayout() })
    },
    // 销售发货选择产品——搜索 如果是销售订单  需要计算待出库数量=订单数量-已出库数量  如果是通知单 则直接取接口返回的待出库数量
    searchProductFun() {
      if (this.dataForm.documentType == 'outbound') {
        this.orderForm.classAttributeList = this.classAttributeList
        this.orderForm.warehouseId = this.dataForm.warehouseId
        this.orderForm.availableBatch = true
        this.orderForm.projectId = this.isProjectSwitch === '1' ? this.dataForm.projectId || '' : ''
        getBatchNumber(this.orderForm).then(res => {
          this.productList = res.data.records
          this.productTotal = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.listLoading = true
        Object.keys(this.listQuery).forEach((key) => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        // this.listQuery.pageNum = 1
        this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
        this.listQuery.classAttributeList = this.classAttributeList
        this.listQuery.projectId = this.isProjectSwitch === '1' ? this.dataForm.projectId || '' : ''
        getProductList(this.listQuery)
          .then((res) => {
            this.productList = res.data.records
            this.productTotal = res.data.total
            this.listLoading = false
            this.visible = false
          })
          .catch(() => {
            this.listLoading = false
          })
      }
    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      this.selectSaleProductArr = val
    },
    handleRowClick(row){
        this.$refs.productVisibles.$refs.JNPFTable.toggleRowSelection(row);
    },
    // 销售发货选择产品——重置
    resetProductFun() {
      this.orderForm = { //获取产品数据
        productDrawingNo: "",        // customerProductNo: "",
        productName: "",
        productCode: "",
        warehouseId: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
      },
        this.listQuery = {
          productName: '',
          productCode: '',
          productDrawingNo: '', // 图号
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
          classAttributeList: this.classAttributeList
        },
        this.searchProductFun()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productDrawingNo' || prop === 'productName' || prop === 'productCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == 'partnerName' && this.dataForm.businessType == 'outbound') newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase())
      this.orderForm.orderItems[0].asc = order === 'ascending'
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.searchProductFun()
    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")

      this.productVisible = false
      let arr = JSON.parse(JSON.stringify(this.selectSaleProductArr))
      arr.forEach(item => {
        if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'inbound_external') {
          this.$set(item, 'discount', '')
          this.$set(item, 'proportion', '')
          this.$set(item, 'weight', '')
        }
        if (this.mainUnitFlag == 1) {
          this.$set(item, 'deputyNum', '')
          this.$set(item, 'deputyUnit', item.deputyUnit)
        }
        this.$set(item, 'warehouseId', this.dataForm.warehouseId)
        this.$set(item, 'warehouseName', this.dataForm.warehouseName)
        this.$set(item, 'warehouseType', this.dataForm.warehouseType)
        this.$set(item, 'productCategoryName', item.productCategoryName)
        this.$set(item, 'partnerName', item.partnerName)  //供应商名称
        this.$set(item, 'cooperativePartnerId', item.cooperativePartnerId) //供应商Id
        item.classAttribute = item.classAttribute
        item.ordersId = ""
        item.ordersLineId = ""
        item.noticeId = ""
        item.num = ''
        item.costPrice = ""
        item.excludingTaxCostPrice = ""
        item.excludingTaxTotalAmount = ""
        item.noticeLineId = ""
        item.ordersLineId = ""
        item.totalAmount = ""
        item.taxAmount = ""
        item.taxRate = item.taxRate * 1
        item.costPrice = item.price
        item.excludingTaxCostPrice = item.excludingTaxPrice
        if (this.dataForm.documentType == 'inbound') {
          item.productCode = item.code
          item.productName = item.name
          item.productsId = item.id
        }
        if (this.dataForm.businessType == 'inbound_purchase') {
          console.log(555, item.productCategoryName);
          if (item.productCategoryName == '保持架') {
            let arr = ['pa017', 'pa021']
            arr.forEach(items => {
              let obj1 = {
                pageNum: -1,
                pageSize: -1,
                typeCode: items,//保持架尺寸
              };
              getbimProductAttributesList(obj1).then(res => {
                if (items == 'pa017') {
                  console.log(66666);
                  this.$set(item, 'spaceSizeList', res.data.records)
                  console.log("item", item);
                } else {
                  this.$set(item, 'materialList', res.data.records)

                }
              })
            });
          }
          if (item.productCategoryName == '防尘盖') {
            let arr = ['pa018', 'pa022']
            arr.forEach(items => {
              let obj1 = {
                pageNum: -1,
                pageSize: -1,
                typeCode: items,//保持架尺寸
              };
              getbimProductAttributesList(obj1).then(res => {
                let list = items == 'pa018' ? 'spaceSizeList' : items == 'pa019' ? 'logoList' : items == 'pa020' ? 'divideEquallyList' : 'materialList'
                this.$set(item, list, res.data.records)
              })
            });
          }
          let arr = ['pa019', 'pa020']
          arr.forEach(items => {
            let obj1 = {
              pageNum: -1,
              pageSize: 20,
              typeCode: items,
            };
            getbimProductAttributesList(obj1).then(res => {
              let list = items == 'pa019' ? 'logoList' : 'divideEquallyList'
              this.$set(item, list, res.data.records)
            })
          });

        }

      });
      this.productData=[...this.productData,...arr]
      this.seleBtnLoading=true
      if (this.seleBtnLoading) return  ;
    },
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.products.showDrawer()
    },
    productColumnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.productVisibles.showDrawer()
    },
    // 产品信息列表多选
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 产品信息列表 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.productData.indexOf(row);
        if (index > -1) {
          this.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 含税价格输入失去焦点 检验不能为  0
    checkPrice(row, index) {
      if (!this.$store.getters.configData.warehouse.unitPriceSetting) return
      if (!row.costPrice) {
        this.$message({
          message: "请填写第" + (index + 1) + "行产品的单价(含税)",
          type: 'error',
          duration: 1500,
        })
      } else if (Number(row.costPrice) == 0) {
        this.$message({
          message: "第" + (index + 1) + "行产品的单价(含税)必须大于0",
          type: 'error',
          duration: 1500,
        })
      }
    },
    // 监听含税价格输入
    watchPrice(row, index) {
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      row.costPrice = row.costPrice.replace(/[^\d.]/g, '');
      let productArr = [...this.productData]
      if (row.costPrice.length == 1 && row.costPrice == '.') {
        // 如果第一位是小数点，则清空输入框
        row.costPrice = '';
        row.assistantNum = '';
      } else if (row.costPrice.length == 2 && row.costPrice[0] == '0' && row.costPrice[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.costPrice = row.costPrice.slice(0, 1) + '.' + row.costPrice.slice(1);
      } else if (row.costPrice.length > 2 && row.costPrice[0] == '0' && row.costPrice[1] != '.') {
        row.costPrice = row.costPrice.substring(1, row.costPrice.length)
      }
      if (row.costPrice.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.costPrice.length; i++) {
          const char = row.costPrice[i];
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
        row.costPrice = result;
        let arr = row.costPrice.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 4) {
          arr[1] = arr[1].substring(0, 4)
        }
        row.costPrice = arr[0] + '.' + arr[1]
      } else {
        if (row.costPrice.length > 8) {
          row.costPrice = row.costPrice.substring(0, 8);
        }
      }
      productArr[index].excludingTaxCostPrice = this.jnpf.numberFormat(row.costPrice / (1 + (row.taxRate * 1 / 100)), 4)
      productArr[index].excludingTaxTotalAmount = this.jnpf.numberFormat((row.excludingTaxCostPrice * row.num), 4)
      productArr[index].totalAmount = this.jnpf.numberFormat((row.costPrice * row.num), 4)
      productArr[index].taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [row.costPrice, row.excludingTaxCostPrice]), 6)]), 6)
      this.productData = productArr
    },
    // 主数量输入失去焦点 检验不能为  0
    checkNum(row, index) {
      if (!row.num) {
        this.$message({
          message: "请填写第" + (index + 1) + "行产品的主数量",
          type: 'error',
          duration: 1500,
        })
      } else if (Number(row.num) == 0) {
        this.$message({
          message: "第" + (index + 1) + "行产品的数量必须大于0",
          type: 'error',
          duration: 1500,
        })
      }
    },
    // 监听主数量输入
    watchNum(row, index) {
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      row.num = row.num.replace(/[^\d.]/g, '');
      let productArr = [...this.productData]
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
        if (arr[1].length > 4) {
          arr[1] = arr[1].substring(0, 4)
        }
        row.num = arr[0] + '.' + arr[1]
      } else {
        if (row.num.length > 8) {
          row.num = row.num.substring(0, 8);
        }
      }
      if (this.mainUnitFlag == 1) {
        if (row.calculationDirection == 'multiplication') {
          productArr[index].deputyNum = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.ratio]), 6)
        } else {
          productArr[index].deputyNum = this.jnpf.numberFormat(this.jnpf.math('divide', [row.num, row.ratio]), 6)
        }
      }
      productArr[index].totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.costPrice]), 6)
      productArr[index].taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [row.costPrice, row.excludingTaxCostPrice]), 6)]), 6)
      productArr[index].excludingTaxTotalAmount = this.jnpf.numberFormat(this.jnpf.math('subtract', [productArr[index].totalAmount, productArr[index].taxAmount]), 6)
      this.productData = productArr
    },
    // 选择业务类型
    selectDocutementType(val) {
      // 如果选择的是外协收货 外协发料 采购收退货 需要调用后台参数配置 是否开启显示重量比重折扣显示
      if (val == 'inbound_purchase' || val == 'outbound_purchase' || val == 'outbound_external_send' || val == 'inbound_external') {
        this.getMainUnitFun('warehouse', 'proportion', 'proportionFlag')
      } else {
        this.dataForm.weightFlag = false
      }
      if (val == 'outbound_sale_send' || val == 'outbound_purchase' || val == 'outbound_pick_out' || val == 'outbound_external_send' || val == 'outbound_other') {
        // if (  val == 'outbound_other') {
        this.dataForm.documentType = 'outbound'
        if (this.btnType == 'add') this.fetchData("CKDH")
      }
      if (val == 'inbound_sale_return' || val == 'inbound_production' || val == 'inbound_order_production' || val == 'inbound_purchase' || val == 'inbound_return_materials' || val == 'inbound_external' || val == 'inbound_other') {
        // if ( val == 'inbound_other') {
        this.dataForm.documentType = 'inbound'
        if (this.btnType == 'add') this.fetchData("RKDH")
      }

      // 如果选的是销售发退货、采购收退货、直接出入库、生产产品入库
      if (val == 'outbound_sale_send' || val == 'inbound_sale_return') {
        this.partnerFlag = true
        this.partnerTitle = '客户'
        this.partnerDialogTitle = '选择客户'
        this.partnerTreeTitle = '客户分类'
        this.partnerPlaceholder = '请选择客户'
        this.getCooperativeMethodArr = { method: getcategoryTrees, requestObj: { type: 'customer' } }
        this.partnerRequestObj = {
          code: "",
          name: "",
          taxId: "",
          mobilePhone: '',
          pageNum: 1,
          pageSize: 20,
          partnerCategoryId: "",
          type: "customer",
        } // 意向客户列表入参
        this.dataRule.cooperativePartnerIdText[0].message = '客户不能为空'
      } else if (val == 'inbound_purchase' || val == 'outbound_purchase') {
        this.partnerFlag = true
        this.partnerTitle = '采购供应商'
        this.partnerDialogTitle = '选择采购供应商'
        this.partnerTreeTitle = '采购供应商分类'
        this.partnerPlaceholder = '请选择采购供应商'
        this.getCooperativeMethodArr = { method: getcategoryTrees, requestObj: { type: 'supplier' } }
        this.partnerRequestObj = {
          code: "",
          name: "",
          taxId: "",
          mobilePhone: '',
          pageNum: 1,
          pageSize: 20,
          saleFlag: 1,
          partnerCategoryId: "",
          type: "supplier",
        } // 意向客户列表入参
        this.dataRule.cooperativePartnerIdText[0].message = '采购供应商不能为空'
        // this.dataRule
      } else if (val == 'outbound_external_send' || val == 'inbound_external') {
        this.partnerFlag = true
        this.partnerTitle = '外协供应商'
        this.partnerDialogTitle = '选择外协供应商'
        this.partnerTreeTitle = '外协供应商分类'
        this.partnerPlaceholder = '请选择外协供应商'
        this.getCooperativeMethodArr = { method: getcategoryTrees, requestObj: { type: 'outsourcing_suppliers' } }
        this.partnerRequestObj = {
          code: "",
          name: "",
          taxId: "",
          mobilePhone: '',
          pageNum: 1,
          pageSize: 20,
          saleFlag: 1,
          partnerCategoryId: "",
          type: "outsourcing_suppliers",
        } // 意向客户列表入参
        this.dataRule.cooperativePartnerIdText[0].message = '外协供应商不能为空'
      } else {
        this.partnerFlag = false
      }
      if(this.btnType!='look'){

        this.dataForm.cooperativePartnerIdText=""
      this.dataForm.cooperativePartnerId=""
      }
      console.log(111,this.$refs.products);
      setTimeout(() => {
        this.$nextTick(() => { this.$refs.products.doLayout() })
      }, 500);
      this.productData = []
      if (this.productData.length) {
        this.productData.forEach(item => {
          if (item.productDrawingNo) {
            item.drawingNo = item.productDrawingNo
          }
          if (item.drawingNo) {
            item.productDrawingNo = item.drawingNo
          }
        });
      }
      this.getBusInfo('b046')
      this.orderForm = { //获取产品数据
        cooperativePartnerId: "",
        productDrawingNo: "",        // customerProductNo: "",
        customerProductDrawingNo: "",
        productName: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
      }
    },
    // 打开选择客户弹框
    openDialog() {
      this.CustomerForm = true
      this.$nextTick(() => {
        this.$refs.CustomerForms.init()
      })
    },
    changeWarehousex(val, data) {
      this.productData = []
      this.dataForm.businessType = ""
      this.partnerFlag = false
      console.log(val, data);
      if (!val && !data.length) {
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.warehouseType = ""
        return
      }
      console.log(data);
      if (data[0].id) {
        this.allocationFlag = data[0].all.locationStatus == 'disabled' ? false : true
        this.dataForm.warehouseId = data[0].id
        this.dataForm.warehouseName = data[0].name
        this.dataForm.warehouseType = data[0].all.type
        if (this.productData.length) {
          this.productData.forEach(item => {
            this.$set(item, 'warehouseId', this.dataForm.warehouseId)
            this.$set(item, 'warehouseName', this.dataForm.warehouseName)
            this.$set(item, 'warehouseType', this.dataForm.warehouseType)
          });
        }
      }
    },
    goBack() {
      this.$emit('close')
    },
    // 获取仓库id
    async getWarehouseListFun() {
      await getWarehouseList({ code: this.warehouseCode }).then(res => {
        this.dataForm.warehouseName = res.data[0].name
        this.dataForm.warehouseId = res.data[0].id
        // 获取仓库详情信息
        getWarehouseInfo(res.data[0].id).then(response => {
          this.dataForm.warehouseType = response.data.type
          this.dataForm.projectId = res.data[0].projectId
          this.allocationFlag = response.data.locationStatus == 'disabled' ? false : true
        })
      })
    },
    init(id, btnType) {
      console.log(777, id, btnType);
      this.formLoading = true
      this.getclassAttributeList()
      this.btnType = btnType
      if (id) {
        this.title = btnType == 'look' ? '查看出入库单' : '编辑出入库单'
        // 获取详情
        detailWarehouseData(id).then(res => {
          this.$set(res.data.stockMove, 'cooperativePartnerIdText', res.data.stockMove.partnerName)
          console.log("直接详情",res);
          this.dataForm = res.data.stockMove
          console.log("this.datafo",this.dataForm);
          this.selectDocutementType(this.dataForm.businessType)
          res.data.spaceLines.forEach(item => {
            this.$set(item, 'productDrawingNo', item.drawingNo)
          });
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push(
                {
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                }
              )
            })
          }
          this.productData = res.data.spaceLines
          this.spaceLines = res.data.spaceLines
          this.formLoading = false
          let arr = [
            { label: "组装入库", value: "inbound_merge", },
            { label: "拆卸入库", value: "inbound_split", },
            { label: "形态转换入库", value: "inbound_shift", },
            { label: "组装出库", value: "outbound_merge", },
            { label: "拆卸出库", value: "outbound_split", },
            { label: "形态转换出库", value: "outbound_shift", },
            { label: "调拨出库", value: "outbound_transfer", },
            { label: "调拨入库", value: "inbound_transfer", },
            { label: "直接领料入库", value: "inbound_receive_material", },
            { label: "直接领料出库", value: "outbound_receive_material", },

          ]
          this.list = [...this.list, ...arr]
        }).catch(() => { this.formLoading = false })
      } else {
        this.title = '新建出入库单'
        this.formLoading = false
        this.datafilelist = []
      }
    },
    // 继续新增
    continueAdd() {
      this.tipsvisible = false
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        this.dataForm.orderNo = data.number
      } catch (error) {
      }
    },
    async handleConfirm(submitModel, type) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let submitFlag = true // 自动聚焦是否可用
          // 判断子表是否有效
          if (!this.productData.length && submitFlag) {
            submitFlag = false
            this.$message.error('请至少选择一个产品')
          }
          if (this.allocationFlag) {
            this.productData.forEach((item, index) => {
              if (!item.shelfSpaceId) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行库位不能为空")
              }
            })
          }
          if (this.productData.length) {
            let totals = {};
            let totalNum = {};
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能为空")
                break
              }
              if (!this.$store.getters.configData.warehouse.unitPriceSetting) break
              if (!item.costPrice) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行单价不能为空或为0")
                break
              }
              // if ((this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'inbound_external') && this.calculateQuantityFlag == 1) {
              //   if (!item.weight) {
              //     submitFlag = false
              //     this.$message.error("产品信息第" + (index + 1) + "行重量不能为空或为0")
              //     break
              //   }
              //   if (!item.proportion) {
              //     submitFlag = false
              //     this.$message.error("产品信息第" + (index + 1) + "行比重不能为空或为0")
              //     break
              //   }
              //   if (!item.discount) {
              //     submitFlag = false
              //     this.$message.error("产品信息第" + (index + 1) + "行折扣不能为空或为0")
              //     break
              //   }
              // }
            }
          }
          // 自动聚焦未使用则提交
          if (submitFlag) {
            this.dataForm.documentStatus = submitModel

            const formMethod = this.dataForm.id ? updateWarehouseData : addWarehouseData
            // spaceLines每一项的产品id如果与linesList项的产品id相同，那么让spaceLines项的批次号也等于linesList项的批次号
            this.copyLinesData = JSON.parse(JSON.stringify(this.productData))
            this.copyLinesData.forEach(element => {
              element.warehouseType = this.dataForm.warehouseType
            });
            if (this.datafilelist.length) {
              this.datafilelist.map((item, index) => {
                item.bimAttachments = {
                  businessType: "system_attachment",
                  categoryId: this.attachmentData.configValue2,
                  configKey: this.attachmentData.configKey,
                  documentId: item.id,
                  fileFlag: '',
                  sort: index
                }
              })
            }
            this.dataForm.classAttributeList = this.classAttributeList
            if (localStorage.getItem('loginTenant')) {
              if (this.dataForm.businessType === 'outbound_sale_send') {
                this.dataForm.tenant = localStorage.getItem('loginTenant')
              } else if (this.dataForm.businessType === 'inbound_sale_return') {
                this.dataForm.tenant = localStorage.getItem('loginTenant')
              }
            }

            let dataObj = {
              attachmentList: this.datafilelist,
              stockMove: this.dataForm,
              lines: this.productData,
              spaceLines: this.copyLinesData,
              flowData: this.flowData
            }
            formMethod(dataObj).then(res => {
              let msg = res.msg
              if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
              this.$message.success(msg)
              if (type) {
                let codes = this.arr
                  .filter(item => item.businessType === this.dataForm.businessType) // 筛选出 businessType 等于 type 的项
                  .map(item => item.code); // 提取满足条件的 code 值
                this.enCode = codes
                this.formId = res.data.id
                this.fullName = this.arr
                  .filter(item => item.businessType === this.dataForm.businessType) // 筛选出 businessType 等于 type 的项
                  .map(item => item.fullName);
                this.printVisible = true
                this.$nextTick(() => {
                  this.$refs.printTemplate.init(this.enCode)
                })
              }
              // 提交之后  保留表单数据 清空产品信息
              this.btnLoading = false
              if (this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_pick_out' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'outbound_other') {
                this.dataForm.documentType = 'outbound'
                this.fetchData("CKDH")
              }
              if (this.dataForm.businessType == 'inbound_sale_return' || this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'inbound_return_materials' || this.dataForm.businessType == 'inbound_external' || this.dataForm.businessType == 'inbound_other') {
                this.dataForm.documentType = 'inbound'
                this.fetchData("RKDH")
              }
              this.dataForm = {  //表单信息
                orderNo: "",
                businessType: this.dataForm.businessType,
                documentType: this.dataForm.documentType,
                warehouseId: this.dataForm.warehouseId,
                warehouseName: this.dataForm.warehouseName,
                sourceType: "direct",
                id: "",
                weightFlag: this.dataForm.weightFlag,
                cooperativePartnerId: this.dataForm.cooperativePartnerId,
                cooperativePartnerIdText: this.dataForm.cooperativePartnerIdText,
                warehouseType: this.dataForm.warehouseType,
                inspectionResults: this.dataForm.inspectionResults,
                approvalFlag: false,
                orderDate: this.dataForm.orderDate
              }
              this.productData = []
              this.$refs.dataForm.resetFields()
            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            this.btnLoading = false
          }
        }
      })
    },

    // 意向客户分类节点点击
    yxPartnerTreeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.id
      return listQuery
    },
    // 客户选框传值
    partnerChange(val, data, paramsObj) {
      console.log(val,data,);
      if (data && data.length) { // 数据有效，进行更新
        const partnerInfo = data[0].all
        this.partnerInfo = data[0].all
        this.dataForm.cooperativePartnerId = partnerInfo.id
        this.dataForm.cooperativePartnerIdText = partnerInfo.name
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.cooperativePartnerId = ""
        this.dataForm.cooperativePartnerIdText = ""
      }
      console.log(this.dataForm);
      this.$refs.dataForm.clearValidate('cooperativePartnerIdText');
      this.$nextTick(() => { this.$refs['dataForm'].validateField('cooperativePartnerIdText') }) // 校验操作的元素(name是组件绑定的value)
    },
    switchStyleheight() {
      const mainRegion1 = this.$refs.main // 表单页面区域
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 520
      console.log(maxHeight, 'maxHeight')
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
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

::v-deep.pintDevLog.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 10px 20px 10px !important;
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

.options {
  display: inline-block;
  float: right;
}

.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}

.productInfo {
  padding: 0;
}

.scand ::v-deep.el-input__inner {
  height: 60px;
  line-height: 60px;
  font-size: 20px !important;
  font-weight: 600;
  border-color: #3fb9f8;
}

.scand .box {
  padding: 40px 20px;
}

.scand .tip {
  margin-top: 10px;
  font-size: 18px;
}

.fixedRight {
  float: right;
}
</style>
