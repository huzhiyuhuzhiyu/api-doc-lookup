<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>产品分类</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="reset()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i
              :class="[data.childrenList && data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入业务编码" clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.classAttribute" placeholder="请选择类型" clearable>
                <el-option v-for="item in businessOptions" :key="item.enCode" :label="item.fullName"
                  :value="item.enCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">{{ $t("common.search")
              }}</el-button>
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
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          ref="dataTable">
          <el-table-column prop="code" label="编排编码" fixed="left" min-width="180" sortable="custom" />
          <el-table-column prop="name" label="编排名称" fixed="left" min-width="180" sortable="custom" />
          <el-table-column prop="classAttributeText" label="类型" min-width="220" sortable="custom" />
          <el-table-column prop="businessCategoryText" label="所属分类" min-width="220" sortable="custom" />
          <el-table-column prop="businessCode" label="业务名称" width="180" sortable="custom" />
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
import { getArrange, deleteArrange } from "@/api/basicData/materialSettings";
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import JNPFForm from "./Form";
export default {
  components: { JNPFForm },
  data() {
    return {
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {
        businessCode: "product",
        classAttribute: "",
        name: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20
      },

      total: 0,
      formVisible: false,
      // 业务类型
      businessOptions: [
        { fullName: "物料", enCode: "material" },
        { fullName: "其他 ", enCode: "other" }
      ],
      treeLoading: true,
      treeData: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      expands: true,
      refreshTree: true,
    };
  },
  created() {
    this.initData();
    this.getcategoryTree()
    this.getBusinessOptions()
  },
  methods: {
    // 获取业务类型
    getBusinessOptions() {
      // getDictionaryDataList("430351197057058245").then(res => {
      //   this.businessOptions = res.data.list
      // })
      this.businessOptions = [
        { fullName: "物料", enCode: "material" },
        { fullName: "其他 ", enCode: "other" }
      ]
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === "ascending"
      if (newProp === "class_attribute_text") { newProp = "baa.class_attribute" }
      this.listQuery.orderItems[0].column = order === null ? "" : newProp;
      this.initData();
    },
    initData() {
      this.listLoading = true;
      getArrange(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records;
          this.tableData.forEach(row => {
            row.businessCode = '产品'
          })
          this.total = res.data.total;
          this.listLoading = false;
          this.treeLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.treeLoading = false;
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
      if (isrRefresh) this.initData();
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = {
        businessCode: "product",
        classAttribute: "",
        name: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20
      };
      // this.initData();
      this.getcategoryTree()
    },
    addOrUpdateHandle(id) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, this.businessOptions);
      });
    },
    handleDel(id) {
      this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
        type: "warning",
      })
        .then(() => {
          deleteArrange(id).then((res) => {
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
    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      let methodArr = [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
        { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ]
      this.$nextTick(() => {
        let tempTreeData = methodArr
        let successTotal = 0
        methodArr.forEach((item, index) => {
          item.method(item.requestObj).then(res => {
            if (Array.isArray(res.data)) {
              tempTreeData[index] = {
                id: item.label,
                name: item.label,
                classAttribute: item.classAttribute,
                childrenList: res.data
              }
            } else {
              tempTreeData[index] = {
                id: item.label,
                name: item.label,
                classAttribute: item.classAttribute,
                childrenList: res.data.records
              }
            }
            if ((++successTotal) === methodArr.length) {
              this.treeData = tempTreeData
              this.initData()
            }
          })
        })
      })
    },

    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => { this.refreshTree = true })
    },

    handleNodeClick(data, node) {
      if (this.listQuery.businessCategoryId === data.id) return
      this.listQuery.businessCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      this.listQuery.classAttribute = data.classAttribute
      this.search()
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
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

