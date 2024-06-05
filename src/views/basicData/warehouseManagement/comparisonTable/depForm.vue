<!-- <template>
    <el-dialog :title="!dataForm.id ? '新建产品库位对照表' : type == 'look' ? '查看产品库位对照表' : '编辑产品库位对照表'"
        :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll
        class="JNPF-dialog JNPF-dialog_center" width="600px">
        <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRules" label-position="top"
            label-width="120px">
            <el-row :gutter="30">
                <el-col :span="24">
                    <el-form-item label="对照类型" prop="comparisonType">
                      <el-select v-model="dataForm.comparisonType" placeholder="请选择对照类型" style="width: 100%;" :disabled="type == 'look'">
                        <el-option v-for="(item, index) in comparisonTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="仓库" prop="wname">
                        <ComSelect-list :requestObj="{type:'normal'}" :dialogTitle="'请选择仓库'" v-model="dataForm.wname"
                            :placeholder="'请选择仓库'" :isdisabled="type === 'look'" :method="getWarehouseList"
                            @change="changeWarehouse"></ComSelect-list>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="库位" prop="sname">
                        <ComSelect-list :requestObj="kwstock" :dialogTitle="'请选择库位'" v-model="dataForm.sname"
                            :placeholder="'请选择库位'" :isdisabled="type === 'look' || !dataForm.warehouseId"
                            :method="stockDisassemblykw" @change="changeWarehousekw"></ComSelect-list>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="产品名称" prop="name" v-if="dataForm.comparisonType=='product'">
                        <ComSelect-page v-model="dataForm.name" placeholder="请选择产品名称" auth @change="onOrganizeChangeTwo"
                            :isdisabled="type === 'look'" :title="'选择产品'" :listMethod="getProductList"
                            :searchList="ProductTableSearchList" :requestObj="requestObj" :methodArr="ProductMethodArr"
                            :listRequestObj="ProductListRequestObj" :tableItems="ProductTableItems" treeTitle="产品分类" />
                    </el-form-item>
                    <el-form-item label="产品名称" prop="name" v-if="dataForm.comparisonType=='product_category'">
                        <ComSelect-page v-model="dataForm.name" placeholder="请选择产品名称" auth @change="onOrganizeChangeTwo"
                            :isdisabled="type === 'look'" :title="'选择产品'" :listMethod="getProductList"
                            :searchList="ProductTableSearchList" :requestObj="requestObj" :methodArr="ProductMethodArr"
                            :listRequestObj="ProductListRequestObj" :tableItems="ProductTableItems" treeTitle="产品分类" />
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="type == 'look' ? true : false"
                            type="textarea" :rows="2" maxlength="200" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="type !== 'look'">
            <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
                提交</el-button>
        </span>
    </el-dialog>
</template> -->
<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', type == 'look' ? 'noButtons' : '']">
        <el-page-header @back="handleClose" :content="type == 'look' ? '查看库位产品对照表' : '新建库位产品对照表'" />
        <div class="options" v-if="type !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            保存并提交</el-button>
          <el-button @click="handleClose">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="检验信息" name="orderInfo">
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRules" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :span="12">
                  <el-form-item label="对照类型" prop="comparisonType">
                    <el-select v-model="dataForm.comparisonType" @change="changecomparison" placeholder="请选择对照类型" style="width: 100%;" :disabled="type == 'look'">
                      <el-option v-for="(item, index) in comparisonTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="仓库" prop="wname">
                    <ComSelect-list :requestObj="{type:'normal'}" :dialogTitle="'请选择仓库'" v-model="dataForm.wname" :placeholder="'请选择仓库'" :isdisabled="type === 'look'" :method="getWarehouseList" @change="changeWarehouse"></ComSelect-list>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="库位" prop="gname">
                    <ComSelect-list :requestObj="kwstock" :dialogTitle="'请选择库位'" v-model="dataForm.gname" :placeholder="'请选择库位'" :isdisabled="type === 'look' || !dataForm.warehouseId" :method="stockDisassemblykw" @change="changeWarehousekw"></ComSelect-list>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="type == 'look' ? true : false" type="textarea" :rows="2" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div v-if="nametype">
              <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>{{nametype+'信息'}}</h5>
              </div>
              <div v-if="type !== 'look'">
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openSeleceProductDialog">{{'选择'+nametype}}</el-button>|
              </div>
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                <el-table ref="product" :data="dataFormTwo.productData">
                  <el-table-column type="index" width="60" label="序号" align="center" key="21" />
                  <el-table-column prop="code" label="对象编码" min-width="160" key="24" />
                  <el-table-column prop="name" label="对象名称" min-width="160" key="23" />
                </el-table>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelectLists ref="ComSelect-list" :tagMultipleLine="true" :requestObj="{classAttribute:'material'}" :dialogTitle="'请选择产品类别'" :method="getcategoryTree" @change="changeProduct" :multiple="true"></ComSelectLists>
      <ComSelect-page ref="ComSelect-page" :requestObj="requestObj" treeTitle="产品分类" :methodArr="ProductMethodArr" @change="onOrganizeChangeTwo" :tableItems="ProductTableItems" title="选择产品" :listMethod="getProductList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :multiple="true" :elementShow="false" />
      <ComSelectPages ref="ComSelect-page1" treeTitle="供应商分类" :methodArr="ProductMethodArr1" @change="onOrganizeChangeTwo" :tableItems="ProductTableItems1" title="选择供应商" :listMethod="getCooperativeData" :listRequestObj="ProductListRequestObj1" :searchList="ProductTableSearchList1" :multiple="true" :elementShow="false" />
      <ComSelectPages ref="ComSelect-page2" treeTitle="客户分类" :methodArr="ProductMethodArr2" @change="onOrganizeChangeTwo" :tableItems="ProductTableItems2" title="选择客户" :listMethod="getCooperativeData" :listRequestObj="ProductListRequestObj2" :searchList="ProductTableSearchList2" :multiple="true" :elementShow="false" />
    </div>
  </transition>
