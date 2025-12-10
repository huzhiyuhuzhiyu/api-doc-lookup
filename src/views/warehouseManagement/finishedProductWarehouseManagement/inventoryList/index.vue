<script>
import {buttonList, getColumns} from "./data";
import PrintDialogPro from '@/components/no_mount/PrintDialogPro'
import Form from '@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue'
import {deletepurProcurementRequire} from "@/api/purchasingManagement/purchaseInquirySheet";
import {getWarehouseList} from "@/api/warehouseManagement/inboundAndOutbound";

export default {
  name: "index",
  components: {
    Form,
    PrintDialogPro
  },
  props: {
    warehouseCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            {prop: 'orderNo', symbol: 'like', fixed: true},
            {prop: 'businessType', symbol: '==', fixed: true},
            {prop: 'supplierPartnerName', symbol: 'like', fixed: true},
            {prop: 'cooperativePartnerName', symbol: 'like', fixed: true},
          ],
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
      superQueryJson: [
        {
          prop: 'businessType',
          label: '业务类型',
          type: 'select',
          options: this.getDictDataSync('warehouseBusinessType'),
        },
      ],
      listQuery: {},
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),

      detailConfig: {
        // 生产产品入库/翻库入库
        'inbound_order_production': {
          component: (row) => row.sourceType === 'direct'
            ? () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue')
            : () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/productInboundForm.vue'),
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType === 'direct' ? vm.warehouseCode : null,
            classAttributeList: row.sourceType !== 'direct' ? vm.classAttributeList : null
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType === 'direct' ? null : vm.classAttributeList
          ]
        },
        // 生产工单入库
        'inbound_production': {
          component: (row) => row.sourceType === 'direct'
            ? () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue')
            : () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/workInboundForm.vue'),
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType === 'direct' ? vm.warehouseCode : null
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType !== 'direct' ? vm.classAttributeList : null
          ]
        },
        // 销售发货
        'outbound_sale_send': {
          component: (row) => {
            if (row.sourceType === 'order') {
              return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/saleOutboundForm.vue');
            } else if (row.sourceType === 'notice') {
              return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/outboundSaleSendForm.vue');
            }
            return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue');
          },
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType === 'direct' ? vm.warehouseCode : null,
            classAttributeList: row.sourceType !== 'direct' ? vm.classAttributeList : null,
            businessType: row.businessType
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType === 'notice' ? vm.classAttributeList : null
          ]
        },
        // 销售退货
        'inbound_sale_return': {
          component: (row) => row.sourceType === 'notice'
            ? () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundSaleReturnForm.vue')
            : () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue'),
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType !== 'notice' ? vm.warehouseCode : null,
            classAttributeList: row.sourceType === 'notice' ? vm.classAttributeList : null,
            businessType: row.businessType
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType === 'notice' ? vm.classAttributeList : null
          ]
        },
        // 采购收货
        'inbound_purchase': {
          component: (row) => {
            if (row.sourceType === 'order') {
              return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/purchaseOrderInboundForm.vue');
            } else if (row.sourceType === 'notice') {
              return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundPurchaseForm.vue');
            }
            return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue');
          },
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType !== 'order' && row.sourceType !== 'notice' ? vm.warehouseCode : null,
            classAttributeList: row.sourceType === 'order' || row.sourceType === 'notice' ? vm.classAttributeList : null,
            businessType: row.businessType
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType === 'order' ? 'order' : 'notice',
            vm.classAttributeList
          ]
        },
        // 采购退货
        'outbound_purchase': {
          component: (row) => row.sourceType === 'notice'
            ? () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/outboundPurchaseForm.vue')
            : () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue'),
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType !== 'notice' ? vm.warehouseCode : null,
            classAttributeList: row.sourceType === 'notice' ? vm.classAttributeList : null,
            businessType: row.businessType
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType === 'notice' ? vm.classAttributeList : null
          ]
        },
        // 外协发料
        'outbound_external_send': {
          component: (row) => {
            if (row.sourceType === 'order') {
              return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/externalMaterialsForm.vue');
            } else if (row.sourceType === 'notice') {
              return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/outboundExternalSendForm.vue');
            }
            return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue');
          },
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType !== 'order' && row.sourceType !== 'notice' ? vm.warehouseCode : null,
            classAttributeList: row.sourceType === 'order' || row.sourceType === 'notice' ? vm.classAttributeList : null,
            businessType: row.businessType
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType === 'order' ? 'order' : 'notice',
            vm.classAttributeList
          ]
        },
        // 外协收货
        'inbound_external': {
          component: (row) => {
            if (row.sourceType === 'order') {
              return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/externalInboundForm.vue');
            } else if (row.sourceType === 'notice') {
              return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundExternalForm.vue');
            }
            return () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue');
          },
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType === 'order' ? vm.warehouseCode : null,
            classAttributeList: row.sourceType === 'order' || row.sourceType === 'notice' ? vm.classAttributeList : null,
            businessType: row.businessType
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType === 'order' ? 'order' : 'notice',
            vm.classAttributeList
          ]
        },
        // 生产领料
        'outbound_pick_out': {
          component: (row) => row.sourceType === 'notice'
            ? () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/outboundPickOutForm.vue')
            : () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue'),
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType !== 'notice' ? vm.warehouseCode : null,
            classAttributeList: row.sourceType === 'notice' ? vm.classAttributeList : null,
            businessType: row.businessType
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType === 'notice' ? vm.classAttributeList : null
          ]
        },
        // 生产退料
        'inbound_return_materials': {
          component: (row) => row.sourceType === 'notice'
            ? () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundReturnMaterialsForm.vue')
            : () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue'),
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType !== 'notice' ? vm.warehouseCode : null,
            classAttributeList: row.sourceType === 'notice' ? vm.classAttributeList : null,
            businessType: row.businessType
          }),
          extraInitArgs: (row, vm) => [
            row.sourceType === 'notice' ? vm.classAttributeList : null
          ]
        },
        // 调拨入库/调拨出库
        'inbound_transfer': {
          component: () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/transferForm.vue'),
          rowId: 'id',
          props: () => ({}),
          extraInitArgs: () => []
        },
        'outbound_transfer': {
          component: () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/transferForm.vue'),
          rowId: 'id',
          props: () => ({}),
          extraInitArgs: () => []
        },
        // 资产领用
        'outbound_use': {
          component: (row) => row.sourceType === 'order'
            ? () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/equipmentOutboundForm.vue')
            : () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue'),
          rowId: 'id',
          props: (vm, row) => ({
            warehouseCode: row.sourceType !== 'order' ? vm.warehouseCode : null
          }),
          extraInitArgs: (row) => [
            row.sourceType === 'order' ? 'order' : null
          ]
        },
        // 资产归还
        'inbound_return': {
          component: () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/equipmentInboundForm.vue'),
          rowId: 'id',
          props: () => ({}),
          extraInitArgs: () => []
        },
        // 盘点调整入库/出库
        'inbound_taking_adjust': {
          component: () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/adjust.vue'),
          rowId: 'id',
          props: () => ({}),
          extraInitArgs: () => []
        },
        'outbound_taking_adjust': {
          component: () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/adjust.vue'),
          rowId: 'id',
          props: () => ({}),
          extraInitArgs: () => []
        },
        // 默认配置
        'default': {
          component: () => import('@/views/warehouseManagement/finishedProductWarehouseManagement/directInandOutWarehouse/index.vue'),
          rowId: 'id',
          props: (vm) => ({
            warehouseCode: vm.warehouseCode
          }),
          extraInitArgs: () => []
        }
      },
      currentDetail: {
        component: null,
        instance: null,
        config: null,
        visible: false,
      },

      printableTypes: [
        {
          businessType: 'inbound_purchase',
          code: "p017",
          fullName: "采购收货单"
        },
        {
          businessType: 'outbound_purchase',
          code: "p008",
          fullName: "采购退货"
        },
        {
          businessType: 'outbound_external_send',
          code: "p013",
          fullName: "外协发料单"
        },
        {
          businessType: 'inbound_external',
          code: "p019",
          fullName: "外协收货单"
        },
        {
          businessType: 'outbound_sale_send',
          code: "p031",
          fullName: "销售发货单"
        },
        {
          businessType: 'inbound_sale_return',
          code: "p031",
          fullName: "销售退库单"
        },
        {
          businessType: 'outbound_pick_out',
          code: "p062",
          fullName: "生产领料单"
        },
      ]
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
        const res = await getWarehouseList(this.listQuery);
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
        case 'edit':
          break;
        case 'look':
          this.handleView(row, type);
          break;
        case 'delete':
          this.handleRemove(row.id);
          break;
        case 'print':
          this.handlePrint(row);
          break;
        default:
      }
    },

    // 显示详情
    async handleView(row, type = 'look') {
      const resolvedConfig = this.detailConfig[row.businessType] || this.detailConfig.default;
      if (!resolvedConfig || !resolvedConfig.component) {
        return this.$message.warning('当前业务类型不支持查看详情');
      }

      this.currentDetail = {
        component: null,
        instance: null,
        config: {
          props: typeof resolvedConfig.props === 'function'
            ? resolvedConfig.props(this, row)
            : (resolvedConfig.props || {})
        },
        visible: false,
      };

      try {
        let componentFunc;
        if (typeof resolvedConfig.component === 'function') {
          componentFunc = resolvedConfig.component(row);
        } else {
          componentFunc = resolvedConfig.component;
        }

        if (componentFunc === null || componentFunc === undefined) {
          throw new Error('组件加载函数无效');
        }

        let component;
        if (typeof componentFunc === 'function') {
          component = await componentFunc();
        } else if (componentFunc && typeof componentFunc.then === 'function') {
          component = await componentFunc;
        } else {
          throw new Error('无效的组件加载方式');
        }

        this.currentDetail.component = component.default || component;
        this.currentDetail.visible = true;

        this.$nextTick(() => {
          this.currentDetail.instance = this.$refs.detailComponent;
          if (this.currentDetail.instance?.init) {
            const fixedArgs = [row[resolvedConfig.rowId || 'id'], type];
            const extraArgs = resolvedConfig.extraInitArgs
              ? resolvedConfig.extraInitArgs(row, this)
              : [];

            this.currentDetail.instance.init(...[...fixedArgs, ...extraArgs]);
          }
        });
      } catch (error) {
        this.$message.error('加载详情组件失败');
        this.currentDetail.visible = false;
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

    // 处理打印
    handlePrint(row) {
      const printConfig = this.getPrintConfig(row.businessType);
      if (!printConfig) {
        return this.$message.warning('当前业务类型不允许打印');
      }
      this.$refs.PrintDialogPro.init({
        enCode: printConfig.code,
        formId: row.id,
        fullName: printConfig.fullName
      })
    },

    getPrintConfig(businessType) {
      return this.printableTypes.find(item => item.businessType === businessType);
    },

    isPrintable(row) {
      return !!this.getPrintConfig(row.businessType);
    },

    isDisabled(type, row) {
      const rules = {
        edit: row.documentStatus !== 'draft' || row.documentStatus === 'back',
        delete: row.documentStatus !== 'draft',
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
              :exportListQuery="listQuery"
              :exportDisabled="tableData.length <= 0"
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
          customKey="inventoryList"
          v-loading="loading"
          :data="tableData"
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
              v-if="typeof column.show === 'function' ? column.show() : (column.show !== undefined ? column.show : true)"
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
                  <el-link type="primary" @click.native="handleColumnClick(scope.row, 'look')">
                    {{ scope.row.orderNo }}
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
                  <el-dropdown-item @click.native="handleColumnClick(row, 'look')">
                    查看详情
                  </el-dropdown-item>
                  <el-dropdown-item
                    type="text"
                    @click.native="handleColumnClick(row,'print')"
                    :disabled="!isPrintable(row)">
                    打印
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
    <!--  打印  -->
    <PrintDialogPro ref="PrintDialogPro"/>
    <!--  业务  -->
    <Form ref="Form" v-if="visible" :autoInit="false" :warehouseCode="warehouseCode" @close="close"/>
    <!--  详情  -->
    <component
      v-if="currentDetail.visible"
      :is="currentDetail.component"
      ref="detailComponent"
      v-bind="currentDetail.config.props || {}"
      @close="currentDetail.visible = false"
    />
  </div>
</template>
