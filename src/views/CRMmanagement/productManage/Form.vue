<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑产品' : btntype == 'add' ? '新建产品' : '查看产品'" />
        <div class="options" v-if="btntype !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="产品编码" prop="code">
                        <el-input v-model="dataForm.code" placeholder="请输入产品编码" :disabled="btntype == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="产品名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入产品名称" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="产品类型" prop="type">
                        <el-input v-model="dataForm.type" placeholder="请输入产品类型" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="产品类别" prop="productCategoryId">
                        <ComSelect-list :isdisabled="btntype == 'look' ? true : false" v-model="dataForm.productCategoryName" placeholder="请选择产品类别" auth @change="onOrganizeChange" :title="'选择产品类型'" :method="crmProductCategorytree" :requestObj="requestObjTwo" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="成本价" prop="costPrice">
                        <el-input v-model="dataForm.costPrice" placeholder="请输入成本价" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="产品单位" prop="unit">
                        <el-select v-model="dataForm.unit" placeholder="请选择产品单位" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in returnTypeList" :key="index" :label="item.fullName" :value="item.fullName"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="价格" prop="price">
                        <el-input v-model="dataForm.price" placeholder="请输入价格" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="产品描述" prop="describe">
                        <el-input v-model="dataForm.describe" placeholder="请输入产品描述" :disabled="btntype == 'look'" type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="是否上下架" prop="stackingFlag">
                        <el-select v-model="dataForm.stackingFlag" placeholder="请选择是否上下架" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in stacklist" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch=='1'">
            <UploadWj v-model="datafilelist" :disabled="btntype=='look'" :detailed="btntype=='look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { addcrmProduct, detailcrmProduct, updatecrmProduct, crmProductCategorytree } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      crmProductCategorytree,
      requestObjTwo: {
        pageSize: -1,
      },
      stacklist: [{ fullName: '是', enCode: 1 }, { fullName: '否', enCode: 0 }],
      codeConfig: {},//单据规则配置
      datafilelist: [],
      isattachmentswitch: '1',
      returnTypeList: [],
      activeNames: ["basicInfo"],
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        name: '',
        type: '',
        costPrice: '',
        unit: '',
        code: '',
        price: '',
        describe: '',
        stackingFlag: '',
        productCategoryId:'',
        productCategoryName:''
      },
      btntype: false,
      dataRule: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
        ],
        productCategoryId: [
          { required: true, message: '请输入产品类别', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入产品编码', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, ""] }), trigger: 'blur' }
        ],
        stackingFlag: [
          { required: true, message: '请选择是否上下架', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    this.getDictionaryType()
  },
  methods: {
    onOrganizeChange(val, data) {
      if (!data) {
        this.dataForm.productCategoryId = ''
        this.dataForm.productCategoryName = ''
      } else {
        this.dataForm.productCategoryId = data[0].id
        this.dataForm.productCategoryName = data[0].name
      }
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (this.btntype === 'add') this.dataForm.code = data.number
      } catch (error) {
      }
    },
    // 获取产品单位数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "ProductUnit") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.returnTypeList = response.data.list
                })
              }
            })
          }
        })
      })
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      this.visible = true
      this.btntype = type
      this.dataForm.id = id || ''
      this.formLoading = true
      if (this.btntype === 'add' || this.btntype === 'edit') this.fetchData('CRMCPBM')
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailcrmProduct(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
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
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: 'customer',
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj = {
            ...this.dataForm,
            attachmentList: this.datafilelist,
          }
          let formMethod = this.dataForm.id ? updatecrmProduct(obj) : addcrmProduct(obj);
          formMethod.then(res => {
            let msg = ""
            if (this.btntype == "edit") {
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
          }).catch(() => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.JNPF-preview-main .main {
  padding-top: 0;
}
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
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
::v-deep .el-form-item__content p {
  border: none;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
