<template>
  <transition name="el-zoom-in-center">
    <div style="height:100%">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main org-form">
            <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
              <el-page-header @back="goBack" :content="dialogTitle + `工序外协订单`" v-if="!!dialogTitle" />
              <div style="font-size:18px" v-else>新建工序外协订单</div>
              <div class="options" v-if="type != 'look'">
                <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
                  保存草稿
                </el-button>
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
                  保存并提交
                </el-button>
                <el-button @click="goBack" v-if="!!dialogTitle">{{ $t('common.cancelButton') }}</el-button>
              </div>
            </div>
            <div class="main">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                      <el-row :gutter="15" class="">
                        <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                          label-position="top">
                          <!-- <el-col :sm="6" :xs="24">
                            <el-form-item label="单号" prop="orderNo">
                              <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="type == 'look'
                                ? true
                                : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                                  ? false
                                  : true
                                "></el-input>
                            </el-form-item>
                          </el-col> -->
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                              <!-- 供应商选择弹窗  -->
                              <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                                v-model="dataForm.cooperativePartnerName" :beforeSubmit="beforeSubmit"
                                @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'"
                                title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                                :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                                :paramsObj="{ oldData }" :searchList="PartnerTableSearchList" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="交货日期" prop="deliveryDate">
                              <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                                style="width: 100%;" placeholder="请选择交货日期"
                                @change="deliveryDateChange"></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label="申请理由" prop="applicationReason" ref="applicationReason">
                              <el-input type="textarea" :row="3" v-model="dataForm.applicationReason"
                                placeholder="请输入申请理由" maxlength="200"
                                :disabled="type == 'look' ? true : false"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-form>
                      </el-row>
                    </el-collapse-item>

                    <el-collapse-item title="产品信息" name="productInfo">
                      <div v-if="type !== 'look'">
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          icon="el-icon-plus" :disabled="type == 'look' ? true : false"
                          @click="openSeleceProductDialog()">
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
                        <JNPF-table style="border: 1px solid #e3e7ee;" :fixedNO="true"
                          @selection-change="handeleProductInfoData" v-bind="dataFormTwo.data" :data="dataFormTwo.data"
                          id="table" border height="460">
                          <el-table-column type="selection" width="55" fixed="left" :key="2"></el-table-column>
                          <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                          <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" show-overflow-tooltip>
                            <template slot="header">
                              <span class="required">*</span>
                              品名规格
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'"
                                :rules="productRules.productDrawingNo">
                                <el-input v-model="scope.row.productDrawingNo" placeholder="请输入品名规格" />
                              </el-form-item>
                            </template>
                          </el-table-column>
                          <el-table-column prop="productName" label="工序名称" min-width="160" show-overflow-tooltip>
                            <template slot="header">
                              <span class="required">*</span>
                              工序名称
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'processName'"
                                :rules="productRules.processName">
                                <!-- 工序选择弹窗  -->
                                <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                                  v-model="scope.row.processName" @change="onOrganizeChangeTwo"
                                  :tableItems="ProcessTableItems" :placeholder="'请选择工序名称'" title="选择工序" treeTitle="工序分类"
                                  :methodArr="ProcessMethodArr" :listMethod="getBimProcessList"
                                  :listRequestObj="ProcessListRequestObj" :paramsObj="{ scope }"
                                  :searchList="ProcessTableSearchList" />
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="deliveryDate" label="交货日期" min-width="200">
                            <template slot="header">
                              <span class="required">*</span>
                              交货日期
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                                :rules="productRules.deliveryDate">
                                <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                                  style="width: 100%;" placeholder="请选择交货日期"></el-date-picker>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="mainUnit" label="单位" width="60" show-overflow-tooltip>
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
                                  @input="changePurchaseQuantity(scope.$index, scope.row.purchaseQuantity)"
                                  maxlength="20" placeholder="请输入主数量"></el-input>
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
                                <el-input v-model="scope.row.price" placeholder="请输入含税单价" />
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
                                <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;">
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

                          <el-table-column prop="taxAmount" label="税额" min-width="100">
                            <template slot="header">
                              <span class="required">*</span>
                              税额
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'taxAmount'">
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
                                <div class="viewData">
                                  <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                                </div>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
                            <template slot-scope="scope">
                              <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="20"
                                placeholder="请输入备注">
                                {{ scope.row.remark }}
                              </el-input>
                            </template>
                          </el-table-column>

                          <el-table-column label="操作" width="180" fixed="right">
                            <template slot-scope="scope">
                              <el-button size="mini" type="text" @click="handlerOpenSource(scope.$index, 'source')">
                                配置发料清单
                              </el-button>
                              <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                v-if="dataFormTwo.data.length > 1" @click="delequipment_process_relList(scope.$index)">
                                删除
                              </el-button>
                            </template>
                          </el-table-column>
                        </JNPF-table>
                      </el-form>
                      <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                        <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ computedValue3 }}</span>
                        <span style="font-weight:500;margin-right:10px">总金额(不含税)：{{ computedValue }}</span>
                        <span style="font-weight:500;margin-right:10px">总数量：{{ computedValue2 }}</span>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="附件" name="annex">
                  <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                  <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
                </el-tab-pane>
              </el-tabs>
            </div>
            <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品"
              treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
              :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false"
              multiple />
            <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area>
          </div>
        </div>
        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="type == 'look'
                            ? true
                            : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                              ? false
                              : true
                            "></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <!-- <el-input v-model="dataForm.cooperativePartnerName" placeholder="请选择供应商名称" @focus="openDialog">
                      </el-input> -->
                          <!-- 供应商选择弹窗  -->
                          <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                            v-model="dataForm.cooperativePartnerName" :beforeSubmit="beforeSubmit" ref="ComSelect-page"
                            @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'"
                            title="选择供应商" treeTitle="供应商分类" :methodArr="PartnerMethodArr"
                            :listMethod="getCooperativeData" :listRequestObj="PartnerListRequestObj"
                            :paramsObj="{ oldData }" :searchList="PartnerTableSearchList" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="交货日期" prop="deliveryDate">
                          <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择交货日期" @change="deliveryDateChange"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="申请理由" prop="applicationReason" ref="applicationReason">
                          <el-input type="textarea" :row="3" v-model="dataForm.applicationReason" placeholder="请输入申请理由"
                            maxlength="200" :disabled="type == 'look' ? true : false"></el-input>
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
                    <JNPF-table style="border: 1px solid #e3e7ee;" :fixedNO="true"
                      @selection-change="handeleProductInfoData" v-bind="dataFormTwo.data" :data="dataFormTwo.data"
                      id="table" border height="460">
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
                            <el-input v-model="scope.row.productDrawingNo" placeholder="请输入品名规格" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productName" label="工序名称" min-width="160" show-overflow-tooltip>
                        <template slot="header">
                          <span class="required">*</span>
                          工序名称
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'processName'"
                            :rules="productRules.processName">
                            <!-- <el-input v-model="scope.row.productName" placeholder="请输入产品名称" /> -->
                            <!-- 工序选择弹窗  -->
                            <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                              v-model="scope.row.processName" @change="onOrganizeChangeTwo"
                              :tableItems="ProcessTableItems" :placeholder="'请选择工序名称'" title="选择工序" treeTitle="工序分类"
                              :methodArr="ProcessMethodArr" :listMethod="getBimProcessList"
                              :listRequestObj="ProcessListRequestObj" :paramsObj="{ scope }"
                              :searchList="ProcessTableSearchList" />
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="deliveryDate" label="交货日期" min-width="200">
                        <template slot="header">
                          <span class="required">*</span>
                          交货日期
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                            :rules="productRules.deliveryDate">
                            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" placeholder="请选择交货日期"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位" width="60" show-overflow-tooltip>
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
                              placeholder="请输入主数量"></el-input>
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
                            <el-input v-model="scope.row.price" placeholder="请输入含税单价" />
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
                            <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;">
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
                            placeholder="请输入备注">
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

                      <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                          <el-button size="mini" type="text" @click="handlerOpenSource(scope.$index, 'source')">
                            配置发料清单
                          </el-button>
                          <el-button size="mini" type="text" class="JNPF-table-delBtn"
                            v-if="dataFormTwo.data.length > 1" @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </jnpf-table>
                  </el-form>
                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ computedValue3 }}</span>
                    <span style="font-weight:500;margin-right:10px">总金额(不含税)：{{ computedValue }}</span>
                    <span style="font-weight:500;margin-right:10px">总数量：{{ computedValue2 }}</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
              <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import SourceArea from './source.vue'
