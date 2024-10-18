<template>
  <div>
    <el-drawer title="发料清单" :visible.sync="drawer" :direction="direction" :wrapperClosable="false"
      :before-close="handleClose" size="45%" class="JNPF-common-drawer columnSettings-drawer" append-to-body>
      <div class="JNPF-flex-main">
        <el-scrollbar class="column-list">
          <!-- 人员配置 -->
          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <el-table hasNO fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data" size="mini" id="table"
              style="width: 100%">
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

              <el-table-column prop="productCode" label="产品编码" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.productCode" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'" :rules="productRule.productCode">
                    <div class="viewData">
                      <span>{{ scope.row.productCode }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="mainUnit" label="单位" min-width="90" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.mainUnit" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                    <div class="viewData">
                      <span>{{ scope.row.mainUnit }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="qty" label="基本数量" min-width="90">
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.qty" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'qty'" :rules="productRule.qty">
                    <div class="viewData">
                      <span>{{ scope.row.qty }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="demandQuantity" label="发料数量" min-width="120">
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.demandQuantity" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'demandQuantity'"
                    :rules="productRule.demandQuantity">
                    <div class="viewData">
                      <span>{{ scope.row.demandQuantity }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="issuedQuantity" label="已出库数量" min-width="120">
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.issuedQuantity" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'issuedQuantity'"
                    :rules="productRule.issuedQuantity">
                    <div class="viewData">
                      <span>{{ scope.row.issuedQuantity }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="undeliveredQuantity" label="待出库数量" min-width="120">
                <template slot-scope="scope">
                  <!-- <el-input v-model="scope.row.undeliveredQuantity" :disabled="type === 'look'" placeholder="请输入订购比例"  /> -->
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'undeliveredQuantity'"
                    :rules="productRule.undeliveredQuantity">
                    <div class="viewData">
                      <span>{{ scope.row.undeliveredQuantity }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-scrollbar>
        <!-- <div class="footer">
          <el-button @click="drawer = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="submitForm('dataForm')" v-if="type != 'look' ? true : false">
            {{ $t('common.confirmButton') }}
          </el-button>
        </div> -->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import formValidate from '@/utils/formValidate'

export default {
  components: {},
  data() {
    return {
      types: '',
      drawer: false,
      direction: 'rtl',
      type: '',
      activeName: 'personnel',
      dataFormTwo: {
        data: []
      },
      productRule: {
        demandQuantity1: [
          { required: true, validator: this.checktaxDemandQuantity1(), trigger: ['blur'] },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('发料数量：' + errMsg)
                }
              ]
            }),
            trigger: ['blur']
          }
          // { validator: this.checktaxDemandQuantity1() , trigger: ['blur']},
        ]
      }
    }
  },

  methods: {
    handlerDelete(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 校验发料数量
    checktaxDemandQuantity1() {
      return (rule, value, callback) => {
        let index = rule.field.split('.')[1]
        let msg = `当前第${index * 1 + 1}行：发料数量不能为空`
        if (!value) {
          this.$message.error(msg)
          callback(new Error(msg))
        } else {
          callback()
        }
      }
    },
    init(data, type) {
      console.log(data, '资源')
      // this.dataForm = data
      this.type = type
      console.log(this.type)
      this.dataFormTwo.data = JSON.parse(JSON.stringify(data))
      // if (this.dataFormTwo.data.length) {

      //   this.dataFormTwo.data.forEach((item, index) => {
      //     this.$set(this.dataFormTwo.data[index], 'demandQuantity1', item.demandQuantity1)
      //   })
      // }
      console.log(this.dataFormTwo.data)
      this.drawer = true
    },
    handleClick(tab, event) {
      this.activeName = tab.name
    },

    handleClose(done) {
      this.drawer = false
    },
    async submitForm() {
      this.$refs['productForm'].validate((valid) => {
        if (valid) {
          let sourceData = []
          this.dataFormTwo.data.forEach((item) => {
            sourceData.push({
              outShipmentListId: item.id,
              calculationDirection: item.calculationDirection,
              demandQuantity: item.demandQuantity1,
              deputyUnit: item.deputyUnit,
              mainUnit: item.mainUnit,
              productsId: item.productsId,
              qty: item.qty,
              ratio: item.ratio,
              routingLineId: item.routingLineId,
              shipmentType: 'out_orders'
            })
          })
          console.log('sourceData', sourceData)
          this.$emit('confirm', sourceData)
          this.$message.success('配置成功')
          this.drawer = false
        }
      })
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
    /* margin: 20px 20px 20px;
  display: flex;
  justify-content: flex-end; */
    position: fixed;
    bottom: 10px;
    right: 10px;
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
