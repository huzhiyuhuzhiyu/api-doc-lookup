<template>
  <el-drawer :title="!dataForm.id ? '新建不良原因' : '编辑不良原因'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll width="600px" @close="handleClose" class="JNPF-common-drawer">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding: 10px;">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px" :hide-required-asterisk="true">
        <el-form-item label="不良名称" prop="productName">
          <template slot="label">
            不良名称<span class="required">*</span>
          </template>
          <ComSelect-page clearable :isdisabled="btnType === 'look'" 
            v-model="dataForm.productName" :beforeSubmit="beforeSubmit" 
            @change="addth" :tableItems="productTableItems" :placeholder="'请选择产品名称'" title="选择产品"
            treeTitle="产品分类" :methodArr="productMethodArr" :listMethod="getProductList"
            :listRequestObj="productListRequestObj" :paramsObj="{ oldData }"
            :searchList="productTableSearchList" />
        </el-form-item>
        <el-form-item label="不良编码" prop="code">
          <template slot="label">
            不良编码<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.code" placeholder="请输入不良编码" maxlength="20" :disabled="btntype ? true : false" />
        </el-form-item>
        <el-form-item label="不良编码" prop="code">
          <template slot="label">
            不良编码<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.code" placeholder="请输入不良编码" maxlength="20" :disabled="btntype ? true : false" />
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
  addAdverseCausesData,
  getAdverseCausesInfo,
  editAdverseCausesData,
  checkadverseCausesCode
} from '@/api/basicData/index'
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
        name: '',
        code: '',
        id: ''
      },
      codeConfig: {},
      btntype: false,
      getcategoryTree,
      //  产品 树请求
      productMethodArr: { method: getcategoryTree, requestObj: { type: 'material' } },
      // 产品 列表
      productTableItems: [
        { prop: 'code', label: '产品编码' },
        { prop: 'name', label: '产品名称' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 产品搜索条件
      productTableSearchList: [
        { prop: 'code', label: '产品编码', type: 'input' },
        { prop: 'name', label: '产品名称', type: 'input' }
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
        name: [{ required: true, message: '请输入不良名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入不良编码', trigger: 'blur' },
          { validator: formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id)
              checkadverseCausesCode(value, this.dataForm.id)
                .then((res) => {
                  console.log('res===>', res)
                  if (res.data) {
                    callback(new Error('不良编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() { },
  methods: {
    handleClose() { },
    addth(id, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('productName')
      })
      if (data.length === 0) {
        this.dataForm.productName = ''
        this.dataForm.productCode = ''
        this.dataForm.productId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.productName = data[0].all.name
        this.dataForm.productCode = data[0].all.code
        this.dataForm.productId = data[0].all.id
      }
    },
    init(id, type) {

      this.visible = true
      this.dataForm.id = id || ''
      this.title = !this.dataForm.id ? '新建不良原因' : '编辑不良原因'
      if (type == 'edit' || type == 'add') {
        this.btntype = false
      } else if (type == 'look') {
        this.btntype = true
      }
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getAdverseCausesInfo(this.dataForm.id).then((res) => {
            console.log(123321, res)
            this.dataForm = res.data
            this.fetchData("BLYY", false)
            this.formLoading = false
          })
        } else {
          this.fetchData("BLYY", true)
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = this.dataForm.id ? editAdverseCausesData : addAdverseCausesData
          let obj = {
            causes: this.dataForm
          }
          formMethod(obj)
            .then((res) => {
              console.log(666, res)
              let msg = ''
              if (formMethod == editAdverseCausesData) {
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