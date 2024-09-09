<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.name" placeholder="仓库名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.code" placeholder="仓库编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="type">
              <el-select v-model="form.type" placeholder="类型" style="width: 100%;">
                <el-option v-for="(item, index) in typeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addWarehouse('', '', 'add')" />
          <div class="JNPF-common-head-right">
            <!-- <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip> -->
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
        <JNPF-table ref="tabForm" v-loading="listLoading" :data="treeList" row-key="id" v-if="refreshTable"
          :fixedNO="true" custom-column :default-expand-all="expands"
          :tree-props="{ children: 'childrenList', hasChildren: '' }" :setColumnDisplayList="columnList">
          <el-table-column prop="name" label="仓库名称" min-width="200" />
          <el-table-column prop="code" label="仓库编码" show-overflow-tooltip min-width="160">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, scope.row.warehouseId, 'look')">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="image" label="二维码" align="center" width="100" height="50">
            <template slot-scope="scope">
              <el-popover placement="top-start" trigger="click">
                <!--trigger属性值：hover、click、focus 和 manual-->
                <a :href="scope.row.image" target="_blank" title="查看最大化图片">
                  <vue-qr :ref="'ref' + scope.row.id" :size="80" :margin="0" :auto-color="true" :dot-scale="1"
                    :text="scope.row.code" />
                </a>
                <img slot="reference" :src="scope.row.image" style="width: 50px;height: 50px; cursor:pointer" />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" min-width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 'enable'">启用</div>
              <div v-if="scope.row.state == 'disabled'">禁用</div>
            </template>
          </el-table-column>
          <el-table-column prop="position" label="位置" min-width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
          <el-table-column label="操作" width="260" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.parentId, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)">
                <el-button v-if="scope.row.state == 'disabled'" type="text" size="mini"
                  @click="onHandle(scope.row, 'enable')">
                  开启仓库
                </el-button>
                <el-button v-else type="text" size="mini" @click="offHandle(scope.row, 'disabled')">
                  禁用仓库
                </el-button>
                <el-button type="text" size="mini"
                  @click="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'look')">
                  查看详情
                </el-button>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getWarehouseList, deleteWarehouse, BuildQRCode, editWarehouseState } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import Form from './Form'
import VueQr from 'vue-qr'
export default {
  name: 'warehouseArchives',
  components: { Form, SuperQuery, VueQr },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'name',
          label: '仓库名称',
          type: 'input'
        },
        {
          prop: 'code',
          label: '仓库编码',
          type: 'input'
        },

        {
          prop: 'position',
          label: '位置',
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
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ],
      columnList: ['position', 'remark'],
      listQuery: {
        keyword: '',
        type: ''
      },
      typeList: [
        { label: '正常仓库', value: 'normal' },
        { label: '中转仓库', value: 'temp' },
        { label: '不良品仓库', value: 'unqualified' },
        { label: '报废仓库', value: 'scrap' },
        { label: '虚拟仓库', value: 'virtually' },
        { label: '线边仓库', value: 'line_edge' }
      ],
      treeList: [],
      expands: true,
      refreshTable: true,
      btnLoading: false,
      listLoading: true,
      formVisible: false,
      depFormVisible: false,

      form: {
        code: '',
        name: '',
        type: '',
        category: 'warehouse',
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ]
      }
    }
  },
  created() {
    this.initData()
    // this.buildQRCode()
  },
  methods: {
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    buildQRCode() {
      BuildQRCode().then((res) => {
        console.log(res, 'res')
      })
    },
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    initData() {
      this.loading = true
      getWarehouseList(this.form)
        .then((res) => {
          this.treeList = res.data
          if (this.treeList.length > 0) this.setTableIndex(this.treeList)
          this.listLoading = false
          this.btnLoading = false
        })
        .catch(() => {
          this.listLoading = false
          this.btnLoading = false
        })
    },
    search() {
      this.initData()
      // this.buildQRCode()
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        item.index = key + 1
        item.image = require('@/assets/images/scanCode.svg')
        if (index) {
          item.index = index + 1
        }
        if (item.childrenList.length > 0) {
          this.setTableIndex(item.childrenList, item.index)
        }
      })
    },
    reset() {
      this.listQuery.keyword = ''
      this.form.name = ''
      this.form.code = ''
      this.form.type = ''
      this.initData()
    },
    addOrUpdateHandle(id, parentId, type) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, parentId, type)
        })
        // }, 600);
      }
    },
    onHandle(row, state) {
      row.state = state
      editWarehouseState(row).then((res) => {
        this.initData()
        this.$message({
          type: 'success',
          message: '开启成功',
          duration: 1500
        })
      })
    },
    offHandle(row, state) {
      row.state = state
      editWarehouseState(row).then((res) => {
        this.initData()
        this.$message({
          type: 'success',
          message: '禁用成功',
          duration: 1500
        })
      })
    },
    addWarehouse(id, parentId, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, type)
      })
    },
    handleUserRelation(id, parentId, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, type)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    toggleExpand() {
      this.refreshTable = false
      this.expands = !this.expands
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteWarehouse(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-icon {
  vertical-align: bottom;
  font-size: 16px;
  margin-right: 6px;
  line-height: 23px;
}

.JNPF-common-head {
  padding: 8px !important;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0 !important;
  margin-left: 0 !important;
}
</style>
