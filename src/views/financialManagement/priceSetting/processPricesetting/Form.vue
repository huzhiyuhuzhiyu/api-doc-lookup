<template>
  <div>
    <el-drawer title="标准工序设置单价" :visible.sync="drawer" :direction="direction" :wrapperClosable="false" :before-close="handleClose" size="45%" class="JNPF-common-drawer columnSettings-drawer">

      <div class="JNPF-flex-main">
        <el-scrollbar class="column-list">
          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <el-table hasNO fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data" size='mini' id="table" style="width: 100%">
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
              <el-table-column prop="code" label="工序编码" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'code'">
                    <div class="viewData">
                      <span>{{ scope.row.code }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="工序名称" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'name'">
                    <div class="viewData">
                      <span>{{ scope.row.name }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="pricingType" label="计价类型" min-width="120" show-overflow-tooltip>
                <template slot="header">
                  <span class="required">*</span>计价类型
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'pricingType'">
                    <el-select v-model="scope.row.pricingType" placeholder="请选择计价类型" @change="handlepricingType">
                      <el-option v-for="(item, index) in pricingTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>

                  </el-form-item>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="productCategoryIdText" label="所属分类" min-width="120">
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productCategoryIdText'">
                    <div class="viewData">
                      <span>{{ scope.row.productCategoryIdText }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column> -->

              <el-table-column prop="timePrice" label="计时单价" min-width="120" v-if="type === 'by_time'">
                <template slot="header">
                  <span class="required">*</span>计时单价
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'timePrice'" :rules='productRule.timePrice'>
                    <el-input v-model="scope.row.timePrice" placeholder="请输入计时单价" clearable maxlength="20" oninput="value = value.replace(/[^0-9]/g,'')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="unitPrice" label="正品单价" min-width="140" v-if="type === 'by_piece'">
                <template slot="header">
                  <span class="required">*</span>正品单价
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'unitPrice'" :rules='productRule.unitPrice'>
                    <el-input v-model="scope.row.unitPrice" placeholder="请输入正品单价" clearable maxlength="20" oninput="value = value.replace(/[^0-9]/g,'')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="rejectUnitPrice" label="次品单价" min-width="140" v-if="type === 'by_piece'">
                <template slot="header">
                  <span class="required">*</span>次品单价
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'rejectUnitPrice'" :rules='productRule.rejectUnitPrice'>
                    <el-input v-model="scope.row.rejectUnitPrice" placeholder="请输入次品单价" clearable maxlength="20" oninput="value = value.replace(/[^0-9]/g,'')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="scrapUnitPrice" label="废品单价" min-width="140" v-if="type === 'by_piece'">
                <template slot="header">
                  <span class="required">*</span>废品单价
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'scrapUnitPrice'" :rules='productRule.scrapUnitPrice'>
                    <el-input v-model="scope.row.scrapUnitPrice" placeholder="请输入废品单价" clearable maxlength="20" oninput="value = value.replace(/[^0-9]/g,'')"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-scrollbar>
        <div class="footer">
          <el-button @click="drawer = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="sourceLoading" @click="submitForm('dataForm')" v-if="type != 'look' ? true : false">
            {{ $t('common.confirmButton') }}
          </el-button>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { updateBimProcess, updatePriceResourceLine } from '@/api/bimProcess/index'
import formValidate from "@/utils/formValidate";
export default {
  components: {

  },
  data () {
    return {
      types: '',
      sourceLoading: false,
      drawer: false,
      direction: 'rtl',
      type: '',
      dataFormTwo: {
        data: [],
      },
      pricingTypeList: [{
        label: "计时",
        value: "by_time",
      }],
      productRule: {
        pricingType: [{ required: true, message: "请选择计价类型", trigger: 'change' }],
        timePrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('计时单价：' + errMsg) }] }), trigger: ['blur'] },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('计时单价：不能为0') }), trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('正品单价：' + errMsg) }] }), trigger: ['blur'] },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('正品单价：不能为0') }), trigger: 'blur' }
        ],
        rejectUnitPrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('次品单价：' + errMsg) }] }), trigger: ['blur'] },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('次品单价：不能为0') }), trigger: 'blur' }
        ],
        scrapUnitPrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('废品单价：' + errMsg) }] }), trigger: ['blur'] },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('废品单价：不能为0') }), trigger: 'blur' }
        ],
      }
    }
  },

  methods: {
    handlepricingType (e) {
      this.type = e
      if (e == 'by_piece') {
        this.dataFormTwo.data[0].timePrice = 0
      } else {
        this.dataFormTwo.data[0].unitPrice = 0 // 正品单价
        this.dataFormTwo.data[0].rejectUnitPrice = 0 // 次品单价
        this.dataFormTwo.data[0].scrapUnitPrice = 0// 废品单价
      }
    },
    init (data, type) {
      console.log(data, '资源')
      this.dataFormTwo.data = []
      this.type = data.pricingType
      if (data.pricingType === 'by_time') {
        this.dataFormTwo.data.push({
          timePrice: data.timePrice,
          pricingType: data.pricingType,
          processingType: data.processingType,
          productCategoryId: data.productCategoryId,
          name: data.name,
          id: data.id,
          code: data.code,
          remark: data.remark,
          productCategoryIdText: data.productCategoryIdText,
        })
      } else {
        this.dataFormTwo.data.push({
          unitPrice: data.unitPrice,
          id: data.id,
          scrapUnitPrice: data.scrapUnitPrice,
          rejectUnitPrice: data.rejectUnitPrice,
          pricingType: data.pricingType,
          processingType: data.processingType,
          productCategoryId: data.productCategoryId,
          name: data.name,
          code: data.code,
          remark: data.remark,
          productCategoryIdText: data.productCategoryIdText,
        })
      }
      this.drawer = true

      console.log(this.dataFormTwo.data);


    },
    handleClose (done) {
      this.drawer = false
    },
    async submitForm () {
      this.sourceLoading = true
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      if (valid_2) {
        let _data = {
          id: this.dataFormTwo.data[0].id, // 工序id
          name: this.dataFormTwo.data[0].name, //  工序名称
          code: this.dataFormTwo.data[0].code, // 工序编码
          processingType: this.dataFormTwo.data[0].processingType, // 工序类型
          unitPrice: this.dataFormTwo.data[0].unitPrice, // 正品单价
          rejectUnitPrice: this.dataFormTwo.data[0].rejectUnitPrice, // 次品单价
          scrapUnitPrice: this.dataFormTwo.data[0].scrapUnitPrice, // 废品单价
          timePrice: this.dataFormTwo.data[0].timePrice, // 计价单价
          remark: this.dataFormTwo.data[0].remark, // 备注
          pricingType: this.dataFormTwo.data[0].pricingType,
          productCategoryId: this.dataFormTwo.data[0].productCategoryId,
        }
        updateBimProcess(_data).then(res => {
          this.$message({
            message: "设置成功",
            type: 'success',
            duration: 1500,
          })
          this.sourceLoading = true
          this.$emit('close', true)
          this.drawer = false
        }).catch(err => {
          this.sourceLoading = false
          this.drawer = false
        })
      } else {
        this.drawer = true
        this.sourceLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.columnSettings-drawer {
  font-size: 16px;

  .JNPF-flex-main {
    overflow: hidden;
  }

  .columnSetting-head {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 14px;
    color: #303133;
  }

  .column-list {
    height: 100%;
    padding: 8px 10px 0;

    .column-item {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      font-size: 12px;
      color: #303133;
      cursor: pointer;
      border-bottom: 1px solid #e3e6eb;

      &:hover {
        background: rgba(25, 144, 250, 0.1);
      }

      .column-item-icon {
        margin: auto 8px auto 10px;
        color: #909399;
        cursor: move;
        font-size: 14px;
      }

      .el-switch {
        transform: scale(0.8);
      }

      .column-item-label {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        display: flex;
        align-items: center;
      }

      .check-box {
        margin-right: 16px;
      }
    }
  }

  .footer {
    margin: 4px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }

  .topButton {
    margin-right: 8px;
    margin-left: 8px;
    font-size: 14px !important;
  }

  .noDataTip {
    text-align: 'center';
    padding: '10%';
    color: #aaa;
  }

  .viewData {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
<style scoped>
.submit {
  position: absolute;
  bottom: 20px;
  left: 50%;
}

.columnSettings-drawer {
  font-size: 16px;
}

.footer {
  margin: 20px 20px 20px;
  display: flex;
  justify-content: flex-end;
}

::v-deep .is-stretch {
  display: block !important;
}

.el-tabs__nav.is-stretch /deep/ {
  min-width: none !important;
  display: flex;
  justify-content: flex-start;
}

.custom-tab-pane .el-tab-pane__content {
  width: 500px;
}

.el-tabs__active-bar /deep/ {
  width: 60px !important;
}

.el-tabs__header {
  max-width: 316px !important;
}

::v-deep .el-tabs__content {
  padding: 0px 10px !important;
}

::v-deep .el-tab-pane {
  height: 83vh !important;
}

.required {
  color: red;
  margin-right: 4px;
}

/* ::v-deep .el-table__body-wrapper.is-scrolling-none {
  min-height: 685px !important;

} */
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>