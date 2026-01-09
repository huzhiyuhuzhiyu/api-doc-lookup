<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable" />
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head" style="padding: 10px;">
            <div>
              <el-button :disabled="!selectedData.length" size="mini" icon="el-icon-plus" type="primary"
                @click="handleFun('add')">批量报关
              </el-button>
              <el-button :disabled="!selectedData.length" size="mini" icon="el-icon-plus" type="success"
                @click="handleFun('confirm')">批量确认
              </el-button>
              <el-button :disabled="!selectedData.length" size="mini" icon="el-icon-minus" type="warning"
                @click="handleFun('cancel')">批量取消确认
              </el-button>
              <TableDataExportButton tableRef="dataTable" :listQuery="listQuery" exportType="1094"
                exportName="待出运记录" />
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
            custom-column :setColumnDisplayList="columnList" hasC
            :checkSelectable="(row) => !!row.hsProductDrawingNo || row.deliveryStatus === 'declared'"
            @selection-change="(val) => { selectedData = val }" customKey="JNPFTableKey_742699"
            :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
            <!--            <el-table-column prop="orderNo" label="发货单号" min-width="200">-->
            <!--              <template slot-scope="scope">-->
            <!--                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'view')">-->
            <!--                  {{ scope.row.orderNo }}-->
            <!--                </el-link>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <!-- <el-table-column prop="aaa" label="待处理类型" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.aaa == 'qualified'">报废</div>
                <div v-else-if="scope.row.aaa == 'unqualified'">返工</div>
                <div v-else>{{ scope.row.aaa }}</div>
              </template>
            </el-table-column> -->

            <!--            <el-table-column prop="productName" label="产品名称" width="120"></el-table-column>-->
            <!--            <el-table-column prop="productDrawingNo" label="产品图号" min-width="180" />-->
            <!--            <el-table-column prop="productCode" label="产品编码" min-width="180" />-->
            <!--            <el-table-column prop="repairQuantity" label="数量" width="120" />-->
            <!--            <el-table-column prop="mainUnit" label="单位" width="60" />-->
            <!--            <el-table-column prop="createTime" label="创建时间" width="180" />-->
            <!--            <el-table-column prop="createByName" label="创建人" width="100" />-->

            <el-table-column prop="orderNo" label="发货单号" min-width="180" />
            <el-table-column prop="productCode" label="商品编码" min-width="140" />
            <el-table-column prop="foreignInvoiceNo" label="外销发票号" min-width="180" />
            <el-table-column prop="salePurchaseOrderNo" label="销售订单号" min-width="180" />
            <el-table-column prop="contractNo" label="客户合同号" min-width="180" />
            <el-table-column prop="partnerCode" label="客户编码" min-width="180" />
            <el-table-column prop="partnerName" label="客户名称" min-width="250" />
            <el-table-column prop="salesName" label="业务员" min-width="120" />
            <el-table-column prop="drawingNo" label="品名规格" min-width="180" />
            <el-table-column prop="hsProductDrawingNo" label="报关品名" min-width="120" />
            <el-table-column prop="customerProductNo" label="客户产品型号" min-width="120" />
            <el-table-column prop="mainUnit" label="单位" min-width="120" />
            <el-table-column prop="num" label="发货数量" min-width="120" />
            <!--            <el-table-column prop="costPrice" label="销售单价" min-width="120" />-->
            <!--            <el-table-column prop="totalAmount" label="销售总价" min-width="120" />-->
            <el-table-column prop="costPrice" label="工厂单价" min-width="120" />
            <el-table-column prop="totalAmount" label="工厂总价" min-width="120" />
            <el-table-column prop="createTime" label="发货时间" width="180" />
            <el-table-column prop="deliveryStatus" label="状态" width="120" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tag type="warning" v-if="scope.row.deliveryStatus === 'waiting'">待确认</el-tag>
                <el-tag type="success" v-else-if="scope.row.deliveryStatus === 'confirmed'">已确认</el-tag>
                <el-tag type="success" v-else-if="scope.row.deliveryStatus === 'declared'">已报关</el-tag>
                <el-tag v-else>{{ scope.row.deliveryStatus }}</el-tag>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()" />
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <ConfirmForm v-if="confirmFormVisible" ref="ConfirmForm" @close="closeForm" />
  </div>
</template>

<script>
import Form from './Form.vue'
import ConfirmForm from './ConfirmForm.vue'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import getProjectList from '@/mixins/generator/getProjectList'
import { batchRevokeDeliveryLine, getDeliveryLineList } from "@/api/masterDataManagement/productManage";
import { removeCompany } from "@/api/customerAndFactory";

export default {
  components: { Form, ConfirmForm },
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
          condition: [
            {
              prop: 'deliveryStatus',
              symbol: 'in',
              value: ['waiting', 'confirmed'],
              fixed: true
            }
          ],
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
      tableDataFlag: false,
      superQueryJson: [
        {
          prop: 'deliveryStatus',
          type: 'select',
          options: [
            { value: 'waiting', label: '待确认' },
            { value: 'confirmed', label: '已确认' },
            { value: 'declared', label: '已报关' },
          ]
        }
      ],
      columnList: [],
      listLoading: false,
      formVisible: false,
      confirmFormVisible: false,
      tableData: [],
      listQuery: {},
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

      getDeliveryLineList(this.listQuery)
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


    // addOrUpdateHandle(row, btnType) {
    //   this.formVisible = true
    //   if (btnType == 'view') {
    //     this.$nextTick(() => {
    //       this.$refs.Form.init(row.id, btnType, false, this.pageData.type, this.pageData.businessCode)
    //     })
    //   } else {
    //     this.$nextTick(() => {
    //       this.$refs.Form.init(row.inspectionId, btnType, false, this.pageData.type, this.pageData.businessCode)
    //     })
    //   }
    // },

    closeForm(isRefresh) {
      this.formVisible = false
      this.confirmFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleFun(type) {
      if (type === 'add') {
        if (!this.selectedData.every(item => item.deliveryStatus === 'confirmed')) {
          return this.$message.error('只有已确认的记录才能报关！')
        }
        if (!this.selectedData.every(item => item.cooperativePartnerId === this.selectedData[0].cooperativePartnerId)) {
          return this.$message.error('只有相同客户才能一起报关！')
        }
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(this.selectedData, 'add')
        })
      } else if (type === 'confirm') {
        if (!this.selectedData.every(item => item.deliveryStatus === 'waiting')) {
          return this.$message.error('只有待确认的记录才能确认！')
        }
        this.confirmFormVisible = true
        this.$nextTick(() => {
          this.$refs.ConfirmForm.init(this.selectedData)
        })

      } else if (type === 'cancel') {
        if (!this.selectedData.every(item => item.deliveryStatus === 'confirmed')) {
          return this.$message.error('只能选择已确认且未报关的记录！')
        }
        this.$confirm('确定要恢复成待确认状态吗？', '提示', {
          type: 'warning'
        }).then(async (res) => {
          await batchRevokeDeliveryLine(this.selectedData.map(item => item.id))
          this.$message.success('操作成功')
          this.initData()
        }).catch(() => {
        })
      }
    },
  }
}
</script>
<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->
