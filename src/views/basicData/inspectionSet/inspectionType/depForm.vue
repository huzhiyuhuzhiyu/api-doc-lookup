<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btntype ? 'noButtons' : '']">
        <el-page-header @back="handleClose" :content="!dataForm.id ? '新建检验类型' : btntype ? '查看检验类型' : '编辑检验类型'" />
        <div class="options" v-if="!btntype">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            保存并提交
          </el-button>
          <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <!-- <el-tab-pane label="检验信息" name="orderInfo"> -->
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
              <el-form ref="dataForm" :model="dataForm" :rules="dataRules" label-width="160px" label-position="top">
                <el-row :gutter="30" class="custom-row">
                  <el-col :span="12">
                    <el-form-item label="检验类型编码" prop="code">
                      <el-input v-model="dataForm.code" placeholder="请输入类型编码" maxlength="20"
                        :disabled="btntype ? true : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true ? false : true" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="检验类型名称" prop="name">
                      <el-input v-model="dataForm.name" placeholder="请输入类型名称" maxlength="50"
                        :disabled="btntype ? true : false" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="btntype && dataForm.inspectionType === 'product'">
                    <el-form-item label="品名规格" prop="productDrawingNo">
                      <el-input v-model.trim="dataForm.productDrawingNo" placeholder="请输入品名规格"
                        :disabled="btntype ? true : false" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="检验种类" prop="inspectionCategory">
                      <el-select v-model="dataForm.inspectionCategory" placeholder="请选择检验种类" style="width: 100%;"
                        :disabled="btntype ? true : false" @change="changeType1">
                        <el-option v-for="(item, index) in inspectionTypeList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="类型名称" prop="inspectionType">
                      <el-select @change="changeType" v-model="dataForm.inspectionType" placeholder="请选择类型名称"
                        style="width: 100%;" :disabled="btntype ? true : false">
                        <el-option v-for="(item, index) in typeList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="dataForm.inspectionType === 'product'">
                    <el-form-item label="产品名称" prop="productName">
                      <ComSelect-page :searchList="ProductTableSearchList" :isdisabled="btntype ? true : false"
                        v-model="dataForm.productName" placeholder="请选择产品名称" auth @change="onOrganizeChange"
                        :title="'选择产品'" :listMethod="getProductList" :requestObj="requestObj"
                        :methodArr="ProductMethodArr" :listRequestObj="ProductListRequestObj"
                        :tableItems="ProductTableItems" treeTitle="产品分类" :paramsObj="{}" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="btntype && dataForm.inspectionType === 'product'">
                    <el-form-item label="产品编码" prop="productCode">
                      <el-input v-model.trim="dataForm.productCode" placeholder="请输入产品编码"
                        :disabled="btntype ? true : false" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="dataForm.inspectionType === 'product_category'">
                    <el-form-item label="产品分类名称" prop="productCategoryName">
                      <ComSelect-list :isdisabled="btntype ? true : false" :value="dataForm.productCategoryName"
                        placeholder="请选择产品分类" auth @change="onOrganizeChangeThree" :title="'选择产品分类'"
                        :method="getcategoryTree" :requestObj="productParams" :paramsObj="{}" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="btntype && dataForm.inspectionType === 'product_category'">
                    <el-form-item label="产品分类编码" prop="productCategoryCode">
                      <el-input v-model.trim="dataForm.productCategoryCode" placeholder="请输入产品分类编码"
                        :disabled="btntype ? true : false" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input type="textarea" v-model.trim="dataForm.remark" placeholder="请输入备注" maxlength="200"
                        :disabled="btntype ? true : false" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>

            <el-collapse-item title="项目信息" name="productInfo">
              <div v-if="!btntype">
                <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                  icon="el-icon-plus" :disabled="btntype ? true : false" @click="openSeleceProductDialog">
                  选择项目
                </el-button>
                |
                <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
                <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                  :disabled="btntype ? true : false" icon="el-icon-delete" @click="batchDelete">
                  批量删除
                </el-button>
                |
              </div>
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                <el-table ref="product" :data="dataFormTwo.productData" hasC hasNO fixedNO
                  @selection-change="handeleProductInfoData">
                  <el-table-column type="selection" width="60" fixed="left" align="center" v-if="!btntype" key="1" />
                  <el-table-column type="index" width="60" label="序号" align="center" key="21" />
                  <el-table-column prop="inspectionItemsCode" label="项目编码" min-width="160" key="22">
                    <template slot-scope="{ row }">
                      <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                        <el-form-item prop="inspectionItemsCode" :style="row.cssObj" ref="inspectionItemsCode">
                          <el-input disabled v-model="row.inspectionItemsCode" placeholder="请选择项目编码" clearable
                            maxlength="20"></el-input>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="inspectionItemsIdText" label="项目名称" min-width="160" key="23"></el-table-column>
                  <el-table-column prop="inspectionBasis" label="检验要求" min-width="160" key="24">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.inspectionBasis" placeholder="请输入检验要求"
                        :disabled="btntype || scope.row.inspectionMethod == 'measure'" maxlength="200"
                        show-overflow-tooltip />
                    </template>
                  </el-table-column>
                  <el-table-column prop="normalValue" label="正常值" width="180" key="25">
                    <!-- <template slot="header">
                    <span class="required">*</span>正常值
                  </template> -->
                    <template slot-scope="scope">
                      <el-form-item :prop="'productData.' + scope.$index + '.' + 'normalValue'"
                        :rules="productRules.normalValue">
                        <el-input v-model="scope.row.normalValue" placeholder="请输入正常值"
                          :disabled="btntype || scope.row.inspectionMethod == 'other'" maxlength="11"
                          style="width: 155px;">
                          {{ scope.row.normalValue }}
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="minimum" label="最低值" width="180" key="26">
                    <!-- <template slot="header">
                    <span class="required">*</span>最低值
                  </template> -->
                    <template slot-scope="scope">
                      <el-form-item :prop="'productData.' + scope.$index + '.' + 'minimum'"
                        :rules="productRules.minimum">
                        <el-input v-model="scope.row.minimum" placeholder="请输入最低值"
                          :disabled="btntype || scope.row.inspectionMethod == 'other'" maxlength="11"
                          style="width: 155px;">
                          {{ scope.row.minimum }}
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="maximum" label="最高值" width="180" key="27">
                    <!-- <template slot="header">
                    <span class="required">*</span>最高值
                  </template> -->
                    <template slot-scope="scope">
                      <el-form-item :prop="'productData.' + scope.$index + '.' + 'maximum'"
                        :rules="productRules.maximum">
                        <el-input v-model="scope.row.maximum" placeholder="请输入最高值"
                          :disabled="btntype || scope.row.inspectionMethod == 'other'" maxlength="11"
                          style="width: 155px;">
                          {{ scope.row.maximum }}
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="60" v-if="!btntype" key="28">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="btntype ? true : false"
                        v-if="!btntype" @click="deltable(scope.$index)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <!-- </el-tab-pane> -->
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="onOrganizeChangeTwo" :tableItems="ProductTableItemss" title="选择项目"
        :listMethod="getBimInspectionItemsList" :listRequestObj="requestObj" :searchList="searchList" :multiple="true"
        :renderTree="false" :elementShow="false" />
    </div>
  </transition>
