<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.name" placeholder="请输入仓库名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.code" placeholder="请输入仓库编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%;">
                <el-option v-for="(item, index) in typeList" :key="index" :label="item.label"
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
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addWarehouse('','','add')" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="treeList" row-key="id" v-if="refreshTable" :fixedNO="true"
          custom-column :default-expand-all="expands" :tree-props="{ children: 'childrenList', hasChildren: '' }">
          <el-table-column prop="name" label="仓库名称" fixed="left" min-width="200" />
          <el-table-column prop="code" label="仓库编码" show-overflow-tooltip min-width="160">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, scope.row.warehouseId, 'look')">{{
                scope.row.code
              }}</el-link>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="typeName" label="类型" width="120"></el-table-column> -->
          <el-table-column prop="position" label="位置" min-width="120"></el-table-column>
          <el-table-column prop="goodsShelvesNum" label="货架数" width="100" />
          <el-table-column prop="goodsAllocationNum" label="库位数" width="100" />
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"> </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">

              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.parentId,'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="handleUserRelation(scope.row.id, scope.row.partnerCategoryId, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />

  </div>
</template>

<script>
import { getWarehouseList, deleteWarehouse } from '@/api/basicData/index'

import Form from './Form'
export default {
  name: 'warehouseArchives',
  components: { Form },
  data() {
    return {
      listQuery: {
        keyword: '',
        type: ""
      },
      typeList: [{ label: "正常仓库", value: "normal" }, { label: "中转仓库", value: "temp" },{ label: "不良品仓库", value: "unqualified" },{ label: "报废", value: "scrap" }],
      treeList: [],
      expands: true,
      refreshTable: true,
      btnLoading: false,
      listLoading: true,
      formVisible: false,
      depFormVisible: false,
 
      form: {
        code: "",
        name: "",
        type: "",
        category:"warehouse",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.loading = true
      getWarehouseList(this.form).then(res => {
        console.log("树形", res);
        this.treeList = res.data
        if (this.treeList.length > 0) this.setTableIndex(this.treeList);
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    search() {
      this.initData()
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      console.log("arr", arr, index);
      arr.forEach((item, key) => {
        item.index = key + 1;
        if (index) {
          item.index = index + 1;
        }
        if (item.childrenList.length > 0) {
          this.setTableIndex(item.childrenList, item.index);
        }
      });
    },
    reset() {
      this.listQuery.keyword = ''
      this.form.name = ""
      this.form.code = ""
      this.form.type=""
      this.initData()
    },
    addOrUpdateHandle(id, parentId, type) {
      console.log("121342134", id, parentId);
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, parentId, type)
        })
        // }, 600);
      }
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
      this.refreshTable = false;
      this.expands = !this.expands;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteWarehouse(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
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
</style>