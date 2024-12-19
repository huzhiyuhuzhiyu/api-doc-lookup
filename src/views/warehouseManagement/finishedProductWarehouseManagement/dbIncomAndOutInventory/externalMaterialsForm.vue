<template>
  <!-- 外协发料 订单  outbound_external_send-->
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <!-- <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading"
            @click="handleConfirm('draft')">保存草稿</el-button> -->
          <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
            @click="handleConfirm('submit')">提交</el-button>
          <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
            @click="handleConfirm('submit', 'print')">提交并打印</el-button>
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
                            <el-form-item label="业务类型" prop="businessType">
                              <el-select v-model="dataForm.businessType" placeholder="请选择业务类型" style="width: 100%;"
                                disabled>
                                <el-option v-for="(item, index) in sourceTypeList" :key="index" :label="item.label"
                                  :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>

                          <el-col :sm="6" :xs="24">
                            <el-form-item label="供应商" prop="cooperativePartnerId">
                              <el-input v-model="dataForm.partnerName" placeholder="请选择供应商" readonly disabled>
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="仓库" prop="warehouseName">
                              <ComSelect-list
                                :requestObj="{ type: 'normal', state: 'enable', projectId: isProjectSwitch === '1' ? dataForm.projectId || '' : '' }"
                                :dialogTitle="'选择仓库'" :isdisabled="true" v-model="dataForm.warehouseName"
                                :method="getWarehouseList" placeholder="请选择仓库"
                                @change="changeWarehousex"></ComSelect-list>





                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">

                            <el-form-item label="是否显示比重折扣" prop="weightFlag">
                              <el-select v-model="dataForm.weightFlag" placeholder="是否显示比重折扣" style="width: 100%;"
                                :disabled="btnType == 'look' ? true : false">
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
                              <el-input v-model="dataForm.remark" placeholder="请输入备注"
                                :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2"
                                maxlength="200" />
                            </el-form-item>
                          </el-col>
                        </el-row>


                      </el-form>
                    </el-collapse-item>



                    <el-collapse-item title="产品信息" name="productInfo">
                      <div v-if="btnType !== 'look'">
                        <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                          :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>

                      </div>


                      <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="btnType != 'look'"
                        class="productInfo" @selection-change="handeleProductInfoData" border :key="165"
                        style="width: 100%;">


                        <el-table-column prop="productCode" label="产品编码" width="120" :key="4" show-overflow-tooltip />
                        <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'"
                        min-width="160" />
                        <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="projectName" label="所属项目" v-if="isProjectSwitch == '1'"
                          min-width="160" />
                        <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111">
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
                        <el-table-column prop="shelfSpaceName" label="库位" width="120" :key="10112">

                          <template slot-scope="scope">

                            <div> {{ scope.row.shelfSpaceName }}</div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="availableBatchNumber" label="批次库存数量" width="160" v-if="btnType != 'look'"
                          :key="7"></el-table-column>
                        <el-table-column prop="waitDeliverNum" label="待发料数量" width="140" :key="777"
                          v-if="btnType != 'look'">

                        </el-table-column>

                        <el-table-column prop="weight" label="重量(kg)" width="140" :key="737"
                          v-if="dataForm.weightFlag == true">
                          <!-- <template slot="header">
                            <span class="required">*</span>重量(kg)
                          </template> -->
                          <template slot-scope="scope">
                            <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                              v-model="scope.row.weight" placeholder="重量"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="proportion" label="比重" width="140" :key="727"
                          v-if="dataForm.weightFlag == true">
                          <!-- <template slot="header">
                            <span class="required">*</span>比重
                          </template>
                          <template slot-scope="scope">
                            <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                              v-model="scope.row.proportion" placeholder="比重"></el-input>
                          </template> -->
                        </el-table-column>
                        <!-- <el-table-column prop="discount" label="折扣(0~1)" width="140" :key="717"
                          v-if="dataForm.weightFlag == true">
                          <template slot="header">
                            <span class="required">*</span>折扣(0~1)
                          </template>
                          <template slot-scope="scope">
                            <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                              v-model="scope.row.discount" placeholder="折扣(0~1)"></el-input>
                          </template>
                        </el-table-column> -->

                        <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
                        <el-table-column prop="num" :label="mainUnitFlag == 1 ? '发料数量(主)' : '发料数量'" min-width="160">
                          <template slot="header">
                            <span class="required">*</span>{{ mainUnitFlag == 1 ? '发料数量(主)' : '发料数量' }}
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.num" placeholder="发料数量(主)" :disabled="btnType == 'look'"
                              @input="watchNum(scope.row, scope.$index)">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="deputyNum" label="发料数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="remark" label="备注" width="200" :key="128">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="btnType != 'look'"
                              placeholder="备注"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'"
                          fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                          </template>
                        </el-table-column>
                      </JNPF-table>



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
                <el-tab-pane v-if="btnType == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
                  <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                </el-tab-pane>
              </el-tabs>
              <el-tabs v-model="activeName" v-else>
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
                            <el-form-item label="业务类型" prop="businessType">
                              <el-select v-model="dataForm.businessType" placeholder="请选择业务类型" style="width: 100%;"
                                disabled>
                                <el-option v-for="(item, index) in sourceTypeList" :key="index" :label="item.label"
                                  :value="item.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>

                          <el-col :sm="6" :xs="24">
                            <el-form-item label="供应商" prop="cooperativePartnerId">
                              <el-input v-model="dataForm.partnerName" placeholder="请选择供应商" readonly disabled>
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="仓库" prop="warehouseName">
                              <ComSelect-list
                                :requestObj="{ type: 'normal', state: 'enable', projectId: isProjectSwitch === '1' ? dataForm.projectId || '' : '' }"
                                :dialogTitle="'选择仓库'" :isdisabled="true" v-model="dataForm.warehouseName"
                                :method="getWarehouseList" placeholder="请选择仓库"
                                @change="changeWarehousex"></ComSelect-list>





                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">

                            <el-form-item label="是否显示比重折扣" prop="weightFlag">
                              <el-select v-model="dataForm.weightFlag" placeholder="是否显示比重折扣" style="width: 100%;"
                                :disabled="btnType == 'look' ? true : false">
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
                              <el-input v-model="dataForm.remark" placeholder="请输入备注"
                                :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2"
                                maxlength="200" />
                            </el-form-item>
                          </el-col>
                        </el-row>


                      </el-form>
                    </el-collapse-item>



                    <el-collapse-item title="产品信息" name="productInfo">
                      <div v-if="btnType !== 'look'">
                        <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                          :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>

                      </div>


                      <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="btnType != 'look'"
                        class="productInfo" @selection-change="handeleProductInfoData" border :key="165"
                        style="width: 100%;">


                        <el-table-column prop="productCode" label="产品编码" width="120" :key="4" show-overflow-tooltip />
                        <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'"
                        min-width="160" />
                        <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="projectName" label="所属项目" v-if="isProjectSwitch == '1'"
                          min-width="160" />
                        <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111">
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
                        <el-table-column prop="shelfSpaceName" label="库位" width="120" :key="10112">

                          <template slot-scope="scope">

                            <div> {{ scope.row.shelfSpaceName }}</div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="availableBatchNumber" label="批次库存数量" width="160" v-if="btnType != 'look'"
                          :key="7"></el-table-column>
                        <el-table-column prop="waitDeliverNum" label="待发料数量" width="140" :key="777"
                          v-if="btnType != 'look'">

                        </el-table-column>

                        <el-table-column prop="weight" label="重量(kg)" width="140" :key="737"
                          v-if="dataForm.weightFlag == true">
                          <!-- <template slot="header">
                            <span class="required">*</span>重量(kg)
                          </template> -->
                          <template slot-scope="scope">
                            <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                              v-model="scope.row.weight" placeholder="重量"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="proportion" label="比重" width="140" :key="727"
                          v-if="dataForm.weightFlag == true">
                          <!-- <template slot="header">
                            <span class="required">*</span>比重
                          </template>
                          <template slot-scope="scope">
                            <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                              v-model="scope.row.proportion" placeholder="比重"></el-input>
                          </template> -->
                        </el-table-column>
                        <!-- <el-table-column prop="discount" label="折扣(0~1)" width="140" :key="717"
                          v-if="dataForm.weightFlag == true">
                          <template slot="header">
                            <span class="required">*</span>折扣(0~1)
                          </template>
                          <template slot-scope="scope">
                            <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                              v-model="scope.row.discount" placeholder="折扣(0~1)"></el-input>
                          </template>
                        </el-table-column> -->

                        <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
                        <el-table-column prop="num" :label="mainUnitFlag == 1 ? '发料数量(主)' : '发料数量'" min-width="160">
                          <template slot="header">
                            <span class="required">*</span>{{ mainUnitFlag == 1 ? '发料数量(主)' : '发料数量' }}
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.num" placeholder="发料数量(主)" :disabled="btnType == 'look'"
                              @input="watchNum(scope.row, scope.$index)">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="deputyNum" label="发料数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="remark" label="备注" width="200" :key="128">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="btnType != 'look'"
                              placeholder="备注"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'"
                          fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                          </template>
                        </el-table-column>
                      </JNPF-table>



                    </el-collapse-item>

                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'">
                </UploadWj>
              </el-tab-pane>
                
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <!-- 选择产品信息 -->
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
        @close="productVisible = false" :visible.sync="productVisible" lock-scroll
        class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">

              <!-- 外协发料 -->
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.partnerName" placeholder="供应商名称" clearable
                      @keyup.enter.native="getTabdataList()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.productDrawingNo" placeholder="品名规格" clearable
                      @keyup.enter.native="getTabdataList()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="交货日期开始" end-placeholder="交货日期结束" clearable>
                    </el-date-picker>
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
              <JNPF-table v-loading="listLoading" :data="productList" hasC :fixedNO="true"
                @selection-change="handleSelectionChangeAllPruduct" ref="form">
                <el-table-column prop="orderNo" label="订单号" min-width="200" sortable="custom"></el-table-column>
                <el-table-column prop="cooperativePartnerName" label="供应商名称" width="140" sortable="custom" />
                <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" v-if="productNameFlag === '1'" min-width="160"
                  sortable="custom" />
                <el-table-column prop="drawingNo" label="品名规格" width="300" sortable="custom" />
                <el-table-column prop="projectName" label="所属项目" v-if="isProjectSwitch == '1'" min-width="160" />
                <el-table-column prop="processName" label="工序名称" width="120" sortable="custom" />
                <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
                <el-table-column prop="waitDeliverNum" :label="mainUnitFlag == 1 ? '待发料数量(主)' : '待发料数量'"
                  min-width="160">
                </el-table-column>
                <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
                <el-table-column prop="deputyNum" label="待发料数量(副)" min-width="170" v-if="mainUnitFlag == 1" />
                <el-table-column prop="demandQuantity" label="订单数量" min-width="120" sortable="custom" />



                <!-- { label: "销售发货", value: "outbound_sale_send" },
        { label: "销售退货", value: "inbound_sale_return" },
        { label: "采购收货", value: "inbound_purchase" },
        { label: "采购退货", value: "outbound_purchase" },
        { label: "生产领料", value: "outbound_pick_out" },
        { label: "生产退料", value: "inbound_return_materials" },
        { label: "外协发料", value: "outbound_external_send" },
        { label: "外协退料", value: "inbound_external_return" },
        { label: "外协收货", value: "inbound_external" },
        { label: "外协退货", value: "outbound_external" }, -->


              </JNPF-table>
              <pagination :total="productTotal" :page.sync="materialsForm.pageNum" :limit.sync="materialsForm.pageSize"
                @pagination="searchProductFun" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click=" productVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
            确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
        width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>


        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>
        </span>
      </el-dialog>
      <!-- 选客户 -->
      <CustomerForm v-if="CustomerForm" ref="CustomerForms" @selectCustomer="handleSelectCustomer"></CustomerForm>

      <!-- 选批次号 -->
      <BatchNumberForm v-if="batchNumVisible" ref="BatchNumberForms" @selectBatchNumberFun="selectBatchNumberFun">
      </BatchNumberForm>
      <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
        :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
      <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm"
        @closePrintPage="closePrintPage" />
    </div>
  </transition>
