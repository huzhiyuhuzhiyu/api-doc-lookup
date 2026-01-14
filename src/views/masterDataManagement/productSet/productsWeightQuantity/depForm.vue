<template>
  <el-drawer :title="!dataForm.id ? '新建重量数量换算' : '编辑重量数量换算'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll width="600px" @close="handleClose" class="JNPF-common-drawer">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding: 10px;">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px" :hide-required-asterisk="true">
        <el-form-item label="型号" prop="drawingNo">
          <template slot="label">
            型号<span class="required">*</span>
          </template>
          <ComSelect-page clearable :isdisabled="btnType === 'look'"
            v-model="dataForm.drawingNo" :beforeSubmit="beforeSubmit"
            @change="addth" :tableItems="productTableItems" :placeholder="'请选择型号'" title="选择型号"
            treeTitle="产品分类" :methodArr="productMethodArr" :listMethod="getProductList"
            :listRequestObj="productListRequestObj" :paramsObj="{ oldData }"
            :searchList="productTableSearchList" />
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <template slot="label">
            重量<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.weight" placeholder="请输入重量" maxlength="20" :disabled="btntype ? true : false" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <template slot="label">
            数量<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.quantity" placeholder="请输入数量" maxlength="20" :disabled="btntype ? true : false" />
        </el-form-item>

      </el-form>
    </div>

    <span class="button-bottom">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交
      </el-button>
    </span>
  </el-drawer>
</template>

<script>
import {
  addProductsWeightQuantity,
  detailProductsWeightQuantity,
  updateProductsWeightQuantity,
  checkadverseCausesCode
} from '@/api/basicData/productsWeightQuantity'
import formValidate from '@/utils/formValidate'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getProductList, } from '@/api/masterDataManagement/productManage'
export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      title: '',
      dataForm: {
        drawingNo: '',
        weight: '',
        quantity: ''
      },
      oldData:[],
      codeConfig: {},
      btntype: false,
      getcategoryTree,
      //  产品 树请求
      productMethodArr: { method: getcategoryTree, requestObj: { type: 'material' } },
      // 产品 列表
      productTableItems: [
        { prop: 'code', label: '产品编码' },
        { prop: 'name', label: '产品名称' },
        { prop: 'drawingNo', label: '型号' },
      ],
      // 产品搜索条件
      productTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productName', label: '产品名称', type: 'input' }
      ],
      // 产品请求参数
      productListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: ''
      },
      getProductList,
      dataRule: {
        drawingNo: [{ required: true, message: '请输入型号', trigger: 'blur' }],
        weight: [
          { required: true, message: '请输入重量', trigger: 'blur' },
        ],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'blur' },
        ]
      }
    }
  },
  created() { },
  methods: {
    handleClose() { },
    addth(id, data) {
      console.log(data,'结局')
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('drawingNo')
      })
      if (data.length === 0) {
        this.dataForm.drawingNo = ''
        this.dataForm.productCode = ''
        this.dataForm.productsId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.drawingNo = data[0].all.drawingNo
        this.dataForm.productCode = data[0].all.code
        this.dataForm.productsId = data[0].all.id
      }
    },
    init(row, type) {

      this.visible = true

      if (type == 'add') {
        // this.$refs['dataForm'].resetFields()
        this.dataForm = { }
      } else if (type == 'edit') {
        this.dataForm = {...row }

      }
      this.title = !this.dataForm.id ? '新建重量数量换算' : '编辑重量数量换算'
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = this.dataForm.id ? updateProductsWeightQuantity : addProductsWeightQuantity
          if (!this.dataForm.id) delete this.dataForm.id
          formMethod(this.dataForm)
            .then((res) => {
              console.log(666, res)
              let msg = ''
              if (formMethod == updateProductsWeightQuantity) {
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
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.custom_title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  margin-left: -12px;
}

.required {
  color: red;
  margin-left: 4px;
}

.button-bottom {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>
