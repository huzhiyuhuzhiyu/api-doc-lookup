<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" :content="btnType == 'add'
            ? '新建外协发料通知单'
            : btnType == 'edit'
              ? '编辑外协发料通知单'
              : btnType == 'qrsh'
                ? '确认收货'
                : btnType == 'copy'
                  ? '新建外协发料通知单'
                  : '查看外协发料通知单'
            " />
          <div class="options">
            <el-button type="success" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('draft')">
              保存草稿
            </el-button>
            <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-tabs v-model="activeName" v-if="!approvalFlag" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="基础信息" name="orderInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <div style="padding: 10px;">
                    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px"
                      label-position="top">
                      <el-row :gutter="30" class="custom-row">
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="单号" prop="orderNo">
                            <el-input v-model="dataForm.orderNo" :disabled="btnType == 'look'
                              ? true
                              : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                                ? false
                                : true
                              " />
                          </el-form-item>
                        </el-col>

                        <el-col :sm="6" :xs="24">
                          <el-form-item label="供应商名称" prop="partnerName">
                            <!-- 供应商选择弹窗  -->
                            <ComSelect-page clearable :isdisabled="btnType === 'look'" :treeNodeClick="treeNodeClick"
                              v-model="dataForm.partnerName" :beforeSubmit="beforeSubmit" @change="supplierdata"
                              :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'" title="选择供应商" treeTitle="供应商分类"
                              :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                              :listRequestObj="PartnerListRequestObj" :paramsObj="{ oldData }"
                              :searchList="PartnerTableSearchList" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="发料日期" prop="deliverDate">
                            <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择发料日期" type="date"
                              :disabled="btnType == 'look' || btnType == 'qrsh'" value-format="yyyy-MM-dd"
                              style="width: 100%;"></el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                          <el-form-item label="收件人" prop="recipient">
                            <el-input v-model="dataForm.recipient" placeholder="请输入收件人"
                              :disabled="btnType == 'look' || btnType == 'qrsh'" maxlength="20" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                          <el-form-item label="收件人电话" prop="phone">
                            <el-input v-model="dataForm.phone" placeholder="请输入电话" maxlength="20"
                              :disabled="btnType == 'look' || btnType == 'qrsh'" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="发料方式" prop="delivery">
                            <el-select v-model="dataForm.delivery" placeholder="请选择发料方式" clearable style="width: 100%;"
                              :disabled="btnType == 'look' || btnType == 'qrsh'">
                              <el-option v-for="(item, index) in orderListfhfs" :key="index" :label="item.label"
                                @click.native="changeDelivery(item.value)" :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>

                        <!-- <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                          <el-form-item label="发料状态" prop="deliveryStatus">
                            <el-select v-model="dataForm.deliveryStatus" placeholder="请选择发料状态" clearable
                              style="width: 100%;" :disabled="btnType == 'look' ? true : false">
                              <el-option v-for="(item, index) in deliveryStatusList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col> -->

                        <el-col :sm="12" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                          <el-form-item label="收件地址">
                            <template slot="label">
                              <span>
                                地址
                                <span class="required">*</span>
                              </span>
                              <span>>></span>
                              <el-button :disabled="btnType == 'look'" type="text" @click="changeAddress">
                                更换地址
                              </el-button>
                            </template>
                            <el-input v-model="defaultAddress" readonly
                              :disabled="btnType == 'look' || btnType == 'qrsh'" type="textarea" maxlength="50"
                              :rows="2" />
                          </el-form-item>
                        </el-col>

                        <el-col :sm="12" :xs="24">
                          <el-form-item label="备注" prop="remark">
                            <el-input v-model="dataForm.remark" placeholder="请输入备注"
                              :disabled="btnType == 'look' || btnType == 'qrsh'" type="textarea" maxlength="200"
                              :rows="2" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="产品信息" name="productInfo">
                  <div v-if="btnType == 'add' || btnType == 'edit' || btnType == 'copy'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" @click="openSeleceProductDialog()">
                      选择产品
                    </el-button>
                    |
                    <el-button type="text" style="margin-right:8px;margin-left:8px ; font-size:14px!important"
                      icon="el-icon-delete" @click="batchDelete">
                      批量删除
                    </el-button>
                  </div>
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                    <JNPF-table :hasC="btnType !== 'look'" hasNO fixedNO ref="product" :data="dataFormTwo.data"
                      @selection-change="handeleProductInfoData" v-loading="tableloading" @row-click="openDetails"
                      :row-style="rowStyle">

                      <el-table-column prop="drawingNo" label="品名规格" width="290" key="3"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column v-if="btnType == 'look'" prop="productCode" label="产品编码" width="120" key="6"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column prop="processName" label="工序名称" width="100" key="5"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column prop="mainUnit" label="单位" width="80" key="13"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column prop="purchaseQuantity" label="订单数量" width="120" key="7"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column prop="deliveryDate" label="交货日期" width="120" key="4" v-if="btnType == 'look'"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" placeholder="请输入备注"
                            :disabled="btnType == 'look' ? true : false" maxlength="200" />
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                        <template slot-scope="scope">
                          <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                        </template>
                      </el-table-column>
                    </JNPF-table>
                    <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                      <span style="font-weight:500;margin:0 10px">总订单数量：{{ totalOrdersNum }}</span>

                    </div>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="发料清单信息" name="materialInfo">
                  <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="linesList" :data="linesList"
                    id="table">
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="200"
                      show-overflow-tooltip></el-table-column>
                    <el-table-column prop="productCode" label="产品编码" width="200"></el-table-column>
                    <el-table-column prop="processName" label="工序名称" width="100"></el-table-column>
                    <el-table-column prop="mainUnit" label="单位" width="80"></el-table-column>
                    <el-table-column prop="qty" label="基本数量" width="100" v-if="btnType !== 'look'"></el-table-column>
                    <el-table-column prop="demandQuantity" label="需发料数量" width="140"
                      v-if="btnType !== 'look'"></el-table-column>
                    <el-table-column prop="deliveryQuantity" label="发料数量" width="100"
                      v-if="btnType == 'look'"></el-table-column>
                    <el-table-column prop="issuedQuantity" label="已出库数量" width="140"
                      v-if="btnType == 'look'"></el-table-column>
                    <el-table-column prop="undeliveredQuantity" label="未出库数量" width="140"
                      v-if="btnType == 'look'"></el-table-column>
                  </el-table>
                  <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">

                    <span v-if="btnType !== 'look'" style="font-weight:500;margin:0 10px">需发料数量：{{ totalDemandQuantity
                      }}</span>
                    <span v-if="btnType == 'look'" style="font-weight:500;margin:0 10px">发料数量：{{ totalDeliveryQuantity
                      }}</span>
                    <span v-if="btnType == 'look'" style="font-weight:500;margin:0 10px">已出库数量：{{ totalIssuedQuantity
                      }}</span>
                    <span v-if="btnType == 'look'" style="font-weight:500;margin:0 10px">未出库数量：{{
                      totalUndeliveredQuantity
                    }}</span>
                  </div>
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
              <div style="padding: 10px;">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" :disabled="btnType == 'look'
                          ? true
                          : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                            ? false
                            : true
                          " />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="供应商名称" prop="partnerName">
                        <!-- 供应商选择弹窗  -->
                        <ComSelect-page clearable :isdisabled="btnType === 'look'" :treeNodeClick="treeNodeClick"
                          v-model="dataForm.partnerName" :beforeSubmit="beforeSubmit" @change="supplierdata"
                          :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'" title="选择供应商" treeTitle="供应商分类"
                          :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                          :listRequestObj="PartnerListRequestObj" :paramsObj="{ oldData }"
                          :searchList="PartnerTableSearchList" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="发料日期" prop="deliverDate">
                        <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择发料日期" type="date"
                          :disabled="btnType == 'look' || btnType == 'qrsh'" value-format="yyyy-MM-dd"
                          style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                      <el-form-item label="收件人" prop="recipient">
                        <el-input v-model="dataForm.recipient" placeholder="请输入收件人"
                          :disabled="btnType == 'look' || btnType == 'qrsh'" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                      <el-form-item label="收件人电话" prop="phone">
                        <el-input v-model="dataForm.phone" placeholder="请输入电话" maxlength="20"
                          :disabled="btnType == 'look' || btnType == 'qrsh'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="发料方式" prop="delivery">
                        <el-select v-model="dataForm.delivery" placeholder="请选择发料方式" clearable style="width: 100%;"
                          :disabled="btnType == 'look' || btnType == 'qrsh'">
                          <el-option v-for="(item, index) in orderListfhfs" :key="index" :label="item.label"
                            @click.native="changeDelivery(item.value)" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <!-- <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                          <el-form-item label="发料状态" prop="deliveryStatus">
                            <el-select v-model="dataForm.deliveryStatus" placeholder="请选择发料状态" clearable
                              style="width: 100%;" :disabled="btnType == 'look' ? true : false">
                              <el-option v-for="(item, index) in deliveryStatusList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col> -->

                    <el-col :sm="12" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                      <el-form-item label="收件地址">
                        <template slot="label">
                          <span>
                            地址
                            <span class="required">*</span>
                          </span>
                          <span>>></span>
                          <el-button :disabled="btnType == 'look'" type="text" @click="changeAddress">
                            更换地址
                          </el-button>
                        </template>
                        <el-input v-model="defaultAddress" readonly :disabled="btnType == 'look' || btnType == 'qrsh'"
                          type="textarea" maxlength="50" :rows="2" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注"
                          :disabled="btnType == 'look' || btnType == 'qrsh'" type="textarea" maxlength="200"
                          :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </el-collapse-item>
            <el-collapse-item title="产品信息" name="productInfo">
              <div v-if="btnType == 'add' || btnType == 'edit' || btnType == 'copy'">
                <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                  icon="el-icon-plus" @click="openSeleceProductDialog()">
                  选择产品
                </el-button>
                |
                <el-button type="text" style="margin-right:8px;margin-left:8px ; font-size:14px!important"
                  icon="el-icon-delete" @click="batchDelete">
                  批量删除
                </el-button>
              </div>
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                <el-table ref="product" :data="dataFormTwo.data" @selection-change="handeleProductInfoData"
                  v-loading="tableloading" @row-click="openDetails" :row-style="rowStyle">

                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

                  <el-table-column prop="drawingNo" label="品名规格" width="290" key="3"
                    show-overflow-tooltip></el-table-column>
                  <el-table-column v-if="btnType == 'look'" prop="productCode" label="产品编码" width="120" key="6"
                    show-overflow-tooltip></el-table-column>
                  <el-table-column prop="processName" label="工序名称" width="100" key="5"
                    show-overflow-tooltip></el-table-column>
                  <el-table-column prop="mainUnit" label="单位" width="80" key="13"
                    show-overflow-tooltip></el-table-column>
                  <el-table-column prop="purchaseQuantity" label="订单数量" width="120" key="7"
                    show-overflow-tooltip></el-table-column>
                  <el-table-column prop="deliveryDate" label="交货日期" width="120" key="4" v-if="btnType == 'look'"
                    show-overflow-tooltip></el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" placeholder="请输入备注"
                        :disabled="btnType == 'look' ? true : false" maxlength="200" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                  <span style="font-weight:500;margin:0 10px">总订单数量：{{ totalOrdersNum }}</span>

                </div>
              </el-form>
            </el-collapse-item>
            <el-collapse-item title="发料清单信息" name="materialInfo">
              <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="linesList" :data="linesList"
                id="table">
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="120"></el-table-column>
                <el-table-column prop="processName" label="工序名称" width="100"></el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="80"></el-table-column>
                <el-table-column prop="qty" label="基本数量" width="100" v-if="btnType !== 'look'"></el-table-column>
                <el-table-column prop="demandQuantity" label="需发料数量" width="140"
                  v-if="btnType !== 'look'"></el-table-column>
                <el-table-column prop="deliveryQuantity" label="发料数量" width="100"
                  v-if="btnType == 'look'"></el-table-column>
                <el-table-column prop="issuedQuantity" label="已出库数量" width="140"
                  v-if="btnType == 'look'"></el-table-column>
                <el-table-column prop="undeliveredQuantity" label="未出库数量" width="140"
                  v-if="btnType == 'look'"></el-table-column>
              </el-table>
              <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">

                <span v-if="btnType !== 'look'" style="font-weight:500;margin:0 10px">需发料数量：{{ totalDemandQuantity
                  }}</span>
                <span v-if="btnType == 'look'" style="font-weight:500;margin:0 10px">发料数量：{{ totalDeliveryQuantity
                  }}</span>
                <span v-if="btnType == 'look'" style="font-weight:500;margin:0 10px">已出库数量：{{ totalIssuedQuantity
                  }}</span>
                <span v-if="btnType == 'look'" style="font-weight:500;margin:0 10px">未出库数量：{{
                  totalUndeliveredQuantity
                }}</span>
              </div>
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
      </div>
    </transition>
    <changeAddress v-if="addressVisibled" ref="addressRef" @getChangeAddress="getChangeAddress"></changeAddress>
    <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
      :methodArr="ProductMethodArr" :listMethod="detailpurchaseOrderList" :listRequestObj="ProductListRequestObj"
      :renderTree="false" :listDataFormatting="listDataFormatting" :searchList="ProductTableSearchList"
      :elementShow="false" multiple />
  </div>
