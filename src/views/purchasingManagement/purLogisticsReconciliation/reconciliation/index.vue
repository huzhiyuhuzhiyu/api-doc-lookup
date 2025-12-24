<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="tableForm" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <topOpts @add="addRecord()">
            <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成采购物流对账</el-button>
            <!--            <el-button size="mini" type="primary" @click="updateCheckStatusFun()">更新核对状态</el-button>-->
            <el-button :disabled="!tableDataList.length" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
              <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                @click="$refs.tableForm.showSortDrawer()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table @selection-change="handeleProductInfoData" hasC highlight-current-row
          :fixedNO="true" ref="tableForm" :data="tableDataList" custom-column
          :setColumnDisplayList="columnList" :checkSelectable="checkSelectable" customKey="JNPFTableKey_472519"
          :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="partnerName" label="供应商名称" min-width="180" />
          <el-table-column prop="partnerCode" label="供应商编码" min-width="180" />
          <el-table-column prop="logisticsMode" label="物流方式" min-width="180" />
          <el-table-column prop="weight" label="重量" min-width="180" />
          <el-table-column prop="pickMaterial" label="提货" min-width="180" />
          <el-table-column prop="deliveryMaterial" label="送货" min-width="180" />
          <el-table-column prop="freight" label="运费" min-width="180" />
          <el-table-column prop="totalAmount" label="金额" width="90">
            <template slot-scope="scope">
              <div style="color:red">
                -{{ scope.row.totalAmount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="日期" min-width="180" />
          <!--          <el-table-column prop="checkStatus" label="核对状态" min-width="140"-->
          <!--              :showOverflowTooltip="false" align="center">-->
          <!--              <template slot-scope="scope">-->
          <!--                <div v-if="scope.row.checkStatus === 'unchecked'"><el-tag type="warning">未核对</el-tag> </div>-->
          <!--                <div v-if="scope.row.checkStatus === 'checked'"><el-tag type="success">已核对</el-tag></div>-->
          <!--              </template>-->
          <!--            </el-table-column>-->
          <el-table-column prop="createTime" label="创建时间" min-width="180" />
          <!--          <el-table-column prop="createByName" label="创建人" width="100" sortable="custom" />-->
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <tableOpts :has-edit="false" @del="handleDel(scope.row.id)" />
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData()">
        </pagination>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!--    <orderDetailForm v-if="orderVisible" ref="orderRef" @close="closeFun"></orderDetailForm>-->
    <deliveryNoteDetailForm v-if="deliveryNoteVisible" ref="deliveryNoteRef" @close="closeFun"></deliveryNoteDetailForm>
    <purchaseTH v-if="purchaseTHVisible" ref="purchaseTHRef" @close="closeFun"></purchaseTH>
    <AddForm v-if="addVisible" ref="AddForm" @close="closeFun"></AddForm>

  </div>
</template>

<script>
import { deleteLogisticsReceivable, getLogisticsReceivableList } from '@/api/ReconciliaRePayments'
import { updateCheckStatusApi } from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import ExportForm from '@/components/no_mount/ExportBox/index'
import JNPFForm from './Form'
import { excelExport } from '@/api/basicData'
// import orderDetailForm from '../../purchaseOrders/purchaseOrder/Form.vue'
import deliveryNoteDetailForm from '@/views/receivingManagement/procurementReceiving/receivingAdvice/Form.vue'
import purchaseTH from '@/views/purchasingManagement/returnManagement/purchaseReturnNote/Form.vue'
import { deleteCategory } from "@/api/basicData/materialSettings";
import AddForm from "./AddForm.vue";

export default {
  components: { AddForm, JNPFForm, ExportForm, deliveryNoteDetailForm, purchaseTH },
  // props: {
  //   queryObject: {
  //     type: Object,
  //     default: () => ({})
  //   }
  // },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [
            {
              prop: 'partnerName',
              symbol: 'like',
              fixed: true
            },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      purchaseTHVisible: false,
      addVisible: false,
      orderVisible: false,
      deliveryNoteVisible: false,
      columnList: [],
      title: '更多查询',
      exportFormVisible: false,
      background: true, //分页器背景颜色
      tableDataList: [],
      formVisible: false,
      listLoading: false,
      listQuery: {
        ...this.queryObject,
        businessType: 'purchase_delivery_return',
      },
      deliveryDate: [],
      selectData: [], // 选中的数据 带到form页
      total: 0,
      totalNum: 0,
      InTotalNum: 0,
      outTotalNum: 0,
      totalTotalAmount: 0,
      superQueryJson: [{
        prop: 'checkStatus',
        label: "核对状态",
        type: 'select',
        options: [{
          label: "未核对",
          value: "unchecked"
        }, {
          label: "已核对",
          value: "checked"
        }]
      }]
    }
  },
  async created() {
  },
  methods: {
    addRecord() {
      this.addVisible = true
      this.$nextTick(() => {
        this.$refs.AddForm.init()
      })
    },
    closeFun() {
      this.orderVisible = false
      this.deliveryNoteVisible = false
      this.addVisible = false
      this.purchaseTHVisible = false
    },
    orderDetailFun(id, type) {
      this.orderVisible = true
      this.$nextTick(() => {
        this.$refs.orderRef.init(id, type)
      })
    },

    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef)
        let columnList = domRef.columnList.filter((item) => !!item.label && !!item.prop)
        columnList = columnList.map((item) => {
          return { label: item.label, prop: item.prop }
        })
        this.$nextTick(() => {
          this.$refs.exportForm.init(columnList)
        })
      } else {
        this.$message({
          message: '暂无数据导出',
          type: 'error',
          duration: 1500
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableDataList, 'tableForm')
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1267',
          exportName: '采购物流对账',
          includeFieldMap,
          pageSize: data.dataType === 0 ? this.listQuery.pageSize : -1,
          negativeFlag: true,
        }
        excelExport(_data)
        .then((res) => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        })
        .catch(() => {
        })
      }
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    checkSelectable(row) {
      return !row.disabled
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      console.log(val)
      this.selectData = val

      function calculateTotalValue(arr) {
        return arr.reduce((sum, item) => {
          const value = Number(item.totalAmount); // 将 value 转换为数字
          if (item.businessType === 'inbound_purchase') {
            return sum + value;  // 对于 '正', 加上 value
          } else if (item.businessType === 'outbound_purchase') {
            return sum - value;   // 对于 '负', 减去 value
          }
          return sum;  // 默认情况，无需改变 sum
        }, 0);
      }

      function calculateSum(data, type) {
        return data.reduce((sum, item) => {
          return item.businessType === type ? sum + Number(item.num) : sum;
        }, 0);
      }

      this.InTotalNum = calculateSum(this.selectData, 'inbound_purchase')
      this.outTotalNum = calculateSum(this.selectData, 'outbound_purchase')
      this.totalTotalAmount = calculateTotalValue(this.selectData)
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.initData()
    },

    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.listLoading = true
      getLogisticsReceivableList(this.listQuery).then((res) => {
        res.data.records.forEach((item) => {
          item.excludingTaxAmount = this.jnpf.numberFormat(item.actualQuantity * item.price)
        })

        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
      .catch(() => {
        this.listLoading = false
      })
    },
    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle() {
      if (!this.selectData.length) return this.$message.error('请选择你要生成的采购物流对账单')

      // 检查是否所有项都有相同的供应商代码和来源
      const errors = this.checkConditions(this.selectData)
      if (errors.length > 0) return this.$message.error(errors.join('；'))
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.procureForm.init(this.selectData)
      })
    },
    checkConditions(arr) {
      const errors = []

      const firstPartnerCode = arr[0].partnerCode
      const hasDifferentPartnerCode = arr.some(item =>
        item.partnerCode !== firstPartnerCode
      )
      if (hasDifferentPartnerCode) {
        errors.push('只能选择相同供应商的明细订单')
      }

      const firstSource = arr[0].source
      const hasDifferentSource = arr.some(item => item.source !== firstSource)
      if (hasDifferentSource) {
        errors.push('只能选择相同来源的明细订单')
      }

      return errors
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteLogisticsReceivable(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
