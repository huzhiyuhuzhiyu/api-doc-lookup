<script>
import {buttonList, getColumns} from "../data";
import Form from '../createdBuyingRequisition/index.vue'
import {deletepurProcurementRequire, getPurProcurementRequirementsList} from "@/api/purchasingManagement/purchaseInquirySheet";
import {withdrawn} from "@/api/basicData/approvalAdministrator";

export default {
  name: "index",
  components: {
    Form,
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            {prop: 'orderNo', symbol: 'like', fixed: true},
            {prop: 'documentStatus', symbol: '==', fixed: true},
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
      loading: false,
      visible: false,
      tableData: [],
      total: 0,
      superQueryVisible: false,
      superQueryJson: [],
      listQuery: {
        userFlag: false,
      },
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),
    }
  },
  created() {

  },
  methods: {
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();

      this.loading = true
      try {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
        const res = await getPurProcurementRequirementsList(this.listQuery);
        const {total, records} = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },

    handleButtonClick(type) {
      switch (type) {
        case '':
          break;
        default:
      }
    },

    handleColumnClick(row, type) {
      switch (type) {
        case 'add':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', type)
          })
          break;
        case 'edit':
        case 'look':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init(row.id, type)
          })
          break;
        case 'withdrawn':
          this.handleWithdraw(id)
          break;
        case 'delete':
          this.handleRemove(row.id)
          break;
        default:
      }
    },

    handleRemove(id) {
      this.$confirm('您确定要删除这些数据吗, 是否继续？', '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await deletepurProcurementRequire(id);
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success('删除成功')
          this.initData()
        }
      }).catch(() => {
      })
    },

    async handleWithdraw(formId) {
      try {
        await this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
          type: 'warning'
        });

        const res = await withdrawn({formId});
        this.$message({
          type: 'success',
          message: '撤回成功',
          duration: 1500,
          onClose: () => {
            this.initData();
          }
        });
      } catch (error) {
      }
    },

    isDisabled(type, row) {
      const rules = {
        edit: row.documentStatus !== 'draft',
        delete: row.documentStatus !== 'draft',
        add: row.approvalStatus === 'rebut' || row.approvalStatus === 'withdrawn',
        withdrawn: row.approvalStatus === 'ing'
      };
      return rules[type] || false;
    },

    close(isInitData = true) {
      this.visible = false
      if (!isInitData) return
      this.initData()
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    getAlign(align) {
      return align || 'left'
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
        <JNPF-table customKey="myBuyingRequisition"
          v-loading="loading"
          :data="tableData"
          :row-key="'id'"
          fixedNO
          :setColumnDisplayList="columnList"
          ref="dataTable"
          custom-column :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
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
                  <el-link type="primary" @click.native="handleColumnClick(scope.row, 'look')">{{
                      scope.row.orderNo
                    }}
                  </el-link>
                </template>
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
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text"
                @click="handleColumnClick(row, 'edit')"
                :disabled="isDisabled('edit',row)"
              >
                编辑
              </el-button>
              <el-button class="JNPF-table-delBtn" size="mini" type="text"
                @click="handleColumnClick(row, 'delete')"
                :disabled="isDisabled('delete',row)"
              >
                删除
              </el-button>
              <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="isDisabled('add',row)"
                    @click.native="handleColumnClick(row, 'add')">
                    重新提交
                  </el-dropdown-item>
                  <el-dropdown-item v-if="isDisabled('withdrawn',row)"
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
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
        />
      </div>
    </div>
    <Form ref="Form" v-if="visible" :autoInit="false" @close="close"/>
  </div>
</template>
