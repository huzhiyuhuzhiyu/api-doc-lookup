<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑程序管理' : btntype == 'add' ? '新建程序管理' : '查看程序管理'" />
        <div class="options" v-if="btntype !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">

        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
              <el-row :gutter="30" class="custom-row" style="padding: 0 10px;">
                <el-col :sm="12" :xs="24">
                  <el-form-item label="产品名称" prop="name">
                    <ComSelect-page ref="ComSelect-page" :value="dataForm.name" placeholder="请选择产品" @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj" :isdisabled="btntype == 'look' ? true : false" :searchList="ProductTableSearchList" />
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :xs="24">
                  <el-form-item label="程序名称" prop="programName">
                    <el-input v-model="dataForm.programName" placeholder="请输入程序名称" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="启用状态" prop="state">
                    <el-select v-model="dataForm.state" placeholder="请选择启用状态" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in stateList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="版本" prop="version">
                    <el-input v-model="dataForm.version" placeholder="请输入版本" :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btntype == 'look'" type="textarea" maxlength="200" :rows="2" />
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                  <el-form-item label="本地文件" prop="datafilelist">
                    <uploadWj v-model="datafilelist" :uploadlist="false" :disabled="btntype == 'look'" :limit="limit" :code="'TZ'" :detailed="btntype == 'look'"></uploadWj>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { addbimProgram, updatebimProgram, getbimProgramDetail } from "@/api/basicData/index";
import uploadWj from '@/components/upload-wj'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { log } from 'mathjs';
export default {
  components: { uploadWj },
  data() {
    return {
      limit: 1,
      datafilelist: [],
      activeName: "jcInfo",
      ProductListRequestObj: {
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
        hideStockZero: false,
        userSelfWarehouse: true
      }, // 产品选择弹出框列表请求参数
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ], // 产品选择弹出框树状列表
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号' },
        { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeText', label: '产品分类' },
        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        // { prop: 'availableQuantity', label: '当前库存' },
        { prop: 'mainUnit', label: '单位' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      stateList: [{
        label: "启用",
        value: "enable"
      }, {
        label: "停用",
        value: "disabled"
      }],
      uploadCode: "TZ",
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        productsId: "",
        programName: "",
        id: "",
        version: "",
        state: "enable",
        remark: "",
        name: ""
      },
      btntype: false,
      dataRule: {
        programName: [
          { required: true, message: '请输入程序名称', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请选择产品', trigger: 'change' },
        ],
        state: [
          { required: true, message: '请选择启用状态', trigger: 'change' },
        ],
      },
    }
  },
  created() {
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    validateInput(rule, value, callback) {
      const reg = /^[1-9]\d*$/; // 正则表达式，匹配正整数
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正整数'));
      }
    },
    addth(val, data) {
      this.dataForm.productsId = data[0].all.id
      this.dataForm.name = data[0].all.name
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('name')
      })
    },
    init(id, type) {
      this.visible = true
      this.btntype = type
      this.dataForm.id = id || ''
      if (type == 'edit') this.limit = 1
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getbimProgramDetail(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
            if (res.data.attachmentList.length) {
              this.datafilelist.push(
                {
                  name: res.data.filename,
                  filename: res.data.filepath,
                  id: res.data.documentId,
                  url: res.data.attachmentList[0].url
                }
              )
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
          if (this.datafilelist.length < 1) {
            this.$message.error('文件不能为空，请选择文件')
            return
          }
          let a = []
          this.btnLoading = true;
          this.datafilelist.map((item, index) => {
            a.push({ documentId: item.id })
            item.bimAttachments = {
              businessType: '',
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
          let obj = {
            program: {
              ...this.dataForm,
              attachmentList: this.datafilelist
            },
            programList: a
          }
          let formMethod = this.dataForm.id ? updatebimProgram(obj) : addbimProgram(obj);
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
<style scoped>
::v-deep .el-form-item__content p {
  border: none;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
