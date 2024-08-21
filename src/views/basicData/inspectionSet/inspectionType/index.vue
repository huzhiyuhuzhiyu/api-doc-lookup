<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="query.name" placeholder="请输入检验类型名称" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="query.inspectionCategory" placeholder="请选择检验种类" style="width: 100%;">
                <el-option v-for="(item, index) in inspectionCategoryList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="query.inspectionType" placeholder="请选择类型名称" style="width: 100%;">
                <el-option v-for="(item, index) in inspectionTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
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
          <!-- <el-dropdown> -->
          <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier()" size="mini">
            新建
          </el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" @sort-change="sortChange"
          custom-column :setColumnDisplayList="columnList">
          <el-table-column prop="code" label="检验类型编码" sortable="custom" min-width="200">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                scope.row.code
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="检验类型名称" width="180" sortable="custom" />
          <el-table-column prop="inspectionCategory" label="检验种类" min-width="150">
            <template slot-scope="scope">
              <span>{{ inspectionCategoryFormat(scope.row.inspectionCategory) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inspectionType" label="类型名称" width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.inspectionType == 'common'">通用检验</div>
              <div v-else-if="scope.row.inspectionType == 'product_category'">按产品分类检验</div>
              <div v-else-if="scope.row.inspectionType == 'product'">按产品检验</div>
            </template>
          </el-table-column>
          <el-table-column prop="productCategoryCode" label="产品分类编码" width="180" />
          <el-table-column prop="productCategoryName" label="产品分类名称" width="180" />
          <el-table-column prop="productCode" label="产品编码" width="180" />
          <el-table-column prop="productName" label="产品名称" width="180" />
          <el-table-column prop="productDrawingNo" label="品名规格" width="180" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="remark" label="备注" min-width="200" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id,)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="download(scope.row.id)">
                      下载检验报告
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
              <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id,)" style=" color: #ff3a3a">删除</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="query.pageNum" :background="background" :limit.sync="query.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { delbimInspectionType, getbimInspectionType, exportInspection } from '@/api/basicData/index'
import DepForm from './depForm'
import moment from 'moment'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'quality',
  components: { DepForm, SuperQuery },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'productCategoryCode',
          label: '产品分类编码',
          type: 'input'
        },
        {
          prop: 'productCategoryName',
          label: '产品分类名称',
          type: 'input'
        },

        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
   
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        },
      ],
      columnList: ["partnerCode", "productCode", "productName", "createByName"],
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [],
      query: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
        name: "",
        code: "",
        inspectionCategory: ""
      },
      listLoading: false,
      total: 0,
      formVisible: false,
      inspectionTypeList: [
        { label: "通用检验", value: 'common' },
        { label: "按产品分类检验", value: 'product_category' },
        { label: '按产品检验', value: 'product' }
      ],
      inspectionCategoryList: [
        { label: '采购收货检验', value: 'procure' },
        { label: '外协收货检验', value: 'external' },
        { label: '销售退货检验', value: 'sale_back' },
        { label: '外协退料检验', value: 'back_material' },
        { label: '生产退料检验', value: 'produce' },
        { label: '生产巡检', value: 'process' },
        { label: '生产完工检验', value: 'finished' }
      ]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },

    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.query.orderItems[0].asc = order === 'ascending'
      this.query.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    download(id) {
      exportInspection(id).then(res => {
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      Object.keys(this.query).forEach(key => {
        let item = this.query[key]
        this.query[key] = typeof item === 'string' ? item.trim() : item
      })
      getbimInspectionType(this.query).then(res => {
        this.tableDataList = res.data.records
        this.listLoading = false
        this.total = res.data.total
        this.visible = false
      }).catch(() => {
        this.listLoading = false
        this.visible = false
      })
    },
    search() {
      this.query.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.query = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }
        ],
        name: "",
        code: "",
        inspectionCategory: ""
      }
      this.search()
    },
    addSupplier() {

      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init()
      })
    },
    addOrUpdateHandle(id, btnType) {

      this.depFormVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, btnType)
        })
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delbimInspectionType(id).then(res => {
          if (res.msg === 'Success') {
            this.initData()
          }
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, btnType)
      })
    },
    inspectionCategoryFormat(val) {
      let target = this.inspectionCategoryList.find(item => item.value === val)
      return target ? target.label : val
    }
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
</style>