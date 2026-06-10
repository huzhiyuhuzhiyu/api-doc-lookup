<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="装箱" />
          <div class="options">
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提交</el-button>
            <el-button :loading="btnLoading" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
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
                  <el-col :span="12">
                    <el-form-item label="条码" prop="barCode" ref="barCode">
                      <el-input v-model="dataForm.barCode" placeholder="" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="标准箱" prop="standardBoxName" ref="standardBoxName">
                      <el-input v-model="dataForm.standardBoxName" placeholder="" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark" ref="remark">
                      <el-input type="textarea" :rows="3" v-model="dataForm.remark" placeholder="请输入备注" maxlength="200">
                      </el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>
              <div v-if="type !== 'look'">
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                  icon="el-icon-plus" :disabled="type == 'look' ? true : false"
                  @click="openSeleceProductDialog()">选择产品</el-button>
              </div>
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="tableContainer">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :data="dataFormTwo.data" id="table">
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                  <el-table-column prop="productsCode" label="产品编码" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productsCode'">
                        <div class="viewData">
                          <span>{{ scope.row.productsCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productsName" label="产品名称" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'productsName'">
                        <div class="viewData">
                          <span>{{ scope.row.productsName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drawingNo" label="型号" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                        <div class="viewData">
                          <span>{{ scope.row.drawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="realityTotalNum" label="装箱数量" min-width="180">
                    <template slot="header">
                      <span class="required">*</span>装箱数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'realityTotalNum'"
                        :rules='productRules.realityTotalNum'>
                        <el-input v-model="scope.row.realityTotalNum" maxlength="20" placeholder="请输入装箱数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位(主)" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>



                  <el-table-column label="操作" width="180" fixed="right" v-if="dataFormTwo.data.length > 1">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" class="JNPF-table-delBtn"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>

                    </template>
                  </el-table-column>
                </el-table>
              </el-form>


            </el-tab-pane>
          </el-tabs>
          <ComSelect-page ref="ComSelect-pageProduct" @change="productData" :tableItems="ProductTableItems"
            dialogTitle="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
            :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import { emptyModifyBarcode } from '@/api/warehouseManagement/packingList'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import formValidate from "@/utils/formValidate";
export default {
  components: {
  },
  data() {
    return {
      getProductList, // 产品选择弹出框树状列表请求api
      getcategoryTree,
      // material
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
        { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories", "other"],
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
      activeName: 'jcInfo',
      dialogTitle: '',
      productVisibled: false,
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      dataForm: {
        barCode: '',
        standardBox: '',
        standardBoxName: '',
        id: '',
        remark: '',
        barcodeLines: [],
      },
      sourceBarCodeForm: {
      },
      type: "",
      rules: {
      },
      productRules: {
        realityTotalNum: [
          { required: true, trigger: ['blur'] },
          // { validator: this.formValidate('number', '装箱数量必须是整数', (errMsg) => { this.$message.error('装箱数量：' + errMsg) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的装箱数量", (errMsg) => { this.$message.error('装箱数量：' + errMsg) }] }), trigger: 'blur' },
        ],

      },



    }
  },
  created() {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 产品弹窗
    openSeleceProductDialog() {
      this.$refs['ComSelect-pageProduct'].openDialog()
    },
    productData(id, data) {
      console.log(data, '产品');
      if (data.length) {
        let selectArr = []
        let list = data.map(item => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            calculationDirection: item.calculationDirection,
            deputyUnit: item.deputyUnit,
            mainUnit: item.mainUnit,
            realityTotalNum: '',
            productsId: item.id,
            ratio: item.ratio,
            remark: item.remark,
            productsCode: item.code,
            productsName: item.name,
            drawingNo: item.drawingNo,
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = [];
          selectArr = selectArr.filter(item1 => {
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
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr,]
      }
    },
    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(data) {
      console.log(data);
      this.dataForm.id = data.id
      this.dataForm.barCode = data.barCode
      this.dataForm.standardBox = data.standardBox
      this.dataForm.standardBoxName = data.standardBoxName
    },




    // 表单提交
    dataFormSubmit() {
      this.request()
    },

    async request() {
      this.btnLoading = true
      let focusFlag = true // 自动聚焦是否可用
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && focusFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            focusFlag = false
            if (formItem.$children[1].$el) {
              this.jnpf.focusItem(formItem.$children[1].$el)
              this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
              return true
            }
          }
        });
      }
      console.log(this.dataForm, '参数');
      console.log(valid_2, '11111111111111111');
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (focusFlag) {
            this.dataForm.barcodeLines = this.dataFormTwo.data
            let _data = {
              barcode: this.dataForm
            }
            console.log(_data);
            this.btnLoading = true
            emptyModifyBarcode(_data).then(res => {
              if (res.msg === 'Success') res.msg = '保存成功'
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
            this.btnLoading = false
            for (let i = 0; i < this.dataFormTwo.data.length; i++) {
              const item = this.dataFormTwo.data[i]
              if (!item.realityTotalNum) {
                this.$message({
                  type: 'error',
                  message: '请输入第' + (i + 1) + '行的装箱数量',
                  duration: 1500,
                })
                break
              }
            }
            return
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

::v-deep .el-date-table .today span {
  font-weight: 700;
  color: #C0C4CC !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>