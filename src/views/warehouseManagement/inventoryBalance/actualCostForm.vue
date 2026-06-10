<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" content="价格详情" />
          <div class="options" v-if="type != 'look'">
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="listLoading">
          <!-- <el-tabs v-model="activeName"> -->
          <!-- <el-tab-pane label="产品信息" name="jcInfo"> -->
          <div
            style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
               <h4>产品信息</h4>
          </div>
          <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="top">
              <el-col :span="6">
                <el-form-item label="产品编码" prop="productsCode" ref="productsCode">
                  <el-input disabled v-model="dataForm.productsCode" placeholder="">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品名称" prop="productsName" ref="productsName">
                  <el-input disabled v-model="dataForm.productsName" placeholder="">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="产品图号" prop="productsDrawingNo" ref="productsDrawingNo">
                  <el-input disabled v-model="dataForm.productsDrawingNo" placeholder="">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>

          <div class="processBox">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h4>料费信息</h4>
            </div>
            <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO :data="materialList" id="table">
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />


              <el-table-column prop="itemName" label="项目名称"> </el-table-column>
              <el-table-column prop="price" label="项目单价"> </el-table-column>
              <el-table-column prop="unit" label="项目单位"> </el-table-column>
              <el-table-column prop="amount" label="金额"> </el-table-column>

            </el-table>
            <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left:10px" class="text">
              <span style="font-weight:600;margin-right:10px">总材料成本：{{ totalMaterialCost }}(元)</span>
            </div>
          </div>
          <div class="processBox" style="margin-top:20px">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h4>人工费用信息</h4>
            </div>
            <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO :data="processList" id="table">
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

              <el-table-column prop="itemName" label="项目名称"> </el-table-column>
              <el-table-column prop="price" label="项目单价"> </el-table-column>
              <el-table-column prop="unit" label="项目单位"> </el-table-column>
              <el-table-column prop="amount" label="金额"> </el-table-column>
            </el-table>
            <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left:10px" class="text">
              <span style="font-weight:600;margin-right:20px">总人工费用：{{ totalWorkingHours }}(元)</span>
            </div>
          </div>

          <div class="processBox" style="margin-top:20px">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h4>制造费用信息</h4>
            </div>
            <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO :data="projectList" id="table">
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
              <el-table-column prop="itemName" label="项目名称"> </el-table-column>
              <el-table-column prop="price" label="项目单价"> </el-table-column>
              <el-table-column prop="unit" label="项目单位"> </el-table-column>
              <el-table-column prop="amount" label="金额"> </el-table-column>

            </el-table>
            <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left:10px" class="text">
              <span style="font-weight:600;margin-right:10px">总制造费用：{{ totalManufacturingCosts
              }}(元)</span>
            </div>


          </div>
          <div style="margin-top:20px" class="text">
            <span style="margin-left:10px;font-weight:600;">总材料成本：</span><span
              style="margin-right:20px;">{{ totalMaterialCost }}(元)</span>
            <span style="margin-left:10px;font-weight:600;">总人工费用：</span><span
              style="margin-right:20px;">{{ totalWorkingHours }}(元)</span>
            <span style="margin-left:10px;font-weight:600;">总制造费用：</span><span
              style="margin-right:20px;">{{ totalManufacturingCosts }}(元)</span>
            <span style="font-weight:600"> 合计成本:</span><span>{{ 
              totalMaterialCost&&totalWorkingHours&&totalManufacturingCosts?Number(totalMaterialCost) + Number(totalWorkingHours) + Number(totalManufacturingCosts):0 
              }}(元)</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area> -->
  </div>
</template>
<script>


// import SourceArea from './source.vue'
import { costDetail } from '@/api/balances/index'
export default {
  components: {
    // SourceArea
  },
  data() {
    return {
      activeName: 'jcInfo',
      dialogTitle: '',
      loading: false,
      btnLoading: false,
      index: null,
      sourceVisibled: false,
      blankProductsList: [],
      // 费用项目
      expenseItems: {
        data: []
      },
      expenseItemList: [],
      processesList: [],
      selfMadePricingLines: [],
      dataFormTwo: {
        data: []
      },
      listLoading: true,
      dataForm: {},
      type: "",
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      sourceData: [],
      currntIndex: '',

      materialList: [],
      processList: [],
      projectList: [],
    }
  },
  created() {
  },
  computed: {
    totalMaterialCost: function () {
      var totalNums = 0;
      for (var i = 0; i < this.materialList.length; i++) {
        if (this.materialList[i].amount&&Number(this.materialList[i].amount)>0) {
          totalNums = this.jnpf.math('add', [totalNums, this.materialList[i].amount])

        } else {
          return totalNums = 0
        }
      }
      return totalNums
    },
    totalWorkingHours: function () {
      var totalAssistantNums = 0;
      for (var i = 0; i < this.processList.length; i++) {
        
        if (this.processList[i].amount&&Number(this.processList[i].amount)>0) {
          totalAssistantNums = this.jnpf.math('add', [totalAssistantNums, this.processList[i].amount])

        }else{
          return totalAssistantNums=0
        }
      }
      return totalAssistantNums
    },
    totalManufacturingCosts: function () {
      var totalAmounts = 0;
      for (var i = 0; i < this.projectList.length; i++) {
        
        if (this.projectList[i].amount&&Number(this.projectList[i].amount)>0) {
          totalAmounts = this.jnpf.math('add', [totalAmounts, this.projectList[i].amount])

        }else{
          return totalAmounts=0
        }
      }
      return totalAmounts
    },

  },

  methods: {
    goBack() {
      this.$emit('close', true)
    },
    init(id, type) {
      this.listLoading = false
      this.dataForm.id = id || ''
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].clearValidate()
        if (!this.dataForm.id) {
        } else {
          costDetail(this.dataForm.id).then(res => {
            let selfMadePricing = res.data.lineList
            this.dataForm = res.data

            this.listLoading = false

            if (selfMadePricing.length) {
              selfMadePricing.forEach(item => {
                if (item.itemType == "material") {
                  this.materialList.push(item)
                  // 材料费用
                } else if (item.itemType == "process") {
                  // 工序费用
                  this.processList.push(item)

                } else if (item.itemType == "project") {
                  // 制造费用
                  this.projectList.push(item)
                }
                this.materialList = this.materialList.sort((a, b) => a.sort - b.sort);
                this.processList = this.processList.sort((a, b) => a.sort - b.sort);
                this.projectList = this.projectList.sort((a, b) => a.sort - b.sort);
              });
            }


          })
        }
      })
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
  padding: 10px 30px;
}

.contBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
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

.viewData {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>