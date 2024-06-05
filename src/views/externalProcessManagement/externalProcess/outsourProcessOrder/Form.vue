<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack"
            :content="type === 'add' ? '新建外协工序订单' : type === 'edit' ? '编辑外协工序订单' : '查看外协工序订单'" />
          <div class="options" v-if="type != 'look'">
            <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿</el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>基本信息</h5>
              </div>
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :sm="8" :span="12">
                    <el-form-item label="外协供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                      <!-- <el-input :disabled="type!='add'" v-model="dataForm.cooperativePartnerName" placeholder="请选择外协供应商名称"
                        @focus="openDialog">
                      </el-input> -->
                      <!-- 供应商选择弹窗  -->
                      <ComSelect-page :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                        v-model="dataForm.cooperativePartnerName"  ref="ComSelect-page"
                        @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择外协供应商'" title="选择外协供应商"
                        treeTitle="外协供应商分类" :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                        :listRequestObj="PartnerListRequestObj" :paramsObj="{ oldData }"
                        :searchList="PartnerTableSearchList" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :span="12">
                    <el-form-item label="交货日期" prop="deliveryDate">
                      <el-date-picker :disabled="type === 'look'" v-model="dataForm.deliveryDate" type="date"
                        value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择交货日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="type === 'look'">
                    <el-form-item label="收货状态" prop="receivingStatus" ref="receivingStatus">
                      <el-input type="text" v-model="dataForm.receivingStatus === 'receiving' ? '未完成' : '已完成'"
                        placeholder="收货状态" :disabled="type != 'add' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收件人" prop="recipient" ref="recipient">
                      <el-input v-model="dataForm.recipient" placeholder="请输入收件人" :disabled="type === 'look'"
                        maxlength="20" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收件人电话" prop="phone" ref="phone">
                      <el-input v-model="dataForm.phone" placeholder="请输入电话" maxlength="20" :disabled="type === 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="发货人" prop="shipperId">
                      <user-select :disabled="type === 'look'" @change="changeshipperId" v-model="dataForm.shipperId"
                        placeholder="请选择发货人" clearable style="width: 100%;">
                      </user-select> 
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="发货方式" prop="delivery">
                      <el-select v-model="dataForm.delivery" placeholder="请选择发货方式" clearable style="width: 100%;"
                        :disabled="type === 'look'">
                        <el-option v-for="(item, index) in orderListfhfs" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select> 
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="dataForm.delivery != 'self_pickup'">
                    <el-form-item label="收货地址" prop="address">
                      <template slot="label" v-if="type != 'look'">
                        <span>收货地址</span>
                        <span>>></span>
                        <el-button :disabled="type == 'look'" type="text" @click="changeAddress">更换收货地址</el-button>
                      </template>
                      <el-input v-model="defaultAddress" readonly :disabled="type == 'look'" type="textarea"
                        maxlength="50" :rows="3" />
                    </el-form-item>
                  </el-col> -->
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" :disabled="type == 'look'" type="textarea" maxlength="50"
                        :rows="3" />
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>

              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>工序信息</h5>
              </div>
              <div v-if="type !== 'look'">
                <el-button type="text" class="topButton" icon="el-icon-plus"
                  @click="openSeleceProcess">选择订单工序</el-button>|
                <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
              </div>
              <!-- <div v-if="type !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                      icon="el-icon-plus" @click="openSeleceProductDialog()">选择产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                      icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                  </div> -->

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table" @selection-change="handeleProductInfoData" hasC>
                  <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type !== 'look'" key="selection"/>
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left"  key="index"/>
                  <el-table-column prop="processCode" label="工序编码" min-width="160" show-overflow-tooltip key="processCode">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'processCode'">
                        <div class="viewData">
                          <span>{{ scope.row.processCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processName" label="工序名称" min-width="160" show-overflow-tooltip key="processName">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'processName'">
                        <div class="viewData">
                          <span>{{ scope.row.processName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="deliveryDate" label="交货日期" min-width="240" key="deliveryDate">
                    <template slot="header">
                      <span class="required">*</span>交货日期
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                        :rules='productRules.deliveryDate'>
                        <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                          style="width: 100%;" :disabled="type == 'look'" placeholder="请选择交货日期">
                        </el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="mainUnit" label="单位(主)" min-width="140" show-overflow-tooltip key="mainUnit">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                        <!-- <el-input v-model="scope.row.mainUnit" disabled readonly maxlength="20" placeholder="请输入主单位">{{
                          scope.row.mainUnit }}
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="outsourcingQuantity" label="待外协数量" min-width="160" show-overflow-tooltip key="outsourcingQuantity" v-if="type != 'look'">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'outsourcingQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.outsourcingQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="completedQuantity" label="已完工数量(主)" min-width="160" show-overflow-tooltip key="completedQuantity">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'completedQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.completedQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                  <el-table-column prop="purchaseQuantity" label="外协数量(主)" min-width="180" key="purchaseQuantity">
                    <template slot="header">
                      <span class="required">*</span>外协数量(主)
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                        :rules='productRules.purchaseQuantity'>
                        <el-input :disabled="type === 'look'"
                          @input="changePurchaseQuantity(scope.$index, scope.row.purchaseQuantity)"
                          v-model="scope.row.purchaseQuantity" maxlength="20" placeholder="请输入外协主数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="deputyUnit" label="单位(副)" min-width="140" show-overflow-tooltip key="deputyUnit">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deputyUnit'">

                        <div class="viewData">
                          <span>{{ scope.row.deputyUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="purchaseQuantity2" label="外协数量(副)" min-width="180" key="purchaseQuantity2">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity2'"
                        :rules='productRules.purchaseQuantity2'>

                        <el-input :disabled="type === 'look'"
                          @input="changePlanQuantity2(scope.$index, scope.row.purchaseQuantity2)"
                          v-model="scope.row.purchaseQuantity2" maxlength="20" placeholder="请输入外协副数量">
                        </el-input>
                        <!-- <div class="viewData">
                          <span>{{ scope.row.planDemandQuantity2 }}</span>
                        </div> -->
                      </el-form-item>
                    </template>
                  </el-table-column>

                

                  <el-table-column prop="price" label="含税单价" min-width="180" key="price">
                    <template slot="header">
                      <span class="required">*</span>含税单价
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules='productRules.price'>
                        <el-input :disabled="type === 'look'" v-model="scope.row.price" maxlength="20"
                          placeholder="请输入含税单价">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="taxRate" label="税率%" min-width="160" key="taxRate">
                    <template slot="header">
                      <span class="required">*</span>税率%
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'" :rules='productRules.taxRate'>
                        <el-input :disabled="type === 'look'" oninput="value = value.replace(/\D/g,'')" maxlength="2"
                          v-model="scope.row.taxRate" placeholder="请输入税率">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="160" key="excludingTaxPrice">
                    <template slot="header">
                      <span class="required">*</span>不含税单价
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                        <!-- <el-input v-model="scope.row.excludingTaxPrice" maxlength="20" placeholder="请输入不含税单价">
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxPrice }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="excludingTaxAmount" label="总金额" min-width="160" key="excludingTaxAmount">
                    <template slot="header">
                      <span class="required">*</span>总金额
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                        <!-- <el-input v-model="scope.row.excludingTaxAmount" maxlength="20" placeholder="请输入不含税总金额">
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.excludingTaxAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>



                  <el-table-column prop="taxAmount" label="税额" min-width="160" key="taxAmount">
                    <template slot="header">
                      <span class="required">*</span>税额
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                        <!-- <el-input v-model="scope.row.taxAmount" maxlength="20" placeholder="请输入税额">
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.taxAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>



                  <el-table-column prop="totalAmount" label="价税合计" min-width="160" key="totalAmount">
                    <template slot="header">
                      <span class="required">*</span>价税合计
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                        <!-- <el-input v-model="scope.row.totalAmount" maxlength="20" placeholder="请输入价税合计">
                        </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.totalAmount }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" maxlength="200" :disabled="type === 'look'"
                        :placeholder="type == 'look' ? '' : '请输入备注'">{{
                          scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>


                  <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip key="productCode">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">

                        <div class="viewData">
                          <span>{{ scope.row.productCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip key="productName">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">

                        <div class="viewData">
                          <span>{{ scope.row.productName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>


                  <el-table-column prop="drawingNo" label="产品图号" min-width="160" show-overflow-tooltip key="drawingNo">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">

                        <div class="viewData">
                          <span>{{ scope.row.drawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <!-- <el-table-column prop="routingCode" label="工艺路线编码" min-width="160" show-overflow-tooltip key="routingCode">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'routingCode'">
                        <div class="viewData">
                          <span>{{ scope.row.routingCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="routingName" label="工艺路线名称" min-width="160" show-overflow-tooltip key="routingName">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'routingName'">

                        <div class="viewData">
                          <span>{{ scope.row.routingName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

      
                  <!-- <el-table-column prop="needOutsoureQuantity" label="需外协数量" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'needOutsoureQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.needOutsoureQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->
   
                  <el-table-column prop="receivingStatus" label="收货状态" width="130" v-if="type === 'look'" key="receivingStatus">
                    <template slot-scope="scope">
                      <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag> </div>
                      <div v-if="scope.row.receivingStatus == 'received'"><el-tag type="success">已完成</el-tag></div>
                      <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">

                      <el-button size="mini" type="text" @click="handlerOpenSource(scope.$index, type)">{{ type === 'look'
                        ? '查看发料清单' : "配置发料清单" }}</el-button>
                      <el-button size="mini" type="text" class="JNPF-table-delBtn" v-if="type != 'look'"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
              <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin-right:10px">总金额：{{ computedValue
                }}</span>
                <span style="font-weight:500;margin-right:10px">总税额：{{ computedValue2 }}</span>
                <span style="font-weight:500;margin-right:10px">价税合计：{{ computedValue3 }}</span>
              </div>

            </el-tab-pane>
            <el-tab-pane label="进度跟踪" name="schedule" v-if="type === 'look'">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model.trim="scheduleForm.productCode" placeholder="请输入产品编码" clearable
                        @keyup.enter.native="searchDetail()" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model.trim="scheduleForm.productName" placeholder="请输入产品名称" clearable
                        @keyup.enter.native="searchDetail()" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model.trim="scheduleForm.productDrawingNo" placeholder="请输入产品图号" clearable
                        @keyup.enter.native="searchDetail()" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-button size="mini" type="primary" icon="el-icon-search" @click="searchDetail()">
                        {{ $t('common.search') }}</el-button>
                      <el-button size="mini" icon="el-icon-refresh-right" @click="resetDetail()">{{
                        $t('common.reset') }}
                      </el-button>
                      <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
              <JNPF-table :partentOrChild="'child'" v-loading="formLoading" :data="scheduleData" custom-column ref="scheduleRef">
                <el-table-column prop="productCode" label="产品编码" min-width="160" />
                <el-table-column prop="productName" label="产品名称" min-width="160" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="180" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="160" />
                <el-table-column prop="processName" label="工序名称" min-width="160" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="140" />
                <el-table-column prop="purchaseQuantity" label="外协数量(主)" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.purchaseQuantity ? scope.row.purchaseQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="requiredReceivedQuantity" label="待入库数量" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.requiredReceivedQuantity ? scope.row.requiredReceivedQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="receiptQuantity" label="已入库数量" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.receiptQuantity ? scope.row.receiptQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="schedule" label="收货进度" min-width="160">
                  <template slot-scope="scope">
                    <el-progress
                      :percentage="Number((scope.row.receiptQuantity / scope.row.purchaseQuantity * 100).toFixed(2))"></el-progress>
                  </template>
                </el-table-column>
                <el-table-column prop="receivingStatus" label="收货状态" width="130" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag> </div>
                    <div v-if="scope.row.receivingStatus == 'received'"><el-tag type="success">已完成</el-tag></div>
                    <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="returnQuantity" label="已退货数量" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.returnQuantity ? scope.row.returnQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="deliveryDate" label="交货日期" min-width="180" />

              </JNPF-table>
              <pagination :total="total" :page.sync="scheduleForm.pageNum" :background="background"
                :limit.sync="scheduleForm.pageSize" @pagination="initData()" />
              <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow">
              <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="type" :nodeConfig.sync="busNodeConfig"
                ref="workflowRef" />
              <div class="noDataTip" v-if="!workVisible">
                <span class="el-table__empty-text">
                  <div data-v-4d190d64="" class="el-empty">
                    <div class="el-empty__image" style="width: 120px;"><svg viewBox="0 0 79 86" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <defs>
                          <linearGradient id="linearGradient-1-48" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%">
                            <stop stop-color="#FCFCFD" offset="0%"></stop>
                            <stop stop-color="#EEEFF3" offset="100%"></stop>
                          </linearGradient>
                          <linearGradient id="linearGradient-2-48" x1="0%" y1="9.5%" x2="100%" y2="90.5%">
                            <stop stop-color="#FCFCFD" offset="0%"></stop>
                            <stop stop-color="#E9EBEF" offset="100%"></stop>
                          </linearGradient>
                          <rect id="path-3-48" x="0" y="0" width="17" height="36"></rect>
                        </defs>
                        <g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g id="B-type" transform="translate(-1268.000000, -535.000000)">
                            <g id="Group-2" transform="translate(1268.000000, 535.000000)">
                              <path id="Oval-Copy-2"
                                d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z"
                                fill="#F7F8FC"></path>
                              <polygon id="Rectangle-Copy-14" fill="#E5E7E9"
                                transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) "
                                points="13 58 53 58 42 45 2 45"></polygon>
                              <g id="Group-Copy"
                                transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)">
                                <polygon id="Rectangle-Copy-10" fill="#E5E7E9"
                                  transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) "
                                  points="2.84078316e-14 3 18 3 23 7 5 7"></polygon>
                                <polygon id="Rectangle-Copy-11" fill="#EDEEF2"
                                  points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon>
                                <rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-48)"
                                  transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) "
                                  x="38" y="7" width="17" height="36"></rect>
                                <polygon id="Rectangle-Copy-13" fill="#F8F9FB"
                                  transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) "
                                  points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon>
                              </g>
                              <rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-48)" x="13" y="45" width="40"
                                height="36"></rect>
                              <g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)">
                                <mask id="mask-4-48" fill="white">
                                  <use xlink:href="#path-3-48"></use>
                                </mask>
                                <use id="Mask" fill="#E0E3E9"
                                  transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) "
                                  xlink:href="#path-3-48"></use>
                                <polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-48)"
                                  transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) "
                                  points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon>
                              </g>
                              <polygon id="Rectangle-Copy-18" fill="#F8F9FB"
                                transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) "
                                points="62 45 79 45 70 58 53 58"></polygon>
                            </g>
                          </g>
                        </g>
                      </svg></div>
                    <div class="el-empty__description">
                      <p>暂无流程信息</p>
                    </div><!---->
                  </div>
                </span>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="type == 'look'" label="流转记录" name="transferList">
              <el-table v-loading="formLoading" :data="transferData">
                <el-table-column prop="businessName" label="审批业务名称" min-width="160" />
                <el-table-column prop="processedName" label="办理人名称" min-width="160" />
                <el-table-column prop="remark" label="备注" min-width="160" />
                <el-table-column prop="startDate" label="开始时间" min-width="160" />
                <el-table-column prop="endDate" label="结束时间" min-width="160" />
                <el-table-column prop="consumingTime" label="耗时" min-width="160" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>

    <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="sourceConfirm"></source-area>

    <changeAddress v-if="addressVisibled" ref="addressRef" @getChangeAddress="getChangeAddress"></changeAddress>
    <ComSelect-page  :checkSelectable="checkSelectable"
      :beforeSubmit="beforeProcessSubmit" ref="ComSelect-page" @change="addProcess" :tableItems="ProcessTableItems"
      title="选择订单工序" :listMethod="getWorkPage" :listRequestObj="ProcessRequestObj" :searchList="ProcessTableSearchList"
      :elementShow="false" multiple :renderTree="false" :paramsObj="dataForm" />

  </div>
</template>
<script>

import SourceArea from './source.vue'
import changeAddress from "./changeAddress.vue"
import { insertOutProcessOrder, editProcessOrder, purPurchaseOrderdetail, orderSchedule } from '@/api/purchasingAndOutsourcingOrders/index'
import { getCooperativeData, getcategoryTree, getCooperativeInfo } from '@/api/basicData/index'
import { getWorkPage } from "@/api/productOrdes/index"    // 工单管理 接口
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
import { mapGetters, mapState } from 'vuex'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  components: {
    SourceArea,
    changeAddress,
    workFlow,
    ExportForm
  },
  data() {
    return {
      datafilelist: [],
      getcategoryTree,
      getCooperativeData,
      getWorkPage,
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'outsourcing_suppliers', } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '外协供应商编码', fixed: 'left' },
        { prop: 'name', label: '外协供应商名称', fixed: 'left' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' },
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: "code", label: "外协供应商编码", type: 'input' },
        { prop: "name", label: "外协供应商名称", type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: 'outsourcing_suppliers',
      },
      // 工序 树请求
      // ProcessMethodArr:[
      //     { label: "原材料分类", classAttribute: "raw_material", method: getcategoryTree, requestObj: { classAttribute: "raw_material" } },
      //     { label: "半成品分类", classAttribute: "semi_finished", method: getcategoryTree, requestObj: { classAttribute: "semi_finished" } },
      //   ],

      // 工序列表请求参数
      ProcessRequestObj: {
        pageNum: 1,
        pageSize: 20,
        processingType: 'external_production',
        selectExternalProcess:true,
        orderType: '',
        prodOrderStatus: 'normal',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      // 工序列表 展示字段
      ProcessTableItems: [
        { prop: 'productionOrderNo', label: '生产订单号', minWidth: 180 },
        // { prop: 'workOrderNo', label: '工作令号', minWidth: 120 },
        { prop: 'productCode', label: '产品编码', minWidth: 120 },
        { prop: 'productName', label: '产品名称', minWidth: 120 },
        { prop: 'productDrawingNo', label: '产品图号', minWidth: 120 },
        // { prop: 'planStartDate', label: '计划开始日期', minWidth: 120 },
        // { prop: 'planEndDate', label: '计划结束日期', minWidth: 120 },
        { prop: 'orderNo', label: '工单号', minWidth: 180 },
        { prop: 'processCode', label: '工序编码', minWidth: 120 },
        { prop: 'processName', label: '工序名称', minWidth: 120 },
        { prop: 'workOrderQuantity', label: '订单生产数量', minWidth: 120 },
        { prop: 'outsourcingQuantity', label: '待外协数量', minWidth: 120 },
        { prop: 'orderQuantity', label: '已外协数量', minWidth: 120 },
        { prop: 'completedQuantity', label: '完工数量', minWidth: 100 },
        { prop: 'previousCode', label: '上道工序编码', minWidth: 140 },
        { prop: 'previousName', label: '上道工序名称', minWidth: 140 },
        { prop: 'previousAvailableQuantity', label: '库存数量', minWidth: 100 },
        { prop: 'createTime', label: '创建时间', minWidth: 180 },
      ],
      // 工序弹窗搜索条件
      ProcessTableSearchList: [
        { prop: "processCode", label: "工序编码", type: 'input' },
        { prop: "processName", label: "工序名称", type: 'input' },
        { prop: "productDrawingNo", label: "产品图号", type: 'input' },
        { prop: "productionOrderNo", label: "生产订单号", type: 'input' },
        { prop: "workOrderNo", label: "工作令号", type: 'input' },
        { prop: "productCode", label: "产品编码", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "orderNo", label: "工单号", type: 'input' },
      ], // 货位选择弹出框搜索条件
      addressVisibled: false,
      activeName: 'jcInfo',
      dialogTitle: '',
      sourceVisibled: false,
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      // 发货方式
      orderListfhfs: [
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" }
      ],
      dataForm: {
        id: null,
        orderNo: '',
        attachmentList: [],
        cooperativePartnerId: '',
        cooperativePartnerName: '',
        cooperativePartnerCode: '',
        approvalCompletionDate: null,
        approvalStatus: null,
        deliveryDate: '',                //交货日期.
        orderType: 'external_process',
        documentStatus: '',
        purchaseOrderLines: [],
        recipient: '',
        shipperIdText: '',
        shipperId: '',
        phone: '',
        delivery: '',
        deliverys: '',
        documentStatus: '',
        address: '',
        remark: '',
        excludingTaxTotalAmount: '',       //订单 不含税总金额
        totalAmount: '',                    //   含税总金额
        taxAmount: '',                     // 税额
        productionOrderId: '',
        country: '',
        province: '',
        city: '',
        area: '',
      },
      defaultAddress: '',
      type: "",
      dataFormArr: [],
      sourceData: [],
      rules: {
        cooperativePartnerName: [
          { required: true, message: '请选择外协供应商', trigger: 'change' }
        ],
        // ordersNo: [{ required: true, message: '请选择外协订单', trigger: ['change'] }],
        // address: [{ required: true, message: '请选择收货地址', trigger: 'change' }],
        // phone: [{ required: true, message: '请输入电话', trigger: 'change' }, { validator: this.formValidate('iphone'), trigger: 'change' },],
        // deliverDate: [{ required: true, message: '请选择发货日期', trigger: ['change'] }],
        // delivery: [{ required: true, message: '请选择发货方式', trigger: 'change' }],
        // shipperId: [{ required: true, message: '请选择发货人', trigger: 'change' }],
        // recipient: [
        //   { required: true, message: '请输入收件人名称', trigger: 'change' },
        //   { validator: this.formValidate('fullName'), trigger: 'change' },
        // ],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }],
      },
      productRules: {
        purchaseQuantity: [{ required: true, trigger: ['blur'] },
        { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('外协数量(主)：' + errMsg) }] }), trigger: 'blur' },
        { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`外协数量(主)：${errMsg}`) }), trigger: 'blur' },
        // { validator: this.maxLength(), trigger: ['blur'] }
        ],
        purchaseQuantity2: [
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('外协数量(副)：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`外协数量(副)：${errMsg}`) }), trigger: 'blur' },
          // { validator: this.maxLength(), trigger: ['blur'] }
        ],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }],
        taxRate: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('税率：不能为0') }), trigger: 'blur' }
        ],
        price: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 6, "", (errMsg) => { this.$message.error('含税单价：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('含税单价：不能为0') }), trigger: 'blur' }
        ],
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      oldData: [],
      productArr: [],
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: "发起人",
        nodeType: 0,
        type: 'node',
        priorityLevel: "",
        approvalType: "appoint",
        selectMode: "",
        selectRange: "",
        directorLevel: "",
        examineMode: "",
        whenEmpty: "",
        examineEndDirectorLevel: "",
        ccSelfSelectFlag: "",
        conditionList: [],
        nodeUserList: [],
        childNode: null,
        conditionNodes: []
      },
      approvalForm: {},
      firstOneNode: [],
      // 审批 转审记录参数
      transferQuery: {
        approvalFormId: '',
        createByName: "",
        documentId: '',
        endTime: "",
        keyword: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
      transferData: [],
      formLoading: false,
      // 进度跟踪数据
      scheduleData: [],
      scheduleForm: {
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
        purchaseOrderId: '',
        startTime: "",
        startUpdateTime: ""
      },
      total: 0,
      background: true,//分页器背景颜色
      exportFormVisible: false,
      productionOrderNo:'',
    }
  },
  created() {
  },
  computed: {
    ...mapGetters(['userInfo']),
    computedValue() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach(item => {
        count += item.excludingTaxAmount * 1
      })
      this.dataForm.excludingTaxTotalAmount = this.jnpf.numberFormat(count)

      return this.dataForm.excludingTaxTotalAmount
    },
    computedValue2() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach(item => {
        count += item.taxAmount * 1
      })
      this.dataForm.taxAmount = this.jnpf.numberFormat(count)

      return this.dataForm.taxAmount
    },
    computedValue3() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach(item => {
        count += item.totalAmount * 1
      })
      this.dataForm.totalAmount = this.jnpf.numberFormat(count)

      return this.dataForm.totalAmount
    },

  },
  watch: {
    'dataFormTwo.data': {
      // immediate:true,
      handler: function (newVal, oldVal) { 
        newVal.forEach(item => {
          if (item.price != '' && item.taxRate != '') { 
            setTimeout(() => {
              item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1 / 100)))
            }, 1000); // 设置延迟时间，单位为毫秒 
          }
          if (item.purchaseQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.purchaseQuantity * item.excludingTaxPrice)
          }
          if ((item.price && item.purchaseQuantity) && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.purchaseQuantity - item.excludingTaxAmount)
          }
          if (item.excludingTaxAmount && item.taxAmount) {
            item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          }
          if (!item.deliveryDate) {
              item.deliveryDate = this.dataForm.deliveryDate ? this.dataForm.deliveryDate : ''
          }
        })
      },
      deep: true,
    },
    'dataForm.deliveryDate':{
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.dataFormTwo.data.length ? this.dataFormTwo.data.forEach(row => {
          if (!row.deliveryDate) {
              row.deliveryDate = newVal
            }
          }) : ''
        }
      },
      deep: true
    },
  },
  methods: {
    // 外协数量不能超过需外协数量
    maxLength() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：外协数量不能超过需外协数量`
        if (!value || value == 0) { callback() }
        else {
          if (value * 1 > this.dataFormTwo.data[index].needOutsoureQuantity) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg));
          } else {
            callback()
          }
        }
      };
    },

    checkSelectable(row) {
      return !row.disabled
    },
    //  外协数量主输入事件
    changePurchaseQuantity(index, val) {
      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') { 
        this.dataFormTwo.data[index].purchaseQuantity2 = this.jnpf.numberFormat(this.dataFormTwo.data[index].purchaseQuantity * this.dataFormTwo.data[index].ratio)
      } else {
        this.dataFormTwo.data[index].purchaseQuantity2 = this.jnpf.numberFormat(this.dataFormTwo.data[index].purchaseQuantity / this.dataFormTwo.data[index].ratio)
      }
    },
    // 外协副数量输入事件
    changePlanQuantity2(index, val) {
      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        this.dataFormTwo.data[index].purchaseQuantity = this.jnpf.numberFormat(this.dataFormTwo.data[index].purchaseQuantity2 / this.dataFormTwo.data[index].ratio)
      } else {
        this.dataFormTwo.data[index].purchaseQuantity = this.jnpf.numberFormat(this.dataFormTwo.data[index].purchaseQuantity2 * this.dataFormTwo.data[index].ratio)
      }
    },
    // 副数量输入事件
    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 选择工序弹窗前判断回调方法
    async beforeProcessSubmit(data, paramsObj) {
      let id = this.dataFormTwo.data.length ? this.dataFormTwo.data[0].processId : '' 

      let flag = true
      let confimFlag = true
      // let msg = id ? '选择的生产订单号与已选的生产订单号不一致!' : '请选择生产订单号一致的工单!'
      if (data) {
        if (id) {
          let list = data.map(item => item.all)
          for (let i = 0; i < list.length; i++) {
            if (list[i].processId !== id) {
              flag = false;

            }
          }
          if (!flag) {
            confimFlag = await this.$confirm(`选择的工序与已选的工序不一致`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // this.dataFormTwo.data = []
              return false
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
              return false
            })
          } else {
            confimFlag = true
          }
        } else {
          let list = data.map(item => item.all)
          for (let i = 0; i < list.length; i++) {
            if (list[i].processId !== list[0].processId) {
              flag = false;
            }
          }
          if (!flag) {
            confimFlag = await this.$confirm(`请选择相同的工序`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              return false
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
              return false
            })
          } else {
            confimFlag = true
          }
        }
      }
      return confimFlag
    },
    //工序弹窗回调方法
    addProcess(id, data) { 
      console.log(data);
      if (data.length) {
        // this.dataForm.productionOrderId = data[0].all.productionOrderId
        // this.productionOrderNo = data[0].all.productionOrderNo
        let selectArr = []
        let list = data.map(item => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productName: item.productName,
            productsId: item.productId,                 // 产品id
            productCode: item.productCode,
            drawingNo: item.productDrawingNo,
            routingName: item.routingName,
            routingCode: item.routingCode,
            routingId: item.routingId,
            purchaseQuantity: item.outsourcingQuantity,
            outsourcingQuantity: item.outsourcingQuantity,
            workOrderQuantity: item.workOrderQuantity,
            dispatchedQuantity: item.dispatchedQuantity,     // 需外协数量
            completedQuantity: item.completedQuantity,
            processName: item.processName,
            processCode: item.processCode,
            processId: item.processId,
            outShipmentList: [],
            ratio: item.ratio,                     // 转换系数
            calculationDirection: item.calculationDirection,  // 计算方向
            mainUnit: item.mainUnit,                   // 主单位
            deputyUnit: item.deputyUnit,               // 副单位
            deliveryDate: '',                          // 交期
            purchaseQuantity2: '',                    // 副数量 
            needOutsoureQuantity: item.workOrderQuantity - item.dispatchedQuantity,                  
            excludingTaxAmount: '',
            excludingTaxPrice: '',
            price: item.price ? item.price : 0,
            taxAmount: '',
            taxRate: '13',
            totalAmount: '',
            previousCode:item.previousCode,                                    // 上道工序的编码
            // productionOrderId: item.productionOrderId,     // 生产订单id
            // workOrderId: item.id,
            relatedWorkOrders:{
              productionOrderId: item.productionOrderId, 
              productionOrderNo: item.productionOrderNo, 
              workOrderId: item.id,
              purchaseOrderId:'',
              purchaseOrderLineId:'',
            },
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = [];
          selectArr = selectArr.filter(item1 => {
            const index = this.dataFormTwo.data.findIndex(item2 => item2.processId === item1.processId && item2.relatedWorkOrders.productionOrderId === item1.relatedWorkOrders.productionOrderId);
            if (index !== -1) {
              deletedArray.push(item1.processName);
              if (deletedArray.length) {
                this.$message.error(`已经添加过的工序：${deletedArray.join('、')}`)
              }
              return false;
            }
            return true;
          });
        }
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr,]
      } 
      this.dataFormTwo.data.forEach((item, index) => {
        if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
          this.dataFormTwo.data[index].purchaseQuantity2 = this.jnpf.numberFormat(this.dataFormTwo.data[index].purchaseQuantity * this.dataFormTwo.data[index].ratio)
        } else {
          this.dataFormTwo.data[index].purchaseQuantity2 = this.jnpf.numberFormat(this.dataFormTwo.data[index].purchaseQuantity / this.dataFormTwo.data[index].ratio)
        }
      }) 
      // 审批
      this.$nextTick(() => { this.getApproverData() })
    },
    // 选择工序
    openSeleceProcess() {
      this.$refs['ComSelect-page'].openDialog()
    },
    // 选中的产品信息
    handeleProductInfoData(val) {
      this.productArr = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.productArr.length === 0) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
      }
      for (let i = 0; i < this.productArr.length; i++) {
        const row = this.productArr[i];
        const index = this.dataFormTwo.data.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.productArr = []  // 清空选中的行的数据
    },
    changeshipperId(val, data) { 
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('shipperId')
      })
    },
    // 更换地址
    changeAddress() {
      this.addressVisibled = true
      if (!this.dataForm.cooperativePartnerId) {
        this.$message.error('请先选择外协供应商')
      } else {
        this.$nextTick(() => {
          this.$refs.addressRef.initData(this.dataForm.cooperativePartnerId)
        })
      }
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
    // 配置资源
    handlerOpenSource(index, type) {
      this.sourceVisibled = true
      this.sourceData = []
      this.index = index 
      this.sourceData = this.dataFormTwo.data[this.index].outShipmentList ? this.dataFormTwo.data[this.index].outShipmentList : []
      let previousCode = this.dataFormTwo.data[this.index].previousCode
      let purchaseQuantity = this.dataFormTwo.data[this.index].purchaseQuantity
      this.$nextTick(() => {
        this.$refs['sourceRef'].init(this.sourceData, this.type, this.dataFormTwo.data[this.index].relatedWorkOrders.productionOrderNo,previousCode,purchaseQuantity)
      })

    },

    // 切换供应商后给的提示
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (paramsObj.oldData.length) {
        flag = await this.$confirm('已选择过外协供应商，是否切换，切换后会清空外协供应商信息是否继续!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '更换成功!'
          });
          return true
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          return false
        })
      }
      return flag
    },
    // 供应商传递数据
    supplierdata(id, data) { 
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('cooperativePartnerName')
      })
      if (data.length === 0) {
      } else {
        // this.$refs['elForm'].clearValidate()
        // this.$refs['elForm'].resetFields('recipient')
        // this.$refs['elForm'].resetFields('phone')
        if (this.oldData.length) { 
          // 更换供应商编码 联动外协订单数据 以及产品明细
          // this.cooperativePartnerCode = this.oldData[0].code

        } else {
          this.oldData.push(data)
        }
        this.$refs['elForm'].fields[0].resetField()
        this.dataForm.cooperativePartnerName = data[0].name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].id

      }
      getCooperativeInfo(data[0].id).then(res => { 
        let addressInfo = {}
        if (res.data.deliveryAddressList.length > 0) {
          res.data.deliveryAddressList.forEach((item, index) => {
            if (item.defaultFlag) {
              addressInfo = item 
              this.dataForm.recipient = addressInfo.recipient
              this.dataForm.phone = addressInfo.phone
              this.dataForm.country = addressInfo.country === '中国' ? 'CN' : addressInfo.country
              if (this.dataForm.country === 'CN') {

                this.dataForm.province = addressInfo.province
                this.dataForm.city = addressInfo.city
                this.dataForm.area = addressInfo.area
                this.dataForm.address = addressInfo.address
                this.defaultAddress = addressInfo.countryText + addressInfo.provinceText + addressInfo.cityText + addressInfo.areaText + addressInfo.address
              } else {
                this.dataForm.province = ''
                this.dataForm.city = ''
                this.dataForm.area = ''
                this.defaultAddress = (addressInfo.countryText ? addressInfo.countryText : '') + addressInfo.address
              }
            } else {
              this.dataForm.recipient = res.data.deliveryAddressList[0].recipient
              this.dataForm.phone = res.data.deliveryAddressList[0].phone
              this.dataForm.country = res.data.deliveryAddressList[0].country === '中国' ? 'CN' : res.data.deliveryAddressList[0].country
              if (this.dataForm.country === 'CN') {

                this.dataForm.province = res.data.deliveryAddressList[0].province
                this.dataForm.city = res.data.deliveryAddressList[0].city
                this.dataForm.area = res.data.deliveryAddressList[0].area
                this.dataForm.address = res.data.deliveryAddressList[0].address
                this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].provinceText + res.data.deliveryAddressList[0].cityText + res.data.deliveryAddressList[0].areaText + res.data.deliveryAddressList[0].address
              } else {
                this.dataForm.province = ''
                this.dataForm.city = ''
                this.dataForm.area = ''
                this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].address
              }
            }
          });
        } else {
          this.dataForm.recipient = ""
          this.dataForm.phone = ""
          this.dataForm.country = ""
          this.dataForm.province = ""
          this.dataForm.city = ""
          this.dataForm.area = ""
          this.dataForm.address = ""
          this.defaultAddress = ""
        }
      })
    },

    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) { 
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else if (this.type == 'add' && this.dataForm.id) {
          this.loading = true
          purPurchaseOrderdetail(this.dataForm.id).then(res => { 
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
            this.dataForm = {
              id: res.data.id,
              cooperativePartnerName: res.data.cooperativePartnerName,      //供应商名称
              cooperativePartnerId: res.data.cooperativePartnerId,
              cooperativePartnerCode: res.data.cooperativePartnerCode,
              deliveryDate: res.data.deliveryDate,                //交货日期.
              orderType: res.data.orderType,
              orderNo: res.data.orderNo,
              recipient: res.data.recipient,                   // 收件人
              phone: res.data.phone,                   // 收件人电话
              delivery: res.data.delivery,             // 发货方式
              shipperIdText: res.data.shipperIdText,
              shipperId: res.data.shipperId,
              address: res.data.address,
              country: res.data.country,
              province: res.data.province,
              city: res.data.city,
              area: res.data.area,
              productionOrderId: res.data.productionOrderId,
              approvalCompletionDate: res.data.approvalCompletionDate,
              approvalStatus: res.data.approvalStatus,
              // purchaseOrderId: res.data.id,
              receivingStatus:res.data.receivingStatus
            }
            this.dataForm.approvalStatus = 'ing'
            this.dataForm.submitDate = ''
            this.dataForm.approvalCompletionDate = ''
            this.dataForm.id = ''
            this.dataForm.receivingStatus = ''
            if (res.data.country === 'CN') {
              this.defaultAddress = res.data.region.countryName + res.data.region.provinceName + res.data.region.cityName + res.data.region.areaName + res.data.address
            } else {
              this.defaultAddress = res.data.region.countryName + res.data.address
            }
            if (this.dataForm.delivery === 'self_pickup') {
              this.dataForm.deliverys = '自提'
            }
            if (this.dataForm.delivery === 'deliver_goods') {
              this.dataForm.deliverys = '送货'
            }
            if (this.dataForm.delivery === 'express_delivery') {
              this.dataForm.deliverys = '快递'
            }
            if (this.dataForm.delivery === 'freight_transport') {
              this.dataForm.deliverys = '货运'
            }
            if (this.dataForm.delivery === 'collect_payment') {
              this.dataForm.deliverys = '到付'
            }
            this.dataFormTwo.data = res.data.purchaseOrderLineVOList

            this.dataFormTwo.data.forEach((item, index) => {
              item.id = ''
              item.purchaseOrderId = ''
              this.$set(this.dataFormTwo.data[index], 'needOutsoureQuantity', (item.workOrderQuantity * 1 - item.dispatchedQuantity * 1))
              if (item.outShipmentVOList.length) {
                item.outShipmentList = item.outShipmentVOList
              } else {
                item.outShipmentList = []
              }
            })
            // 审批
            this.getApproverData() 
          })
        } else {
          this.loading = true
          purPurchaseOrderdetail(this.dataForm.id).then(res => { 
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
            this.dataForm = {
              id: res.data.id,
              cooperativePartnerName: res.data.cooperativePartnerName,      //供应商名称
              cooperativePartnerId: res.data.cooperativePartnerId,
              cooperativePartnerCode: res.data.cooperativePartnerCode,
              deliveryDate: res.data.deliveryDate,                //交货日期.
              orderType: res.data.orderType,
              orderNo: res.data.orderNo,
              recipient: res.data.recipient,                   // 收件人
              phone: res.data.phone,                   // 收件人电话
              delivery: res.data.delivery,             // 发货方式
              shipperIdText: res.data.shipperIdText,
              shipperId: res.data.shipperId,
              address: res.data.address,
              country: res.data.country,
              province: res.data.province,
              city: res.data.city,
              area: res.data.area,
              productionOrderId: res.data.productionOrderId,
              approvalCompletionDate: res.data.approvalCompletionDate,
              approvalStatus: res.data.approvalStatus,
              // purchaseOrderId: res.data.id,
              receivingStatus:res.data.receivingStatus,
              approvalFlag:res.data.approvalFlag,
            }
            if (res.data.country === 'CN') {
              this.defaultAddress = res.data.region.countryName + res.data.region.provinceName + res.data.region.cityName + res.data.region.areaName + res.data.address
            } else {
              this.defaultAddress = res.data.region.countryName + res.data.address
            }
            if (this.dataForm.delivery === 'self_pickup') {
              this.dataForm.deliverys = '自提'
            }
            if (this.dataForm.delivery === 'deliver_goods') {
              this.dataForm.deliverys = '送货'
            }
            if (this.dataForm.delivery === 'express_delivery') {
              this.dataForm.deliverys = '快递'
            }
            if (this.dataForm.delivery === 'freight_transport') {
              this.dataForm.deliverys = '货运'
            }
            if (this.dataForm.delivery === 'collect_payment') {
              this.dataForm.deliverys = '到付'
            }
            this.dataFormTwo.data = res.data.purchaseOrderLineVOList

            this.dataFormTwo.data.forEach((item, index) => {
              this.$set(this.dataFormTwo.data[index], 'needOutsoureQuantity', (item.workOrderQuantity * 1 - item.dispatchedQuantity * 1))
              if (item.outShipmentVOList.length) {
                item.outShipmentList = item.outShipmentVOList
              } else {
                item.outShipmentList = []
              }
            }) 
          })
          getSaleBusDetail(this.dataForm.id).then(res => { 
            if (res.data) {
              this.firstOneNode = []
              this.approvalForm = res.data.form
              this.transferQuery.approvalFormId = this.approvalForm.id
              this.firstOneNode.push({
                name: res.data.form.createByName
              })
              let data = res.data.formNodeTree.childNode
              if (data) {
                this.addNodeTypeAndNodeName(data)

                this.busNodeConfig.childNode = data
                this.workVisible = true
                // this.$nextTick(() => {
                //   this.$refs.workflowRef.initData('busing', this.btnType)
                // })
              }
              if (this.type == 'look') { 
                this.transferQuery.documentId = this.dataForm.id
                approvalTransferList(this.transferQuery).then(res => { 
                  this.transferData = res.data.records
                  this.formLoading = false
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
          if (this.type == 'look') {
            // 进度跟踪
            this.initData()
          }
        }
      })

    },
    // 表单提交
    dataFormSubmit(type) {
      this.request(type)
    },

    async request(type) {
      this.btnLoading = true
      let focusFlag = true // 自动聚焦是否可用
      this.dataForm.documentStatus = type
      this.dataForm.purchaseOrderLines = this.dataFormTwo.data
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)

      if (!this.dataFormTwo.data.length) {
        this.btnLoading = false
        this.$message({ type: 'error', message: '请至少选择一条工序', duration: 1500, })
      }
      if (!valid_2 && focusFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            focusFlag = false 
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }
      // 审批条件参数列表
      let nodeCondList = []
      // 审批抄送人列表
      let ccList = []
      let ccLists = []
      let nodeJudg = []
      // 业务审批单流程节点列表
      let formNodeList = []
      // 业务审批单
      let form = {}
      let templateLineList = []
      if (this.type == 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map(item=>{
            return {
              ...item,
              nodeUserList:item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')

          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }

          if (templateLineList.length && type === 'submit') {
            focusFlag = templateLineList.every(item=>item.nodeUserList.length)
            if (!focusFlag) { 
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && type === 'submit') {
            focusFlag = ccList.every(item=>item.nodeUserList.length)
            if (!focusFlag) { 
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          } 
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: item.name == '审核人' ? 'no' : '',
              adminId: '',
              id: '',
              previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
              ccToId: item.targetId,
              approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
              id: '',
              defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1,
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: type,
            documentId: '',
            id: '',
            approvalFormStatus:'ing'
          }
        }

      }
      if (this.type === 'edit' || this.type === 'look') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map(item=>{
            return {
              ...item,
              nodeUserList:item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }
          if (templateLineList.length && type === 'submit') {
            focusFlag = templateLineList.every(item=>item.nodeUserList.length)
            if (!focusFlag) { 
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && type === 'submit') {
            focusFlag = ccList.every(item=>item.nodeUserList.length)
            if (!focusFlag) { 
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          } 
          // return
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              // previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              // name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalFormId: item.approvalFormId ? item.approvalFormId : this.approvalForm.id,
              approvalFormNodeCode: item.approvalFormNodeCode ? item.approvalFormNodeCode : item.code,
              ccToId: item.targetId,
              id: item.id ? item.id : ''
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: type,
            approvalFormStatus:'ing'
          }
        }
      }
      if (type === 'submit' && this.dataForm.approvalFlag) {
        if (!this.busNodeConfig.childNode) {
          focusFlag = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach(item => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                focusFlag = false
                this.btnLoading = false
                this.$message.error('未配置发起人自选！')
              }
            }
          })
        }
      }

      let count = 0
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (!focusFlag) { 
            this.btnLoading = false
            for (let i = 0; i < this.dataFormTwo.data.length; i++) {
              const item = this.dataFormTwo.data[i]
              if (!item.price) {
                this.$message({
                  type: 'error',
                  message: '请输入第' + (i + 1) + '行的含税单价',
                  duration: 1500,
                })
                break
              }
              if (!item.taxRate) {
                this.$message({
                  type: 'error',
                  message: '请输入第' + (i + 1) + '行的税率',
                  duration: 1500,
                })
                break
              }
              if (!item.deliveryDate) {
                this.$message({
                  type: 'error',
                  message: '请选择第' + (i + 1) + '行的交货日期',
                  duration: 1500,
                })
                break
              }
              if (item.outShipmentList.length > 0) {
                count++
              }
              if (!count) {
                this.$message({
                  type: 'error',
                  message: '请至少配置一道工序的发料清单',
                  duration: 1500,
                })
                break
              }
            }
            return
          } else {
            for (let i = 0; i < this.dataFormTwo.data.length; i++) {
              const item = this.dataFormTwo.data[i]
              if (item.outShipmentList.length > 0) {
                count++
              }
              if (!count) {
                this.btnLoading = false
                this.$message({
                  type: 'error',
                  message: '请至少配置一道工序的发料清单',
                  duration: 1500,
                })
                break
              }
            } 
            if (count && focusFlag) {
              this.btnLoading = true 
              // return
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
              this.dataForm.attachmentList = this.datafilelist
              let _dataForm = {
                ...this.dataForm,
                form: form,
                formNodeList,
                nodeCondList: nodeJudg,
                ccList: ccLists,
              }
              let method = this.type !== 'add' ? editProcessOrder : insertOutProcessOrder
              method(_dataForm).then(res => {
                let msg = res.msg
                if (res.msg === 'Success') { msg = type == "submit" ? "提交成功" : "保存成功" }
                this.$message({
                  message: msg,
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.btnLoading = false
                    this.$emit('close', true)
                  }
                })
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              this.btnLoading = false
            }
          }

        } else {
          this.btnLoading = false
        }

      })

    },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
      if (this.dataFormTwo.data.length === 0) {
        this.dataForm.productionOrderId = ''
      }
    },
    sourceConfirm(data) {
      this.dataFormTwo.data[this.index].outShipmentList = data 
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) { 
      if (obj) {
        if (obj.name === "审核人") {
          obj.nodeType = 1;
          obj.nodeName = obj.name;
          obj.directorLevel = obj.approvalType == "manager" ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == "multilevel" ? obj.levelSupervisor : ''
        }
        if (obj.name === "路由") {
          obj.nodeType = 4;
        }
        if (obj.name === "抄送人") {
          obj.nodeType = 2;
          obj.nodeName = obj.name;
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode);
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map(item => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(','); // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',');
                  var resultArr = [];
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      };
                      resultArr.push(option);
                    }
                  }
                }
                return {
                  ...item,
                  columnDbname: item.name,
                  columnType: item.dataType,
                  showName: item.name,
                  tjCode: item.code,
                  zdy1: item.comparisonValue,
                  columnId: item.approvalBusinessId,
                  options: resultArr,
                  optType: item.dataType == 'number' ? (item.operationalFormula == 'lt' ? '1' : item.operationalFormula == 'gt' ? '2' : item.operationalFormula == 'eq' ? '4' : item.operationalFormula == 'ge' ? '5' : item.operationalFormula == 'le' ? '3' : '') : ''

                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode);
            }
          }
        }
      }
    },
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) { 
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null });
        if (node.type === 'node') {

          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {

              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code);
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
        }
      }
      return flattenedNodes;
    },
    // // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = ''  // 条件符号
      let result = null     // 判断条件是否成立
      let condList = []
      getBusDetail('b011').then(res => { 
        state = res.data.business.state
        condExpress = res.data.business.condExpress
        // if (res.data.businessConditionList.length) {
        //   res.data.businessConditionList.forEach(item => {
        //     condList.push({
        //       code: item.code,
        //       val: item.code === 'numCode' ? this.totalNum : this.totalPrice
        //     })
        //   })
        // }
        if (state === 'condition') {
          this.dataForm.approvalFlag = 1
          for (var i = 0; i < condArr.length; i++) {
            if (condExpress.includes(condArr[i])) {
              foundSymbol = condArr[i];
              break;
            }
          }
          // 找到符号并进行销售报价业务判断
          if (foundSymbol) {
            const parts = condExpress.split(foundSymbol); // 使用 ">" 符号拆分字符串
            const leftValue = parts[0]; // 提取 ">" 符号左边的值
            const rightValue = parts[1]; // 提取 ">" 符号右边的值
   
            // if (leftValue == 'numCode') {
            //   const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // } else {
            //   const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // }
            if (result) {
              let query = {
                businessCode: "b011",
                condList,
              }
              busApprovalFlowTree(query).then(res => { 
                if (res.data) {
                  this.firstOneNode = []
                  this.approvalForm = res.data.template
                  this.firstOneNode.push({
                    name: this.userInfo.userName
                  })
                  let data = res.data.tempLineTree.childNode
                  if (data) {
                    this.addNodeTypeAndNodeName(data)
                    this.busNodeConfig.childNode = data
                    this.workVisible = true
                    this.$nextTick(() => {
                      this.$refs.workflowRef.initData('busing', this.type)
                    })
                  }
                } else {
                  this.busNodeConfig.childNode = null
                }
              })
            } else {
              this.busNodeConfig.childNode = null
            }
          }
        }
        if (state === 'enable') {
          this.dataForm.approvalFlag = 1
          let query = {
            businessCode: "b011",
            condList,
          }
          busApprovalFlowTree(query).then(res => { 
            if (res.data) {
              this.firstOneNode = []
              this.approvalForm = res.data.template
              this.firstOneNode.push({
                name: this.userInfo.userName
              })
              let data = res.data.tempLineTree.childNode
              if (data) {
                this.addNodeTypeAndNodeName(data)
                this.busNodeConfig.childNode = data
                this.workVisible = true
                this.$nextTick(() => {
                  this.$refs.workflowRef.initData('busing', this.type)
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
        }
        if (state === 'disabled') {
          this.dataForm.approvalFlag = 0
          this.busNodeConfig.childNode = null
        }
      })

    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.scheduleRef.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) { 
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.scheduleForm,
          exportType: '1104',
          exportName: '外协工序订单进度跟踪',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.scheduleForm.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    searchDetail() {
      this.scheduleForm.pageNum = 1
      this.initData()
    },
    initData() {
      Object.keys(this.scheduleForm).forEach(key => {
        let item = this.scheduleForm[key]
        this.scheduleForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.formLoading = true
      this.scheduleForm.purchaseOrderId = this.dataForm.id 
      orderSchedule(this.scheduleForm).then(res => { 
        this.scheduleData = res.data.records
        this.total = res.data.total
        this.formLoading = false
      })
    },
    resetDetail(){
      this.$refs['scheduleRef'].$refs.JNPFTable.clearSort()
      this.scheduleForm = {
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
        purchaseOrderId: this.dataForm.id,
        startTime: "",
        startUpdateTime: ""
      }
      this.searchDetail()
    },
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

::v-deep .el-date-table .today span {
  font-weight: 700;
  color: #C0C4CC !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.topButton {
  margin-right: 8px;
  margin-left: 8px;
  font-size: 14px !important;
}

::v-deep .workNode {
  background-color: #f5f5f7 !important;
}

.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}

/* 进度跟踪样式 */
::v-deep #pane-schedule {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}

::v-deep .el-tabs {
  height: 100%!important;
}
::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow:auto!important;
  padding: 0 20px;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
::v-deep .el-progress-bar{
  padding-right:65px!important;
}
::v-deep .el-progress__text{
  margin-left:-7px!important;
}
</style>