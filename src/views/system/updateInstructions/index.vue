<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="8">
            <el-form-item label="更新时间">
              <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期"
                value-format="yyyy-MM-dd" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="更新内容">
              <el-input v-model="listQuery.updateContent" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">
                {{ $t("common.search") }}</el-button>
              <el-button icon="el-icon-refresh-right" size="mini" @click="reset()">{{ $t("common.reset") }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle()" addText="新建"></topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" ref="tabForm">
          <el-table-column prop="updateContent" label="更新内容" show-overflow-tooltip min-width="150" />
          <el-table-column prop="updateDate" label="更新时间" width="200" />
          <el-table-column prop="createBy" label="创建人" width="100" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.$index, scope.row.id)">
                <el-button size="mini" type="text" @click.native="view(scope.row.id)">
                  详情
                </el-button>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
        <Form v-show="formVisible" ref="Form" @close="closeForm" />
        <Detail v-show="detailVisible" ref="Detail" @close="closeDetail" />
      </div>
    </div>
  </div>
</template>

<script>
import { deleteInstructionsList, detailInstructionsList, editInstructionsList, addInstructionsList, getInstructionsList } from '@/api/masterDataManagement/index.js'

import Form from "./Form";
import Detail from "./Detail";
export default {
  components: { Form, Detail },
  data() {
    return {
      keyword: "",
      list: [],
      total: 0,
      time: "",
      listLoading: true,
      listQuery: {
        updateContent: "",
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: ""
      },
      formVisible: false,
      detailVisible: false
    };
  },
  created() {
    this.initData();
  },
  methods: {
    columnSetFun() {
      this.$refs.tabForm.showDrawer()
    },
    search() {
      if (this.time) {
        this.listQuery.startUpdateTime = this.time[0] + ' 00:00:00';
        this.listQuery.endUpdateTime = this.time[1] + ' 23:59:59';
      } else {
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
      this.initData();
    },
    reset() {
      this.time = "";
      this.listQuery = {
        updateContent: ""
      };
      this.search();
    },
    initData() {
      this.listLoading = true;
      let query = {
        ...this.listQuery,
        keyword: this.keyword
      };
      getInstructionsList(query).then(res => {
        this.list = res.data.records
        console.log(res.data)
        this.total = res.data.total;
        this.listLoading = false;
      });
    },
    handleDel(index, id) {
      this.$confirm(
        this.$t("common.delTip"),
        this.$t("common.tipTitle"),
        {
          type: "warning"
        }
      )
        .then(() => {
          Delete(id).then(res => {
            this.list.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功"
            });
          });
        })
        .catch(() => { });
    },
    view(id) {
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs.Detail.init(id);
      });
    },

    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init(id);
      });
    },
    closeForm(isRefresh) {
      this.formVisible = false;
      if (isRefresh) {
        this.keyword = "";
        this.listQuery = {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: ""
        };
        this.initData();
      }
    },
    closeDetail(isRefresh) {
      this.detailVisible = false;
      if (isRefresh) {
        this.keyword = "";
        this.listQuery = {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: ""
        };
        this.initData();
      }
    }
  }
};
</script>