</template>

<script>
import {
  editQuotationMsendlist,
  addQuotationsendlist,
  getQuotationsendlist,
  editReceiptnoticelist
} from '@/api/salesManagement/index'
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import {
  getcategoryTrees,
  getcooperativeProduct,
  getOrderDetail,
  getsaleOrderDetailList
} from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData, getAddressInfo, getBimBusinessDetail } from '@/api/basicData/index'
import changeAddress from './changeAddress.vue'
import { purPurchaseOrderdetail, detailpurchaseOrderList } from '@/api/purchasingAndOutsourcingOrders/index'

import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow'
import recordList from '@/views/workFlow/components/RecordList.vue'
export default {
  components: {
    changeAddress,
    Process,
    recordList
  },
  mixins: [busFlow],
  data() {
    return {
      isattachmentswitch: '',
      getCooperativeData,
      getcategoryTree,
      getcategoryTrees,
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTrees, requestObj: { type: 'outsourcing_suppliers' } },
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
        type: 'outsourcing_suppliers'
      },
      oldData: [],
      detailpurchaseOrderList,
      ProductMethodArr: [
        { label: '产品分类', classAttribute: '', method: getcategoryTree, requestObj: { classAttribute: '' } }
        // { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        orderType: 'external',
        shipmentStatus: 'not_finish',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'orderNo', label: '订单号', sortable: 'custom', width: 200 },
        { prop: 'cooperativePartnerName', label: '供应商名称', sortable: 'custom2', width: 160 },
        { prop: 'drawingNo', label: '品名规格', sortable: 'custom' },
        { prop: 'processName', label: '工序名称', sortable: 'custom2' },

        { prop: 'mainUnit', label: '单位', sortable: 'custom', width: 80 },
        { prop: 'purchaseQuantity', label: '订单数量', sortable: 'custom', minWidth: 140 },
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'orderNo', label: '订单号', type: 'input' },
        { prop: 'cooperativePartnerName', label: '供应商名称', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' }
      ], // 产品选择弹出框搜索条件

      tipsvisible: false,
      btnText: '',
      submitmethodsTitle: '',
      activeNames: ['productInfo', 'basicInfo', 'materialInfo'],
      productList: [],
      productTotal: 0,
      tableloading: false,
      deliveryDateArr: [],
      getsaleOrderList,

      Flagtype: false,
      datafilelist: [],
      provinces: [],
      deliveryList: [
        { label: '全部', value: 'all' },
        { label: '未发料完成', value: 'un_shipment_completed' },
        { label: '已发料完成', value: 'shipment_completed' }
      ],
      addressVisibled: false,
      inspectionStatusList: [{ label: '待检验', value: 'unInspect' }, { label: '已检验', value: 'inspected' }],
      deliveryStatusList: [
        { label: '未完成', value: 'not_finished' },
        { label: '已完成', value: 'finished' },
        { label: '已取消', value: 'canceled' }
      ],
      documentStatusList: [{ label: '正常发料', value: false }, { label: '换货发料', value: true }],
      approvalStatusList: [
        { label: '审批中', value: 'ing' },
        { label: '审批通过', value: 'ok' },
        { label: '审批拒绝', value: 'rebut' }
      ],
      orderList: [
        { label: '正常订单', value: 'normal' },
        { label: '预测订单', value: 'prediction' },
        { label: '样品订单', value: 'sample' },
        { label: '备货订单', value: 'stock_up' },
        { label: '急件订单', value: 'urgent' }
      ],
      orderListtf: [{ label: '退货', value: 'back' }, { label: '发料', value: 'delivery' }],
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
      paymentStatusList: [
        { label: '未付款', value: 'no_pay' },
        { label: '部分付款', value: 'part_pay' },
        { label: '已付清', value: 'payed' }
      ],
      productRules: {
        deliveryQuantity: [
          { required: true, trigger: 'blur' },
          {
            validator: this.formValidate('positiveNumber', '发料数量必须大于0', (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
            }),
            trigger: 'blur'
          },
          { validator: this.calcValidate(), trigger: 'blur' }
        ]
      },
      ordersLineId: '',
      orderDateArr: [],
      code: '',
      iszt: false,
      iszhi: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,
      // 选择客户产品参数
      productForm: {
        drawingNo: '',
        productCode: '',
        productName: '',
        partnerId: '',
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
        { label: '产品分类', classAttribute: '', method: getcategoryTree, requestObj: { classAttribute: '' } }
      ],
      allproductData: [],
      allProductTotal: 0,

      ProductTreeData: [],

      attributeLines: [],
      dataFormTwo: {
        data: []
      },
      linesList: [],
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
        type: 'customer'
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
        partnerName: '',
        returnDeliveryType: 'delivery',
        notifyType: 'external',
        ordersId: '',
        orderNo: '',
        deliverDate: '',
        recipient: '',
        phone: '',
        country: '',
        province: '',
        city: '',
        area: '',
        address: '',
        delivery: 'deliver_goods',
        // shipperId: '',
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
        orderNo: [{ required: true, message: '订单编号不能为空', trigger: 'change' }],
        exchangeGoodsFlag: [{ required: true, message: '换货标识不能为空', trigger: 'change' }],
        partnerName: [{ required: true, message: '所属客户不能为空', trigger: 'change' }],
        deliverDate: [{ required: true, message: '发料日期不能为空', trigger: 'change' }],
        recipient: [{ required: true, message: '收件人不能为空', trigger: 'change' }],
        phone: [
          { required: true, message: '收件人电话不能为空', trigger: 'change' },
          { validator: this.formValidate('iphone', '请输入正确的收件人电话'), trigger: 'blur' }
        ],
        province: [{ required: true, message: '省份不能为空', trigger: 'change' }],
        city: [{ required: true, message: '市不能为空', trigger: 'change' }],
        area: [{ required: true, message: '地区不能为空', trigger: 'change' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'change' }],
        delivery: [{ required: true, message: '发料方式不能为空', trigger: 'change' }],
        // shipperId: [{ required: true, message: '发料人不能为空', trigger: 'change' }],
        country: [{ required: true, message: '国家不能为空', trigger: 'change' }]
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
      codeConfig: {},
      orderForm: {
        cooperativePartnerId: '',
        customerProductDrawingNo: '',
        deliverQueryFlag: 1,
        drawingNo: '', // customerProductNo: "",
        deliveryStartTime: '',
        deliveryEndTime: '',

        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 't1.create_time'
          }
        ]
      },
      selectArr: [],
      autoId: ''
    }
  },
  computed: {
    // 发料数量
    totalDemandQuantity: function () {
      var totalNum = 0
      if (this.linesList.length !== 0) {
        for (var i = 0; i < this.linesList.length; i++) {
          totalNum = this.jnpf.math('add', [totalNum, this.linesList[i].demandQuantity])
        }
        return totalNum
      }
    },
    // 总发料数量
    totalDeliveryQuantity: function () {
      var totalNum = 0
      if (this.linesList.length !== 0) {
        for (var i = 0; i < this.linesList.length; i++) {
          totalNum = this.jnpf.math('add', [totalNum, this.linesList[i].deliveryQuantity])
        }
        return totalNum
      }
    },
    // 已出库数量
    totalIssuedQuantity: function () {
      var totalNum = 0
      if (this.linesList.length !== 0) {
        for (var i = 0; i < this.linesList.length; i++) {
          totalNum = this.jnpf.math('add', [totalNum, this.linesList[i].issuedQuantity])
        }
        return totalNum
      }
    },
    // 未出库数量
    totalUndeliveredQuantity: function () {
      var totalNum = 0
      if (this.linesList.length !== 0) {
        for (var i = 0; i < this.linesList.length; i++) {
          totalNum = this.jnpf.math('add', [totalNum, this.linesList[i].undeliveredQuantity])
        }
        return totalNum
      }
    },
    // 总订单数量
    totalOrdersNum: function () {
      var totalNum = 0
      console.log(this.dataFormTwo.data, 'ooo')
      if (this.dataFormTwo.data.length !== 0) {
        for (var i = 0; i < this.dataFormTwo.data.length; i++) {
          totalNum = this.jnpf.math('add', [totalNum, this.dataFormTwo.data[i].purchaseQuantity])
        }
        return totalNum
      }
    }
  },
  created() {
    this.getBimBusinessDetail()
    // this.handleChange()
    // this.getProvinceList()
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_wxfltzd'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
      })
    },
    listDataFormatting(res) {
      return res.data.records
    },
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
        flag = await this.$confirm('切换供应商将清空产品信息，是否继续？', '提示', {
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
        if (id) {
          getCooperativeInfo(id).then((res) => {
            console.log(res, 'res')
            this.customerData = res.data.cooperativePartner
            if (res.data.deliveryAddressList.length !== 0) {
              this.dataForm.recipient = res.data.deliveryAddressList[0].recipient
              this.dataForm.phone = res.data.deliveryAddressList[0].phone
              this.dataForm.country = res.data.deliveryAddressList[0].country
              this.dataForm.province = res.data.deliveryAddressList[0].province
              this.dataForm.city = res.data.deliveryAddressList[0].city
              this.dataForm.area = res.data.deliveryAddressList[0].area
              this.dataForm.address = res.data.deliveryAddressList[0].address

              if (this.dataForm.country === 'CN') {
                this.defaultAddress =
                  res.data.deliveryAddressList[0].countryText +
                  res.data.deliveryAddressList[0].provinceText +
                  res.data.deliveryAddressList[0].cityText +
                  res.data.deliveryAddressList[0].areaText +
                  res.data.deliveryAddressList[0].address
              } else {
                this.defaultAddress =
                  res.data.deliveryAddressList[0].countryText + res.data.deliveryAddressList[0].address
              }
            } else {
              this.dataForm.recipient = ''
              this.dataForm.phone = ''
              this.dataForm.country = ''
            }
          })
        }
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
        this.dataFormTwo.data.forEach((item) => {
          productIdList.push(item.productsId)
        })
        this.dataFormTwo.data = []
        this.linesList = []
      }
    },

    // 点击选择产品
    openSeleceProductDialog() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error('请先选择供应商')
      this.$refs['ComSelect-page'].openDialog()
    },

    // 产品组件回调
    addth(id, data) {
      console.log(data, 'ooo')
      if (data.length) {
        let selectArr = []

        let list = data.map((item) => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productSource: item.productSource, // 产品来源 采购
            classAttribute: item.classAttribute,
            purchaseOrderId: item.purchaseOrderId,
            productsId: item.productsId, // 产品id
            productName: item.name, // 产品名称
            productCode: item.code, // 产品编码
            drawingNo: item.drawingNo, // 品名规格
            ratio: item.ratio, // 转换系数
            calculationDirection: item.calculationDirection, // 计算方向
            mainUnit: item.mainUnit, // 主单位
            purchaseQuantity: item.purchaseQuantity, // 数量
            waitDeliverNum: item.waitDeliverNum,
            deliveryQuantity: item.waitDeliverNum,
            price: item.price, // 含税单价
            totalAmount: item.totalAmount, // 金额(含税)
            taxRate: Number(item.taxRate), // 税率
            excludingTaxPrice: item.excludingTaxPrice, // 不含税单价
            taxAmount: item.taxAmount, // 税额
            excludingTaxAmount: item.excludingTaxAmount, // 金额(不含税)
            deputyUnit: item.deputyUnit, // 副单位
            planQuantity: '', //计划数量主
            planQuantity2: '', //计划数量副
            remark: item.remark,
            orderNo: item.orderNo,
            id: item.id,
            deliveryDate: '' // 交期
          })
        })

        if (this.dataFormTwo.data.length) {
          const deletedArray = []
          selectArr = selectArr.filter((item1) => {
            const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
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
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]
        // 审批
        // this.$nextTick(() => { this.getApproverData() })
      }
    },
    changeclick(e) {
      if (this.dataFormTwo.data.length) {
        this.$confirm('切换换货标识，将清空产品数据,是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '切换成功'
            })
            this.dataFormTwo.data = []
            this.deletedata()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            this.dataForm.exchangeGoodsFlag = !e
          })
      }
    },
    //发料数量不能为0
    calcValidate() {
      return (rule, value, callback) => {
        if (this.dataForm.exchangeGoodsFlag) {
          let index = Number(rule.field.match(/\d+/)[0])
          let msg = `第${index + 1}行换发料数量超过最大换发料数量`
          let flag = false
          let list = this.dataFormTwo.data
          let num_1 = Number(list[index].deliveryQuantity)
          let num_2 =
            Number(list[index].exchangeReturnQuantity) -
            Number(list[index].undeliveredReplacementQuantity) -
            Number(list[index].replacementQuantity) //已换退数量-待换出数量-已换发数量
          if (!(num_1 <= num_2)) {
            flag = true
          }
          if (flag) {
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    },

    //选择发料方式
    changeDelivery(val) {
      if (val === 'self_pickup') {
        this.dataForm.country = ''
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
        this.dataForm.address = ''
        this.dataForm.phone = ''
        this.dataForm.recipient = ''
        this.defaultAddress = ''
      } else if (val === 'self_pickup' && this.dataForm.country != 'CN') {
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
        this.dataForm.address = ''
        this.dataForm.phone = ''
        this.dataForm.recipient = ''
        this.defaultAddress = ''
      }
    },
    // 更换地址
    changeAddress() {
      if (!this.customerData.id) return this.$message.error('请选择客户')
      this.addressVisibled = true

      this.$nextTick(() => {
        this.$refs.addressRef.initData(this.customerData.id)
      })
    },
    // 接收传递的地址
    getChangeAddress(data) {
      if (data) {
        this.dataForm.recipient = data.recipient
        this.dataForm.phone = data.phone
        this.dataForm.country = data.country === '中国' ? 'CN' : data.country
        this.dataForm.province = data.province
        this.dataForm.city = data.city
        this.dataForm.area = data.area
        this.dataForm.address = data.address
        if (this.dataForm.country === 'CN') {
          this.defaultAddress = data.countryText + data.provinceText + data.cityText + data.areaText + data.address
        } else {
          this.defaultAddress = data.countryText + data.address
        }
      }
    },
    // getuserDepartment(r, s) {

    //   this.parentId = s.parentId
    //   this.dataForm.userDepartmentName = s.organize
    // },
    // 选完订单明细后 渲染在列表上
    submitAllProduct() {
      if (!this.selectArr.length) return this.$message.error('请选择产品！')
      this.productVisible = false
      this.selectArr.forEach((item) => {
        item.ordersNum = item.num
        item.drawingNo = item.drawingNo
        item.ordersLineId = item.id
        this.dataFormTwo.data.push(item)
      })
      let uniqueArr = []
      let idSet = new Set()

      this.dataFormTwo.data.forEach((item) => {
        if (!idSet.has(item.id)) {
          uniqueArr.push(item)
          idSet.add(item.id)
        }
      })
      this.dataFormTwo.data = uniqueArr
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
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: '请选择你要删除的数据',
          type: 'error',
          duration: 1500
        })
      }
      if (this.dataFormTwo.data.length > 1) {
        for (let i = 0; i < this.selectRows.length; i++) {
          const row = this.selectRows[i]
          const index = this.dataFormTwo.data.indexOf(row)
          if (index > -1) {
            this.dataFormTwo.data.splice(index, 1) // 从tableData中删除选中的行
          }
        }
        this.selectRows = [] // 清空选中的行的数据

      } else {
        this.$message({
          message: '已是最后一条数据',
          type: 'error',
          duration: 1500
        })
      }


    },

    // 单个删除
    handleDel(data) {
      console.log(this.btnType, 'this.btnType')

      if (this.dataFormTwo.data.length > 1) {
        this.dataFormTwo.data.splice(data.$index, 1)

      } else {
        this.$message({
          message: '已是最后一条数据',
          type: 'error',
          duration: 1500
        })
      }

    },

    // 监听主数量输入
    watchnums(row, index) {
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      if (!row.deliveryQuantity) {
        return
      }
      row.deliveryQuantity = row.deliveryQuantity.replace(/[^0-9.]/g, '')

      if (row.deliveryQuantity.length == 1 && row.deliveryQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.deliveryQuantity = ''
      } else if (row.deliveryQuantity.length == 2 && row.deliveryQuantity[0] == '0' && row.deliveryQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.deliveryQuantity = row.deliveryQuantity.slice(0, 1) + '.' + row.deliveryQuantity.slice(1)
      } else if (row.deliveryQuantity.length > 2 && row.deliveryQuantity[0] == '0' && row.deliveryQuantity[1] != '.') {
        row.deliveryQuantity = row.deliveryQuantity.substring(1, row.deliveryQuantity.length)
      }
      if (row.deliveryQuantity.includes('.')) {
        let dotCount = 0 // 小数点的数量
        let result = '' // 处理后的结果
        for (let i = 0; i < row.deliveryQuantity.length; i++) {
          const char = row.deliveryQuantity[i]
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
        row.deliveryQuantity = result
        let arr = row.deliveryQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.deliveryQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.deliveryQuantity.length > 8) {
          row.deliveryQuantity = row.deliveryQuantity.substring(0, 8)
        }
      }
    },

    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },

    handleClose() {
      this.form = {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'customer'
      }
      this.initData()
    },
    closeproductVisible() { },
    //清空数据
    deletedata() {
      this.dataForm.ordersId = ''
      this.dataForm.recipient = ''
      this.dataForm.phone = ''
      this.dataForm.partnerName = ''
      this.dataForm.code = ''
      this.dataForm.country = ''
      this.dataForm.province = ''
      this.dataForm.city = ''
      this.dataForm.area = ''
      // this.dataForm.shipperId = ''
      this.dataForm.remark = ''
    },

    //明细列表id相同合并
    processingdata(a) {
      let list = a.reduce((result, obj) => {
        let target = result.find((item) => {
          return item.id == obj.id
        })
        if (target) {
          target.ordersNum = obj.ordersNum * 1 + target.ordersNum * 1
          target.outboundQuantity = obj.outboundQuantity * 1 + target.outboundQuantity * 1
          target.undeliveredQuantity = obj.undeliveredQuantity * 1 + target.undeliveredQuantity * 1
          target.deliveryQuantity = obj.deliveryQuantity * 1 + target.deliveryQuantity * 1
        } else {
          result.push(obj)
        }
        return result
      }, [])
      this.dataFormTwo.data = list
    },
    search() {
      this.form.pageNum = 1
      this.initData()
    },
    reset() {
      this.form = {
        code: '',
        taxId: '',
        name: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'customer'
      }
    },
    initData() {
      this.listLoading = true
      getCooperativeData(this.form)
        .then((res) => {
          this.tableDataCustomer = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map((o) => o.id)
      this.search()
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },

    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },

    // 切换table
    handleClick(tab, event) { },
    init(id, btnType, approvalFlag, data) {
      console.log(data, 'klkk')
      this.formLoading = true
      // this.getProvinceList()
      this.dataForm.id = id || ''
      this.btnType = btnType
      this.approvalFlag = approvalFlag
      this.oldId = JSON.parse(JSON.stringify(id)) || ''
      this.oldType = JSON.parse(JSON.stringify(btnType))

      if (this.dataForm.id) {
        getQuotationsendlist(this.dataForm.id).then((res) => {
          console.log(res, '9877')
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
          this.dataForm = res.data.notice
          this.dataForm.country = res.data.notice.country === '中国' ? 'CN' : res.data.notice.country
          if (this.dataForm.country === 'CN') {
            this.defaultAddress =
              res.data.notice.region.provinceName +
              res.data.notice.region.cityName +
              res.data.notice.region.areaName +
              res.data.notice.address
          } else {
            this.defaultAddress = res.data.notice.region.countryName + res.data.notice.address
          }
          if (this.btnType == 'copy') {
            this.dataForm.stockStatus = ''
            this.dataForm.inspectionStatus = ''
            this.dataForm.id = ''
            this.datafilelist = []
            this.dataForm.approvalStatus = ''
            this.dataForm.fullReceiptFlag = false
            res.data.noticeLineList.forEach((item) => {
              item.deliveryQuantity = ''
            })
            this.dataFormTwo.data = res.data.noticeLineList
          } else if (this.btnType == 'edit' || this.btnType == 'look') {
            this.linesList = res.data.noticeLineList
            this.processingdata(res.data.purchaseOrderLineList)
            this.linesList.forEach((item) => {
              item.drawingNo = item.productDrawingNo
              item.purchaseQuantity = item.ordersNum
            })
            console.log(this.dataFormTwo.data, 'this.dataFormTwo.data')
            if (this.btnType === 'edit') {
              this.getBusInfo()
            } else {
              // 流程信息和流转记录
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
            }
          }
        })
      }
      if (btnType == 'add' || btnType == 'copy') {
        const currentDate = new Date()

        // 获取年份
        const year = currentDate.getFullYear()

        // 获取月份（注意月份从0开始，所以要加1）
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')

        // 获取日期
        const date = String(currentDate.getDate()).padStart(2, '0')

        // 拼接为YYYY-MM-DD格式
        const formattedDate = `${year}-${month}-${date}`
        this.dataForm.deliverDate = formattedDate
        if (data) {
          this.dataForm.partnerName = data[0].cooperativePartnerName
          this.dataForm.cooperativePartnerCode = data[0].cooperativePartnerCode
          this.dataForm.cooperativePartnerId = data[0].cooperativePartnerId
          this.dataFormTwo.data = data
          this.dataFormTwo.data.forEach((item) => {
            console.log(item, 'dd')
            purPurchaseOrderdetail(item.purchaseOrderId).then((res) => {
              console.log(res, 'iiii')
              this.linesList = [...this.linesList, ...res.data.purchaseOrderLineVOList[0].outShipmentVOList]
              item.outShipmentVOList = res.data.purchaseOrderLineVOList[0].outShipmentVOList
            })
          })
        } else {
          this.dataFormTwo.data = []
        }

        this.fetchData('WXFL')
        this.getBusInfo()
      }
      if (this.btnType == 'edit') {
        this.btnText = '继续修改'
      } else if (this.btnType == 'add' || this.btnType == 'copy') {
        this.btnText = '继续新增'
      }
      this.formLoading = false
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)

        this.codeConfig = data
        this.dataForm.orderNo = data.number
      } catch (error) { }
    },
    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.tipsvisible = false
      this.btnLoading = false
      this.dataForm = {
        exchangeGoodsFlag: false,
        partnerName: '',
        returnDeliveryType: 'delivery',
        notifyType: 'external',
        ordersId: '',
        orderNo: '',
        deliverDate: '',
        recipient: '',
        phone: '',
        country: '',
        province: '',
        city: '',
        area: '',
        address: '',
        delivery: 'deliver_goods',
        // shipperId: '',
        cooperativePartnerId: '',
        remark: '',
        approvalFlag: false
      }
      this.$refs.dataForm.resetFields()
      this.init('', 'add')
    },
    openDetails(row) {
      console.log(this.approvalFlag, '555555')
      console.log(row, 'ppop66666666666')
      this.autoId = row.id
      this.linesList = []

      purPurchaseOrderdetail(row.purchaseOrderId).then((res) => {
        console.log(res, 'iiii')
        this.linesList = res.data.purchaseOrderLineVOList[0].outShipmentVOList
      })
    },
    // 更改选中行背景色
    rowStyle({ row }) {
      if (this.autoId === row.id) {
        return { 'background-color': '#F7EDED', cursor: 'pointer' }
      }
      return { cursor: 'pointer' }
    },
    goBack() {
      this.$emit('close', true)
    },
    handleConfirm(value) {
      this.$refs['productForm'].validate((valid) => {
        this.iszhi = valid ? false : true
      })
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        console.log(valid, '[]')
        if (valid) {
          if (!this.dataFormTwo.data.length) {
            this.$message({
              message: '至少有一条产品',
              type: 'error',
              duration: 1500
            })
            return
          }
          if (!this.linesList.length) {
            this.$message({
              message: '至少有一条发料明细',
              type: 'error',
              duration: 1500
            })
            return
          }

          if (this.iszhi) {
            this.iszhi = false
            return
          }
          // let eve = this.dataFormTwo.data.some(({ deliveryQuantity }) => {
          //   return deliveryQuantity < 1
          // })
          // if (eve) {
          //   this.$message({
          //     message: `发料数量需不能为'0'`,
          //     type: 'error',
          //     duration: 1500,
          //   })
          //   return
          // }
          if (value == 'submit') {
            this.dataForm.inspectionStatus = 'inspected'
          }
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: '',
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj1 = {
            attachmentList: this.datafilelist,
            id: this.dataForm.id,
            remark: this.dataForm.remark,
            receiptLineList: []
          }
          let obj = {
            flowData: this.flowData,
            attachmentList: this.datafilelist,
            notice: this.dataForm,
            noticeLineList: [],
            sourceNoticeList:
              this.btnType == 'add'
                ? this.dataFormTwo.data.map((item) => {
                  return {
                    ordersId: item.ordersId,
                    cooperativePartnerId: item.cooperativePartnerId,
                    returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : ''
                  }
                })
                : this.dataFormTwo.data
          }
          this.dataFormTwo.data.forEach((item, index) => {
            let dep1 = {
              billStatus: item.billStatus ? item.billStatus : '',
              calculationDirection: item.calculationDirection ? item.calculationDirection : '',
              deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
              deputyUnit: item.deputyUnit ? item.deputyUnit : '',
              mainUnit: item.mainUnit ? item.mainUnit : '',
              ordersId: item.ordersId ? item.ordersId : item.purchaseOrderId,
              notifyType: 'external',
              id: item.id ? item.id : '',
              classAttribute: item.classAttribute,
              productsId: item.productsId,

              // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
              ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
              pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
              ratio: item.ratio ? item.ratio : '',
              receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
              remark: item.remark ? item.remark : '',
              returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : ''
            }
            obj1.receiptLineList.push(dep1)
            if (this.btnType == 'add' || this.btnType == 'copy') {
              console.log(item, 'ooooo78787')
              item.outShipmentVOList.forEach((it) => {
                let dep = {
                  calculationDirection: it.calculationDirection ? it.calculationDirection : '',
                  deliveryQuantity: it.deliveryQuantity ? it.deliveryQuantity : it.demandQuantity,
                  deputyUnit: it.deputyUnit ? it.deputyUnit : '',
                  mainUnit: it.mainUnit ? it.mainUnit : '',
                  ordersId: it.ordersId ? it.ordersId : it.purchaseOrderId,
                  notifyType: 'external',
                  inspectionResults: 'qualified',
                  qualifiedQuantity: it.deliveryQuantity ? it.deliveryQuantity : '',
                  id: '',
                  classAttribute: it.classAttribute,
                  productsId: it.productsId,
                  ordersLineId: it.ordersLineId,
                  outShipmentListId: it.outShipmentListId ? it.outShipmentListId : it.id,
                  pickingQuantity: it.pickingQuantity ? it.pickingQuantity : '',
                  ratio: it.ratio ? it.ratio : '',
                  // demandQuantity: it.demandQuantity ? it.demandQuantity : '',
                  remark: it.remark ? it.remark : '',
                  returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
                  sourceNoticeLineList: [
                    {
                      id: it.sourceNoticeLineList ? it.sourceNoticeLineList[0].id : '',
                      deliveryQuantity: it.sourceNoticeLineList
                        ? it.sourceNoticeLineList[0].deliveryQuantity
                        : it.deliveryQuantity,
                      ordersId: it.sourceNoticeLineList ? it.sourceNoticeLineList[0].ordersId : it.ordersId,
                      ordersLineId: it.ordersLineId,
                      returnDeliveryNoticeId: it.sourceNoticeLineList
                        ? it.sourceNoticeLineList[0].returnDeliveryNoticeId
                        : '',
                      returnDeliveryNoticeLineId: it.sourceNoticeLineList
                        ? it.sourceNoticeLineList[0].returnDeliveryNoticeLineId
                        : ''
                    }
                  ]
                }
                obj.noticeLineList.push(dep)
              })
            } else {
              let dep2 = {
                billStatus: item.billStatus ? item.billStatus : '',
                calculationDirection: item.calculationDirection ? item.calculationDirection : '',
                deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                deputyUnit: item.deputyUnit ? item.deputyUnit : '',
                mainUnit: item.mainUnit ? item.mainUnit : '',
                ordersId: item.ordersId ? item.ordersId : item.purchaseOrderId,
                notifyType: 'external',
                inspectionResults: 'qualified',
                qualifiedQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                id: '',
                classAttribute: item.classAttribute,
                productsId: item.productsId,

                ordersLineId: item.ordersLineId,
                outShipmentListId: item.outShipmentListId ? item.outShipmentListId : item.id,
                pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
                ratio: item.ratio ? item.ratio : '',
                receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
                remark: item.remark ? item.remark : '',
                returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
                sourceNoticeLineList: [
                  {
                    id: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].id : '',
                    deliveryQuantity: item.sourceNoticeLineList
                      ? item.sourceNoticeLineList[0].deliveryQuantity
                      : item.deliveryQuantity,
                    ordersId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].ordersId : item.ordersId,
                    ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                    returnDeliveryNoticeId: item.sourceNoticeLineList
                      ? item.sourceNoticeLineList[0].returnDeliveryNoticeId
                      : '',
                    returnDeliveryNoticeLineId: item.sourceNoticeLineList
                      ? item.sourceNoticeLineList[0].returnDeliveryNoticeLineId
                      : ''
                  }
                ]
              }
              obj.noticeLineList.push(dep2)
            }
          })

          let isQuantity = this.dataFormTwo.data.some((item, index) => {
            return (
              item.ordersNum &&
              item.deliveryQuantity * 1 + item.outboundQuantity * 1 + item.undeliveredQuantity * 1 > item.ordersNum * 1
            )
          })
          if (!this.dataForm.exchangeGoodsFlag && isQuantity) {
            this.$confirm(`总发料数量大于订单数量,是否继续？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.btnLoading = true
                let formMethod = null
                if (this.btnType == 'edit') {
                  formMethod = editQuotationMsendlist
                } else if (this.btnType == 'add' || this.btnType == 'copy') {
                  obj.notice.deliveryStatus = 'undelivered'
                  formMethod = addQuotationsendlist
                }
                formMethod(obj)
                  .then((res) => {
                    let msg = ''
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
                    // })
                    // this.visible = false
                    // this.btnLoading = false
                    // this.$emit('close', true)
                  })
                  .catch(() => {
                    this.btnLoading = false
                  })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
          } else {
            this.btnLoading = true
            let formMethod = null
            if (this.btnType == 'edit') {
              formMethod = editQuotationMsendlist
            } else if (this.btnType == 'add' || this.btnType == 'copy') {
              obj.notice.deliveryStatus = 'undelivered'
              formMethod = addQuotationsendlist
            }
            console.log(obj, 'obj')
            formMethod(obj)
              .then((res) => {
                let msg = ''
                if (value == 'draft') {
                  this.submitmethodsTitle = '保存成功'
                } else if (value == 'submit') {
                  this.submitmethodsTitle = '提交成功'
                }
                this.tipsvisible = true
              })
              .catch(() => {
                this.btnLoading = false
              })
          }
        }
      })
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b031')
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

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.required {
  color: red;
  margin-right: 4px;
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
  padding: 0 0 15px 0;
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
