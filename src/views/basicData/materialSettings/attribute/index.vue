<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入属性编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="请输入属性名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.type" placeholder="请选择属性类型" clearable>
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t("common.search") }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="moreQueries()">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <topOpts @add="addOrUpdateHandle()" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column ref="dataTable">
          <el-table-column prop="code" label="属性编码" width="220" fixed="left" sortable="custom" />
          <el-table-column prop="name" label="属性名称" width="220" fixed="left" sortable="custom" />
          <el-table-column prop="typeName" label="属性类型" width="220" />
          <el-table-column prop="attributeItemName" label="选择项名称" min-width="180" />
          <el-table-column prop="attributeItemVal" label="选择项值" min-width="180" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)"></tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
    <!-- <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" /> -->
  </div>
</template>

<script>
import { getattribute, deleteattribute } from "@/api/basicData/materialSettings";
import JNPFForm from "./Form";
export default {
  components: { JNPFForm },
  data() {
    return {
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {
        businessCode: "product", // 业务编码
        name: "", // 属性名称
        code: "", // 属性编码
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
        type: "",
      },

      total: 0,
      formVisible: false,
      typeList: [{
        label: "文本",
        value: "text",
      }, {
        label: "下拉选",
        value: "select",
      }, {
        label: "复选项",
        value: "multiple",
      }]
    };
  },
  created() {
    this.initData();
  },
  methods: {
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp;
      this.initData();
    },
    initData() {
      this.listLoading = true;
      getattribute(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records;
          this.tableData.forEach(item => {
            item.typeName = item.type === "text" ? "文本" : item.type === "select" ? "下拉选" : "复选项"
          })
          this.total = res.data.total;
          this.listLoading = false;
          // this.visible = false
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData();
    },
    refresh(isrRefresh) {
      this.formVisible = false;
      if (isrRefresh) this.reset();
    },
    reset() {
    this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = {
        businessCode: "product", // 业务编码
        name: "", // 属性名称
        code: "", // 属性编码
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
        type: "",
      };
      this.initData();
    },
    addOrUpdateHandle(id) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, this.tableData);
      });
    },
    handleDel(id) {
      this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
        type: "warning",
      })
        .then(() => {
          deleteattribute(id).then((res) => {
            if (res.msg === "Success") {
              this.initData();
              this.$message({
                type: "success",
                message: "删除成功",
                duration: 1500
              });
            }
          });
        })
        .catch(() => { });
    },
  },
};
</script>
<style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

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
</style>

