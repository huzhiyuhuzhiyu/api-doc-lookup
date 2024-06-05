<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-select placeholder="选择胶管层数" v-model="tableQuery.layerCount" clearable>
                <el-option class="select_item" v-for="(item, index) in productTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.processCode" @keyup.enter.native="search()" placeholder="请输入工序编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="tableQuery.processName" @keyup.enter.native="search()" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                              $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier('', 'add')">
            <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
          </topOpts>
          <!-- <el-dropdown> -->
          <!-- <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('', 'add')">
            新建
          </el-button> -->
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableDataList" ref="dataTable" custom-column>
          <el-table-column prop="layerCount" label="胶管层数" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.layerCount == '1-2'">1-2层</div>
              <div v-else-if="scope.row.layerCount == '3-4'">3-4层</div>
              <div v-else-if="scope.row.layerCount == '6'">6层</div>
              <div v-else-if="scope.row.layerCount == 'other'">其他</div>
            </template>
          </el-table-column>
          <el-table-column prop="hoseDiameterRange" label="内径标号区间" min-width="200" />
          <el-table-column prop="hoseLengthRange" label="长度区间" min-width="200" />
          <el-table-column prop="processCode" label="工序编码" min-width="200" />
          <el-table-column prop="processName" label="工序名称" min-width="200" />
          <el-table-column prop="price" label="单价(件/元)" width="160" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <!-- <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handlereturn(scope.row.id)">导出</el-button>
            </template>
          </el-table-column> -->
        </JNPF-table>
        <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background" :limit.sync="tableQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
  </div>
</template>

<script>
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { getRubberhosepriceList, } from '@/api/financialManagement/index'
import DepForm from './depForm'
export default {
  name: 'rubberhoseprice',
  components: { DepForm, ExportForm },
  data () {
    return {
      exportFormVisible: false,
      productTypeList: [
        {
          label: "1-2层",
          value: "1-2",
        },
        {
          label: "3-4层",
          value: "3-4",
        },
        {
          label: "6层",
          value: "6",
        },
        {
          label: "水管",
          value: "water_pipes",
        },
        {
          label: "铁佛龙管",
          value: "iron_buddha_dragon",
        },
        {
          label: "测压表线",
          value: "pressure_gauge",
        },
        {
          label: "黄油管",
          value: "butter_tube",
        },
        {
          label: "其他",
          value: "other",
        }
      ],
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [],
      listLoading: false,
      tableQuery1: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        layerCount: '',
        processCode: '',
        processName: '',
        hasProcess: 1
      },
      tableQuery: {},
      total: 0,
    }
  },
  created () {
    this.tableQuery = JSON.parse(JSON.stringify(this.tableQuery1))
    this.initData()
  },
  methods: {
    // 导出
    exportForm () {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download (data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.tableQuery,
          exportType: '1102',
          exportName: '胶管计件价格表设置',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.tableQuery.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    handlereturn () { },
    // 关闭新建、编辑页面
    closeForm (isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData () {
      getRubberhosepriceList(this.tableQuery).then(res => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search () {
      this.tableQuery.pageNum = 1
      this.initData()
    },
    reset () {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.tableQuery = JSON.parse(JSON.stringify(this.tableQuery1))
      this.search()
    },
    addSupplier (id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
  }
}
</script>
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

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
.select_item{
  height: 25px;
  line-height: 25px;
  font-size: 12px;
}
</style>
