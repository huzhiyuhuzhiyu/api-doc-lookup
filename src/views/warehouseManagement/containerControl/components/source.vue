<template>
  <div>
    <el-drawer title="条码信息" :visible.sync="drawer" :direction="direction" :wrapperClosable="false"
      :before-close="handleClose" size="45%" class="JNPF-common-drawer columnSettings-drawer" append-to-body>
      <div class="JNPF-flex-main">

        <el-scrollbar class="column-list">
          <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
            <el-table hasNO fixedNO v-bind="dataFormTwo.data" hasC :data="dataFormTwo.data" id="table"
              style="width: 100%" border>
              <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
              <el-table-column prop="productsCode" label="产品编码" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productsCode'">
                    <div class="viewData">
                      <span>{{ scope.row.productsCode }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="productsName" label="产品名称" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'productsName'">
                    <div class="viewData">
                      <span>{{ scope.row.productsName }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="drawingNo" label="产品图号" min-width="200" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'drawingNo'">
                    <div class="viewData">
                      <span>{{ scope.row.drawingNo }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="routingName" label="工艺路线名称" min-width="160" show-overflow-tooltip v-if="showRoutingLine">
                <template slot-scope="scope">
                  <el-form-item prop="routingName">
                    <div class="viewData">
                      <span>{{ scope.row.routingName }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="processName" label="工序名称" min-width="160" show-overflow-tooltip v-if="showRoutingLine">
                <template slot-scope="scope">
                  <el-form-item prop="processName">
                    <div class="viewData">
                      <span>{{ scope.row.processName }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="totalNum" label="装箱数" min-width="120">
                <template slot-scope="scope">
                  <div class="viewData">
                    <span>{{ scope.row.totalNum }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="mainUnit" label="单位(主)" min-width="90" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                    <div class="viewData">
                      <span>{{ scope.row.mainUnit }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="remark" label="备注" min-width="90" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form-item :prop="'data.' + scope.$index + '.' + 'remark'">
                    <div class="viewData">
                      <span>{{ scope.row.remark }}</span>
                    </div>
                  </el-form-item>
                </template>
              </el-table-column> -->
              <div class="noDataTip" v-if="dataFormTwo.data.length === 0">暂无数据</div>
            </el-table>
          </el-form>
        </el-scrollbar>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
      showRoutingLine: { // 是否显示工艺路线明细
        type: Boolean,
        default: false
      }
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      type: '',
      dataFormTwo: {
        data: [],
      },
    }
  },
  methods: {
    init(data) {
      var mergedData = [];
      var idMap = {};
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var productsCode = item.productsCode;
        var totalNum = parseInt(item.totalNum);

        if (idMap[productsCode]) {
          idMap[productsCode].totalNum += Number(totalNum);
        } else {
          idMap[productsCode] = { ...item, totalNum: totalNum };
          mergedData.push(idMap[productsCode]);
        }
      }
      this.dataFormTwo.data = mergedData
      this.drawer = true
    },
    handleClose(done) {
      this.drawer = false
    },
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