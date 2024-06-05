<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="dialogTitle + `询价单`" />
          <div class="options" v-if="type != 'look'">
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提交</el-button>
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

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="供应商" prop="supplierName" ref="supplierName">
                      <el-input v-model="dataForm.supplierName" placeholder="请输入供应商名称"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="询价日期" prop="inquiryDate" ref="inquiryDate">
                      <!-- <el-input v-model="dataForm.inquiryDate" placeholder="请选择询价日期" clearable
                        :style='{ "width": "100%" }' maxlength="20" :disabled="type == 'look'"></el-input> -->
                      <el-date-picker v-model="dataForm.inquiryDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择询价日期" :disabled="type == 'look' ? true : false">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="报价有效期" prop="effectiveDate" ref="effectiveDate">
                      <!-- <el-input v-model="dataForm.effectiveDate" placeholder="请选择报价有效期" clearable
                        :style='{ "width": "100%" }' maxlength="20" :disabled="type == 'look'"></el-input> -->

                      <el-date-picker v-model="dataForm.effectiveDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择报价有效期" :disabled="type == 'look' ? true : false">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="报价人" prop="bidder" ref="bidder">
                      <el-input v-model="dataForm.bidder" placeholder="请输入报价人" clearable :style='{ "width": "100%" }'
                        maxlength="20" :disabled="type == 'look'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="电话" prop="phone" ref="phone">
                      <el-input v-model="dataForm.phone" placeholder="请输入电话" clearable :style='{ "width": "100%" }'
                        maxlength="20" :disabled="type == 'look'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="传真" prop="fax" ref="fax">
                      <el-input v-model="dataForm.fax" :placeholder="type == 'look' ? '' : '请输入传真'" clearable
                        :style='{ "width": "100%" }' maxlength="20" :disabled="type == 'look'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :xs="24">
                    <el-form-item label="地址" prop="address" ref="address">
                      <el-input type="textarea" :row="3" v-model="dataForm.address" placeholder="请输入地址" clearable
                        :style='{ "width": "100%" }' maxlength="300" :disabled="type == 'look'"></el-input>
                    </el-form-item>
                  </el-col>


                  <el-col :sm="12" :xs="24">
                    <el-form-item label="备注" prop="remark" ref="remark">
                      <el-input type="textarea" :row="3" v-model="dataForm.remark"
                        :placeholder="type == 'look' ? '' : '请输入备注'" clearable :style='{ "width": "100%" }'
                        maxlength="200" :disabled="type == 'look'"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>
              <div v-if="type !== 'look'">
                <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                  icon="el-icon-plus" :disabled="type == 'look' ? true : false"
                  @click="openSeleceProductDialog()">选择产品</el-button>|
                <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                :disabled="type == 'look'" @click="addtable()">导入产品</el-button>|
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                icon="el-icon-download" :disabled="type == 'look'" @click="downLoadTemplate">下载模板</el-button>|
                <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                  :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
              </div>

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                <el-table style="border: 1px solid #e3e7ee;" @selection-change="handeleProductInfoData" hasC hasNO fixedNO
                  v-bind="dataFormTwo.data" :data="dataFormTwo.data" id="table">
                  <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type != 'look'" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                  <el-table-column prop="productsName" label="产品名称" key="productsName">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productsName'"
                        :rules='productRules.productsName'>
                        <!-- <el-input v-model="scope.row.productsName" disabled readonly maxlength="20" placeholder="产品名称">{{
                              scope.row.productsName }}
                            </el-input> -->
                        <div class="viewData">
                          <span>{{ scope.row.productsName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productsDrawingNo" label="产品图号" key="productsDrawingNo">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productsDrawingNo'">

                        <div class="viewData">
                          <span>{{ scope.row.productsDrawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="materialPrice" label="产品价格" key="materialPrice">
                    <template slot="header">
                      <span class="required">*</span>产品价格
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'materialPrice'"
                        :rules='productRules.materialPrice'>
                        <el-input v-model="scope.row.materialPrice" maxlength="20" :disabled="type === 'look'"
                          placeholder="请输入产品价格">{{
                            scope.row.materialPrice }}
                        </el-input>
                      </el-form-item>

                    </template>
                  </el-table-column>

                  <el-table-column prop="taxRate" label="税率" key="taxRate">
                    <template slot="header">
                      <span class="required">*</span>税率%
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'" :rules='productRules.taxRate'>
                        <el-input oninput="value = value.replace(/\D/g,'')" v-model="scope.row.taxRate"
                          :disabled="type === 'look'" maxlength="2" placeholder="请输入税率">{{
                            scope.row.taxRate }}
                        </el-input>
                      </el-form-item>

                    </template>
                  </el-table-column>

                  <el-table-column prop="remark" label="备注" min-width="220" key="remark">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" :disabled="type === 'look'" maxlength="20"
                        :placeholder="type == 'look' ? '' : '请输入备注'">{{
                          scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="180" fixed="right" v-if="type != 'look'">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="type === 'look'"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>

                    </template>
                  </el-table-column>
                </el-table>
              </el-form>


            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"></UploadWj>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
    <Product-dialog :multiple='multiple' v-if="productVisibled" ref="productRef"
      @productsSubmit="productsSubmit"></Product-dialog>
      <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
        :http-request="UploadProduct" />
    <!-- <SupplierDialog ref="SupplierRef" @supplierdata="supplierdata" /> -->
  </div>
</template>
<script>


import { getCooperativeData } from '@/api/basicData/index'  //供应商数据
import ProductDialog from './product-dialog.vue'
// import SupplierDialog from './supplier-dialog.vue'
import { mapState } from 'vuex'
import { getbuyInquirySheetDetail, addbuyInquirySheet, editbuyInquirySheet,linesBuyInquiryUploadData } from '@/api/purchasingManagement/purchaseInquirySheet'  // 询价单
export default {
  components: {
    ProductDialog,
    // SupplierDialog,
  },
  data() {
    return {
      getCooperativeData,
      datafilelist: [],
      activeName: 'jcInfo',
      dialogTitle: '',
      multiple: true,
      productVisibled: false,
      loading: false,
      btnLoading: false,
      organizeIdTree: [],
      index: null,

      dataFormTwo: {
        data: []
      },

      inquirySheetId: '',  //询价单id
      dataForm: {
        id: "",
        address: "",
        bidder: "",  // 报价人

        effectiveDate: "", //报价有效期
        fax: "",           // 传真
        id: 0,
        inquiryDate: "",    //询价日期
        orderNo: "",        // 单号
        phone: "",
        remark: "",
        supplierName: ""    //供应商名称
        // buyInquirySheetLineList: [        // dataFormTwo参数
        //   {
        //     active: false,
        //     id: 0,
        //     inquirySheetId: 0,    // 询价id
        //     materialPrice: 0,     //材料价格
        //     productsId: 0,        //产品id
        //     remark: "",
        //     taxRate: 0          //税率
        //   }
        // ]
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
        supplierName: [
          { required: true, message: '请输入供应商名称', trigger: ['blur'] },
          // { validator: this.formValidate('fullName', '请输入供应商名称'), trigger: 'blur' },

        ],
        inquiryDate: [{ required: true, message: '请选择询价日期', trigger: ['change'] }],
        effectiveDate: [{ required: true, message: '请选择报价有效期', trigger: ['change'] }],
        bidder: [{ required: true, message: '请输入报价人', trigger: ['blur'] }],
        address: [{ required: true, message: '请输入地址', trigger: ['blur'] }],
        phone: [
          { required: true, message: '请输入电话', trigger: ['blur'] },
          //  { validator: this.formValidate('iphone', '请输入您的电话'), trigger: 'blur' },
        ],
      },
      productRules: {
        productsName: [{ required: true, trigger: ['change'] }],
        materialPrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('产品价格：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('产品价格：不能为0') }), trigger: 'blur' }
        ],
        taxRate: [
          { required: true, trigger: ['blur'] },
          //  { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('税率' + errMsg) }] }), trigger: 'blur' }
        ],
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      pool: '',

    }
  },
  created() {
  },
  computed: {
    ...mapState('user', ['token']),
  },
  methods: {
    // openDialog() {
    //   this.$refs['SupplierRef'].openDialog()
    // },
    // supplierdata(data) {
    //   console.log(data, '供应商数据');
    //   if (data.length === 0) {
    //     this.$refs['elForm'].validateField('supplierName')
    //   } else {
    //     this.$refs['elForm'].fields[0].resetField()
    //     this.dataForm.supplierName = data.name

    //   }
    // },
    onOrganizeChange(val, data, param) {
      if (!data) return
      this.$nextTick(()=>{
        this.$refs['elForm'].validateField('supplierName')
      })
      if (data.length === 0) {
      } else {
        // this.$refs['elForm'].fields[0].resetField()
        this.dataForm.supplierName = data[0].name

      }
    },
    // 产品弹窗
    openSeleceProductDialog() {
      this.productVisibled = true
      this.$nextTick(() => {
        this.$refs.productRef.initData2()
      })
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
    // 选中的产品信息
    handeleProductInfoData(val) {
      this.productArr = val
    },
    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
      if (this.pool == 'quiryPool') {
        this.$emit('closePool', true)
      }
    },
    init(id, type, pool, quiryData) {
      console.log(id, type);
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.pool = pool
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type

      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (type == 'add') {
          // 获取当前日期
          const currentDate = new Date();

          // 获取年份
          const year = currentDate.getFullYear();

          // 获取月份（注意月份从0开始，所以要加1）
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');

          // 获取日期
          const date = String(currentDate.getDate()).padStart(2, '0');

          // 拼接为YYYY-MM-DD格式
          const formattedDate = `${year}-${month}-${date}`;

          console.log("this.dataForm", this.dataForm);
          this.$set(this.dataForm, 'inquiryDate', formattedDate)
        }
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          getbuyInquirySheetDetail(this.dataForm.id).then(res => {
            console.log(res, '详情');
            this.dataForm = {
              id: res.data.id,
              address: res.data.address,
              bidder: res.data.bidder,  // 报价人
              effectiveDate: res.data.effectiveDate, //报价有效期
              fax: res.data.fax,           // 传真
              inquiryDate: res.data.inquiryDate,    //询价日期
              orderNo: res.data.orderNo,        // 单号
              phone: res.data.phone,
              remark: res.data.remark,
              supplierName: res.data.supplierName   //供应商名称
            }
            this.dataFormTwo.data = res.data.buyInquirySheetLineVOList
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
          })
        }
        if (pool == 'quiryPool') {
          this.dataFormTwo.data = quiryData
        }
      })
    },
    addtable() {
        // 导入产品，获取数据渲染
        if (this.dataFormTwo.data.length) {
          this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).then(() => {
            this.$refs.UploadProduct.$el.querySelector('input').click()
              // 审批
          // this.$nextTick(() => { this.getApproverData() })
          }).catch(() => { })
        } else {
          this.$refs.UploadProduct.$el.querySelector('input').click()
          // 审批
          // this.$nextTick(() => { this.getApproverData() })
        }
    },
     // 上传产品
     UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data.file)
      //调用上传文件接口
      linesBuyInquiryUploadData(formData).then(res => {
        this.$message.success(`数据更新成功`)
        this.dataFormTwo.data = res.data
        this.dataFormTwo.data.map(item=>{
          return item.productsDrawingNo = item.drawingNo
        })
        this.dataFormTwo.data.map(item=>{
          return item.productsName = item.productName
        })
        this.dataFormTwo.data.map(item=>{
          return item.materialPrice = item.productPrice
        })
        this.formLoading = false
        this.loadingText = ''
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/询价导入模板.xlsx')
      a.click()
    },
    // 表单提交
    dataFormSubmit() {
      this.request()
    },

    async request() {
      let _data
      this.btnLoading = true
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
        _data = {
          attachmentList: this.datafilelist,
          buyInquirySheet: this.dataForm,
          buyInquirySheetLineList: this.dataFormTwo.data
        }
      }
      if (this.type === 'edit' || this.type === 'look') {
        this.dataFormTwo.data.forEach((item, index) => {
          this.dataFormTwo.data[index].inquirySheetId = this.dataForm.id
        })
        _data = {
          attachmentList: this.datafilelist,
          buyInquirySheet: this.dataForm,
          buyInquirySheetLineList: this.dataFormTwo.data
        }
      }
      console.log(_data, '参数')

      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      // if (!valid_2) {
      //   console.log(1);
      //   this.btnLoading = false
      //   return
      // } else {
      //   this.btnLoading = true
      // }
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (this.dataFormTwo.data.length === 0) {
            this.$message.error('请至少选择一项产品')
            this.btnLoading = false
          } else {
            if (!valid_2) {
              this.btnLoading = false
              for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                const item = this.dataFormTwo.data[i]
                if (!item.materialPrice) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的产品价格',
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

              }
              return
            } else {
              this.btnLoading = true
              if (!this.dataForm.id) {
                addbuyInquirySheet(_data).then(res => {
                  if (res.msg === 'Success') res.msg = '提交成功'
                  this.$message({
                    message: res.msg,
                    type: 'success',
                    duration: 1000,
                    onClose: () => {

                      this.btnLoading = false
                      this.$emit('close', true)
                      if (this.pool == 'quiryPool') {
                        this.$emit('closePool', true)
                      }
                    }
                  })

                }).catch(() => {
                  this.btnLoading = false
                })
              } else {
                editbuyInquirySheet(_data).then((res) => {
                  if (res.msg === 'Success') res.msg = '提交成功'
                  this.$message({
                    message: res.msg,
                    type: 'success',
                    duration: 1000,
                    onClose: () => {

                      this.btnLoading = false
                      this.$emit('close', true)
                      if (this.pool == 'quiryPool') {
                        this.$emit('closePool',true)
                      }
                    }
                  })
                }).catch(() => {
                  this.btnLoading = false
                })
              }
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
    },
    //  选择产品弹框传递的数据
    productsSubmit(data) {
      if (this.dataFormTwo.data.length) {
        // this.dataFormTwo.data = this.dataFormTwo.data.filter(item => {
        //   return !data.some(element => element.productsId === item.productsId);
        // });
        const deletedArray = [];
        data = data.filter(item1 => {
          const index = this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId);
          if (index !== -1) {
            deletedArray.push(item1.productsName);
            if (deletedArray.length) {
              this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
            }
            return false;
          }
          return true;
        });
        console.log(data, '删除后的数据');
        console.log(deletedArray, '被删掉的数据');
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data,]
      console.log(this.dataFormTwo.data, '传递数据');
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

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>