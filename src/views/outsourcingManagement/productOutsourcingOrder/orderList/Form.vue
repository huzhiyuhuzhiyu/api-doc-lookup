<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <el-page-header @back="goBack" :content="title" />
          <!-- <el-page-header @back="goBack" :content="type === 'look' ? '查看外协订单' : '新建外协订单'" /> -->
          <div class="options" v-if="type !== 'look'">
            <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
              保存草稿
            </el-button>
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>

        <div class="main">
          <el-tabs v-model="activeName" v-if="!approvalFlag">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :span="6" v-if="type === 'look'">
                        <el-form-item label="外协单号" prop="orderNo" ref="orderNo">
                          <el-input :disabled="type == 'look'" type="text" v-model="dataForm.orderNo"
                            placeholder="外协单号"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <!-- <el-input :disabled="type == 'look'" v-model="dataForm.cooperativePartnerName"
                            placeholder="请选择供应商名称" @focus="openDialog"></el-input> -->
                          <!-- 供应商选择弹窗  -->
                          <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                            v-model="dataForm.cooperativePartnerName" :beforeSubmit="beforeSubmit" ref="ComSelect-page"
                            @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'"
                            title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                            :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                            :paramsObj="{ oldData }" :searchList="PartnerTableSearchList" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="交货日期" prop="deliveryDate">
                          <el-date-picker :disabled="type == 'look'" v-model="dataForm.deliveryDate" type="date"
                            value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="dataPickerOptions2"
                            placeholder="请选择交货日期"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" v-if="type === 'look'">
                        <el-form-item label="订单状态" prop="receivingStatus" ref="receivingStatus">
                          <el-select v-model="dataForm.receivingStatus" style="width: 100%;" placeholder="请选择"
                            :disabled="type !== 'add' ? true : false">
                            <el-option v-for="item in receivingStatusOptions" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">
                  <div v-if="type !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openSeleceProductDialog()">
                      选择产品
                    </el-button>
                    |
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                      批量删除
                    </el-button>
                    |
                  </div>
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                    <el-table style="border: 1px solid #e3e7ee;" :fixedNO="true"
                      @selection-change="handeleProductInfoData" v-bind="dataFormTwo.data" :data="dataFormTwo.data"
                      id="table" border height="460" @row-click="openDetails" :row-style="rowStyle">
                      <el-table-column type="selection" width="55" fixed="left" :key="2"></el-table-column>
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                      <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'">
                              <div class="viewData">
                                <span>{{ scope.row.productDrawingNo }}</span>
                              </div>
                            </el-form-item>
                          </template> -->
                        <template slot="header">
                          <span class="required">*</span>
                          品名规格
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'"
                            :rules="productRules.productDrawingNo">
                            <el-input v-model="scope.row.productDrawingNo" placeholder="请输入品名规格"
                              :disabled="type === 'look'" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip>
                        <template slot="header">
                          <span class="required">*</span>
                          产品名称
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'"
                            :rules="productRules.productName">
                            <el-input v-model="scope.row.productName" placeholder="请输入产品名称" />
                          </el-form-item>
                        </template>
                      </el-table-column> -->

                      <el-table-column prop="deliveryDate" label="交货日期" min-width="200">
                        <template slot="header">
                          <span class="required">*</span>
                          交货日期
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                            :rules="productRules.deliveryDate">
                            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" placeholder="请选择交货日期" :disabled="type === 'look'"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位" min-width="60" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="purchaseQuantity" label="数量" min-width="100">
                        <template slot="header">
                          <span class="required">*</span>
                          数量
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                            :rules="productRules.purchaseQuantity">
                            <el-input v-model="scope.row.purchaseQuantity"
                              @input="changePurchaseQuantity(scope.$index, scope.row.purchaseQuantity)" maxlength="20"
                              placeholder="请输入数量" :disabled="type === 'look'"></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="price" label="含税单价" min-width="180">
                        <template slot="header">
                          <span class="required">*</span>
                          含税单价
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                            <el-input v-model="scope.row.price" placeholder="请输入含税单价" :disabled="type === 'look'" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="totalAmount" label="金额" min-width="140">
                        <template slot="header">
                          <span class="required">*</span>
                          金额(含税)
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                            <div class="viewData">
                              <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taxRate" label="税率" min-width="140">
                        <template slot="header">
                          <span class="required">*</span>
                          税率
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :rules="productRules.taxRate">
                            <!-- <el-input oninput="value = value.replace(/\D/g,'')" maxlength="2"
                                v-model="scope.row.taxRate" placeholder="请输入税率"></el-input> -->
                            <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;"
                              :disabled="type === 'look'">
                              <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                                :value="item.taxRate"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="excludingTaxPrice" label="不含税单价" min-width="150">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                            <div class="viewData">
                              <span>{{ scope.row.excludingTaxPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <!-- <el-table-column prop="excludingTaxAmount" label="总金额" min-width="160">
                      <template slot="header">
                        <span class="required">*</span>总金额
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                          <div class="viewData">
                            <span>{{ scope.row.excludingTaxAmount }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column> -->

                      <el-table-column prop="taxAmount" label="税额" min-width="100">
                        <template slot="header">
                          <span class="required">*</span>
                          税额
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                            <!-- <el-input v-model="scope.row.taxAmount" maxlength="20" placeholder="请输入税额">
                          </el-input> -->
                            <div class="viewData">
                              <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="excludingTaxAmount" label="金额(不含税)" min-width="180">
                        <template slot="header">
                          <span class="required">*</span>
                          金额(不含税)
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxAmount'">
                            <!-- <el-input v-model="scope.row.excludingTaxAmount" maxlength="20"
                                placeholder="请输入金额(不含税)"></el-input> -->
                            <div class="viewData">
                              <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="20"
                            placeholder="请输入备注" :disabled="type === 'look'">
                            {{ scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>

                      <!-- <el-table-column label="操作" width="180" fixed="right" v-if="dataFormTwo.data.length > 1">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column> -->

                      <el-table-column label="操作" width="180" fixed="right" v-if="type !== 'look'">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" :disabled="sourceDisabled"
                            @click="handlerOpenSource(scope.$index, 'source')">
                            查看发料清单
                          </el-button>
                          <el-button size="mini" type="text" class="JNPF-table-delBtn"
                            v-if="dataFormTwo.data.length > 1" @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>
                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin-right:10px">总数量：{{ computedValue2 }}</span>
                    <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ computedValue3 }}</span>
                    <!-- <span style="font-weight:500;margin-right:10px">总金额(不含税)：{{ computedValue }}</span> -->
                  </div>
                </el-collapse-item>
                <el-collapse-item title="发料清单信息" name="materialInfo" v-if="type == 'look'">
                  <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="linesList" :data="linesList"
                    id="table">
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="160"></el-table-column>
                    <el-table-column prop="productCode" label="产品编码" min-width="140"></el-table-column>
                    <el-table-column prop="processName" label="工序名称" min-width="140"></el-table-column>
                    <el-table-column prop="mainUnit" label="单位" min-width="140"></el-table-column>
                    <el-table-column prop="purchaseQuantity" label="基本数量" min-width="140"></el-table-column>
                    <el-table-column prop="demandQuantity" label="发料数量" min-width="140"></el-table-column>
                    <el-table-column prop="undeliveredQuantity" label="待出库数量" min-width="140"></el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>

            <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
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
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :span="6" v-if="type === 'look'">
                    <el-form-item label="外协单号" prop="orderNo" ref="orderNo">
                      <el-input :disabled="type == 'look'" type="text" v-model="dataForm.orderNo"
                        placeholder="外协单号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                      <el-input :disabled="type == 'look'" v-model="dataForm.cooperativePartnerName"
                        placeholder="请选择供应商名称" @focus="openDialog"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="交货日期" prop="deliveryDate">
                      <el-date-picker :disabled="type == 'look'" v-model="dataForm.deliveryDate" type="date"
                        value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="dataPickerOptions2"
                        placeholder="请选择交货日期"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="type === 'look'">
                    <el-form-item label="订单状态" prop="receivingStatus" ref="receivingStatus">
                      <el-select v-model="value" placeholder="请选择" :disabled="type !== 'add' ? true : false">
                        <el-option v-for="item in receivingStatusOptions" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </el-collapse-item>

            <el-collapse-item title="产品信息" name="productInfo">
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table">
                  <!-- <el-table-column type="selection" width="60" fixed="left" align="center" /> -->
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                  <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                        <div class="viewData">
                          <span>{{ scope.row.drawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                        <div class="viewData">
                          <span>{{ scope.row.productCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="planDemandQuantity" label="计划需求数量" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'planDemandQuantity'">
                        <div class="viewData">
                          <span>{{ scope.row.planDemandQuantity ? scope.row.planDemandQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="purchaseQuantity" label="订单数量" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'purchaseQuantity'"
                        :rules="productRules.purchaseQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.purchaseQuantity ? scope.row.purchaseQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="receiptQuantity" label="已入库数量" min-width="160">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'receiptQuantity'"
                        :rules="productRules.receiptQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.receiptQuantity ? scope.row.receiptQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="price" label="含税单价" min-width="120">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">
                        <div class="viewData">
                          <span>{{ scope.row.price ? scope.row.price : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="taxRate" label="税率" min-width="100">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                        <div class="viewData">
                          <span>{{ scope.row.taxRate }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="taxAmount" label="税额" min-width="120">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="totalAmount" label="价税合计" min-width="140">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'totalAmount'">
                        <div class="viewData">
                          <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="deliveryDate" label="交货日期" min-width="240">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'">
                        <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                          style="width: 100%;" disabled :picker-options="dataPickerOptions"
                          placeholder="请选择交货日期"></el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="receivingStatus" label="订单状态" width="130">
                    <template slot-scope="scope">
                      <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag></div>
                      <div v-if="scope.row.receivingStatus == 'received'">
                        <el-tag type="success">已完成</el-tag>
                      </div>
                      <div v-if="scope.row.receivingStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="220">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" disabled maxlength="20"
                        :placeholder="type == 'look' ? '' : '请输入备注'">
                        {{ scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>

                  <!-- <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            @click="delequipment_process_relList(scope.$index)">删除</el-button>

                        </template>
                      </el-table-column> -->
                </el-table>
              </el-form>

              <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin-right:10px">总金额：{{ dataForm.excludingTaxTotalAmount }}</span>
                <span style="font-weight:500;margin-right:10px">总税额：{{ dataForm.taxAmount }}</span>
                <span style="font-weight:500;margin-right:10px">价税合计：{{ dataForm.totalAmount }}</span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="发料清单信息" name="materialInfo" v-if="type == 'look'">
              <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="linesList" :data="linesList"
                id="table">
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="160"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="140"></el-table-column>
                <el-table-column prop="processName" label="工序名称" min-width="140"></el-table-column>
                <el-table-column prop="mainUnit" label="单位" min-width="140"></el-table-column>
                <el-table-column prop="purchaseQuantity" label="基本数量" min-width="140"></el-table-column>
                <el-table-column prop="demandQuantity" label="发料数量" min-width="140"></el-table-column>
                <el-table-column prop="undeliveredQuantity" label="待出库数量" min-width="140"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </transition>
    <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
      :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
      :searchList="ProductTableSearchList" :elementShow="false" multiple />
    <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area>
  </div>
</template>
<script>
import { editOutOrder, purPurchaseOrderdetail, orderSchedule } from '@/api/purchasingAndOutsourcingOrders/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow'
import recordList from '@/views/workFlow/components/RecordList.vue'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeData, getBimBusinessDetail } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { getbimProductAttributes } from '@/api/masterDataManagement/index'
import {
  getShipmentList,
  getpurProcurementRequireDetail,
  editpurProcurementRequire,
  purProcurementRequirementsList
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import SourceArea from '../orderCreation/source.vue'
export default {
  components: { Process, recordList, SourceArea },
  mixins: [busFlow],
  data() {
    return {
      isattachmentswitch: '',
      //  供应商 树请求
      getCooperativeData,
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

      sourceVisibled: false,
      getcategoryTree,
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: '产品分类', classAttribute: '', method: getcategoryTree, requestObj: { classAttribute: '' } }
        // { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: '',
        classAttributeList: ['raw_material', 'semi_finished', 'finish_product', 'accessories'],
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
        { prop: 'drawingNo', label: '品名规格', sortable: 'custom' },
        // { prop: 'name', label: '产品名称', sortable: 'custom' },
        { prop: 'code', label: '产品编码', sortable: 'custom' },
        { prop: 'productCategoryName', label: '产品分类', sortable: 'custom' },
        { prop: 'mainUnit', label: '单位' },
        { prop: 'createTime', label: '创建日期', sortable: 'custom' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
        // { prop: 'name', label: '产品名称', type: 'input' },
        { prop: 'productCode', label: '产品编码', type: 'input' }
      ], // 产品选择弹出框搜索条件
      title: '',
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo', 'materialInfo'],
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },

      dataForm: {
        cooperativePartnerName: '', //供应商名称
        deliveryDate: '', //交货日期.
        orderNo: '',
        orderType: 'external',
        purchaseOrderLines: [],
        excludingTaxTotalAmount: '', //订单 不含税总金额
        totalAmount: '', //   含税总金额
        taxAmount: '', // 税额
        approvalFlag: false
      },
      receivingStatusOptions: [
        {
          value: 'not_finished',
          label: '未完成'
        },
        {
          value: 'finished',
          label: '已完成'
        },
        {
          value: 'stopped',
          label: '已停止'
        }
      ],
      dataPickerOptions: {
        // 日期区间选择器通用选项
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      dataPickerOptions2: {
        // 日期区间选择器通用选项
        disabledDate: this.disabledDate
      },
      type: '',
      dataFormArr: [],
      rules: {},
      productRules: {},
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      demandDelivery: '',

      linesList: [],
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0
    }
  },
  computed: {
    computedValue() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.excludingTaxAmount * 1
      })
      this.dataForm.excludingTaxTotalAmount = this.jnpf.numberFormat(count)

      return this.dataForm.excludingTaxTotalAmount
    },
    computedValue3() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.totalAmount * 1
      })
      this.dataForm.totalAmount = this.jnpf.numberFormat(count)

      return this.dataForm.totalAmount
    },
    computedValue2() {
      // 在这里计算第三个输入框的值
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.purchaseQuantity * 1
      })
      this.dataForm.purchaseQuantity = this.jnpf.numberFormat(count)

      return this.dataForm.purchaseQuantity
    }
  },
  created() {
    this.getBimBusinessDetail()
  },
  watch: {
    'dataFormTwo.data': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          if (item.price && item.taxRate) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1) / 100))
          }
          if (item.purchaseQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.purchaseQuantity * item.excludingTaxPrice)
          }
          if (item.price && item.purchaseQuantity && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.purchaseQuantity - item.excludingTaxAmount)
          }
          if (item.excludingTaxAmount && item.taxAmount) {
            item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          }
          // if (!item.price) {
          //   this.$message.error('未找到供应商单价')
          // }
        })
      },
      deep: true
    }
  },
  methods: {
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_wxdd'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
      })
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
      console.log(paramsObj, 'o')
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
      console.log(data, 'd')
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('cooperativePartnerName')
      })
      if (data.length === 0) {
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.cooperativePartnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
        console.log(this.dataForm, 'fo')
        let productIdList = []
        this.dataFormTwo.data.forEach((item) => {
          productIdList.push(item.productsId)
        })
      }
    },
    // 产品弹窗
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
      // this.productVisibled = true
      // this.$nextTick(() => {
      //   this.$refs.productRef.initData2()
      // })
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.productArr.length === 0) {
        this.$message({
          message: '请选择你要删除的数据',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.productArr.length; i++) {
        const row = this.productArr[i]
        const index = this.dataFormTwo.data.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.productArr = [] // 清空选中的行的数据
    },
    // 选中的产品信息
    handeleProductInfoData(val) {
      this.productArr = val
    },
    // 产品组件回调
    addth(id, data) {
      this.getProductClassFun()
      if (data.length) {
        let selectArr = []
        let list = data.map((item) => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            productSource: item.productSource, // 产品来源 采购
            classAttribute: item.classAttribute,
            productsId: item.id, // 产品id
            productName: item.name, // 产品名称
            productCode: item.code, // 产品编码
            productDrawingNo: item.drawingNo, // 品名规格
            ratio: item.ratio, // 转换系数
            calculationDirection: item.calculationDirection, // 计算方向
            mainUnit: item.mainUnit, // 主单位
            purchaseQuantity: item.purchaseQuantity, // 数量
            price: item.price, // 含税单价
            totalAmount: item.totalAmount, // 金额(含税)
            taxRate: 13, // 税率
            excludingTaxPrice: item.excludingTaxPrice, // 不含税单价
            taxAmount: item.taxAmount, // 税额
            excludingTaxAmount: item.excludingTaxAmount, // 金额(不含税)
            deputyUnit: item.deputyUnit, // 副单位
            planQuantity: '', //计划数量主
            planQuantity2: '', //计划数量副
            remark: item.remark,
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
    // 配置资源
    handlerOpenSource(index, type) {
      if (!this.dataFormTwo.data[index].purchaseQuantity) return this.$message.error('请先输入数量')

      this.sourceVisibled = true
      this.index = index

      let obj = {
        productsId: this.dataFormTwo.data[index].productsId,
        purchaseQuantity: this.dataFormTwo.data[index].purchaseQuantity
      }
      // 通过需求池id 获取明细的数据
      getShipmentList(obj).then((res) => {
        this.sourceData = res.data
        if (this.dataFormTwo.data[this.index].outShipmentList) {
          this.dataFormTwo.data[this.index].outShipmentList.forEach((item, ind) => {
            this.sourceData[ind].demandQuantity1 = item.demandQuantity1
            // this.sourceData[ind].demandQuantity1 = item.demandQuantity-item.issuedQuantity-item.undeliveredQuantity
          })
        } else {
          this.sourceData.forEach((item, index) => {
            this.$set(
              this.sourceData[index],
              'demandQuantity1',
              item.demandQuantity - item.issuedQuantity - item.undeliveredQuantity < 0
                ? 0
                : item.demandQuantity - item.issuedQuantity - item.undeliveredQuantity
            )
          })
        }

        // if (this.sourceData.length === 0) {
        //   this.sourceDisabled = true
        // } else {
        //   this.sourceDisabled = false
        // }

        this.$nextTick(() => {
          console.log(this.$refs, 'iy')
          console.log(this.sourceData, 'this.sourceData')
          this.$refs['sourceRef'].init(this.sourceData, '')
        })
      })
    },
    openDetails(row) {
      console.log(this.approvalFlag, '555555')
      console.log(row, 'ppop66666666666')
      this.autoId = row.id
      console.log(this.autoId, 'oiGGG')
      this.linesList = []
      let obj = {
        productsId: row.productsId,
        purchaseQuantity: row.purchaseQuantity
      }
      // 通过需求池id 获取明细的数据
      getShipmentList(obj).then((res) => {
        this.linesList.push(...res.data)
      })
      // purPurchaseOrderdetail(row.purchaseOrderId).then((res) => {
      //   console.log(res, 'iiii')
      //   this.linesList = res.data.purchaseOrderLineVOList[0].outShipmentVOList
      // })
    },
    // 更改选中行背景色
    rowStyle({ row }) {
      console.log(this.autoId, 'this.autoId')
      if (this.autoId === row.id) {
        console.log('000')
        return { 'background-color': '#F7EDED', cursor: 'pointer' }
      }
      return { cursor: 'pointer' }
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log(this.taxRateList, ' this.taxRateList')
      })
    },
    disabledDate(time) {
      // 将输入的日期字符串转换为日期对象
      const currentDate = new Date(time)
      const targetDate = new Date(this.demandDelivery)
      // 检查日期是否大于给定日期
      return currentDate > targetDate
    },
    // 对比日期方法
    changeDate(d1, d2) {
      return new Date(d1.replace((/-/g, '\/'))) > new Date(d2.replace(/-/g, '\/'))
    },

    // 打开选择供应商弹窗
    openDialog() {
      this.$refs['SupplierRef'].openDialog()
    },

    // 去除系数后两位的小数位
    numberFormat(number) {
      var formatted = parseFloat(number)
        .toFixed(2)
        .replace(/\.?0+$/, '')

      if (isNaN(formatted)) {
        return 0
      } else {
        return formatted
      }
    },
    //下单数量输入事件
    changePurchaseQuantity(index, val) {
      // this.dataFormTwo.data[index].purchaseQuantity = val
      this.$set(this.dataFormTwo.data[index], 'purchaseQuantity', val)

      let obj = {
        productsId: this.dataFormTwo.data[index].productsId,
        purchaseQuantity: this.dataFormTwo.data[index].purchaseQuantity
      }
      // 通过需求池id 获取明细的数据
      getShipmentList(obj).then((res) => {
        this.dataFormTwo.data[index].outShipmentList = res.data
      })

      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        this.dataFormTwo.data[index].purchaseQuantity2 = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity * this.dataFormTwo.data[index].ratio
        )
      } else {
        this.dataFormTwo.data[index].purchaseQuantity2 = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity / this.dataFormTwo.data[index].ratio
        )
      }
    },

    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type, approvalFlag) {
      console.log(id, 'idwww')
      this.getProductClassFun()
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.type = type
      this.approvalFlag = approvalFlag
      if (id) {
        if (this.type == 'edit') {
          this.title = '编辑外协订单'
        } else if (this.type == 'look') {
          this.title = '查看外协订单'
        }
      } else {
        this.title = '新建外协订单'
        this.getBusInfo()
      }
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          purPurchaseOrderdetail(this.dataForm.id).then((res) => {
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
            this.dataForm = res.data
            console.log(this.dataForm, '9')
            this.oldData = [{ id: this.dataForm.cooperativePartnerId, name: this.dataForm.cooperativePartnerName }]
            this.dataFormTwo.data = res.data.purchaseOrderLineVOList
            this.dataFormTwo.data.forEach((item, index) => {
              console.log(item.productsId, 'id')
              let obj = {
                productsId: this.dataFormTwo.data[index].productsId,
                purchaseQuantity: this.dataFormTwo.data[index].purchaseQuantity
              }
              // 通过需求池id 获取明细的数据
              getShipmentList(obj).then((res) => {
                this.dataFormTwo.data[index].outShipmentList = res.data
                this.linesList.push(...res.data)
              })
            })

            this.dataFormTwo.data.forEach((item) => {
              console.log(item, 'o')
              item.productDrawingNo = item.drawingNo
              item.taxRate = Number(item.taxRate)
            })

            console.log(this.linesList, 'this.linesList ')
            // this.dataFormTwo.data[0].outShipmentList = res.data.purchaseOrderLineVOList[0].outShipmentVOList
            if (this.type === 'edit') {
              this.getBusInfo()
            } else {
              // 流程信息和流转记录
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
            }
          })
        }
      })
    },
    // 表单提交
    handleSubmit(type) {
      this.request(type)
    },

    async request(type) {
      let _data
      let hasCostPrice = true
      this.btnLoading = true
      this.dataForm.documentStatus = type
      console.log(this.dataForm.documentStatus, 'this.dataForm.documentStatus')
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
      let count = 0
      this.dataFormTwo.data.forEach((item) => {
        count += item.taxAmount * 1
      })
      this.dataForm.taxAmount = this.jnpf.numberFormat(count)
      _data = {
        ...this.dataForm,
        attachmentList: this.datafilelist,
        purProcurementRequirements: this.dataForm,
        purchaseOrderLines: this.dataFormTwo.data,
        orderType: 'external',
        flowData: this.flowData
      }
      console.log(_data, '参数')
      let msg = ''
      if (this.dataForm.documentStatus === 'draft') {
        msg = '保存成功'
      } else {
        msg = '提交成功'
      }
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      if (hasCostPrice) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.data.length === 0) {
              this.btnLoading = false
              this.$message.error('请至少选择一项产品')
            } else {
              if (!valid_2) {
                console.log(1)
                this.btnLoading = false
                for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                  const item = this.dataFormTwo.data[i]
                  if (!item.planQuantity) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的主数量',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.deliveryDate) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的交货日期',
                      duration: 1500
                    })
                    break
                  }
                }
                return
              } else {
                this.btnLoading = true

                if (this.type === 'add') {
                  insertOutOrder(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '新建成功'
                      if (!this.dialogTitle) {
                        this.$message({
                          message: msg,
                          type: 'success',
                          duration: 1000,
                          onClose: () => {
                            this.btnLoading = false
                            this.datafilelist = []
                            this.dataFormTwo.data = []
                            this.dataForm = {
                              applicationReason: '',
                              approvalCompletionDate: '',
                              // approvalStatus: "",
                              documentStatus: '',
                              id: '',
                              orderNo: '',
                              reasonRejection: '',
                              submitDate: ''
                            }
                            this.workVisible = false
                          }
                        })
                        return
                      }
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                        }
                      })
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                } else {
                  editOutOrder(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '修改成功'
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                        }
                      })
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                }
              }
            }
          } else {
            this.btnLoading = false
          }
        })
      } else {
        this.btnLoading = false
      }
    },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b010')
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
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 0 10px 10px;
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
  /* padding: 0 20px; */
}

::v-deep .el-tabs__header {
  /* padding-left: 10px !important; */
  padding-bottom: 5px !important;
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
  color: #c0c4cc !important;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
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

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  /* padding: 0 20px; */
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

::v-deep .el-progress-bar {
  padding-right: 65px !important;
}

::v-deep .el-progress__text {
  margin-left: -7px !important;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
