<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-date-picker
                  v-model="listQuery.month"
                  type="month"
                  value-format="yyyy-MM"
                  style="width: 100%"
                  :clearable="false"
                  placeholder="请选择月份"
                  popper-class="date_form"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="search()"
                >
                  {{ $t("common.search") }}</el-button
                >
                <el-button
                  size="mini"
                  icon="el-icon-refresh-right"
                  @click="reset()"
                  >{{ $t("common.reset") }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table
            ref="dataTable"
            v-loading="listLoading"
            :data="tableData"
            :fixedNO="true"
         
            custom-column
          >
            <el-table-column prop="producerJobNumber" label="生产人工号" />
            <el-table-column prop="producerName" label="生产人">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  @click.native="addOrUpdateHandle(scope.row.producerId,listQuery.month)"
                  >{{ scope.row.producerName }}</el-link
                >
              </template>
            </el-table-column>
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="wages" label="工资" sortable="custom" />
            <el-table-column prop="state" label="工资状态">
              <template slot-scope="scope">
                <div v-for="(item, index) in stateList" :key="index">
                  <span
                    v-if="item.value === scope.row.state"
                    :style="scope.row.state == 1 ? 'color:red' : ''"
                    >{{ item.label }}</span
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="addOrUpdateHandle(scope.row.producerId,listQuery.month)"
                  >查看明细</el-button
                >
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination
            :total="total"
            :page.sync="listQuery.pageNum"
            :limit.sync="listQuery.pageSize"
            @pagination="initData"
          >
          </pagination>
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm"  />
  </div>
</template>
  
  <script>
import { getSalaryList } from "@/api/salaryManagement";
import { mapGetters } from "vuex"
import Form from "./Form";
export default {
  name: "carrierProfile",
  components: { Form },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() { 

    return {
      formVisible: false,
      total: 0,
      stateList: [
        { value: "", label: "所有" },
        { value: 0, label: "正常" },
        { value: 1, label: "异常" },
      ],
      initListQuery: {
        month: this.jnpf.getToday("YYYY-MM"),
        producerName: "",
        producerJobNumber: "",
        my:1,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
        ],
      },
      producerId:"",
      listLoading: false,
      tableData: [],
      title: "更多查询",
      producerIdList: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },

  created() {
    console.log("'userInfo",this.userInfo);
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
    this.initData();
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp;
      if (prop === "wages") {
        newProp = prop;
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());
      }

      this.listQuery.orderItems[0].asc = order === "ascending";
      this.listQuery.orderItems[0].column = order === null ? "" : newProp;
      this.initData();
    },

    dataFormSubmit() {
      this.listQuery.pageNum = 1;
      Object.keys(this.listQuery).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.listQuery[key];
        this.listQuery[key] = typeof item === "string" ? item.trim() : item;
      });
      this.initData();
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false;
      if (isRefresh) {
        this.keyword = "";
        this.initData();
      }
    },
    initData() {
      this.listLoading = true;
      this.listQuery.producerName=this.userInfo.userName
      this.listQuery.producerId=this.userInfo.userId
      getSalaryList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    search() {
      this.dataFormSubmit();
    },

    reset() {
      this.$refs["dataTable"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮

      this.listQuery = {
        month: this.jnpf.getToday("YYYY-MM"),
        producerName: "",
        producerJobNumber: "",
        pageNum: 1,
        producerId:"",
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
        ],
      };

      this.search();
    },

    addOrUpdateHandle(id,month) {
      this.formVisible = true;
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id,month);
        });
        // }, 600);
      }
    },
    handleUserRelation(id) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init(id);
      });
    },
  },
};
</script>
  <style  scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-head {
  padding: 10px;
}

.JNPF-common-search-box {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}
::v-deep .JNPF-preview-main .JNPF-common-search-box{
  padding-top: 4px;
}
</style>
  
  