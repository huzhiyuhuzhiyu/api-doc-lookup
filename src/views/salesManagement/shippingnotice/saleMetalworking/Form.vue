<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack"
            :content="btnType == 'add' ? '新建销售发货通知单' : btnType == 'edit' ? '编辑销售发货通知单' : btnType == 'qrsh' ? '确认收货' : btnType == 'copy' ? '新建销售发货通知单' : '查看销售发货通知单'" />
          <div class="options">
            <el-button type="success" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('draft')">
              保存草稿</el-button>
            <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('submit')">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">

          <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="订单信息" name="orderInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                <h5>基本信息</h5>
              </div>
              <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="通知单号" prop="orderNo">
                      <el-input v-model="dataForm.orderNo"
                        :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true ? false : true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="换货标识" prop="exchangeGoodsFlag">
                      <el-select v-model="dataForm.exchangeGoodsFlag" placeholder="请选择状态" style="width: 100%;"
                        :disabled="btnType == 'look' || Flagtype" @change="changeclick">
                        <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="客户名称" prop="partnerName">
                      <el-input v-model="dataForm.partnerName" placeholder="请选择客户" readonly @focus="openDialog">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="发货日期" prop="deliverDate">
                      <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择发货日期" type="date"
                        :disabled="btnType == 'look' || btnType == 'qrsh'" value-format="yyyy-MM-dd"
                        style="width: 100%;">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收件人" prop="recipient">
                      <el-input v-model="dataForm.recipient" placeholder="请输入收件人"
                        :disabled="btnType == 'look' || btnType == 'qrsh'" maxlength="20" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收件人电话" prop="phone">
                      <el-input v-model="dataForm.phone" placeholder="请输入电话" maxlength="20"
                        :disabled="btnType == 'look' || btnType == 'qrsh'" />
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="6" :xs="24">
                    <el-form-item label="发货人" prop="shipperId">
                      <user-select v-model="dataForm.shipperId" placeholder="请选择发货人" clearable style="width: 100%;"
                        :disabled="btnType == 'look' || btnType == 'qrsh'" @change="hangleSelectSales">
                      </user-select>

                    </el-form-item>
                  </el-col> -->
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="发货方式" prop="delivery">
                      <el-select v-model="dataForm.delivery" placeholder="请选择发货方式" clearable style="width: 100%;"
                        :disabled="btnType == 'look' || btnType == 'qrsh'">
                        <el-option v-for="(item, index) in orderListfhfs" :key="index" :label="item.label"
                          @click.native="changeDelivery(item.value)" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="发货状态" prop="deliveryStatus">
                      <el-select v-model="dataForm.deliveryStatus" placeholder="请选择发货状态" clearable style="width: 100%;"
                        :disabled="btnType == 'look' ? true : false">
                        <el-option v-for="(item, index) in deliveryStatusList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="发货完成时间" prop="deliveryCompletionDate">
                      <el-date-picker v-model="dataForm.deliveryCompletionDate" type="datetime" placeholder="请选择发货完成时间"
                        :disabled="btnType == 'look'" style="width: 100%;" clearable>
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="创建时间" prop="createTime">
                      <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="请选择创建时间"
                        :disabled="btnType == 'look'" style="width: 100%;" clearable>
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="创建人" prop="createByName">
                      <el-input v-model="dataForm.createByName" placeholder="请输入创建人" :disabled="btnType == 'look'"
                        maxlength="20" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收件地址" prop="address">
                      <template slot="label">
                        <span>地址</span>
                        <span>>></span>
                        <el-button :disabled="btnType == 'look'" type="text" @click="changeAddress">更换地址</el-button>
                      </template>
                      <el-input v-model="defaultAddress" readonly :disabled="btnType == 'look' || btnType == 'qrsh'"
                        type="textarea" maxlength="50" :rows="2" />
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="12" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="驳回理由" prop="reasonRejection">
                      <el-input v-model="dataForm.reasonRejection" placeholder="请输入驳回理由" :disabled="btnType == 'look'"
                        type="textarea" maxlength="200" :rows="2" />
                    </el-form-item>
                  </el-col> -->
                  <el-col :sm="12" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注"
                        :disabled="btnType == 'look' || btnType == 'qrsh'" type="textarea" maxlength="200" :rows="2" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>
              <div v-if="btnType == 'add' || btnType == 'edit' || btnType == 'copy'">

                <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                  icon="el-icon-plus" @click="openSeleceProductDialog()">选择产品</el-button>|
                <el-button type="text" style="margin-right:8px;margin-left:8px ; font-size:14px!important"
                  icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
              </div>
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                <el-table ref="product" :data="dataFormTwo.data" @selection-change="handeleProductInfoData"
                  v-loading="tableloading"> 
                  <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
       
              

                  <el-table-column prop="customerProductNo" label="客户料号" width="160" show-overflow-tooltip key="166">
                  </el-table-column>
          
                  <el-table-column prop="drawingNo" label="品名规格" width="290" key="3" show-overflow-tooltip>
                  </el-table-column>
                  
                  <el-table-column prop="mainUnit" label="单位" width="290" key="13" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="ordersNum" label="订单数量" width="120" key="4"
                    show-overflow-tooltip></el-table-column>
                  <el-table-column prop="waitDeliverNum" label="待发货数量" width="120" key="6" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="deliveryQuantity" label="发货数量" width="170" v-if="!dataForm.exchangeGoodsFlag"
                    key="21">
                    <template slot="header">
                      <span class="required">*</span>发货数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryQuantity'"
                        :rules='productRules.deliveryQuantity'>
                        <el-input v-model="scope.row.deliveryQuantity" placeholder="请输入发货数量"
                          :disabled="btnType == 'look' || btnType == 'qrsh'" maxlength="11"
                          @input="watchnums(scope.row, scope.$index)" style="width: 145px;">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" placeholder="请输入备注"
                        :disabled="btnType == 'look' ? true : false" maxlength="200" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="deliveryDate" label="交货日期" width="160"  />
                  <el-table-column prop="sealingCoverTyping" label="打字内容" width="160"  />
                  <el-table-column prop="accuracyLevel" label="精度等级" width="160"  />
                  <el-table-column prop="vibrationLevel" label="振动等级" width="160"  />
                  <el-table-column prop="oil" label="油脂" width="160"  />
                  <el-table-column prop="oilQuantity" label="油脂量" width="160"  />
                  <el-table-column prop="clearance" label="游隙" width="160"  />
                  <el-table-column prop="packagingMethod" label="包装方式" width="160"  />
                  <el-table-column prop="orderNo" label="订单号" width="160"  />
                  <el-table-column prop="workOrderNo" label="工作令号" width="160"  />
                  <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-dialog title="选择客户" :close-on-click-modal="false" :close-on-press-escape="false"
          :visible.sync="customerVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
          append-to-body @close="handleClose">

          <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
            <div class="JNPF-common-layout-left">
              <div class="JNPF-common-title">
                <h2>客户分类</h2>
                <span class="options">
                  <el-dropdown>
                    <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                      <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                      <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </div>

              <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
                <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                  highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                  class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
                  <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                    <i
                      :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                    <span class="text" :title="data.name">{{ data.name }}</span>
                  </span>
                </el-tree>
              </el-scrollbar>
            </div>
            <div class="JNPF-common-layout-center JNPF-flex-main">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="form.code" placeholder="请输入客户编码" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="form.name" placeholder="请输入客户名称" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="form.taxId" placeholder="请输入税号" clearable />
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
                <JNPF-table v-loading="listLoading" :data="tableDataCustomer" @row-dblclick="seleceCustomer">
                  <el-table-column prop="code" label="客户编码" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="客户名称" />
                  <el-table-column prop="taxId" label="税号" />
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button type="text" @click="seleceCustomer(scope.row)" size="mini">选择</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
                  @pagination="initData" />
              </div>
            </div>
          </div>

        </el-dialog>
        <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
          :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
          append-to-body>

          <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

            <div class="JNPF-common-layout-center JNPF-flex-main">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="orderForm.customerProductDrawingNo" placeholder="请输入客户料号" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="orderForm.drawingNo" placeholder="请输入品名规格" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="交货日期">
                      <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                        style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
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
                <JNPF-table v-loading="listLoading" :data="productList" @row-dblclick="seleceCustomer" hasC @selection-change="handleSelectionChangeAllPruduct">
                  <el-table-column prop="orderNo" label="订单号" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="customerProductNo" label="客户料号" width="160" sortable="custom" />
                  <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
                  <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom" />
                  <el-table-column prop="mainUnit" label="单位" width="160" sortable="custom" />
                  <el-table-column prop="num" label="数量" width="160" sortable="custom" />
                  <el-table-column prop="waitDeliverNum" label="待发货数量" width="160" sortable="custom" />
                  <el-table-column prop="deliveryDate" label="交货日期" width="160" sortable="custom" />
                  <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom" />
                  <el-table-column prop="accuracyLevel" label="精度等级" width="160" sortable="custom" />
                  <el-table-column prop="vibrationLevel" label="振动等级" width="160" sortable="custom" />
                  <el-table-column prop="oil" label="油脂" width="160" sortable="custom" />
                  <el-table-column prop="oilQuantity" label="油脂量" width="160" sortable="custom" />
                  <el-table-column prop="clearance" label="游隙" width="160" sortable="custom" />
                  <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom" />
                  <el-table-column prop="remark" label="备注" width="160" sortable="custom" />
                  <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                </JNPF-table>
                <pagination :total="productTotal" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                  @pagination="searchProductFun" />
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click=" productVisible= false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
              确定</el-button>
          </span>
        </el-dialog>


      </div>
    </transition>
    <changeAddress v-if="addressVisibled" ref="addressRef" @getChangeAddress="getChangeAddress"></changeAddress>
  </div>
