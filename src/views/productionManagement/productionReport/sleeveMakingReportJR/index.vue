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
          <el-table-column prop="drawingNo" label="型号" width="180" sortable="custom" fixed="left"></el-table-column>
          <el-table-column prop="standardValue" label="规值" width="130" sortable="custom" ></el-table-column>
          <el-table-column prop="accuracyLevel" label="等级" width="130" sortable="custom" ></el-table-column>
          <el-table-column prop="coldHeading" label="冷镦" width="130" sortable="custom" >
            <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.coldHeading }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '冷镦')">
                  {{ scope.row.coldHeading }}
                </el-link>
              </template>
          </el-table-column>
            <el-table-column prop="lightBallOne" label="光球一" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.lightBallOne }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '光球一')">
                  {{ scope.row.lightBallOne }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="lightBallTwo" label="光球二" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.lightBallTwo }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '光球二')">
                  {{ scope.row.lightBallTwo }}
                </el-link>
              </template>
          </el-table-column>
 
            <el-table-column prop="quench" label="淬火" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.quench }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '淬火')">
                  {{ scope.row.quench }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="temper" label="回火" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.temper }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '回火')">
                  {{ scope.row.temper }}
                </el-link>
              </template>
          </el-table-column>
            <el-table-column prop="hardGrindOne" label="硬磨一" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.hardGrindOne }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '硬磨一')">
                  {{ scope.row.hardGrindOne }}
                </el-link>
              </template>
          </el-table-column>
            <el-table-column prop="intensify" label="强化" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.intensify }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '强化')">
                  {{ scope.row.intensify }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="temperTwo" label="二次回火" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.temperTwo }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '二次回火')">
                  {{ scope.row.temperTwo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="hardGrindTwo" label="硬磨二" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.hardGrindTwo }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '硬磨二')">
                  {{ scope.row.hardGrindTwo }}
                </el-link>
              </template>
          </el-table-column>
            <el-table-column prop="initialGrindOne" label="初研一" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.initialGrindOne }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '初研一')">
                  {{ scope.row.initialGrindOne }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="initialGrindTwo" label="初研二" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.initialGrindTwo }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '初研二的可报工数量')">
                  {{ scope.row.initialGrindTwo }}
                </el-link>
              </template>
          </el-table-column>
            <el-table-column prop="fineGrindOne" label="精研一" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.fineGrindOne }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '精研一的可报工数量')">
                  {{ scope.row.fineGrindOne }}
                </el-link>
              </template>
          </el-table-column>
            <el-table-column prop="fineGrindTwo" label="精研二" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.fineGrindTwo }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '精研二的可报工数量')">
                  {{ scope.row.fineGrindTwo }}
                </el-link>
              </template>
          </el-table-column>
            <el-table-column prop="appearanceSelection" label="外观选别" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.appearanceSelection }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '初研二')">
                  {{ scope.row.appearanceSelection }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="clean" label="清洗" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.clean }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '清洗')">
                  {{ scope.row.clean }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="optoelectronicAppearance" label="光电外观" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.optoelectronicAppearance }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '光电外观')">
                  {{ scope.row.optoelectronicAppearance }}
                </el-link>
              </template>
          </el-table-column>
            <el-table-column prop="pack" label="成品包装" width="120" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.classType === 'inner_ring'">
                  {{ scope.row.pack }}
                </template>
                <el-link v-else type="primary"
                  @click.native="viewTask(scope.row.drawingNo, 'inventoryFlag', '成品包装')">
                  {{ scope.row.pack }}
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
import { inventoryWarehouseReportJR, inventoryWarehouseExportJR } from '@/api/warehouseManagement/inventory' 
import Form from '../../../warehouseManagement/finishedProductWarehouseManagement/inventory/Form.vue'
import TaskForm from './taskForm.vue'
import MaterForm from '../../../warehouseManagement/inventoryInquiry/productionProgressReport/materForm.vue'
import ProductForm from "../../../warehouseManagement/inventoryInquiry/productionProgressReport/productForm.vue";
export default {
  name: 'sleeveMakingReportJR',
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
    viewTask(mainProdId, type, processName) {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.TaskForm.init(mainProdId, type, processName)
      })
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      inventoryWarehouseReportJR(this.listQuery)
        .then((res) => {
          this.tableData = res.data.page.records
          this.total = res.data.page.total
          this.allTotal = res.data.total||{}
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
      sums[2] =''
      sums[3] = ''
      sums[4] = this.allTotal.coldHeading||0
      sums[5] = this.allTotal.lightBallOne||0
      sums[6] = this.allTotal.lightBallTwo||0
      sums[7] = this.allTotal.quench||0
      sums[8] = this.allTotal.temper||0
      sums[9] = this.allTotal.hardGrindOne||0
      sums[10] = this.allTotal.intensify||0
      sums[11] = this.allTotal.temperTwo||0
      sums[12] = this.allTotal.hardGrindTwo||0
      sums[13] = this.allTotal.initialGrindOne||0
      sums[14] = this.allTotal.initialGrindTwo||0
      sums[15] = this.allTotal.fineGrindOne||0
      sums[16] = this.allTotal.fineGrindTwo||0
      sums[17] = this.allTotal.appearanceSelection||0
      sums[18] = this.allTotal.clean||0
      sums[19] = this.allTotal.optoelectronicAppearance||0
      sums[20] = this.allTotal.pack||0

      return sums
    },
    exportForm() {
      if (!this.tableData.length) return this.$message.error('没有可导出的数据')
      inventoryWarehouseExportJR(this.listQuery).then((res) => {
        this.jnpf.downloadFile(res.data.url)
      })
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
