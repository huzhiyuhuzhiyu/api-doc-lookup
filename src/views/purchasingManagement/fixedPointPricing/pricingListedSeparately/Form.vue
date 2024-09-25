<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="dialogTitle + `定点定价单`" />
          <div class="options" v-if="type != 'look'">
            <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">
              保存草稿
            </el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交
            </el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
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
                      <el-col :span="12">
                        <el-form-item label="单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="单号" :disabled="type === 'look'
                            ? true
                            : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                              ? false
                              : true
                            "></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                          <ComSelect-page clearable :treeNodeClick="treeNodeClick" :isdisabled="type === 'look'"
                            :value="dataForm.cooperativePartnerName" ref="ComSelect-page" @change="supplierdata"
                            :tableItems="PartnerTableItems" :placeholder="'请选择供应商'" title="选择供应商" treeTitle="供应商分类"
                            :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                            :listRequestObj="PartnerListRequestObj" :paramsObj="{}"
                            :searchList="PartnerTableSearchList" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="备注">
                          <el-input v-model="dataForm.remark" type="textarea" placeholder="备注"
                            :disabled="type === 'look'"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">
                  <div v-if="type !== 'look'" style="margin-left: -12px;">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openSeleceProductDialog()">
                      选择产品
                    </el-button>
                    |
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                      删除产品
                    </el-button>
                    |

                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="type == 'look'" @click="addtable()">
                      导入产品
                    </el-button>
                  </div>

                  <el-form :model="dataFormTwo" ref="productForm" style="margin: 0 -12px;">
                    <el-table style="border: 1px solid #e3e7ee;" @selection-change="handeleProductInfoData" hasC hasNO
                      fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data" id="table">
                      <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" />
                      <el-table-column type="index" key="index" width="60" label="序号" align="center" fixed="left" />
                      <!-- <el-table-column prop="drawingNo" key="drawingNo" label="品名规格" min-width="200"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'"
                            :rules="productRules.drawingNo">
                            <div class="viewData">
                              <span>{{ scope.row.drawingNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
</el-table-column> -->

                      <el-table-column prop="drawingNo" key="drawingNo" label="品名规格" min-width="180">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'"
                            :rules="productRules.drawingNo">
                            <el-input v-model="scope.row.drawingNo" :disabled="type === 'look'" maxlength="20"
                              :placeholder="type == 'look' ? '' : '请输入品名规格'">
                              {{ scope.row.drawingNo }}
                            </el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="mainUnit" key="mainUnit" label="单位" width="100">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'"
                            :rules="productRules.mainUnit">
                            <el-input v-model="scope.row.mainUnit" :disabled="type === 'look'" maxlength="20"
                              :placeholder="type == 'look' ? '' : '请输入单位'">
                              {{ scope.row.mainUnit }}
                            </el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="price" key="price" label="协议价" min-width="140">
                        <template slot="header">
                          协议价(含税)
                          <span class="required">*</span>
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules="productRules.price">
                            <el-input v-model="scope.row.price" @input="priceChange($event, scope)"
                              :disabled="type === 'look'" maxlength="20" placeholder="请输入协议价">
                              {{ scope.row.price }}
                            </el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="taxRate" key="taxRate" label="税率" min-width="140">
                        <template slot="header">
                          <span class="required">*</span>
                          税率
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'" :rules="productRules.taxRate">
                            <el-select v-model="scope.row.taxRate" placeholder="请选择税率" style="width: 100%;"
                              :disabled="type === 'look' ? true : false">
                              <el-option v-for="item in taxRateList" size="small" :key="item.enCode"
                                :label="item.fullName" :value="item.enCode"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="excludingTaxPrice" key="excludingTaxPrice" label="协议价(不含税)"
                        min-width="180">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'"
                            :rules='productRules.excludingTaxPrice'>
                            <el-input v-model="scope.row.excludingTaxPrice" :disabled="type === 'look'" maxlength="20"
                              placeholder="请输入不含税价">{{
                                scope.row.excludingTaxPrice }}
                            </el-input>
                          </el-form-item>

                        </template>
                      </el-table-column> -->
                      <el-table-column prop="excludingTaxPrice" key="excludingTaxPrice" label="协议价(不含税)" width="150"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                            <div class="viewData">
                              <span>{{ scope.row.excludingTaxPrice }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="effectiveTimeStart" key="effectiveTimeStart" label="有效起始时间"
                        min-width="240">
                        <template slot="header">
                          <span class="required">*</span>
                          有效起始时间
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'effectiveTimeStart'"
                            :rules="productRules.effectiveTimeStart">
                            <el-date-picker v-model="scope.row.effectiveTimeStart" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" placeholder="请选择有效起始时间"
                              :disabled="type == 'look' ? true : false"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="effectiveTimeEnd" key="effectiveTimeEnd" label="有效结束时间" min-width="240">
                        <template slot="header">
                          <span class="required">*</span>
                          有效结束时间
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'effectiveTimeEnd'"
                            :rules="productRules.effectiveTimeEnd">
                            <el-date-picker v-model="scope.row.effectiveTimeEnd" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" placeholder="请选择有效结束时间"
                              :disabled="type == 'look' ? true : false"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="standardValue" label="规值" width="120" :key="211">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'standardValue'"
                            :rules="productRules.standardValue">
                            <el-select v-model="scope.row.standardValue" placeholder="请选择" clearable
                              style="width: 100%;" :disabled="type === 'look'">
                              <el-option v-for="(item, index) in list0" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="colour" key="colour" label="颜色" min-width="180">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'colour'" :rules="productRules.colour">
                            <el-select v-model="scope.row.colour" placeholder="请选择" clearable style="width: 100%;"
                              :disabled="type === 'look'">
                              <el-option v-for="(item, index) in list1" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" key="remark" min-width="220">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" maxlength="20" :disabled="type === 'look'"
                            :placeholder="type == 'look' ? '' : '请输入备注'">
                            {{ scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" width="180" fixed="right" v-if="type != 'look'" key="look">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn" :disabled="type === 'look'"
                            @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
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
                    <div class="el-empty__image" style="width: 120px;">
                      <svg viewBox="0 0 79 86" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink">
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
                                height="36">
                              </rect>
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
                      </svg>
                    </div>
                    <div class="el-empty__description">
                      <p>暂无流程信息</p>
                    </div>
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

    <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
      :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
      :searchList="ProductTableSearchList" :elementShow="false" multiple :renderTree="false"
      :listDataFormatting="listDataFormatting" />
    <!-- 上传产品 -->
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
        :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传.xls/.xlsx文件
          <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">
            下载模板
          </el-button>
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="saveSubmit()">
          提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCooperativeData, getcategoryTree } from '@/api/basicData/index' //供应商数据

import formValidate from '@/utils/formValidate'
import {
  getbuyFixedPointPricingDetail,
  addbuyFixedPointPricing,
  editbuyFixedPointPricing,
  buyFixedPointPricingUploadData
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getcategoryTree as productCategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import workFlow from '@/components/WorkFlow/settingBus.vue'
import {
  getApprovalTemplate,
  getApprovalDetailTree,
  busApprovalFlowTree,
  getSaleBusDetail,
  getBusDetail,
  approvalTransferList
} from '@/api/basicData/approvalAdministrator'
import { getbimProductAttributes, getbimProductAttributesList } from '@/api/masterDataManagement/index'
import { getclassAttributeList } from '@/api/masterDataManagement/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import { mapGetters, mapState } from 'vuex'
import { getLabel } from '@/utils/index'
Vue.prototype.$getLabel = getLabel
export default {
  components: {
    workFlow
  },
  data() {
    return {
      activeNames: ['productInfo', 'basicInfo'],
      datafilelist: [],
      //  供应商 树请求
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'supplier' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'name', label: '供应商名称' },
        { prop: 'code', label: '供应商编码' },
        { prop: 'partnerCategoryIdText', label: '所属分类' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'name', label: '供应商名称', type: 'input' },
        { prop: 'code', label: '供应商编码', type: 'input' }
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
      getCooperativeData,
      activeName: 'jcInfo',
      dialogTitle: '',

      loading: false,
      btnLoading: false,
      organizeIdTree: [],
      index: null,
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        {
          label: '物料分类',
          classAttribute: 'material',
          method: productCategoryTree,
          requestObj: { classAttribute: 'material' }
        }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: 'other',
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
        productStatus: 'enable',
        pageNum: 1,
        pageSize: 20,
        queryType: 7
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'drawingNo', label: '品名规格', minWidth: 140 },
        { prop: 'code', label: '产品编码', minWidth: 140 },

        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeName', label: '所属分类', minWidth: 140 },
        { prop: 'mainUnit', label: '单位' },
        { prop: 'colour', label: '颜色' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'drawingNo', label: '品名规格', type: 'input' },
        { prop: 'code', label: '产品编码', type: 'input' }
      ], // 产品选择弹出框搜索条件

      dataFormTwo: {
        data: []
      },

      inquirySheetId: '', //询价单id
      dataForm: {
        approvalCompletionDate: '', //审批完成时间
        approvalStatus: '', // 审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerId: 0, //  供应商id
        cooperativePartnerName: '', //  供应商名称
        cooperativePartnerCode: '',
        createBy: '', //
        documentStatus: '', //  单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
        id: 0, //
        listPriceFlag: 0, //是否设置牌价:0否1是
        orderNo: '', //
        reasonRejection: '', //驳回理由
        submitDate: '' //
      },
      codeConfig: {},
      taxRateList: [],
      requestObj2: {
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: -1,
        type: 'supplier'
      },
      type: '',
      dataFormArr: [],
      rules: {
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }]
        // inquiryDate: [{ required: true, message: '请选择询价日期', trigger: ['change'] }],
        // effectiveDate: [{ required: true, message: '请选择报价有效期', trigger: ['change'] }],
      },
      productRules: {
        productsName: [{ required: true, trigger: ['change'] }],
        effectiveTimeStart: [
          { required: true, message: '请选择有效起始日期', trigger: ['change'] },
          { validator: this.checkDate(), trigger: 'change' }
        ],
        effectiveTimeEnd: [
          { required: true, message: '请选择有效结束日期', trigger: ['change'] },
          { validator: this.checkDate2(), trigger: 'change' }
        ],
        materialPrice: [
          { required: true, trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                8,
                '',
                (errMsg) => {
                  this.$message.error('物料价格：' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          }
        ],
        taxRate: [
          { required: true, trigger: ['blur'] },
          // {
          //   validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('税率' + errMsg) }] }), trigger: 'blur'
          // },
          // { validator: this.formValidate('noZero','', (errMsg) => { this.$message.error('税率不能为0') }), trigger: 'blur' },
          {
            validator: this.checktaxRate(),
            trigger: 'blur'
          }
        ],
        excludingTaxPrice: [
          { required: true, trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                8,
                '',
                (errMsg) => {
                  this.$message.error('不含税价' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('noZero', '', (errMsg) => {
              this.$message.error('不含税价不能为0')
            }),
            trigger: 'blur'
          }
        ],
        price: [
          { required: true, trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('协议价' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('noZero', '', (errMsg) => {
              this.$message.error('协议价不能为0')
            }),
            trigger: 'blur'
          }
        ],
        targetPrice: [
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('目标价格' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('noZero', '', (errMsg) => {
              this.$message.error('目标价格不能为0')
            }),
            trigger: 'blur'
          }
        ]
        // contrastmaterialPrice:[{ required: true, trigger: ['blur'] }, { validator: this.formValidate({ type: 'decimal', params: [20, 8, "", (errMsg) => { this.$message.error('对比物料价格' + errMsg) }] }), trigger: 'blur' }],
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: '发起人',
        nodeType: 0,
        type: 'node',
        priorityLevel: '',
        approvalType: 'appoint',
        selectMode: '',
        selectRange: '',
        directorLevel: '',
        examineMode: '',
        whenEmpty: '',
        examineEndDirectorLevel: '',
        ccSelfSelectFlag: '',
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
        createByName: '',
        documentId: '',
        endTime: '',
        keyword: '',
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ''
      },
      transferData: [],
      formLoading: false,
      pool: '',
      list0: [],
      classAttributeList: [],
      uploadVisib: false
    }
  },
  mounted() {
    this.getclassAttributeList()
  },
  created() { },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token'])
  },
  methods: {
    // 谈价更改
    priceChange(val, scope) {
      scope.row.excludingTaxPrice = this.jnpf.numberFormat(val / (1 + scope.row.taxRate / 100))
    },
    // 税率更改
    taxRateChange(val, scope) {
      scope.row.excludingTaxPrice = this.jnpf.numberFormat(scope.row.price / (1 + val / 100))
    },
    checkDate() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：有效起始日期不能超过有效结束日期`
        if (!value) {
          callback()
        } else {
          if (new Date(value) > new Date(this.dataFormTwo.data[index].effectiveTimeEnd)) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },
    checkDate2() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：有效结束日期不能超过有效起始日期`
        if (!value) {
          callback()
        } else {
          if (new Date(value) < new Date(this.dataFormTwo.data[index].effectiveTimeStart)) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
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
            productsId: item.id, // 产品id
            productsName: item.name, // 产品名称
            productsCode: item.code,
            drawingNo: item.drawingNo,
            mainUnit: item.mainUnit,
            taxRate: '13', // 产品税率
            materialPrice: '', // 产品价格
            price: '', // 协议价
            excludingTaxPrice: 0, // 不含税价
            historicalPrice: item.historicalPrice, // 历史价格
            targetPrice: '', // 目标价格
            // contrastProductsId:'',              // 对比物料id
            contrastProducts: '', // 对比物料
            costPrice: '', // 对比价格
            effectiveTimeStart: this.jnpf.getToday(), // 有效时间起
            effectiveTimeEnd: '' // 有效时间止
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = []
          selectArr = selectArr.filter((item1) => {
            const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
            if (index !== -1) {
              deletedArray.push(item1.productsName)
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
        // 获取审批模版
        this.$nextTick(() => {
          this.getBusInfo()
        })
      }
    },
    handleFileChange(file) {
      console.log(file, 'file')
      this.file = file.raw
    },
    saveSubmit() {
      this.UploadProduct(this.file)
    },
    // 上传产品
    UploadProduct(data) {
      console.log(data, 'o')
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      //调用上传文件接口
      buyFixedPointPricingUploadData(formData)
        .then((res) => {
          this.$message.success(`数据更新成功`)
          this.uploadVisib = false
          this.dataFormTwo.data = res.data
          this.dataFormTwo.data.map((item) => {
            return (item.productsCode = item.productCode)
          })
          this.dataFormTwo.data.map((item) => {
            return (item.productsName = item.productName)
          })
          this.dataFormTwo.data.map((item) => {
            return (item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + item.taxRate / 100)))
          })
          this.formLoading = false
          this.loadingText = ''
        })
        .catch((err) => {
          this.$message.error(`文件上传失败`)
          this.formLoading = false
          this.loadingText = ''
        })
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/定点定价导入模板.xlsx')
      a.click()
    },
    checktaxRate() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：税率不能超过100`
        if (!value || value == 0) {
          callback()
        } else {
          if (value * 1 > 100) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },
    //清除对比物料的值
    btnClearable(index, val) {
      this.dataFormTwo.data[index].contrastProductsId = ''
      this.dataFormTwo.data[index].contrastProductsName = ''
      this.dataFormTwo.data[index].contrastProductsPrice = ''
    },

    // 打开选择供应商弹窗
    openDialog() {
      this.$refs['SupplierRef'].openDialog()
    },
    supplierdata(id, data) {
      console.log(data, '供应商数据')
      this.$nextTick(() => {
        this.$refs['elForm'].validateField('cooperativePartnerName')
      })
      if (data.length === 0) {
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
      } else {
        this.dataForm.cooperativePartnerName = data[0].name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].id
      }
    },

    // 产品弹窗
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()

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
    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
      if (this.pool == 'fixPool') {
        this.$emit('closePool', true)
      }
    },

    init(id, type, pool, fixedData) {
      console.log(id, type)
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.pool = pool
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type

      this.getProductClassFun()
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
          this.fetchData('DDDJ', true)
          if (pool == 'fixPool') {
            this.dataFormTwo.data = fixedData
            // 审批
            this.$nextTick(() => {
              this.getBusInfo()
            })
          }
        } else if (this.type == 'add' && this.dataForm.id) {
          this.loading = true
          getbuyFixedPointPricingDetail(this.dataForm.id).then((res) => {
            console.log(res, '详情')
            this.dataForm = {
              id: res.data.id,
              cooperativePartnerCode: res.data.cooperativePartnerCode,
              cooperativePartnerName: res.data.cooperativePartnerName, //  供应商名称
              cooperativePartnerId: res.data.cooperativePartnerId, //  供应商id
              documentStatus: res.data.documentStatus, //  单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
              listPriceFlag: res.data.listPriceFlag, //是否设置牌价:0否1是
              orderNo: res.data.orderNo, //单号
              approvalFlag: res.data.approvalFlag
            }
            this.dataForm.approvalStatus = ''
            this.dataForm.submitDate = ''
            this.dataForm.approvalCompletionDate = ''
            this.dataForm.id = ''
            this.dataFormTwo.data = res.data.buyFixedPointPricingLineVOList
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
          })
          // 审批
          this.$nextTick(() => {
            this.getBusInfo()
          })
        } else {
          this.loading = true
          getbuyFixedPointPricingDetail(this.dataForm.id).then((res) => {
            console.log(res, '详情')
            this.dataForm = {
              id: res.data.id,
              cooperativePartnerCode: res.data.cooperativePartnerCode,
              cooperativePartnerName: res.data.cooperativePartnerName, //  供应商名称
              cooperativePartnerId: res.data.cooperativePartnerId, //  供应商id
              documentStatus: res.data.documentStatus, //  单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
              listPriceFlag: res.data.listPriceFlag, //是否设置牌价:0否1是
              orderNo: res.data.orderNo, //单号
              approvalFlag: res.data.approvalFlag,
              remark: res.data.remark
            }
            this.dataFormTwo.data = res.data.buyFixedPointPricingLineVOList
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
          })
          getSaleBusDetail(this.dataForm.id).then((res) => {
            console.log(res, '业务详情')
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
                console.log(this.approvalForm, '++++++++++')
                this.transferQuery.documentId = this.dataForm.id
                approvalTransferList(this.transferQuery).then((res) => {
                  console.log(res, '流转记录')
                  this.transferData = res.data.records
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
        }
      })
    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (flag) {
          this.dataForm.orderNo = data.number
        }
      } catch (error) { }
    },
    getclassAttributeList() {
      let obj = {
        pageNum: 1,
        pageSize: 20
      }
      getclassAttributeList(obj).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          console.log(item, 'ooo')
          let obj = {
            label: item.name,
            value: item.code
          }
          arr.push(obj)
        })
        this.classAttributeList = arr
      })
    },

    listDataFormatting(res) {
      res.data.records.forEach((item, index) => {
        item.classAttributeName = this.$getLabel(this.classAttributeList, item.classAttribute, 'value', 'label')
      })
      console.log(res.data.records, 'res.data.records')
      return res.data.records
    },
    addtable() {
      // 导入产品，获取数据渲染
      if (this.dataFormTwo.data.length) {
        this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' })
          .then(() => {
            // this.$refs.UploadProduct.$el.querySelector('input').click()
            this.uploadVisib = true
            // 审批
            this.$nextTick(() => {
              this.getBusInfo()
            })
          })
          .catch(() => { })
      } else {
        // this.$refs.UploadProduct.$el.querySelector('input').click()
        this.uploadVisib = true
        // 审批
        this.$nextTick(() => {
          this.getBusInfo()
        })
      }
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj0 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa008',
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
      getbimProductAttributesList(obj0).then((res) => {
        console.log(res, 'res123')
        this.list0 = res.data.records
      })

      let obj16 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa010',
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
      getbimProductAttributesList(obj16).then((res) => {
        this.list1 = res.data.records
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log('税率', this.taxRateList)
      })
    },
    // 表单提交
    dataFormSubmit(type) {
      this.request(type)
    },

    async request(type) {
      let _data
      let hasCostPrice = true
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
      this.btnLoading = true
      this.dataForm.documentStatus = type
      this.dataForm.classAttribute = 'other'
      // 选择物料之后 限制必须有物料价格的 否则无法提交
      this.dataFormTwo.data.forEach((item) => {
        if (item.contrastProductsName) {
          if (!item.contrastProductsPrice) {
            hasCostPrice = false
            this.btnLoading = false
            this.$message.error('请选择含有物料价格的产品')
          } else {
            hasCostPrice = true
          }
        } else {
          item.contrastProductsId = ''
        }
      })
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
      if (this.type == 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data)
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map((item) => {
            return {
              ...item,
              nodeUserList: item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter((item) => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter((item) => item.nodeName === '抄送人')

          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList
            ccLists = ccLists.concat(nodeUserList)
          }
          if (templateLineList.length && type === 'submit') {
            hasCostPrice = templateLineList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && type === 'submit') {
            hasCostPrice = ccList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          }
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter((item) => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: item.name == '审核人' ? 'no' : '',
              adminId: '',
              id: '',
              previousCode:
                item.type === 'condition' ? item.previousCode : index === 0 ? '' : flattenedNodes[index - 1].code,
              name: item.nodeName,
              designatedMembersId: item.designatedMembersId
                ? item.designatedMembersId
                : item.nodeUserList.length
                  ? item.nodeUserList[0].targetId
                  : ''
            }
          })
          // 抄送人
          ccLists = ccLists.map((item) => {
            return {
              ...item,
              approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
              ccToId: item.targetId,
              approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
              id: '',
              defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map((item) => {
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
            id: ''
          }
        }
      }
      if (this.type === 'edit' || this.type === 'look') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data)
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map((item) => {
            return {
              ...item,
              nodeUserList: item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter((item) => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter((item) => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList
            ccLists = ccLists.concat(nodeUserList)
          }
          if (templateLineList.length && type === 'submit') {
            hasCostPrice = templateLineList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && type === 'submit') {
            hasCostPrice = ccList.every((item) => item.nodeUserList.length)
            if (!hasCostPrice) {
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          }
          // return
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter((item) => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              // previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              // name: item.nodeName,
              designatedMembersId: item.designatedMembersId
                ? item.designatedMembersId
                : item.nodeUserList.length
                  ? item.nodeUserList[0].targetId
                  : ''
            }
          })
          // 抄送人
          ccLists = ccLists.map((item) => {
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
            nodeJudg = nodeCondList.map((item) => {
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
            documentStatus: type
          }
        }
      }
      if (type === 'submit' && this.dataForm.approvalFlag) {
        if (!this.busNodeConfig.childNode) {
          hasCostPrice = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach((item) => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                hasCostPrice = false
                this.btnLoading = false
                this.$message.error('未配置发起人自选！')
              }
            }
          })
        }
      }

      _data = {
        attachmentList: this.datafilelist,
        buyFixedPointPricing: this.dataForm,
        buyFixedPointPricingLineList: this.dataFormTwo.data,
        form: form,
        formNodeList,
        nodeCondList: nodeJudg,
        ccList: ccLists
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
                  if (!item.price) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的协议价',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.taxRate) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的税率',
                      duration: 1500
                    })
                    break
                  }

                  if (!item.excludingTaxPrice) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的不含税价',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.effectiveTimeStart) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的有效起始时间',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.effectiveTimeEnd) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的有效结束时间',
                      duration: 1500
                    })
                    break
                  }
                }
                return
              } else {
                this.btnLoading = true

                if (!this.dataForm.id) {
                  addbuyFixedPointPricing(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '新建成功'
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                          if (this.pool == 'fixPool') {
                            this.$emit('closePool', true)
                          }
                        }
                      })
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                } else {
                  editbuyFixedPointPricing(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '修改成功'
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                          if (this.pool == 'fixPool') {
                            this.$emit('closePool', true)
                          }
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
    //  选择产品弹框传递的数据
    productsSubmit(data) {
      if (this.dataFormTwo.data.length) {
        // this.dataFormTwo.data = this.dataFormTwo.data.filter(item => {
        //   return !data.some(element => element.productsId === item.productsId);
        // });

        // data = data.filter(item1 => this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId) === -1);

        const deletedArray = []
        data = data.filter((item1) => {
          const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
          if (index !== -1) {
            deletedArray.push(item1.productsName)
            if (deletedArray.length) {
              this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
            }
            return false
          }
          return true
        })
        console.log(data, '删除后的数据')
        console.log(deletedArray, '被删掉的数据')

        // return
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data]
      console.log(this.dataFormTwo.data, '传递数据')
    },
    // 对比物料弹窗传递数据
    productSubmit(data) {
      console.log(data, '对比物料数据')
      this.$set(this.dataFormTwo.data[this.index], 'contrastProductsId', data.id)
      this.$set(this.dataFormTwo.data[this.index], 'contrastProductsName', data.contrastProductsName)
      this.$set(this.dataFormTwo.data[this.index], 'contrastProductsPrice', data.contrastProductsPrice)
      // this.dataFormTwo.data[this.index].contrastProductsId = data.id
      // this.dataFormTwo.data[this.index].contrastProductsName = data.contrastProductsName
      // this.dataFormTwo.data[this.index].contrastProductsPrice = data.contrastProductsPrice
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      console.log(obj)
      if (obj) {
        if (obj.name === '审核人') {
          obj.nodeType = 1
          obj.nodeName = obj.name
          obj.directorLevel = obj.approvalType == 'manager' ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == 'multilevel' ? obj.levelSupervisor : ''
        }
        if (obj.name === '路由') {
          obj.nodeType = 4
        }
        if (obj.name === '抄送人') {
          obj.nodeType = 2
          obj.nodeName = obj.name
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode)
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map((item) => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(',') // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',')
                  var resultArr = []
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      }
                      resultArr.push(option)
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
                  optType:
                    item.dataType == 'number'
                      ? item.operationalFormula == 'lt'
                        ? '1'
                        : item.operationalFormula == 'gt'
                          ? '2'
                          : item.operationalFormula == 'eq'
                            ? '4'
                            : item.operationalFormula == 'ge'
                              ? '5'
                              : item.operationalFormula == 'le'
                                ? '3'
                                : ''
                      : ''
                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode)
            }
          }
        }
      }
    },
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        console.log(node, '提交数1')
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null })
        if (node.type === 'node') {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code)
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {
              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code)
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code)
          }
        }
      }
      return flattenedNodes
    },
    // // 获取审批模版
    getApproverData2() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = '' // 条件符号
      let result = null // 判断条件是否成立
      let condList = []
      getBusDetail('b002').then((res) => {
        console.log(res)
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
              foundSymbol = condArr[i]
              break
            }
          }
          // 找到符号并进行销售报价业务判断
          if (foundSymbol) {
            const parts = condExpress.split(foundSymbol) // 使用 ">" 符号拆分字符串
            const leftValue = parts[0] // 提取 ">" 符号左边的值
            const rightValue = parts[1] // 提取 ">" 符号右边的值
            console.log(leftValue)
            console.log(rightValue)
            // if (leftValue == 'numCode') {
            //   const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // } else {
            //   const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // }
            if (result) {
              let query = {
                businessCode: 'b002',
                condList
              }
              busApprovalFlowTree(query).then((res) => {
                console.log(res, '树详情')
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
            businessCode: 'b002',
            condList
          }
          busApprovalFlowTree(query).then((res) => {
            console.log(res, '树详情')
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

    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b023')
        .then((res) => {
          console.log(res, 'res123')
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
  padding: 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  padding-top: 5px;
  /* padding: 0 20px; */
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
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
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
</style>
