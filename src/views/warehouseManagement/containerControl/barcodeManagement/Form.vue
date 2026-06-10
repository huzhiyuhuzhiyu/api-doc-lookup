<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div class="JNPF-common-page-header">
          <el-page-header @back="goBack" content="拆箱" />
          <div class="options">
            <!-- <el-button type="success" :loading="btnLoading" @click="printWithLodop">
              保存草稿</el-button> -->
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
                    <el-form-item label="新条码" prop="barCode" ref="barCode">
                      <el-input v-model="dataForm.barCode" placeholder="" disabled>
                      </el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>

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
                  <el-table-column prop="routingName" label="工艺路线名称" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'routingName'">
                        <div class="viewData">
                          <span>{{ scope.row.routingName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processName" label="工序名称" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'processName'">
                        <div class="viewData">
                          <span>{{ scope.row.processName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>




                  <el-table-column prop="totalNum" label="数量" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'totalNum'">
                        <div class="viewData">
                          <span>{{ scope.row.totalNum }}</span>
                        </div>
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
                  <el-table-column prop="realityTotalNum" label="剩余数量" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'realityTotalNum'">
                        <div class="viewData">
                          <span>{{ scope.row.realityTotalNum }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="newBoxnum" label="新箱数量" min-width="180">
                    <template slot="header">
                      <span class="required">*</span>新箱数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'newBoxnum'" :rules='productRules.newBoxnum'>
                        <el-input v-model="scope.row.newBoxnum" maxlength="20" placeholder="请输入新箱数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 
                  <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="20" placeholder="请输入备注">{{
                        scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column> -->

                  <el-table-column label="操作" width="180" fixed="right" v-if="dataFormTwo.data.length > 1">
                    <template slot-scope="scope">
                      <el-button type="text" class="JNPF-table-delBtn"
                        @click="delequipment_process_relList(scope.$index)">删除</el-button>

                    </template>
                  </el-table-column>
                </el-table>
              </el-form>


            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import { detailStockBoxBarcode, splitBox } from '@/api/warehouseManagement/packingList'
import { getCooperativeData, getcategoryTree } from '@/api/basicData/index'
import formValidate from "@/utils/formValidate";
export default {
  components: {
  },
  data() {
    return {
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
        id: '',
      },
      sourceBarCodeForm: {
      },
      type: "",
      rules: {
      },
      productRules: {
        newBoxnum: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('新箱数量：不能为0') }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => (this.dataFormTwo.data[rowIndex].realityTotalNum * 1 >= value * 1), "新箱数量不能超过剩余数量", (errMsg) => { this.$message.error('新箱数量：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error(`新箱数量：${errMsg}`) }] }), trigger: 'blur' }
        ],

      },



    }
  },
  created() {
  },
  computed: {
  },
  watch: {
    // 'dataFormTwo.data': {
    //   handler: function (newVal, oldVal) {
    //     console.log(newVal);
    //     console.log(oldVal, '老数据');
    //     newVal.forEach(item => {
    //       if (item.newBoxnum) {
    //         item.realityTotalNum = item.realityTotalNum - item.newBoxnum
    //       }

    //     })
    //   },
    //   deep: true,
    // },
  },
  methods: {

    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      this.dataForm.id = id || ''

      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.listLoading = false
          this.clearData()
        } else {
          this.dataForm.barCode = this.dataForm.barCode ? this.dataForm.barCode : new Date().getTime() + '001'
          console.log(this.dataForm.barCode);
          detailStockBoxBarcode(this.dataForm.id).then(res => {
            console.log(res, '详情');
            this.sourceBarCodeForm = res.data
            this.sourceBarCodeForm.sourceBarCodeId = this.dataForm.id

            this.dataFormTwo.data = JSON.parse(JSON.stringify(res.data.barcodeLineVOs))
            this.sourceBarCodeForm.barcodeLines = this.sourceBarCodeForm.barcodeLineVOs

            this.dataFormTwo.data.forEach((item, index) => {
              this.$set(this.dataFormTwo.data[index], 'newBoxnum', '')
            })

          }).catch(() => { })

        }
      })

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
            console.log(this.sourceBarCodeForm);
            console.log( this.dataFormTwo.data);
            this.sourceBarCodeForm.barcodeLines.forEach(item => {
              this.dataFormTwo.data.forEach(item2 => {
                if (item.id === item2.id) {
                  item.realityTotalNum = item.realityTotalNum - item2.newBoxnum
                }
              })
            })
            console.log(this.sourceBarCodeForm.barcodeLines,'this.sourceBarCodeForm.barcodeLines');
            this.sourceBarCodeForm.barcodeLines = this.sourceBarCodeForm.barcodeLines.filter(item => item.realityTotalNum !== 0)
            let dataFormTwo = this.dataFormTwo.data.map(item => {
              return {
                ...item,
                boxBarcodeId: null,
                id: null,
                realityTotalNum:item.newBoxnum
              }
            })
            let barcodes = []
            let newData = {
              barCode: this.dataForm.barCode,
              sourceBarCodeId: this.dataForm.id,
              boxStatus: this.sourceBarCodeForm.boxStatus,
              standardBox: this.sourceBarCodeForm.standardBox,
              barcodeLines: dataFormTwo
            }
            if (this.sourceBarCodeForm.barcodeLines.length !== 0) {
              barcodes.unshift(this.sourceBarCodeForm)
              barcodes.push(newData)
            }else{
              barcodes.push(newData)
            }
            this.sourceBarCodeForm.barcodeLineVOs = []


            let _data = {
              barcodes
            }
            console.log(_data);
            this.btnLoading = true
            splitBox(_data).then(res => {
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

              if (!item.purchaseQuantity2) {
                this.$message({
                  type: 'error',
                  message: '第' + (i + 1) + '行的副数量不能为0',
                  duration: 1500,
                })
                break
              }
              if (!item.price) {
                this.$message({
                  type: 'error',
                  message: '第' + (i + 1) + '行的含税单价不能为空',
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
              if (!item.deliveryDate) {
                this.$message({
                  type: 'error',
                  message: '请选择第' + (i + 1) + '行的交货日期',
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