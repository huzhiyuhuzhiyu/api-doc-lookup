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
          <el-table-column prop="drawingNo" label="产品型号及特殊要求" width="190" fixed="left" sortable="custom"></el-table-column>
          <el-table-column label="待热处理" align="center">
            <el-table-column prop="waitHeat" label="毛坯的仓库库存" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewFun(scope.row.blankProductsId, 'availableFlag', scope.row.warehouseId, projectId)">
                  {{ scope.row.waitHeat }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="热处理在制" align="center">
            <el-table-column prop="transitHeat" label="领料过的数量和批次" width="170" align="center">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '热处理-领料')">
                  {{ scope.row.transitHeat }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="待双端面磨削" align="center">
            <el-table-column prop="waitGrinding" label="双端面磨削-领料的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '双端面磨削-领料的可报工数量')">
                  {{ scope.row.waitGrinding }}
                </el-link>
              </template>
            </el-table-column>
      
          </el-table-column>
          <el-table-column label="待无心磨" align="center">
            <el-table-column prop="waitCenterLess" label="无心磨-领料的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <el-link v-if="scope.row.classType === 'inner_ring'" type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '无心磨-领料的可报工数量')">
                  {{ scope.row.waitCenterLess }}
                </el-link>
              </template>
            </el-table-column>
             
          </el-table-column>
          <el-table-column label="待外圆超" align="center">
            <el-table-column prop="waitOuterSuperfine" label="外圆超-领料的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <el-link v-if="scope.row.classType === 'inner_ring'" type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '外圆超-领料的可报工数量')">
                  {{ scope.row.waitOuterSuperfine }}
                </el-link>
                <template v-else>
                  {{ scope.row.waitOuterSuperfine }}
                </template>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="外圆超在制" align="center">
            <el-table-column prop="transitOuterSuperfine" label="外圆超-入库的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '外圆超-入库的可报工数量')">
                  {{ scope.row.transitOuterSuperfine }}
                </el-link>
              </template>
            </el-table-column>
        
          </el-table-column>
          <el-table-column label="待201" align="center">
            <el-table-column prop="waitRubHole" label="201-领料的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '201-领料的可报工数量')">
                  {{ scope.row.waitRubHole }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="201在制" align="center">
            <el-table-column prop="transitRubHole" label="201-入库的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.transitRubHole }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '201-入库的可报工数量')">
                  {{ scope.row.transitRubHole }}
                </el-link>
              </template>
        </el-table-column>
          </el-table-column>
          <el-table-column label="待131" align="center">
            <el-table-column prop="waitInnerRubChannel" label="131-领料的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.waitInnerRubChannel }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '131-领料的可报工数量')">
                  {{ scope.row.waitInnerRubChannel }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="131在制" align="center">
            <el-table-column prop="transitInnerRubChannel" label="131-入库的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.transitInnerRubChannel }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '131-入库的可报工数量')">
                  {{ scope.row.transitInnerRubChannel }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="待超精" align="center">
            <el-table-column prop="waitSuperfine" label="超精-领料的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.waitSuperfine }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '超精-领料的可报工数量')">
                  {{ scope.row.waitSuperfine }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="待143" align="center">
            <el-table-column prop="waitOuterRubChannel" label="143-领料的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.waitOuterRubChannel }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '143-领料的可报工数量')">
                  {{ scope.row.waitOuterRubChannel }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>


          <el-table-column label="143在制" align="center">
            <el-table-column prop="transitOuterRubChannel" label="143-入库的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.transitOuterRubChannel }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '143-入库的可报工数量')">
                  {{ scope.row.transitOuterRubChannel }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
       

          <el-table-column label="待精研外沟" align="center">
            <el-table-column prop="waitFineGrind" label="精研外沟-领料的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.waitFineGrind }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '精研外沟-领料的可报工数量')">
                  {{ scope.row.waitFineGrind }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>


          <el-table-column label="精研外沟在制" align="center">
            <el-table-column prop="transitFineGrind" label="精研外沟-入库的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.transitFineGrind }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '精研外沟-入库的可报工数量')">
                  {{ scope.row.transitFineGrind }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>


          <el-table-column label="待外圈修磨" align="center">
            <el-table-column prop="waitRollingResearch" label="外圈修磨-领料的可报工数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.waitRollingResearch }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '外圈修磨-领料的可报工数量')">
                  {{ scope.row.waitRollingResearch }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column>
    

          <el-table-column label="待入库" align="center">
            <el-table-column prop="waitStock" label="仓库的待入库数量" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.waitStock }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '仓库的待入库数量')">
                  {{ scope.row.waitStock }}
                </el-link>
              </template>
            </el-table-column>
          </el-table-column> 
          <el-table-column prop="existingStock" label="套圈现有库存" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.existingStock }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '套圈现有库存')">
                  {{ scope.row.existingStock }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="totalStock" label="预计总库存（现有库存+在制库存+毛坯库存）" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.totalStock }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '预计总库存（现有库存+在制库存+毛坯库存')">
                  {{ scope.row.totalStock }}
                </el-link>
              </template>
            </el-table-column><el-table-column prop="safetyStock" label="安全库存" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.safetyStock }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '安全库存')">
                  {{ scope.row.totalStock }}
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
import { inventoryWarehouseReportMS, inventoryWarehouseExportMS } from '@/api/warehouseManagement/inventory'
import Form from '../../finishedProductWarehouseManagement/inventory/Form.vue'
import TaskForm from './taskForm.vue'
import MaterForm from './materForm.vue'
import ProductForm from "./productForm.vue";
export default {
  name: 'productionProgressReportMS',
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
      if (!id) id = 0
      this.formVisible = true
      this.$nextTick(() => {
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
        this.$refs.TaskForm.init(drawingNo, type, processName)
      })
    },
    viewProductFun(id) {
      if (!id) id = 0
      this.productFormVisible = true
      this.$nextTick(() => {
        this.$refs.productFormRef.init(id)
      })
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      inventoryWarehouseReportMS(this.listQuery)
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
      sums[4] = this.allTotal.waitGrinding
      sums[6] = this.allTotal.waitCenterLess
      sums[5] = this.allTotal.waitOuterSuperfine
      sums[7] = this.allTotal.transitOuterSuperfine
      sums[8] = this.allTotal.waitRubHole
      sums[9] = this.allTotal.transitRubHole
      sums[10] = this.allTotal.waitInnerRubChannel
      sums[11] = this.allTotal.transitInnerRubChannel
      sums[12] = this.allTotal.waitSuperfine
      sums[13] = this.allTotal.waitOuterRubChannel
      sums[14] = this.allTotal.transitOuterRubChannel
      sums[15] = this.allTotal.waitFineGrind
      sums[16] = this.allTotal.transitFineGrind
      sums[15] = this.allTotal.waitStock
      sums[16] = this.allTotal.existingStock
      sums[17] = this.allTotal.totalStock

      return sums
    },
    exportForm() {
      if (!this.tableData.length) return this.$message.error('没有可导出的数据')
      inventoryWarehouseExportMS(this.listQuery).then((res) => {
        this.jnpf.downloadFile(res.data.url)
      })
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
