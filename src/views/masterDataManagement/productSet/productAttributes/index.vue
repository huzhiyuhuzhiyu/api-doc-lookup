<template>
  <div class="JNPF-common-layout">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%;background-color: #fff;">
        <el-tab-pane label="供应商页面" name="supplierPage" style="margin-bottom: 5px;height: 100%;">
          <div class="JNPF-common-layout"> -->
    <div class="JNPF-common-layout-left">


      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="code" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">

            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent :rules="rules">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.code" placeholder="请输入编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="form.name" placeholder="请输入名称" clearable />
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
        <div class="JNPF-common-head" style="padding: 10px">
          <topOpts @add="addSupplier()" :isJudgePer="true" :addPerCode="'btn_add'" />
       
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" highlight-current-row :data="tableData" custom-column>
          <el-table-column prop="code" label="编码"> </el-table-column>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'" @edit="addOrUpdateHandle(scope.row.id,)" @del="handleDel(scope.row.id)"> </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>

<script>
import {
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delBimProductAttributes,
  addBimProductAttributes,
  getbimProductAttributesList,
} from "@/api/masterDataManagement/index";
import Form from "./Form";
import moment from "moment";

export default {
  name: "supplierProfile",
  components: { Form },
  data() {
    return {
      title: "更多查询",
      background: true, //分页器背景颜色
      activeName: "supplierPage",
      visible: false,
      treeData: [
        {
          name: '游隙',
          code: 'pa001',
        },
        {
          name: '油脂',
          code: 'pa002',
        },
        {
          name: '油脂量',
          code: 'pa003',
        },
        {
          name: '保持架',
          code: 'pa004',
        },
        {
          name: '振动等级',
          code: 'pa005',
        },
        {
          name: '精度等级',
          code: 'pa006',
        },
        {
          name: '打字内容',
          code: 'pa007',
        },
        {
          name: '规值',
          code: 'pa008',
        },
        {
          name: '孔径',
          code: 'pa009',
        },
        {
          name: '颜色',
          code: 'pa010',
        },
        {
          name: '品牌',
          code: 'pa011',
        },
        {
          name: '密封盖',
          code: 'pa012',
        },

        {
          name: '结构类型',
          code: 'pa013',
        },
        {
          name: '噪音',
          code: 'pa014',
        },

      ],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      form: {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        typeCode:"",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      },

      gradeList: [],
      defaultProps: {
        children: "childrenList",
        label: "name",
      },
      rules:{
        code:[
          {}
        ]
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  created() {
    this.$nextTick(()=>{
      this.$refs.treeBox.setCurrentKey(this.treeData[0].code) // 默认选中节点第一个
      this.form.typeCode=this.treeData[0].code
    })
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {



    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false;
      if (isRefresh) {
        this.keyword = "";
        this.initData();
      }
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },


    initData() {
      console.log(this.form);
      this.listLoading = true; 
      getbimProductAttributesList(this.form)
        .then((res) => {
          console.log("res++", res);
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.listLoading = false;
          this.visible = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    search() {

      this.form.pageNum = 1;
      this.initData();
    },
    reset() {
      this.$refs["dataTable"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮
      
      this.form = {
        code:'' ,
        name: "",
        typeCode:this.treeData[0].code,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };

      // this.search()
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      this.form.typeCode = node.data.code
      this.search();
    },
  
    addSupplier() {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init(this.form.typeCode,'add');
      });
    },
    addOrUpdateHandle(id ) { 
      this.formVisible = true;
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id,'edit');
        });
        // }, 600);
      }
    },

    handleDel(id) {
      this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
        type: "warning",
      })
        .then(() => {
          delBimProductAttributes(id).then((res) => {
            this.initData();
            this.$message({
              type: "success",
              message: "删除成功",
              duration: 1500,
            });
          });
        })
        .catch(() => { });
    },
    handleUserRelation(id, parentId, btnType) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, btnType);
      });
    },
  },
};
</script>
<style scoped>
.JNPF-common-layout-left {
  /* margin-right: 0; */
  /* border-right: 1px solid #cacaca; */
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
}

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
  height: 40px !important;
  line-height: 40px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>