<template>
  <!-- <div> -->
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="type != 'look' ? '设置牌价' : '查看牌价'" />
        <div class="options" v-if="type != 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            {{ $t('common.submitButton') }}</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="listLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                 <h5>基本信息</h5>
            </div>
            <el-row :gutter="15" class="">
              <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="top">

                <el-col :span="12">
                  <el-form-item label="供应商名称" prop="cooperativePartnerName" ref="cooperativePartnerName">
                    <el-input disabled v-model="dataForm.cooperativePartnerName" placeholder="请选择供应商名称">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="供应商编码" prop="cooperativePartnerCode" ref="cooperativePartnerCode">
                    <el-input disabled v-model="dataForm.cooperativePartnerCode" placeholder="请选择供应商编码" readonly>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-form>

            </el-row>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>

            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
              <el-table style="border: 1px solid #e3e7ee;" v-bind="dataFormTwo.data" :data="dataFormTwo.data" id="table" border>
                <!-- <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" /> -->
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                <el-table-column prop="productsCode" label="产品编码" min-width="140" show-overflow-tooltip />
                <el-table-column prop="productsName" label="产品名称" min-width="140" show-overflow-tooltip />
                <el-table-column prop="drawingNo" label="型号" min-width="160" show-overflow-tooltip />
                <el-table-column prop="spec" label="规格型号" min-width="160" show-overflow-tooltip />

                <el-table-column prop="bargaining" label="协议价" min-width="140">
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'bargaining'">
                      <div class="viewData">
                        <span>{{ scope.row.bargaining }}</span>
                      </div>
                    </el-form-item>

                  </template>
                </el-table-column>

                <el-table-column prop="taxRate" label="税率" min-width="140">
                  <!-- <template slot="header">
                      <span class="required">*</span>税率(%)
                    </template> -->
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                      <!-- <el-input v-model="scope.row.taxRate" readonly disabled maxlength="20" placeholder="请输入税率">{{
                          scope.row.taxRate }}
                        </el-input> -->
                      <div class="viewData">
                        <span>{{ scope.row.taxRate }}</span>
                      </div>
                    </el-form-item>

                  </template>
                </el-table-column>
                <el-table-column prop="excludingTaxPrice" label="不含税价" min-width="180">
                  <!-- <template slot="header">
                      <span class="required">*</span>不含税价
                    </template> -->
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'excludingTaxPrice'">
                      <!-- <el-input v-model="scope.row.excludingTaxPrice" readonly disabled maxlength="20"
                          placeholder="请输入不含税价">{{
                            scope.row.excludingTaxPrice }}
                        </el-input> -->
                      <div class="viewData">
                        <span>{{ scope.row.excludingTaxPrice }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                
                <el-table-column prop="listPriceCoefficient" label="系数" min-width="180">
                  <template slot="header">
                    <span class="required">*</span>系数
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'listPriceCoefficient'"
                      :rules='productRules.listPriceCoefficient'>
                      <el-input v-model="scope.row.listPriceCoefficient"
                        @input="changeListPriceCoefficient(scope.$index, scope.row.listPriceCoefficient)"
                        :disabled="type === 'look'" maxlength="20" placeholder="请输入系数">{{
                          scope.row.listPriceCoefficient }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                
                <el-table-column prop="listPrice" label="牌价" min-width="180">
                  <template slot="header">
                    <span class="required">*</span>牌价
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'listPrice'" :rules='productRules.listPrice'>
                      <el-input v-model="scope.row.listPrice" :disabled="type === 'look'"
                        @input="changeListPrice(scope.$index, scope.row.listPrice)" maxlength="20" placeholder="请输入牌价">{{
                          scope.row.listPrice }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>


                <!-- :rules='productRules.orderProportion' -->
                <el-table-column prop="orderProportion" label="订购比例" min-width="180">
                  <template slot="header">
                    <span class="required">*</span>订购比例(%)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'orderProportion'">
                      <!-- <el-input readonly v-model="scope.row.orderProportion" disabled maxlength="5"
                          placeholder="请输入订购比例">
                        </el-input> -->
                      <div class="viewData">
                        <span>{{ scope.row.orderProportion }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="targetPrice" label="目标价" min-width="180">
                  <!-- <template slot="header">
                      <span class="required">*</span>目标价
                    </template> -->
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'targetPrice'">
                      <!-- <el-input v-model="scope.row.targetPrice" readonly disabled maxlength="20" placeholder="请输入目标价">{{
                          scope.row.targetPrice }}
                        </el-input> -->
                      <div class="viewData">
                        <span>{{ scope.row.targetPrice }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="historicalPrice" label="历史价格" min-width="180">
                  <!-- <template slot="header">
                      <span class="required">*</span>历史价格
                    </template> -->
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'historicalPrice'">
                      <!-- <el-input v-model="scope.row.historicalPrice" readonly disabled maxlength="20"
                          placeholder="请输入历史价格">{{
                            scope.row.historicalPrice }}
                        </el-input> -->
                      <div class="viewData">
                        <span>{{ scope.row.historicalPrice }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="effectiveTimeStart" label="有效起始时间" min-width="240">
                  <template slot="header">
                    <span class="required">*</span>有效起始时间
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'effectiveTimeStart'">
                      <el-date-picker v-model="scope.row.effectiveTimeStart" readonly type="date"
                        value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择有效起始时间" disabled>
                      </el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="effectiveTimeEnd" label="有效结束时间" min-width="240">
                  <template slot="header">
                    <span class="required">*</span>有效结束时间
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'effectiveTimeEnd'">
                      <el-date-picker v-model="scope.row.effectiveTimeEnd" readonly type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择有效结束时间" disabled>
                      </el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>

                <!-- <el-table-column prop="contrastProductsName" label="对比物料" min-width="200" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'contrastProductsName'">
                      <div class="viewData">
                        <span>{{ scope.row.contrastProductsName }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="contrastProductsPrice" label="对比物料价格" min-width="200">

                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'contrastProductsPrice'">
                      <div class="viewData">
                        <span>{{ scope.row.contrastProductsPrice }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column> -->

                <el-table-column prop="remark" label="备注" min-width="140">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" maxlength="20" :disabled="type === 'look'" placeholder="请输入备注">{{
                      scope.row.remark }}
                    </el-input>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <!-- <el-button v-if="type != 'edit'" type="text" class="JNPF-table-delBtn" :disabled="type === 'edit'"
                            @click="delequipment_process_relList(scope.$index)">删除</el-button> -->
                    <el-button :disabled="scope.row.cooperativePartnerProducts.length === 0" type="text"
                      @click="handlerOpenSource(scope.$index, 'look', scope.row.orderProportion)">配置订购比例</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <SourceArea v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm" />
    </div>
  </transition>
  <!-- <Product-dialog v-if="contrastProductsVisibled" ref="contrastProductsRef" @productSubmit="productSubmit"></Product-dialog> -->
  <!-- <Products-dialog v-if="productVisibled" ref="productRef" @productsSubmit="productsSubmit"></Products-dialog> -->
  <!-- <SupplierDialog ref="SupplierRef" @supplierdata="supplierdata" /> -->
  <!-- </div> -->
</template>
<script>


import { getCooperativeData } from '@/api/basicData/index'  //供应商数据
import SourceArea from './source.vue'
import formValidate from "@/utils/formValidate";
import { getbuyFixedPointPricingDetail, addbuyFixedPointPricing, modifyListPrice } from '@/api/purchasingManagement/purchaseInquirySheet'  // 询价单
export default {
  components: {
    SourceArea
  },
  data() {
    return {
      getCooperativeData,
      activeName: 'jcInfo',
      dialogTitle: '',
      contrastProductsVisibled: false,
      productVisibled: false,
      loading: false,
      btnLoading: false,
      organizeIdTree: [],
      index: null,
      sourceVisibled: false,
      dataFormTwo: {
        data: []
      },
      listLoading: true,
      inquirySheetId: '',  //询价单id
      dataForm: {
        approvalCompletionDate: "",       //审批完成时间
        approvalStatus: "",               // 审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerId: 0,          //  供应商id
        cooperativePartnerName: '',                  //  供应商名称
        cooperativePartnerCode: '',
        createBy: "",                     //
        documentStatus: "",               //  单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
        id: 0,        //
        listPriceFlag: 0,                 //是否设置牌价:0否1是
        orderNo: "",        //
        reasonRejection: "",              //驳回理由
        submitDate: "",                   //
      },
      requestObj2: {
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,
        pageSize: -1,
        type: 'supplier',
      },
      type: "",
      dataFormArr: [],
      rules: {
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }],
      },
      productRules: {
        listPrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 8, "", (errMsg) => { this.$message.error('牌价' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('牌价：不能为0') }), trigger: 'blur' }
        ],
        listPriceCoefficient: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('牌价系数' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('牌价系数：不能为0') }), trigger: 'blur' }
        ],
        orderProportion: [{ required: true, trigger: ['change'] }, { validator: formValidate({ type: 'decimal', params: [5, 2, "", (errMsg) => { this.$message.error('订购比例:' + errMsg) }], trigger: ['change'] }) }, { validator: this.maxLength(), trigger: ['change'] },],
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      sourceData: [],
      currntIndex: '',
      defaultVal: false,
    }
  },
  created() {
  },
  watch: {

  },

  methods: {
    // 订购比例资源
    handlerOpenSource(index, type, orderProportion) {
      this.currntIndex = index
      this.sourceVisibled = true
      let data = []

      console.log(this.defaultVal,'asdjaskd');
      if (this.dataFormTwo.data[index].cooperativePartnerProducts) {
        if (!this.defaultVal) {
          this.dataFormTwo.data.forEach(item => {
            if (item.cooperativePartnerProducts.length) {
              item.cooperativePartnerProducts.forEach(item2 => {
                item2.orderProportion = ''
                this.defaultVal = true
              })
            }
          })
        }
        this.sourceData[0].orderProportion = orderProportion
        data = [...this.sourceData, ...this.dataFormTwo.data[index].cooperativePartnerProducts]
      }
      // this.defaultVal = false
      console.log(data);
      this.$nextTick(() => {
        this.$refs['sourceRef'].init(data, this.type)
      })
    },
    // 抽屉提交
    handlerConfirm(data) {
      console.log('1111111111111111111111111')
      console.log(data, '资源资源数据');
      data.forEach(item => {
        if (item.cooperativePartnerName === this.dataForm.cooperativePartnerName) {
          this.dataFormTwo.data[this.currntIndex].orderProportion = item.orderProportion
        }
      })
      this.dataFormTwo.data[this.currntIndex].orderProportionList = data
      // this.dataFormTwo[this.currntIndex].bimRoutingProcessResourceDTOList = data
      this.sourceVisibled = false
      console.log(this.dataFormTwo.data)
    },
    // 订购比例校验
    maxLength() {
      return (rule, value, callback) => {
        let msg = '比例不能超过100'
        if (value === '') { callback() }
        else {
          if (value * 1 > 100) {
            // callbackMethod(msg)
            this.$message.error(msg)
            callback(new Error(msg));
          } else {
            callback()
          }
        }
      };
    },
    // 去除系数后两位的小数位
    numberFormat(number) {
      console.log(number);
      var formatted = parseFloat(number).toFixed(2).replace(/\.?0+$/, "");
      console.log(formatted, '8888');
      if (isNaN(formatted)) {
        return 0
      } else {
        return formatted;
      }

    },
    // 牌价输入事件
    changeListPrice(index, val) {
      // 牌价系数的值
      this.dataFormTwo.data[index].listPriceCoefficient = this.numberFormat(val / this.dataFormTwo.data[index].bargaining)
    },
    // 牌价系数输入事件
    changeListPriceCoefficient(index, val) {
      console.log(this.productRules.listPriceCoefficient);
      if (this.productRules.listPriceCoefficient) {
        this.dataFormTwo.data[index].listPrice = this.numberFormat(val * this.dataFormTwo.data[index].bargaining)
      }
    },
    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.listLoading = true
      this.$emit('close', true)
    },
    init(id, type) {
      console.log(id, type);
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          getbuyFixedPointPricingDetail(this.dataForm.id).then(res => {
            console.log(res, '详情');
            this.listLoading = false
            this.dataForm = {
              id: res.data.id,
              cooperativePartnerCode: res.data.cooperativePartnerCode,
              approvalCompletionDate: res.data.approvalCompletionDate,
              cooperativePartnerName: res.data.cooperativePartnerName, //  供应商名称
              cooperativePartnerId: res.data.cooperativePartnerId,          //  供应商id
              documentStatus: res.data.documentStatus,               //  单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
              approvalStatus: res.data.approvalStatus,
              listPriceFlag: res.data.listPriceFlag,                 //是否设置牌价:0否1是
              orderNo: res.data.orderNo,        //单号
              orderProportion: ''
            }
            this.dataFormTwo.data = res.data.buyFixedPointPricingLineVOList
            this.sourceData.push(this.dataForm)
            this.dataFormTwo.data.forEach((item, index) => {
              item.listPriceCoefficient=2.5
              item.listPrice=this.numberFormat(item.bargaining*item.listPriceCoefficient)
              if (item.cooperativePartnerProducts.length === 0) {
                this.dataFormTwo.data[index].orderProportion = 100
              } else {
                // item.cooperativePartnerProducts.forEach(item => {

                //   this.sourceData = [item, ...this.sourceData]
                // })
              }
            })

          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.request()
    },

    async request() {
      let _data
      let hasCostPrice = true
      this.btnLoading = true
      let isOk = true
      // this.dataForm.documentStatus = type
      // 选择物料之后 限制必须有物料价格的 否则无法提交
      console.log(this.dataFormTwo.data, '1111');

      this.dataFormTwo.data.forEach((item, index) => {
        if (item.contrastProductsName) {
          if (!item.contrastProductsPrice) {
            hasCostPrice = false
            this.btnLoading = false
            this.$message.error('请选择含有物料价格的产品')

          } else {

            hasCostPrice = true
          }
        }
        if (item.orderProportion === '' || item.orderProportion === null) {
          isOk = false
          this.btnLoading = false
          this.$message.error(`订购比例：请配置第${index + 1}行订购比例`)
        } else {
          isOk = true
          this.btnLoading = true
        }
      })
      console.log(isOk);
      // return
      console.log(this.dataFormTwo.data, '参数')
      if (this.type === 'edit' || this.type === 'look') {
        this.dataForm.listPriceFlag = 1
        _data = {
          buyFixedPointPricing: this.dataForm,
          buyFixedPointPricingLineList: this.dataFormTwo.data
        }
      }
      console.log(_data, '参数')

      // return
      let form_2 = this.$refs['productForm']
      console.log(form_2);
      let valid_2 = await form_2.validate().catch(err => false)
      console.log(valid_2);
      if (hasCostPrice) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.data.length === 0) {
              this.btnLoading = false
              this.$message.error('请至少选择一项产品')
            } else {
              if (!valid_2) {
                console.log(1);
                this.btnLoading = false
                for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                  const item = this.dataFormTwo.data[i]
                  if (!item.bargaining) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的协议价',
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

                  if (!item.excludingTaxPrice) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的不含税价',
                      duration: 1500,
                    })
                    break
                  }
                  if (!item.listPrice) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的牌价',
                      duration: 1500,
                    })
                    break
                  }
                  if (!item.listPriceCoefficient) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的牌价系数',
                      duration: 1500,
                    })
                    break
                  }
                  if (item.orderProportion === '') {
                    this.$message({
                      type: 'error',
                      message: '请配置第' + (i + 1) + '行的订购比例',
                      duration: 1500,
                    })
                    break
                  }
                  if (!item.effectiveTimeStart) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的有效起始时间',
                      duration: 1500,
                    })
                    break
                  }
                  if (!item.effectiveTimeEnd) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的有效结束时间',
                      duration: 1500,
                    })
                    break
                  }
                }
                return
              } else {
                if (isOk) {

                  this.btnLoading = true

                  if (!this.dataForm.id) {
                    addbuyFixedPointPricing(_data).then(res => {
                      if (res.msg === 'Success') res.msg = '提交成功'
                      this.$message({
                        message: res.msg,
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
                    modifyListPrice(_data).then((res) => {
                      if (res.msg === 'Success') res.msg = '提交成功'
                      this.$message({
                        message: res.msg,
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
                  }
                }

              }
            }
          } else {
            this.btnLoading = false
          }

        })
      }
    },

    // 删除项
    // delequipment_process_relList(index) {
    //   this.dataFormTwo.data.splice(index, 1)
    // },
    //  选择产品弹框传递的数据
    // productsSubmit(data) {
    //   // if (this.dataFormTwo.data.length) {
    //   //   this.dataFormTwo.data = this.dataFormTwo.data.filter(item => {
    //   //     return !data.some(element => element.productsId === item.productsId);
    //   //   });
    //   // }
    //   console.log(data, '传递数据1111');
    //   this.dataFormTwo.data = [...this.dataFormTwo.data, ...data,]
    //   console.log(this.dataFormTwo.data, '传递数据');
    // },
    // 对比物料弹窗传递数据
    // productSubmit(data) {
    //   console.log(data, '对比物料数据');
    //   this.dataFormTwo.data[this.index].contrastProductsId = data.id
    //   this.dataFormTwo.data[this.index].contrastProductsName = data.contrastProductsName
    //   this.dataFormTwo.data[this.index].contrastProductsPrice = data.contrastProductsPrice
    // },

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

.viewData {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>