</template>

<script>
import {
  editPartner, addPartner,
  getCounryData, checkCode
} from '@/api/basicData/index'
import {
  getProvinceList,
} from '@/api/system/province'
// import { getOrderDetail, addOrders, editOrders, getcategoryTrees, getAttributeline, getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
import { editQuotationMsendlist, addQuotationsendlist, getQuotationsendlist, editReceiptnoticelist } from "@/api/salesManagement/index";
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getcategoryTrees, getcooperativeProduct, getOrderDetail, getsaleOrderDetailList } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData, getAddressInfo } from '@/api/basicData/index'
import changeAddress from "./changeAddress.vue"
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  components: {
    changeAddress
  },
  data() {
    return {
      productList:[],
      productTotal:0,
      tableloading: false,
      deliveryDateArr: [],
      getsaleOrderList,
      productTableItems: [
        { prop: 'orderNo', label: '订单号' },
        { prop: 'cooperativePartnerCode', label: '客户编码', width: 140 },
        { prop: 'cooperativePartnerName', label: '客户名称', minWidth: 160 },
        { prop: 'orderDate', label: '订单日期' },
        { prop: 'orderType', label: '订单类型' },
        { prop: 'workOrderNo', label: '工作令号' }
      ],
      Flagtype: false,
      datafilelist: [],
      provinces: [],
      deliveryList: [
        { label: "全部", value: "all" },
        { label: "未发货完成", value: "un_shipment_completed" },
        { label: "已发货完成", value: "shipment_completed" }
      ],
      addressVisibled: false,
      inspectionStatusList: [
        { label: "待检验", value: "unInspect" },
        { label: "已检验", value: "inspected" },
      ],
      deliveryStatusList: [
        { label: "未完成", value: "undelivered" },
        { label: "已完成", value: "delivered" },
        { label: "已取消", value: "canceled" }
      ],
      documentStatusList: [
        { label: "正常发货", value: false },
        { label: "换货发货", value: true },
      ],
      approvalStatusList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" }
      ],
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],
      orderListtf: [
        { label: "退货", value: "back" },
        { label: "发货", value: "delivery" },
      ],
      orderListdd: [
        { label: "外贸", value: "foreign_trade" },
        { label: "内销", value: "domestic_market" },
        { label: "总成", value: "assembly" }
      ],
      orderListfhfs: [
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" }
      ],
      paymentStatusList: [
        { label: "未付款", value: "no_pay", },
        { label: "部分付款", value: "part_pay", },
        { label: "已付清", value: "payed", },
      ],
      productRules: {
        deliveryQuantity: [{ required: true, trigger: 'blur' }, { validator: this.formValidate('positiveNumber', '发货数量必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }, { validator: this.calcValidate(), trigger: 'blur' }],
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
        drawingNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      productVisible: false,
      cusPrototal: 0,//选择客户产品分页器的总条数
      cusProductData: [],
      // 选择全部产品参数
      allProVisible: false,
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      allproductData: [],
      allProductTotal: 0,

      ProductTreeData: [],
      ProductListRequestObj: {
        // neOrderState: 'finish',
        orderNo: "",
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        orderType: "",
        salesName: "",
        workOrderNo: "",
        sourceOrderNo: "",
        orderStartDate: "",
        orderEndDate: "",
        contractNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        // distributeStatus: 'distributed',
        shipmentState: "",
        exchangeStatus: "",
        orderState: "",
        productionStatus: "",
        documentStatus: "",
        approvalStatus: "",
        startTime: "",
        endTime: "",

        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      attributeLines: [],
      // dataFormTwo.data: [],
      dataFormTwo: {
        data: []
      },
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      treeData: [],
      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
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
      coverNum: "",//用于计算
      invoicingStatusList: [
        { label: "未开票", value: "not_invoiced" },
        { label: "部分开票", value: "partial_invoicing" },
        { label: "已开票", value: "invoiced" },
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
      activeName: "orderInfo",
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        exchangeGoodsFlag: false,
        partnerName: '',
        returnDeliveryType: 'delivery',
        notifyType: 'sale',
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
        remark: ''
      },
      defaultAddress: "",
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dataRule: {
        orderNo: [
          { required: true, message: '订单编号不能为空', trigger: 'change' }
        ],
        exchangeGoodsFlag: [
          { required: true, message: '换货标识不能为空', trigger: 'change' }
        ],
        partnerName: [
          { required: true, message: '所属客户不能为空', trigger: 'change' }
        ],
        deliverDate: [
          { required: true, message: '发货日期不能为空', trigger: 'change' }
        ],
        recipient: [
          { required: true, message: '收件人不能为空', trigger: 'change' }
        ],
        phone: [{ required: true, message: '收件人电话不能为空', trigger: 'change' }, { validator: this.formValidate('iphone', '请输入正确的收件人电话'), trigger: 'blur' },],
        province: [{ required: true, message: '省份不能为空', trigger: 'change' }],
        city: [{ required: true, message: '市不能为空', trigger: 'change' }],
        area: [{ required: true, message: '地区不能为空', trigger: 'change' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'change' }],
        delivery: [{ required: true, message: '发货方式不能为空', trigger: 'change' }],
        // shipperId: [{ required: true, message: '发货人不能为空', trigger: 'change' }],
        country: [{ required: true, message: '国家不能为空', trigger: 'change' }],
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
      codeConfig: {},
      orderForm: {
        cooperativePartnerId: "",
        customerProductDrawingNo: "",
        deliverQueryFlag: 1,
        drawingNo: "",        // customerProductNo: "",
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

      },
      selectArr:[],
    }
  },
  created() {
    // this.handleChange()
    // this.getProvinceList() 
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    // 选择产品——搜索
    searchProductFun() {
      if (this.deliveryDateArr.length) {
        this.orderForm.deliveryStartTime = this.deliveryDateArr[0]
        this.orderForm.deliveryEndTime = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartTime = ""
        this.orderForm.deliveryEndTime = ""
      }
      this.orderForm.cooperativePartnerId = this.dataForm.cooperativePartnerId
      getsaleOrderDetailList(this.orderForm).then(res => {
        console.log("产品",res);
        this.productList = res.data.records
        this.productTotal = res.data.total
        this.listLoading = false 
      }).catch(() => {
        this.listLoading = false
      })

    },
    // 选择产品——重置
    resetProductFun() {
      this.deliveryDateArr = []
      this.orderForm = {
        cooperativePartnerId: this.dataForm.cooperativePartnerId,
        customerProductDrawingNo: "",
        deliverQueryFlag: 1,
        drawingNo: "",        // customerProductNo: "",
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
      this.searchProductFun()

    },
    // 点击选择产品
    openSeleceProductDialog() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error("请先选择客户")
      this.productVisible = true
    this.searchProductFun()
    },
    //数据格式化
    listDataFormatting(res) {
      res.data.records.forEach((item, index) => {
        if (item.orderType === 'normal') {
          item.orderType = '正常订单'
        } else if (item.orderType === 'prediction') {
          item.orderType = '预测订单'
        } else if (item.orderType === 'sample') {
          item.orderType = '样品订单'
        } else if (item.orderType === 'stock_up') {
          item.orderType = '备货订单'
        } else if (item.orderType === 'urgent') {
          item.orderType = '急件订单'
        }
      })
      return res.data.records
    },
    changeclick(e) {
      if (this.dataFormTwo.data.length) {
        this.$confirm('切换换货标识，将清空产品数据,是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '切换成功'
          })
          this.dataFormTwo.data = []
          this.deletedata()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
          this.dataForm.exchangeGoodsFlag = !e
        })
      }

    },
    //发货数量不能为0
    calcValidate() {
      return (rule, value, callback) => {
        if (this.dataForm.exchangeGoodsFlag) {
          let index = Number(rule.field.match(/\d+/)[0])
          let msg = `第${index + 1}行换发货数量超过最大换发货数量`
          let flag = false
          let list = this.dataFormTwo.data
          let num_1 = Number(list[index].deliveryQuantity)
          let num_2 = Number(list[index].exchangeReturnQuantity) - Number(list[index].undeliveredReplacementQuantity) - Number(list[index].replacementQuantity)//已换退数量-待换出数量-已换发数量
          if (!(num_1 <= num_2)) { flag = true }
          if (flag) {
            this.$message.error(msg)
            callback(new Error(msg));
          } else { callback() }
        } else {
          callback()
        }
      };
    },
 
    //选择发货方式
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
    //   console.log(r, s);
    //   this.parentId = s.parentId
    //   this.dataForm.userDepartmentName = s.organize
    // },
    // 选完客户订单数据后 渲染在列表上
    submitAllProduct() {
      if(!this.selectArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      this.selectArr.forEach(item => { 
        getOrderDetail(item.id).then(res => {
          res.data.orderLines.map((item) => {
            this.dataFormTwo.data.push(item)
          })
        })
      });
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
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {

    },

    // 单个删除
    handleDel(data) {
      if (this.btnType == 'qrsh') {
        if (this.dataFormTwo.data.length > 1) {
          this.dataFormTwo.data.splice(data.$index, 1)
        } else {
          this.$message({
            message: '已是最后一条数据',
            type: 'error',
            duration: 1500,
          })
        }
      } else {
        this.dataFormTwo.data.splice(data.$index, 1)
      }
      if (this.dataFormTwo.data.length == 0) {
        this.deletedata()
      }
    },
    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct() {
      this.productVisible = false
    },

    // 重置客户产品搜索条件
    resetcusProduct() {
      this.productForm = {
        drawingNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
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
    },
    // 搜索客户产品
    searchcusProduct() {
      this.productForm.pageNum = 1
      this.getcooperativeProduct()
    },
    // 获取客户产品数据
    getcooperativeProduct() {
      this.productForm.partnerId = this.dataForm.cooperativePartnerId
      getcooperativeProduct(this.productForm).then(res => {
        this.cusProductData = res.data.records
      })
    },
    // 选中客户产品
    handleSelectionChange(e) {
      e.forEach(item => {
        item.productName = item.name
        item.productCode = item.code
        item.price = item.purchasePrice
      });
      this.dataFormTwo.data = e
    },


    // },
    // 获取所有产品列表数据
    initData2() {
      this.listLoading = true
      getsaleOrderList(this.ProductListRequestObj).then(listRes => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        this.allProductTotal = listRes.data.total
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      })
    },
    // 搜索所有产品 列表
    searchAllProduct() {
      this.ProductListRequestObj.pageNum = 1
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.ProductListRequestObj.orderStartDate = this.orderDateArr[0]
        this.ProductListRequestObj.orderEndDate = this.orderDateArr[1]
      } else {
        this.ProductListRequestObj.orderStartDate = ""
        this.ProductListRequestObj.orderEndDate = ""
      }
      Object.keys(this.ProductListRequestObj).forEach(key => { // 清除搜索条件两端空格
        let item = this.ProductListRequestObj[key]
        this.ProductListRequestObj[key] = typeof item === 'string' ? item.trim() : item
      })
      this.initData2()
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
        row.deliveryQuantity = row.deliveryQuantity.replace(/[^0-9.]/g, '');

        if (row.deliveryQuantity.length == 1 && row.deliveryQuantity == '.') {
          // 如果第一位是小数点，则清空输入框
          row.deliveryQuantity = '';
        } else if (row.deliveryQuantity.length == 2 && row.deliveryQuantity[0] == '0' && row.deliveryQuantity[1] != '.') {
          // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
          row.deliveryQuantity = row.deliveryQuantity.slice(0, 1) + '.' + row.deliveryQuantity.slice(1);
        } else if (row.deliveryQuantity.length > 2 && row.deliveryQuantity[0] == '0' && row.deliveryQuantity[1] != '.') {
          row.deliveryQuantity = row.deliveryQuantity.substring(1, row.deliveryQuantity.length)
        }
        if (row.deliveryQuantity.includes('.')) {
          let dotCount = 0; // 小数点的数量
          let result = ''; // 处理后的结果
          for (let i = 0; i < row.deliveryQuantity.length; i++) {
            const char = row.deliveryQuantity[i];
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
          row.deliveryQuantity = result;
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
            row.deliveryQuantity = row.deliveryQuantity.substring(0, 8);
          }
        }
    },
   
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },


    handleClose() {
      this.form = {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.initData()
    },
    closeproductVisible() {

    },
    //清空数据
    deletedata() {
      this.dataForm.ordersId = '',
        this.dataForm.recipient = '',
        this.dataForm.phone = '',
        this.dataForm.partnerName = '',
        this.dataForm.code = '',
        this.dataForm.country = '',
        this.dataForm.province = '',
        this.dataForm.city = '',
        this.dataForm.area = '',
        // this.dataForm.shipperId = '',
        this.dataForm.remark = ''
    },
    // 选择客户
    seleceCustomer(e) {
      console.log("客户信息", e);
      getCooperativeInfo(e.id).then(res => {
        if (this.dataForm.cooperativePartnerId && res.msg == 'Success') {
          this.$confirm('已选择过客户，是否切换，切换后将清空订单和产品信息，是否继续！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '切换成功'
            })
            this.deletedata()
            this.dataFormTwo.data = []
            this.customerData = e
            this.dataForm.cooperativePartnerId = e.id
            this.ProductListRequestObj.cooperativePartnerCode = e.code
            this.code = e.code
            this.dataForm.partnerName = e.name
            this.dataForm.code = e.code
            this.customerVisible = false

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            this.customerVisible = true
          })
        } else {
          this.deletedata()
          this.dataFormTwo.data = []
          this.customerData = e
          this.dataForm.cooperativePartnerId = e.id
          this.ProductListRequestObj.cooperativePartnerCode = e.code
          this.code = e.code
          this.dataForm.partnerName = e.name
          this.dataForm.code = e.code
          this.customerVisible = false

        }
      })
      getAddressInfo(e.id).then(row => {
        let dfaddress = row.data.filter(item => { return item.defaultFlag })
        if (dfaddress.length) {
          this.dataForm.recipient = dfaddress[0].recipient
          this.dataForm.phone = dfaddress[0].phone
          this.dataForm.country = dfaddress[0].country === '中国' ? 'CN' : dfaddress[0].country
          this.dataForm.province = dfaddress[0].province
          this.dataForm.city = dfaddress[0].city
          this.dataForm.area = dfaddress[0].area
          this.dataForm.address = dfaddress[0].address
          if (this.dataForm.country === 'CN') {
            this.defaultAddress = dfaddress[0].countryText + dfaddress[0].provinceText + dfaddress[0].cityText + dfaddress[0].areaText + dfaddress[0].address
          } else {
            this.defaultAddress = dfaddress[0].countryText + dfaddress[0].address
          }
        }
      })

    },

    // changeCountry(e) {
    //   // console.log('国家',e);
    //   this.dataForm.country = e
    // },
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
        code: "",
        taxId: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.getcategoryTree()
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
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map(o => o.id)
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
    // 获取客户数据
    getcategoryTree(isInit) {
      this.treeLoading = true
      let listQuery = {
        keyword: '',
        type: "customer"
      };
      getcategoryTrees(listQuery).then(res => {
        this.treeData = res.data
        this.$nextTick(() => {
          this.initData()
          this.treeLoading = false
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    // 打开选择客户弹框
    openDialog() {
      this.customerVisible = true
      this.getcategoryTree()
    },

    // 切换table
    handleClick(tab, event) {
    },
    init(id, btnType) {
      // this.getProvinceList()
      this.dataForm.id = id || ''
      this.btnType = btnType
      this.oldId = JSON.parse(JSON.stringify(id)) || ""
      this.oldType = JSON.parse(JSON.stringify(btnType))
      if (this.dataForm.id) {
        getQuotationsendlist(this.dataForm.id).then(res => {
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
          this.dataForm = res.data.notice
          this.dataForm.country = res.data.notice.country === '中国' ? 'CN' : res.data.notice.country
          if (this.dataForm.country === 'CN') {
            this.defaultAddress = res.data.notice.region.provinceName + res.data.notice.region.cityName + res.data.notice.region.areaName + res.data.notice.address
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




          } else if (this.btnType == 'edit' || this.btnType == 'look') {

            // this.dataFormTwo.data = res.data.noticeLineList
            this.processingdata(res.data.noticeLineList)
          }

        })

      }
      if (btnType == 'add' || btnType == 'copy') {
        const currentDate = new Date();

        // 获取年份
        const year = currentDate.getFullYear();

        // 获取月份（注意月份从0开始，所以要加1）
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');

        // 获取日期
        const date = String(currentDate.getDate()).padStart(2, '0');

        // 拼接为YYYY-MM-DD格式
        const formattedDate = `${year}-${month}-${date}`;
        this.dataForm.deliverDate = formattedDate;
        this.fetchData("SSDH")

      }
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        console.log("data,",data);
        this.codeConfig = data
          this.dataForm.orderNo = data.number
          
      } catch (error) {
      }
    },
    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.init('', 'add')

      this.tipsvisible = false
    },
    goBack() {
      this.$emit('close')
    },
    handleConfirm(value) {
      this.$refs['productForm'].validate((valid) => {
        this.iszhi = valid ? false : true
      })
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (valid) {
          if (!this.dataFormTwo.data.length) {
            this.$message({
              message: '至少有一条发货明细',
              type: 'error',
              duration: 1500,
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
          //     message: `发货数量需不能为'0'`,
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
            receiptLineList: [],
          }
          let obj = {
            attachmentList: this.datafilelist,
            notice: this.dataForm,
            noticeLineList: [],
            // sourceNoticeList: this.btnType == 'add' ? this.dataFormOne.data.map(item => { return { ordersId: item.ordersId, cooperativePartnerId: item.cooperativePartnerId, returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '' } }) : this.dataFormOne.data
          }
          this.dataFormTwo.data.forEach((item, index) => {
            let dep1 = {
              billStatus: item.billStatus ? item.billStatus : '',
              calculationDirection: item.calculationDirection ? item.calculationDirection : '',
              deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
              deputyUnit: item.deputyUnit ? item.deputyUnit : '',
              mainUnit: item.mainUnit ? item.mainUnit : '',
              ordersId: item.ordersId,
              notifyType: 'sale',
              id: item.id ? item.id : '',
              // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
              ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
              pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
              ratio: item.ratio ? item.ratio : '',
              receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
              remark: item.remark ? item.remark : '',
              returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
            }
            obj1.receiptLineList.push(dep1)
            if (this.btnType == 'add' || this.btnType == 'copy') {
              let dep = {
                calculationDirection: item.calculationDirection ? item.calculationDirection : '',
                deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                deputyUnit: item.deputyUnit ? item.deputyUnit : '',
                mainUnit: item.mainUnit ? item.mainUnit : '',
                ordersId: item.ordersId,
                notifyType: 'sale',
                inspectionResults: 'qualified',
                qualifiedQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                id: '',
                ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
                ratio: item.ratio ? item.ratio : '',
                // receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
                remark: item.remark ? item.remark : '',
                returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
                sourceNoticeLineList: [
                  {
                    id: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].id : '',
                    deliveryQuantity: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].deliveryQuantity : item.deliveryQuantity,
                    ordersId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].ordersId : item.ordersId,
                    ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                    returnDeliveryNoticeId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeId : '',
                    returnDeliveryNoticeLineId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeLineId : '',
                  }
                ]
              }
              obj.noticeLineList.push(dep)
            } else {
              let dep2 = {
                billStatus: item.billStatus ? item.billStatus : '',
                calculationDirection: item.calculationDirection ? item.calculationDirection : '',
                deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                deputyUnit: item.deputyUnit ? item.deputyUnit : '',
                mainUnit: item.mainUnit ? item.mainUnit : '',
                ordersId: item.ordersId,
                notifyType: 'sale',
                inspectionResults: 'qualified',
                qualifiedQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                id: '',
                ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
                ratio: item.ratio ? item.ratio : '',
                receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
                remark: item.remark ? item.remark : '',
                returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
                sourceNoticeLineList: [
                  {
                    id: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].id : '',
                    deliveryQuantity: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].deliveryQuantity : item.deliveryQuantity,
                    ordersId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].ordersId : item.ordersId,
                    ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                    returnDeliveryNoticeId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeId : '',
                    returnDeliveryNoticeLineId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeLineId : '',
                  }
                ]
              }
              obj.noticeLineList.push(dep2)
            }
          })
      
            let isQuantity = this.dataFormTwo.data.some((item, index) => {
              return item.ordersNum && item.deliveryQuantity * 1 + item.outboundQuantity * 1 + item.undeliveredQuantity * 1 > item.ordersNum * 1
            })
            if (!this.dataForm.exchangeGoodsFlag && isQuantity) {
              this.$confirm(`总发货数量大于订单数量,是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.btnLoading = true
                let formMethod = null;
                if (this.btnType == 'edit') {
                  formMethod = editQuotationMsendlist
                } else if (this.btnType == 'add' || this.btnType == 'copy') {
                  obj.notice.deliveryStatus = 'undelivered'
                  formMethod = addQuotationsendlist
                }
                formMethod(obj).then(res => {
                  let msg = "";
                  if (formMethod == addQuotationsendlist) {
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
                  })
                  this.visible = false
                  this.btnLoading = false
                  this.$emit('close', true)
                }).catch(() => {
                  this.btnLoading = false
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
            } else {
              this.btnLoading = true
              let formMethod = null;
              if (this.btnType == 'edit') {
                formMethod = editQuotationMsendlist
              } else if (this.btnType == 'add' || this.btnType == 'copy') {
                obj.notice.deliveryStatus = 'undelivered'
                formMethod = addQuotationsendlist
              }
              formMethod(obj).then(res => {
                let msg = "";
                if (formMethod == addQuotationsendlist) {
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
                })
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }).catch(() => {
                this.btnLoading = false
              })
            }
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
</style>