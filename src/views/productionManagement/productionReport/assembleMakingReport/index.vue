<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.drawingNo" placeholder="型号" clearable @keyup.enter.native="search()" />
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
          <el-table-column prop="waitClean" label="待清洗" width="120" align="center">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewDetailFun(scope.row.drawingNo, 'availableFlag', scope.row.warehouseId, projectId)">
                {{ scope.row.waitClean }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitFitting" label="待合套" width="130" align="center">
            <template slot-scope='scope'>
              <el-link type="primary" @click.native="viewTask(scope.row.productsId, 'inventoryFlag', '清洗')">
                {{ scope.row.waitFitting }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitGrease" label="待注脂压盖" width="120" align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewTask(scope.row.productsId, 'inventoryFlag', '合套')">
                {{ scope.row.waitGrease }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitVibrate" label="待测振" width="130" align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewTask(scope.row.productsId, 'inventoryFlag', '注脂压盖')">
                {{ scope.row.waitVibrate }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitVisualInspect" label="待外观检验" width="120" align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewTask(scope.row.productsId, 'inventoryFlag', '测振')">
                {{ scope.row.waitVisualInspect }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitPacking" label="待包装" width=" 120" align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewTask(scope.row.productsId, 'inventoryFlag', '外观检验')">
                {{ scope.row.waitPacking }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="waitStock" label="待入库" width="120" align="center">
          </el-table-column>
          <el-table-column prop="stockNum" label="库存数量" width="120" align="center">
            <template slot-scope="scope">
              <el-link type="primary"
                @click.native="viewFun(scope.row.productsId, 'availableFlag', scope.row.warehouseId, projectId)">
                {{ scope.row.stockNum }}
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
import { getAssembleList, assembleReport } from '@/api/productionManagement/report'
import Form from '../../../warehouseManagement/finishedProductWarehouseManagement/inventory/Form.vue'
import TaskForm from '../sleeveMakingReport/taskForm.vue'
import MaterForm from './materForm.vue'
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
    viewDetailFun(drawingNo) {
      this.materFormVisible = true
      this.$nextTick(() => {
        this.$refs.materFormRef.init(drawingNo,'inventoryFlag')
      })
    },
    // 查看产品明细
    viewTask(productsId, type, processName) {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.TaskForm.init(productsId, type, processName)
      })
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getAssembleList(this.listQuery)
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
      sums[2] = this.allTotal.waitClean
      sums[3] = this.allTotal.waitFitting
      sums[4] = this.allTotal.waitGrease
      sums[5] = this.allTotal.waitVibrate
      sums[6] = this.allTotal.waitVisualInspect
      sums[7] = this.allTotal.waitPacking
      sums[8] = this.allTotal.waitStock
      sums[9] = this.allTotal.stockNum

      return sums
    },
    exportForm() {
      if (!this.tableData.length) return this.$message.error('没有可导出的数据')
      assembleReport(this.listQuery).then((res) => {
        this.jnpf.downloadFile(res.data.url)
      })
    }
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
