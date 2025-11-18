<script>
import {buttonList, getBatchColumns, getSingleBoxColumns} from "./data";
import {addStockPlanPallet, getStockPlanWaitPalletPage} from "@/api/PackagingPalletPlan";
import {getBimPackagingMaterialsPage} from "@/api/packagingMaterials";

export default {
  name: "index",
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            {prop: 'batchNumber', symbol: 'like', fixed: true},
            {prop: 'packagingMethod', symbol: '==', fixed: true},
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: []
        },
      }],
      loading: false,
      visible: false,
      batchData: [],
      singleBoxData: [],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.getDictDataSync('packaging')
        },
      ],
      listQuery: {},
      btnList: buttonList,
      columnList: [],
      batchColumns: getBatchColumns(),
      singleBoxColumns: getSingleBoxColumns(),
      batchSelectionLock: false,
      singleBoxSelectionLock: false,
      selectedBatchList: [],
      selectedSingleBoxList: [],
      palletValue: '',
      palletOptions: [],
      superQueryTableRef: 'batchTable',
    }
  },
  computed: {
    selectedBoxCount() {
      return this.selectedSingleBoxList.length;
    },

    boxQuantity() {
      if (!this.selectedSingleBoxList.length) {
        return 0;
      }
      return this.jnpf.numberFormat(
        this.selectedSingleBoxList.reduce((sum, item) => sum + (parseFloat(item.num) || 0), 0),
        2
      );
    }
  },
  created() {
    this.getPackagingMaterial()
  },
  methods: {
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.loading = true
      try {
        const res = await getStockPlanWaitPalletPage(this.listQuery);
        const {data} = res
        this.batchData = data.map(item => {
          return {
            ...item.stockPlanPackage,
            lineList: item.lineList
          };
        });
        this.singleBoxData = data.flatMap(item => item.lineList)
      } finally {
        this.loading = false
      }
    },

    async getPackagingMaterial() {
      const params = {
        packagingType: 'warehouse_manage',
        pageSize: 9999
      }
      const res = await getBimPackagingMaterialsPage(params)
      const {records} = res.data
      this.palletOptions = records.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        }
      })
    },

    selectedBatch(val) {
      if (this.singleBoxSelectionLock) return;
      this.batchSelectionLock = true;
      this.selectedBatchList = val;
      this.$nextTick(() => {
        this.$refs.singleBoxTable.$refs.JNPFTable.clearSelection();
        if (val.length > 0) {
          this.selectedSingleBoxList = val.flatMap(item => item.lineList);
          const singleBoxIdsToSelect = new Set(
            this.selectedSingleBoxList.map(item => item.id)
          );
          this.singleBoxData.forEach(row => {
            if (singleBoxIdsToSelect.has(row.id)) {
              this.$refs.singleBoxTable.$refs.JNPFTable.toggleRowSelection(row, true);
            }
          });
        } else {
          this.selectedSingleBoxList = [];
        }
        this.batchSelectionLock = false;
      });
    },

    selectedSingleBox(val) {
      if (this.batchSelectionLock) return;
      this.singleBoxSelectionLock = true;
      this.selectedSingleBoxList = val;
      this.$nextTick(() => {
        const selectedBatchIds = new Set();
        val.forEach(box => {
          const matchingBatch = this.batchData.find(batch =>
            batch.lineList.some(line => line.id === box.id)
          );
          if (matchingBatch) {
            selectedBatchIds.add(matchingBatch.id);
          }
        });
        this.batchData.forEach(batch => {
          const shouldBeSelected = selectedBatchIds.has(batch.id);
          const isSelected = this.selectedBatchList.some(
            selected => selected.id === batch.id
          );
          if (shouldBeSelected !== isSelected) {
            this.$refs.batchTable.$refs.JNPFTable.toggleRowSelection(batch, shouldBeSelected);
          }
        });
        this.singleBoxSelectionLock = false;
      });
    },

    validateSelectedRows() {
      if (this.selectedSingleBoxList.length === 0) {
        this.$message.warning('请至少选择一条数据（整批或单箱）');
        return false;
      }
      return true;
    },

    handleButtonClick(type) {
      switch (type) {
        case 'support':
          if (!this.validateSelectedRows()) return;
          this.addStockPlanPallet();
          break;
        default:
      }
    },

    processPackageData(data) {
      const groupedData = {};
      data.forEach(item => {
        const drawingNo = item.productsDrawingNo;
        if (!groupedData[drawingNo]) {
          groupedData[drawingNo] = [];
        }
        groupedData[drawingNo].push(item);
      });

      const templates = [];

      for (const drawingNo in groupedData) {
        const groupItems = groupedData[drawingNo];

        const totalNum = groupItems.reduce((sum, item) => {
          return sum + parseInt(item.num || 0);
        }, 0);

        const packagingMethod = groupItems[0].packagingMethod;
        templates.push(`${ totalNum }套${ packagingMethod }包装${ drawingNo }`);
      }

      return templates.length === 1 ? templates[0] : templates.join(', ');
    },

    async addStockPlanPallet() {
      try {
        if (!this.palletValue) return this.$message.warning('请选择托盘');
        const hasPallet = this.selectedSingleBoxList.some(item => item.status === 'pallet');
        if (hasPallet) {
          this.$message.warning('选中的箱列表中包含已装托的项，不可重复装托');
          return;
        }
        const stockPlanPalletLineList = this.selectedSingleBoxList.map(item => ({
          ...item,
          documentId: item.planPackageId,
          documentLineId: item.id,
        }));
        const params = {
          stockPlanPallet: {
            packagingMaterialId: this.palletValue,
            remark: this.processPackageData(this.selectedSingleBoxList),
          },
          stockPlanPalletLineList
        }
        const res = await addStockPlanPallet(params)
        this.$message.success('装托成功');
        this.initData();
      } catch (e) {
        this.$message.error('装托失败: ' + e.message);
      }
    },

    showBatchColumnSettings() {
      this.$refs.batchTable.showDrawer()
    },

    showSingleBoxColumnSettings() {
      this.$refs.singleBoxTable.showDrawer()
    },

    getAlign(align) {
      return align || 'left'
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" style="display: flex; flex-direction: column; height: 100%;">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="batchTable"/>
      <div class="table-container" style="flex: 1; display: flex; flex-direction: column;">
        <div class="table-section" style="flex: 1; display: flex; flex-direction: column;">
          <div class="JNPF-common-head" style="padding: 8px; position: relative;">
            <div class="JNPF-common-head-left">
              <el-row :gutter="10" type="flex" align="middle">
                <el-col :span="12">
                  <el-select v-model="palletValue" placeholder="托盘">
                    <el-option
                      v-for="item in palletOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <CustomButton
                    :btnList="btnList"
                    @click="handleButtonClick"
                  />
                </el-col>
              </el-row>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.batchTable.showSortDrawer()"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="showBatchColumnSettings()"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="initData()"/>
              </el-tooltip>
            </div>
            <span class="table-title" style="position: absolute; left: 50%; transform: translateX(-50%);">整批</span>
          </div>
          <div class="table-content" style="flex: 1;">
            <JNPF-table customKey="BatchTable"
              v-loading="loading"
              :data="batchData"
              :has-c="true"
              @selection-change="selectedBatch"
              :row-key="'id'"
              fixedNO
              :setColumnDisplayList="columnList"
              ref="batchTable"
              custom-column :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
              <template v-for="column in batchColumns">
                <el-table-column
                  v-if="typeof column.show === 'function' ? column.show() : true"
                  :key="column.prop"
                  :prop="column.prop"
                  :label="column.label"
                  :min-width="column.minWidth"
                  :sortable="column.sortable"
                  :fixed="column.fixed"
                  :align="getAlign(column.align)"
                >
                  <template v-if="column.slot" v-slot="scope">
                    <template v-if="column.dictType">
                      <span>
                        <el-tag
                          :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">{{
                            global.getDictLabelGlobal(column.dictType, scope.row[column.prop])
                          }}</el-tag>
                      </span>
                    </template>
                  </template>
                </el-table-column>
              </template>
            </JNPF-table>
          </div>
        </div>
        <div class="table-section" style="flex: 1; display: flex; flex-direction: column; margin-top: 20px;">
          <div class="JNPF-common-head" style="padding: 8px; position: relative;">
            <div class="JNPF-common-head-left">
              <el-row :gutter="10" type="flex" align="middle">
                <el-col :span="12">
                  <div class="selected-count">
                    <span class="count-label">已选箱数：</span>
                    <span class="count-value">{{ selectedBoxCount }}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="box-quantity">
                    <span class="quantity-label">已选数量：</span>
                    <span class="quantity-value">{{ boxQuantity }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.batchTable.showSortDrawer()"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="showSingleBoxColumnSettings()"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="initData()"/>
              </el-tooltip>
            </div>
            <span class="table-title" style="position: absolute; left: 50%; transform: translateX(-50%);">单箱</span>
          </div>
          <div class="table-content" style="flex: 1;">
            <JNPF-table customKey="SingleBoxTable"
              v-loading="loading"
              :data="singleBoxData"
              :has-c="true"
              @selection-change="selectedSingleBox"
              :row-key="'id'"
              fixedNO
              :setColumnDisplayList="columnList"
              ref="singleBoxTable"
              custom-column :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
              <template v-for="column in singleBoxColumns">
                <el-table-column
                  v-if="typeof column.show === 'function' ? column.show() : true"
                  :key="column.prop"
                  :prop="column.prop"
                  :label="column.label"
                  :min-width="column.minWidth"
                  :sortable="column.sortable"
                  :fixed="column.fixed"
                  :align="getAlign(column.align)"
                >
                  <template v-if="column.slot" v-slot="scope">
                    <template v-if="column.dictType">
                      <span>
                        <el-tag
                          :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">{{
                            global.getDictLabelGlobal(column.dictType, scope.row[column.prop])
                          }}</el-tag>
                      </span>
                    </template>
                  </template>
                </el-table-column>
              </template>
            </JNPF-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  height: calc(100% - 50px);
}

.table-section {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
  height: 50%; /* 每个表格区域占一半高度 */
}

.JNPF-common-head {
  position: relative;
}

.table-title {
  font-size: 16px;
  font-weight: bold;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.table-content {
  overflow: hidden;
}

.selected-count, .box-quantity {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
}

.count-label, .quantity-label {
  display: inline-block;
  min-width: 60px;
  text-align: right;
  margin-right: 5px;
}

.count-value, .quantity-value {
  font-weight: bold;
  min-width: 40px;
  text-align: left;
}

.count-value {
  color: #409EFF;
}

.quantity-value {
  color: #67C23A;
}
</style>