</template>
  
<script>
import ComSelectPages from "./ComSelect-pages"
import ComSelectLists from "./ComSelect-lists"
import { getcategoryTrees } from "@/api/salesManagement/assemblyOrders";
import { getWarehouseList } from '@/api/basicData/index'// 仓库树
import { addcomparisonTable, updatecomparisonTable, getcomparisonTable } from '@/api/basicData/comparisonTable'
import { stockDisassemblykw } from '@/api/warehouseManagement/productlistChange'
import { getCooperativeData } from "@/api/basicData/index"
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
export default {
  components: {
    ComSelectPages,
    ComSelectLists
  },
  data() {
    return {
      nametype: '',
      activeName: 'orderInfo',
      dataFormTwo: {
        productData: []
      },
      comparisonTypeList: [
        { label: '产品', value: 'product' },
        { label: '产品分类', value: 'product_category' },
        { label: '供应商', value: 'supplier' },
        { label: '客户', value: 'customer' },
      ],
      type: '',
      getcategoryTree,
      getProductList,
      getWarehouseList,
      getCooperativeData,
      stockDisassemblykw,
      visible: false,
      formLoading: false,
      btnLoading: false,
      code: '',
      kwstock: {
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: -1,
        warehouseId: '',
        locationType: 'goods_allocation'
      },
      requestObj: {
        type: "customer",
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,

      },
      requestObj2: {
        type: "customer",
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,
        pageSize: -1,
      },
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "accessories", "semi_finished", "finish_product"],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        productStatus: "enable",
      },
      ProductListRequestObj2: {
        code: "",
        taxId: "",
        name: "",
        type: "customer",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "createTime"
          }
        ]
      },
      ProductListRequestObj1: {
        code: "",
        taxId: "",
        name: "",
        type: "supplier",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "createTime"
          }
        ]
      },
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号', minWidth: 0 },
        { prop: 'classAttributeText', label: '产品分类', minWidth: 0 },
        { prop: 'spec', label: '规格型号', minWidth: 0 },
        { prop: 'mainUnit', label: '单位', minWidth: 0 }
      ],
      ProductTableItems1: [
        { prop: 'code', label: '供应商编码' },
        { prop: 'name', label: '名称' },
        { prop: 'taxId', label: '税号' },
        { prop: 'contacts', label: '联系人' },
        { prop: 'phone', label: '电话' }
      ],
      ProductTableItems2: [
        { prop: 'code', label: '客户编码' },
        { prop: 'name', label: '客户名称' },
        { prop: 'taxId', label: '税号' },
        { prop: 'contacts', label: '联系人' },
        { prop: 'phone', label: '电话' }
      ],
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input', },
        { prop: "name", label: "产品名称", type: 'input', },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ],
      ProductTableSearchList1: [
        { prop: "code", label: "供应商编码", type: 'input', },
        { prop: "name", label: "名称", type: 'input', },
        { prop: "taxId", label: "税号", type: 'input' }
      ],
      ProductTableSearchList2: [
        { prop: "code", label: "客户编码", type: 'input', },
        { prop: "name", label: "客户名称", type: 'input', },
        { prop: "taxId", label: "税号", type: 'input' }
      ],
      autoCode: undefined,
      dataForm: {
        warehouseId: '',
        wname: '',
        gname: '',
        shelfSpaceId: '',
        name: '',
        productsId: '',
        remark: '',
        goodsShelvesId: ''
      },
      productsIds: [],
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      ProductMethodArr1: [
        { label: "供应商分类", method: getcategoryTrees, requestObj: { type: "supplier" } },
      ],
      ProductMethodArr2: [
        { label: "客户分类", method: getcategoryTrees, requestObj: { type: "customer" } },
      ],
      dataRules: {
        comparisonType: [{ required: true, message: '请选择对照类型', trigger: 'change' }],
        wname: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
        gname: [{ required: true, message: '请选择库位', trigger: 'blur' }],
        name: [{ required: true, message: '请选择产品', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //产品类别选择
    changeProduct(val, data) {
      if (!data.length) return
      let hasItemList = []
      data.map(i => {
        const hasFlag = this.dataFormTwo.productData.some(item => {
          let flag = false
          if (i.all.id === item.id) { flag = true }
          return flag
        })
        if (hasFlag) { hasItemList.push(i.all.name) }
        else { this.dataFormTwo.productData.push(i.all) }
        if (hasItemList.length) this.$message.error(`${hasItemList.join('、')}已重复`)
      })
    },
    //产品类别
    changecomparison(val) {
      const a = this.comparisonTypeList.find((item) => {
        return item.value == val
      })
      if (a) {
        this.nametype = a.label
      }
    },
    handleClose() {
      this.$emit('close')
    },
    openSeleceProductDialog() {
      if (this.dataForm.comparisonType == 'product') {
        this.$refs['ComSelect-page'].openDialog()
      } else if (this.dataForm.comparisonType == 'product_category') {
        this.$refs['ComSelect-list'].openDialog()
      } else if (this.dataForm.comparisonType == 'supplier') {
        this.$refs['ComSelect-page1'].openDialog()
      } else if (this.dataForm.comparisonType == 'customer') {
        this.$refs['ComSelect-page2'].openDialog()
      }
    },
    //选择仓库
    changeWarehouse(val, data) {
      if (!val && !data.length) return
      if (data.length > 0) {
        this.$nextTick(() => {
          this.$refs.dataForm.validateField('wname')
        })
        this.kwstock.warehouseId = data[0].id,
          this.dataForm = {
            ...this.dataForm,
            shelfSpaceId: '',
            gname: '',
            warehouseId: data[0].id,
            wname: data[0].name
          }
      }
    },
    //库位选择
    changeWarehousekw(val, data) {
      if (!val && data.length) return
      if (data.length > 0) {
        this.$nextTick(() => {
          this.$refs.dataForm.validateField('gname')
        })
        if (data[0].all.parentId == -1) {
          this.dataForm.goodsShelvesId = null
        } else {
          this.dataForm.goodsShelvesId = data[0].all.parentId
        }
        this.dataForm.shelfSpaceId = data[0].id
        this.dataForm.gname = data[0].name
      }
    },
    // 选择产品名称的弹框
    onOrganizeChangeTwo(val, data) {
      if (!data || !data.length) return
      let hasItemList = []
      data.map(i => {
        const hasFlag = this.dataFormTwo.productData.some(item => {
          let flag = false
          if (i.all.code === item.code) { flag = true }
          return flag
        })
        if (hasFlag) { hasItemList.push(i.all.name) }
        else { this.dataFormTwo.productData.push(i.all) }
        if (hasItemList.length) this.$message.error(`${hasItemList.join('、')}已重复`)
      })
    },
    init(id, type) {
      this.type = type
      this.visible = true
      this.dataForm.id = id || ''
      if (this.dataForm.id) {
        this.formLoading = true
        getcomparisonTable(this.dataForm.id).then(res => {
          this.changecomparison(res.data.comparisonType)
          this.formLoading = false
          this.dataForm = res.data
          let obj = {
            name: res.data.name,
            code: res.data.code
          }
          this.dataFormTwo.productData.push(obj)
        })
      } else {
        this.dataForm = {}
        this.formLoading = false
      }
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let comparisonObjectIdList = this.dataFormTwo.productData.map(item => item.id)
          let obj = {
            ...this.dataForm,
            comparisonObjectIdList: comparisonObjectIdList
          }
          this.btnLoading = true
          let formMethod = null;
          if (this.type == 'edit') {
            formMethod = updatecomparisonTable
          } else if (this.type == 'add') {
            formMethod = addcomparisonTable
          }
          formMethod(obj).then(res => {
            console.log(res);
            let msg = "";
            if (formMethod == addcomparisonTable) {
              msg = "新建成功"
            } else {
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
</style>
  