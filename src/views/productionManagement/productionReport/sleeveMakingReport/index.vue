<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.drawingNo" placeholder="毛坯规格型号" clearable @keyup.enter.native="search()" />
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
          <el-table-column prop="drawingNo" label="毛坯规格型号" width="150" sortable="custom" fixed="right"></el-table-column>
          <el-table-column prop="waitHeat" label="待热处理" width="120" align="center">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.productsId, 'availableFlag', scope.row.warehouseId, projectId)">
                {{ scope.row.waitHeat }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="transitHeat" label="热处理在制" width="130" align="center">
            <template slot-scope='scope'>
              <el-link type="primary" @click.native="viewDetailFun(scope.row.productsId)">{{
                scope.row.transitHeat
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitSurface" label="待平面磨" width="120" align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '热处理')">
                {{ scope.row.waitSurface }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="transitSurface" label="平面磨在制" width="130" align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '平面磨-领料')">
                {{ scope.row.transitSurface }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitCenterLess" label="待无心磨" width="120" align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '平面磨')">
                {{ scope.row.waitCenterLess }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitOuterSuperfine" label="待外圆超精" width=" 120" align="center">
            <template slot-scope="scope">
              <el-link v-if="scope.row.classType === 'inner_ring_blank'" type="primary"
                @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '内圈无心磨加工')">
                {{ scope.row.waitOuterSuperfine }}
              </el-link>
              <el-link v-else type="primary" @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '外圈无心磨加工')">
                {{ scope.row.waitOuterSuperfine }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitRubHole" label="待内圈磨孔/201" width="140" align="center">
            <template slot-scope="scope">
              <el-link v-if="scope.row.classType === 'inner_ring_blank'" type="primary"
                @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '内圈外圆超精加工')">
                {{ scope.row.waitRubHole }}
              </el-link>
              <template v-else>
                {{ scope.row.waitRubHole }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="waitInnerRubChannel" label="待内圈磨沟/131" width="140" align="center">
            <template slot-scope="scope">
              <el-link v-if="scope.row.classType === 'inner_ring_blank'" type="primary"
                @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '内圈磨孔')">
                {{ scope.row.waitInnerRubChannel }}
              </el-link>
              <template v-else>
                {{ scope.row.waitInnerRubChannel }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="waitOuterRubChannel" label="待外圈磨沟/143" width="140" align="center">
            <template slot-scope="scope">
              <el-link v-if="scope.row.classType === 'outer_ring_blank'" type="primary"
                @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '外圈外圆超精加工')">
                {{ scope.row.waitOuterRubChannel }}
              </el-link>
              <template v-else>
                {{ scope.row.waitOuterRubChannel }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="waitSuperfine" label="待超精" width="120" align="center">
            <template slot-scope="scope">
              <el-link v-if="scope.row.classType === 'inner_ring_blank'" type="primary"
                @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '内圈磨沟')">
                {{ scope.row.waitSuperfine }}
              </el-link>
              <el-link v-else type="primary" @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '外圈磨沟')">
                {{ scope.row.waitSuperfine }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitRollingResearch" label="待外圈修磨" width="120" align="center">
            <template slot-scope="scope">
              <el-link v-if="scope.row.classType === 'outer_ring_blank'" type="primary"
                @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '外圈超精')">
                {{ scope.row.waitRollingResearch }}
              </el-link>
              <template v-else>
                {{ scope.row.waitRollingResearch }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="waitStock" label="待入库" width="120" align="center">
            <template slot-scope="scope">
              <el-link v-if="scope.row.classType === 'inner_ring_blank'" type="primary"
                @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '内圈超精')">
                {{ scope.row.waitStock }}
              </el-link>
              <el-link v-else type="primary" @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '外圈修磨')">
                {{ scope.row.waitStock }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="合计" align="center"></el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" :pageSizes="[50, 100, 500, 1000]" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" />
    <TaskForm v-if="taskFormVisible" ref="TaskForm" @refreshDataList="initData" />
    <MaterForm v-if="materFormVisible" ref="materFormRef"></MaterForm>
    <ProductForm v-if="productFormVisible" ref="productFormRef"></ProductForm>
  </div>
</template>
<script>
import { getRingList, ringReport } from '@/api/productionManagement/report'
import Form from '../../../warehouseManagement/finishedProductWarehouseManagement/inventory/Form.vue'
import TaskForm from '../../../warehouseManagement/inventoryInquiry/productionProgressReport/taskForm.vue'
import MaterForm from '../../../warehouseManagement/inventoryInquiry/productionProgressReport/materForm.vue'
import ProductForm from "../../../warehouseManagement/inventoryInquiry/productionProgressReport/productForm.vue";
export default {
  name: 'sleeveMakingReport',
  components: { Form, TaskForm, MaterForm, ProductForm },
  data() {
    return {
      formVisible: false,
      taskFormVisible: false,
      materFormVisible: false,
      productFormVisible: false,
      tableData: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        pageNum: 1,
        pageSize: 50,
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ]
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
      if (!id) id = 0
      this.formVisible = true
      this.$nextTick(() => {
        console.log(this.$refs, 'ff')
        this.$refs.Form.init(id, type, warehouseId, projectId)
      })
    },
    // 
    viewDetailFun(id) {
      if (!id) id = 0
      this.materFormVisible = true
      this.$nextTick(() => {
        this.$refs.materFormRef.init(id)
      })
    },
    // 查看产品明细
    viewTask(drawingNo, type, processName) {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.TaskForm.init('', type, processName)
      })
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getRingList(this.listQuery)
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
      sums[7] = this.allTotal.waitOuterSuperfine
      sums[8] = this.allTotal.waitRubHole
      sums[9] = this.allTotal.waitInnerRubChannel
      sums[10] = this.allTotal.waitOuterRubChannel
      sums[11] = this.allTotal.waitSuperfine
      sums[12] = this.allTotal.waitRollingResearch
      sums[13] = this.allTotal.waitStock

      return sums
    },
    exportForm() {
      if (!this.tableData.length) return this.$message.error('没有可导出的数据')
      ringReport(this.listQuery).then((res) => {
        this.jnpf.downloadFile(res.data.url)
      })
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
