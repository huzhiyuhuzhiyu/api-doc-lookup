<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent >
          <el-col :span="6">
            <el-form-item>
              <el-input @keyup.native.enter="search()"  v-model="listQuery.code" placeholder="请输入业务编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input @keyup.native.enter="search()"  v-model="listQuery.name" placeholder="请输入业务名称" clearable />
            </el-form-item>
          </el-col>


          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t("common.search") }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}
              </el-button>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle('', '', 'add')" :isJudgePer="true" :addPerCode="'btn_add'" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="展开" placement="top">
              <el-link v-show="!expands" type="text" icon="icon-ym icon-ym-btn-expand JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="折叠" placement="top">
              <el-link v-show="expands" type="text" icon="icon-ym icon-ym-btn-collapse JNPF-common-head-icon"
                :underline="false" @click="toggleExpand()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="treeList" :row-key="'id'" v-if="refreshTable" fixedNO
          :default-expand-all="expands" :tree-props="{ children: 'childrenList', hasChildren: '' }" ref="dataTable"
          custom-column>
          <el-table-column prop="name" label="分类名称" min-width="200">
            <template slot-scope="scope">
              <i :class="[
                scope.row.childrenList.length >= 1
                  ? 'icon-ym icon-ym-tree-organization3'
                  : 'icon-ym icon-ym-systemForm',
              ]"></i>
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="分类编码" min-width="120" />
          <el-table-column prop="parentName" label="上级分类" min-width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="remark" label="备注" min-width="160" />

          <el-table-column label="操作" width="100" >
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                @edit="addOrUpdateHandle(scope.row.id, scope.row.parentId, 'edit')"
                @del="handleDel(scope.row.id, scope.row.parentId)" 
                :delDisabled="scope.row.childrenList.length>0?true:false"
                >

              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
  </div>
</template>

<script>
import {
  checkBusinessListCategoryCode, detailBusinessListCategoryAPI, delBusinessListCategoryAPI, editBusinessListCategoryAPI, addBusinessListCategoryAPI, getBusinessListCategoryAPI
} from "@/api/masterDataManagement/index.js";
import DepForm from "./depForm";
export default {
  components: { DepForm },
  data() {
    return {
      getBusinessListCategoryAPI,
      listQuery: {
        code: "",
        name: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ], 
      },
      treeList: [],
      treeDataAll: [],
      expands: true,
      refreshTable: true,
      btnLoading: false,
      listLoading: true,
      depFormVisible: false,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    columnSetFun(){ 
      this.$refs.dataTable.showDrawer()
    },
    initData() {
      this.loading = true;
      getBusinessListCategoryAPI(this.listQuery)
        .then((res) => {
          this.treeList = res.data;
          if (this.treeList.length > 0) this.setTableIndex(this.treeList);
          this.listLoading = false;
          this.btnLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.btnLoading = false;
        });
    },
    search() {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key];
        this.listQuery[key] = typeof item === "string" ? item.trim() : item;
      }); 
      this.initData();
    },
    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        item.index = key + 1;
        if (index) {
          item.index = index + 1;
        }
        if (item.childrenList.length > 0) {
          item.hasChildren = true;
          this.setTableIndex(item.childrenList, item.index);
        }
      });
    },
    reset() {
      this.$refs["dataTable"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮
      this.listQuery = { 
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ], 
      };

      this.initData();
    },
    addOrUpdateHandle(id, parentId, type) {
      this.addOrUpdateDep(id, parentId, type);
    },
    addOrUpdateDep(id, parentId, type) {
      this.depFormVisible = true;
      this.$nextTick(() => {
        this.$refs.depForm.init(id, parentId, type);
      });
    },
    closeDepForm(isRefresh) {
      this.depFormVisible = false;
      if (isRefresh) {
        this.keyword = "";
        this.initData();
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
      this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
        type: "warning",
      })
        .then(() => {
          delBusinessListCategoryAPI(id).then((res) => {
            if (res.msg === "Success") {
              this.initData();
              this.$message({
                type: "success",
                message: "删除成功",
                duration: 1500,
              });
            }
          });
        })
        .catch(() => { });
    },
  },
};
</script>
<style lang="scss" scoped>
.table-icon {
  vertical-align: bottom;
  font-size: 16px;
  margin-right: 6px;
  line-height: 23px;
}
</style>
