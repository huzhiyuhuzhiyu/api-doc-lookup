<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add'
          ? '新建采购退货通知单'
          : btnType == 'edit'
            ? '编辑采购退货通知单'
            : btnType == 'copy'
              ? '新建采购退货通知单'
              : '查看采购退货通知单'
          " />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿
          </el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" v-if="!approvalFlag" @tab-click="handleClick">
          <el-tab-pane label="订单信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="btnType == 'look'
                          ? true
                          : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                            ? false
                            : true
                          "></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="是否出库" prop="stockFlag">
                        <el-select v-model="dataForm.stockFlag" placeholder="请选择是否出库" style="width: 100%;"
                          :disabled="btnType == 'look' ? true : false">
                          <el-option v-for="(item, index) in stockFlagList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :sm="6" :xs="24">
                      <el-form-item label="退货标识" prop="exchangeGoodsFlag">
                        <el-select v-model="dataForm.exchangeGoodsFlag" placeholder="请选择状态" style="width: 100%;"
                          :disabled="btnType == 'look' ? true : false">
                          <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col> -->
                    <!-- <el-col :sm="6" :xs="24">
                      <el-form-item label="仓库" prop="warehouseId">
                        <el-select v-model="dataForm.warehouseId" placeholder="请选择仓库" style="width: 100%;"
                          :disabled="btnType == 'look' ? true : false" clearable>
                          <el-option v-for="(item, index) in warehouseIdList" :key="index" :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col> -->
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="供应商名称" prop="partnerName">
                        <ComSelect-page :clearable="btnType !== 'look'" :isdisabled="btnType === 'look'" :treeNodeClick="treeNodeClick"
                         v-model="dataForm.partnerName" :beforeSubmit="beforeSubmit"
                         ref="ComSelect-page" @change="supplierdata" :tableItems="PartnerTableItems"
                         :placeholder="'请选择供应商名称'" title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                         :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                         :paramsObj="{ oldData }" :searchList="PartnerTableSearchList" :rowDblclick="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="操作人" prop="salesman">
                        <el-input v-model="dataForm.salesman" placeholder="请选择操作人"
                          :disabled="btnType == 'look'"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="退货日期" prop="deliverDate">
                        <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择退货日期" type="date"
                          :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="创建时间" prop="createTime">
                        <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="请选择创建时间"
                          :disabled="btnType == 'look'" style="width: 100%;" clearable></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="创建人" prop="createByName">
                        <el-input v-model="dataForm.createByName" placeholder="请输入创建人" :disabled="btnType == 'look'"
                          maxlength="20" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'"
                          type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="productInfo">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    icon="el-icon-plus" @click="openSeleceProductDialog()">
                    选择产品
                  </el-button>
                  |
                  <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                  :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择订单</el-button>| -->
                  <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                    批量删除
                  </el-button>
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO
                    @selection-change="handeleProductInfoData">
                    <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType !== 'look'"
                      key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                    <!-- <el-table-column prop="customerProductNo" label="客户产品编码" width="200" show-overflow-tooltip> -->
                    <!-- </el-table-column> -->
                    <el-table-column prop="projectName" label="所属项目" width="120"
                      v-if="isProjectSwitch === '1'"></el-table-column>
                    <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                      show-overflow-tooltip></el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom"
                      show-overflow-tooltip />
                    <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch ? '单位(主)' : '单位'"
                      :width="isDeputyUnitSwitch ? 85 : 60" />
                    <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch" />
                    <el-table-column prop="purchaseQuantity" :label="isDeputyUnitSwitch ? '数量(主)' : '数量'"
                      width="160" sortable="custom" v-if="isReturnSwitch" />
                    <el-table-column prop="purchaseQuantity2" label="数量(副)" width="160" sortable="custom"
                      v-if="isDeputyUnitSwitch && isReturnSwitch" />
                    <el-table-column prop="receiptQuantity" label="入库数量" width="160" sortable="custom"/>
                    <el-table-column prop="receivedQuantity" label="退货数量" width="170" v-if="!dataForm.exchangeGoodsFlag"
                      key="789">
                      <template slot="header">
                        <span class="required">*</span>
                        退货数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'receivedQuantity'"
                          :rules="productRules.receivedQuantity">
                          <el-input v-model="scope.row.receivedQuantity" placeholder="请输入退货数量"
                            :disabled="btnType == 'look'" maxlength="11" @input="watchnums(scope.row, scope.$index)"
                            style="width: 145px;">
                            {{ scope.row.receivedQuantity }}
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="含税单价" width="130">
                      <template slot="header">
                        <span class="required">*</span>
                        单价(含税)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                          <el-input v-model="scope.row.price" placeholder="单价(含税)"
                            :disabled="isReturnSwitch || btnType == 'look'" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="金额" width="140">
                      <template slot="header">
                        <span class="required">*</span>
                        金额(含税)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'totalAmount'">
                          <div class="viewData">
                            <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="taxRate" label="税率" width="140">
                      <template slot="header">
                        <span class="required">*</span>
                        税率
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :rules="productRules.taxRate">
                          <el-select v-model="scope.row.taxRate" :disabled="isReturnSwitch || btnType == 'look'"
                            placeholder="请选择" style="width: 100%;">
                            <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                              :value="item.enCode"></el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="150">
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'excludingTaxPrice'">
                          <div class="viewData">
                            <span>{{ scope.row.excludingTaxPrice }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column prop="taxAmount" label="税额" min-width="100">
                      <template slot="header">
                        <span class="required">*</span>
                        税额
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'taxAmount'">
                          <div class="viewData">
                            <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="180">
                      <template slot="header">
                        <span class="required">*</span>
                        金额(不含税)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'excludingTaxAmount'">
                          <div class="viewData">
                            <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注"
                          :disabled="btnType == 'look' ? true : false" maxlength="200" show-overflow-tooltip />
                      </template>
                    </el-table-column>

                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />

                    <el-table-column prop="remark" label="备注" min-width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注"
                          :disabled="btnType == 'look' ? true : false" maxlength="200" show-overflow-tooltip />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin:0 10px">总退货数量：{{ totalDeliveryQuantity }}</span>
                  </div>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
            <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
            <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
          </el-tab-pane>
          <el-tab-pane v-if="btnType == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
            <recordList :list="flowTaskOperatorRecordList" :endTime="endTime" />
          </el-tab-pane>
        </el-tabs>
        <el-collapse v-model="activeNames" v-else>
          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="单号" prop="orderNo">
                    <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="btnType == 'look'
                      ? true
                      : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                        ? false
                        : true
                      "></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="是否出库" prop="stockFlag">
                    <el-select v-model="dataForm.stockFlag" placeholder="请选择是否出库" style="width: 100%;"
                      :disabled="btnType == 'look' ? true : false">
                      <el-option v-for="(item, index) in stockFlagList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="6" :xs="24">
                      <el-form-item label="退货标识" prop="exchangeGoodsFlag">
                        <el-select v-model="dataForm.exchangeGoodsFlag" placeholder="请选择状态" style="width: 100%;"
                          :disabled="btnType == 'look' ? true : false">
                          <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col> -->
                <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="仓库" prop="warehouseId">
                    <el-select v-model="dataForm.warehouseId" placeholder="请选择仓库" style="width: 100%;"
                      :disabled="btnType == 'look' ? true : false" clearable>
                      <el-option v-for="(item, index) in warehouseIdList" :key="index" :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="6" :xs="24">
                  <el-form-item label="供应商名称" prop="partnerName">
                    <el-input v-model="dataForm.partnerName" placeholder="请选择供应商" readonly @focus="openDialog"
                      :disabled="btnType == 'look'"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="操作人" prop="salesman">
                    <el-input v-model="dataForm.salesman" placeholder="请选择操作人" :disabled="btnType == 'look'"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="退货日期" prop="deliverDate">
                    <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择退货日期" type="date"
                      :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="请选择创建时间"
                      :disabled="btnType == 'look'" style="width: 100%;" clearable></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="创建人" prop="createByName">
                    <el-input v-model="dataForm.createByName" placeholder="请输入创建人" :disabled="btnType == 'look'"
                      maxlength="20" />
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'"
                      type="textarea" maxlength="200" :rows="2" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="产品信息" name="productInfo">
            <div v-if="btnType !== 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                icon="el-icon-plus" @click="openSeleceProductDialog()">
                选择产品
              </el-button>
              |
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                  :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择订单</el-button>| -->
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                批量删除
              </el-button>
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO
                @selection-change="handeleProductInfoData">
                <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType !== 'look'"
                  key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                <!-- <el-table-column prop="customerProductNo" label="客户产品编码" width="200" show-overflow-tooltip> -->
                <!-- </el-table-column> -->
                <el-table-column prop="projectName" label="所属项目" width="120"
                  v-if="isProjectSwitch === '1'"></el-table-column>
                <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom" show-overflow-tooltip />
                <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch ? '单位(主)' : '单位'"
                  :width="isDeputyUnitSwitch ? 85 : 60" />
                <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch" />
                <el-table-column prop="purchaseQuantity" label="订单数量" width="160" sortable="custom"
                  v-if="isReturnSwitch" />
                <el-table-column prop="purchaseQuantity2" label="数量(副)" width="160" sortable="custom"
                  v-if="isDeputyUnitSwitch && isReturnSwitch" />
                <el-table-column prop="receiptQuantity" label="入库数量" width="160" sortable="custom" />
                <el-table-column prop="receivedQuantity" label="退货数量" width="170" v-if="!dataForm.exchangeGoodsFlag"
                  key="789">
                  <template slot="header">
                    <span class="required">*</span>
                    退货数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'receivedQuantity'"
                      :rules="productRules.receivedQuantity">
                      <el-input v-model="scope.row.receivedQuantity" placeholder="请输入退货数量" :disabled="btnType == 'look'"
                        maxlength="11" @input="watchnums(scope.row, scope.$index)" style="width: 145px;">
                        {{ scope.row.receivedQuantity }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="含税单价" width="130">
                  <template slot="header">
                    <span class="required">*</span>
                    单价(含税)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                      <el-input v-model="scope.row.price" placeholder="单价(含税)"
                        :disabled="isReturnSwitch || btnType == 'look'" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="totalAmount" label="金额" width="140">
                  <template slot="header">
                    <span class="required">*</span>
                    金额(含税)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'totalAmount'">
                      <div class="viewData">
                        <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="taxRate" label="税率" width="140">
                  <template slot="header">
                    <span class="required">*</span>
                    税率
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :rules="productRules.taxRate">
                      <el-select v-model="scope.row.taxRate" :disabled="isReturnSwitch || btnType == 'look'"
                        placeholder="请选择" style="width: 100%;">
                        <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                          :value="item.enCode"></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="150">
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'excludingTaxPrice'">
                      <div class="viewData">
                        <span>{{ scope.row.excludingTaxPrice }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="taxAmount" label="税额" min-width="100">
                  <template slot="header">
                    <span class="required">*</span>
                    税额
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'taxAmount'">
                      <div class="viewData">
                        <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="180">
                  <template slot="header">
                    <span class="required">*</span>
                    金额(不含税)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'excludingTaxAmount'">
                      <div class="viewData">
                        <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注"
                      :disabled="btnType == 'look' ? true : false" maxlength="200" show-overflow-tooltip />
                  </template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />

                <el-table-column prop="remark" label="备注" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注"
                      :disabled="btnType == 'look' ? true : false" maxlength="200" show-overflow-tooltip />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin:0 10px">总退货数量：{{ totalDeliveryQuantity }}</span>
              </div>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
        width="500px">
        <div>
          <img src="@/assets/images/importSuccess.gif" alt="" style="width:100px" />
          <span class="import_t">{{ submitmethodsTitle }}啦！</span>
          <span class="import_b">您还可以进行如下操作：</span>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>
          <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()">{{ btnText }}</el-button>
          <el-button v-else type="primary" @click="continueAdd()">{{ btnText }}</el-button>
        </span>
      </el-dialog>
      <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品"
        treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="listMethod" :renderTree="false"
        :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple
        :rowDblclick="false" />
    </div>
  </transition>
</template>

<script>
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import {
  getcategoryTrees,
  getAttributeline,
  getcooperativeProduct,
  getOrderDetail,
  getsaleOrderDetailList
} from '@/api/salesManagement/assemblyOrders'
import {
  getCooperativeInfo,
  getCooperativeData,
  getBimBusinessDetail,
  getBimBusinessSwitchConfigList
} from '@/api/basicData/index'
import { detailpurchaseOrderList } from '@/api/purchasingAndOutsourcingOrders/index'
import {
  addpurPurchaseReceiptReturnGoods,
  editpurPurchaseReceiptReturnGoods,
  getpurPurchaseReceiptReturnGoodsdetail
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getWarehouseList } from '@/api/basicData/index'
import { mapGetters } from 'vuex'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow'
import recordList from '@/views/workFlow/components/RecordList.vue'
import { getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getProducts } from '@/api/masterDataManagement/index.js' // 产品列表
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: { Process, recordList },
  mixins: [busFlow, getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      isattachmentswitch: '',
      categoryId: '',
      tipsvisible: false,
      submitmethodsTitle: '',
      btnText: '',
      productList: [],
      deliveryDateArr: [],
      activeNames: ['productInfo', 'basicInfo'],
      productTotal: 0,
      codeConfig: {},
      datafilelist: [],
      provinces: [],
      orderForm: {
        returnQueryFlag: 1,
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        createByName: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        endTime: '',
        orderNo: '',
        orderType: 'procure',
        classAttribute: 'finish_product',
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        productCode: '',
        productName: ''
      },
      // orderList: [
      //   { label: "外协通知", value: "external" },
      //   { label: "采购通知", value: "sale" },
      // ],
      inspectionStatusList: [
        { label: '待检验', value: 'unInspect' },
        { label: '已检验', value: 'inspected' },
        { label: '检验中', value: 'inspecting' }
      ],
      deliveryStatusList: [
        { label: '未完成', value: 'not_returned' },
        { label: '已完成', value: 'returned' },
        { label: '已取消', value: 'canceled' }
      ],
      stockFlagList: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
      documentStatusList: [{ label: '退货', value: false }, { label: '换货', value: true }],
      approvalStatusList: [
        { label: '审批中', value: 'ing' },
        { label: '审批通过', value: 'ok' },
        { label: '审批拒绝', value: 'rebut' }
      ],
      orderListtf: [{ label: '退货', value: 'back' }, { label: '发货', value: 'delivery' }],
      orderListdd: [
        { label: '外贸', value: 'foreign_trade' },
        { label: '内销', value: 'domestic_market' },
        { label: '总成', value: 'assembly' }
      ],
      orderListfhfs: [
        { label: '送货', value: 'deliver_goods' },
        { label: '自提', value: 'self_pickup' },
        { label: '快递', value: 'express_delivery' },
        { label: '货运', value: 'freight_transport' },
        { label: '到付', value: 'collect_payment' }
      ],
      orderList: [
        { label: '正常订单', value: 'normal' },
        { label: '预测订单', value: 'prediction' },
        { label: '样品订单', value: 'sample' },
        { label: '备货订单', value: 'stock_up' },
        { label: '急件订单', value: 'urgent' }
      ],
      productRules: {
        receivedQuantity: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：退货数量${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          { validator: this.calcValidate(), trigger: 'blur' },
          { validator: this.calcValidatenum(), trigger: 'blur' }
        ]
      },
      ordersLineId: '',
      code: '',
      iszhi: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,
      // 选择客户产品参数
      productForm: {
        classAttribute: 'finish_product',
        productSource: 'purchase',
        productDrawingNo: '',
        productStatus: 'enable',

        productCategoryId: '',
        code: '',
        name: '',
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
        pageSize: 20
      },
      productVisible: false,
      cusPrototal: 0, //选择客户产品分页器的总条数
      cusProductData: [],
      // 选择全部产品参数
      allProVisible: false,
      ProductMethodArr: [
        {
          label: '物料分类',
          classAttribute: 'material',
          method: getcategoryTree,
          requestObj: { classAttribute: 'material' }
        }
      ],
      allproductData: [],
      allProductTotal: 0,
      orderDateArr: [],
      ProductTreeData: [],
      ProductListRequestObj: {
        // neOrderState: 'finish',
        orderNo: '',
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        orderType: '',
        salesName: '',
        workOrderNo: '',
        sourceOrderNo: '',
        orderStartDate: '',
        orderEndDate: '',
        contractNo: '',
        deliveryStartDate: '',
        deliveryEndDate: '',
        distributeStatus: 'distributed',
        // orderCategory: "assembly",
        shipmentStatus: '',
        orderState: '',
        productionStatus: '',
        documentStatus: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',

        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ]
      },
      attributeLines: [],
      dataFormTwo: {
        productData: []
      },
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      treeData: [],
      form: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      index: null,
      expands: true,
      refreshTree: true,
      customerVisible: false,
      paymentMethodList: [],
      paymentCycleList: [],
      activeNameDetail: 'productInfo',
      coverNum: '', //用于计算
      invoicingStatusList: [
        { label: '未开票', value: 'not_invoiced' },
        { label: '部分开票', value: 'partial_invoicing' },
        { label: '已开票', value: 'invoiced' }
      ],
      btnType: undefined,
      areaList: [],
      provinces: [],
      cities: [],
      areas: [],
      contactsList: [],
      deliveryAddressList: [],
      countryList: [],
      listQuery: {
        keyword: ''
      },
      activeName: 'orderInfo',
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        exchangeGoodsFlag: false,
        inspectionStatus: '',
        // orderCategory: "assembly",
        classAttribute: 'finish_product',
        receiptReturnType: 'back',
        notificationType: 'procure',
        stockFlag: 1,
        salesman: '',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        partnerName: '',
        orderNo: '',
        logisticsNumber: '',
        //   phone: '',
        //   country: '',
        //   province: '',
        //   city: '',
        //   area: '',
        //   address: '',
        //   delivery: '',
        //   shipperId: '',
        cooperativePartnerId: '',
        remark: '',
        approvalFlag: false
      },
      defaultAddress: '',
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      dataRule: {
        partnerName: [{ required: true, message: '所属客户不能为空', trigger: 'change' }],
        salesman: [{ required: true, message: '操作员不能为空', trigger: 'input' }],
        exchangeGoodsFlag: [{ required: true, message: '换货标识不能为空', trigger: 'change' }],
        orderNo: [{ required: true, message: '订单编号不能为空', trigger: 'change' }],
        deliverDate: [{ required: true, message: '退货日期不能为空', trigger: 'change' }],
        logisticsCompany: [{ required: true, message: '物流公司不能为空', trigger: 'change' }],
        logisticsNumber: [{ required: true, message: '物流单号不能为空', trigger: 'change' }]
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
      warehouseIdList: [],
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      oldData: [],
      getCooperativeData,
      getcategoryTree,
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTrees, requestObj: { type: 'supplier' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码' },
        { prop: 'name', label: '供应商名称' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '供应商编码', type: 'input' },
        { prop: 'name', label: '供应商名称', type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      },
      listMethod:'',
      getProducts,
      detailpurchaseOrderList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        {
          label: '产品分类',
          classAttribute: '',
          method: getcategoryTree,
          requestObj: {
            classAttribute: '',
            type: 'material'
          }
        }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: '',
        productCategoryId: '',
        code: '',
        name: '',
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        productStatus: 'enable',
        productSource: 'out',
        pageNum: 1,
        pageSize: 20
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'orderNo', label: '订单号', sortable: 'custom',minWidth:180 },
        { prop: 'projectName', label: '所属项目', sortable: 'custom' },
        { prop: 'productCode', label: '产品编码', sortable: 'custom' },
        { prop: 'code', label: '产品编码', sortable: 'custom' },
        { prop: 'productName', label: '产品名称', sortable: 'custom' },
        { prop: 'drawingNo', label: "品名规格", sortable: 'custom' },
        { prop: 'deliveryDate', label: '交货日期', sortable: 'custom' },
        { prop: 'processName', label: '工序', sortable: 'custom' },
        { prop: 'remark', label: '备注', sortable: 'custom' },
        { prop: 'createTime', label: '创建时间', sortable: 'custom' },
        { prop: 'productCategoryName', label: '所属分类', sortable: 'custom' },
        { prop: 'inventoryQuantity', label: '库存数量', sortable: 'custom' },
        { prop: 'mainUnit', label: '主单位', sortable: 'custom' },
        { prop: 'deputyUnit', label: '副单位', sortable: 'custom' },
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: "品名规格", type: 'input' },

      ], // 产品选择弹出框搜索条件
    }
  },
  computed: {
    // 总发货数量
    totalDeliveryQuantity: function () {
      var totalNum = 0
      for (var i = 0; i < this.dataFormTwo.productData.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.dataFormTwo.productData[i].receivedQuantity])
      }
      return totalNum
    },
    ...mapGetters(['userInfo'])
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },
    'dataFormTwo.productData': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          if ((item.price && item.taxRate) || (item.price && item.taxRate === 0)) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1) / 100))
          } else {
            item.excludingTaxPrice = ''
          }
          if (item.receivedQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.receivedQuantity * item.excludingTaxPrice)
          } else {
            item.excludingTaxAmount = ''
          }
          if (item.price && item.receivedQuantity && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.receivedQuantity - item.excludingTaxAmount)
          } else {
            item.taxAmount = ''
          }
          if (item.excludingTaxAmount && item.taxAmount) {
            item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          } else {
            item.totalAmount = ''
          }
          // if (!item.price) {
          //   this.$message.error('未找到供应商单价')
          // }
        })
      },
      deep: true
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.getProductClassFun()
    this.isDeputyUnitSwitch = this.$store.getters.configData.deputyUnit.procureDeputyUnit
    this.isReturnSwitch = this.$store.getters.configData.return.purchase_order
    this.getBimBusinessDetail()
    this.getWarehouseList()
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 切换供应商后给的提示
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (paramsObj.oldData.length) {
        flag = await this.$confirm('切换供应商将清空产品价格信息，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '更换成功!'
            })
            this.$refs['productForm'].resetFields()
            return true
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            return false
          })
      }
      return flag
    },
    supplierdata(id, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('partnerName')
      })
      if (data.length === 0) {
        this.dataForm.partnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.partnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
        let productIdList = []
        this.dataFormTwo.productData.forEach((item) => {
          productIdList.push(item.productsId)
        })
        let _data = {
          cooperativePartnerId: this.dataForm.cooperativePartnerId,
          productIdList
        }
      }
    },
       // 产品组件回调
    addth(id, data) {
      this.getProductClassFun()
      if (data.length) {
        let selectArr = []
        let list = data.map((item) => item.all)
        if (this.isReturnSwitch) {
          list.forEach((item, index) => {
            item.ordersNum = item.num
            item.receiptQuantity = item.purchaseQuantity
            item.productName = item.productName
            item.deliveryDate = this.dataForm.deliveryDate // 交期
            selectArr.push(item)
          })
        } else {
          list.forEach((item, index) => {
            item.receiptQuantity = item.inventoryQuantity
            item.productsId = item.id
            item.productName = item.name
            item.deliveryDate = this.dataForm.deliveryDate // 交期
            selectArr.push(item)
          })
        }
       
        if (this.dataFormTwo.productData && this.dataFormTwo.productData.length) {
          const deletedArray = []
          selectArr = selectArr.filter((item1) => {
            const index = this.dataFormTwo.productData.findIndex((item2) => item2.productsId === item1.productsId)
            if (index !== -1) {
              deletedArray.push(item1.productName)
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false
            }
            return true
          })
        }
        console.log(selectArr,'kkk')
        this.dataFormTwo.productData = [...this.dataFormTwo.productData, ...selectArr]
        console.log(this.dataFormTwo.productData,'lll')
        // 审批
        // this.$nextTick(() => { this.getApproverData() })
      }
    },
    getProductClassFun() {
      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_cpcgthtzd'
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    getWarehouseList() {
      let obj = {
        type: 'virtually',
        category: 'warehouse'
      }
      getWarehouseList(obj).then((res) => {
        this.warehouseIdList = res.data
      })
    },
    //发货数量不能为0
    calcValidatenum() {
      return (rule, value, callback) => {
        let msg = `退货数量不能为'0'`
        if (value == 0) {
          callback(new Error(msg)), this.$message.error(msg)
        }
      }
    },
    //数量验证
    // list 中 a 不能 operator b 的校验规则
    calcValidate() {
      return (rule, value, callback) => {
        let index = Number(rule.field.match(/\d+/)[0])
        let msg = `换货数量超过最大可换货数量`
        if (!value || value == 0) {
          callback()
        } else {
          let flag = false
          let list = this.dataFormTwo.productData
          let num_1 = Number(list[index].receivedQuantity)
          let num_2 = Number(list[index].receiptQuantity)
          if (!(num_1 <= num_2)) {
            flag = true
          }
          if (flag) {
            this.$message.error(`第${index + 1}行${msg}`)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },

    dateFormat(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      const time = y + '-' + m + '-' + d
      return time
    },

    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i]
        const index = this.dataFormTwo.productData.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.productData.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.selectRows = [] // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      if (this.btnType == 'qrsh') {
        if (this.dataFormTwo.productData.length > 1) {
          this.dataFormTwo.productData.splice(data.$index, 1)
        } else {
          this.$message({
            message: '已是最后一条数据',
            type: 'error',
            duration: 1500
          })
        }
      } else {
        this.dataFormTwo.productData.splice(data.$index, 1)
      }
    },
    // 点击选择产品
    openSeleceProductDialog() {
      console.log(this.isReturnSwitch, ';')
      if (this.isReturnSwitch) {
        if (!this.dataForm.cooperativePartnerId) return this.$message.error('请先选择供应商')
        this.listMethod = detailpurchaseOrderList
        this.ProductListRequestObj = {
          cooperativePartnerId: this.dataForm.cooperativePartnerId,
          orderType: 'procure',
          classAttribute: 'finish_product',
          returnQueryFlag: 1,
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ],
          pageNum: 1,
          pageSize: 20,
        }
        this.ProductTableSearchList = [
          { prop: 'productDrawingNo', label: "品名规格", type: 'input' },
          // { prop: 'deliveryDate', label: '交货日期', type: 'date' },
        ]
        if (this.$store.getters.configData.product.enable_productName) {
          let productCodeIndex = this.ProductTableSearchList.findIndex((obj) => obj.prop === 'productCode')
          this.ProductTableSearchList.splice(productCodeIndex +1, 0, { prop: 'productName', label: '产品名称', type: 'input' })
        }
        this.ProductTableItems = [
          { prop: 'orderNo', label: '订单号', sortable: 'custom' },
          { prop: 'productCode', label: '产品编码', sortable: 'custom' },
          { prop: 'productName', label: '产品名称', sortable: 'custom' },
          { prop: 'drawingNo', label: "品名规格", sortable: 'custom' },
          { prop: 'productCategoryName', label: '所属分类', sortable: 'custom' },
          { prop: 'mainUnit', label: this.isDeputyUnitSwitch ? '主单位' :'单位' , sortable: 'custom' },
          { prop: 'deputyUnit', label: '副单位', sortable: 'custom',render: this.isDeputyUnitSwitch ? true : false },
          { prop: 'deliveryDate', label: '交货日期', sortable: 'custom' },
          { prop: 'processName', label: '工序', sortable: 'custom' },
          { prop: 'remark', label: '备注', sortable: 'custom' },
          { prop: 'createTime', label: '创建时间', sortable: 'custom' },
         
        ]// 产品选择弹出框表单展示字段
        
      } else {
        this.listMethod = getProducts
        this.ProductListRequestObj = {
          classAttribute: "finish_product",
          productSource: 'purchase',
          productDrawingNo: "",
          productStatus: 'enable',
          productCategoryId: "",
          code: "",
          name: "",
          orderItems: [{
            "asc": false,
            "column": ""
          }, {
            "asc": false,
            "column": "create_time"
          }],
          pageNum: 1,
          pageSize: 20,
        }
        this.ProductTableSearchList = [
          { prop: 'productCode', label: '产品编码', type: 'input' },
          { prop: 'productDrawingNo', label: "品名规格", type: 'input' },
        ]
        if (this.$store.getters.configData.product.enable_productName) {
          let productCodeIndex = this.ProductTableSearchList.findIndex((obj) => obj.prop === 'productCode')
          this.ProductTableSearchList.splice(productCodeIndex +1, 0, { prop: 'productName', label: '产品名称', type: 'input' })
        }
        this.ProductTableItems = [
          { prop: 'projectName', label: '所属项目', sortable: 'custom',render:false },
          { prop: 'code', label: '产品编码', sortable: 'custom' },
          { prop: 'name', label: '产品名称', sortable: 'custom' },
          { prop: 'drawingNo', label: "品名规格", sortable: 'custom' },
          { prop: 'productCategoryName', label: '所属分类', sortable: 'custom' },
          { prop: 'mainUnit', label: this.isDeputyUnitSwitch ? '主单位' :'单位' , sortable: 'custom' },
          { prop: 'deputyUnit', label: '副单位', sortable: 'custom',render: this.isDeputyUnitSwitch ? true : false },
          { prop: 'inventoryQuantity', label: '库存数量', sortable: 'custom' },
        
        ]// 产品选择弹出框表单展示字段
      }
      this.$refs['ComSelect-page'].openDialog()
    
    },
    // 监听主数量输入
    watchnums(row, index) {
      if (!row.receivedQuantity) {
        return
      }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '')

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = ''
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1)
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0 // 小数点的数量
        let result = '' // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i]
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char
              dotCount++
            }
          } else {
            result += char
          }
        }
        row.receivedQuantity = result
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8)
        }
      }
      if (!row.receivedQuantity) {
        return
      }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '')

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = ''
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1)
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0 // 小数点的数量
        let result = '' // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i]
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char
              dotCount++
            }
          } else {
            result += char
          }
        }
        row.receivedQuantity = result
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8)
        }
      }
    },
    // 切换table
    handleClick(tab, event) { },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
        this.$set(this.dataForm, 'orderNo', data.number)
        console.log('dataForm', this.dataForm)
      } catch (error) { }
    },
    init(id, btnType, approvalFlag) {
      console.log('id', id, btnType)
      this.dataForm.id = id || ''
      this.approvalFlag = approvalFlag
      this.btnType = btnType
      if (this.dataForm.id) {
        getpurPurchaseReceiptReturnGoodsdetail(this.dataForm.id).then((res) => {
          this.dataForm = res.data.notice
          if (this.dataForm.stockFlag) {
            this.dataForm.stockFlag = 1
          } else {
            this.dataForm.stockFlag = 0
          }
          this.dataFormTwo.productData = res.data.noticeLineList
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push({
                name: item.document.fullName,
                fileSize: item.document.fileSize,
                filename: item.document.filePath,
                id: item.document.id,
                url: item.url
              })
            })
          }
          if (this.btnType == 'copy') {
            this.dataForm.inspectionStatus = ''
            this.dataForm.id = ''
            this.dataForm.deliverDate = ''
            this.datafilelist = []
            this.dataForm.approvalStatus = ''
            this.dataForm.packingStatus = 'unboxed'
            // getOrderDetail(res.data.notice.ordersId).then(res1 => {
            //   res1.data.orderLines.map((item) => {
            //     res.data.noticeLineList.map((item1) => {
            //       if (item.productsId == item1.productId) {
            //         item1.outboundQuantity = item.outboundQuantity
            //         item1.returnQuantity = item.returnQuantity
            //         item1.receivedQuantity = ''

            //       }
            //     })
            //   })

            // })
            res.data.noticeLineList.forEach((item) => {
              item.receivedQuantity = ''
            })
          } else if (this.btnType == 'edit' || this.btnType == 'look') {
            this.dataFormTwo.productData.forEach((item) => {
              item.drawingNo = item.productDrawingNo
            })
            console.log(this.dataFormTwo, 'this.dataFormTwo')
            if (this.btnType === 'edit') {
              this.getBusInfo()
            } else {
              // 流程信息和流转记录
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
            }
          }
        })

        console.log(this.dataFormTwo.productData, 'data')
      }
      if (btnType == 'add' || btnType == 'copy') {
        console.log(55555)
        this.dataForm.salesman = this.userInfo.userName
        this.formLoading = true
        this.getBusInfo()
        setTimeout(() => {
          this.formLoading = false
          this.fetchData('CGTH')
        }, 500)
      }
      if (this.btnType == 'edit') {
        this.btnText = '继续修改'
      } else if (this.btnType == 'add' || this.btnType == 'copy') {
        this.btnText = '继续新增'
      }
    },
    goBack() {
      this.$emit('close', true)
    },
    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.dataFormTwo.productData = []
      this.dataForm = {
        exchangeGoodsFlag: false,
        inspectionStatus: '',
        // orderCategory: "assembly",
        salesman: '',
        receiptReturnType: 'back',
        classAttribute: 'finish_product',
        notificationType: 'procure',
        // notifyType: 'sale',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        partnerName: '',
        orderNo: '',
        logisticsNumber: '',
        //   phone: '',
        //   country: '',
        //   province: '',
        //   city: '',
        //   area: '',
        //   address: '',
        //   delivery: '',
        //   shipperId: '',
        cooperativePartnerId: '',
        remark: '',
        approvalFlag: false
      }
      this.$refs.dataForm.resetFields()
      this.init('', 'add')
      this.tipsvisible = false
      this.btnLoading = false
    },
    handleConfirm(value) {
      let submitFlag = true

      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (!valid) {
          submitFlag = false
        }
      })
      this.$refs['productForm'].validate((valid) => {
        if (!valid) {
          submitFlag = false
        }
      })
      if (submitFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'system_attachment',
              configKey: 'fj_cpcgthtzd',
              categoryId: this.categoryId,
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        let obj = {
          attachmentList: this.datafilelist,
          returnGoods: this.dataForm,
          lines: [],
          flowData: this.flowData
        }
        if (!this.dataFormTwo.productData.length) {
          this.$message({
            message: '请选择产品',
            type: 'error',
            duration: 1500
          })
          return
        }
        this.dataFormTwo.productData.forEach((item, index) => {
          let dep = {
            calculationDirection: item.calculationDirection ? item.calculationDirection : '',
            receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
            receiptQuantity: item.receiptQuantity ? item.receiptQuantity : '',
            deputyUnit: item.deputyUnit ? item.deputyUnit : '',
            mainUnit: item.mainUnit ? item.mainUnit : '',
            ordersId: item.ordersId,
            notificationType: 'procure',
            id: item.id ? item.id : '',
            productsId: item.productsId ? item.productsId : '',
            classAttribute: item.classAttribute ? item.classAttribute : '',
            // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
            ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
            purchaseOrderId: item.purchaseOrderId ? item.purchaseOrderId : '',
            pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
            ratio: item.ratio ? item.ratio : '',
            receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
            remark: item.remark ? item.remark : '',
            purchaseReceiptReturnGoodsId: this.dataForm.id ? this.dataForm.id : '',
            receivingQuantity: item.receivingQuantity ? item.receivingQuantity : '',
            price: item.price ? item.price : '',
            totalAmount: item.totalAmount ? item.totalAmount : '',
            taxRate: item.taxRate ? item.taxRate : '',
            excludingTaxPrice: item.excludingTaxPrice ? item.excludingTaxPrice : '',
            taxAmount: item.taxAmount ? item.taxAmount : '',
            excludingTaxAmount: item.excludingTaxAmount ? item.excludingTaxAmount : '',
          }
          let dep1 = {
            billStatus: item.billStatus ? item.billStatus : '',
            calculationDirection: item.calculationDirection ? item.calculationDirection : '',
            receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
            receiptQuantity: item.receiptQuantity ? item.receiptQuantity : '',
            deputyUnit: item.deputyUnit ? item.deputyUnit : '',
            mainUnit: item.mainUnit ? item.mainUnit : '',
            ordersId: item.ordersId,
            notificationType: 'procure',
            id: item.id ? item.id : '',
            productsId: item.productsId ? item.productsId : '',
            classAttribute: item.classAttribute ? item.classAttribute : '',
            // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
            ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
            purchaseOrderId: item.purchaseOrderId ? item.purchaseOrderId : '',
            pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
            ratio: item.ratio ? item.ratio : '',
            receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
            remark: item.remark ? item.remark : '',
            purchaseReceiptReturnGoodsId: this.dataForm.id ? this.dataForm.id : '',
            receivingQuantity: item.receivingQuantity ? item.receivingQuantity : '',
            price: item.price ? item.price : '',
            totalAmount: item.totalAmount ? item.totalAmount : '',
            taxRate: item.taxRate ? item.taxRate : '',
            excludingTaxPrice: item.excludingTaxPrice ? item.excludingTaxPrice : '',
            taxAmount: item.taxAmount ? item.taxAmount : '',
            excludingTaxAmount: item.excludingTaxAmount ? item.excludingTaxAmount : '',
          }
          if (this.btnType == 'add' || this.btnType == 'copy') {
            obj.lines.push(dep)
          } else {
            obj.lines.push(dep1)
          }
        })
        this.btnLoading = true
        let formMethod = null
        console.log(obj, 'obj')
        if (this.btnType == 'edit') {
          formMethod = editpurPurchaseReceiptReturnGoods
        } else if (this.btnType == 'add' || this.btnType == 'copy') {
          // obj.notice.deliveryStatus = 'not_returned'
          formMethod = addpurPurchaseReceiptReturnGoods
        }
        formMethod(obj)
          .then((res) => {
            // let msg = "";
            // if (formMethod == addQuotationsendlist) {
            //   msg = "新建成功"
            // } else if (value == 'draft') {
            //   msg = "保存成功"
            // } else if (value == 'submit') {
            //   msg = '提交成功'
            // }
            if (value == 'draft') {
              this.submitmethodsTitle = '保存成功'
            } else if (value == 'submit') {
              this.submitmethodsTitle = '提交成功'
            }
            this.tipsvisible = true
            // this.$message({
            //   message: msg,
            //   type: 'success',
            //   duration: 1500,
            //   onClose: () => {
            //     this.visible = false
            //     this.btnLoading = false
            //     this.$emit('close', true)
            //   }
            // })
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b030')
        .then((res) => {
          if (res.data) {
            if (res.data.enabledMark) {
              this.flowData = res.data
              this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
              this.dataForm.approvalFlag = res.data.enabledMark
            } else {
              this.flowTemplateJson = {}
              this.dataForm.approvalFlag = false
              this.$message.error('未找到审批流程！')
            }
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
          }
        })
        .catch(() => { })
    },
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id)
        .then((res) => {
          if (res.data) {
            this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson
              ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson)
              : null
            this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
            this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
            let flowTaskNodeList = res.data.flowTaskNodeList
            if (flowTaskNodeList.length) {
              for (let i = 0; i < flowTaskNodeList.length; i++) {
                const nodeItem = flowTaskNodeList[i]
                const loop = (data) => {
                  if (Array.isArray(data)) data.forEach((d) => loop(d))
                  if (data.nodeId === nodeItem.nodeCode) {
                    if (nodeItem.type == 0) data.state = 'state-past'
                    if (nodeItem.type == 1) data.state = 'state-curr'
                    if (
                      nodeItem.nodeType === 'approver' ||
                      nodeItem.nodeType === 'start' ||
                      nodeItem.nodeType === 'subFlow'
                    )
                      data.content = nodeItem.userName
                    return
                  }
                  if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                  if (data.childNode) loop(data.childNode)
                }
                loop(this.flowTemplateJson)
              }
            }
          }
        })
        .catch(() => { })
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

.required {
  color: red;
  // margin-right: 4px;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
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

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
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
  padding: 10px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
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
  border-bottom: none !important;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
</style>
