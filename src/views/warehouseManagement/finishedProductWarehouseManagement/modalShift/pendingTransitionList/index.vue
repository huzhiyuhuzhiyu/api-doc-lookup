<script>
import { buttonList, getColumns } from "./data";
import Form from '../modules/Form.vue'
import { approvalMixin } from "@/mixins/generator/approvalMixin.js";
import { InventorymodalShiftdele, InventorymodalShiftlist } from "@/api/warehouseManagement/modalShift";
import { getQueryConfirm } from "@/utils";

export default {
  name: "index",
  components: {
    Form,
  },
  mixins: [approvalMixin],
  props: {
    warehouseCode: {
      type: String,
      default: 'finish_product'
    }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND",
        fullName: "默认视图",
        conditionJson: {
          condition: [
            { prop: 'orderNo', symbol: 'like', fixed: true },
          ],
          pageSize: 20,
          orderItems: []
        },
      }],
      loading: false,
      visible: false,
      tableData: [],
      total: 0,
      superQueryJson: [],
      listQuery: {},
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),
      selectedRow: [],
    }
  },
  async created() {
    await this.loadApprovalConfig('b064');
  },
  methods: {
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();

      this.loading = true;
      try {
        if (listLoadKey !== this.listLoadKey) return;
        const res = await InventorymodalShiftlist(this.listQuery);
        const { total, records } = res.data;
        this.tableData = records;
        this.total = total;
      } finally {
        this.loading = false;
      }
    },

    validateSelectedRows() {
      if (!this.selectedRow.length) {
        this.$message.warning('请至少选择一条数据');
        return false;
      }
      if (this.selectedRow.length > 1) {
        this.$message.warning('只能选择一条数据');
        return false;
      }
      return true;
    },

    handleButtonClick(type) {
      switch ( type ) {
        case 'add':
          if (!this.validateSelectedRows()) return;
          this.visible = true;
          this.$nextTick(() => {
            this.$refs.Form.init('', 'add', false, this.selectedRow[0].id);
          });
          break;
        default:
      }
    },

    handleColumnClick(row, type) {
      switch ( type ) {
        case 'look':
        case 'edit':
          this.visible = true;
          this.$nextTick(() => {
            this.$refs.Form.init(row.id, type);
          });
          break;
        case 'delete':
          this.handleRemove(row.id);
          break;
        case 'withdrawn':
          this.handleWithdraw(row.id);
          break;
        case 'resubmit':
          this.handleResubmit(row);
          break;
        default:
      }
    },

    async handleRemove(id) {
      try {
        await getQueryConfirm(this, '您确定要删除这些数据吗, 是否继续？')

        const res = await InventorymodalShiftdele(id);
        if (res.msg === 'Success') {
          this.$message.success('删除成功');
          await this.initData();
        }
      } catch ( error ) {
        if (error !== 'cancel') {
          console.error('删除失败:', error);
        }
      }
    },

    close(isInitData = true) {
      this.visible = false;
      if (!isInitData) return;
      this.initData();
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer();
    },

    getAlign(align) {
      return align || 'left';
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable"/>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <CustomButton
              :btnList="btnList"
              @click="handleButtonClick"
            />
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
              <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                       @click="$refs.dataTable.showSortDrawer()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                       @click="columnSetFun()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                       @click="initData()"/>
            </el-tooltip>
          </div>
        </div>
        <JNPF-table
          customKey="pendingTransitionList"
          v-loading="loading"
          :data="tableData"
          :has-c="true"
          @selection-change="(val) => selectedRow = val"
          :row-key="'id'"
          fixedNO
          :setColumnDisplayList="columnList"
          ref="dataTable"
          custom-column
          :listQuery="listQuery"
          @queryChange="initData"
          :queryJson="superQueryJson"
        >
          <template v-for="column in columnsConfig">
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
                <template v-if="column.prop === 'orderNo'">
                  <el-link
                    type="primary"
                    @click.native="handleColumnClick(scope.row, 'look')"
                  >
                    {{ scope.row.orderNo }}
                  </el-link>
                </template>
                <template v-if="column.dictType">
                  <span>
                    <el-tag
                      :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">
                      {{ global.getDictLabelGlobal(column.dictType, scope.row[column.prop]) }}
                    </el-tag>
                  </span>
                </template>
              </template>
            </el-table-column>
          </template>

          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" :disabled="!canEdit(row)"
                         @click="handleColumnClick(row, 'edit')">
                编辑
              </el-button>
              <el-button class="JNPF-table-delBtn" size="mini" type="text" :disabled="!canEdit(row)"
                         @click="handleColumnClick(row, 'delete')">
                删除
              </el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="canShowApprovalButton(row, 'resubmit')"
                                    @click.native="handleColumnClick(row, 'resubmit')">
                    重新提交
                  </el-dropdown-item>
                  <el-dropdown-item v-if="canShowApprovalButton(row, 'withdraw')"
                                    @click.native="handleColumnClick(row, 'withdrawn')">
                    审批撤回
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleColumnClick(row, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                    @pagination="initData()"/>
      </div>
    </div>
    <Form ref="Form" v-if="visible" :warehouseCode="warehouseCode" @close="close"/>
  </div>
</template>
