<template>
  <el-dialog :title="'创建新箱'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">


      <el-form-item label="条码" prop="barCode" ref="barCode">
        <el-input v-model="dataForm.barCode" placeholder="" disabled>
        </el-input>
      </el-form-item>

      <el-form-item label="标准箱" prop="standardBoxName" ref="standardBoxName">
        <ComSelect-page clearable :value="dataForm.standardBoxName" placeholder="请选择产品名称" ref="ComSelect-page" :renderTree="false"
          @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr"
          :listMethod="getProductList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList"
          :elementShow="true" :paramsObj="{}" />
      </el-form-item>

      <el-form-item label="备注" prop="remark" ref="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入备注" maxlength="200">
        </el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { emtyeStockBoxBarcode } from '@/api/warehouseManagement/packingList'
export default {
  components: {
  },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,

      onlyRead: false,
      dataForm: {
        barCode: '',
        standardBox: '',
        standardBoxName: '',
        remark: ''
      },
      getProductList, // 产品选择弹出框树状列表请求api
      getcategoryTree,
      // material
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        productCategoryType: "packaging",
        classAttribute: "",
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
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
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '产品图号' },
        { prop: 'spec', label: '规格型号' },
        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeText', label: '产品分类' },
        { prop: "mainUnit", label: "主单位" }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      dataRule: {
        newBarCode: [
          { required: true, message: '新条码不能为空', trigger: 'no' },
        ],
        standardBoxName: [
          { required: true, message: '请选择标准箱', trigger: 'change' },
        ],
      },
    }
  },
  created() {
  },

  methods: {
    addth(id, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField("standardBoxName")
      })
      if (data.length === 0) {
        this.dataForm.standardBox = ''
        this.dataForm.standardBoxName = ''
      } else {
        this.dataForm.standardBox = data[0].id
        this.dataForm.standardBoxName = data[0].all.drawingNo
      }
    },
    init() {

      this.visible = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.barCode = this.dataForm.barCode ? this.dataForm.barCode : new Date().getTime() + '001'
        this.formLoading = false
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid);
        if (valid) {
          this.btnLoading = true;
          let _data = {
            barcode: this.dataForm
          }
          emtyeStockBoxBarcode(_data).then(res => {
            this.$message({
              message: '提交成功',
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
::v-deep .el-input__inner {
  height: 40px;
}

::v-deep .el-select .el-tag {
  margin: 5px 0 2px 6px;
}

::v-deep .el-select__tags {

  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
}
</style>