<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import Form from './Form.vue'
import {buttonList, getColumns} from "./data";
import {deleteparametersShelves, parametersShelveslist} from "@/api/basicData";

export default {
  name: "index",
  components: {
    SuperQuery,
    Form
  },
  props: {
    propsClassAttribute: {
      type: String,
      default: 'equipment'
    }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            {prop: 'name', symbol: 'like', fixed: true},
            {prop: 'code', symbol: 'like', fixed: true},
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
        classAttribute: this.propsClassAttribute,
        typeCode: 'faultType',
      },
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns('faultType'),
      types: [
        {name: '故障类型', typeCode: 'faultType'},
        {name: '故障部位', typeCode: 'faultLocation'},
        {name: '保养项目', typeCode: 'maintenanceItem'},
        {name: '点检项目', typeCode: 'inspectionItem'}
      ],
      typeCode: 'faultType',
    }
  },
  methods: {
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.loading = true
      try {
        const res = await parametersShelveslist(this.listQuery);
        const {total, records} = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },

    async handleTypesClick(typeCode) {
      console.log("typeCode ✈️ ", typeCode)
      this.typeCode = typeCode
      this.listQuery.typeCode = typeCode
      this.columnsConfig = getColumns(typeCode)
      await this.$nextTick()
      this.$refs.dataTable.doLayout()
      this.initData()
    },

    handleButtonClick(type) {
      switch (type) {
        case 'add':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', 'add', this.typeCode, this.propsClassAttribute)
          })
          break;
        default:
      }
    },

    handleColumnClick(row, type) {
      switch (type) {
        case 'look':
        case 'edit':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init(row.id, type, this.typeCode, this.propsClassAttribute)
          })
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
        const res = await deleteparametersShelves(id);
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success('删除成功')
          this.initData()
        }
      }).catch(() => {
      })
    },

    close(isInitData = true) {
      this.visible = false
      if (!isInitData) return
      this.initData()
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <el-scrollbar class="JNPF-common-el-tree-scrollbar">
        <div
          v-for="item in types"
          :key="item.typeCode"
          class="left-foundation"
          :class="{ 'active': item.typeCode === typeCode }"
          @click="handleTypesClick(item.typeCode)"
        >
          <span class="left-foundation-text">{{ item.name }}</span>
        </div>
      </el-scrollbar>
    </div>
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
        <JNPF-table customKey="BasicParameters"
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
              :align="column.align"
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
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text"
                @click="handleColumnClick(row, 'edit')">
                编辑
              </el-button>
              <el-button class="JNPF-table-delBtn" size="mini" type="text"
                @click="handleColumnClick(row, 'delete')">
                删除
              </el-button>
              <el-button size="mini" type="text"
                @click="handleColumnClick(row, 'look')">
                详情
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
        />
      </div>
    </div>
    <Form ref="Form" v-if="visible" @close="close"/>
  </div>
</template>

<style lang="scss" scoped>
.JNPF-common-el-tree-scrollbar {
  padding-top: 7px;
}

.left-foundation {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin: 0 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #606266;
  font-size: 14px;

  &-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    background-color: #f5f7fa;
    color: #409eff;
  }

  &.active {
    background-color: #ecf5ff;
    color: #409eff;
    font-weight: 500;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: #409eff;
      border-radius: 2px;
    }
  }
}
</style>
