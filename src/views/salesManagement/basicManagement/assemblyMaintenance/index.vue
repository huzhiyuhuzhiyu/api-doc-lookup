<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import {getBusinessComponentPage, removeBusinessComponent} from "@/api/assemblyMaintenance";
import Form from './Form.vue'
import {buttonList, getColumns} from "./data";


export default {
  name: "index",
  components: {
    SuperQuery,
    Form
  },
  data() {
    return {
      loading: false,
      visible: false,
      tableData: [],
      total: 0,
      superQueryVisible: false,
      superQueryJson: [],
      initListQuery: {
        name: '',
        cooperativePartnerName: '',
        cooperativePartnerCode: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        superQuery: {},
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {},
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        const res = await getBusinessComponentPage(this.listQuery);
        const {total, records} = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },

    handleButtonClick(type) {
      switch (type) {
        case 'add':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', 'add')
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
            this.$refs.Form.init(row.id, type)
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
        const res = await removeBusinessComponent(id);
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
      this.BindingVisible = false
      if (!isInitData) return
      this.initData()
    },

    sortChange({prop, order}) {
      let newProp = ''
      if (prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    getAlign(align) {
      return align || 'left'
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16" style="margin-bottom: 5px !important;">
        <el-form @submit.native.prevent @keyup.enter.native="search()">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.name"
                placeholder="机型"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerCode"
                placeholder="客户编码"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerName"
                placeholder="客户名称"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search"
                @click="search()">查询
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <CustomButton
              :btnList="btnList"
              @click="handleButtonClick"
            />
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true"/>
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
        <JNPF-table customKey="hsCodes"
          v-loading="loading"
          :data="tableData" :row-key="'id'" fixedNO
          :setColumnDisplayList="columnList"
          @sort-change="sortChange"
          ref="dataTable"
          custom-column>
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
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text"
                @click="handleColumnClick(row, 'edit')">
                编辑
              </el-button>
              <el-button size="mini" type="text"
                @click="handleColumnClick(row, 'look')">
                详情
              </el-button>
              <el-button class="JNPF-table-delBtn" size="mini" type="text"
                @click="handleColumnClick(row, 'delete')">
                删除
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery partentOrChild="TransitionApplicationRecordQuery" :show="superQueryVisible" ref="SuperQuery"
      table-ref="dataTable"
      :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
    <Form ref="Form" v-if="visible" @close="close"/>
  </div>
</template>