</template>

<script>
import { getQuotationdatasenddatalist } from '@/api/salesManagement'
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getWarehouseInfo, getStockGoodsShelvesList, getProductionLotList, getBimBusinessSwitchConfigList, getBatchNumber, getStockGoodsShelves,getBimBusinessDetail } from '@/api/basicData/index'
import { getQuotationsendlist } from "@/api/salesManagement/index";

import CustomerForm from './customerForm.vue'
import { purPurchaseReceiptReturnGoodsList, detailpurchaseOrderList, shipmentList } from "@/api/purchasingAndOutsourcingOrders/index"
import WareHouseForm from './wareHouseForm.vue'
import { getpurPurchaseReceiptReturnGoodsdetail, addpurPurchaseReceiptReturnGoods, editpurPurchaseReceiptReturnGoods, detailpurPurchaseReceiptReturnGoods } from '@/api/purchasingManagement/purchaseInquirySheet'  // 询价单
import { purPurchaseReceiptReturnGoodsDetailList } from '@/api/purchasingManagement/purchaseInquirySheet'
import { detailordershengchan, detailWithdrawal, addWithdrawal, updateWithdrawal, getWorkList, WithdrawalmxList } from '@/api/productOrdes/index.js'
import BatchNumberForm from './batchNumberForm.vue'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import flowMixin from '@/mixins/generator/flowMixin'
import recordList from '@/views/workFlow/components/RecordList.vue'
import busFlow from '@/mixins/generator/busFlow';
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo } from '@/api/system/printDev'
export default {
  components: { CustomerForm, BatchNumberForm, Process, recordList, PrintBrowse, PrintDialog },
  mixins: [flowMixin, busFlow, getProjectList],
  data() {
    return {
      datafilelist: [],
      isattachmentswitch: '',
      attachmentData: {},
      prindId: '',
      formId: '',
      enCode: "",
      printBrowseVisible: false,
      printVisible: false,
      isProjectSwitch: '',

      weightFlagList: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      warehouseRequestObj: {
        type: 'normal', state: 'enable'
      },
      inOroundTitle: "",
      numTitle: "",
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
        sourceNo: "",
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
        businessType: "",
        warehouseName: "",
        warehouseId: "",
        cooperativePartnerId: "",
        partnerName: "",
        documentType: "",
        id: "",
        warehouseType: "",
        approvalFlag: false,
        weightFlag: false,
        orderDate: this.jnpf.getToday(),
        projectId: "",
      },
      customerInfo: {},//所选客户信息
      getWarehouseList,
      sourceTypeList: [ //业务类型
        { label: "销售发货", value: "outbound_sale_send" },
        { label: "销售退货", value: "inbound_sale_return" },
        { label: "采购收货", value: "inbound_purchase" },
        { label: "采购退货", value: "outbound_purchase" },
        { label: "生产领料", value: "outbound_pick_out" },
        { label: "生产退料", value: "inbound_return_materials" },
        { label: "外协发料", value: "outbound_external_send" },
        { label: "外协退料", value: "inbound_external_return" },
        { label: "外协收货", value: "inbound_external" },
        { label: "外协退货", value: "outbound_external" },
        { label: "生产入库", value: "inbound_mock_production" },

      ],

      dataRule: {
        cooperativePartnerId: [
          { required: true, message: '客户不能为空', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '业务类型不能为空', trigger: 'change' }
        ],
        inspectionResults: [{ required: true, message: "检验标志不能为空", trigger: 'change' }],
        orderDate: [
          { required: true, message: '单据日期不能为空', trigger: 'change' }
        ],
        orderNo: [{ required: true, message: "请输入单号", trigger: 'blur' }],
        warehouseName: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
        weightFlag: [
          { required: true, message: '是否显示比重折扣不能为空', trigger: 'change' }
        ],
      },

      productList: [],
      productTotal: 0,
      deliveryDateArr: [],
      productVisible: false,
      selectSaleProductArr: [],
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
      allocationFlag: false,

      dataFormItems: [/* 通过 this.refeshDataFormItems() 动态更改 */],
      selectcustomerObj: {
        type: ""
      },
      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      spaceLines: [],
      productionLotList: [],
      loadingText: '',
      copyLinesData: [],
      previousValue: "",
      orderForm: {},
      classAttribute: "",
      activeName: "orderInfo",
      flowTemplateJson: {},
      flowData: {},
      classAttributeList: [],
      warehouseCode: "",
      ordersLineIdList: [],
      materialsForm: {
        ordersLineIdList: [],
        shipmentStatus: "not_finish",
        pageNum: 1,
        pageSize: 20,
        cooperativePartnerName: "",
        productDrawingNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
      },
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      productNameFlag: null,
      mainUnitFlag: null,
      calculateQuantityFlag: "",

    }
  },

  async created() {
    await this.getProjectSwitch('system', 'project')
    let objs = { "pageSize": -1, "businessCode": "product" }
    getBimBusinessSwitchConfigList(objs).then(res => {
      this.productNameFlag = res.data.product[1].configValue1
    })
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },
  mounted() {
    this.getBimBusinessDetail()

    this.getMainUnitFun('deputyUnit', 'warehouseDeputyUnit', 'unitFlag')
    this.getMainUnitFun('warehouse', 'proportion', 'proportionFlag')

  },
  methods: {
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
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          // this.printVisible = false
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
      this.$emit('close', true)
    },
    closePrintPage() {
      this.$emit('close', true)
    },
    computedNumFun(data, index) {
      if (data.proportion && data.weight) {
        this.productData[index].num = Math.floor(this.jnpf.numberFormat(this.jnpf.math('multiply', [data.proportion, data.weight]), 2))
        this.watchNum(data, index)
      }
    },
    async getMainUnitFun(code, type, flag) {
      this.listLoading = true
      try {
        if (flag == 'unitFlag') this.mainUnitFlag = await this.jnpf.getMainUnitFun(code, type);
        if (flag == 'proportionFlag') this.calculateQuantityFlag = await this.jnpf.getMainUnitFun(code, type)
        this.dataForm.weightFlag = this.calculateQuantityFlag == 1 ? true : false

        this.tableDataFlag = true
        this.listLoading = false


      } catch (error) {
      }
    },
    // 打开选择批次号弹框
    openSeleceBatchNumberDialog(data, index) {
      console.log("data", data);
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库")
      this.batchNumVisible = true
      data.warehouseId = this.dataForm.warehouseId
      this.$nextTick(() => {
        this.$refs.BatchNumberForms.init(data, index, 'wxfl')
      })
    },
    // 选择批次
    selectBatchNumberFun(data, index) {
      console.log("批次号数据", data, index);

      this.$set(this.productData[index], 'warehouseId', data.warehouseId)
      this.$set(this.productData[index], 'shelfSpaceId', data.shelfSpaceId)
      this.$set(this.productData[index], 'shelfSpaceName', data.shelfSpaceName)
      this.$set(this.productData[index], 'availableBatchNumber', data.inventoryQuantity)
      this.$set(this.productData[index], 'batchNumber', data.batchNumber)
      // this.$set(this.productData[index], 'discount', data.discount)
      this.$set(this.productData[index], 'proportion', data.proportion)
      this.$set(this.productData[index], 'weight', data.weight)

      // this.$set(this.productData[index], 'weight', this.jnpf.numberFormat(this.jnpf.math('divide', [ this.productData[index].num, data.proportion]), 2))

    },



    // 产品信息列表复制功能
    copyFun(row, index) {
      let data = JSON.parse(JSON.stringify(row))
      this.productData.splice(index + 1, 0, data);

    },

    // 点击选择产品 销售发货 
    openSeleceProductDialog() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error("请先选择客户")
      this.productVisible = true
      this.searchProductFun()
    },
    // 销售发货选择产品——搜索 如果是销售订单  需要计算待出库数量=订单数量-已出库数量  如果是通知单 则直接取接口返回的待出库数量
    searchProductFun() {

      this.materialsForm.cooperativePartnerId = this.dataForm.cooperativePartnerId
      this.materialsForm.ordersLineIdList = this.ordersLineIdList
      if (this.deliveryDateArr.length) {
        this.materialsForm.deliveryStartDate = this.deliveryDateArr[0]
        this.materialsForm.deliveryEndDate = this.deliveryDateArr[1]
      } else {
        this.materialsForm.deliveryStartDate = ""
        this.materialsForm.deliveryEndDate = ""
      }
      this.getMaterialsFun()



    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      this.selectSaleProductArr = val
    },
    // 销售发货选择产品——重置
    resetProductFun() {
      this.deliveryDateArr = []
      this.searchProductFun()

    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      let arr = JSON.parse(JSON.stringify(this.selectSaleProductArr))

      arr.forEach(item => {
        // this.$set(item, 'discount', '')
        // this.$set(item, 'proportion', '')
        // this.$set(item, 'weight', '')
        // item.num = item.waitDeliverNum
        this.$set(item, 'num', item.waitDeliverNum)
        this.$set(item, 'warehouseId', this.dataForm.warehouseId)

        if (this.mainUnitFlag == 1) {
          if (item.calculationDirection == 'multiplication') {
            this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
          } else {
            this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
          }
          this.$set(item, 'deputyUnit', item.deputyUnit)
        }
        this.productData.push(item)
      });
      console.log("this.dataFormTwo", this.productData);
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

    // 主数量输入失去焦点 检验不能为  0
    checkNum(row, index) {
      if (!row.num) {
        this.$message({
          message: "请填写第" + (index + 1) + "行产品的发料数量",
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
          this.$set(row, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.ratio]), 6))
        } else {
          this.$set(row, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [row.num, row.ratio]), 6))
        }
        this.$set(row, 'deputyUnit', row.deputyUnit)
      }
      this.productData = productArr
    },
















    goBack() {
      this.$emit('close', true)
    },

    // 获取仓库id
    getWarehouseListFun() {
      getWarehouseList({ code: this.warehouseCode }).then(res => {
        this.dataForm.warehouseName = res.data[0].name
        this.dataForm.warehouseId = res.data[0].id
        this.dataForm.warehouseType = res.data[0].type
          this.dataForm.projectId = res.data[0].projectId
          this.allocationFlag = res.data[0].locationStatus == 'disabled' ? false : true
      })
    },

    // 获取发料清单数据
    getMaterialsFun(flag) {
      this.materialsForm.ordersLineIdList = this.ordersLineIdList
      this.materialsForm.projectId = this.isProjectSwitch === '1' ? this.dataForm.projectId || '' : ''

      shipmentList(this.materialsForm).then(res => {
        console.log("发料清单数据", res, this.dataForm.warehouseId);
        res.data.records.forEach(item => {
          this.$set(item, 'num', item.waitDeliverNum)
          this.$set(item, 'availableBatchNumber', item.availableBatchQuantity)
          this.$set(item, 'warehouseId', this.dataForm.warehouseId)
          this.$set(item, 'warehouseType', this.dataForm.warehouseType)
          // this.$set(item, 'discount', '')
          // this.$set(item, 'proportion', '')
          // this.$set(item, 'weight', '')
          item.ordersId = item.ordersLineId
          item.ordersLineId = item.id
          if (this.mainUnitFlag == 1) {
            if (item.calculationDirection == 'multiplication') {
              this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
            } else {
              this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
            }
          }
        });
        if (flag) {
          this.productData = res.data.records
         
        }

        this.productList = res.data.records
        this.productTotal = res.data.total
        console.log("发料清单数据", res);
      })
    },
    //   { label: "销售发货", value: "outbound_sale_send" },
    // { label: "销售退货", value: "inbound_sale_return" },
    // { label: "采购收货", value: "inbound_purchase" },
    // { label: "采购退货", value: "outbound_purchase" },
    // { label: "生产领料", value: "outbound_pick_out" },
    // { label: "生产退料", value: "inbound_return_materials" },
    // { label: "外协发料", value: "outbound_external_send" },
    // { label: "外协退料", value: "inbound_external_return" },
    // { label: "外协收货", value: "inbound_external" },
    // { label: "外协退货", value: "outbound_external" },
    init(data, btnType, businessType, classAttributeList, warehouseCode) {
      console.log("11", data, btnType, businessType);

      // this.visible = true
      this.warehouseCode = warehouseCode
      this.dataForm.businessType = businessType
      this.classAttributeList = classAttributeList
      this.btnType = btnType
      this.getWarehouseListFun()
      this.selectcustomerObj.type = 'supplier'


      if (btnType == 'look') {
        this.title = '查看出库单'
        detailWarehouseData(data).then(res => {
          if (res.data.attachmentList.length) {
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
          console.log("发料详情");
          res.data.spaceLines.forEach(item => {
            this.$set(item, 'productDrawingNo', item.drawingNo)
            this.$set(item, 'price', item.costPrice)
          });
          this.dataForm = res.data.stockMove
          this.productData = res.data.spaceLines
          // 流程信息和流转记录
          if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
        })
      } else {
        this.datafilelist = []

        this.dataForm.cooperativePartnerId = data[0].cooperativePartnerId
        this.dataForm.partnerName = data[0].cooperativePartnerName
        this.title = '新建出库单'
        this.fetchData("CKDH", true)
        data.forEach(item => {
          this.ordersLineIdList.push(item.id)
        });
          this.getMaterialsFun('init')
        this.getBusInfo('b045')

        console.log(66666);
        // this.refeshDataFormItems()
        // data.forEach((item, index) => {
        //   item.productDrawingNo = item.drawingNo
        //   this.$set(item, 'num', item.waitReceiptNum)
        //   item.totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.price]), 6)
        //   item.costPrice = item.price
        //   item.classAttribute = item.classAttribute
        //   item.ordersId = item.purchaseOrderId
        //   item.ordersLineId = item.id
        //   item.taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [item.price, item.excludingTaxPrice]), 6)]), 6)
        //   let taxrate = 1 * 1 + (item.taxRate) / 100 * 1
        //   item.excludingTaxCostPrice = this.jnpf.numberFormat(this.jnpf.math('divide', [item.price, taxrate]), 6)
        //   item.totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.price]), 6)
        //   item.taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [item.price, item.excludingTaxCostPrice]), 6)]), 6)
        //   item.excludingTaxTotalAmount = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.totalAmount, item.taxAmount]), 6)
        // });
        // this.productData = data

      }





    },


    // 继续新增
    continueAdd() {
      this.init('', 'add')
      this.tipsvisible = false
      this.btnLoading = false
      this.dataForm = {  //表单信息
        orderNo: "",
        businessType: "",
        warehouseName: "",
        warehouseId: "",
        cooperativePartnerId: "",
        partnerName: "",
        documentType: "",
        id: "",
        warehouseType: "",
        approvalFlag: false,
        orderDate: this.jnpf.getToday(),
        projectId: "",
      }
      this.productData = []
      this.$refs.dataForm.resetFields()
      this.init('', 'add')
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
    async handleConfirm(submitModel, type) {
      console.log(this.productData);
      let submitFlag = true // 自动聚焦是否可用
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          // 判断子表是否有效
          if (!this.productData.length && submitFlag) {
            submitFlag = false
            this.$message.error('请至少选择一个产品')
          }
          this.productData.forEach((item, index) => {
            if (!item.batchNumber) {
              submitFlag = false
              this.$message.error("产品信息第" + (index + 1) + "行批次号不能为空")
            }
          })

          if (this.productData.length) {
            console.log(this.productData);
            let totals = {};
            let totalNum = {};
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能为空或为0")
                break
              }
              if (Number(item.num) > Number(item.availableBatchNumber)) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能超过批次库存数量")
                break
              }


              if (Number(item.num) > Number(item.ordersNum)) {
                console.log(item.num);
                console.log(item.ordersNum);
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能超过待发料数量")
                break
              }


            }


          }




          // 自动聚焦未使用则提交
          if (submitFlag) {

            this.dataForm.documentType = "outbound"
            this.dataForm.documentStatus = submitModel
            // const formMethod = this.dataForm.id ? updateInboundOutbound : addInboundOutbound
            const formMethod = addWarehouseData
            // spaceLines每一项的产品id如果与linesList项的产品id相同，那么让spaceLines项的批次号也等于linesList项的批次号

            this.copyLinesData = JSON.parse(JSON.stringify(this.productData))
            this.copyLinesData.forEach(element => {
              element.warehouseType = this.dataForm.warehouseType
              element.warehouseId = this.dataForm.warehouseId
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
            this.dataForm.sourceType = 'order'
            let dataObj = {
              attachmentList: this.datafilelist,

              stockMove: this.dataForm,
              lines: this.productData,
              spaceLines: this.copyLinesData,
              flowData: this.flowData
            }
            console.log("this.dataForm", this.dataForm);
            // // 提交确认
            // if (submitModel === 'submit') {
            //   let flag = await this.$confirm('请确认信息是否正确，提交后不允许修改，是否提交！', '提交确认', { type: 'warning' }).catch(err => false)
            //   if (!flag) {
            //     console.log(dataObj)
            //     return this.btnLoading = false
            //   }
            // }
            console.log("this.productData", this.productData);
            this.btnLoading = true
            formMethod(dataObj).then(res => {
              let msg = res.msg
              if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
              if (submitModel == "draft") {
                this.submitmethodsTitle = "保存成功"
              } else {
                this.submitmethodsTitle = "提交成功"

              }
              if (type) {
                this.enCode = 'p013'
                this.formId = res.data.id
                this.fullName = '外协发料单'
                this.printVisible = true
                this.$nextTick(() => {
                  this.$refs.printTemplate.init(this.enCode)
                })
              }else{
                // this.goBack()
                this.tipsvisible = true
              }

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

// ::v-deep.JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body {
//   padding: 0 !important;
// }

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

.productInfo ::v-deep.el-table__body-wrapper {
  height: auto !important
}
</style>