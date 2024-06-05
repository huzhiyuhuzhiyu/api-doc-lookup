<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          :content="btntype == 'edit' ? ' 编辑图纸管理' : btntype == 'add' ? '新建图纸管理' : '查看图纸管理'" />
        <div class="options" v-if="btntype !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
              label-width="120px">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="12" :xs="24">
                  <el-form-item label="产品名称" prop="name">
                    <ComSelect-page ref="ComSelect-page" :value="dataForm.name" @change="addth"
                      :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr"
                      :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
                      :isdisabled="btntype == 'look' ? true : false" :searchList="ProductTableSearchList" />
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :xs="24">
                  <el-form-item label="图纸名称" prop="sheetName">
                    <el-input v-model="dataForm.sheetName" placeholder="请输入图纸名称" maxlength="20"
                      :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="存储类型" prop="storageType">
                    <el-select :value="dataForm.storageType='local_path'" placeholder="请选择存储类型" clearable style="width: 100%;"
                      :disabled="true">
                      <el-option v-for="(item, index) in storageTypeList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="版本" prop="version">
                    <el-input v-model="dataForm.version" placeholder="请输入版本" :validator="validateInput"
                      :disabled="(btntype == 'look' || btntype == 'edit') ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24" v-if="dataForm.storageType == 'local_path'">
                  <el-form-item label="本地文件" prop="datafilelist">
                    <!-- <upload-img v-model="dataForm.drawingPath" :limit="1" :code="uploadCode" /> -->
                    <uploadWj v-model="datafilelist" :uploadlist="false" :disabled="btntype == 'look'" :limit="limit" :code="'TZ'"
                      :detailed="btntype == 'look'"></uploadWj>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24" v-if="dataForm.storageType == 'network_path'">
                  <el-form-item label="网络文件" prop="drawingPath">
                    <el-input v-model="dataForm.drawingPath" placeholder="请输入网络文件地址"
                      :disabled="btntype == 'look' ? true : false" />
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
import { addbimDrawing, updatebimDrawing, getbimDrawingDetail } from "@/api/basicData/index";
import uploadWj from '@/components/upload-wj'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { log } from 'mathjs';
export default {
  components: { uploadWj },
  data() {
    return {
      limit: 0,
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
      storageTypeList: [{
        label: "网络地址",
        value: "network_path"
      }, {
        label: "本地文件",
        value: "local_path"
      }],
      uploadCode: "TZ",
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        sheetName: '',
        storageType: "",
        productId: "",
        id: "",
        version: "",
        drawingPath: "",
        documentId: "",
        name: ""
      },
      btntype: false,
      dataRule: {
        sheetName: [
          { required: true, message: '请输入图纸名称', trigger: 'blur' },

        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请选择产品', trigger: 'change' },

        ],
        drawingPath: [
          { required: true, message: '请选择图片或输入图片地址', trigger: ['blur', 'change'] },
        ],
        // datafilelist: [
        //   { required: true, message: '请选择图片或输入图片地址', trigger: 'no' }
        // ],
        storageType: [
          { required: true, message: '请选择存储类型', trigger: 'change' },
        ],
      },
    }
  },
  created() {
  },
  methods: {
    handleClick() { },
    goBack() {
      this.$emit('close')
    },
    close() {
      this.visible = false
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
      this.dataForm.productId = data[0].all.id
      this.dataForm.name = data[0].all.name
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('name')
        console.log("this.$refs['dataForm']", this.$refs['dataForm']);
      })
    },
    handleClose() {
      this.dataForm = {
        sheetName: '',
        storageType: "",
        productId: "",
        name: "",
        version: ""
      }
    },
    init(id, type) {
      this.visible = true
      this.dataForm.id = id || ''
      if (type == "edit") {
        this.btntype = "edit"
        this.limit = 1
      } else if (type == "look") {
        this.btntype = "look"

      } else {
        this.btntype = "add"

      }
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getbimDrawingDetail(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
            if (res.data.drawingPath && res.data.storageType == 'local_path') {
              this.datafilelist.push(
                {
                  name: res.data.filename,
                  filename: res.data.filepath,
                  id: res.data.documentId,
                  url: res.data.drawingPath
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
          if (this.datafilelist.length < 1 && this.dataForm.storageType == 'local_path') {
            this.$message.error('文件不能为空，请选择文件')
            return
          }
          // this.btnLoading = true;
          let a = []
          if (this.dataForm.storageType == 'local_path') {
            // this.dataForm.documentId = this.datafilelist[0].id
            // this.dataForm.drawingPath = this.datafilelist[0].url
            if (this.datafilelist.length) {
              a = this.datafilelist.map(item => {
                return { drawingPath: item.url,documentId: item.id }
              })
            }
          }
          let obj1={}
          let obj={}
          if(this.dataForm.id){
            obj1 = {
              documentId: this.datafilelist.length ? this.datafilelist[0].id : '',
              drawingPath: this.datafilelist.length ? this.datafilelist[0].url : this.dataForm.drawingPath,
              id: this.dataForm.id,
              productId: this.dataForm.productId,
              storageType: this.dataForm.storageType,
              sheetName: this.dataForm.sheetName,
              version: this.dataForm.version,
              newFlag: this.dataForm.newFlag
            }
          }else{
            if(this.dataForm.storageType == 'local_path'){
              obj = {
                drawing: this.dataForm,
                pathList: a,
              }
            }else{
              obj = {
                drawing: this.dataForm,
              }
            } 
          }
          let formMethod = this.dataForm.id ? updatebimDrawing(obj1) : addbimDrawing(obj);
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
</style>
