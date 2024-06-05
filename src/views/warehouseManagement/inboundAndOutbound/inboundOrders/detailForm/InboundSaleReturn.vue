<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          :content="btnType == 'add' ? '新建销售退货通知单' : btnType == 'edit' ? '编辑销售退货通知单' : btnType == 'copy' ? '复制销售退货通知单' : '查看销售退货通知单'" />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
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
                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="通知单号" prop="orderNo">
                    <el-input v-model="dataForm.orderNo" placeholder="请选择通知单号" readonly :disabled="btnType == 'look'">
                    </el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="6" :xs="24">
                    <el-form-item label="通知单类型" prop="notifyType">
                      <el-select v-model="dataForm.notifyType" placeholder="请选择通知单类型" clearable style="width: 100%;"
                        :disabled="btnType == 'look' ? true : false">
                        <el-option v-for="(item, index) in orderList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                <!-- <el-col :sm="6" :xs="24">
                    <el-form-item label="退发类型" prop="returnDeliveryType">
                      <el-select v-model="dataForm.returnDeliveryType" placeholder="请选择退发类型" clearable style="width: 100%;"
                        :disabled="btnType == 'look' ? true : false">
                        <el-option v-for="(item, index) in orderListtf" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                <!-- <el-col :sm="6" :xs="24">
                    <el-form-item label="订单分类" prop="orderCategory">
                      <el-select v-model="dataForm.orderCategory" placeholder="请选择订单分类" clearable style="width: 100%;"
                        :disabled="btnType == 'look' ? true : false">
                        <el-option v-for="(item, index) in orderListdd" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                <el-col :sm="6" :xs="24">
                  <el-form-item label="客户名称" prop="cooperativePartnerId">
                    <el-input v-model="dataForm.partnerName" placeholder="请选择客户" readonly @focus="openDialog"
                      :disabled="btnType == 'look'">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="订单编号" prop="ordersNo">
                    <el-input v-model="dataForm.ordersNo" placeholder="请选择订单编号" readonly @focus="openSeleceProductDialog"
                      :disabled="btnType == 'look'">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="退货日期" prop="deliverDate">
                    <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择退货日期" type="date"
                      :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="物流公司" prop="logisticsCompany">
                    <el-input v-model="dataForm.logisticsCompany" placeholder="请输入物流公司" :disabled="btnType == 'look'"
                      maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="物流单号" prop="logisticsNumber">
                    <el-input v-model="dataForm.logisticsNumber" placeholder="请输入物流单号" :disabled="btnType == 'look'"
                      maxlength="50" />
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="审批状态" prop="approvalStatus">
                    <el-select v-model="dataForm.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;"
                      :disabled="btnType == 'look' ? true : false">
                      <el-option v-for="(item, index) in approvalStatusList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'start'">
                  <el-form-item label="审批完成时间" prop="approvalCompletionDate">
                    <el-date-picker v-model="dataForm.approvalCompletionDate" type="datetime" placeholder="请选择审批完成时间"
                      :disabled="btnType == 'look'" style="width: 100%;" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="单据状态" prop="documentStatus">
                    <el-select v-model="dataForm.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;"
                      :disabled="btnType == 'look' ? true : false">
                      <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="提交时间" prop="submitDate">
                    <el-date-picker v-model="dataForm.submitDate" type="datetime" placeholder="请选择提交时间"
                      :disabled="btnType == 'look'" style="width: 100%;" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="检验状态" prop="inspectionStatus">
                    <el-select v-model="dataForm.inspectionStatus" placeholder="请选择检验状态" clearable style="width: 100%;"
                      :disabled="btnType == 'look' ? true : false">
                      <el-option v-for="(item, index) in inspectionStatusList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="请选择创建时间"
                      :disabled="btnType == 'look'" style="width: 100%;" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="创建人" prop="createByName">
                    <el-input v-model="dataForm.createByName" placeholder="请输入创建人" :disabled="btnType == 'look'"
                      maxlength="20" />
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
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" type="textarea"
                      maxlength="200" :rows="2" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>
            <div v-if="btnType !== 'look'">
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                  :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择订单</el-button>| -->
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO
                @selection-change="handeleProductInfoData">
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'"
                  key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <!-- <el-table-column prop="customerProductNo" label="客户产品编码" width="200" show-overflow-tooltip> -->
                <!-- </el-table-column> -->
                <el-table-column prop="customerProductDrawingNo" label="客户产品图号" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="productName" label="产品名称" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="productDrawingNo" label="产品图号" width="200" v-if="!isproductDrawingNo" key="2">
                </el-table-column>
                <el-table-column prop="drawingNo" label="产品图号" width="200" v-else>
                </el-table-column>
                <el-table-column prop="ordersNum" label="订单数量" width="160" v-if="!isproductDrawingNo"
                  key="3"></el-table-column>
                <el-table-column prop="num" label="订单数量" width="160" v-else></el-table-column>

                <el-table-column prop="outboundQuantity" label="已出库数量" width="160" show-overflow-tooltip
                  v-if="btnType !== 'look'" key="4">
                </el-table-column>
                <el-table-column prop="outboundQuantity" label="已入库数量" width="160" show-overflow-tooltip
                  v-if="btnType == 'look'" key="21">
                </el-table-column>
                <el-table-column prop="returnQuantity" label="已退货数量" width="160" show-overflow-tooltip
                  v-if="btnType !== 'look'" key="20">
                </el-table-column>
                <!-- <el-table-column prop="outboundQuantity" label="退货入库数量" width="160" show-overflow-tooltip
                  v-if="btnType == 'look'" key="6">
                </el-table-column> -->
                <el-table-column prop="deliveryQuantity" label="退货数量" width="170">
                  <template slot="header">
                    <span class="required">*</span>退货数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'deliveryQuantity'"
                      :rules='productRules.deliveryQuantity'>
                      <el-input v-model="scope.row.deliveryQuantity" placeholder="请输入退货数量" :disabled="btnType == 'look'"
                        maxlength="11" @input="watchnums(scope.row, scope.$index)" style="width: 145px;">
                        {{ scope.row.deliveryQuantity }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false"
                      maxlength="200" show-overflow-tooltip />
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="选择客户" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="handleClose">

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
                <!-- <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                    <i
                      :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                    <span class="text" :title="data.name">{{ data.name }}</span>
                  </span> -->
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
                    <el-button type="text" @click="seleceCustomer(scope.row)">选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData" />
            </div>
          </div>
        </div>

      </el-dialog>

      <el-dialog title="选择订单" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <!-- <div class="JNPF-common-layout-left">
              <div class="JNPF-common-title">
                <h2>产品分类</h2>
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
                <el-tree ref="treeBox" :data="ProductTreeData" :props="defaultProps" :default-expand-all="expands"
                  highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeAllProduct"
                  class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNodeAllProduct">
                  <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                    <i
                      :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                    <span class="text" :title="data.name">{{ data.name }}</span>
                  </span>
                </el-tree>
              </el-scrollbar>
            </div> -->
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="ProductListRequestObj.orderNo" placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="ProductListRequestObj.workOrderNo" placeholder="请输入工作令号" clearable />
                    </el-form-item>
                  </el-col> -->
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                      :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
                    </el-date-picker>
                  </el-form-item>

                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-select v-model="ProductListRequestObj.orderType" placeholder="请选择订单类型" clearable>
                      <el-option v-for="(item, index) in orderList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>

                </el-col>
                <!-- <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="ProductListRequestObj.cooperativePartnerName" placeholder="请输入客户名称" clearable />
                    </el-form-item>
                  </el-col> -->
                <!-- <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="ProductListRequestObj.orderNo" placeholder="请输入订单号" clearable />
                    </el-form-item>
                  </el-col> -->
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchAllProduct()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetAllProduct()">{{ $t('common.reset')
                    }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="allproductData" @row-dblclick="seleceCustomerdd"
                @selection-change="handleSelectionChangeAllPruduct">
                <el-table-column prop="orderNo" label="订单号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderDate" label="订单日期" />
                <!-- <el-table-column prop="orderType" label="订单状态" /> -->
                <el-table-column prop="orderType" label="订单类型">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in orderList" :key="index">
                      <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="invoicingStatus" label="开票状态">
                  <template slot-scope="scope">
                    <div v-for="(item, index) in invoicingStatusList" :key="index">
                      <span v-if="item.value == scope.row.invoicingStatus">{{ item.label }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="workOrderNo" label="工作令号" />
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="seleceCustomerdd(scope.row)">选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum"
                :limit.sync="ProductListRequestObj.pageSize" @pagination="initData2" />
            </div>
          </div>
        </div>
        <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="allProVisible = false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
              确定</el-button>
          </span> -->
      </el-dialog>
    </div>
  </transition>
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
import { getcategoryTrees, getAttributeline, getcooperativeProduct, getOrderDetail } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData } from '@/api/basicData/index'
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  data() {
    return {
      provinces: [],
      // orderList: [
      //   { label: "外协通知", value: "external" },
      //   { label: "销售通知", value: "sale" },
      // ],
      inspectionStatusList: [
        { label: "待检验", value: "unInspect" },
        { label: "已检验", value: "inspected" },
      ],
      deliveryStatusList: [
        { label: "待发货", value: "undelivered" },
        { label: "已发货", value: "delivered" },
      ],
      documentStatusList: [
        { label: "提交", value: "submit" },
        { label: "草稿", value: "draft" },
      ],
      approvalStatusList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" }
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
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],
      productRules: {
        deliveryQuantity: [{ required: true, trigger: 'blur' }, { validator: this.calcValidate(), trigger: 'blur' }, { validator: this.calcValidatenum(), trigger: 'blur' }]
      },
      ordersLineId: '',
      isproductDrawingNo: false,
      code: '',
      iszhi: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,
      // 选择客户产品参数
      productForm: {
        //   drawingNo: "",
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
      orderDateArr: [],
      ProductTreeData: [],
      ProductListRequestObj: {
        neOrderState: 'stopped',
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
        distributeStatus: 'distributed',
        // orderCategory: "assembly",
        shipmentStatus: "",
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
      dataFormTwo: {
        productData: [],
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
        inspectionStatus: '',
        // orderCategory: "assembly",
        returnDeliveryType: 'back',
        notifyType: 'sale',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        ordersNo: '',
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
        cooperativePartnerId: [
          { required: true, message: '所属客户不能为空', trigger: 'blur' }
        ],
        ordersNo: [
          { required: true, message: '订单编号不能为空', trigger: 'change' }
        ],
        deliverDate: [
          { required: true, message: '退货日期不能为空', trigger: 'change' }
        ],
        logisticsCompany: [
          { required: true, message: '物流公司不能为空', trigger: 'change' }
        ],
        logisticsNumber: [{ required: true, message: '物流单号不能为空', trigger: 'change' }],
      },
      customerData: {},
      treeLoading: false,
      selectRows: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    // this.handleChange()
    // this.getProvinceList()
    this.getAttributeline()
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    //发货数量不能为0
    calcValidatenum() {
      return (rule, value, callback) => {
        let msg = `退货数量不能为'0'`
        if (value == 0) { callback(new Error(msg)), this.$message.error(msg) }
      };
    },
    //数量验证
    // list 中 a 不能 operator b 的校验规则
    calcValidate() {
      return (rule, value, callback) => {
        let index = Number(rule.field.match(/\d+/)[0])
        let msg = `退货数量超过最大可退货数量`
        if (!value || value == 0) { callback() }
        else {
          let flag = false
          let list = this.dataFormTwo.productData
          let num_1 = Number(list[index].deliveryQuantity)
          let num_2 = Number(list[index].outboundQuantity) - Number(list[index].returnQuantity)
          if (!(num_1 <= num_2)) { flag = true }
          if (flag) {
            this.$message.error(msg)
            callback(new Error(msg));
          } else { callback() }
        }
      };
    },
    // 选完客户订单数据后 渲染在列表上
    // submitAllProduct() {
    //   this.allProVisible = false
    //   console.log(" this.selectArr", this.selectArr);
    //   this.selectArr.forEach(item => {
    //     console.log('订单...', item);
    //     this.dataFormTwo.productData = []
    //     getOrderDetail(item.id).then(res => {
    //       console.log('订单详情', res);
    //       res.data.orderLines.map((item) => {
    //         this.dataFormTwo.productData.push(item)
    //       })
    //     })
    //   });
    // },
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
    // handleChange($event) {
    //   this.dataForm.country = ''

    //   this.countryList = []
    //   let obj = {
    //     "keyword": "",
    //     "orderItems": [
    //       {
    //         "asc": true,
    //         "column": ""
    //       }
    //     ],
    //     "pageNum": 1,
    //     "pageSize": -1
    //   }
    //   getCounryData(obj).then(res => {
    //     this.countryList = res.data.records
    //   })
    // },
    // 根据选择的省份获取相应的城市数据
    changeProvince(item, row) {
      console.log('省份', this.dataForm.country);
      this.dataForm.city = ""
      this.dataForm.area = ""
      getProvinceList(item.id).then(res => {
        console.log(res);
        // this.changeCity()
        this.cities = res.data.list
      })
    },
    // 根据选择的城市获取各区的数据
    changeCity(item, row) {
      if (row) {
        row.area = ''
      } else {
        this.dataForm.area = ""
      }
      getProvinceList(item.id).then(res => {
        console.log(res);
        this.areas = res.data.list
      })
    },
    // 获取省份数据
    getProvinceList() {
      getProvinceList(this.nodeId, this.listQuery).then(res => {
        this.provinces = res.data.list
        this.init(id, parentId)
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
        this.refreshTable = true
      })
    },
    goBack() {
      this.$emit('close')
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      console.log(val);
      this.selectRows = val
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
      if (this.dataFormTwo.productData.length == 0) {
        this.dataForm.ordersNo = ''
      }
    },
    // 单个删除
    handleDel(data) {
      console.log("1234", data);
      if (this.btnType == 'qrsh') {
        if (this.dataFormTwo.productData.length > 1) {
          this.dataFormTwo.productData.splice(data.$index, 1)
        } else {
          this.$message({
            message: '已是最后一条数据',
            type: 'error',
            duration: 1500,
          })
        }
      } else {
        this.dataFormTwo.productData.splice(data.$index, 1)
      }
      if (this.dataFormTwo.productData.length == 0) {
        this.dataForm.ordersNo = ''
      }
    },
    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct() {
      this.productVisible = false
    },

    // 重置客户产品搜索条件
    resetcusProduct() {
      this.productForm = {
        //   drawingNo: "",
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
        console.log("客户产品数据", res);
        this.cusProductData = res.data.records
      })
    },
    // 选中客户产品
    handleSelectionChange(e) {
      console.log("选中的产品", e);
      e.forEach(item => {
        item.productName = item.name
        item.productCode = item.code
        item.price = item.purchasePrice
      });
      this.dataFormTwo.productData = e
    },


    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {
      if (!this.dataForm.cooperativePartnerId) {
        this.$message({
          message: '请先选择客户',
          type: 'error',
          duration: 1500,
        })
      } else {
        this.allProVisible = true
        this.initData2()
      }
    },


    // },
    // 获取所有订单列表数据
    initData2() {
      this.ProductListRequestObj.cooperativePartnerCode = this.code ? this.code : this.dataForm.partnerCode
      console.log(this.code);
      this.listLoading = true
      getsaleOrderList(this.ProductListRequestObj).then(listRes => {
        console.log('订单列表数据', listRes);
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        console.log("listRes", listRes);
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
      this.initData2()
    },
    // 监听主数量输入
    watchnums(row, index) {
      console.log("主数量", row, index);
      if (!row.receivedQuantity) {
        return
      }
      // if(row.deliveryQuantity==0){
      //   return this.$message({
      //         message: `第${index+1}行退货数量需大于0`,
      //         type: 'error',
      //         duration: 1500,
      //       })
      // }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '');

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = '';
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1);
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i];
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
        row.receivedQuantity = result;
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
        console.log(999666, arr);
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8);
        }
      }
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
        console.log(999666, arr);
      } else {
        if (row.deliveryQuantity.length > 8) {
          row.deliveryQuantity = row.deliveryQuantity.substring(0, 8);
        }
      }

    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.orderDateArr = []
      this.ProductListRequestObj = {
        neOrderState: 'stopped',
        orderNo: "",
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
        distributeStatus: 'distributed',
        // orderCategory: "assembly",
        shipmentStatus: "",
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
        this.searchAllProduct()
    },
    handleSelectionChangeAllPruduct(val) {
      console.log("所有产品多选", val);
      this.selectArr = val
    },
    // 获取产品列表字段 编排属性
    getAttributeline() {
      getAttributeline('product').then(res => {
        console.log("res", res);
        this.attributeLines = res.data
      })
    },

    // 选完所属销售，带出所属部门
    hangleSelectSales(e, r) {
      this.dataForm.departmentId = r.parentId
      this.dataForm.departmentName = r.organize
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
    // 选择客户
    seleceCustomer(e) {
      getCooperativeInfo(e.id).then(res => {
        console.log("客户信息", res);
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
            this.dataForm = {
              // orderCategory: "assembly",
              returnDeliveryType: 'back',
              notifyType: 'sale',
              ordersNo: '',
              logisticsCompany: '',
              ordersId: '',
              deliverDate: '',
              logisticsNumber: '',
              cooperativePartnerId: '',
              remark: ''
            },
              this.dataFormTwo.productData = []
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
          this.dataForm = {
            // orderCategory: "assembly",
            returnDeliveryType: 'back',
            notifyType: 'sale',
            ordersNo: '',
            logisticsCompany: '',
            ordersId: '',
            deliverDate: '',
            logisticsNumber: '',
            cooperativePartnerId: '',
            remark: ''
          },
            this.dataFormTwo.productData = []
          this.customerData = e
          this.dataForm.cooperativePartnerId = e.id
          this.ProductListRequestObj.cooperativePartnerCode = e.code
          this.code = e.code
          this.dataForm.partnerName = e.name
          this.dataForm.code = e.code
          this.customerVisible = false
        }
      })
    },
    //选择订单
    seleceCustomerdd(e) {
      console.log('订单信息', e);
      getOrderDetail(e.id).then(res => {
        if (this.dataForm.ordersNo && res.msg == 'Success') {
          this.$confirm('此操作将切换产品数据,是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '切换成功'
            })
            this.dataFormTwo.productData = []
            this.allProVisible = false
            this.dataForm.ordersId = res.data.order.id
            this.dataForm.ordersNo = res.data.order.orderNo
            this.dataFormTwo.productData = res.data.orderLines
            // this.customerData = e
            // this.dataForm.cooperativePartnerId = e.id
            // this.dataForm.cooperativePartnerName = e.name
            // this.dataForm.code = e.code
            // this.customerVisible = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            this.allProVisible = true
          })
        } else {
          this.dataFormTwo.productData = []
          this.allProVisible = false
          this.dataForm.ordersId = res.data.order.id
          this.dataForm.ordersNo = res.data.order.orderNo
          this.dataFormTwo.productData = res.data.orderLines
        }
        if (res.data.orderLines.length > 0) {
          this.isproductDrawingNo = true
        }
      })
    },
    changeCountry(e) {
      // console.log('国家',e);
      this.dataForm.country = e
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
      console.log("请选择节点", node);
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
    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      console.log(this.ProductListRequestObj.productCategoryId, data.id);
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.ProductListRequestObj.classAttribute = data.classAttribute
      console.log(this.ProductListRequestObj.classAttribute);
      this.searchAllProduct()
    },
    getNodePathProduct(node) {
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
        console.log(99, res);
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
      console.log(tab, event);
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType == 'copy') {

      }
      if (this.btnType == 'add') {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.contractDate = this.dateFormat(end)
      }
      if (this.dataForm.id) {
        getQuotationsendlist(this.dataForm.id).then(res => {
          console.log("订单详情", res);
          this.$nextTick(() => {
            this.dataForm = res.data.notice
            if (this.btnType == 'copy') {
              this.dataForm.id = ''
              getOrderDetail(res.data.notice.ordersId).then(res => {
                this.dataFormTwo.productData = res.data.orderLines
                if (res.data.orderLines.length > 0) {
                  this.isproductDrawingNo = true
                }
              })
            } else {
              let tempLinesList = res.data.noticeLineList
              tempLinesList = tempLinesList.reduce((result, obj) => {
                let existingObj = result.find(item => item.productCode === obj.productCode && item.routingLineId == obj.routingLineId);
                if (existingObj) {
                  existingObj.deliveryQuantity = this.jnpf.math('add', [existingObj.deliveryQuantity, obj.deliveryQuantity]);
                  existingObj.qualifiedQuantity = this.jnpf.math('add', [existingObj.qualifiedQuantity, obj.qualifiedQuantity]);
                  existingObj.outboundQuantity = this.jnpf.math('add', [existingObj.outboundQuantity, obj.outboundQuantity]);
                  existingObj.ordersLineId = '';
                } else {
                  result.push(obj);
                }
                return result;
              }, []);
              this.dataFormTwo.productData = tempLinesList
            }
          })
        })

      }
    },
    goBack() {
      this.$emit('close')
      console.log("cccc");
    },
    handleConfirm(value) {
      this.$refs['productForm'].validate((valid) => {
        if (!valid) {
          return
        }
      })
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (valid) {
          let obj = {
            notice: this.dataForm,
            noticeLineList: []
          }
          if (!this.dataFormTwo.productData.length) {
            this.$message({
              message: '请选择订单',
              type: 'error',
              duration: 1500,
            })
            return
          }
          this.dataFormTwo.productData.forEach((item, index) => {
            if (!item.deliveryQuantity) {
              this.iszhi = true
              this.$message({
                message: `第${index + 1}行退货数量不能为空`,
                type: 'error',
                duration: 1500,
              })
            } else if (item.outboundQuantity && item.deliveryQuantity * 1 > (item.outboundQuantity * 1 - item.returnQuantity * 1)) {
              this.iszhi = true
              this.$message({
                message: `退货数量超过最大可退货数量`,
                type: 'error',
                duration: 1500,
              })
            } else if (item.deliveryQuantity == 0) {
              this.iszhi = true
              this.$message({
                message: `第${index + 1}行发货数量不能为'0'`,
                type: 'error',
                duration: 1500,
              })
            }
          })
          if (this.iszhi) {
            this.iszhi = false
            return
          }
          this.dataFormTwo.productData.forEach((item, index) => {
            let dep = {
              calculationDirection: item.calculationDirection ? item.calculationDirection : '',
              deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
              deputyUnit: item.deputyUnit ? item.deputyUnit : '',
              mainUnit: item.mainUnit ? item.mainUnit : '',
              ordersId: item.ordersId,
              notifyType: 'sale',
              // id:item.id?item.id:'',
              ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
              pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
              ratio: item.ratio ? item.ratio : '',
              receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
              remark: item.remark ? item.remark : '',
              returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
              receivingQuantity: item.receivingQuantity ? item.receivingQuantity : '',
            }

            obj.noticeLineList.push(dep)
          })
          this.btnLoading = true
          let formMethod = null;
          if (this.btnType == 'edit') {
            formMethod = editQuotationMsendlist
          } else if (this.btnType == 'add' || this.btnType == 'copy') {
            formMethod = addQuotationsendlist
          }
          formMethod(obj).then(res => {
            console.log(res);
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
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
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

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
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
  