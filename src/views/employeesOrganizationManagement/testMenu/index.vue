<template>
  <div class="JNPF-common-layout" :element-loading-text="loadingText">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入产品编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="请输入产品名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.productSource" placeholder="请选择产品来源" clearable style="width: 100%;">
                <el-option v-for="(item, index) in productSourceList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <topOpts @add="addOrUpdateHandle()">
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <div class="tableBox">
          <JNPF-table class="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" ref="dataTable" custom-column v-if="tableItems.length"
            @current-change="handleCurrentChange" customKey="JNPFTableKey_713903">
            <template v-if="tableItems">
              <el-table-column v-for="item in tableItems" :key="item.prop" :prop="item.prop" :label="item.label"
                :formatter="item.formatter || toFormatter" :sortable="item.sortable ? 'custom' : false"
                :align="item.align || 'left'" v-bind="{ minWidth: item.hasOwnProperty('minWidth') ? item.width : 140 }">
              </el-table-column>
            </template>

            <!-- <el-table-column prop="documentType" label="单据状态"></el-table-column> -->
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId)"
                  @del="handleDel(scope.row.id)">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">
                        查看详情
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <JNPF-table class="dataTable" v-loading="detailLoading" :data="tableLineData" :fixedNO="true"
            @sort-change="sortChange" ref="dataLineTable" custom-column v-if="tableLineItems.length" customKey="JNPFTableKey_714280">
            <template v-if="tableLineItems">
              <el-table-column v-for="item in tableLineItems" :key="item.prop" :prop="item.prop" :label="item.label"
                :formatter="item.formatter || toFormatter" :sortable="item.sortable ? 'custom' : false"
                :align="item.align || 'left'" v-bind="{ minWidth: item.hasOwnProperty('minWidth') ? item.width : 140 }">
              </el-table-column>
            </template>

            <!-- <el-table-column prop="documentType" label="单据状态"></el-table-column> -->
            <!-- <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId)"
                  @del="handleDel(scope.row.id)">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">
                        查看详情
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </tableOpts>
              </template>
            </el-table-column> -->
          </JNPF-table>
        </div>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>

    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.code" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号">
              <el-input v-model="listQuery.drawingNo" placeholder="请输入规格型号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.name" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品来源">
              <el-select v-model="listQuery.productSource" placeholder="请选择产品来源" clearable style="width: 100%;">
                <el-option v-for="item in productSourceList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品状态">
              <el-select v-model="listQuery.productStatus" placeholder="请选择产品状态" clearable style="width: 100%;">
                <el-option v-for="item in productStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { detailVisualDevInfo, getDocData } from '@/api/system/system'
import { getWarehouseList } from '@/api/warehouseManagement/inboundAndOutbound'
import Form from './form'
export default {
  name: 'finished_product',
  components: { Form },
  data() {
    return {
      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      aiformVisible: false,
      treeData: [],
      tableData: [],
      tableLineData: [],
      treeLoading: false,
      listLoading: false,
      loadingText: false,
      initListQuery: {
        type: "master",
        visualId: "",
        condList: [],
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {},
      initLineListQuery: {
        type: "slave",
        visualId: "",
        condList: [],
        pageNum: 1,
        pageSize: 20
      },
      listLineQuery: {},
      productStatusList: [{ label: "启用", value: "enable" }, { label: "禁用", value: "disabled" }], // 产品状态
      productSourceList: [{ label: "自制", value: "produce" }, { label: "采购", value: "purchase" }, { label: "外协", value: "out" }], // 产品来源
      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      columnData: [],
      formatterFunction: null,
      tableItems: [],
      tableLineItems: [],
      listCondList: [],
      listLineCondList: [],
      detailLoading: false,
    }
  },
  async created() {
    this.getDevData()
  },
  computed: {
    ...mapState('user', ['token']),
  },
  methods: {

    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.aiformVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    getToLowerCase(val) {
      return val.replace(/_(.)/g, (match, group) => group.toUpperCase())
    },
    getDevData() {
      let queryString = this.jnpf.getQueryString()
      detailVisualDevInfo(queryString).then(res => {
        this.columnData = JSON.parse(res.data.columnData)
        console.log(this.columnData);
        this.initListQuery.visualId = res.data.id
        this.initLineListQuery.visualId = res.data.id
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
        this.listLineQuery = JSON.parse(JSON.stringify(this.initLineListQuery))
        console.log(this.listQuery);

        this.listCondList = this.columnData.master.condList
        this.listLineCondList = this.columnData.slave.condList
        this.tableItems = this.columnData.columnList.map(item => {
          let formatterFunction = null
          if (item.formatter) {
            formatterFunction = new Function('return ' + item.formatter)
            let fnc = formatterFunction()
            console.log(fnc);
          }

          return {
            ...item,
            minWidth: item.width ? item.width : 120,
            formatter: item.formatter ? formatterFunction.bind(this)() : ''
          }
        })
        this.tableLineItems = this.columnData.columnLineList.map(item => {
          let formatterFunction = null
          if (item.formatter) {
            formatterFunction = new Function('return ' + item.formatter)
            let fnc = formatterFunction()
          }
          return {
            ...item,
            minWidth: item.width ? item.width : 120,
            formatter: item.formatter ? formatterFunction.bind(this)() : ''
          }
        })
        console.log(this.tableLineItems);
        this.initData()

      }).catch(() => { })
    },
    toFormatter(row, column, cellValue, index) {
      return cellValue
    },
    initData() {
      this.listLoading = true
      console.log(this.listQuery, 'list');

      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      // this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
      getDocData(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 内容选择事件
    handleCurrentChange(val) {
      console.log('1111111111111111', val)

      if (!val) return
      this.detailLoading = true
      if (this.listLineCondList.length) {
        console.log('this.listLineCondList', this.listLineCondList)
        const fieldsWithoutHash = this.listLineCondList.map(field => field.slice(1));
        const condList = fieldsWithoutHash.map(field => val[field])
        this.listLineQuery.condList = condList
        getDocData(this.listLineQuery).then(res => {
          this.tableLineData = res.data.records
          this.detailLoading = false
        }).catch(() => {
          this.detailLoading = false
        })
      }
    },
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },

    addOrUpdateHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteProduct(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style scoped lang="scss">
.tableBox {
  flex: auto;
  display: flex;
  position: relative;

  // border: 1px solid #dedede;
  // box-shadow: inset 0 0 0 1px #dedede;
  >.dataTable:first-child {
    flex: 3;
    margin: 0 3px 0 0;
  }

  >.dataTable:last-child {
    flex: 2;
  }
}
</style>