import {
  getShipmentList,
  getpurProcurementRequireDetail,
  addpurProcurementRequire,
  editpurProcurementRequire,
  purProcurementRequirementsList
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { insertOutOrder } from '@/api/purchasingAndOutsourcingOrders/index'
import { getCooperativeData } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import {
  getcategoryTrees,
  getcooperativeProduct,
  getOrderDetail,
  getsaleOrderDetailList
} from '@/api/salesManagement/assemblyOrders'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getBusinessFlowInfo } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import { getBimProcessList } from '@/api/bimProcess/index'
export default {
  components: {
    SourceArea,
    Process
  },
  data() {
    return {
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      dialogTitle: '',
      getCooperativeData,
      getcategoryTree,
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
      // 工序
      getBimProcessList,
      //  供应商 树请求
      ProcessMethodArr: { method: getcategoryTree, requestObj: { classAttribute: 'process' } },
      // 供应商 列表
      ProcessTableItems: [
        { prop: 'code', label: '工序编码' },
        { prop: 'name', label: '工序名称' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      ProcessTableSearchList: [
        { prop: 'code', label: '工序编码', type: 'input' },
        { prop: 'name', label: '工序名称', type: 'input' }
      ],
      // 供应商请求参数
      ProcessListRequestObj: {
        code: '',
        name: '',
        processingType: 'external_production',
        pageNum: 1,
        pageSize: 20
      },
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },

      inquirySheetId: '', //询价单id
      dataForm: {
        applicationReason: '', // 申请理由
        approvalCompletionDate: '', // 审批完成时间
        // approvalStatus: "",               // 审批状态
        documentStatus: '', // 单据状态
        id: '',
        orderNo: '', //申请单号
        reasonRejection: '', //驳回理由
        submitDate: '', //提交时间
        approvalFlag: false
      },
      sourceVisibled: false,
      type: 'add',
      dataFormArr: [],
      rules: {
        applicationReason: [{ required: true, message: '请输入申请理由', trigger: ['blur'] }]
      },
      productRules: {
        productName: [{ required: true, trigger: ['change'] }],
        planQuantity: [
          { required: true, trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('主数量：' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg) => {
              this.$message.error(`数量(主)：${errMsg}`)
            }),
            trigger: 'blur'
          }
        ],
        planQuantity2: [
          { required: true, trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('副数量：' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg) => {
              this.$message.error(`数量(副)：${errMsg}`)
            }),
            trigger: 'blur'
          }
        ],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
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
      formLoading: false,
      codeConfig: {},
      oldData: [],
      oldProcessData: [],
      rules: {
        // applicationReason: [{ required: true, message: '请输入申请理由', trigger: ['blur'] }],
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },
      productRules: {
        productDrawingNo: [{ required: true, message: '请输入产品名称', trigger: ['blur'] }],
        productName: [{ required: true, message: '请输入产品名称', trigger: ['blur'] }],
        purchaseQuantity: [
          // 主数量
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`)
            }),
            trigger: 'blur'
          },
          { required: true, trigger: ['blur'] }
        ],
        purchaseQuantity2: [
          // 副数量
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`)
            }),
            trigger: 'blur'
          },
          { required: true, trigger: ['blur'] }
        ],
        taxRate: [
          // 税率
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：税率${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate('noZero', '', (errMsg, index) => {
              this.$message.error(`产品信息第${index + 1}行：税率${errMsg}`)
            }),
            trigger: 'blur'
          },
          { required: true, trigger: ['blur'] }
        ],
        price: [
          // 含税单价
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：含税单价${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                6,
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
                }
              ]
            }),
            trigger: 'blur'
          },
          // {
          //   validator: this.formValidate({
          //     type: 'calc',
          //     params: [
          //       (rowIndex, value) =>
          //         Number(this.dataFormTwo.data[rowIndex].price) <= Number(this.dataFormTwo.data[rowIndex].fixedPrice),
          //       '不能超过对应定价',
          //       (errMsg, index) => {
          //         this.$message.error(`产品信息第${index + 1}行：${errMsg}`)
          //       }
          //     ]
          //   }),
          //   trigger: 'blur'
          // },
          { required: true, trigger: ['blur'] }
        ],
        deliveryDate: [{ required: true, message: '请选择交货日期', trigger: ['change'] }]
      },

      taxRateList: [],
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
  mounted() {
    this.getProductClassFun()
  },
  created() {
    console.log(this.$route.query.alert, 'this.$route.query.alert')
    if (this.$route.query.alert) {
      this.dialogTitle = '新建'
    }
    this.fetchData('EPDH')
    this.getBusInfo()
  },
  methods: {
    deliveryDateChange(e) {
      console.log(e, 'e')
    },
    // 抽屉提交
    handlerConfirm(data) {
      console.log(this.index, '1111111111111111111111111')
      console.log(data, '资源资源数据')
      this.dataFormTwo.data[this.index].outShipmentList = data
      console.log(
        this.dataFormTwo.data[this.index].outShipmentList,
        'this.dataFormTwo.data[this.index].outShipmentList***'
      )
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log(this.taxRateList, 'loisi')
      })
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
        this.$set(this.dataForm, 'orderNo', data.number)
        console.log('dataForm', this.dataForm)
      } catch (error) { }
    },
    // 产品组件回调
    addth(id, data) {
      console.log(data)
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
            taxRate: item.taxRate, // 税率
            excludingTaxPrice: item.excludingTaxPrice, // 不含税单价
            taxAmount: item.taxAmount, // 税额
            excludingTaxAmount: item.excludingTaxAmount, // 金额(不含税)
            deputyUnit: item.deputyUnit, // 副单位
            planQuantity: '', //计划数量主
            planQuantity2: '', //计划数量副
            remark: item.remark,
            deliveryDate: this.dataForm.deliveryDate // 交期
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
          console.log(data, '删除后的数据')
          console.log(deletedArray, '被删掉的数据')
        }
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]
        // 审批
        // this.$nextTick(() => { this.getApproverData() })
      }
    },
    // 配置资源
    handlerOpenSource(index, type) {
      console.log(this.dataFormTwo.data[index].purchaseQuantity, 'this.dataFormTwo.data[index].id')
      if (!this.dataFormTwo.data[index].purchaseQuantity) return this.$message.error('请先输入数量')
      console.log(index, 'index')
      this.sourceVisibled = true
      this.index = index
      console.log(this.dataFormTwo.data[index], 'this.dataFormTwo.data[index].id')
      let obj = {
        productsId: this.dataFormTwo.data[index].productsId,
        purchaseQuantity: this.dataFormTwo.data[index].purchaseQuantity
      }
      // 通过需求池id 获取明细的数据
      getShipmentList(obj).then((res) => {
        console.log(res, '清单数据')
        this.sourceData = res.data
        if (this.dataFormTwo.data[this.index].outShipmentList.length !== 0) {
          this.sourceData = this.dataFormTwo.data[this.index].outShipmentList

          // this.dataFormTwo.data[this.index].outShipmentList.forEach((item, ind) => {
          //   console.log(item, 'p{{}}')
          //   console.log(this.sourceData[ind], 'this.sourceData[ind]')
          //   this.sourceData[ind].demandQuantity1 = item.demandQuantity1 ? item.demandQuantity1 : item.demandQuantity
          //   this.sourceData[ind].processId = item.processId
          //   this.sourceData[ind].processName = item.processName
          // })
        } else {
          this.sourceData.forEach((item, index) => {
            this.$set(this.sourceData[index], 'demandQuantity1', item.demandQuantity)
          })
        }
        console.log(this.sourceData, '1111')

        if (this.sourceData.length === 0) {
          this.sourceDisabled = true
        } else {
          this.sourceDisabled = false
        }
        console.log(this.dataFormTwo.data, 'daaaa')
        this.$nextTick(() => {
          this.$refs['sourceRef'].init(
            this.sourceData,
            '',
            this.dataFormTwo.data[this.index].productsId,
            this.dataFormTwo.data[this.index].purchaseQuantity
          )
        })
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
        let productIdList = []
        this.dataFormTwo.data.forEach((item) => {
          productIdList.push(item.productsId)
        })
        let _data = {
          cooperativePartnerId: this.dataForm.cooperativePartnerId,
          productIdList
        }
      }
    },

    // 选择产品名称的弹框
    onOrganizeChangeTwo(val, data, paramsObj) {
      if (!data || !data.length) return
      console.log(data)
      console.log(paramsObj, '1111')
      let index = paramsObj.scope.$index
      console.log(index, '索引')
      if (data.length) {
        this.dataFormTwo.data[index].processName = data[0].name
        this.dataFormTwo.data[index].processId = data[0].id
      }

      console.log(this.dataFormTwo, 'this.dataFormTwo')
    },

    // 去除系数后两位的小数位
    numberFormat(number) {
      var formatted = parseFloat(number)
        .toFixed(2)
        .replace(/\.?0+$/, '')
      console.log(formatted, '8888')
      if (isNaN(formatted)) {
        return 0
      } else {
        return formatted
      }
    },
    //主数量输入事件
    changePlanQuantity(index, val) {
      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        console.log(this.dataFormTwo.data[index].ratio)
        this.dataFormTwo.data[index].planQuantity2 = this.numberFormat(
          this.dataFormTwo.data[index].planQuantity * this.dataFormTwo.data[index].ratio
        )
      } else {
        this.dataFormTwo.data[index].planQuantity2 = this.numberFormat(
          this.dataFormTwo.data[index].planQuantity / this.dataFormTwo.data[index].ratio
        )
      }

      console.log(this.dataFormTwo.data[index].planQuantity2, '数量')
    },
    // 副数量输入事件
    changePlanQuantity2(index, val) {
      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        this.dataFormTwo.data[index].planQuantity = this.numberFormat(
          this.dataFormTwo.data[index].planQuantity2 / this.dataFormTwo.data[index].ratio
        )
      } else {
        this.dataFormTwo.data[index].planQuantity = this.numberFormat(
          this.dataFormTwo.data[index].planQuantity2 * this.dataFormTwo.data[index].ratio
        )
      }
      console.log(this.dataFormTwo.data[index].planQuantity, '数量')
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
      console.log(val, 'kkk')
      // this.dataFormTwo.data[index].purchaseQuantity = val
      this.$set(this.dataFormTwo.data[index], 'purchaseQuantity', val)
      console.log(this.dataFormTwo.data[index], 'this.dataFormTwo.data[index]')
      let obj = {
        productsId: this.dataFormTwo.data[index].productsId,
        purchaseQuantity: this.dataFormTwo.data[index].purchaseQuantity
      }
      // 通过需求池id 获取明细的数据
      getShipmentList(obj).then((res) => {
        console.log(res, '清单数据')
        this.dataFormTwo.data[index].outShipmentList = res.data

        console.log(this.dataFormTwo.data, 'daaaa')
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
    // 副数量输入事件
    changePlanQuantity2(index, val) {
      if (this.dataFormTwo.data[index].calculationDirection === 'multiplication') {
        this.dataFormTwo.data[index].purchaseQuantity = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity2 / this.dataFormTwo.data[index].ratio
        )
      } else {
        this.dataFormTwo.data[index].purchaseQuantity = this.numberFormat(
          this.dataFormTwo.data[index].purchaseQuantity2 * this.dataFormTwo.data[index].ratio
        )
      }
    },
    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close', true)
    },
    init(id, type, data) {
      console.log(id, type, data)
      // this.fetchData('QGD')
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''

      this.dialogTitle = type == 'add' ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else if (this.dataForm.id && this.type == 'add') {
          this.loading = true
          getpurProcurementRequireDetail(this.dataForm.id).then((res) => {
            this.dataForm = res.data
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

            purProcurementRequirementsList(this.dataForm.id).then((res) => {
              this.dataForm.approvalStatus = ''
              this.dataForm.submitDate = ''
              this.dataForm.approvalCompletionDate = ''
              this.dataForm.id = ''
              this.dataForm.documentStatus = ''
              this.dataFormTwo.data = res.data
              this.dataFormTwo.data.forEach((item) => {
                item.id = ''
              })
            })
            // 审批
            // this.$nextTick(() => { this.getApproverData() })
          })
        } else {
          this.loading = true
          getpurProcurementRequireDetail(this.dataForm.id).then((res) => {
            this.dataForm = res.data
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
            purProcurementRequirementsList(this.dataForm.id).then((res) => {
              this.dataFormTwo.data = res.data
            })
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
      if (this.type == 'add') {
        _data = {
          ...this.dataForm,
          attachmentList: this.datafilelist,
          purProcurementRequirements: this.dataForm,
          purchaseOrderLines: this.dataFormTwo.data,
          flowData: this.flowData,
          orderType: 'external_process'
        }
      }
      if (this.type === 'edit' || this.type === 'look') {
        // this.dataFormTwo.data.forEach((item, index) => {
        //   this.dataFormTwo.data[index].inquirySheetId = this.dataForm.id
        // })
        _data = {
          ...this.dataForm,
          attachmentList: this.datafilelist,
          purProcurementRequirements: this.dataForm,
          purchaseOrderLines: this.dataFormTwo.data,
          orderType: 'external_process'
        }
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
                  editpurProcurementRequire(_data)
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
      getBusinessFlowInfo('b011')
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

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
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

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .workNode {
  /* min-height: 1045px !important; */
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

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
