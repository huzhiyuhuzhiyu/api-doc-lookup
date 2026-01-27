<script>
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { getEquMoldUsedRecordsMoldList } from "@/api/basicData";

export default {
  name: "usageRecord",
  components: { TableFormProduct },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            { prop: 'moldName', symbol: 'like', fixed: true },
            { prop: 'moldCode', symbol: 'like', fixed: true },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      superQueryJson: [],
      listQuery: {
        id: ''
      },
      loading: false,
      tableData: [],
      total: 0,
      columnList: [],
      columnsConfig: [
        {
          prop: "moldName",
          label: "模具名称",
          minWidth: 120,
        },
        {
          prop: "moldCode",
          label: "模具编码",
          minWidth: 120,
        },
        {
          prop: "categorizeName",
          label: "分类名称",
          minWidth: 120,
        },
        {
          prop: "goodsOrderNo",
          label: "收货通知单号",
          minWidth: 120,
        },
        {
          prop: "moldUsedNumber",
          label: "模具使用次数",
          minWidth: 160,
        },
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 180,
        }
      ],
    }
  },
  methods: {
    init(id = '') {
      this.listQuery.id = id;
    },
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();

      this.loading = true
      try {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
        const res = await getEquMoldUsedRecordsMoldList(this.listQuery);
        const { total, records } = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },
    getAlign(align) {
      return align || 'left'
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main transitionForm">
      <div class="JNPF-common-page-header">
        <el-page-header @back="$emit('close',false)" content="模具使用记录"/>
        <div class="options">
          <el-button @click="$emit('close',false)">{{
              $t('common.cancelButton')
            }}
          </el-button>
        </div>
      </div>
      <div class="main" v-loading="loading" ref="main">
        <div class="JNPF-common-layout-center  JNPF-flex-main">
          <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable"/>
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <div class="JNPF-common-head" style="padding: 8px">
              <div class="JNPF-common-head-left">
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
              customKey="usageRecord"
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
            </JNPF-table>
            <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
