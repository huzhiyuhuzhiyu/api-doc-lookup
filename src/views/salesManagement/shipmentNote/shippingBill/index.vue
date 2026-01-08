<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable" />
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head" style="padding: 10px;">
            <div>
              <el-button :disabled="!selectedData.length" size="mini" icon="el-icon-plus" type="primary"
                @click="handleFun('rework')">批量报关</el-button>
              <TableDataExportButton tableRef="dataTable" :listQuery="listQuery" exportType="1094"
                exportName="待出运记录"/>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.dataTable.showSortDrawer()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>

          <JNPF-table v-if="tableDataFlag" ref="dataTable" :data="tableData" fixedNO
            custom-column :setColumnDisplayList="columnList" hasC @selection-change="(val) => { selectedData = val }" customKey="JNPFTableKey_742699" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
            <el-table-column prop="orderNo" label="不良处理记录编号" min-width="200">
<!--              <template slot-scope="scope">-->
<!--                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'view')">-->
<!--                  {{ scope.row.orderNo }}-->
<!--                </el-link>-->
<!--              </template>-->
            </el-table-column>
            <el-table-column prop="inspectionOrderNo" label="检验单号" min-width="200" />
            <!-- <el-table-column prop="aaa" label="待处理类型" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.aaa == 'qualified'">报废</div>
                <div v-else-if="scope.row.aaa == 'unqualified'">返工</div>
                <div v-else>{{ scope.row.aaa }}</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="productName" label="产品名称" width="120"
              v-if="isProductNameSwitch === '1'"></el-table-column>
            <el-table-column prop="productDrawingNo" label="产品图号" min-width="180" />
            <el-table-column prop="productCode" label="产品编码" min-width="180" />
            <el-table-column prop="repairQuantity" label="数量" width="120" />
            <el-table-column prop="mainUnit" label="单位" width="60" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="createByName" label="创建人" width="100" />
            <!-- <el-table-column prop="status" label="是否处理" width="200" align="center" sortable="custom">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status">是</el-tag>
                <el-tag type="danger" v-else>否</el-tag>
              </template>
            </el-table-column> -->
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()" />
        </div>
      </div>
    </div>

<!--    <Form v-if="formVisible" ref="Form" @close="closeForm" :inspectionMethodList="[]" />-->
  </div>
</template>

<script>
import {
  getQcUnqualifiedList,
  deleteQcUnqualifiedData,
  getQcUnqualifiedLinesList
} from '@/api/inspectionManagement/index' // 检验单
// import Form from './Form.vue'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  // components: { Form },
  mixins: [getProjectList],

  props: {
    pageData: {
      type: Object,
      required: true,
      default: {
        type: '', // 通知单类型
        showRouting: false, // 是否显示工艺路线
        showProcess: false // 是否显示工序
      }
    },
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      superQueryVisible: false,
      superQueryJson: [],
      columnList: [],
      visible: false,
      activeName: 'dataTable',
      listLoading: false,
      formVisible: false,
      tableData: [],
      listQuery: {
        notificationType: this.pageData.type,
        businessCode: this.pageData.businessCode,
        showRepair: true,
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},

      linesTotal: 0,
      selectedData: [],
    }
  },
  async created() {
    this.tableDataFlag = true
  },

  methods: {
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();

      this.listLoading = true
      this.superForm = this.listQuery
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      getQcUnqualifiedList(this.listQuery)
      .then((res) => {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
      .catch(() => {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
        this.listLoading = false
      })
    },


    addOrUpdateHandle(row, btnType) {
      this.formVisible = true
      if (btnType == 'view') {
        this.$nextTick(() => {
          this.$refs.Form.init(row.id, btnType, false, this.pageData.type, this.pageData.businessCode)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.Form.init(row.inspectionId, btnType, false, this.pageData.type, this.pageData.businessCode)
        })
      }
    },

    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
      .then(() => {
        withdrawn(_data).then((res) => {
          this.$message({
            type: 'success',
            message: '撤回成功',
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      })
      .catch(() => { })
    },
    handleFun(type) {
      // 可以选中多行相同产品图号相同工序相同待处理类型的行数据发起【返工】
      if (!this.selectedData.every(item => true)) {
        return this.$message.error('请选择相同产品图号、工序和待处理类型的行！')
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.selectedData, 'add')
      })
    },
  }
}
</script>
<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->
