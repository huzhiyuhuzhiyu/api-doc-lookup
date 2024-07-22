<template>
  <div>
    <el-drawer title="报价BOM" :visible.sync="drawer" :direction="direction" :wrapperClosable="false" :before-close="handleClose" size="45%" class="JNPF-common-drawer columnSettings-drawer">
      <div class="JNPF-flex-main">
        <el-scrollbar class="column-list">
          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <el-table v-bind="dataFormTwo.data" :data="dataFormTwo.data" size='mini' id="table" style="width: 100%">
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
              <el-table-column prop="productsCode" label="产品编码" min-width="120" show-overflow-tooltip />
              <el-table-column prop="productsName" label="产品名称" min-width="120" show-overflow-tooltip />
              <el-table-column prop="productsDrawingNo" label="产品图号" min-width="120" show-overflow-tooltip />
              <el-table-column prop="shoulderLength" label="夹肩长" min-width="120" show-overflow-tooltip />
              <el-table-column prop="bomsleeve" label="对应套筒" min-width="180" show-overflow-tooltip />
              <el-table-column prop="bomsheath" label="对应护套" min-width="180" show-overflow-tooltip />
              <!-- <el-table-column prop="bomsleeve" label="对应套筒" min-width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.bomsleeve" placeholder="请输入对应套筒" :disabled="true"/>
                </template>
              </el-table-column>
              <el-table-column prop="bomsheath" label="对应护套" min-width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.bomsheath" placeholder="请输入对应护套" :disabled="true" />
                </template>
              </el-table-column> -->
              <el-table-column prop="qty" label="数量" min-width="120" show-overflow-tooltip />
              <el-table-column prop="stockQty" label="库存数量" min-width="120" show-overflow-tooltip />
            </el-table>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { getbomOrderDetail } from '@/api/salesManagement/assemblyOrders'
import formValidate from "@/utils/formValidate";
export default {
  data () {
    return {
      sleeve: [],
      types: '',
      sourceLoading: false,
      drawer: false,
      direction: 'rtl',
      type: '',
      dataFormTwo: {
        data: [],
      },
    }
  },

  methods: {
    init (id) {
      this.drawer = true
      getbomOrderDetail(id).then(res => {
        if (!res.data.length) return
        res.data.map(element => {
          element.bomsleeve = element.sleeve.join('、')
          let a = []
          element.sheath.map(item => {
            item.code != 0 ? a.push(item.code) : ''
          })
          element.bomsheath = a.join('、')
        });
        this.dataFormTwo.data = res.data
      })
    },
    handleClose (done) {
      this.drawer = false
      this.$emit('refresh')
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