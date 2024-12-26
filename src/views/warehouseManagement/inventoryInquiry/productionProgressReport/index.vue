<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.drawingNo" placeholder="物料号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm">导出</el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" highlight-current-row fixedNO ref="tableForm" :data="tableData"
          @sort-change="sortChange" show-summary :summary-method="getSummaries">
          <el-table-column prop="drawingNo" label="物料号" width="150" fixed="left" sortable="custom"></el-table-column>
          <el-table-column label="热处理" align="center">
            <el-table-column prop="waitHeat" label="待热处理" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                @click.native="viewFun(scope.row.blankProductsId, 'availableFlag', scope.row.warehouseId, projectId)">
                  {{ scope.row.waitHeat }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="transitHeat" label="热处理在制" width="130" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                @click.native="viewFun(scope.row.blankProductsId, 'availableFlag', scope.row.warehouseId, projectId)">
                  {{ scope.row.transitHeat }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="平面磨" align="center">
            <el-table-column prop="waitSurface" label="待磨平面" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="transitSurface" label="平面磨在制" width="130" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="无心磨" align="center">
            <el-table-column prop="waitCenterLess" label="待无心磨" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="transitCenterLess" label="无心磨在制" width="130" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="磨孔" align="center">
            <el-table-column prop="waitRubHole" label="待磨孔" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="transitRubHole" label="磨孔在制" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="测孔" align="center">
            <el-table-column prop="waitTestHole" label="待测孔" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="transitTestHole" label="测孔在制" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="磨沟" align="center">
            <el-table-column prop="waitRubChannel" label="待磨沟" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="transitRubChannel" label="磨沟在制" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="超精" align="center">
            <el-table-column prop="waitSuperfine" label="待超精" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="transitSuperfine" label="超精在制" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="外圈滚研" align="center">
            <el-table-column prop="waitRollingResearch" label="待滚研" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="transitRollingResearch" label="滚研在制" width="130" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', scope.row.warehouseId)">
                  {{ scope.row.waitSurface }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="total" label="合计" align="center"></el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <TaskForm v-if="taskFormVisible" ref="TaskForm" @refreshDataList="initData" />
  </div>
</template>
<script>
import { inventoryWarehouseReport, inventoryWarehouseExport } from '@/api/warehouseManagement/inventory'
import Form from '../../finishedProductWarehouseManagement/inventory/Form.vue'
import TaskForm from './taskForm.vue'
export default {
  name: 'productionProgressReport',
  components: { Form, TaskForm },
  data() {
    return {
      formVisible: false,
      taskFormVisible: false,
      tableData: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
      },
      total: 0,
      columnList: [],
      allTotal: {}
    }
  },
  async created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    // 查看产品明细
    viewFun(id, type, warehouseId, projectId) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type, warehouseId, projectId)
      })
    },
    // 查看产品明细
    viewTask(drawingNo, type, warehouseId) {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.TaskForm.init(drawingNo, type, warehouseId)
      })
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      inventoryWarehouseReport(this.listQuery)
        .then((res) => {
          this.tableData = res.data.page.records
          this.total = res.data.page.total
          this.allTotal = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },
    sortChange({ prop, order }) {
      let newProp
      if (['waitHeat', 'transitHeat'].includes(prop)) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    getSummaries(param) {
      const sums = []
      sums[0] = ''
      sums[1] = '合计'
      sums[2] = this.allTotal.waitHeat
      sums[3] = this.allTotal.transitHeat
      sums[4] = this.allTotal.waitSurface
      sums[5] = this.allTotal.transitSurface
      sums[6] = this.allTotal.waitCenterLess
      sums[7] = this.allTotal.transitCenterLess
      sums[8] = this.allTotal.waitRubHole
      sums[9] = this.allTotal.transitRubHole
      sums[10] = this.allTotal.waitTestHole
      sums[11] = this.allTotal.transitTestHole
      sums[12] = this.allTotal.waitRubChannel
      sums[13] = this.allTotal.transitRubChannel
      sums[14] = this.allTotal.waitSuperfine
      sums[15] = this.allTotal.transitSuperfine
      sums[16] = this.allTotal.waitRollingResearch
      sums[17] = this.allTotal.transitRollingResearch

      return sums
    },
    exportForm() {
      if (!this.tableData.length) return this.$message.error('没有可导出的数据')
      inventoryWarehouseExport(this.listQuery).then((res) => {
        this.jnpf.downloadFile(res.data.url)
      })
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