</template>

<script>
import {
  addbimInspectionType,
  editbimInspectionType,
  bimInspectionTypedetail,
  checkBimInspectionTypeCode,
  checkBimInspectionItemsCode,
  getBimInspectionItemsList,
  getbimInspectionTypelist
} from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree, getcategoryList } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
export default {
  data() {
    return {
      activeNames: ['productInfo', 'basicInfo'],
      getBimInspectionItemsList,
      getProductList,
      getcategoryList,
      getcategoryTree,
      visible: false,
      formLoading: false,
      btnLoading: false,
      codeConfig: {},
      searchList: [
        { prop: 'code', label: '项目编码', type: 'input' },
        { prop: 'name', label: '项目名称', type: 'input' }
        // { prop: "inspectionMethod", label: "检验方式", type: 'select', options: [{ label: '其他', value: 'other' }, { label: '测量', value: 'measure' }] }
      ],
      inspectionTypeList: [
        { label: '采购收货检验', value: 'procure' },
        { label: '外协收货检验', value: 'external' },
        { label: '销售退货检验', value: 'sale_back' },
        { label: '外协退料检验', value: 'back_material' },
        { label: '生产退料检验', value: 'produce' },
        { label: '生产巡检', value: 'process' },
        { label: '生产完工检验', value: 'finished' }
      ],
      productRules: {
        maximum: [{ validator: this.calcValidate(), trigger: 'blur' }],
        normalValue: [{ validator: this.calcValidate(), trigger: 'blur' }],
        minimum: [{ validator: this.calcValidate(), trigger: 'blur' }]
      },
      ProductTableItemss: [
        { prop: 'code', label: '项目编码' },
        { prop: 'name', label: '项目名称' },
        { prop: 'inspectionBasis', label: '检验要求' },
        { prop: 'normalValue', label: '正常值' },
        { prop: 'maximum', label: '最大值' },
        { prop: 'minimum', label: '最小值' }
      ],
      typeList: [
        {
          label: '通用检验',
          value: 'common'
        },
        {
          label: '产品分类检验',
          value: 'product_category'
        },
        {
          label: '产品检验',
          value: 'product'
        }
      ],
      productParams: {
        code: '',
        classAttribute: 'material',
        // classAttributeList:["raw_material", "semi_finished", "finish_product", "accessories"],
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: -1
      },
      productName: '', //产品名称
      productCategoryName: '', // 产品分类名称
      ProductMethodArr: [
        {
          label: '物料分类',
          classAttribute: 'material',
          method: getcategoryTree,
          requestObj: { classAttribute: 'material' }
        }
      ],
      ProductListRequestObj: {
        classAttribute: '',
        classAttributeList: ['raw_material', 'semi_finished', 'finish_product', 'accessories'],
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
        pageSize: 20,
        productStatus: 'enable'
      },
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'spec', label: '规格型号' },
        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeText', label: '产品分类' },
        { prop: 'mainUnit', label: '主单位' }
      ],
      ProductTableSearchList: [
        { prop: 'code', label: '产品编码', type: 'input' },
        { prop: 'name', label: '产品名称', type: 'input' },
        { prop: 'drawingNo', label: '品名规格', type: 'input' }
      ], // 产品选择弹出框搜索条件
      requestObj: {
        orderItems: [
          {
            asc: false,
            column: ''
          }
        ],
        pageNum: 1,
        pageSize: 20,
        // type: ''
      },
      // 保存编辑时已有的项目编码
      autoCode: undefined,
      inspectionType: '', //类型
      typeObjectName: '',
      dataForm: {
        code: '',
        name: '',
        typeObjectId: null, //类型id
        id: '',
        inspectionItemsId: '', //项目id
        inspectionCategory: '', //项目
        active: true,
        productName: '',
        productCategoryName: '',
        inspectionType: '',
        inspectionTypes: {
          code: '',
          inspectionCategory: '',
          name: '',
          remark: '',
          id: '',
          typeObjectName: ''
        },
        lines: [
          {
            inspectionItemsId: '' //检验项目id
          }
        ]
      },
      selectRows: [],
      dataFormTwo: {
        productData: []
      },
      rulesTwo: {
        inspectionItemsId: [
          {
            required: true,
            message: '请输入项目编码',
            trigger: ['blur']
          },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
          { validator: this.formValidate('noSpace'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              checkBimInspectionItemsCode(value, this.dataForm.id)
                .then((res) => {
                  if (res.data) {
                    callback(new Error('项目编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ],
        inspectionItemsIdText: [
          {
            required: true,
            message: '请选择项目名称',
            trigger: ['change']
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      btntype: false,
      dataRules: {
        name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入类型编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              checkBimInspectionTypeCode(value, this.dataForm.id)
                .then((res) => {
                  if (res.data) {
                    callback(new Error('类型编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ],
        inspectionCategory: [{ required: true, message: '请选择检验种类', trigger: 'change' }],
        inspectionType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        productName: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
        productCategoryName: [{ required: true, message: '请选择产品分类名称', trigger: 'change' }]
      },
      activeName: 'orderInfo',
      productCategoryId: '',
      istypes: true,
      a: true
    }
  },
  created() { },
  // watch: {
  //   'dataForm.inspectionCategory'(newval, oldval) {
  //     console.log(newval, oldval, '4444444444');

  //   }
  // },
  methods: {
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.code = data.number
        }
      } catch (error) {
      }
    },
    calcValidate() {
      return (rule, value, callback) => {
        return callback()
        let index = Number(rule.field.match(/\d+/)[0])
        if (this.dataFormTwo.productData[index].inspectionMethod == 'measure') {
          if (!this.dataFormTwo.productData[index].maximum) {
            this.$message.error(`第${index + 1}行的最高值不能为空`)
          } else if (!this.dataFormTwo.productData[index].minimum) {
            this.$message.error(`第${index + 1}行的最低值不能为空`)
          } else if (!this.dataFormTwo.productData[index].normalValue) {
            this.$message.error(`第${index + 1}行的正常值不能为空`)
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    },
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
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
      if (this.dataFormTwo.productData.length == 0) {
        this.dataForm.ordersNo = ''
      }
    },
    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    handleClose() {
      this.$emit('close')
    },
    changeType1(value) {
      this.istypes = true
      this.$watch('dataForm.inspectionCategory', function (newval, oldval) {
        if (oldval && this.istypes) {
          this.$confirm('此操作将切换项目数据,是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: '切换成功'
              })
              if (this.dataForm.inspectionType == 'product_category') {
                let data = {
                  inspectionCategory: newval,
                  productCategoryId: ''
                }
                this.dataFormTwo.productData = []
                getbimInspectionTypelist(data).then((res) => {
                  res.data.forEach((item) => {
                    item.inspectionItemsIdText = item.name
                    item.inspectionItemsCode = item.code
                    item.inspectionItemsId = item.id
                    item.id = ''
                    this.dataFormTwo.productData.push(item)
                  })
                })
              } else if (this.dataForm.inspectionType == 'product' && this.productCategoryId) {
                let data = {
                  inspectionCategory: newval,
                  productCategoryId: this.productCategoryId
                }
                this.dataFormTwo.productData = []
                getbimInspectionTypelist(data).then((res) => {
                  res.data.forEach((item) => {
                    item.inspectionItemsIdText = item.name
                    item.inspectionItemsCode = item.code
                    item.inspectionItemsId = item.id
                    item.id = ''
                    this.dataFormTwo.productData.push(item)
                  })
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
              this.istypes = false
              this.dataForm.inspectionCategory = oldval
            })
        }
      })
      if (this.a && this.istypes) {
        this.a = false
        if (this.dataForm.inspectionType == 'product_category') {
          let data = {
            inspectionCategory: value,
            productCategoryId: ''
          }
          this.dataFormTwo.productData = []
          getbimInspectionTypelist(data).then((res) => {
            res.data.forEach((item) => {
              item.inspectionItemsIdText = item.name
              item.inspectionItemsCode = item.code
              item.inspectionItemsId = item.id
              item.id = ''
              this.dataFormTwo.productData.push(item)
            })
          })
        } else if (this.dataForm.inspectionType == 'product' && this.productCategoryId) {
          let data = {
            inspectionCategory: value,
            productCategoryId: this.productCategoryId
          }
          this.dataFormTwo.productData = []
          getbimInspectionTypelist(data).then((res) => {
            res.data.forEach((item) => {
              item.inspectionItemsIdText = item.name
              item.inspectionItemsCode = item.code
              item.inspectionItemsId = item.id
              item.id = ''
              this.dataFormTwo.productData.push(item)
            })
          })
        }
      }
      // if (this.dataForm.inspectionType == 'product_category') {
      //   let data = {
      //     inspectionCategory: val,
      //     productCategoryId: ''
      //   }
      //   this.dataFormTwo.productData = []
      //   getbimInspectionTypelist(data).then(res => {
      //     res.data.forEach(item => {
      //       item.inspectionItemsIdText = item.name
      //       item.inspectionItemsCode = item.code
      //       item.inspectionItemsId = item.id
      //       item.id = ''
      //       this.dataFormTwo.productData.push(item)
      //     })
      //   })
      // } else if (this.dataForm.inspectionType == 'product' && this.productCategoryId) {
      //   let data = {
      //     inspectionCategory: val,
      //     productCategoryId: this.productCategoryId
      //   }
      //   this.dataFormTwo.productData = []
      //   getbimInspectionTypelist(data).then(res => {
      //     res.data.forEach(item => {
      //       item.inspectionItemsIdText = item.name
      //       item.inspectionItemsCode = item.code
      //       item.inspectionItemsId = item.id
      //       item.id = ''
      //       this.dataFormTwo.productData.push(item)
      //     })
      //   })
      // }
    },
    changeType(value) {
      if (value === 'product_category' && this.dataForm.inspectionCategory) {
        let data = {
          inspectionCategory: this.dataForm.inspectionCategory,
          productCategoryId: ''
        }
        this.dataFormTwo.productData = []
        getbimInspectionTypelist(data).then((res) => {
          res.data.forEach((item) => {
            item.inspectionItemsIdText = item.name
            item.inspectionItemsCode = item.code
            item.inspectionItemsId = item.id
            item.id = ''
            this.dataFormTwo.productData.push(item)
          })
        })
      }
      if (value === 'product' && this.dataForm.inspectionCategory && this.dataForm.productName) {
        let _data = {
          inspectionCategory: this.dataForm.inspectionCategory,
          productCategoryId: this.productCategoryId
        }
        this.dataFormTwo.productData = []
        getbimInspectionTypelist(_data).then((res) => {
          res.data.forEach((item) => {
            item.inspectionItemsIdText = item.name
            item.inspectionItemsCode = item.code
            item.inspectionItemsId = item.id
            item.id = ''
            this.dataFormTwo.productData.push(item)
          })
        })
      }
      // if (value === 'common') {
      //   this.dataForm.typeObjectId = null
      //   this.typeObjectName = null
      //   // this.dataForm.inspectionType = 'common'
      // }
      // if (value === 'product_category') {
      //   this.dataForm.productName = ''
      // }
      // if (value === 'product') {
      //   this.dataForm.productCategoryName = ''
      // }
    },
    // 选择产品名称的弹框
    onOrganizeChange(val, data, param) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('productName')
      })
      if (!val && data.length) return
      if (data.length === 0) {
        // this.$nextTick(()=>{ this.$refs['dataForm'].validateField('productName')})
        this.dataForm.typeObjectId = null
        this.dataForm.productName = ''
        this.productCategoryId = ''
      } else {
        // this.$nextTick(()=>{ this.$refs['dataForm'].clearValidate()})
        this.dataForm.typeObjectId = data[0].id
        this.dataForm.productName = data[0].name
        this.productCategoryId = data[0].all.productCategoryId
        if (this.dataForm.inspectionCategory) {
          let _data = {
            inspectionCategory: this.dataForm.inspectionCategory,
            productCategoryId: data[0].all.productCategoryId
          }
          this.dataFormTwo.productData = []
          getbimInspectionTypelist(_data).then((res) => {
            res.data.forEach((item) => {
              item.inspectionItemsIdText = item.name
              item.inspectionItemsCode = item.code
              item.inspectionItemsId = item.id
              item.id = ''
              this.dataFormTwo.productData.push(item)
            })
          })
        }
      }
    },
    // 选择产品分类名称的弹框
    onOrganizeChangeThree(id, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('productCategoryName')
      })
      if (data.length === 0) {
        this.dataForm.typeObjectId = ''
        this.dataForm.productCategoryName = ''
      } else {
        // this.$nextTick(()=>{ this.$refs['dataForm'].clearValidate()})
        this.dataForm.typeObjectId = data[0].all.id
        this.dataForm.productCategoryName = data[0].all.name
      }
    },

    // 选择项目名称的弹框
    onOrganizeChangeTwo(val, data) {
      let hasItemList = []
      let tempList = []
      data.map((i) => {
        const hasFlag = this.dataFormTwo.productData.some((item) => {
          let flag = false
          if (i.all.code === item.inspectionItemsCode) {
            flag = true
          }
          return flag
        })
        if (hasFlag) {
          hasItemList.push(i.all.name)
        } else {
          tempList.push(i)
        }
        if (hasItemList.length) this.$message.error(`已经存在的项目：${hasItemList.join('、')}`)
      })
      // console.log(this.$refs['tableForm_' + param.row.index].validateField('inspectionItemsIdText'));
      tempList.forEach((item) => {
        item.all.inspectionItemsIdText = item.all.name
        item.all.inspectionItemsCode = item.all.code
        item.all.inspectionItemsId = item.all.id
        item.all.id = ''
        this.dataFormTwo.productData.push(item.all)
      })
      // this.$nextTick(() => { this.$refs['tableForm_' + param.row.index].validateField('inspectionItemsIdText') })
      // if (!data) return
      // if (data.length === 0) {
      //   this.dataFormTwo.productData[param.row.index].inspectionItemsIdText = ''
      //   this.dataFormTwo.productData[param.row.index].inspectionItemsId = ''
      //   this.dataFormTwo.productData[param.row.index].inspectionItemsCode = ''
      // } else {
      //   this.dataFormTwo.productData[param.row.index].inspectionItemsIdText = data[0].name
      //   this.dataFormTwo.productData[param.row.index].inspectionItemsId = data[0].id
      //   this.dataFormTwo.productData[param.row.index].inspectionItemsCode = data[0].all.code

      //   // 重新校验指定选择框，其他内容不做操作
      //   this.$nextTick(() => {
      //     // 重新校验指定选择框，其他内容不做操作
      //     // this.$refs['tableForm_' + param.row.index].validateField('inspectionItemsIdText')
      //     const codeOneItems = this.dataFormTwo.productData.filter(item => item.inspectionItemsIdText === data[0].name);
      //     const hasCodeOneMoreThanOnce = codeOneItems.length >= 2;
      //     if (hasCodeOneMoreThanOnce) {
      //       this.$message.error('当前选择的项目已经存在此项目了')
      //       this.dataFormTwo.productData[param.row.index].inspectionItemsIdText = ''
      //       this.dataFormTwo.productData[param.row.index].inspectionItemsId = ''
      //       this.dataFormTwo.productData[param.row.index].inspectionItemsCode = ''
      //     }
      //   })
      // }
    },

    addtable() {
      let ind = this.dataFormTwo.productData.length
      let item = {
        index: ind,
        name: '',
        inspectionItemsId: '',
        targetUnitCode: '',
        inspectionItemsIdText: '',
        cssObj: {}
      }
      this.dataFormTwo.productData.push(item)
    },
    deltable(index) {
      this.dataFormTwo.productData.splice(index, 1)
    },
    init(id, type) {
      this.visible = true
      this.btntype = false
      this.dataForm.productName = ''
      this.dataForm.productCategoryName = ''
      this.dataForm.id = id || ''
      this.inspectionType = ''
      this.dataForm.name = ''
      this.dataForm.code = ''
      this.dataForm.typeObjectId = null
      if (type == 'edit') {
        this.btntype = false
      } else if (type == 'look') {
        this.btntype = true
      }
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.fetchData("JYLX", false)
          bimInspectionTypedetail(this.dataForm.id).then((res) => {
            this.dataForm = res.data.inspectionTypes
            this.dataFormTwo.productData = res.data.returnLines.map((item) => {
              return {
                ...item,
                id: null
              }
            })
            this.formLoading = false
            this.dataForm.typeObjectId = this.dataForm.typeObjectId
            if (this.dataForm.inspectionType === 'common') {
              this.dataForm.typeObjectId = null
              this.typeObjectName = null
            } else {
              if (this.dataForm.inspectionType === 'product_category' && this.dataForm.typeObjectName) {
                this.dataForm.productCategoryName = this.dataForm.typeObjectName
                this.dataForm.productName = ''
              }
              if (this.dataForm.inspectionType === 'product' && this.dataForm.typeObjectName) {
                this.dataForm.productName = this.dataForm.typeObjectName
                this.dataForm.productCategoryName = ''
              }
            }

            let ind = 0
            this.dataFormTwo.productData.forEach((item) => {
              item.index = ind++
            })
            this.loading = false
          })
        } else {
          this.fetchData("JYLX", true)
          this.formLoading = false
          this.dataFormTwo.productData = []
        }
      })
    },

    async dataFormSubmit() {
      if (this.dataForm.inspectionType === 'common') {
        this.dataForm.typeObjectId = null
        this.typeObjectName = ''
        this.typeObjectName = null
      }
      if (this.dataForm.inspectionType === 'product') {
        this.typeObjectName = this.dataForm.productName ? this.dataForm.productName : ''
      }
      if (this.dataForm.inspectionType === 'product_category') {
        this.typeObjectName = this.dataForm.productCategoryName ? this.dataForm.productCategoryName : ''
      }
      let queryData = {
        inspectionTypes: {
          active: this.dataForm.active,
          code: this.dataForm.code,
          inspectionType: this.dataForm.inspectionType,
          inspectionCategory: this.dataForm.inspectionCategory,
          typeObjectId: this.dataForm.typeObjectId,
          name: this.dataForm.name,
          typeObjectName: this.typeObjectName,
          remark: this.dataForm.remark,
          id: this.dataForm.id
        },
        lines: this.dataFormTwo.productData
      }
      let msg = true
      let submitFlag = true

      const form_1 = this.$refs.dataForm
      const valid_1 = await form_1.validate().catch((err) => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        let formItems = form_1.fields
        formItems.some((formItem) => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => {
              this.jnpf.formItemValidate(formItem)
            })
            return true
          }
        })
      }

      const form_2 = this.$refs.productForm
      const valid_2 = await form_2.validate().catch((err) => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        let formItems = form_2.fields
        formItems.some((formItem) => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => {
              this.jnpf.formItemValidate(formItem)
            })
            return true
          }
        })
      }
      if (!this.dataFormTwo.productData.length && submitFlag) {
        this.$message.error('至少选择一项项目')
        submitFlag = false
      }
      if (submitFlag) {
        // if (this.dataFormTwo.productData.length === 0) {
        //   this.$message.error('至少选择一项项目')
        // } else {
        // this.dataFormTwo.productData.forEach((item, index) => {
        //   if (item.inspectionItemsIdText === '') {
        //     msg = false
        //     this.$message({
        //       type: 'error',
        //       message: `项目名称：第${index + 1}条项目名称不能为空`,
        //       duration: 1500,
        //     })
        //   }
        // })
        if (msg) {
          this.btnLoading = true
          let formMethod = this.dataForm.id ? editbimInspectionType : addbimInspectionType
          formMethod(queryData)
            .then((res) => {
              let msg = ''
              if (formMethod == editbimInspectionType) {
                msg = '修改成功'
              } else {
                msg = '新建成功'
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
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      }
    }
  }
}
</script>
<style scoped>
::v-deep #table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}
</style>
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
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
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

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 10px !important;
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
