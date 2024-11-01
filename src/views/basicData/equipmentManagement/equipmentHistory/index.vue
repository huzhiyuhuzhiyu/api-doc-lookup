<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.equipmentIdName" placeholder="请输入设备名称" clearable @keydown.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="listQuery.equipmentIdState" placeholder="请选择设备状态" clearable>
                  <el-option v-for="item in maintenanceTypeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <div></div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="equipmentIdName" label="设备名称" min-width="180" sortable="custom" />
            <el-table-column prop="equipmentIdCode" label="设备编码" min-width="180" sortable="custom" />
            <el-table-column prop="factoryFloor" label="车间" min-width="200" sortable="custom" />
            <el-table-column prop="mountedPlaces" label="安装地点" min-width="200" sortable="custom" />
            <el-table-column prop="partnerName" label="供应商" min-width="200" sortable="custom" />
            <el-table-column prop="supplier" label="生产厂家" min-width="200" sortable="custom" />
            <el-table-column prop="equipmentIdState" label="设备状态" width="140" align="center" sortable="custom" fixed="right">
              <template slot-scope="{row}">
                <el-tag type="success" disable-transitions v-if="row.equipmentIdState == 'normal'">正常</el-tag>
                <el-tag type="warning" disable-transitions v-if="row.equipmentIdState == 'repair'">维修</el-tag>
                <el-tag type="danger" disable-transitions v-if="row.equipmentIdState == 'discard'">报废</el-tag>
                <el-tag disable-transitions v-if="row.equipmentIdState == 'spare'">备用</el-tag>
                <el-tag type="info" disable-transitions v-if="row.equipmentIdState == 'stop'">停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="180" />
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" width="120" sortable="custom" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click.native="addOrUpdateHandle(scope.row.equipmentId, 'look')">
                  查看履历
                </el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData">
          </pagination>
        </div>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getequLifeCyclelist } from "@/api/basicData/materialSettings";
import Form from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name: 'maintenancelevel',
  components: { SuperQuery, Form },
  data() {
    return {
      columnList: ["code", "partsReplacementRecord", "createByName"],
      maintenanceTypeList: [
        { label: "正常", value: "normal" },
        { label: "维修", value: "repair" },
        { label: "报废", value: "discard" },
        { label: "备用", value: "spare" },
        { label: "停用", value: "stop" }
      ],
      formVisible: false,
      listLoading: false,
      tableData: [],
      superQueryVisible: false,
      initListQuery: {
        classAttribute: "equipment",
        equipmentIdName: '',
        equipmentIdState: '',
        maintenanceDate: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      listQuery: {},
      superQueryJson: [
        {
          prop: 'equipmentIdName',
          label: "设备名称",
          type: 'input'
        },
        {
          prop: 'equipmentIdCode',
          label: "设备编码",
          type: 'input'
        },
        {
          prop: 'factoryFloor',
          label: "车间",
          type: 'input'
        },
        {
          prop: 'mountedPlaces',
          label: "安装地点",
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: "供应商",
          type: 'input'
        },
        {
          prop: 'supplier',
          label: "生产厂家",
          type: 'input'
        },
        {
          prop: 'equipmentIdState',
          label: "设备状态",
          type: 'select',
          options: [
            { label: "正常", value: "normal" },
            { label: "维修", value: "repair" },
            { label: "报废", value: "discard" },
            { label: "备用", value: "spare" },
            { label: "停用", value: "stop" }
          ]
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        }
      ]
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    maintenancefunction(val) {
      let _data = this.maintenanceTypeList.filter(item => item.value == val)[0]
      return _data ? _data.label : val
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order !== "descending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type)
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.$refs.SuperQuery.conditionList = []
      this.initData()
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getequLifeCyclelist(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
