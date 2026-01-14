<template>
  <el-dialog title="生成条码" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px" @close="handleClose" append-to-body>
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRules" label-position="top"
      label-width="120px">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="条码" prop="barCode">
            <el-input v-model="dataForm.barCode" placeholder="条码" maxlength="20" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否零头" prop="oddFlag">
            <!-- <el-input v-model="dataForm.oddFlag"  maxlength="20" :disabled="type ? true : false" /> -->
            <el-select v-model="dataForm.oddFlag" placeholder="请选择是否零头" style="width: 100%;">
              <el-option v-for="(item, index) in oddFlagList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">

          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <el-form-item label-width="180" label="产品信息">
              <el-table style="border: 1px solid #e3e7ee;" :data="dataFormTwo.data" v-bind="dataFormTwo.data"
                height="600" id="table" border>
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column prop="productsCode" label="产品编码" min-width="120" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-form-item prop="productsCode">
                      <div class="viewData">
                        <span>{{ scope.row.productsCode }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="productsName" label="产品名称" min-width="120" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-form-item prop="productsName">
                      <div class="viewData">
                        <span>{{ scope.row.productsName }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="drawingNo" label="型号" min-width="200" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-form-item prop="drawingNo">
                      <div class="viewData">
                        <span>{{ scope.row.drawingNo }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="routingName" label="工艺路线名称" min-width="160" show-overflow-tooltip
                  v-if="showRoutingLine && hasRoutingLine">
                  <template slot-scope="scope">
                    <el-form-item prop="routingName">
                      <div class="viewData">
                        <span>{{ scope.row.routingName }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="processName" label="工序名称" min-width="160" show-overflow-tooltip
                  v-if="showRoutingLine && hasRoutingLine">
                  <template slot-scope="scope">
                    <el-form-item prop="processName">
                      <div class="viewData">
                        <span>{{ scope.row.processName }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="packingQuantity" label="待装箱数量" min-width="140"></el-table-column>
                <el-table-column prop="totalNum" label="装箱数量" min-width="160">
                  <template slot="header">
                    <span class="required">*</span>装箱数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'totalNum'" :rules='productRules.totalNum'>
                      <el-input clearable v-model="scope.row.totalNum" maxlength="20" placeholder="请输入装箱数量">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" min-width="90" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-form-item prop="mainUnit">
                      <div class="viewData">
                        <span>{{ scope.row.mainUnit }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                      <el-form-item prop="remark">
                        <div class="viewData">
                          <span>{{ scope.row.remark }}</span>
                        </div>
                      </el-form-item>
                    </template>
              </el-table-column> -->
              </el-table>
            </el-form-item>
          </el-form>
        </el-col>


      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-show="!type">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    standardBoxName: {
      type: String,
    },
    oddBoxName: {
      type: String,
    },
    standardBox: {
      type: String,
    },
    oddBox: {
      type: String,
    },
    showRoutingLine: { // 是否显示工艺路线明细
      type: Boolean,
      default: false
    }
  },
  created() {
    console.log(this.standardBoxName, 'sss');
  },
  data() {
    return {
      type: '',
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataFormTwo: {
        data: []
      },
      dataForm: {
        barCode: '',
        oddFlag: 0,
      },
      oddFlagList: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      dataRules: {

      },
      productRules: {
        totalNum: [
          { required: true, trigger: ['blur'] },
          // { validator: this.formValidate('number', '装箱数量必须是整数', (errMsg) => { this.$message.error('装箱数量：' + errMsg) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => this.dataFormTwo.data[rowIndex].packingQuantity >= this.dataFormTwo.data[rowIndex].totalNum, "装箱数量不能超过待装箱数量", (errMsg) => { this.$message.error('装箱数量：' + errMsg) }] }), trigger: 'blur' }
        ],
      },
      parentData: [],
    }
  },
  computed: {
    hasRoutingLine() { // 展示数据是否含有工艺路线明细
      return true
    }
  },
  methods: {
    handleClose() {
    },
    async dataFormSubmit() {
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      console.log(this.standardBoxName);
      if (valid_2) {
        this.visible = false
        let _data = [{
          barCode: this.dataForm.barCode,
          oddFlag: this.dataForm.oddFlag,
          standardBoxName: this.dataForm.oddFlag ? this.oddBoxName : this.standardBoxName,
          standardBox: this.dataForm.oddFlag ? this.oddBox : this.standardBox,
          barcodeLines: this.dataFormTwo.data
        }]
        this.parentData.forEach((item, index) => {
          this.dataFormTwo.data.forEach(item2 => {
            let mergeFlag = item.returnDeliveryNoticeLineId === item2.returnDeliveryNoticeLineId // 判断是否需要合并展示
            if (!this.$parent.dataForm.sourceOrderNo) mergeFlag = item.productsCode === item2.productsCode && item.routingLineId === item2.routingLineId
            if (mergeFlag) {
              this.parentData[index].packingQuantity = this.jnpf.math('add', [item2.totalNum * 1 + this.parentData[index].packingQuantity * 1])
              this.parentData[index].packedQuantity = item2.packingQuantity - item2.totalNum
            }
          })
        })
        this.$emit('codeData', _data, this.parentData)
        this.dataForm.oddFlag = 0
      }
    },
    init(code, count, data, dataFormTwo, barcode) {
      this.visible = true
      let codeCount = code + '000'
      // 拷贝明细数据 
      this.parentData = JSON.parse(JSON.stringify(dataFormTwo))
      this.dataForm.barCode = codeCount * 1 + count
      if (barcode) {
        this.dataForm.barCode = barcode * 1 + 1
      }
      console.log(this.dataForm.barCode, '++++');
      console.log(data);
      this.dataFormTwo.data = []
      data.forEach(item => {
        this.dataFormTwo.data.push({
          ...item,
          packingQuantity: item.packedQuantity,
          totalNum: '',
        })
      })
    },
  },
}
</script>

<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>