<template>
  <div>
    <el-drawer title="供应商产品信息" :visible.sync="drawer" :direction="direction" :wrapperClosable="false"
      :before-close="handleClose" size="45%" class="JNPF-common-drawer columnSettings-drawer" append-to-body>
      <div class="JNPF-flex-main">

        <el-scrollbar class="column-list">
          <el-tabs v-model="activeName" @tab-click="tabChange">
            <!-- 因为两个tab Dom完全一致，这里tabs只用来触发事件 -->
            <el-tab-pane label="有效价格" :name="'有效价格'"></el-tab-pane>
            <el-tab-pane label="过期价格" :name="'过期价格'"></el-tab-pane>
          </el-tabs>
          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <el-table hasNO fixedNO v-bind="dataFormTwo.data" hasC :data="dataFormTwo.data" id="table"
              style="width: 100%">
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />

              <el-table-column prop="cooperativePartnerIdCode" label="供应商编码" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'cooperativePartnerIdCode'">
                    <div class="viewData">
                      <span>{{ scope.row.cooperativePartnerIdCode }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="cooperativePartnerIdName" label="供应商名称" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'cooperativePartnerIdName'">
                    <div class="viewData">
                      <span>{{ scope.row.cooperativePartnerIdName }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="productCode" label="产品编码" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'">
                    <div class="viewData">
                      <span>{{ scope.row.productCode }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productName'">
                    <div class="viewData">
                      <span>{{ scope.row.productName }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="productDrawingNo" label="型号" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'">
                    <div class="viewData">
                      <span>{{ scope.row.productDrawingNo }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="单价" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'price'">
                    <div class="viewData">
                      <span>{{ scope.row.price }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="taxRate" label="税率%" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'">
                    <div class="viewData">
                      <span>{{ scope.row.taxRate }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="priceStartTime" label="价格起始日期" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'priceStartTime'">
                    <div class="viewData">
                      <span>{{ scope.row.priceStartTime }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="priceEndTime" label="价格结束日期" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'priceEndTime'">
                    <div class="viewData">
                      <span>{{ scope.row.priceEndTime }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="orderRatio" label="订购比例" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'orderRatio'">
                    <div class="viewData">
                      <span>{{ scope.row.orderRatio }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="90" :fixed="'right'" v-if="true">
                <template slot-scope="scope">
                  <el-button type="text" :disabled="false" @click="handleSelect(scope)">
                    选择
                  </el-button>
                </template>
              </el-table-column>
              <div class="noDataTip" v-if="dataFormTwo.data.length === 0">暂无数据</div>
            </el-table>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import formValidate from "@/utils/formValidate";
export default {
  components: {

  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      type: '',
      dataFormTwo: {
        data: [],
      },
      activeName: '有效价格',
      effectivePrice: [],
      overduePrice: [],
    }
  },

  methods: {
    init(data, deliveryDate) {
      this.effectivePrice = []
      this.overduePrice = []
      const effectDate = new Date().getTime()
      data.forEach(item => {
        const startDate = new Date(item.priceStartTime).getTime()
        const endDate = new Date(item.priceEndTime).getTime() + 86400000
        if (startDate < effectDate && endDate > effectDate) {
          this.effectivePrice.push(item)
        } else {
          this.overduePrice.push(item)
        }
      })

      this.activeName = '有效价格'
      this.dataFormTwo.data = this.effectivePrice

      this.drawer = true
    },
    handleClose(done) {
      this.drawer = false
    },
    handleSelect(scope) {
      this.$emit('confirm', scope.row)
    },
    tabChange(e) {
      if (e.label === '有效价格') {
        this.dataFormTwo.data = this.effectivePrice
      } else {
        this.dataFormTwo.data = this.overduePrice
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
::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}
</style>